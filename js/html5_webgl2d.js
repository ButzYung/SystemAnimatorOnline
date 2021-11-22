// WebGL 2D version
// (2021-11-23)

var use_WebGL, use_WebGL_2D

var WebGL_2D_options
if (!WebGL_2D_options)
  WebGL_2D_options = {}

var WebGL_2D = {
  _texture_img_cache: {}

 ,toFloat: function (v) {
return (v == parseInt(v)) ? v + ".0" : v
  }

 ,_WebGL_2D: function (target, options) {
this.initialized = false
this.target = target
this.options = options || WebGL_2D_options

var d = this.canvas = document.createElement("canvas")
d.width = d.height = 0

if (target.parentElement) {
  this.use_CSS = true

  var ts = target.style
  this.target_CSS_display_default = (ts.display || "inline")
  ts.display = "none"

  var ds = d.style
  ds.position = "absolute"
  ds.posLeft = ts.posLeft
  ds.posTop  = ts.posTop
  ds.zIndex  = ts.zIndex
  ds.display = "none"
  target.parentElement.appendChild(d)
}

if (this.options.texture_list) {
  this.texture = []
  var that  = this
  this.options.texture_list.forEach(function (path) {
    var img = WebGL_2D._texture_img_cache[path]
    if (!img) {
      img = WebGL_2D._texture_img_cache[path] = new Image()
      img.src = toFileProtocol(path)
    }
    that.texture.push({ tex:null, img:img })
  });
}
  }

 ,createObject: function (target, options) {
target._WebGL_2D = new this._WebGL_2D(target, options)
  }
};

WebGL_2D._WebGL_2D.prototype.vshader_2d = 
  'attribute vec2 a_position;\n'
+ 'attribute vec2 a_texCoord;\n'
+ 'uniform vec2 u_resolution;\n'
+ 'varying vec2 v_texCoord;\n'
+ 'void main() {\n'

+ '  // convert the rectangle from pixels to 0.0 to 1.0\n'
+ '  vec2 zeroToOne = a_position / u_resolution;\n'
+ '  // convert from 0->1 to 0->2\n'
+ '  vec2 zeroToTwo = zeroToOne * 2.0;\n'
+ '  // convert from 0->2 to -1->+1 (clipspace)\n'
+ '  vec2 clipSpace = zeroToTwo - 1.0;\n'
+ '  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);\n'

+ '  // pass the texCoord to the fragment shader\n'
+ '  // The GPU will interpolate this value between points.\n'
+ '  v_texCoord = a_texCoord;\n'
+ '}\n';

WebGL_2D._WebGL_2D.prototype.fshader_2d_init =
  'precision mediump float;\n'

WebGL_2D._WebGL_2D.prototype.fshader_2d_var =
  '// our texture\n'
+ 'uniform sampler2D u_image;\n'
+ '// the texCoords passed in from the vertex shader.\n'
+ 'varying vec2 v_texCoord;\n'

WebGL_2D._WebGL_2D.prototype.fshader_2d_func = ""

WebGL_2D._WebGL_2D.prototype.fshader_2d_main =
  '  gl_FragColor = texture2D(u_image, v_texCoord);\n'

