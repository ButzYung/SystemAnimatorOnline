/**
 * https://www.shadertoy.com/view/MdySW3
 *
 * Funky Disco Ball
 */

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

/**
 * codes modified to work on System Animator, by Butz Yung/Anime Theme
 * http://www.animetheme.com/sidebar/
 */

THREE.FunkyDiscoBall = {

	uniforms: {

"iChannelResolution": { type: "v3v", value: [new THREE.Vector3(256,256,1), new THREE.Vector3(256,256,1)] }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

"uniform vec3 iChannelResolution[2];",


'// "Funky Disco Ball" by Krzysztof Narkowicz @knarkowicz',
'',
'const float MATH_PI = 3.14159265359;',
'',
'float RaySphere( vec3 rayOrigin, vec3 rayDir, vec3 spherePos, float sphereRadius )',
'{',
'	vec3 oc = rayOrigin - spherePos;',
'	',
'	float b = dot( oc, rayDir );',
'	float c = dot( oc, oc ) - sphereRadius * sphereRadius;',
'	float h = b * b - c;',
'	',
'	float t;',
'	if ( h < 0.0 )',
'    {',
'		t = -1.0;',
'    }',
'	else',
'    {',
'		t = ( -b - sqrt( h ) );',
'    }',
'	return t;',
'}',
'',
'void mainImage( out vec4 fragColor, in vec2 fragCoord )',
'{',
'	vec2 q = fragCoord.xy / iResolution.xy;',
'    vec2 p = -1.0 + 2.0 * q;',
'	p.x *= iResolution.x / iResolution.y;',
'    p.y *= -1.0;',
'',
'    vec3 rayOrigin	= vec3( 0.0, 0.0, -2.5 );',
'	vec3 rayDir 	= normalize( vec3( p.xy, 2.0 ) ); ',
'    ',
'	float sphereAngle = -0.5 * iGlobalTime; ',
'',
'	vec3 color = vec3( 0.0 );',
'',
'    float sphere0Radius = 1.0;',
'    float sphere1Radius = 1.4;',
'    float sphere2Radius = 1.8;',
'    ',
'    float t0 = RaySphere( rayOrigin, rayDir, vec3( 0.0, 0.0, 0.0 ), sphere0Radius );',
'    float t1 = RaySphere( rayOrigin, rayDir, vec3( 0.0, 0.0, 0.0 ), sphere1Radius );',
'    float t2 = RaySphere( rayOrigin, rayDir, vec3( 0.0, 0.0, 0.0 ), sphere2Radius );',
'',
'    float t 			= t0;',
'    float sphereRadius 	= sphere0Radius;',
'    float sphereColor	= 0.15 + 3.0 * pow( texture2D( iChannel2, vec2( 0.75, 0.25 ) ).x, 3.0 );',
'    ',
'    if ( t1 > t0 )',
'    {',
'        t 				= t1;',
'    	sphereRadius 	= sphere1Radius;',
'        sphereColor		= 0.8 * pow( texture2D( iChannel2, vec2( 0.5, 0.25 ) ).x, 3.0 );',
'        sphereAngle		= -sphereAngle;',
'    }',
'    if ( t2 > t1 )',
'    {',
'        t 				= t2;',
'    	sphereRadius 	= sphere2Radius;',
'        sphereColor		= 0.1 * pow( texture2D( iChannel2, vec2( 0.0, 0.25 ) ).x, 3.0 );',
'    }',
'    ',
'    if ( t > 0.0 )',
'    {',
'        vec3 pos = rayOrigin + t * rayDir;',
'        ',
'        float tileSize 	= 0.12;        ',
'        vec2 phiTheta	= vec2( atan( pos.z, pos.x ) + sphereAngle, acos( pos.y / sphereRadius ) );',
'		vec2 tileId 	= floor( phiTheta / tileSize );',
'        vec2 tilePos	= ( phiTheta - tileId * tileSize ) / tileSize;',
'        phiTheta		= tileId * tileSize;',
'        phiTheta.x		= phiTheta.x - sphereAngle;',
'        ',
'        vec2 edge = min( clamp( ( tilePos ) * 10.0, 0.0, 1.0 ), clamp( ( 1.0 - tilePos ) * 10.0, 0.0, 1.0 ) );       ',
'        float bump = clamp( min( edge.x, edge.y ), 0.0, 1.0 );',
'        ',
'        vec3 bumpPos;',
'        bumpPos.x = sphereRadius * sin( phiTheta.y ) * cos( phiTheta.x );',
'        bumpPos.y = sphereRadius * cos( phiTheta.y );',
'        bumpPos.z = sphereRadius * sin( phiTheta.y ) * sin( phiTheta.x );',
'		bumpPos.y += ( 1.0 - bump ) * 0.1;',
'        ',
'        vec3 normal = normalize( bumpPos );',
'',
'        vec3 refl = reflect( rayDir, normal );',
'        color = textureCube( iChannel0, refl ).xyz;',
'        color = color * color;',
'        color *= vec3( bump ) * sphereColor * 10.0;',
'    }',
'',
'    vec3 moodColor0 = vec3( 0.8, 0.5, 0.8 );',
'    vec3 moodColor1 = vec3( 0.8, 0.8, 0.2 );',
'    vec3 moodColor2 = vec3( 0.4, 1.0, 0.4 );',
'',
'    float moodTime 	= mod( iGlobalTime * 0.5, 3.0 );',
'    float moodId 	= floor( moodTime );',
'    float moodPos 	= moodTime - moodId;',
'    float ma 		= moodId == 0.0 ? 1.0 : 0.0;',
'    float mb 		= moodId == 1.0 ? 1.0 : 0.0;',
'    float mc 		= moodId == 2.0 ? 1.0 : 0.0;',
'    vec3 moodColor 	= moodColor0 * ma + moodColor1 * mb + moodColor2 * mc;',
'    color *= mix( moodColor, vec3( 1.0 ), 0.3 );',
'    ',
'    vec2 grainUV = ( fragCoord.xy / ( 2.0 * iChannelResolution[ 1 ].xy ) + fract( vec2( iGlobalTime * 11.1, iGlobalTime * 31.3 ) ) );',
'    float grain = (max( texture2D( iChannel1, grainUV ).x, 0.5 ) - 0.5) * 0.5 + 0.5;',
'    color += vec3( ( 2.0 * grain - 1.0 ) * 0.04 * ( 1.0 - sphereColor * 0.5 ) );',
'    ',
'    fragColor = vec4( pow( color, vec3( 0.6 ) ), 1.0 );',
'}',


		"void main() {",
MMD_SA.MME_PPE_main("FunkyDiscoBall"),
		"}"

	].join( "\n" ),

	_refreshUniforms: function (refresh_all_uniforms) {
MMD_SA.MME_PPE_refreshUniforms.call(this, "FunkyDiscoBall", refresh_all_uniforms)
	},

	_init: function () {
MMD_SA.MME_PPE_init.call(this, "FunkyDiscoBall", [System.Gadget.path + '/images/ST_cube02_0.jpg|CUBE', System.Gadget.path + '/images/ST_tex16.png', '[music canvas]'])
	}

};

// init
THREE.FunkyDiscoBall._init();
