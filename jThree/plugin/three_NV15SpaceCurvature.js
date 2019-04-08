/**
 * https://www.shadertoy.com/view/llj3Rz
 *
 * NV15 Space Curvature
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

THREE.NV15SpaceCurvature = {

	uniforms: {

"iMouse": { type: "v2", value: new THREE.Vector2(0,0) }

,'VisualizerSpacetimeGrid':{type:'i',value:1}, 'VisualizerRainbowBlackhole':{type:'i',value:1}
	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

"uniform vec2 iMouse;",

'uniform bool VisualizerSpacetimeGrid;',
'uniform bool VisualizerRainbowBlackhole;',

// 8-band
//[0-2.7, 2.7-5.7, 5.7-12.1, 12.1-25.6, 25.6-54.1, 54.1-114.5, 114.5-242.1, 242.1-512]
//[0.00263671875, 0.008203125, 0.0173828125, 0.03681640625, 0.07783203125, 0.1646484375, 0.3482421875, 0.73642578125]

((WallpaperEngine_CEF_mode) ?
[
'#define BAND1 0.0555',
'#define BAND2 0.1111',
'#define BAND3 0.1665',
'#define BAND4 0.2222',
'#define BAND5 0.2775',
'#define BAND6 0.3333',
'#define BAND7 0.3885',
'#define BAND8 0.4444',
'#define WIR_BAND_INI 0.015625',
'#define WIR_BAND_DIVIDER 40.0'
].join("\n") : [
'#define BAND1 0.00263671875',
'#define BAND2 0.008203125',
'#define BAND3 0.0173828125',
'#define BAND4 0.03681640625',
'#define BAND5 0.07783203125',
'#define BAND6 0.1646484375',
'#define BAND7 0.3482421875',
'#define BAND8 0.73642578125',
'#define WIR_BAND_INI 0.0',
'#define WIR_BAND_DIVIDER 20.0'
].join("\n")),

"\/\/ Created by inigo quilez - iq\/2015 ",
"\/\/ License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License. ",
" ",
" ",
"vec3 fancyCube( sampler2D sam, in vec3 d, in float s, in float b ) ",
"{ ",
"    vec3 colx = texture2D( sam, 0.5 + s*d.yz\/d.x, b ).xyz; ",
"    vec3 coly = texture2D( sam, 0.5 + s*d.zx\/d.y, b ).xyz; ",
"    vec3 colz = texture2D( sam, 0.5 + s*d.xy\/d.z, b ).xyz; ",
"     ",
"    vec3 n = d*d; ",
"     ",
"    return (colx*n.x + coly*n.y + colz*n.z)\/(n.x+n.y+n.z); ",
"} ",
" ",
" ",
"vec2 hash( vec2 p ) { p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))); return fract(sin(p)*43758.5453); } ",
" ",
"vec2 voronoi( in vec2 x ) ",
"{ ",
"    vec2 n = floor( x ); ",
"    vec2 f = fract( x ); ",
" ",
" vec3 m = vec3( 8.0 ); ",
"    for( int j=-1; j<=1; j++ ) ",
"    for( int i=-1; i<=1; i++ ) ",
"    { ",
"        vec2  g = vec2( float(i), float(j) ); ",
"        vec2  o = hash( n + g ); ",
"        vec2  r = g - f + o; ",
"  float d = dot( r, r ); ",
"        if( d<m.x ) ",
"            m = vec3( d, o ); ",
"    } ",
" ",
"    return vec2( sqrt(m.x), m.y+m.z ); ",
"} ",
" ",
"float shpIntersect( in vec3 ro, in vec3 rd, in vec4 sph ) ",
"{ ",
"    vec3 po = ro - sph.xyz; ",
"     ",
"    float b = dot( rd, po ); ",
"    float c = dot( po, po ) - sph.w*sph.w; ",
"    float h = b*b - c; ",

"h = b + sqrt( h );",
"return -h;",

/*
"     ",
"    if( h>0.0 ) h = -b - sqrt( h ); ",
"     ",
"    return h; ",
*/
"} ",
" ",
"float sphDistance( in vec3 ro, in vec3 rd, in vec4 sph ) ",
"{ ",
" vec3 oc = ro - sph.xyz; ",
"    float b = dot( oc, rd ); ",
"    float c = dot( oc, oc ) - sph.w*sph.w; ",
"    float h = b*b - c; ",
"    float d = sqrt( max(0.0,sph.w*sph.w-h)) - sph.w; ",
"    return d; ",
"} ",
" ",
"float sphSoftShadow( in vec3 ro, in vec3 rd, in vec4 sph, in float k ) ",
"{ ",
"    vec3 oc = sph.xyz - ro; ",
"    float b = dot( oc, rd ); ",
"    float c = dot( oc, oc ) - sph.w*sph.w; ",
"    float h = b*b - c; ",
"    return (b<0.0) ? 1.0 : 1.0 - smoothstep( 0.0, 1.0, k*h\/b ); ",
"}     ",
"    ",
" ",
"vec3 sphNormal( in vec3 pos, in vec4 sph ) ",
"{ ",
"    return (pos - sph.xyz)\/sph.w;     ",
"} ",
" ",
"\/\/======================================================= ",
" ",
"vec3 background( in vec3 d, in vec3 l ) ",
"{ ",
"    vec3 col = vec3(0.0); ",
"         col += 0.5*pow( fancyCube( iChannel1, d, 0.05, 5.0 ).zyx, vec3(2.0) ); ",
"         col += 0.2*pow( fancyCube( iChannel1, d, 0.10, 3.0 ).zyx, vec3(1.5) ); ",
"         col += 0.8*vec3(0.80,0.5,0.6)*pow( fancyCube( iChannel1, d, 0.1, 0.0 ).xxx, vec3(6.0) ); ",
"    float stars = smoothstep( 0.3, 0.7, fancyCube( iChannel1, d, 0.91, 0.0 ).x ); ",
" ",
"     ",
"    vec3 n = abs(d); ",
"    n = n*n*n; ",
"    vec2 vxy = voronoi( 50.0*d.xy ); ",
"    vec2 vyz = voronoi( 50.0*d.yz ); ",
"    vec2 vzx = voronoi( 50.0*d.zx ); ",
"    vec2 r = (vyz*n.x + vzx*n.y + vxy*n.z) \/ (n.x+n.y+n.z); ",
"    col += 0.9 * stars * clamp(1.0-(3.0+r.y*5.0)*r.x,0.0,1.0); ",
" ",
"    col = 1.5*col - 0.2; ",
"    col += vec3(-0.05,0.1,0.0); ",
" ",
"    float s = clamp( dot(d,l), 0.0, 1.0 ); ",
"    col += 0.4*pow(s,5.0)*vec3(1.0,0.7,0.6)*2.0; ",
"    col += 0.4*pow(s,64.0)*vec3(1.0,0.9,0.8)*2.0; ",
"     ",
"    return col; ",
" ",
"} ",
" ",
"\/\/-------------------------------------------------------------------- ",
" ",
"vec4 sph1 = vec4( 0.0, 0.0, 0.0, 1.0 ); ",