WebGL_2D._WebGL_2D.prototype.init = function (para) {
  if (this.initialized)
    return this.gl
  this.initialized = true

  var that = this

  var canvas = this.canvas
  if (this.use_CSS)
    canvas.style.display = "inline"

  var gl_para = {
  premultipliedAlpha: false
 ,preserveDrawingBuffer: !!WebGL_2D_options.preserveDrawingBuffer
  }

  var gl = this.gl = canvas.getContext('webgl', gl_para) || canvas.getContext('experimental-webgl', gl_para);
  if (!gl) {
    use_WebGL = use_WebGL_2D = false
    this._WebGL_2D = null
    if (this.use_CSS) {
      canvas.style.display = "none"
      if (this.target.display == "none")
        this.target.display = this.target_CSS_display_default
    }

    DEBUG_show("(WebGL not supported)")
    return false
  }

// Shadertoy START
  if (this.use_Shadertoy || this.options.use_Shadertoy) {
    this.use_Shadertoy = true

    this.use_MatrixRain = use_MatrixRain && Settings.UseCanvasPPE
    this.use_contrast_and_brightness = Settings.UseCanvasPPEContrast || Settings.UseCanvasPPEBrightness

// need highp to use uniforms of the same name across vertex and fragment shaders
    this.fshader_2d_init =
  'precision highp float;\n'

    this.fshader_2d_var += [
'uniform float iGlobalTime;',
'uniform vec2 u_resolution;',
'#define iResolution u_resolution',
'#define iChannel0 u_image',
((this.use_contrast_and_brightness) ? '#define contrast_and_brightness clamp((c1.rgb - 0.5) * ' + WebGL_2D.toFloat(1 + Settings.UseCanvasPPEContrast/100) + ' + 0.5 + ' + WebGL_2D.toFloat(Settings.UseCanvasPPEBrightness/100) + ', vec3(0.0),vec3(1.0))' : ''),
''
    ].join("\n");
    if (this.texture) {
      this.texture.forEach(function (obj, idx) {
        that.fshader_2d_var += 'uniform sampler2D iChannel' + (idx+1) + ';\n'
      });
    }
    this.fshader_2d_var += 'uniform vec3 iChannelResolution[' + (((this.texture)?this.texture.length:0)+1) + '];\n'

// use "=" instead of "+=", overriding default
    this.fshader_2d_main = [
'vec4 ST_color;',
'vec2 ST_coord = vec2(0.5) + (v_texCoord * (iResolution.xy - vec2(1.0)));',
'mainImage(ST_color, ST_coord);',
'gl_FragColor = ST_color;',
''
    ].join("\n");

    var sn
    var sn_msg = ""
    if (this.options.SampNum_min) {
      var min = this.options.SampNum_min
      var max = this.options.SampNum_max
      var q = Settings.UseCanvasPPEQuality
      if (q == 0)
        sn = min
      else if (q == 100)
        sn = max
      else {
        q = q/50
        q *= q
        var p_base = 480*360
        q = (para.w*para.h - p_base*q) / (p_base*q*3)
        q = 1 - Math.min(Math.max(q, 0), 1)
        sn = Math.round(min + (max-min)*q)
      }
      sn_msg = ' (V:' + para.w + 'x' + para.h + ', Q:' + sn + '/' + max + ')'
    }
    if (this.use_contrast_and_brightness)
      sn_msg += ' (contrast:' + ((Settings.UseCanvasPPEContrast>=0)?'+':'') + Settings.UseCanvasPPEContrast + ', brightness:' + ((Settings.UseCanvasPPEBrightness>=0)?'+':'') + Settings.UseCanvasPPEBrightness + ')'

    if (this.use_NotebookDrawings || this.options.use_NotebookDrawings) {
      var sketch_style = parseInt(System.Gadget.Settings.readString("UseCanvasNotebookDrawings_Style") || Settings_default.UseCanvasNotebookDrawings_Style)
      DEBUG_show("Use WebGL 2D - Sketch " + sketch_style + sn_msg, 2)
      this.use_NotebookDrawings = true

      if (sketch_style > 1) {
        this.fshader_2d_func += [
// https://www.shadertoy.com/view/ldXfRj
"/* ",
"    Author: Daniel Taylor",
"	License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.",
"",
"	Tried my hand at a sketch-looking shader.",
"",
"	I'm sure that someone has used this exact method before, but oh well. I like to ",
"	think that this one is very readable (aka I'm not very clever with optimizations).",
"	There's little noise in the background, which is a good sign, however it's easy to",
"	create a scenerio that tricks it (the 1961 Commerical video is a good example).",
"	Also, text (or anything thin) looks really bad on it, don't really know how to fix",
"	that.",
"",
"	Also, if the Shadertoy devs are reading this, the number one feature request that",
"	I have is a time slider. Instead of waiting for the entire video to loop back to",
"	the end, be able to fast forward to a specific part. It'd really help, I swear.",
"",
"	Previous work:",
"	https://www.shadertoy.com/view/XtVGD1 - the grandaddy of all sketch shaders, by flockaroo",
"*/",
"",
"#define PI2 6.28318530717959",
"",
"#define RANGE 16.",
"#define STEP 2.",
"#define ANGLENUM 4.",
"",
"// Grayscale mode! This is for if you didn't like drawing with colored pencils as a kid",
"//#define GRAYSCALE",
"",
"// Here's some magic numbers, and two groups of settings that I think looks really nice. ",
"// Feel free to play around with them!",
"",
"#define MAGIC_GRAD_THRESH 0.01",
"",
"// Setting group 1:",

((sketch_style == 3) ? "#define MAGIC_SENSITIVITY 4.\n#define MAGIC_COLOR 1." : "#define MAGIC_SENSITIVITY 10.\n#define MAGIC_COLOR 0.25"),

/*
"#define MAGIC_SENSITIVITY     4.",
"#define MAGIC_COLOR           1.",

"",
"// Setting group 2:",

"#define MAGIC_SENSITIVITY    10.",

"#define MAGIC_COLOR           0.25",
//"#define MAGIC_COLOR           0.5",
*/

"",
"//---------------------------------------------------------",
"// Your usual image functions and utility stuff",
"//---------------------------------------------------------",
"vec4 getCol(vec2 pos)",
"{",
"    vec2 uv = pos / iResolution.xy;",

"vec4 c1 = texture2D(iChannel0, uv);",
((this.use_contrast_and_brightness) ? 'c1.rgb = contrast_and_brightness;' : ''),
"return c1;",
//"    return texture2D(iChannel0, uv);",

"}",
"",
"float getVal(vec2 pos)",
"{",
"    vec4 c=getCol(pos);",
"    return dot(c.xyz, vec3(0.2126, 0.7152, 0.0722));",
"}",
"",
"vec2 getGrad(vec2 pos, float eps)",
"{",
"   	vec2 d=vec2(eps,0);",
"    return vec2(",
"        getVal(pos+d.xy)-getVal(pos-d.xy),",
"        getVal(pos+d.yx)-getVal(pos-d.yx)",
"    )/eps/2.;",
"}",
"",
"void pR(inout vec2 p, float a) {",
"	p = cos(a)*p + sin(a)*vec2(p.y, -p.x);",
"}",
"float absCircular(float t)",
"{",
"    float a = floor(t + 0.5);",
"    return mod(abs(a - t), 1.0);",
"}",
"",
"//---------------------------------------------------------",
"// Let's do this!",
"//---------------------------------------------------------",
"void mainImage( out vec4 fragColor, in vec2 fragCoord )",
"{   ",
"    vec2 pos = fragCoord;",
"    float weight = 1.0;",
"    ",
"    for (float j = 0.; j < ANGLENUM; j += 1.)",
"    {",
"        vec2 dir = vec2(1, 0);",
"        pR(dir, j * PI2 / (2. * ANGLENUM));",
"        ",
"        vec2 grad = vec2(-dir.y, dir.x);",
"        ",
"        for (float i = -RANGE; i <= RANGE; i += STEP)",
"        {",
"            vec2 pos2 = pos + normalize(dir)*i;",
"            ",
"            // video texture wrap can't be set to anything other than clamp  (-_-)",
"            if (pos2.y < 0. || pos2.x < 0. || pos2.x > iResolution.x || pos2.y > iResolution.y)",
"                continue;",
"            ",
"            vec2 g = getGrad(pos2, 1.);",
"            if (length(g) < MAGIC_GRAD_THRESH)",
"                continue;",
"            ",
"            weight -= pow(abs(dot(normalize(grad), normalize(g))), MAGIC_SENSITIVITY) / floor((2. * RANGE + 1.) / STEP) / ANGLENUM;",
"        }",
"    }",
"    ",
"#ifndef GRAYSCALE",
"    vec4 col = getCol(pos);",
"#else",
"    vec4 col = vec4(getVal(pos));",
"#endif",
"    ",
"    vec4 background = mix(col, vec4(1), MAGIC_COLOR);",
"    ",
"    // I couldn't get this to look good, but I guess it's almost obligatory at this point...",
"    /*float distToLine = absCircular(fragCoord.y / (iResolution.y/8.));",
"    background = mix(vec4(0.6,0.6,1,1), background, smoothstep(0., 0.03, distToLine));*/",
"    ",
"    ",
"    // because apparently all shaders need one of these. It's like a law or something.",
"    float r = length(pos - iResolution.xy*.5) / iResolution.x;",
"    float vign = 1. - r*r*r;",
"    ",
"    vec4 a = texture2D(iChannel1, pos/iResolution.xy);",
"    ",
"    fragColor = vign * mix(vec4(0), background, weight) + a.xxxx/25.;",
"    //fragColor = getCol(pos);",
"}",
""
        ].join("\n");
      }
      else {
        this.fshader_2d_func += [
// https://www.shadertoy.com/view/XtVGD1
'// created by florian berger (flockaroo) - 2016\n',
'// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.\n',
'\n',
'// trying to resemle some hand drawing style\n',
'\n',
'\n',
'#define SHADERTOY\n',
'#ifdef SHADERTOY\n',
'#define Res0 iChannelResolution[0].xy\n',
'#define Res1 iChannelResolution[1].xy\n',
'#else\n',
'#define Res0 textureSize(iChannel0,0)\n',
'#define Res1 textureSize(iChannel1,0)\n',
'#define iResolution Res0\n',
'#endif\n',
'\n',
'#define Res  iResolution.xy\n',
'\n',
'#define randSamp iChannel1\n',
'#define colorSamp iChannel0\n',
'\n',
'\n',
'vec4 getRand(vec2 pos)\n',
'{\n',
'    return texture2D(iChannel1,pos/Res1/iResolution.y*1080.);\n',//1080
'}\n',
'\n',
'vec4 getCol(vec2 pos)\n',
'{\n',
'    // take aspect ratio into account\n',
'    vec2 uv=((pos-Res.xy*.5)/Res.y*Res0.y)/Res0.xy+.5;\n',
'    vec4 c1=texture2D(iChannel0,uv);\n',

// transparent area as white
'c1 = vec4(mix(vec3(1.0), c1.rgb, c1.a), 1.0);',
// gama
//'c1.rgb = pow(c1.rgb, vec3(0.75));',
// brightness and contrast
((this.use_contrast_and_brightness) ? 'c1.rgb = contrast_and_brightness;' : ''),

'    vec4 e=smoothstep(vec4(-0.05),vec4(-0.0),vec4(uv,vec2(1)-uv));\n',
'    c1=mix(vec4(1,1,1,0),c1,e.x*e.y*e.z*e.w);\n',

// green screen disabled
'return c1;',

//'    float d=clamp(dot(c1.xyz,vec3(-.5,1.,-.5)),0.0,1.0);\n',
//'    vec4 c2=vec4(.7);\n',
//'    return min(mix(c1,c2,1.8*d),.7);\n',

'}\n',
'\n',
'vec4 getColHT(vec2 pos)\n',
'{\n',
' 	return smoothstep(.95,1.05,getCol(pos)*.8+.2+getRand(pos*.7));\n',
'}\n',
'\n',
'float getVal(vec2 pos)\n',
'{\n',
'    vec4 c=getCol(pos);\n',
' 	return pow(dot(c.xyz,vec3(.333)),1.)*1.;\n',
'}\n',
'\n',
'vec2 getGrad(vec2 pos, float eps)\n',
'{\n',
'   	vec2 d=vec2(eps,0);\n',
'    return vec2(\n',
'        getVal(pos+d.xy)-getVal(pos-d.xy),\n',
'        getVal(pos+d.yx)-getVal(pos-d.yx)\n',
'    )/eps/2.;\n',
'}\n',
'\n',
'#define AngleNum 3\n',//3
'\n',

'#define SampNum ' + sn + '\n',//16

'#define PI2 6.28318530717959\n',
'\n',
'void mainImage( out vec4 fragColor, in vec2 fragCoord )\n',
'{\n',
'    vec2 pos = fragCoord+4.0*sin(iGlobalTime*1.*vec2(1,1.7))*iResolution.y/400.;\n',
'    vec3 col = vec3(0);\n',
'    vec3 col2 = vec3(0);\n',
'    float sum=0.;\n',
'    for(int i=0;i<AngleNum;i++)\n',
'    {\n',
'        float ang=PI2/float(AngleNum)*(float(i)+.8);\n',
'        vec2 v=vec2(cos(ang),sin(ang));\n',
'        for(int j=0;j<SampNum;j++)\n',
'        {\n',
'            vec2 dpos  = v.yx*vec2(1,-1)*float(j)*iResolution.y/400.;\n',
'            vec2 dpos2 = v.xy*float(j*j)/float(SampNum)*.5*iResolution.y/400.;\n',
'	        vec2 g;\n',
'            float fact;\n',
'            float fact2;\n',
'\n',
'            for(float s=-1.;s<=1.;s+=2.)\n',
'            {\n',
'                vec2 pos2=pos+s*dpos+dpos2;\n',
'                vec2 pos3=pos+(s*dpos+dpos2).yx*vec2(1,-1)*2.;\n',
'            	g=getGrad(pos2,.4);\n',
'            	fact=dot(g,v)-.5*abs(dot(g,v.yx*vec2(1,-1)))/**(1.-getVal(pos2))*/;\n',
'            	fact2=dot(normalize(g+vec2(.0001)),v.yx*vec2(1,-1));\n',
'                \n',
'                fact=clamp(fact,0.,.05);\n',
'                fact2=abs(fact2);\n',
'                \n',
'                fact*=1.-float(j)/float(SampNum);\n',
'            	col += fact;\n',
'            	col2 += fact2*getColHT(pos3).xyz;\n',
'            	sum+=fact2;\n',
'            }\n',
'        }\n',
'    }\n',
'    col/=float(SampNum*AngleNum)*.75/sqrt(iResolution.y);\n',
'    col2/=sum;\n',
'    col.x*=(.6+.8*getRand(pos*.7).x);\n',
'    col.x=1.-col.x;\n',
'    col.x*=col.x*col.x;\n',
'\n',
'    vec2 s=sin(pos.xy*.1/sqrt(iResolution.y/400.));\n',
'    vec3 karo=vec3(1);\n',
'    karo-=.5*vec3(.25,.1,.1)*dot(exp(-s*s*80.),vec2(1));\n',
'    float r=length(pos-iResolution.xy*.5)/iResolution.x;\n',
'    float vign=1.-r*r*r;\n',
'	fragColor = vec4(vec3(col.x*col2*karo*vign),1);\n',
'    //fragColor=getCol(fragCoord);\n',
'}\n',
''
        ].join("\n");
      }
    }
    else if (this.use_Watercolor || this.options.use_Watercolor) {
      DEBUG_show("Use WebGL 2D - Watercolor" + sn_msg, 2)
      this.use_Watercolor = true

      this.fshader_2d_func += [
// https://www.shadertoy.com/view/ltyGRV
'// created by florian berger (flockaroo) - 2016\n',
'// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.\n',
'\n',
'// trying to resemble watercolors\n',
'\n',
'#define Res  iResolution.xy\n',
'#define Res0 iChannelResolution[0].xy\n',
'#define Res1 iChannelResolution[1].xy\n',
'\n',
'#define PI 3.14159265358979\n',
'\n',
'vec4 getCol(vec2 pos)\n',
'{\n',
'    vec2 uv=pos/Res0;\n',
'    vec4 c1 = texture2D(iChannel0,uv);\n',

// transparent area as white
'c1 = vec4(mix(vec3(1.0), c1.rgb, c1.a), 1.0);',
((this.use_contrast_and_brightness) ? 'c1.rgb = contrast_and_brightness;' : ''),

// green screen disabled
'return c1;',

//'    vec4 c2 = vec4(.4); // gray on greenscreen\n',
//'    float d = clamp(dot(c1.xyz,vec3(-0.5,1.0,-0.5)),0.0,1.0);\n',
//'    return mix(c1,c2,1.8*d);\n',

'}\n',
'\n',
'vec4 getCol2(vec2 pos)\n',
'{\n',
'    vec2 uv=pos/Res0;\n',
'    vec4 c1 = texture2D(iChannel0,uv);\n',

// transparent area as white
'c1 = vec4(mix(vec3(1.0), c1.rgb, c1.a), 1.0);',
((this.use_contrast_and_brightness) ? 'c1.rgb = contrast_and_brightness;' : ''),

// green screen disabled
'return c1;',

//'    vec4 c2 = vec4(1.5); // bright white on greenscreen\n',
//'    float d = clamp(dot(c1.xyz,vec3(-0.5,1.0,-0.5)),0.0,1.0);\n',
//'    return mix(c1,c2,1.8*d);\n',

'}\n',
'\n',
'vec2 getGrad(vec2 pos,float delta)\n',
'{\n',
'    vec2 d=vec2(delta,0);\n',
'    return vec2(\n',
'        dot((getCol(pos+d.xy)-getCol(pos-d.xy)).xyz,vec3(.333)),\n',
'        dot((getCol(pos+d.yx)-getCol(pos-d.yx)).xyz,vec3(.333))\n',
'    )/delta;\n',
'}\n',
'\n',
'vec2 getGrad2(vec2 pos,float delta)\n',
'{\n',
'    vec2 d=vec2(delta,0);\n',
'    return vec2(\n',
'        dot((getCol2(pos+d.xy)-getCol2(pos-d.xy)).xyz,vec3(.333)),\n',
'        dot((getCol2(pos+d.yx)-getCol2(pos-d.yx)).xyz,vec3(.333))\n',
'    )/delta;\n',
'}\n',
'\n',
'vec4 getRand(vec2 pos) \n',
'{\n',
'    vec2 uv=pos/Res1;\n',
'    return texture2D(iChannel1,uv);\n',
'}\n',
'\n',
'float htPattern(vec2 pos)\n',
'{\n',
'    float p;\n',
'    float r=getRand(pos*.4/.7*1.).x;\n',
'  	p=clamp((pow(r+.3,2.)-.45),0.,1.);\n',
'    return p;\n',
'}\n',
'\n',
'float getVal(vec2 pos, float level)\n',
'{\n',
'    return length(getCol(pos).xyz)+0.0001*length(pos-0.5*Res0);\n',
'    return dot(getCol(pos).xyz,vec3(.333));\n',
'}\n',
'    \n',
'vec4 getBWDist(vec2 pos)\n',
'{\n',
'    return vec4(smoothstep(.9,1.1,getVal(pos,0.)*.9+htPattern(pos*.7)));\n',
'}\n',
'\n',

'#define SampNum ' + sn + '\n',//24

'\n',
'#define N(a) (a.yx*vec2(1,-1))\n',
'\n',
'void mainImage( out vec4 fragColor, in vec2 fragCoord )\n',
'{\n',
'    vec2 pos=((fragCoord-Res.xy*.5)/Res.y*Res0.y)+Res0.xy*.5;\n',
'    vec2 pos2=pos;\n',
'    vec2 pos3=pos;\n',
'    vec2 pos4=pos;\n',
'    vec2 pos0=pos;\n',
'    vec3 col=vec3(0);\n',
'    vec3 col2=vec3(0);\n',
'    float cnt=0.0;\n',
'    float cnt2=0.;\n',
'    for(int i=0;i<1*SampNum;i++)\n',
'    {   \n',
'        // gradient for outlines (gray on green screen)\n',
'        vec2 gr =getGrad(pos, 2.0)+.0001*(getRand(pos ).xy-.5);\n',
'        vec2 gr2=getGrad(pos2,2.0)+.0001*(getRand(pos2).xy-.5);\n',
'        \n',
'        // gradient for wash effect (white on green screen)\n',
'        vec2 gr3=getGrad2(pos3,2.0)+.0001*(getRand(pos3).xy-.5);\n',
'        vec2 gr4=getGrad2(pos4,2.0)+.0001*(getRand(pos4).xy-.5);\n',
'        \n',
'        float grl=clamp(10.*length(gr),0.,1.);\n',
'        float gr2l=clamp(10.*length(gr2),0.,1.);\n',
'\n',
'        // outlines:\n',
'        // stroke perpendicular to gradient\n',
'        pos +=.8 *normalize(N(gr));\n',
'        pos2-=.8 *normalize(N(gr2));\n',
'        float fact=1.-float(i)/float(SampNum);\n',
'        col+=fact*mix(vec3(1.2),getBWDist(pos).xyz*2.,grl);\n',
'        col+=fact*mix(vec3(1.2),getBWDist(pos2).xyz*2.,gr2l);\n',
'        \n',
'        // colors + wash effect on gradients:\n',
'        // color gets lost from dark areas\n',
'        pos3+=.25*normalize(gr3)+.5*(getRand(pos0*.07).xy-.5);\n',
'        // to bright areas\n',
'        pos4-=.5 *normalize(gr4)+.5*(getRand(pos0*.07).xy-.5);\n',
'        \n',
'        float f1=3.*fact;\n',
'        float f2=4.*(.7-fact); \n',
'        col2+=f1*(getCol2(pos3).xyz+.25+.4*getRand(pos3*1.).xyz);\n',
'        col2+=f2*(getCol2(pos4).xyz+.25+.4*getRand(pos4*1.).xyz);\n',
'        \n',
'        cnt2+=f1+f2;\n',
'        cnt+=fact;\n',
'    }\n',
'    // normalize\n',
'    col/=cnt*2.5;\n',
'    col2/=cnt2*1.65;\n',
'    \n',
'    // outline + color\n',
'    col = clamp(clamp(col*.9+.1,0.,1.)*col2,0.,1.);\n',
'    // paper color and grain\n',
'    col = col*vec3(.93,0.93,0.85)\n',
'        *mix(texture2D(iChannel2,fragCoord.xy/iResolution.xy).xyz,vec3(1.2),.7)\n',
'        +.15*getRand(pos0*2.5).x;\n',
'    // vignetting\n',
'    float r = length((fragCoord-iResolution.xy*.5)/iResolution.x);\n',
'    float vign = 1.-r*r*r*r;\n',
'    \n',
'	fragColor = vec4(col*vign,1.0);\n',
'}\n',
''
      ].join("\n");

    }
    else if (this.use_VanGogh || this.options.use_VanGogh) {
      DEBUG_show("Use WebGL 2D - Van Gogh" + sn_msg, 2)
      this.use_VanGogh = true

      this.fshader_2d_var += 'uniform int iFrame;\n'

      this.fshader_2d_func += [
// https://www.shadertoy.com/view/MdGSDG
'// created by florian berger (flockaroo) - 2016\n',
'// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.\n',
'\n',
'// trying to resemble van gogh drawing style\n',
'\n',
'#define Res  iResolution.xy\n',
'#define Res0 iChannelResolution[0].xy\n',
'#define Res1 iChannelResolution[1].xy\n',
'#define Res2 iChannelResolution[2].xy\n',
'\n',
'vec4 getCol(vec2 pos)\n',
'{\n',
'    vec2 uv=pos/Res0;\n',
'    \n',
'    vec4 c1 = texture2D(iChannel0,uv);\n',

// transparent area as white
'c1 = vec4(mix(vec3(1.0), c1.rgb, c1.a), 1.0);',
((this.use_contrast_and_brightness) ? 'c1.rgb = contrast_and_brightness;' : ''),

// green screen disabled
'return c1;',

//'    uv = uv*vec2(-1,-1)*0.39+0.015*vec2(sin(iGlobalTime*1.1),sin(iGlobalTime*0.271));\n',
//'    vec4 c2 = vec4(0.5,0.7,1.0,1.0)*1.0*texture2D(iChannel2,uv);\n',
//'    float d=clamp(dot(c1.xyz,vec3(-0.5,1.0,-0.5)),0.0,1.0);\n',
//'    return mix(c1,c2,1.8*d);\n',

'}\n',
'\n',
'float getVal(vec2 pos, float level)\n',
'{\n',
'    return length(getCol(pos).xyz)+0.0001*length(pos-0.5*Res0);\n',
'}\n',
'    \n',
'vec2 getGrad(vec2 pos,float delta)\n',
'{\n',
'    float l = 1.0*log2(delta);\n',
'    vec2 d=vec2(delta,0);\n',
'    return vec2(\n',
'        getVal(pos+d.xy,l)-getVal(pos-d.xy,l),\n',
'        getVal(pos+d.yx,l)-getVal(pos-d.yx,l)\n',
'    )/delta;\n',
'}\n',
'\n',
'vec4 getRand(vec2 pos) \n',
'{\n',
'    vec2 uv=pos/Res1;\n',
'    uv+=1.0*float(iFrame)*vec2(0.2,0.1)/Res1;\n',
'    \n',
'    return texture2D(iChannel1,uv);\n',
'}\n',
'\n',
'vec4 getColDist(vec2 pos)\n',
'{\n',
'	return floor(0.8*getCol(pos)+1.1*getRand(1.2*pos));\n',
'    float fact = clamp(length(getGrad(pos,5.0))*20.0,0.0,1.0);\n',
'	return floor(0.8*getCol(pos)+1.1*mix(getRand(0.7*pos),getRand(1.7*pos),fact));\n',
'}\n',
'\n',

'#define SampNum ' + sn + '\n',//16

'\n',
'void mainImage( out vec4 fragColor, in vec2 fragCoord )\n',
'{\n',
'    vec2 pos = fragCoord/Res*Res0;\n',
'	vec2 uv = fragCoord.xy / iResolution.xy;\n',
'    vec3 col=vec3(0);\n',
'    float cnt=0.0;\n',
'    float fact=1.0;\n',
'    for(int i=0;i<1*SampNum;i++)\n',
'    {\n',
'        col+=fact*getColDist(pos).xyz;\n',
'        vec2 gr=getGrad(pos,4.0);\n',
'        pos+=0.6*normalize(mix(gr.yx*vec2(1,-1),-gr,0.2));\n',
'        fact*=0.87;\n',
'        cnt+=fact;\n',
'    }\n',
'    col/=cnt;\n',
'	fragColor = vec4(col,1.0);\n',
'}\n',
''
      ].join("\n");

    }
    else if (this.use_JustSnow || this.options.use_JustSnow) {
      DEBUG_show("Use WebGL 2D - Just Snow", 2)
      this.use_JustSnow = true

      this.use_beat_fs = true

      this.fshader_2d_func += [
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

//"	#define WIDTH .3",
"	#define SPEED -.6",
"#else // BLIZZARD",
"	#define LAYERS 200",
"	#define DEPTH .1",
"	#define WIDTH .8",
"	#define SPEED 1.5",
"#endif",
"",
"void mainImage( out vec4 fragColor, in vec2 fragCoord )",
"{",
"float WIDTH = beat_fs+0.3;",
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
//"	fragColor = vec4(vec3(acc),1.0);",

"vec4 src = texture2D(iChannel0, fragCoord.xy/iResolution.xy);",
"fragColor = vec4(mix(src.rgb, vec3(1.0), acc.r), src.a + (1.0-src.a)*acc.r);",

"}",
"",
      ].join("\n");

    }
    else {
      this.fshader_2d_func += [
'uniform sampler2D iChannel1;',

'void mainImage( out vec4 fragColor, in vec2 fragCoord ) {}',
''
      ].join("\n");
    }
  }
// END

  if (this.use_FilmShader || this.options.use_FilmShader) {
    DEBUG_show("Use WebGL 2D - FilmShader", 2)

    this.use_time_fs = true

    this.fshader_2d_var += [
// noise effect intensity value (0 = no effect, 1 = full effect)
"#define nIntensity 0.2",
// scanlines effect intensity value (0 = no effect, 1 = full effect)
"#define sIntensity 0.25",
// scanlines effect count value (0 = no effect, 4096 = full effect)
"#define sCount 512.0",
""
    ].join("\n");

    this.fshader_2d_func += [
"vec4 FilmShader(vec4 cTextureScreen, vec2 vUv) {",

/**
 * @author alteredq / http://alteredqualia.com/
 * http://www.airtightinteractive.com/demos/js/badtvshader/lib/shaders/FilmShader.js
 */

			// make some noise
			"float x = vUv.x * vUv.y * time *  1000.0;",
			"x = mod( x, 13.0 ) * mod( x, 123.0 );",
			"float dx = mod( x, 0.01 );",

			// add noise
			"vec3 cResult = cTextureScreen.rgb * clamp( 0.1 + dx * 100.0, 0.0, 1.0 );",//cTextureScreen.rgb;",

			// get us a sine and cosine
			"vec2 sc = vec2( sin( vUv.y * sCount ), cos( vUv.y * sCount ) );",

			// add scanlines
			"cResult += cTextureScreen.rgb * vec3( sc.x, sc.y, sc.x ) * sIntensity;",

			// interpolate between source and result by intensity
			"cResult = cTextureScreen.rgb + clamp( nIntensity, 0.0,1.0 ) * ( cResult - cTextureScreen.rgb );",

//"cResult = mix(vec3( cResult.r * 0.3 + cResult.g * 0.59 + cResult.b * 0.11 ), cTextureScreen.rgb, 0.5);",

			"return vec4( cResult, cTextureScreen.a );",
"}",
""
    ].join("\n");

    this.fshader_2d_main +=
  'gl_FragColor = FilmShader(gl_FragColor, v_texCoord);\n'
  }

  if (this.use_zoomblur) {
    DEBUG_show("Use WebGL 2D - ZoomBlur", 2)
    console.log("Use WebGL 2D - ZoomBlur")

    this.use_beat_fs = true

    this.fshader_2d_var +=
  'uniform vec2 size_fs;\n'
+ 'uniform float zoomblur_center_x;\n'
+ 'uniform float zoomblur_center_y;\n'

    this.fshader_2d_main +=
  '  vec4 color = gl_FragColor;\n'
+ '  if (beat_fs > 0.0) {\n'
//+ '    vec2 v = (0.5 - v_texCoord) * size_fs;\n'
+ '    vec2 v = (vec2(zoomblur_center_x, zoomblur_center_y) - v_texCoord) * size_fs;\n'
+ '    float d = length(v);\n'
+ '    if (d > 0.0) {\n'
+ '      float amount = beat_fs * 0.25;\n'
+ '      v /= size_fs;\n'
+ '      int n = 0;\n'
+ '      int n1 = int(min(amount*d+1.0, 40.0));\n'
+ '      vec2 v1 = v*amount/float(n1);\n'
+ '      for (int i = 1; i <= 40; ++i) {\n'
+ '        if (i>n1) break;\n'
+ '        color += texture2D(u_image, v_texCoord + v1*float(i));\n'
+ '      }\n'
+ '      n += n1;\n'
+ '      color /= float(n+1);\n'
+ '    }\n'
+ '  }\n'
+ '  gl_FragColor = mix(gl_FragColor, color, pow(beat_fs*0.5,0.5)*0.8);\n'//color;\n'//
  }

  if (this.use_MatrixRain) {
    this.fshader_2d_var +=
  'uniform sampler2D matrix_canvas;\n'

    this.fshader_2d_main +=
  'vec4 matrix_mask = texture2D(matrix_canvas, v_texCoord);\n'
//+ 'gl_FragColor.rgb = matrix_mask.rgb;\n'
+ ((returnBoolean("MatrixRainColor")) ?
  'gl_FragColor.rgb *= matrix_mask.g;\n'
  :
  'float _gray = 0.3 * gl_FragColor.r + 0.59 * gl_FragColor.g + 0.11 * gl_FragColor.b;\n'
+ 'gl_FragColor.rgb = vec3(_gray) * matrix_mask.rgb;\n'
);
  }

  if (this.use_time_fs) {
    this.fshader_2d_var +=
  'uniform float time;\n'
  }

  if (this.use_beat_fs) {
    this.fshader_2d_var +=
  'uniform float beat_fs;\n'
  }

  this.fshader_2d =
  this.fshader_2d_init
+ "\n"
+ this.fshader_2d_var
+ "\n"
+ this.fshader_2d_func
+ "\n"
+ "void main() {\n"
+ this.fshader_2d_main
+ "}"
+ "\n"

//console.log(this.fshader_2d)

// shaders
var vs_2d = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs_2d, this.vshader_2d);
gl.compileShader(vs_2d);
if (!gl.getShaderParameter(vs_2d, gl.COMPILE_STATUS)) {
  alert('Vertex shader compilation error');
  throw gl.getShaderInfoLog(vs_2d);
}

