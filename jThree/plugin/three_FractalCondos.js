/**
 * https://www.shadertoy.com/view/ldSSDV
 *
 * Fractal Condos
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

THREE.FractalCondos = {

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

"// Fractal Condos by eiffie",
"// This is a test of an auto-overstep method and lighting without normals.",
"// You can test the speed difference by commenting this out:",
"#define USE_OVERSTEP",
"#define BISECT_ERROR",
"// v3 added fast anti-alias where the first ray finds the starting depth",
"#define NUMRAYS 2",
"",
"#define time iGlobalTime",
"#define size iResolution",
"",
"vec2 rep(vec2 p, vec2 a){return abs(mod(p+a,a*2.0)-a);}",
"",
"float DE(vec3 z0){//a mod of amazing surface by kali ... a mod of amazingBox by tglad",
"	z0.xz=rep(z0.xz,vec2(4.25,4.25));",
"	vec4 z = vec4(z0,1.0),c=vec4(0.0,1.0,0.8,0.0);",
"	float dS=1000.0,dB=z0.y+1.41;",
"	for (int n = 0; n < 3; n++) {",
"		z.xz=clamp(z.xz, -1.0, 1.0) *2.0-z.xz;",
"		z*=2.0/clamp(dot(z.xyz,z.xyz),1.0,1.18);",
"		z+=c;",
"		dS=min(dS,(length(max(abs(z.xyz)-vec3(0.82,2.83,0.82),0.0))-0.33)/z.w);",
"	}",
"	float dG=dS+0.037;//interior is glass",
"	z.xyz=abs(mod(z.xyz,0.4)-0.2);",
"	dS=max(dS,-max(z.y-0.16,min(z.x,z.z)-0.15)/z.w);//cut out windows",
"	return min(dS,min(dG,dB))*0.95;",
"}",
"float CE(vec3 z0, out vec3 mcol, out bool bLite){//same as DE for coloring",
"	z0.xz=rep(z0.xz,vec2(4.25,4.25));",
"	vec4 z = vec4(z0,1.0),c=vec4(0.0,1.0,0.8,0.0);",
"	float dS=1000.0,dB=z0.y+1.41;",
"	for (int n = 0; n < 3; n++) {",
"		z.xz=clamp(z.xz, -1.0, 1.0) *2.0-z.xz;",
"		z*=2.0/clamp(dot(z.xyz,z.xyz),1.0,1.18);",
"		z+=c;",
"		if(n==2)mcol=vec3(0.6+abs(fract(z.x*z.y*0.5)*0.4-0.2));",
"		dS=min(dS,(length(max(abs(z.xyz)-vec3(0.82,2.83,0.82),0.0))-0.33)/z.w);",
"	}",
"	float dG=dS+0.037;",
"	c=floor(z*2.5);",
"	z.xyz=abs(mod(z.xyz,0.4)-0.2);",
"	dS=max(dS,-max(z.y-0.16,min(z.x,z.z)-0.15)/z.w);",
"	if(dB<dS)mcol=vec3(0.5);",
"	else mcol*=vec3(1.0,0.9,0.7);",
"	bLite=false;",
"	if(dG<dS && dG<dB){",
"		mcol=vec3(0.3,0.4+fract((c.x+c.z-c.y)*0.32454213)*0.3,0.5)*30.0*(sqrt(z.z)+0.13)*pow(dS-dG,0.6);",
"		if(sin((1.0+time*0.01)*(4.0*c.x-c.y+3.0*c.z))<-0.8 +ST_opacity)bLite=true;",
"	}",
"	return min(dS,min(dG,dB));",
"}",
"float ShadAO(vec3 ro, vec3 rd, float rnd){",
"	float res=1.0,t=0.01*rnd;",
"	for(int i=0;i<10;i++){",
"		float d=DE(ro+rd*t)*2.0+0.01;",
"		res=min(res,(d*d)/(t*t));",
"		t+=d;",
"	}",
"	return clamp(res,0.1,1.0);",
"}",
"float fakefbm(vec2 p){",
"	return 0.5+0.5*(sin(p.x+cos(p.y))+sin(p.y+cos(p.x)));",
"}",
"//camera bs",
"mat3 lookat(vec3 fw,vec3 up){",
"	fw=normalize(fw);vec3 rt=normalize(cross(fw,up));return mat3(rt,cross(rt,fw),fw);",
"}",
"float getZ(float t){",
"	t=mod(t,6.0)-3.0;",
"	float s=sign(t);",
"	t=abs(t);",
"	if(t>2.0)return 0.45*s;",
"	else if(t>1.0)return 4.125*s;",
"	return 1.55*s;",
"}",
"vec3 path(float t){",
"	vec3 p=vec3(0.0);",
"	p.x=cos(3.1416*t)*4.25;",
"	float w=mod(t/6.0,2.0);",
"	if(w<1.0){",
"		float z1=getZ(t),z2=getZ(t+sign(fract(t)-0.5));",
"		z2=(z1+z2)*0.5;",
"		p.z=mix(z1,z2,pow(2.0*abs(fract(t)-0.5),8.0));",
"	}else{",
"		p.z=-sin(3.1416*t)*3.75;",
"		p.y=3.0*(1.0-2.0*abs(w-1.5));",
"	}",
"	p.y=mix(-0.52,p.y+sin(5.0*t),clamp(abs(abs(p.z)-4.125)*0.4,0.0,1.0));",
"	p.y=min(p.y,2.0+sin(t*10.0));",
"	return p;",
"}",
"",
"void mainImage( out vec4 fragColor, in vec2 fragCoord ){",
"  float t0=0.0,pw=2.0/size.y,iHit=0.0;",
"  vec3 sum=vec3(0.0),ro=path(time*0.05);",
"  vec2 aa=vec2(0.5);",
"  for(int RAY=0;RAY<NUMRAYS;RAY++){",
"	vec2 co=fragCoord.xy+13.0*vec2(float(RAY))-17.0*vec2(fract(time*6.6));",
"	float rnd=fract(sin(co.x+cos(co.y))*4317.6219);",
"	vec3 rd=lookat(vec3(sin(time*0.12)*2.5,0.0,0.0)-ro*0.6,vec3(0.0,1.0,0.0))*normalize(vec3((2.0*(fragCoord.xy+aa)-size.xy)/size.y,1.0));",
"	float t=t0+(abs(DE(ro+rd*t0))-0.001)*rnd;//total distance, AA rays can start ahead",
"	float d=1.0;	//estimated distance",
"	float pd=10.0;//previous estimate",
"	float os=0.0;	//overstep",
//64
"	for(int i=0;i<64;i++){",
"		d=abs(DE(ro+rd*t))-0.001;//making it hollow",
"#ifdef USE_OVERSTEP",
"		if(d>os){		//we have NOT stepped over anything",
"			os=0.5*d*d/pd;//calc overstep based on ratio of this step to last",
"			t+=d+os;	//add in the overstep",
"			pd=d;	//save this step length for next calc",
"		}else{		//we MAY have stepped over something",
"#ifdef BISECT_ERROR",
"			os*=0.5;	//bisect overstep",
"			t-=os;	//back up",
"			if(os>0.001)d=1.0;	//don't bail unless the overstep was small (and d of course)",
"			else t+=d+os;//we are going to bail so add in this last distance",
"#else",
"			t-=os;d=10.0;os=0.0;//back up all the way to previous pos and don't bail",
"#endif			",
"		}",
"#else",
"		t+=d; //don't use overstepping",
"#endif",
"		if(t0==0.0 && d<pw*t)t0=t-pw*t;//start the other AA rays at this distance",
//t>100.0
"		if(t>100.0 || d<0.001)break;",
"	}",
"	if(t0==0.0)t0=t-pw*t;//even if we run out of steps start the other AA rays at this dist",
"	if(d<pw*(1.0+t)){//close enough to color a surface",
"		bool bLite=false;",
"		vec3 mcol;",
"		t+=CE(ro+rd*t,mcol,bLite);",
"		if(!bLite)mcol*=ShadAO(ro+rd*t,normalize(vec3(0.4,0.7,-0.3)),rnd);",
"		else mcol*=1.5;",
"		rd=ro;rd.y-=3.0;",
"		mcol/=(0.06*dot(rd,rd));",
"		mcol=mix(mcol,clamp(mcol,0.1,0.2),clamp(0.0,1.0,0.05*t));",
"		sum+=mcol;iHit+=1.0;",
"	}else if(RAY>0 || t>25.0){//went far enough for a sky sample",
"		vec3 col=vec3(rd.y+0.05);",
"		if(rd.y>0.0){//tweak the sky",
"			float c=fakefbm(vec2(atan(rd.x,rd.z)*6.0,rd.y*20.0));",
"			col.g+=0.01+(c*2.0-rd.y*8.0)*0.01;",
"			c=0.5*rnd*rd.y;",
"			col.br+=c*mix(vec2(1.0,0.0),vec2(0.0,1.0),rd.x*0.5+0.5);",
"		}",
"		col=mix(max(col,vec3(0.0)),max(col,vec3(0.1)),clamp(0.0,1.0,0.1*t));",
"		sum+=col;iHit+=1.0;",
"	}",
"	if(NUMRAYS==2)aa=vec2(0.0);",
"	else aa=vec2(rnd,fract(sin(rnd*43637.234+cos(rnd*13454.9767))*4231.5629))+vec2(0.5);",
"  }",
"  sum/=iHit;",
"  fragColor=vec4(sum*1.5,1.0);",

'fragColor.rgb = min(fragColor.rgb, 1.0);',

'fragColor.rgb = clamp((fragColor.rgb - 0.5) * 1.15 + 0.5 + 0.05, 0.0, 1.0);',
/*
'vec3 color_temp_self_overlay = fragColor.rgb * 0.5;',
'color_temp_self_overlay.r = (fragColor.r < 0.5) ? fragColor.r * color_temp_self_overlay.r * 2.0 : 1.0 - 2.0 * (1.0 - fragColor.r) * (1.0 - color_temp_self_overlay.r);',
'color_temp_self_overlay.g = (fragColor.g < 0.5) ? fragColor.g * color_temp_self_overlay.g * 2.0 : 1.0 - 2.0 * (1.0 - fragColor.g) * (1.0 - color_temp_self_overlay.g);',
'color_temp_self_overlay.b = (fragColor.b < 0.5) ? fragColor.b * color_temp_self_overlay.b * 2.0 : 1.0 - 2.0 * (1.0 - fragColor.b) * (1.0 - color_temp_self_overlay.b);',
'fragColor.rgb = mix(fragColor.rgb, color_temp_self_overlay, 0.5);',
*/
"} ",


		"void main() {",
MMD_SA.MME_PPE_main("FractalCondos"),
		"}"

	].join( "\n" ),

	_refreshUniforms: function (refresh_all_uniforms) {
//e.uniforms[ 'ST_opacity' ].value = (MMD_SA.music_mode) ? -0.2 + EC.effects_by_name.FractalCondos._EV_usage_PROCESS(beat, 0.2) : 0
MMD_SA.MME_PPE_refreshUniforms.call(this, "FractalCondos", refresh_all_uniforms, { ST_opacity:{ min:-0.2, max:1, idle:0.001 } })
	},

	_init: function () {
MMD_SA.MME_PPE_init.call(this, "FractalCondos", [], { ST_opacity:{} })
	}

};

// init
THREE.FractalCondos._init();
