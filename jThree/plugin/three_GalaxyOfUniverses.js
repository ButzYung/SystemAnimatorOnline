/**
 * https://www.shadertoy.com/view/MdXSzS
 *
 * Galaxy Of Universes
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

THREE.GalaxyOfUniverses = {

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

// 90
"#define STAR_DENSITY 50",


'// https://www.shadertoy.com/view/MdXSzS',
'// The Big Bang - just a small explosion somewhere in a massive Galaxy of Universes.',
'// Outside of this there\'s a massive galaxy of \'Galaxy of Universes\'... etc etc. :D',
'',
'// To fake a perspective it takes advantage of the screen being wider than it is tall.',
'',
'void mainImage( out vec4 fragColor, in vec2 fragCoord )',
'{',
'	vec2 uv = (fragCoord.xy / iResolution.xy) - .5;',
'	float t = iGlobalTime * .1 + ((.25 + .05 * sin(iGlobalTime * .1))/(length(uv.xy) + .07)) * 2.2;',
'	float si = sin(t);',
'	float co = cos(t);',
'	mat2 ma = mat2(co, si, -si, co);',
'',
'	float v1, v2, v3;',
'	v1 = v2 = v3 = 0.0;',
'	',
'	float s = 0.0;',
'	for (int i = 0; i < STAR_DENSITY; i++)',
'	{',
'		vec3 p = s * vec3(uv, 0.0);',
'		p.xy *= ma;',
'		p += vec3(.22, .3, s - 1.5 - sin(iGlobalTime * .13) * .1);',
'		for (int i = 0; i < 8; i++)	p = abs(p) / dot(p,p) - 0.659;',
'		v1 += dot(p,p) * .0015 * (1.8 + sin(length(uv.xy * 13.0) + .5  - iGlobalTime * .2));',
'		v2 += dot(p,p) * .0013 * (1.5 + sin(length(uv.xy * 14.5) + 1.2 - iGlobalTime * .3));',
'		v3 += length(p.xy*10.) * .0003;',
'		s  += .035;',
'	}',
'	',
'	float len = length(uv);',
'	v1 *= smoothstep(.7, .0, len);',
'	v2 *= smoothstep(.5, .0, len);',
'	v3 *= smoothstep(.9, .0, len);',
'	',
'	vec3 col = vec3( v3 * (1.5 + sin(iGlobalTime * .2) * .4),',
'					(v1 + v3) * .3,',
'					 v2) + smoothstep(0.2, .0, len) * .85 + smoothstep(.0, .6, v3) * .3;',
'',
'	fragColor=vec4(min(pow(abs(col), vec3(1.2)), 1.0), 1.0);',
'}',


		"void main() {",
MMD_SA.MME_PPE_main("GalaxyOfUniverses"),
		"}"

	].join( "\n" ),

	_refreshUniforms: function (refresh_all_uniforms) {
MMD_SA.MME_PPE_refreshUniforms.call(this, "GalaxyOfUniverses", refresh_all_uniforms, { ST_opacity:{ min:0, pow:0.5 } })
//e.uniforms[ 'ST_opacity' ].value = (MMD_SA.music_mode) ? Math.pow(EC.effects_by_name.GalaxyOfUniverses._EV_usage_PROCESS(beat, 0.2), 0.5) : 1
	},

	_init: function () {
MMD_SA.MME_PPE_init.call(this, "GalaxyOfUniverses", [], { ST_opacity:{} })
	}

};

// init
THREE.GalaxyOfUniverses._init();