var fs_2d = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs_2d, this.fshader_2d);
gl.compileShader(fs_2d);
if (!gl.getShaderParameter(fs_2d, gl.COMPILE_STATUS)) {
  alert('Fragment shader compilation error');
  throw gl.getShaderInfoLog(fs_2d);
}

this.program_2d = gl.createProgram();
gl.attachShader(this.program_2d, vs_2d);
gl.attachShader(this.program_2d, fs_2d);
gl.linkProgram(this.program_2d);
if (!gl.getProgramParameter(this.program_2d, gl.LINK_STATUS)) {
  alert('Shader linking error');
  throw gl.getProgramInfoLog(this.program_2d);
}

// look up where the vertex data needs to go.
this.positionLocation_2d = gl.getAttribLocation(this.program_2d, "a_position");
this.texCoordLocation_2d = gl.getAttribLocation(this.program_2d, "a_texCoord");

// lookup uniforms
this.resolutionLocation_2d = gl.getUniformLocation(this.program_2d, "u_resolution");
this.imageLocation_2d = gl.getUniformLocation(this.program_2d, "u_image");

// post-processing effects
if (this.use_Shadertoy) {
  this.iGlobalTime = gl.getUniformLocation(this.program_2d, "iGlobalTime");
  this.iChannelResolution = gl.getUniformLocation(this.program_2d, "iChannelResolution");
  if (this.texture) {
    this.texture.forEach(function (obj, idx) {
      var ii = idx + 1
      that['iChannel' + ii] = gl.getUniformLocation(that.program_2d, 'iChannel' + ii);
    });
  }
  if (this.use_VanGogh) {
    this.iFrame = gl.getUniformLocation(this.program_2d, "iFrame");
  }
}
if (this.use_MatrixRain) {
  this.matrix_canvas = gl.getUniformLocation(this.program_2d, "matrix_canvas");
}
if (this.use_zoomblur) {
  this.size_fs = gl.getUniformLocation(this.program_2d, "size_fs");
  this.zoomblur_center_x = gl.getUniformLocation(this.program_2d, "zoomblur_center_x");
  this.zoomblur_center_y = gl.getUniformLocation(this.program_2d, "zoomblur_center_y");
}

