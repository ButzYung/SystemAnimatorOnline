#define MMD
uniform vec3 diffuse;uniform float opacity;uniform vec3 ambient;uniform vec3 emissive;uniform vec3 specular;uniform float shininess;
#ifdef USE_COLOR
varying vec3 vColor;
#endif
#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP )
varying vec2 vUv;
#endif
#ifdef USE_MAP
uniform sampler2D map;
#endif
#ifdef USE_LIGHTMAP
varying vec2 vUv2;uniform sampler2D lightMap;
#endif
#ifdef USE_ENVMAP
uniform float reflectivity;uniform samplerCube envMap;uniform float flipEnvMap;uniform int combine;
#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP )
uniform bool useRefract;uniform float refractionRatio;
#else
varying vec3 vReflect;
#endif
#endif
#ifdef USE_FOG
uniform vec3 fogColor;
#ifdef FOG_EXP2
uniform float fogDensity;
#else
uniform float fogNear;uniform float fogFar;
#endif
#endif
uniform vec3 ambientLightColor;
#if MAX_DIR_LIGHTS > 0
uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];
#endif
#if MAX_HEMI_LIGHTS > 0
uniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];uniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];uniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];
#endif
#if MAX_POINT_LIGHTS > 0
uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];
#ifdef PHONG_PER_PIXEL
uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];uniform float pointLightDistance[ MAX_POINT_LIGHTS ];
#else
varying vec4 vPointLight[ MAX_POINT_LIGHTS ];
#endif
#endif
#if MAX_SPOT_LIGHTS > 0
uniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];uniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];uniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];uniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];uniform float spotLightExponent[ MAX_SPOT_LIGHTS ];
#ifdef PHONG_PER_PIXEL
uniform float spotLightDistance[ MAX_SPOT_LIGHTS ];
#else
varying vec4 vSpotLight[ MAX_SPOT_LIGHTS ];
#endif
#endif
#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP )
varying vec3 vWorldPosition;
#endif
#ifdef WRAP_AROUND
uniform vec3 wrapRGB;
#endif
varying vec3 vViewPosition;varying vec3 vNormal;
#ifdef USE_SHADOWMAP
uniform sampler2D shadowMap[ MAX_SHADOWS ];uniform vec2 shadowMapSize[ MAX_SHADOWS ];uniform float shadowDarkness[ MAX_SHADOWS ];uniform float shadowBias[ MAX_SHADOWS ];varying vec4 vShadowCoord[ MAX_SHADOWS ];float unpackDepth( const in vec4 rgba_depth ) {const vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );float depth = dot( rgba_depth, bit_shift );return depth;}
#endif
#ifdef USE_BUMPMAP
uniform sampler2D bumpMap;uniform float bumpScale;vec2 dHdxy_fwd() {vec2 dSTdx = dFdx( vUv );vec2 dSTdy = dFdy( vUv );float Hll = bumpScale * texture2D( bumpMap, vUv ).x;float dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;float dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;return vec2( dBx, dBy );}vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ) {vec3 vSigmaX = dFdx( surf_pos );vec3 vSigmaY = dFdy( surf_pos );vec3 vN = surf_norm;vec3 R1 = cross( vSigmaY, vN );vec3 R2 = cross( vN, vSigmaX );float fDet = dot( vSigmaX, R1 );vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );return normalize( abs( fDet ) * surf_norm - vGrad );}
#endif
#ifdef USE_NORMALMAP
uniform sampler2D normalMap;uniform vec2 normalScale;vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {vec3 q0 = dFdx( eye_pos.xyz );vec3 q1 = dFdy( eye_pos.xyz );vec2 st0 = dFdx( vUv.st );vec2 st1 = dFdy( vUv.st );vec3 S = normalize(  q0 * st1.t - q1 * st0.t );vec3 T = normalize( -q0 * st1.s + q1 * st0.s );vec3 N = normalize( surf_norm );vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;mapN.xy = normalScale * mapN.xy;mat3 tsn = mat3( S, T, N );return normalize( tsn * mapN );}
#endif
#ifdef USE_SPECULARMAP
uniform sampler2D specularMap;
#endif
#ifdef MMD
uniform float mmdEdgeThick;uniform vec4 mmdEdgeColor;uniform float mmdShadowDark;
#endif
#ifdef MMD_TOONMAP
uniform sampler2D mmdToonMap;
#endif
#ifdef MMD_SPHEREMAP
varying vec2 vUvSphere;uniform sampler2D mmdSphereMap;
#endif

