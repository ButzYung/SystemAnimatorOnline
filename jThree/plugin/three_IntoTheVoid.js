/**
 * https://www.shadertoy.com/view/Mst3Rr
 *
 * IntoTheVoid
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

THREE.IntoTheVoid = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },

"iResolution":  { type: "v3", value: new THREE.Vector3(640,480,1) },
"iGlobalTime":  { type: "f", value: 0 },

"iChannel0": { type: "t", value: null },
"iChannel1": { type: "t", value: null }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

"uniform vec3 iResolution;",
"uniform float iGlobalTime;",

"uniform sampler2D iChannel0;",
"uniform sampler2D iChannel1;",

((MMD_SA_options.MME.PostProcessingEffects && MMD_SA_options.MME.PostProcessingEffects.effects_by_name.IntoTheVoid && MMD_SA_options.MME.PostProcessingEffects.effects_by_name.IntoTheVoid.use_solid_bg) ? '#define SOLID_BG' : ''),
//'#define SOLID_BG',


"\/\/ Into-the-Void - a visual \"thunderstorm\" - written 2015-11-18 by Jakob Thomsen",
"\/\/ Testing Shadertoy's new Soundcloud-feature to visualize my composition \"into the void\".",
"\/\/ License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.",
"",
"\/\/ Lighting based on binary-tree https:\/\/www.shadertoy.com/view/lljXW3",
"\/\/ Clouds based on https:\/\/www.shadertoy.com/view/Ml2XDK",
"\/\/ Sparks based on https:\/\/www.shadertoy.com/view/4l2SW3",
"\/\/ FFT-colors based on https:\/\/www.shadertoy.com/view/MsdGzn",
"",
"\/\/ use only on fast computers to enable cloud-normals for lighting",
"\/\/#define SLOW",
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
"vec3 fractalspherenoisenrm(vec2 v)",
"{",
"    float d = 0.01;",
"    return normalize(",
"           vec3(fractalspherenoise(v + vec2(  d, 0.0)) - fractalspherenoise(v + vec2( -d, 0.0)),",
"                fractalspherenoise(v + vec2(0.0,   d)) - fractalspherenoise(v + vec2(0.0,  -d)),",
"                d));",
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
"        val += 1.0 / (i + 1.0) * blobnoise((i + 1.0) * v + vec2(0.0, iGlobalTime * 1.0), s);",
"    	\/\/val += pow(0.5, i+1.) * blobnoise(exp2(i) * v + vec2(0, iGlobalTime * 1.0), s);",
"",
"    return val;",
"}",
"",
"void mainImage( out vec4 o, in vec2 U )",
"{",
"    U = U.xy / iResolution.xy;",
"    float fft  = texture2D( iChannel0, vec2(U.y,0.25) ).x; \/\/ freq",
"    float wave = texture2D( iChannel0, vec2(U.x,0.75) ).x; \/\/ wave",
"    \/\/U.x *= iResolution.x / iResolution.y;",
"    float val = pow(fractalspherenoise(U * 10.0), 2.0);",
"    vec3 c = mix(abs(wave)*2.0 * mix(vec3(1.0, 0.125, 0.0), vec3(1.0, 1.0, 0.0), U.y) * fractalblobnoise( U * 20., 20.), vec3(fft, 4.0 * fft * (1.0 - fft), 1.0 - fft) * fft, vec3(val));",
"    vec4 rnd0 = texture2D(iChannel1, fract(U + iGlobalTime * .1));",
"    vec4 rnd1 = texture2D(iChannel1, fract(.1 * U + iGlobalTime * .1));",
"    vec2 V = BinaryTreeSubDiv2(clamp(vec2(U.x, .75*U.y) + 0.1 * vec2(2.0 * rnd1.x - 1.0, 0.0), 0.0, 1.0));",
"    \/\/c += pow(hash(vec2(iGlobalTime)).x, 5.0) * clamp(abs(wave)*4.0 * rnd1.y*(1. - smoothstep(0., .15 * rnd0.x, abs(4. * abs(V.x -.5) - (1. - V.y)))), 0., 1.);",
"    c += 4.0 * clamp(10.0*pow(hash(vec2(iGlobalTime)).x, 5.0)-9.0,0.0,1.0) * clamp(rnd1.y*(1. - smoothstep(0., .15 * rnd0.x, abs(4. * abs(V.x -.5) - (1. - V.y)))), 0., 1.);",
"#ifdef SLOW",
"    c += clamp(10.0*pow(hash(vec2(iGlobalTime)).x, 5.0)-9.0,0.0,1.0) * dot(fractalspherenoisenrm(U * 10.0), normalize(vec3(2.*U.x-1.,U.y, 1.)));",
"#endif",
"    o = vec4(c,1.0);",
"}",


		"void main() {",

			"vec4 texel = texture2D( tDiffuse, vUv );",

'vec4 color;',
'vec2 coord = vec2(0.5) + (vUv * (iResolution.xy - vec2(1.0)));',
'mainImage(color, coord);',

'#ifdef SOLID_BG',
			"gl_FragColor = vec4(texel.rgb + color.rgb * (1.0 - texel.a*0.8), 1.0);",
'#else',

//http://entropymine.com/imageworsener/grayscale/
//The formula for luminosity is 0.2126×Red + 0.7152×Green + 0.0722×Blue
//'color.a = (color.r + color.g + color.b) / 3.0;',

'color.rgb = clamp(color.rgb, 0.0, 1.0);',
'float c_max = max(color.r, max(color.g, color.b));',

'if (c_max > 0.001) {',
'  color.rgb *= 1.0/c_max;',
'  color.a = c_max;',
'}',
'else { color.a = 0.0; }',

"float color_a = pow(color.a * (1.0 - texel.a*0.8), texel.a * 1.0/max(1.0+(color.a-texel.a), 0.001));",
			"gl_FragColor = vec4(texel.rgb * clamp(texel.a * 1.5 / max(color_a, 0.001), 0.0, 1.0) + color.rgb * color_a, pow(texel.a + color.a * (1.0 - texel.a), 0.5));",

'#endif',

		"}"

	].join( "\n" ),

	_refreshUniforms: function (refresh_all_uniforms) {
var EC = MMD_SA_options.MME.PostProcessingEffects
var e = EC._effects.IntoTheVoid

if (refresh_all_uniforms) {
  e.uniforms[ 'iResolution' ].value = new THREE.Vector3(EC._width, EC._height, 1);

  this._texture_list.forEach(function (src, idx) {
    var filename = src.replace(/^.+[\/\\]/, "")
    e.uniforms[ 'iChannel' + idx ].value = EC._texture_common[filename]
  });
}

e.uniforms[ 'iGlobalTime' ].value = performance.now()/1000;

//var beat = (EV_usage_sub && EV_usage_sub.BD) ? EV_usage_sub.BD.beat : 0
//e.uniforms[ 'ST_opacity' ].value = (MMD_SA.music_mode) ? 0.25 + EC.effects_by_name.IntoTheVoid._EV_usage_PROCESS(beat, 0.2) * 0.75 : 1
	},

	_init: function () {
var EC = MMD_SA_options.MME.PostProcessingEffects
if (!EC._texture_common)
  EC._texture_common = {}

var tex_list = this._texture_list = ['[music canvas]', System.Gadget.path + '/images/ST_tex11.png']
var c = EC._music_canvas
if (!c) {
  c = EC._music_canvas = document.createElement("canvas")
  c.width  = 512
  c.height = 2
}
tex_list.forEach(function (src) {
  var filename = src.replace(/^.+[\/\\]/, "")
  if (filename == '[music canvas]')
    EC._texture_common[filename] = new THREE.Texture(c)
  else {
    EC._texture_common[filename] = EC._texture_common[filename] || THREE.ImageUtils.loadTexture(toFileProtocol(src), undefined, function (tex) { tex.needsUpdate=true });
    EC._texture_common[filename].wrapS = EC._texture_common[filename].wrapT = THREE.RepeatWrapping;
  }
});
	}

};

// init
THREE.IntoTheVoid._init();