if (this.use_time_fs) {
  this.time_fs = gl.getUniformLocation(this.program_2d, "time");
}
if (this.use_beat_fs) {
  this.beat_fs  = gl.getUniformLocation(this.program_2d, "beat_fs");
}

//gl.disable(gl.DEPTH_TEST);
//gl.enable(gl.BLEND);
gl.useProgram(this.program_2d);

  if (this.init_custom)
    this.init_custom()

  DEBUG_show("Use WebGL 2D", 2)
  return true
};

WebGL_2D._WebGL_2D.prototype.draw = function (target_new) {
  var target = target_new || this.target
  var w = target.width
  var h = target.height
  if (!w || !h)
    return

  var canvas = this.canvas
  if ((canvas.width != w) || (canvas.height != h)) {
    DEBUG_show("WebGL 2D - Viewport: " + w + "x" + h, 2)
    canvas.width  = w
    canvas.height = h

    if (this.initialized) {
      this.buffer_2d = null
      this.gl.viewport(0, 0, w, h);
    }
  }

  if (!this.init({w:w, h:h}))
    return

//DEBUG_show(EV_sync_update.count_frame,0,1)
//if (EV_sync_update.fps_last) DEBUG_show('FPS:' + EV_sync_update.fps_last)
  var that = this

  var gl = this.gl
  //gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // provide texture coordinates for the rectangle.
  var texCoordBuffer = this.texCoordBuffer_2d;
  if (texCoordBuffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  }
  else {
    texCoordBuffer = this.texCoordBuffer_2d = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0]), gl.STATIC_DRAW);
  }
  gl.enableVertexAttribArray(this.texCoordLocation_2d);
  gl.vertexAttribPointer(this.texCoordLocation_2d, 2, gl.FLOAT, false, 0, 0);

  var texture_count = 0

  // Create a texture.
  gl.activeTexture(gl.TEXTURE0);
  texture_count++

  var texture = this.texture_2d;
