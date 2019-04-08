/**
 * https://www.shadertoy.com/view/4sXGRn
 *
 * Deform Relief Tunnel
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

THREE.DeformReliefTunnel = {

	uniforms: {

"iGlobalTime2": { type: "f", value:0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

"uniform float iGlobalTime2;",

"#define FORWARD_SPEED 0.5",


"\/\/ Created by inigo quilez - iq\/2013 ",
"\/\/ License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License. ",
" ",
"void mainImage( out vec4 fragColor, in vec2 fragCoord ) ",
"{ ",
"    vec2 p = -1.0 + 2.0 * fragCoord.xy / iResolution.xy; ",
"    vec2 uv; ",
" ",
"    float r = sqrt( dot(p,p) ); ",
"  ",
"    float a = atan(p.y,p.x) + 0.75*sin(0.5*r-0.5* iGlobalTime2); ",
"  ",
" float h = (0.5 + 0.5*cos(9.0*a)); ",
" ",
" float s = smoothstep(0.4,0.5,h); ",
" ",
"    uv.x = iGlobalTime * FORWARD_SPEED + 1.0\/( r + .1*s); ",
"    uv.y = 3.0*a\/3.1416; ",
" ",
"    vec3 col = texture2D(iChannel0,uv).xyz; ",
"\/\/ col *= 1.25; ",
" ",
"    float ao = smoothstep(0.0,0.3,h)-smoothstep(0.5,1.0,h); ",
//"    col *= 1.0-0.6*ao*r; ",
//" col *= r*r; ",

"float shadow = 1.0-0.6*ao*r;",
"shadow *= r*r;",

'#ifdef SOLID_BG',
'col *= shadow;',
'shadow = 1.0;',
'#endif',

" ",
"    fragColor = vec4(col, shadow); ",
"}",


		"void main() {",
MMD_SA.MME_PPE_main("DeformReliefTunnel"),
		"}"

	].join( "\n" ),

	_refreshUniforms: function (refresh_all_uniforms) {
MMD_SA.MME_PPE_refreshUniforms.call(this, "DeformReliefTunnel", refresh_all_uniforms, { iGlobalTime:null })

var EC = MMD_SA_options.MME.PostProcessingEffects
var e = EC._effects.DeformReliefTunnel

var t_last = this._time_last
var t = this._time_last = performance.now()/1000;
if (!t_last) {
  t_last = t
  this._time_delta = 0
}

var beat = (EV_usage_sub && EV_usage_sub.BD) ? EV_usage_sub.BD.beat : 0 //EV_usage_float/100
beat = EC.effects_by_name.DeformReliefTunnel._EV_usage_PROCESS(beat, 0.1)

var t_delta = t - t_last
this._time_delta += t_delta * beat*3

e.uniforms[ 'iGlobalTime' ].value  = t
e.uniforms[ 'iGlobalTime2' ].value = t + this._time_delta
	},

	_init: function () {
var EC = MMD_SA_options.MME.PostProcessingEffects
MMD_SA.MME_PPE_init.call(this, "DeformReliefTunnel", [EC.effects_by_name.DeformReliefTunnel.tex0||System.Gadget.path + '/images/ST_tex01.jpg'])
	}

};

// init
THREE.DeformReliefTunnel._init();
