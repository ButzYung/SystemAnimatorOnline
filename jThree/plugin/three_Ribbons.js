/**
 * https://www.shadertoy.com/view/lds3zr#
 *
 * Ribbons
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

THREE.Ribbons = {

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

"",
"\/\/-----------------------------------------------------------------------------",
"\/\/ Utils",
"\/\/-----------------------------------------------------------------------------",

// 'global variable initializers must be constant expressions' error in WebGL2. Use 'define' instead.
//"float t = iGlobalTime*.5;",
"#define t iGlobalTime*.5",

"",
"vec3 rotateY(vec3 v, float x)",
"{",
"    return vec3(",
"        cos(x)*v.x - sin(x)*v.z,",
"        v.y,",
"        sin(x)*v.x + cos(x)*v.z",
"    );",
"}",
"",
"vec3 rotateX(vec3 v, float x)",
"{",
"    return vec3(",
"        v.x,",
"        v.y*cos(x) - v.z*sin(x),",
"        v.y*sin(x) + v.z*cos(x)",
"    );",
"}",
"",
"vec3 rotateZ(vec3 v, float x)",
"{",
"    return vec3(",
"        v.x*cos(x) - v.y*sin(x),",
"        v.x*sin(x) + v.y*cos(x),",
"        v.z",
"    );",
"}",
"\/\/-----------------------------------------------------------------------------",
"\/\/ Scene\/Objects",
"\/\/-----------------------------------------------------------------------------",
"float box(vec3 p, vec3 pos, vec3 size)",
"{",
"  return max(max(abs(p.x-pos.x)-size.x,abs(p.y-pos.y)-size.y),abs(p.z-pos.z)-size.z);",
"}",
"",
"",
"float ribbon1(vec3 p)",
"{",
"  return box(p,vec3(cos(p.z)*.5,sin(p.z+p.x)*.5,.0),vec3(.02,0.02,3.5+t));",
"}",
"float ribbon2(vec3 p)",
"{",
"  return box(p,vec3(cos(p.z+1.5+p.x)*.6,sin(p.z+1.)*.3,.0),vec3(.02,0.02,3.+t));",
"}",
"float ribbon3(vec3 p)",
"{",
"  return box(p,vec3(sin(p.z+p.y)*.4,cos(p.z+p.x)*.5,.0),vec3(.02,0.02,4.+t));",
"}",
"float ribbon4(vec3 p)",
"{",
"  return box(p,vec3(sin(p.z+1.5+p.x)*.5,cos(p.z+1.5)*.6,.0),vec3(.02,0.02,2.+t));",
"}",
"float scene(vec3 p)",
"{",
"  float d = .5-abs(p.y);",
"  d = min(d, ribbon1(p) );",
"  d = min(d, ribbon2(p) );",
"  d = min(d, ribbon3(p) );",
"  d = min(d, ribbon4(p) );",
"  ",
"  return d;",
"}",
"",
"\/\/-----------------------------------------------------------------------------",
"\/\/ Raymarching tools",
"\/\/-----------------------------------------------------------------------------",
"\/\/Raymarche by distance field",
"vec3 Raymarche(vec3 org, vec3 dir, int step)",
"{",
"  float d=0.0;",
"  vec3 p=org;",
"  ",
"  for(int i=0; i<64; i++)",
"  {",
"    d = scene(p);",
"    p += d * dir;",
"  }",
"  ",
"  return p;",
"}",
"\/\/get Normal",
"vec3 getN(vec3 p)",
"{",
"  vec3 eps = vec3(0.01,0.0,0.0);",
"  return normalize(vec3(",
"    scene(p+eps.xyy)-scene(p-eps.xyy),",
"    scene(p+eps.yxy)-scene(p-eps.yxy),",
"    scene(p+eps.yyx)-scene(p-eps.yyx)",
"  ));",
"}",
"",
"\/\/Ambiant Occlusion",
"float AO(vec3 p, vec3 n)",
"{",
"  float dlt = 0.1;",
"  float oc = 0.0, d = 1.0;",
"  for(int i = 0; i<6; i++)",
"  {",
"    oc += (float(i) * dlt - scene(p + n * float(i) * dlt)) \/ d;",
"    d *= 2.0;",
"  }",
"  return clamp(1.0 - oc, 0.0, 1.0);",
"}",
"",
"\/\/-----------------------------------------------------------------------------",
"\/\/ Main Loop",
"\/\/-----------------------------------------------------------------------------",
"void mainImage( out vec4 fragColor, in vec2 fragCoord )",
"{",
"  vec4 color = vec4(0.0);",
"  float bass = texture2D( iChannel0, vec2(20.\/256.,0.25) ).x*.75+texture2D( iChannel0, vec2(50.\/256.,0.25) ).x*.25;",
"  vec2 v = -1.0 + 2.0 * fragCoord.xy \/ iResolution.xy;",
"  v.x *= iResolution.x\/iResolution.y;",
"  ",
"  vec3 org = vec3(texture2D( iChannel0, vec2(1.\/256.,0.25) ).x*.2+1.,+0.3+bass*.05,t+5.);",
"  vec3 dir = normalize(vec3(v.x,-v.y,2.));",
"  dir = rotateX(dir,.15);",
"  dir = rotateY(dir,2.8);",
"  ",
"  ",
"  vec3 p = Raymarche(org,dir,48);",
"  vec3 n = getN(p);",
"  ",
"  ",
"    color = vec4( max( dot(n.xy*-1.,normalize(p.xy-vec2(.0,-.1))),.0)*.01 );",
"  color += vec4(1.0,0.3,0.0,1.0)\/(ribbon1(p-n*.01)*20.+.75)*pow(bass,2.)*3.;",
"  color += vec4(0.5,0.3,0.7,1.0)\/(ribbon2(p-n*.01)*20.+.75)*pow(texture2D( iChannel0, vec2(64.\/256.,0.25) ).x,2.)*2.;",
"  color += vec4(0.0,0.5,1.0,1.0)\/(ribbon3(p-n*.01)*20.+.75)*pow(texture2D( iChannel0, vec2(128.\/256.,0.25) ).x,2.)*5.;",
"  color += vec4(0.0,1.0,0.2,1.0)\/(ribbon4(p-n*.01)*20.+.75)*pow(texture2D( iChannel0, vec2(200.\/256.,0.25) ).x,2.)*5.;",
"  color *= AO(p,n);",
"  color = mix(color,vec4(0.),vec4((min(distance(org,p)*.05,1.0))));",
"  ",
"  ",
"  fragColor = color;",
"",
"}",


		"void main() {",
MMD_SA.MME_PPE_main("Ribbons"),
		"}"

	].join( "\n" ),

	_refreshUniforms: function (refresh_all_uniforms) {
MMD_SA.MME_PPE_refreshUniforms.call(this, "Ribbons", refresh_all_uniforms)
	},

	_init: function () {
MMD_SA.MME_PPE_init.call(this, "Ribbons", ['[music canvas]'])
	}

};

// init
THREE.Ribbons._init();