if (texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
}
else {
  texture = this.texture_2d = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}
  // Upload the image into the texture.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, target);
  // use TEXTURE0 for u_image
  gl.uniform1i(this.imageLocation_2d, 0)

  if (this.texture) {
    this.texture.forEach(function (obj, idx) {
var ii = idx + 1
gl.activeTexture(gl['TEXTURE' + ii]);
texture_count++

var texture = obj.tex
if (texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
}
else {
  texture = obj.tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Set the parameters so we can render any size image.
//  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
//  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
//  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
//  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
}
if (!obj.loaded && obj.img.complete) {
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, obj.img);
  gl.generateMipmap(gl.TEXTURE_2D);
  obj.loaded = true
//if (ii==2) DEBUG_show(ii,0,1)
}
gl.uniform1i(that['iChannel' + ii], ii)
//DEBUG_show(ii,0,1)
    });
  }

  if (this.use_Shadertoy) {
//iChannelResolution
/*
				if ( uniform._array === undefined ) {

					uniform._array = new Float32Array( 3 * value.length );

				}

				for ( i = 0, il = value.length; i < il; i ++ ) {

					offset = i * 3;

					uniform._array[ offset ] 	 = value[ i ].x;
					uniform._array[ offset + 1 ] = value[ i ].y;
					uniform._array[ offset + 2 ] = value[ i ].z;

				}

				_gl.uniform3fv( location, uniform._array );
*/
    var xy = [[w,h]]
    if (this.texture) {
      this.texture.forEach(function (obj) {
        var img = obj.img
        xy.push((img.complete)?[img.width,img.height]:[256,256])
      });
    }

    if (!this.iChannelResolution_array)
      this.iChannelResolution_array = new Float32Array( 3 * xy.length )
    xy.forEach(function (v, idx) {
      var offset = idx * 3
      that.iChannelResolution_array[offset]   = v[0]
      that.iChannelResolution_array[offset+1] = v[1]
      that.iChannelResolution_array[offset+2] = 1
    });
    gl.uniform3fv(this.iChannelResolution, this.iChannelResolution_array);
//DEBUG_show(xy)
  }

  // set the resolution
  gl.uniform2f(this.resolutionLocation_2d, w, h);

  // post-processing effects
  if (this.use_Shadertoy) {
    gl.uniform1f(this.iGlobalTime, performance.now()/1000);
    if (this.iFrame)
      gl.uniform1i(this.iFrame, EV_sync_update.count_frame);
  }
  if (this.use_zoomblur) {
    gl.uniform2f(this.size_fs, w, h);
    gl.uniform1f(this.zoomblur_center_x, 0.5+(WebGL_2D_options.zoomblur_center_x||(use_EQP_fireworks && CanvasEffect_options.start_x)||0)/2);
    gl.uniform1f(this.zoomblur_center_y, 0.5+(WebGL_2D_options.zoomblur_center_y||(use_EQP_fireworks && CanvasEffect_options.start_y)||0)/2);
  }
  if (this.matrix_canvas) {
gl.activeTexture(gl['TEXTURE' + texture_count]);

var texture = this.texture_matrix
if (texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
}
else {
  texture = this.texture_matrix = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}
if (!WebGL_2D._matrix_rain) {
  var c = this._matrix_canvas_dummy
  if (!c)
    c = this._matrix_canvas_dummy = document.createElement("canvas")
  context = c.getContext("2d")
  context.fillStyle = "#FFFFFF"
  context.fillRect(0,0,w,h)
}
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, (WebGL_2D._matrix_rain && WebGL_2D._matrix_rain.canvas)||this._matrix_canvas_dummy);

