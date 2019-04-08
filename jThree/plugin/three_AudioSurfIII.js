/**
 * https://www.shadertoy.com/view/MsBXRK
 *
 * AudioSurfIII
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

THREE.AudioSurfIII = {

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

"\/\/ by Nikos Papadopoulos, 4rknova \/ 2014",
"\/\/ Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.",
"",
"\/\/ Coloring function is based on DXRob's Aura Shader:",
"\/\/ https:\/\/www.shadertoy.com\/view\/lsXXDj",
"",
"#ifdef GL_ES",
"precision highp float;",
"#endif",
"",
"#define PI  3.14159265359",
"#define EPS .001",
"",
"#define CIRCLE_RADIUS .5",
"#define CIRCLE_GLOW   .1",
"#define SAMPLE_SCALE  .2",
"",
"float hash(vec2 p)",
"{",
"    return fract(sin(dot(p,vec2(127.1,311.7))) * 43758.5453123);",
"}",
"",
"void mainImage( out vec4 fragColor, in vec2 fragCoord )",
"{",
"    \/\/ 1. Calculate the uv coordinates in [-1, 1] xy space.",
"  vec2  uv = fragCoord.xy \/ iResolution.xy * 2. - 1.;",
"    ",
"    \/\/ 2. Sample the audio stream.",
"    \/\/ Calculate the polar coordinates based on uv value.",
"    \/\/ Atan will return a value in the range of [-1, 1] so",
"    \/\/ we need to transform back to [0, 1] before sampling.",
"    float x = atan(-uv.x, -uv.y) \/ PI;",
"    \/\/ The samples are not going to seamlessly merge on the edges",
"    \/\/ so what we are going to do to make it nicer is display them",
"    \/\/ twice and invert the sampling order for the second repetition.",
"    x = (x < 0. ? 1. + x : 1. - x);",
"    vec3  s = texture2D(iChannel0, vec2(x, .25)).xyz * SAMPLE_SCALE;",
"        ",
"    \/\/ 3. Define the geometry.",
"    \/\/ Correct the uv coordinates with regards to the aspect",
"    \/\/ ratio to calculate correct circle radius.",
"    vec2  cv = uv * vec2(iResolution.x \/ iResolution.y, 1.);",
"    float ds = length(cv);",
"         ",
"    \/\/ 4. Calculate the pixel color.",
"    float sr = (ds - s.x) \/ CIRCLE_RADIUS;",
"    float cl = (1. - sqrt(abs(1. - sr))) \/ sr + CIRCLE_GLOW;",
"",
"    \/\/ 5. PostFX",
"    vec3 col = cl * vec3(abs(cos(iGlobalTime)), .5 + uv.x * uv.y, ds - uv.y);",
"    float grain = hash(hash(uv) * cv * iGlobalTime) * .05;",
"    float fade  = smoothstep(EPS, 2., iGlobalTime);",
"",
"    fragColor = vec4((col + grain) * fade, 1);",
"}",


		"void main() {",
MMD_SA.MME_PPE_main("AudioSurfIII"),
		"}"

	].join( "\n" ),

	_refreshUniforms: function (refresh_all_uniforms) {
MMD_SA.MME_PPE_refreshUniforms.call(this, "AudioSurfIII", refresh_all_uniforms)
	},

	_init: function () {
MMD_SA.MME_PPE_init.call(this, "AudioSurfIII", ['[music canvas]'])
	}

};

// init
THREE.AudioSurfIII._init();
