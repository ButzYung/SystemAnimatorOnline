/**
 * https://www.shadertoy.com/view/lsf3D7
 *
 * AudioSurfII
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

THREE.AudioSurfII = {

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

"\/\/ by Nikos Papadopoulos, 4rknova \/ 2013",
"\/\/ Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.",
"",
"#ifdef GL_ES",
"precision highp float;",
"#endif",
"",
"#define  PI         3.14159265359",
"#define THICKNESS  .4",
"",
"void mainImage( out vec4 fragColor, in vec2 fragCoord )",
"{",
"  float u = fragCoord.x \/ iResolution.x;",
"  float fft = texture2D(iChannel0, vec2(u,.25)).x;  ",
"  float wav = texture2D(iChannel0, vec2(u,.75)).x;",
"  ",
"  vec2 uv = fragCoord.xy \/ iResolution.xy * 2. - 1.;",
"  vec2 wv = uv + vec2(0., wav - .5);",
"",
"  float f = pow(abs(fft * tan(iGlobalTime - uv.y \/ wv.y)), .1);",
"  float h = pow(abs(wv.x - pow(abs(uv.y), cos(fft * PI * .25))), f);",
"  float g = abs(THICKNESS * .02 \/ (sin(wv.y) * h));",
"",
"  vec3 c = g * clamp(vec3(fft, fract(fft) \/ fract(wav), g * wav), 0., 1.);",
"  ",
"  fragColor = vec4(c, 1);",
"}",


		"void main() {",
MMD_SA.MME_PPE_main("AudioSurfII"),
		"}"

	].join( "\n" ),

	_refreshUniforms: function (refresh_all_uniforms) {
MMD_SA.MME_PPE_refreshUniforms.call(this, "AudioSurfII", refresh_all_uniforms)
	},

	_init: function () {
MMD_SA.MME_PPE_init.call(this, "AudioSurfII", ['[music canvas]'])
	}

};

// init
THREE.AudioSurfII._init();