gl.uniform1i(this.matrix_canvas, texture_count)

texture_count++
  }

  if (this.use_time_fs) {
    gl.uniform1f(this.time_fs, performance.now()/1000);
  }
  if (this.use_beat_fs) {
    let beat = (EV_usage_sub && EV_usage_sub.BD) ? EV_usage_sub.BD.beat2 : 0
    if (beat) {
      let beat_scale
      if (Settings.BDScale == 0)
        beat_scale = 2
      else if (Settings.BDScale == 1)
        beat_scale = 1
      else
        beat_scale = 0.5
      beat = Math.pow(beat, beat_scale)
    }

    gl.uniform1f(this.beat_fs, beat);
  }

  // Create a buffer for the position of the rectangle corners.
  var buffer = this.buffer_2d;
  if (buffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  }
  else {
    buffer = this.buffer_2d = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    // Set a rectangle the same size as the image.
    var x1 = 0;
    var x2 = 0 + w;
    var y1 = 0;
    var y2 = 0 + h;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2]), gl.STATIC_DRAW);
  }
  gl.enableVertexAttribArray(this.positionLocation_2d);
  gl.vertexAttribPointer(this.positionLocation_2d, 2, gl.FLOAT, false, 0, 0);

  // Draw the rectangle.
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  //DEBUG_show("WebGL 2D drawn", 2)
};