"vec4 sph_eq1,sph_eq2,sph_eq3,sph_eq4,sph_eq5,sph_eq6,sph_eq7,sph_eq8;",

" ",
"float rayTrace( in vec3 ro, in vec3 rd, vec4 k ) ",
"{ ",
"    return shpIntersect( ro, rd, k ); ",
"} ",
" ",
"float map( in vec3 pos ) ",
"{ ",

'float d1,d2,d3,d4,d5,d6,d7,d8, d;',
'float d0 = length( pos.xz - sph1.xz );',
'if (SA_idle || !VisualizerRainbowBlackhole) {',
'  d = d0;',
'}',
'else {',
'  d1 = length( pos.xz - sph_eq1.xz );',
'  d2 = length( pos.xz - sph_eq2.xz );',
'  d3 = length( pos.xz - sph_eq3.xz );',
'  d4 = length( pos.xz - sph_eq4.xz );',
'  d5 = length( pos.xz - sph_eq5.xz );',
'  d6 = length( pos.xz - sph_eq6.xz );',
'  d7 = length( pos.xz - sph_eq7.xz );',
'  d8 = length( pos.xz - sph_eq8.xz );',
'  d = -log( exp(-d0) + exp(-d1)*sph_eq1.w*2.0 + exp(-d2)*sph_eq2.w*2.0 + exp(-d3)*sph_eq3.w*2.0 + exp(-d4)*sph_eq4.w*2.0 + exp(-d5)*sph_eq5.w*2.0 + exp(-d6)*sph_eq6.w*2.0 + exp(-d7)*sph_eq7.w*2.0 + exp(-d8)*sph_eq8.w*2.0);',
'}',