void main() {
#ifdef MMD
if (mmdEdgeThick > 0.0) {gl_FragColor = mmdEdgeColor;} else {
#endif
gl_FragColor = vec4( vec3 ( 1.0 ), opacity );vec4 texelColor;
#ifdef USE_MAP
texelColor = texture2D( map, vUv );
#ifdef GAMMA_INPUT
texelColor.xyz *= texelColor.xyz;
#endif
gl_FragColor = gl_FragColor * texelColor;
#endif
#ifdef MMD_SPHEREMAP
texelColor = texture2D( mmdSphereMap, vUvSphere );
#ifdef GAMMA_INPUT
texelColor.xyz *= texelColor.xyz;
#endif
#if MMD_SPHEREMAP == 1
gl_FragColor = gl_FragColor * texelColor;
#else
gl_FragColor.xyz = gl_FragColor.xyz + texelColor.xyz;
#endif
#endif
#ifdef ALPHATEST
if ( gl_FragColor.a < ALPHATEST ) discard;
#endif
float specularStrength;
#ifdef USE_SPECULARMAP
vec4 texelSpecular = texture2D( specularMap, vUv );specularStrength = texelSpecular.r;
#else
specularStrength = 1.0;
#endif
vec3 normal = vNormal;vec3 viewPosition = normalize( vViewPosition );
#ifdef DOUBLE_SIDED
normal = normal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );
#endif
#ifdef USE_NORMALMAP
normal = perturbNormal2Arb( -vViewPosition, normal );
#elif defined( USE_BUMPMAP )
normal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );
#endif
vec3 totalDiffuse = vec3( 0.0 );vec3 totalSpecular = vec3( 0.0 );
#ifdef MMD
vec3 totalToon = vec3( 0.0 );
#endif
#if MAX_POINT_LIGHTS > 0
for ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {
#ifdef PHONG_PER_PIXEL
vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );vec3 lVector = lPosition.xyz + vViewPosition.xyz;float lDistance = 1.0;if ( pointLightDistance[ i ] > 0.0 )lDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );lVector = normalize( lVector );
#else
vec3 lVector = normalize( vPointLight[ i ].xyz );float lDistance = vPointLight[ i ].w;
#endif
float dotProduct = dot( normal, lVector );
#ifdef WRAP_AROUND
float pointDiffuseWeightFull = max( dotProduct, 0.0 );float pointDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );vec3 pointDiffuseWeight = mix( vec3 ( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );
#else
float pointDiffuseWeight = max( dotProduct, 0.0 );
#endif
#ifdef MMD
#ifdef MMD_TOONMAP
totalToon += texture2D( mmdToonMap, vec2( 0.0, 1.0 - ( 0.5 * dotProduct + 0.5 ) ) ).xyz;
#else
totalToon += vec3( 1.0 );
#endif
totalDiffuse  += diffuse * pointLightColor[ i ] * lDistance;
#else
totalDiffuse  += diffuse * pointLightColor[ i ] * pointDiffuseWeight * lDistance;
#endif
vec3 pointHalfVector = normalize( lVector + viewPosition );float pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );float pointSpecularWeight = specularStrength * pow( pointDotNormalHalf, shininess );
#ifdef PHYSICALLY_BASED_SHADING
float specularNormalization = ( shininess + 2.0001 ) / 8.0;vec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, pointHalfVector ), 5.0 );totalSpecular += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * lDistance * specularNormalization;
#else
totalSpecular += specular * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * lDistance;
#endif
}
#endif
#if MAX_SPOT_LIGHTS > 0
for ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {
#ifdef PHONG_PER_PIXEL
vec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );vec3 lVector = lPosition.xyz + vViewPosition.xyz;float lDistance = 1.0;if ( spotLightDistance[ i ] > 0.0 )lDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );lVector = normalize( lVector );
#else
vec3 lVector = normalize( vSpotLight[ i ].xyz );float lDistance = vSpotLight[ i ].w;
#endif
float spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );if ( spotEffect > spotLightAngleCos[ i ] ) {spotEffect = max( pow( spotEffect, spotLightExponent[ i ] ), 0.0 );float dotProduct = dot( normal, lVector );
#ifdef WRAP_AROUND
float spotDiffuseWeightFull = max( dotProduct, 0.0 );float spotDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );vec3 spotDiffuseWeight = mix( vec3 ( spotDiffuseWeightFull ), vec3( spotDiffuseWeightHalf ), wrapRGB );
#else
float spotDiffuseWeight = max( dotProduct, 0.0 );
#endif
#ifdef MMD
#ifdef MMD_TOONMAP
totalToon += texture2D( mmdToonMap, vec2( 0.0, 1.0 - ( 0.5 * dotProduct + 0.5 ) ) ).xyz;
#else
totalToon += vec3( 1.0 );
#endif
totalDiffuse += diffuse * spotLightColor[ i ] * lDistance * spotEffect;
#else
totalDiffuse += diffuse * spotLightColor[ i ] * spotDiffuseWeight * lDistance * spotEffect;
#endif
vec3 spotHalfVector = normalize( lVector + viewPosition );float spotDotNormalHalf = max( dot( normal, spotHalfVector ), 0.0 );float spotSpecularWeight = specularStrength * pow( spotDotNormalHalf, shininess );
#ifdef PHYSICALLY_BASED_SHADING
float specularNormalization = ( shininess + 2.0001 ) / 8.0;vec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, spotHalfVector ), 5.0 );totalSpecular += schlick * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * lDistance * specularNormalization * spotEffect;
#else
totalSpecular += specular * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * lDistance * spotEffect;
#endif
}}
#endif
#if MAX_DIR_LIGHTS > 0
for( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );vec3 dirVector = normalize( lDirection.xyz );float dotProduct = dot( normal, dirVector );
#ifdef WRAP_AROUND
float dirDiffuseWeightFull = max( dotProduct, 0.0 );float dirDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );vec3 dirDiffuseWeight = mix( vec3( dirDiffuseWeightFull ), vec3( dirDiffuseWeightHalf ), wrapRGB );
#else
float dirDiffuseWeight = max( dotProduct, 0.0 );
#endif
#ifdef MMD
#ifdef MMD_TOONMAP
totalToon += texture2D( mmdToonMap, vec2( 0.0, 1.0 - ( 0.5 * dotProduct + 0.5 ) ) ).xyz;
#else
totalToon += vec3( 1.0 );
#endif
totalDiffuse += diffuse * directionalLightColor[ i ];
#else
totalDiffuse += diffuse * directionalLightColor[ i ] * dirDiffuseWeight;
#endif
vec3 dirHalfVector = normalize( dirVector + viewPosition );float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );float dirSpecularWeight = specularStrength * pow( dirDotNormalHalf, shininess );
#ifdef PHYSICALLY_BASED_SHADING
float specularNormalization = ( shininess + 2.0001 ) / 8.0;vec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( dirVector, dirHalfVector ), 5.0 );totalSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;
#else
totalSpecular += specular * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight;
#endif
}
#endif
#if MAX_HEMI_LIGHTS > 0
for( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {vec4 lDirection = viewMatrix * vec4( hemisphereLightDirection[ i ], 0.0 );vec3 lVector = normalize( lDirection.xyz );float dotProduct = dot( normal, lVector );float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;
#ifdef MMD
#ifdef MMD_TOONMAP
totalToon += texture2D( mmdToonMap, vec2( 0.0, 1.0 - hemiDiffuseWeight ) ).xyz;
#else
totalToon += vec3( 1.0 );
#endif
#endif
vec3 hemiColor = mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );totalDiffuse += diffuse * hemiColor;vec3 hemiHalfVectorSky = normalize( lVector + viewPosition );float hemiDotNormalHalfSky = 0.5 * dot( normal, hemiHalfVectorSky ) + 0.5;float hemiSpecularWeightSky = specularStrength * pow( hemiDotNormalHalfSky, shininess );vec3 lVectorGround = -lVector;vec3 hemiHalfVectorGround = normalize( lVectorGround + viewPosition );float hemiDotNormalHalfGround = 0.5 * dot( normal, hemiHalfVectorGround ) + 0.5;float hemiSpecularWeightGround = specularStrength * pow( hemiDotNormalHalfGround, shininess );
#ifdef PHYSICALLY_BASED_SHADING
float dotProductGround = dot( normal, lVectorGround );float specularNormalization = ( shininess + 2.0001 ) / 8.0;vec3 schlickSky = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, hemiHalfVectorSky ), 5.0 );vec3 schlickGround = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVectorGround, hemiHalfVectorGround ), 5.0 );totalSpecular += hemiColor * specularNormalization * ( schlickSky * hemiSpecularWeightSky * max( dotProduct, 0.0 ) + schlickGround * hemiSpecularWeightGround * max( dotProductGround, 0.0 ) );
#else
totalSpecular += specular * hemiColor * ( hemiSpecularWeightSky + hemiSpecularWeightGround ) * hemiDiffuseWeight;
#endif
}
#endif
#ifdef MMD
totalSpecular = max( totalSpecular, 0.0 );
#endif
#ifdef METAL
gl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient + totalSpecular );
#else
gl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient ) + totalSpecular;
#endif
#ifdef MMD_TOONMAP
gl_FragColor.xyz *= totalToon;
#endif
#ifdef USE_LIGHTMAP
gl_FragColor = gl_FragColor * texture2D( lightMap, vUv2 );
#endif
#ifdef USE_COLOR
gl_FragColor = gl_FragColor * vec4( vColor, opacity );
#endif
#ifdef USE_ENVMAP
vec3 reflectVec;
#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP )
vec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );if ( useRefract ) {reflectVec = refract( cameraToVertex, normal, refractionRatio );} else {reflectVec = reflect( cameraToVertex, normal );}
#else
reflectVec = vReflect;
#endif
#ifdef DOUBLE_SIDED
float flipNormal = ( -1.0 + 2.0 * float( gl_FrontFacing ) );vec4 cubeColor = textureCube( envMap, flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
#else
vec4 cubeColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
#endif
#ifdef GAMMA_INPUT
cubeColor.xyz *= cubeColor.xyz;
#endif
if ( combine == 1 ) {gl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, specularStrength * reflectivity );} else if ( combine == 2 ) {gl_FragColor.xyz += cubeColor.xyz * specularStrength * reflectivity;} else {gl_FragColor.xyz = mix( gl_FragColor.xyz, gl_FragColor.xyz * cubeColor.xyz, specularStrength * reflectivity );}
#endif
#ifdef USE_SHADOWMAP
#ifdef MMD
if (mmdShadowDark > 0.0) {
#endif
#ifdef SHADOWMAP_DEBUG
vec3 frustumColors[3];frustumColors[0] = vec3( 1.0, 0.5, 0.0 );frustumColors[1] = vec3( 0.0, 1.0, 0.8 );frustumColors[2] = vec3( 0.0, 0.5, 1.0 );
#endif
#ifdef SHADOWMAP_CASCADE
int inFrustumCount = 0;
#endif
float fDepth;vec3 shadowColor = vec3( 1.0 );for( int i = 0; i < MAX_SHADOWS; i ++ ) {vec3 shadowCoord = vShadowCoord[ i ].xyz / vShadowCoord[ i ].w;bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );bool inFrustum = all( inFrustumVec );
#ifdef SHADOWMAP_CASCADE
inFrustumCount += int( inFrustum );bvec3 frustumTestVec = bvec3( inFrustum, inFrustumCount == 1, shadowCoord.z <= 1.0 );
#else
bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );
#endif
bool frustumTest = all( frustumTestVec );if ( frustumTest ) {shadowCoord.z += shadowBias[ i ];
#ifdef MMD
float darkness = mmdShadowDark;
#else
float darkness = shadowDarkness[ i ];
#endif
#if defined( SHADOWMAP_TYPE_PCF )
float shadow = 0.0;const float shadowDelta = 1.0 / 9.0;float xPixelOffset = 1.0 / shadowMapSize[ i ].x;float yPixelOffset = 1.0 / shadowMapSize[ i ].y;float dx0 = -1.25 * xPixelOffset;float dy0 = -1.25 * yPixelOffset;float dx1 = 1.25 * xPixelOffset;float dy1 = 1.25 * yPixelOffset;fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );if ( fDepth < shadowCoord.z ) shadow += shadowDelta;fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );if ( fDepth < shadowCoord.z ) shadow += shadowDelta;fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );if ( fDepth < shadowCoord.z ) shadow += shadowDelta;fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );if ( fDepth < shadowCoord.z ) shadow += shadowDelta;fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );if ( fDepth < shadowCoord.z ) shadow += shadowDelta;fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );if ( fDepth < shadowCoord.z ) shadow += shadowDelta;fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );if ( fDepth < shadowCoord.z ) shadow += shadowDelta;fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );if ( fDepth < shadowCoord.z ) shadow += shadowDelta;fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );if ( fDepth < shadowCoord.z ) shadow += shadowDelta;shadowColor = shadowColor * vec3( ( 1.0 - darkness * shadow ) );
#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
float shadow = 0.0;float xPixelOffset = 1.0 / shadowMapSize[ i ].x;float yPixelOffset = 1.0 / shadowMapSize[ i ].y;float dx0 = -1.0 * xPixelOffset;float dy0 = -1.0 * yPixelOffset;float dx1 = 1.0 * xPixelOffset;float dy1 = 1.0 * yPixelOffset;mat3 shadowKernel;mat3 depthKernel;depthKernel[0][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );depthKernel[0][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );depthKernel[0][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );depthKernel[1][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );depthKernel[1][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );depthKernel[1][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );depthKernel[2][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );depthKernel[2][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );depthKernel[2][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );vec3 shadowZ = vec3( shadowCoord.z );shadowKernel[0] = vec3(lessThan(depthKernel[0], shadowZ ));shadowKernel[0] *= vec3(0.25);shadowKernel[1] = vec3(lessThan(depthKernel[1], shadowZ ));shadowKernel[1] *= vec3(0.25);shadowKernel[2] = vec3(lessThan(depthKernel[2], shadowZ ));shadowKernel[2] *= vec3(0.25);vec2 fractionalCoord = 1.0 - fract( shadowCoord.xy * shadowMapSize[i].xy );shadowKernel[0] = mix( shadowKernel[1], shadowKernel[0], fractionalCoord.x );shadowKernel[1] = mix( shadowKernel[2], shadowKernel[1], fractionalCoord.x );vec4 shadowValues;shadowValues.x = mix( shadowKernel[0][1], shadowKernel[0][0], fractionalCoord.y );shadowValues.y = mix( shadowKernel[0][2], shadowKernel[0][1], fractionalCoord.y );shadowValues.z = mix( shadowKernel[1][1], shadowKernel[1][0], fractionalCoord.y );shadowValues.w = mix( shadowKernel[1][2], shadowKernel[1][1], fractionalCoord.y );shadow = dot( shadowValues, vec4( 1.0 ) );shadowColor = shadowColor * vec3( ( 1.0 - darkness * shadow ) );
#else
vec4 rgbaDepth = texture2D( shadowMap[ i ], shadowCoord.xy );float fDepth = unpackDepth( rgbaDepth );if ( fDepth < shadowCoord.z )shadowColor = shadowColor * vec3( 1.0 - darkness );
#endif
}
#ifdef SHADOWMAP_DEBUG
#ifdef SHADOWMAP_CASCADE
if ( inFrustum && inFrustumCount == 1 ) gl_FragColor.xyz *= frustumColors[ i ];
#else
if ( inFrustum ) gl_FragColor.xyz *= frustumColors[ i ];
#endif
#endif
}
#ifdef GAMMA_OUTPUT
shadowColor *= shadowColor;
#endif
gl_FragColor.xyz = gl_FragColor.xyz * shadowColor;
#ifdef MMD
}
#endif
#endif
#ifdef GAMMA_OUTPUT
gl_FragColor.xyz = sqrt( gl_FragColor.xyz );
#endif
#ifdef MMD
}
#endif
#ifdef USE_FOG
float depth = gl_FragCoord.z / gl_FragCoord.w;
#ifdef FOG_EXP2
const float LOG2 = 1.442695;float fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );
#else
float fogFactor = smoothstep( fogNear, fogFar, depth );
#endif
gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );
#endif
}
