/**
 * https://www.shadertoy.com/view/ldcGRN#
 *
 * Embellished AV
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

THREE.EmbellishedAV = {

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

"/* Embellished audio visualizer by chronos\n",
"// Feel free to use any part of the code and/or improve it further\n",
"// Drop a link in the comments! :)\n",
"// \n",
"// Recommended tracks:\n",
"// https://soundcloud.com/kubbi/pathfinder\n",
"// https://soundcloud.com/wearecastor/rad\n",
"//\n",
"*/\n",
"\n",
"#define DUST_MOTE_COUNT 10\n",
"\n",
"float audio_freq( in sampler2D channel, in float f) { return texture2D( channel, vec2(f, 0.25) ).x; }\n",
"float audio_ampl( in sampler2D channel, in float t) { return texture2D( channel, vec2(t, 0.75) ).x; }\n",
"\n",
"vec3 dust_mote(vec3 color, vec2 pos, vec2 center, float radius, float alpha, float focus){\n",
"    vec2 disp = pos - center;\n",
"    float dist = dot(disp,disp);\n",
"    vec3 mote = (color+0.005)*alpha* vec3(smoothstep(radius * (1.0+focus), radius, dist));\n",
"    return (1.0-mote)*color + mote;\n",
"}\n",
"\n",
"float rnd(float s) { return sin(2923.138674*s); }\n",
"\n",
"vec3 dust_motes(vec3 color, vec2 pos, const int number, float t) {\n",
"    vec3 new_color = color;\n",
"    for(int i = 0; i < DUST_MOTE_COUNT; i++) {\n",
"        float fudge = rnd(float(i));\n",
"        float cycle = fract(t+fudge);\n",
"    	float fade = 2.0 * cycle * (1.0 - cycle);\n",
"        vec2 center = vec2(fudge+sin(t*fudge+fudge), 1.1-cycle*2.0+rnd(fudge));\n",
"        new_color = dust_mote(new_color, pos, center, 0.01+0.007*fudge, 0.5*fade, 0.6 + 0.4*fudge); \n",
"    }\n",
"    return new_color;\n",
"}\n",
"\n",
"vec3 B2_spline(vec3 x) { // returns 3 B-spline functions of degree 2\n",
"    vec3 t = 3.0 * x;\n",
"    vec3 b0 = step(0.0, t)     * step(0.0, 1.0-t);\n",
"	vec3 b1 = step(0.0, t-1.0) * step(0.0, 2.0-t);\n",
"	vec3 b2 = step(0.0, t-2.0) * step(0.0, 3.0-t);\n",
"	return 0.5 * (\n",
"    	b0 * pow(t, vec3(2.0)) +\n",
"    	b1 * (-2.0*pow(t, vec3(2.0)) + 6.0*t - 3.0) + \n",
"    	b2 * pow(3.0-t,vec3(2.0))\n",
"    );\n",
"}\n",
"\n",
"void mainImage( out vec4 fragColor, in vec2 fragCoord ) {\n",
"	vec2 uv = fragCoord.xy / iResolution.xy;\n",
"    uv.y += 0.02 * sin(3.0*uv.x+iGlobalTime / 2.0);\n",
"    vec2 centered = 2.0 * uv - 1.0;\n",
"    float intro = smoothstep(0.0, 100.0, iGlobalTime);\n",
"    centered.y -=  intro - 1.0;\n",
"    float sample0 = audio_ampl(iChannel0, 0.02);\n",
"    centered /= 1.0 + 0.03*(sample0-0.5);\n",
"    centered.x *= 0.97 + 0.01*(1.0 + cos(iGlobalTime));\n",
"    float mirrored = abs(centered.x);\n",
"    centered.x *= iResolution.x / iResolution.y;\n",
"    \n",
"    float dist2 = dot(centered, centered);\n",
"    float clamped_dist = smoothstep(0.0, 1.0, dist2);\n",
"    float arclength    = abs(atan(centered.y, centered.x) / radians(360.0))+0.01;\n",
"    float shine_shift = 0.15-centered.y;\n",
"    \n",
"    float sample1 = audio_freq(iChannel0, mirrored + 0.01);\n",
"    float sample2 = audio_ampl(iChannel0, clamped_dist);\n",
"    float sample3 = audio_ampl(iChannel0, arclength);\n",
"    float sample4 = audio_freq(iChannel0, 0.01+.05*mirrored/(shine_shift));\n",
"\n",
"    // Color variation functions\n",
"    float t = iGlobalTime / 100.0;\n",
"    float polychrome = (1.0 + sin(t*10.0))/2.0; // 0 -> uniform color, 1 -> full spectrum\n",
"    vec3 spline_args = fract(vec3(polychrome*uv.x-t) + vec3(0.0, -1.0/3.0, -2.0/3.0));\n",
"    vec3 spline = B2_spline(spline_args);\n",
"    \n",
"    float f = abs(centered.y);\n",
"    vec3 base_color  = vec3(1.0, 1.0, 1.0) - f*spline;\n",
"    vec3 flame_color = pow(base_color, vec3(3.0));\n",
"    vec3 disc_color  = 0.20 * base_color;\n",
"    vec3 wave_color  = 0.10 * base_color;\n",
"    vec3 flash_color = 0.05 * base_color;\n",
"    \n",
"    float disp_dist = smoothstep(-0.2, -0.1, sample3-dist2);\n",
"    disp_dist *= (1.0 - disp_dist);\n",
"	\n",
"    vec3 color = vec3(0.0);\n",
"    \n",
"    float shine = (sample4)*smoothstep(1.5, 0.0, shine_shift)*smoothstep(0.05, 0.3, shine_shift);\n",
"    shine = pow(shine, 5.0);\n",
"    \n",
"    // spline debug\n",
"    // vec3 s = smoothstep(-0.01, 0.01, spline-uv.y); color += (1.0-s) * s;\n",
"    \n",
"    float v = abs(centered.y);\n",
"    color += flame_color * smoothstep(v, v*8.0, sample1);\n",
"    color += disc_color  * smoothstep(0.5, 1.0, sample2) * (1.0 - clamped_dist);\n",
"    color += flash_color * smoothstep(0.5, 1.0, sample3) * clamped_dist;\n",
"    color += wave_color  * disp_dist;\n",
"    color = dust_motes(color, centered+sample0*0.03-0.06, 10, t*10.0);\n",
"    color += intro * intro*flame_color * shine;\n",
"    color = pow(color, vec3(0.4545));\n",
"	fragColor = vec4(color, 1.0);\n",
"}",


		"void main() {",
MMD_SA.MME_PPE_main("EmbellishedAV"),
		"}"

	].join( "\n" ),

	_refreshUniforms: function (refresh_all_uniforms) {
MMD_SA.MME_PPE_refreshUniforms.call(this, "EmbellishedAV", refresh_all_uniforms, { iGlobalTime:{ base:120 } })
//e.uniforms[ 'iGlobalTime' ].value = performance.now()/1000  +120;
	},

	_init: function () {
MMD_SA.MME_PPE_init.call(this, "EmbellishedAV", ['[music canvas]'])
	}

};

// init
THREE.EmbellishedAV._init();