//"    float d = length( pos.xz - sph1.xz ); ",
"    float h = 1.0-2.0\/(1.0 + 0.3*d*d); ",
"    return pos.y - h; ",
"} ",
" ",
"float rayMarch( in vec3 ro, in vec3 rd, float tmax ) ",
"{ ",
"    float t = 0.0; ",
"     ",
"    \/\/ bounding plane ",
"    float h = (1.0-ro.y)\/rd.y; ",
"    if( h>0.0 ) t=h; ",
" ",
"    \/\/ raymarch 30 steps     ",
"    for( int i=0; i<30; i++ )     ",
"    {         ",
"        vec3 pos = ro + t*rd; ",
"        float h = map( pos ); ",
"        if( h<0.001 || t>tmax ) break; ",
"        t += h; ",
"    } ",
"    return t;     ",
"} ",
" ",
"vec3 render( in vec3 ro, in vec3 rd, out float _alpha ) ",
"{ ",

"_alpha = 0.0;",

"    vec3 lig = normalize( vec3(1.0,0.2,1.0) ); ",
"    vec3 col = background( rd, lig ); ",

'_alpha = (col.x + col.y + col.z) / 3.0;',

"     ",
"    \/\/ raytrace stuff     ",
//"    float t = rayTrace( ro, rd, sph1 ); ",

'float t0 = rayTrace( ro, rd, sph1 );',
'vec4 sph = sph1;',

'float t1,t2,t3,t4,t5,t6,t7,t8,t;',
'vec3 eq;',

'if (SA_idle || !VisualizerRainbowBlackhole) {',
'  t = t0;',
'}',
'else {',
'  t1 = rayTrace( ro, rd, sph_eq1 );',
'  t2 = rayTrace( ro, rd, sph_eq2 );',
'  t3 = rayTrace( ro, rd, sph_eq3 );',
'  t4 = rayTrace( ro, rd, sph_eq4 );',
'  t5 = rayTrace( ro, rd, sph_eq5 );',
'  t6 = rayTrace( ro, rd, sph_eq6 );',
'  t7 = rayTrace( ro, rd, sph_eq7 );',
'  t8 = rayTrace( ro, rd, sph_eq8 );',
'  t = min(min(t1, min(t2, min(t3, min(t4, min(t5, min(t6, min(t7, t8))))))), t0);',

'  if (t == t1) { sph = sph_eq1; eq = vec3(1.00,0.00,0.00); }',
'  if (t == t2) { sph = sph_eq2; eq = vec3(1.00,0.72,0.00); }',
'  if (t == t3) { sph = sph_eq3; eq = vec3(0.57,1.00,0.00); }',
'  if (t == t4) { sph = sph_eq4; eq = vec3(0.00,1.00,0.15); }',
'  if (t == t5) { sph = sph_eq5; eq = vec3(0.00,1.00,0.85); }',
'  if (t == t6) { sph = sph_eq6; eq = vec3(0.00,0.43,1.00); }',
'  if (t == t7) { sph = sph_eq7; eq = vec3(0.28,0.00,1.00); }',
'  if (t == t8) { sph = sph_eq8; eq = vec3(1.00,0.00,1.00); }',
'}',

