/**
 * https://www.shadertoy.com/view/llVXRh
 *
 * AudioEQCircles
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

THREE.AudioEQCircles = {

	uniforms: {
	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

'const float TWO_PI = 6.28318530718;',
'const float distThresh = 0.3;',
'const float baseRadius = 0.4;',
'const float brightAdjust = 8.;',
'const int numControlPoints = 128;',
'',
'float map(float value, float low1, float high1, float low2, float high2) {',
'   return low2 + (value - low1) * (high2 - low2) / (high1 - low1);',
'}',
'',
'void mainImage( out vec4 fragColor, in vec2 fragCoord )',
'{',
'    vec2  uv = (2. * fragCoord.xy - iResolution.xy) / iResolution.y,',
'          uvAudio = fragCoord.xy / iResolution.xy;',
'    float speed = 1.0,',
'          time = iGlobalTime * speed,',
'          radius = baseRadius, // 0.98 to reduce aliasing when all circles overlap',
'          dist = 0.,',
'          segmentRads = TWO_PI / float(numControlPoints);',
'    ',
'	// create control points in a circle and check distance sum',
'    for(int i=0; i < numControlPoints; i++) {',
'        float curRads = segmentRads * float(i);',
'        float audioTexX = curRads / TWO_PI; // sweep across audio texture based on circle progress',
'        uvAudio = vec2(map(audioTexX, 0., 1., 0.2, 0.5), 0.25); // remap to use the best part of the spectrum. 0.5 for y is where shadertoy give us fft data',
'        float eqAmp = texture2D( iChannel0, uvAudio ).g;',
'        float curRadius = 0.1 + radius * 3. * eqAmp;',

'curRadius *= 0.8;',

'        vec2 ctrlPoint = vec2(sin(curRads) * curRadius, cos(curRads) * curRadius);',
'        if(distance(uv, ctrlPoint) < distThresh * eqAmp) dist += distance(uv, ctrlPoint) * 15. * eqAmp;',
'    }',
'    ',
'    // adjust distance to compensate for numControlPoints addition',
'    dist /= float(numControlPoints);',
'    fragColor = vec4(vec3(dist * brightAdjust), 1.0);',
'}',


		"void main() {",
MMD_SA.MME_PPE_main("AudioEQCircles"),
		"}"

	].join( "\n" ),

	_refreshUniforms: function (refresh_all_uniforms) {
MMD_SA.MME_PPE_refreshUniforms.call(this, "AudioEQCircles", refresh_all_uniforms)
	},

	_init: function () {
MMD_SA.MME_PPE_init.call(this, "AudioEQCircles", ['[music canvas]'])
	}

};

// init
THREE.AudioEQCircles._init();
