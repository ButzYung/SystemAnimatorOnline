/**
 * https://www.shadertoy.com/view/XsyXzw
 *
 * DancingDots
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

THREE.DancingDots = {

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

"#define PI 3.14159265359\n",
"\n",
"vec3 hsv2rgb (in vec3 hsv) {\n",
"    return hsv.z * (1.0 + 0.5 * hsv.y * (cos (2.0 * PI * (hsv.x + vec3 (0.0, 0.6667, 0.3333))) - 1.0));\n",
"}\n",
"\n",
"float hash(vec3 uv) {\n",
"    return fract(sin(dot(uv, vec3(7.13, 157.09, 113.57))) * 48543.5453);\n",
"}\n",
"\n",
"// better distance function thanks to Shane\n",
"float map(vec3 p) {\n",
"    float radius = texture2D(iChannel0, vec2(hash(floor(p)), .25)).x * .99 + .01;\n",
"    return length(fract(p) - .5) - .25 * radius;\n",
"}\n",
"\n",
"// raymarching function\n",
"float trace(vec3 o, vec3 r) {\n",
"\n",
"    float t = 0.;\n",
"    \n",
"    for (int i = 0; i < 32; ++i) { // Low iterations for blur.\n",
"        float d = map(o + r * t);\n",
"        t += d * .9; // Ray shortening to blur a bit more. \n",
"    }\n",
"    \n",
"    return t;\n",
"}\n",
"\n",
"void mainImage( out vec4 fragColor, in vec2 fragCoord )\n",
"{\n",
"	vec2 uv = fragCoord.xy / iResolution.xy * 2. - 1.;\n",
"    uv.x *= iResolution.x / iResolution.y;\n",
"    \n",
"    // ray\n",
"    vec3 r = normalize(vec3(uv, 2.));\n",
"    // origin\n",
"    vec3 o = vec3(-3, iGlobalTime, -1);\n",
"     \n",
"    // rotate origin and ray\n",
"    float a = -iGlobalTime * .5;\n",
"    mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a));\n",
"    o.xz *= rot;\n",
"    r.xy *= rot;\n",
"    r.xz *= rot;\n",
"    \n",
"    // march\n",
"    float f = trace(o, r);\n",
"    \n",
"    // calculate color from angle on xz plane\n",
"    vec3 p = o + f * r;\n",
"    float angel = atan(p.x, p.z) / PI / 2.;\n",
"    vec3 c = hsv2rgb(vec3(angel, 1., 1.));\n",
"    \n",
"    // add with fog\n",
"	fragColor = vec4(c / (1. + f * f * .1),1.0);\n",
"}",


		"void main() {",
MMD_SA.MME_PPE_main("DancingDots"),
		"}"

	].join( "\n" ),

	_refreshUniforms: function (refresh_all_uniforms) {
MMD_SA.MME_PPE_refreshUniforms.call(this, "DancingDots", refresh_all_uniforms)
	},

	_init: function () {
MMD_SA.MME_PPE_init.call(this, "DancingDots", ['[music canvas]'])
	}

};

// init
THREE.DancingDots._init();