" ",
"    if( t>0.0 ) ",
"    { ",
'if (t==t0) {',
"        vec3 mat = vec3( 0.18 ); ",
"        vec3 pos = ro + t*rd; ",
"        vec3 nor = sphNormal( pos, sph1 ); ",
"             ",
"        float am = 0.1*iGlobalTime; ",
"        vec2 pr = vec2( cos(am), sin(am) ); ",
"        vec3 tnor = nor; ",
"        tnor.xz = mat2( pr.x, -pr.y, pr.y, pr.x ) * tnor.xz; ",
" ",
"        float am2 = 0.08*iGlobalTime - 1.0*(1.0-nor.y*nor.y); ",
"        pr = vec2( cos(am2), sin(am2) ); ",
"        vec3 tnor2 = nor; ",
"        tnor2.xz = mat2( pr.x, -pr.y, pr.y, pr.x ) * tnor2.xz; ",
" ",
"        vec3 ref = reflect( rd, nor ); ",
"        float fre = clamp( 1.0+dot( nor, rd ), 0.0 ,1.0 ); ",
" ",
"        float l = fancyCube( iChannel0, tnor, 0.03, 0.0 ).x; ",
"        l += -0.1 + 0.3*fancyCube( iChannel0, tnor, 8.0, 0.0 ).x; ",
" ",
"        vec3 sea  = mix( vec3(0.0,0.07,0.2), vec3(0.0,0.01,0.3), fre ); ",
"        sea *= 0.15; ",
" ",
"        vec3 land = vec3(0.02,0.04,0.0); ",
"        land = mix( land, vec3(0.05,0.1,0.0), smoothstep(0.4,1.0,fancyCube( iChannel0, tnor, 0.1, 0.0 ).x )); ",
"        land *= fancyCube( iChannel0, tnor, 0.3, 0.0 ).xyz; ",
"        land *= 0.5; ",
" ",
"        float los = smoothstep(0.45,0.46, l); ",
"        mat = mix( sea, land, los ); ",
" ",
"        vec3 wrap = -1.0 + 2.0*fancyCube( iChannel1, tnor2.xzy, 0.025, 0.0 ).xyz; ",
"        float cc1 = fancyCube( iChannel1, tnor2 + 0.2*wrap, 0.05, 0.0 ).y; ",
"        float clouds1 = smoothstep( 0.3, 0.6, cc1 ); ",
" ",
"        float cc2 = fancyCube( iChannel1, tnor2, 0.2, 0.0 ).y; ",
"        float clouds2 = smoothstep( 0.3, 0.6, cc2); ",
" ",
"        float clouds = clouds1;\/\/ + clouds2*0.1; ",
" ",
"        \/\/mat = mix( mat, vec3(0.0), smoothstep( 0.0, 0.6, cc1 ) ); ",
" ",
"        mat = mix( mat, vec3(0.93*0.15), clouds ); ",
" ",
"        float dif = clamp( dot(nor, lig), 0.0, 1.0 ); ",
"        mat *= 0.8; ",
"        vec3 lin  = vec3(3.0,2.5,2.0)*dif; ",
"        lin += 0.01; ",
"        col = mat * lin; ",
"        col = pow( col, vec3(0.4545) ); ",
"        col += 0.6*fre*fre*vec3(0.9,0.9,1.0)*(0.3+0.7*dif); ",
" ",
"        float spe = clamp( dot(ref,lig), 0.0, 1.0 ); ",
"        float tspe = pow( spe, 3.0 ) + 0.5*pow( spe, 16.0 ); ",
"        col += (1.0-0.5*los)*clamp(1.0-2.0*clouds,0.0,1.0)*0.3*vec3(0.5,0.4,0.3)*tspe*dif; ",

"_alpha = 1.0;",
'}',
'else {',
'  col = clamp(col+vec3(0.5)*mix(vec3(0.5),vec3(1.0),eq), vec3(0.0),vec3(1.0));',
'  _alpha = (col.x + col.y + col.z) / 3.0;',
'}',

"    } ",
"     ",
"    \/\/ raymarch stuff     ",
"    float tmax = 20.0; ",
"    if( t>0.0 ) tmax = t;  ",
"    t = rayMarch( ro, rd, tmax );     ",
"    if( t<tmax ) ",
"    { ",
"            vec3 pos = ro + t*rd; ",
" ",
"            vec2 scp = sin(2.0*6.2831*pos.xz); ",
"             ",
"            vec3 wir = vec3( 0.0 ); ",

'float wir_x = 1.0*exp(-12.0*abs(scp.x)) + 0.5*exp( -4.0*abs(scp.x));',
'float wir_y = 1.0*exp(-12.0*abs(scp.y)) + 0.5*exp( -4.0*abs(scp.y));',

'if (!SA_idle && VisualizerSpacetimeGrid) {',
'  float pos_x = abs(pos.z*4.0);',
'  float eq_x  = float(int(pos_x));',
'  float eq_wir  = texture2D(iChannel3, vec2(WIR_BAND_INI+eq_x/WIR_BAND_DIVIDER, 0.25)).x;',

'  float pos_y = abs(pos.x*4.0);',
'  float eq_y = float(int(pos_y))/20.0;',
'  if (eq_y >= eq_wir) {',
'    if ((pos_y < 1.0) || (pos_y/20.0 >= eq_wir+0.05)) { wir_x *= 0.2; }',
'    float eq_x0 = (pos_x-eq_x > 0.5) ? eq_x+1.0 : eq_x-1.0;',
'    float eq_wir0 = texture2D(iChannel3, vec2(WIR_BAND_INI+eq_x0/WIR_BAND_DIVIDER, 0.25)).x;',
'    if (eq_y >= eq_wir0) { wir_y *= 0.2; }',
'  }',
'}',

