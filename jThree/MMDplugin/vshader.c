#define MMD
#define PHONG
varying vec3 vViewPosition;varying vec3 vNormal;
#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP )
varying vec2 vUv;uniform vec4 offsetRepeat;
#endif
#ifdef USE_LIGHTMAP
varying vec2 vUv2;
#endif
#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP )
varying vec3 vReflect;uniform float refractionRatio;uniform bool useRefract;
#endif
#ifndef PHONG_PER_PIXEL
#if MAX_POINT_LIGHTS > 0
uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];uniform float pointLightDistance[ MAX_POINT_LIGHTS ];varying vec4 vPointLight[ MAX_POINT_LIGHTS ];
#endif
#if MAX_SPOT_LIGHTS > 0
uniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];uniform float spotLightDistance[ MAX_SPOT_LIGHTS ];varying vec4 vSpotLight[ MAX_SPOT_LIGHTS ];
#endif
#endif
#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP )
varying vec3 vWorldPosition;
#endif
#ifdef USE_COLOR
varying vec3 vColor;
#endif
#ifdef USE_MORPHTARGETS
#ifndef USE_MORPHNORMALS
uniform float morphTargetInfluences[ 8 ];
#else
uniform float morphTargetInfluences[ 4 ];
#endif
#endif
#ifdef USE_SKINNING
#ifdef BONE_TEXTURE
uniform sampler2D boneTexture;mat4 getBoneMatrix( const in float i ) {float j = i * 4.0;float x = mod( j, N_BONE_PIXEL_X );float y = floor( j / N_BONE_PIXEL_X );const float dx = 1.0 / N_BONE_PIXEL_X;const float dy = 1.0 / N_BONE_PIXEL_Y;y = dy * ( y + 0.5 );vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );mat4 bone = mat4( v1, v2, v3, v4 );return bone;}
#else
uniform mat4 boneGlobalMatrices[ MAX_BONES ];mat4 getBoneMatrix( const in float i ) {mat4 bone = boneGlobalMatrices[ int(i) ];return bone;}
#endif
#endif
#ifdef USE_SHADOWMAP
varying vec4 vShadowCoord[ MAX_SHADOWS ];uniform mat4 shadowMatrix[ MAX_SHADOWS ];
#endif
#ifdef MMD
uniform float mmdEdgeThick;
#endif
#ifdef MMD_SPHEREMAP
varying vec2 vUvSphere;
#endif

void main() {
#ifdef USE_SKINNING
mat4 skinMatrix;
#ifdef MMD
skinMatrix  = skinWeight.x * getBoneMatrix( skinIndex.x );if ( skinWeight.y > 0.0 ) {skinMatrix += skinWeight.y * getBoneMatrix( skinIndex.y );if ( skinWeight.z > 0.0 ) {skinMatrix += skinWeight.z * getBoneMatrix( skinIndex.z );skinMatrix += skinWeight.w * getBoneMatrix( skinIndex.w );}}
#else
skinMatrix =skinWeight.x * getBoneMatrix( skinIndex.x ) +skinWeight.y * getBoneMatrix( skinIndex.y );
#endif
#endif
vec3 objectNormal = normal;
#ifdef USE_MORPHNORMALS
objectNormal += ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];objectNormal += ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];objectNormal += ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];objectNormal += ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];
#endif
#ifdef USE_SKINNING
objectNormal.xyz = ( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
#endif
#ifdef FLIP_SIDED
objectNormal = -objectNormal;
#endif
vNormal = normalize( normalMatrix * objectNormal );vec3 objectPosition = position;
#ifdef USE_MORPHTARGETS
objectPosition += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];objectPosition += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];objectPosition += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];objectPosition += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];
#ifndef USE_MORPHNORMALS
objectPosition += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];objectPosition += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];objectPosition += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];objectPosition += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];
#endif
#endif
#ifdef USE_SKINNING
objectPosition.xyz = ( skinMatrix * vec4( objectPosition, 1.0 ) ).xyz;
#endif
vec4 mvPosition = modelViewMatrix * vec4( objectPosition, 1.0 );gl_Position = projectionMatrix * mvPosition;
#ifdef MMD
if (mmdEdgeThick > 0.0) {vec2 offset;offset.x = vNormal.x * projectionMatrix[0][0] / projectionMatrix[1][1];offset.y = vNormal.y;gl_Position.xy += offset * gl_Position.w * mmdEdgeThick;return;}
#endif
vViewPosition = -mvPosition.xyz;
#if defined( USE_ENVMAP ) || defined( PHONG ) || defined( LAMBERT ) || defined ( USE_SHADOWMAP )
vec4 worldPosition = modelMatrix * vec4( objectPosition, 1.0 );
#endif
#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP )
vec3 worldNormal = mat3( modelMatrix[ 0 ].xyz, modelMatrix[ 1 ].xyz, modelMatrix[ 2 ].xyz ) * objectNormal;worldNormal = normalize( worldNormal );vec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );if ( useRefract ) {vReflect = refract( cameraToVertex, worldNormal, refractionRatio );} else {vReflect = reflect( cameraToVertex, worldNormal );}
#endif
#ifndef PHONG_PER_PIXEL
#if MAX_POINT_LIGHTS > 0
for( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );vec3 lVector = lPosition.xyz - mvPosition.xyz;float lDistance = 1.0;if ( pointLightDistance[ i ] > 0.0 )lDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );vPointLight[ i ] = vec4( lVector, lDistance );}
#endif
#if MAX_SPOT_LIGHTS > 0
for( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {vec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );vec3 lVector = lPosition.xyz - mvPosition.xyz;float lDistance = 1.0;if ( spotLightDistance[ i ] > 0.0 )lDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );vSpotLight[ i ] = vec4( lVector, lDistance );}
#endif
#endif
#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP )
vWorldPosition = worldPosition.xyz;
#endif
#ifdef USE_SHADOWMAP
for( int i = 0; i < MAX_SHADOWS; i ++ ) {vShadowCoord[ i ] = shadowMatrix[ i ] * worldPosition;}
#endif
#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP )
vUv = uv * offsetRepeat.zw + offsetRepeat.xy;
#endif
#ifdef USE_LIGHTMAP
vUv2 = uv2;
#endif
#ifdef MMD_SPHEREMAP
vUvSphere = vNormal.xy * 0.5 + 0.5;vUvSphere.y = 1.0 - vUvSphere.y;
#endif
#ifdef USE_COLOR
#ifdef GAMMA_INPUT
vColor = color * color;
#else
vColor = color;
#endif
#endif
}
