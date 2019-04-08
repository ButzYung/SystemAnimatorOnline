/**
 * https://www.shadertoy.com/view/Xdc3z8
 *
 * Adrenaline
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

THREE.Adrenaline = {

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

"\/\/ Adrenaline - written 2015-11-19 by Jakob Thomsen",
"\/\/ Testing Shadertoy's new Soundcloud-feature to visualize my composition \"adrenaline\".",
"\/\/ License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.",
"",
"\/\/ (basically a polar version of https:\/\/www.shadertoy.com/view/Mst3Rr)",
"\/\/ Lighting based on binary-tree https:\/\/www.shadertoy.com/view/lljXW3",
"\/\/ Clouds based on https:\/\/www.shadertoy.com/view/Ml2XDK",
"\/\/ Sparks based on https:\/\/www.shadertoy.com/view/4l2SW3",
"\/\/ FFT-colors based on https:\/\/www.shadertoy.com/view/MsdGzn",
"",
"#define pi 3.1415926",
"",
"vec2 BinaryTreeSubDiv2(vec2 v)",
"{",
"    v *= exp2(ceil(-log2(v.y)));",
"    v.x *= .5;",
"    return fract(v);",
"}",
"",
"\/\/ iq's hash function from https:\/\/www.shadertoy.com/view/MslGD8",
"vec2 hash( vec2 p ) { p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))); return fract(sin(p)*18.5453); }",
"",
"float simplegridnoise(vec2 v)",
"{",
"    \/\/ NOTE: Setting s = 0.01 causes horizontal-lines-artifact with texture-lookup.",
"    \/\/       Use s = 1.0 / 256.0 (thanks iq) or switch filtering to linear (thanks tomkh).",
"    \/\/float s = 0.01;",
"    float s = 1.0 / 256.0;",
"    vec2 fl = floor(v);",
"    vec2 fr = fract(v);",
"    float mindist = 1000.0;",
"    for(float y = -1.0; y <= 1.0; y++)",
"    {",
"        for(float x = -1.0; x <= 1.0; x++)",
"        {",
"            vec2 offset = vec2(x, y);",
"            float phi = 3.1415926 * 2.0 * (iGlobalTime * 0.2 + hash(fl + offset).x);",
"            vec2 pos = 0.5 + 0.5 * vec2(cos(phi), sin(phi));",
"            float d = length(fr - (pos + offset));",
"            mindist = min(mindist, d);",
"        }",
"    }",
"    ",
"    return mindist;",
"}",
"",
"float spherenoise(vec2 v)",
"{",
"    return (1.0 - pow(simplegridnoise(v) / sqrt(2.0), 2.0));",
"}",
"",
"vec3 spherenoisenrm(vec2 v)",
"{",
"    float d = 0.01;",
"    return normalize(",
"           vec3(spherenoise(v + vec2(  d, 0.0)) - spherenoise(v + vec2( -d, 0.0)),",
"                spherenoise(v + vec2(0.0,   d)) - spherenoise(v + vec2(0.0,  -d)),",
"                d));",
"}",
"",
"float fractalspherenoise(vec2 v)",
"{",
"    float val = 0.0;",
"    const float n = 4.0;",
"    for(float i = 0.0; i < n; i++)",
"    {",
"    	val += pow(0.5, i + 1.0) * spherenoise(pow(2.0, i) * v);",
"    }",
"    return val;",
"}",
"",
"float blobnoise(vec2 v, float s)",
"{",
"    return pow(.5 + .5 * cos(pi * clamp(simplegridnoise(v)*2., 0., 1.)), s);",
"}",
"",
"float fractalblobnoise(vec2 v, float s)",
"{",
"    float val = 0.;",
"    const float n = 2.;",
"    for(float i = 0.; i < n; i++)",
"        val += 1.0 / (i + 1.0) * blobnoise((i + 1.0) * v + vec2(0.0, -iGlobalTime * 10.0), s);",
"    	\/\/val += pow(0.5, i+1.) * blobnoise(exp2(i) * v + vec2(0, iGlobalTime * 1.0), s);",
"",
"    return val;",
"}",
"",
"void mainImage( out vec4 o, in vec2 U )",
"{",
"    U = U.xy / iResolution.xy;",
"    U = 2.*U-1.;",
"    U *= 0.75;",
"    U.x *= iResolution.x / iResolution.y;",
"    U = vec2(atan(U.y, U.x) / pi, length(U));",
"    float fft  = texture2D( iChannel0, vec2(U.y,0.25) ).x; \/\/ freq",
"    float wave = texture2D( iChannel0, vec2(U.x,0.75) ).x; \/\/ wave",
"    float val = pow(fractalspherenoise(U * 10.0-vec2(0.,2.*iGlobalTime)), 2.0);",
"    vec3 c = mix(abs(wave)*2.0 * mix(vec3(1.0, 0.125, 0.0), vec3(1.0, 1.0, 0.0), U.y) * fractalblobnoise( U * 20., 20.), vec3(fft, 4.0 * fft * (1.0 - fft), 1.0 - fft) * fft, vec3(val));",
"    vec4 rnd0 = texture2D(iChannel1, fract(U + iGlobalTime * .1));",
"    vec4 rnd1 = texture2D(iChannel1, fract(.1 * U + iGlobalTime * .1));",
"    vec2 V = BinaryTreeSubDiv2((vec2(U.x*4., 1. -.75*U.y) + 0.1 * vec2(2.0 * rnd1.x - 1.0, 0.0)));",
"    c += hash(vec2(iGlobalTime)).x * clamp(abs(wave)*4.0 * rnd1.y*U.y*(1. - smoothstep(0., .5 * rnd0.x, abs(4. * abs(V.x -.5) - (1. - V.y)))), 0., 1.);",
"    \/\/c += 4.0 * clamp(10.0*pow(hash(vec2(iGlobalTime)).x, 5.0)-9.0,0.0,1.0) * clamp(rnd1.y*(1. - smoothstep(0., .5 * rnd0.x, abs(4. * abs(V.x -.5) - (1. - V.y)))), 0., 1.);",
"    o = vec4(c,1.0);",
"}",


		"void main() {",
MMD_SA.MME_PPE_main("Adrenaline"),
		"}"

	].join( "\n" ),

	_refreshUniforms: function (refresh_all_uniforms) {
MMD_SA.MME_PPE_refreshUniforms.call(this, "Adrenaline", refresh_all_uniforms)
	},

	_init: function () {
MMD_SA.MME_PPE_init.call(this, "Adrenaline", ['[music canvas]', System.Gadget.path + '/images/ST_tex11.png'])
	}

};

// init
THREE.Adrenaline._init();