'wir += wir_x + wir_y;',
'wir *= 0.2 + 1.0*sphSoftShadow( pos, lig, sph1, 4.0 );',

/*
'float eq_wir = texture2D(iChannel3, vec2(abs(float(int(pos.z*4.0))/20.0), 0.25)).x;',
'if (/20.0) >= eq_wir) { wir *= -1.0; }',
'else {',
"            wir *= 0.2 + 1.0*sphSoftShadow( pos, lig, sph1, 4.0 ); ",
'}',
" ",
*/

"wir = wir*0.5*exp( -0.05*t*t );",// * ST_opacity;",
"_alpha += (1.0 - _alpha) * abs(wir.x + wir.y + wir.z) / 3.0;",

"            col += wir; ",

//'col = clamp(col, vec3(0.0),vec3(10.0));',

"    }         ",
" ",
"    if ( dot(rd,sph.xyz-ro)>0.0 ) ",
"    { ",

'float d0,d1,d2,d3,d4,d5,d6,d7,d8, d;',
'vec3 glo_mod = vec3(1.0);',
'd0 = sphDistance( ro, rd, sph1 );',
'if (SA_idle || !VisualizerRainbowBlackhole) {',
'  d = d0;',
'}',
'else {',
'  d1 = sphDistance( ro, rd, sph_eq1 );',
'  d2 = sphDistance( ro, rd, sph_eq2 );',
'  d3 = sphDistance( ro, rd, sph_eq3 );',
'  d4 = sphDistance( ro, rd, sph_eq4 );',
'  d5 = sphDistance( ro, rd, sph_eq5 );',
'  d6 = sphDistance( ro, rd, sph_eq6 );',
'  d7 = sphDistance( ro, rd, sph_eq7 );',
'  d8 = sphDistance( ro, rd, sph_eq8 );',
'  d  = min(min(d1, min(d2, min(d3, min(d4, min(d5, min(d6, min(d7, d8))))))), d0);',
'  if (d != d0) {',
'    glo_mod = mix(vec3(0.25),vec3(1.5),eq);',
'  }',
'}',

"    vec3 glo = vec3(0.0); ",
"    glo += vec3(0.6,0.7,1.0)*0.3*exp(-2.0*abs(d))*step(0.0,d);",
"    glo += (0.6*vec3(0.6,0.7,1.0)*0.3*exp(-8.0*abs(d))); ",
"    glo += (0.6*vec3(0.8,0.9,1.0)*0.4*exp(-100.0*abs(d))) *glo_mod; ",

"glo *= 2.0;",// * ST_opacity;",
//"glo = vec3(glo.x * 1.5, glo.y, glo.z / 1.5);",
"_alpha += (1.0 - _alpha) * (glo.x + glo.y + glo.z) / 3.0;",

"    col += glo; ",
"    }         ",
"     ",
"    col *= smoothstep( 0.0, 6.0, iGlobalTime ); ",
" ",
"    return col; ",
"} ",
" ",
" ",
"mat3 setCamera( in vec3 ro, in vec3 rt, in float cr ) ",
"{ ",
" vec3 cw = normalize(rt-ro); ",
" vec3 cp = vec3(sin(cr), cos(cr),0.0); ",
" vec3 cu = normalize( cross(cw,cp) ); ",
" vec3 cv = normalize( cross(cu,cw) ); ",
"    return mat3( cu, cv, -cw ); ",
"} ",
" ",

"void mainImage( out vec4 fragColor, in vec2 fragCoord ) ",
"{ ",

