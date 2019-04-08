/**
 * https://www.shadertoy.com/view/ldlXRS
 *
 * Noise Animation Electric
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

THREE.NoiseAnimationElectric = {

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

"//Noise animation - Electric",
"//by nimitz (stormoid.com) (twitter: @stormoid)",
"",
"//The domain is displaced by two fbm calls one for each axis.",
"//Turbulent fbm (aka ridged) is used for better effect.",
"",
"#define time iGlobalTime*0.15",
"#define tau 6.2831853",
"",
"mat2 makem2(in float theta){float c = cos(theta);float s = sin(theta);return mat2(c,-s,s,c);}",
"float noise( in vec2 x ){return texture2D(iChannel0, x*.01).x;}",
"",
"float fbm(in vec2 p)",
"{	",
"	float z=2.;",
"	float rz = 0.;",
"	vec2 bp = p;",
"	for (float i= 1.;i < 6.;i++)",
"	{",
"		rz+= abs((noise(p)-0.5)*2.)/z;",
"		z = z*2.;",
"		p = p*2.;",
"	}",
"	return rz;",
"}",
"",
"float dualfbm(in vec2 p)",
"{",
"    //get two rotated fbm calls and displace the domain",
"	vec2 p2 = p*.7;",
"	vec2 basis = vec2(fbm(p2-time*1.6),fbm(p2+time*1.7));",
"	basis = (basis-.5)*.2;",
"	p += basis;",
"	",
"	//coloring",
"	return fbm(p*makem2(time*0.2));",
"}",
"",
"float circ(vec2 p) ",
"{",
"	float r = length(p);",
"	r = log(sqrt(r));",
"	return abs(mod(r*4.,tau)-3.14)*3.+.2;",
"",
"}",
"",
"void mainImage( out vec4 fragColor, in vec2 fragCoord )",
"{",
"	//setup system",
"	vec2 p = fragCoord.xy / iResolution.xy-0.5;",
"	p.x *= iResolution.x/iResolution.y;",
"	p*=4.;",
"	",
"    float rz = dualfbm(p);",
"	",
"	//rings",
"	p /= exp(mod(time*10.,3.14159));",
//"	rz *= pow(abs((0.1-circ(p))),.9);",

"	rz *= pow(abs((0.1-circ(p))),.9 /ST_opacity) /pow(ST_opacity, 2.0);",

"	",
"	//final color",
"	vec3 col = vec3(.2,0.1,0.4)/rz;",
"	col=pow(abs(col),vec3(.99));",
"	fragColor = vec4(col,1.);",
"}",


		"void main() {",
MMD_SA.MME_PPE_main("NoiseAnimationElectric"),
		"}"

	].join( "\n" ),

	_refreshUniforms: function (refresh_all_uniforms) {
MMD_SA.MME_PPE_refreshUniforms.call(this, "NoiseAnimationElectric", refresh_all_uniforms, { ST_opacity:{ pow:0.5 } })
//e.uniforms[ 'ST_opacity' ].value = (MMD_SA.music_mode) ? 0.25 + Math.pow(EC.effects_by_name.NoiseAnimationElectric._EV_usage_PROCESS(beat, 0.2), 0.5) * 0.75 : 1
	},

	_init: function () {
MMD_SA.MME_PPE_init.call(this, "NoiseAnimationElectric", [System.Gadget.path + '/images/ST_tex12.png'], { ST_opacity:{} })
	}

};

// init
THREE.NoiseAnimationElectric._init();
