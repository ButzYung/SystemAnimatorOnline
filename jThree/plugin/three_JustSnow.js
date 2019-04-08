/**
 * https://www.shadertoy.com/view/ldsGDn
 *
 * JustSnow
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

THREE.JustSnow = {

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

"// Copyright (c) 2013 Andrew Baldwin (twitter: baldand, www: http://thndl.com)",
"// License = Attribution-NonCommercial-ShareAlike (http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US)",
"",
"// Just snow",
"// Simple (but not cheap) snow made from multiple parallax layers with randomly positioned ",
"// flakes and directions. Also includes a DoF effect. Pan around with mouse.",
"",
"#define LIGHT_SNOW // Comment this out for a blizzard",
"",
"#ifdef LIGHT_SNOW",

//50
"	#define LAYERS 10",

//.5
"	#define DEPTH 1.",

"	#define WIDTH .3",
"	#define SPEED .6",
"#else // BLIZZARD",
"	#define LAYERS 200",
"	#define DEPTH .1",
"	#define WIDTH .8",
"	#define SPEED 1.5",
"#endif",
"",
"void mainImage( out vec4 fragColor, in vec2 fragCoord )",
"{",
"	const mat3 p = mat3(13.323122,23.5112,21.71123,21.1212,28.7312,11.9312,21.8112,14.7212,61.3934);",
"	vec2 uv = 0.0/iResolution.xy + vec2(1.,iResolution.y/iResolution.x)*fragCoord.xy / iResolution.xy;",
"	vec3 acc = vec3(0.0);",
"	float dof = 5.*sin(iGlobalTime*.1);",
"	for (int i=0;i<LAYERS;i++) {",
"		float fi = float(i);",
"		vec2 q = uv*(1.+fi*DEPTH);",
"		q += vec2(q.y*(WIDTH*mod(fi*7.238917,1.)-WIDTH*.5),SPEED*iGlobalTime/(1.+fi*DEPTH*.03));",
"		vec3 n = vec3(floor(q),31.189+fi);",
"		vec3 m = floor(n)*.00001 + fract(n);",
"		vec3 mp = (31415.9+m)/fract(p*m);",
"		vec3 r = fract(mp);",
"		vec2 s = abs(mod(q,1.)-.5+.9*r.xy-.45);",
"		s += .01*abs(2.*fract(10.*q.yx)-1.); ",
"		float d = .6*max(s.x-s.y,s.x+s.y)+max(s.x,s.y)-.01;",
"		float edge = .005+.05*min(.5*abs(fi-5.-dof),1.);",
"		acc += vec3(smoothstep(edge,-edge,d)*(r.x/(1.+.02*fi*DEPTH)));",
"	}",
"	fragColor = vec4(vec3(acc),1.0);",
"}",


		"void main() {",
MMD_SA.MME_PPE_main("JustSnow"),
//			"gl_FragColor = vec4(mix(texel.rgb, color.rgb, ((texel.a == 0.0) ? 1.0 : min(color.a/texel.a, 1.0))), pow(texel.a + color.a * (1.0 - texel.a), 0.5));",
		"}"

	].join( "\n" ),

	_refreshUniforms: function (refresh_all_uniforms) {
MMD_SA.MME_PPE_refreshUniforms.call(this, "JustSnow", refresh_all_uniforms)

var EC = MMD_SA_options.MME.PostProcessingEffects
var e = EC._effects.JustSnow
//DEBUG_show(e.textureID+'/'+Date.now())
if (e.textureID != "MANUAL_ASSIGN")
  return

var composer_last_active_index
for (var i = e._composer_index-1; i >= 0; i--) {
  if (!EC._composers_list[i]._disabled) {
    composer_last_active_index = i
    break
  }
}
e.uniforms[ 'tDiffuse' ].value = EC._composers_list[composer_last_active_index].readBuffer;
	},

	_init: function () {
MMD_SA.MME_PPE_init.call(this, "JustSnow")
	}

};

// init
THREE.JustSnow._init();