'if (!SA_idle && VisualizerRainbowBlackhole) {',
'  sph_eq1 = sph1 + vec4( cos( 0.0                               +iGlobalTime*.25)*2.0, 0.0, sin( 0.0                               +iGlobalTime*.25)*2.0, mix(-0.95,-0.75, texture2D(iChannel3, vec2(BAND1,0.25)).x));',
'  sph_eq2 = sph1 + vec4( cos( 0.78539816339744830961566084581988+iGlobalTime*.25)*2.0, 0.0, sin( 0.78539816339744830961566084581988+iGlobalTime*.25)*2.0, mix(-0.95,-0.75, texture2D(iChannel3, vec2(BAND2,0.25)).x));',
'  sph_eq3 = sph1 + vec4( cos(-0.78539816339744830961566084581988+iGlobalTime*.25)*2.0, 0.0, sin(-0.78539816339744830961566084581988+iGlobalTime*.25)*2.0, mix(-0.95,-0.75, texture2D(iChannel3, vec2(BAND3,0.25)).x));',
'  sph_eq4 = sph1 + vec4( cos( 1.5707963267948966192313216916398 +iGlobalTime*.25)*2.0, 0.0, sin( 1.5707963267948966192313216916398 +iGlobalTime*.25)*2.0, mix(-0.95,-0.75, texture2D(iChannel3, vec2(BAND4,0.25)).x));',
'  sph_eq5 = sph1 + vec4( cos(-1.5707963267948966192313216916398 +iGlobalTime*.25)*2.0, 0.0, sin(-1.5707963267948966192313216916398 +iGlobalTime*.25)*2.0, mix(-0.95,-0.75, texture2D(iChannel3, vec2(BAND5,0.25)).x));',
'  sph_eq6 = sph1 + vec4( cos( 2.3561944901923449288469825374596 +iGlobalTime*.25)*2.0, 0.0, sin( 2.3561944901923449288469825374596 +iGlobalTime*.25)*2.0, mix(-0.95,-0.75, texture2D(iChannel3, vec2(BAND6,0.25)).x));',
'  sph_eq7 = sph1 + vec4( cos(-2.3561944901923449288469825374596 +iGlobalTime*.25)*2.0, 0.0, sin(-2.3561944901923449288469825374596 +iGlobalTime*.25)*2.0, mix(-0.95,-0.75, texture2D(iChannel3, vec2(BAND7,0.25)).x));',
'  sph_eq8 = sph1 + vec4( cos( 3.1415926535897932384626433832795 +iGlobalTime*.25)*2.0, 0.0, sin( 3.1415926535897932384626433832795 +iGlobalTime*.25)*2.0, mix(-0.95,-0.75, texture2D(iChannel3, vec2(BAND8,0.25)).x));',
'}',

" vec2 p = (-iResolution.xy +2.0*fragCoord.xy) \/ iResolution.y; ",
" ",
"    float zo = 1.0 + smoothstep( 5.0, 15.0, abs(iGlobalTime-48.0) ); ",
"    float an = 3.0 + 0.05*iGlobalTime + 6.0*iMouse.x\/iResolution.x; ",
"    vec3 ro = zo*vec3( 2.0*cos(an), 1.0, 2.0*sin(an) ); ",
"    vec3 rt = vec3( 1.0, 0.0, 0.0 ); ",
"    mat3 cam = setCamera( ro, rt, 0.35 ); ",
"    vec3 rd = normalize( cam * vec3( p, -2.0) ); ",
" ",

"float alpha;",
"    vec3 col = render( ro, rd, alpha ); ",

"     ",
"    vec2 q = fragCoord.xy \/ iResolution.xy; ",
"    col *= 0.2 + 0.8*pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.1 ); ",
" ",
" fragColor = vec4( col, clamp(alpha, 0.0, 1.0) ); ",
"} ",


		"void main() {",
MMD_SA.MME_PPE_main("NV15SpaceCurvature"),
		"}"

	].join( "\n" ),

	_refreshUniforms: function (refresh_all_uniforms) {
MMD_SA.MME_PPE_refreshUniforms.call(this, "NV15SpaceCurvature", refresh_all_uniforms)//, { ST_opacity:{} })

var EC = MMD_SA_options.MME.PostProcessingEffects
var e = EC._effects["NV15SpaceCurvature"]
var EC_by_name = (EC.effects_by_name["NV15SpaceCurvature"] || {});

['VisualizerSpacetimeGrid', 'VisualizerRainbowBlackhole'].forEach(function (name) {
  e.uniforms[name].value = ((EC_by_name[name] == null) || EC_by_name[name]) ? 1 : 0
});
	},

	_init: function () {
MMD_SA.MME_PPE_init.call(this, "NV15SpaceCurvature", [System.Gadget.path + '/images/ST_tex03.jpg', System.Gadget.path + '/images/ST_tex09.jpg', System.Gadget.path + '/images/ST_tex12.png', '[music canvas]'])//, {'VisualizerSpacetimeGrid':{type:'i',type_uniform:'bool',value:1}, 'VisualizerRainbowBlackhole':{type:'i',type_uniform:'bool',value:1}})//, { ST_opacity:{} })
	}

};

// init
THREE.NV15SpaceCurvature._init();
