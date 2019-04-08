/**
 * @author Shane - https://www.shadertoy.com/view/4tlSzl
 *
 * Combustible Voronoi
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

THREE.CombustibleVoronoi = {

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

//5
"#define NOISE_LAYERS 5",

"\/* ",
"    Combustible Voronoi Layers",
" --------------------------",
"",
"    The effect itself is nothing new or exciting, just some moving 3D Voronoi layering. ",
"    However, the fire palette might prove useful to some.",
"",
"*\/",
"",
"",
"\/\/ This is my favorite fire palette. It's trimmed down for shader usage, and is based on an ",
"\/\/ article I read at Hugo Elias's site years ago. I'm sure most old people, like me, have ",
"\/\/ visited his site at one time or another:",
"\/\/",
"\/\/ http:\/\/freespace.virgin.net\/hugo.elias\/models\/m_ffire.htm",
"\/\/",
"vec3 firePalette(float i){",
"",
"    float T = 1400. + 1300.*i; \/\/ Temperature range (in Kelvin).",
"    vec3 L = vec3(7.4, 5.6, 4.4); \/\/ Red, green, blue wavelengths (in hundreds of nanometers).",
"    L = pow(L,vec3(5.0)) * (exp(1.43876719683e5\/(T*L))-1.0);",

//-5e8
"float e_level = mix(-1e8, -15e8, ST_opacity);",
"    return 1.0-exp( e_level \/L); \/\/ Exposure level. Set to \"50.\" For \"70,\" change the \"5\" to a \"7,\" etc.",

"}",
"",
"\/\/ Hash function. This particular one probably doesn't disperse things quite as nicely as some ",
"\/\/ of the others around, but it's compact, and seems to work.",
"\/\/",
"vec3 hash33(vec3 p){ ",
"    ",
"    float n = sin(dot(p, vec3(7, 157, 113)));    ",
"    return fract(vec3(2097152, 262144, 32768)*n); ",
"}",
"",
"\/\/ 3D Voronoi: Obviously, this is just a rehash of IQ's original.",
"\/\/",
"float voronoi(vec3 p){",
"",
" vec3 b, r, g = floor(p);",
" p = fract(p); \/\/ \"p -= g;\" works on some GPUs, but not all, for some annoying reason.",
" ",
" \/\/ Maximum value: I think outliers could get as high as \"3,\" the squared diagonal length ",
" \/\/ of the unit cube, with the mid point being \"0.75.\" Is that right? Either way, for this ",
" \/\/ example, the maximum is set to one, which would cover a good part of the range, whilst ",
" \/\/ dispensing with the need to clamp the final result.",
" float d = 1.; ",
"     ",
"    \/\/ I've unrolled one of the loops. GPU architecture is a mystery to me, but I'm aware ",
"    \/\/ they're not fond of nesting, branching, etc. My laptop GPU seems to hate everything, ",
"    \/\/ including multiple loops. If it were a person, we wouldn't hang out. ",
" for(float j = -1.; j < 1.01; j++) {",
"     for(float i = -1.; i < 1.01; i++) {",
"      ",
"      b = vec3(i, j, -1.);",
"      r = b - p + hash33(g+b);",
"      d = min(d, dot(r,r));",
"      ",
"      b.z = 0.0;",
"      r = b - p + hash33(g+b);",
"      d = min(d, dot(r,r));",
"      ",
"      b.z = 1.;",
"      r = b - p + hash33(g+b);",
"      d = min(d, dot(r,r));",
"       ",
"     }",
" }",
" ",
" return d; \/\/ Range: [0, 1]",
"}",
"",
"\/\/ Standard fBm function with some time dialation to give a parallax ",
"\/\/ kind of effect. In other words, the position and time frequencies ",
"\/\/ are changed at different rates from layer to layer.",
"\/\/",
"float noiseLayers(in vec3 p) {",
"",
"    \/\/ Normally, you'd just add a time vector to \"p,\" and be done with ",
"    \/\/ it. However, in this instance, time is added seperately so that ",
"    \/\/ its frequency can be changed at a different rate. \"p.z\" is thrown ",
"    \/\/ in there just to distort things a little more.",
"    vec3 t = vec3(0., 0., p.z+iGlobalTime*1.5);",
"",

"    const int iter = NOISE_LAYERS;",//5; \/\/ Just five layers is enough.",

"    float tot = 0., sum = 0., amp = 1.; \/\/ Total, sum, amplitude.",
"",
"    for (int i = 0; i < iter; i++) {",
"        tot += voronoi(p + t) * amp; \/\/ Add the layer to the total.",
"        p *= 2.0; \/\/ Position multiplied by two.",
"        t *= 1.5; \/\/ Time multiplied by less than two.",
"        sum += amp; \/\/ Sum of amplitudes.",
"        amp *= 0.5; \/\/ Decrease successive layer amplitude, as normal.",
"    }",
"    ",
"    return tot\/sum; \/\/ Range: [0, 1].",
"}",
"",
"void mainImage( out vec4 fragColor, in vec2 fragCoord )",
"{",
"    \/\/ Screen coordinates.",
" vec2 uv = (fragCoord.xy - iResolution.xy*0.5) \/ iResolution.y;",
" ",
" \/\/ Shifting the central position around, just a little, to simulate a ",
" \/\/ moving camera, albeit a pretty lame one.",
" uv += vec2(sin(iGlobalTime*0.5)*0.25, cos(iGlobalTime*0.5)*0.125);",
" ",
"    \/\/ Constructing the unit ray. ",
" vec3 rd = normalize(vec3(uv.x, uv.y, 3.1415926535898\/8.));",
"",
"    \/\/ Rotating the ray about the XY plane, to simulate a rolling camera.",
" float cs = cos(iGlobalTime*0.25), si = sin(iGlobalTime*0.25);",
" rd.xy *= mat2(cs, -si, si, cs);",
" ",
" \/\/ Passing a unit ray multiple into the Voronoi layer function, which ",
" \/\/ is nothing more than an fBm setup with some time dialation.",
" float c = noiseLayers(rd*2.);",
" ",
" \/\/ Optional: Adding a bit of random noise for a subtle dust effect. ",
" c = max(c + dot(hash33(rd)*2.-1., vec3(0.015)), 0.);",
"",
"    \/\/ Coloring:",
"    ",
"    \/\/ Nebula.",
"    c *= sqrt(c)*1.5; \/\/ Contrast.",
"    vec3 col = firePalette(c); \/\/ Palettization.",
"    col = mix(col, col.zyx*0.1+c*0.9, (1.+rd.x+rd.y)*0.45 ); \/\/ Color dispersion.",
"    ",
"    \/\/ The fire palette on its own. Perhaps a little too much fire color.",
"    \/\/ c = pow(c, 1.33)*1.33;",
"    \/\/ vec3 col =  firePalette(c);",
"   ",
"    \/\/ Black and white, just to keep the art students happy. :)",
" \/\/ c *= sqrt(c)*1.5;",
" \/\/ vec3 col = vec3(c);",
" ",
" \/\/ Done.",
" fragColor = vec4(clamp(col, 0., 1.), 1.);",
"}",


		"void main() {",
MMD_SA.MME_PPE_main("CombustibleVoronoi"),
		"}"

	].join( "\n" ),

	_refreshUniforms: function (refresh_all_uniforms) {
MMD_SA.MME_PPE_refreshUniforms.call(this, "CombustibleVoronoi", refresh_all_uniforms, { ST_opacity:{ min:0, idle:0.5 } })
//e.uniforms[ 'ST_opacity' ].value = (MMD_SA.music_mode) ? EC.effects_by_name.CombustibleVoronoi._EV_usage_PROCESS(beat, 0.2) : 0.5
	},

	_init: function () {
MMD_SA.MME_PPE_init.call(this, "CombustibleVoronoi", [], { ST_opacity:{} })
	}

};

// init
THREE.CombustibleVoronoi._init();
