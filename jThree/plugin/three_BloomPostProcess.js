/**
 * https://www.shadertoy.com/view/Ms2Xz3
 *
 * Bloom Post-Process
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

THREE.BloomPostProcess = {

	uniforms: {
"tDiffuse": { type: "t", value:null },

  "ViewportSize": { type: "v2", value: new THREE.Vector2(640,480) }
 ,"_BlurSize":  { type: "f", value: 0.5 }
 ,"_Threshold": { type: "f", value: 0.5 }
 ,"_Intensity": { type: "f", value: 0.5 }
	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"varying vec2 vUv;",

'uniform vec2 ViewportSize;',
'uniform float _BlurSize;',
'uniform float _Threshold;',
'uniform float _Intensity;',

'vec4 BlurColor (in vec2 Coord, in sampler2D Tex, in float MipBias)',
'{',
'	vec2 TexelSize = MipBias/ViewportSize.xy;',
'    ',
'    vec4  Color = texture(Tex, Coord, MipBias);',
'    Color += texture(Tex, Coord + vec2(TexelSize.x,0.0), MipBias);    	',
'    Color += texture(Tex, Coord + vec2(-TexelSize.x,0.0), MipBias);    	',
'    Color += texture(Tex, Coord + vec2(0.0,TexelSize.y), MipBias);    	',
'    Color += texture(Tex, Coord + vec2(0.0,-TexelSize.y), MipBias);    	',
'    Color += texture(Tex, Coord + vec2(TexelSize.x,TexelSize.y), MipBias);    	',
'    Color += texture(Tex, Coord + vec2(-TexelSize.x,TexelSize.y), MipBias);    	',
'    Color += texture(Tex, Coord + vec2(TexelSize.x,-TexelSize.y), MipBias);    	',
'    Color += texture(Tex, Coord + vec2(-TexelSize.x,-TexelSize.y), MipBias);    ',
'',
'    return Color/9.0;',
'}',
'',

/*
'void mainImage( out vec4 fragColor, in vec2 fragCoord )',
'{',
'	float Threshold = 0.0 +_Threshold*1.0;',
'	float Intensity = 2.0 -_Intensity*2.0;',
'	float BlurSize  = 6.0 -_BlurSize *6.0;',
'',
'	vec2 uv = (fragCoord.xy/iResolution.xy);',//*vec2(1.0,-1.0);',
'    ',
'    vec4 Color = texture(tDiffuse, uv);',
'    ',
'    vec4 Highlight = clamp(BlurColor(uv, tDiffuse, BlurSize)-Threshold,0.0,1.0)*1.0/(1.0-Threshold);',
'        ',
'    fragColor = 1.0-(1.0-Color)*(1.0-Highlight*Intensity); //Screen Blend Mode',//Color;',//
'}',

		"void main() {",
MMD_SA.MME_PPE_main("BloomPostProcess"),
		"}"
*/

'void main() {',
'	float Threshold = 0.0 +_Threshold*1.0;',
'	float Intensity = 2.0 -_Intensity*2.0;',
'	float BlurSize  = 6.0 -_BlurSize *6.0;',

'	vec4 Color = texture(tDiffuse, vUv);',
'	vec4 Highlight = clamp(BlurColor(vUv, tDiffuse, BlurSize)-Threshold,0.0,1.0)*1.0/(1.0-Threshold);',
'	gl_FragColor = 1.0-(1.0-Color)*(1.0-Highlight*Intensity);',
'}',

	].join( "\n" ),

	_refreshUniforms: function (refresh_all_uniforms) {
//MMD_SA.MME_PPE_refreshUniforms.call(this, "BloomPostProcess", refresh_all_uniforms)

var EC = MMD_SA_options.MME.PostProcessingEffects
var e = EC._effects.BloomPostProcess

if (refresh_all_uniforms) {
  e.uniforms[ 'ViewportSize' ].value = new THREE.Vector2(EC._width, EC._height);
}

var b = EC.effects_by_name.BloomPostProcess
e.uniforms["_BlurSize"].value  = 1 - (b.blur_size || 0.5)
e.uniforms["_Threshold"].value = 1 - (b.threshold || 0.5)
e.uniforms["_Intensity"].value = 1 - (b.intensity || 0.5)

//DEBUG_show(e.textureID+'/'+Date.now())
//if (e.uniforms[ 'tDiffuse' ].value) { e.uniforms[ 'tDiffuse' ].value.minFilter = THREE.LinearFilter; }//THREE.LinearMipMapLinearFilter; }//
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
//MMD_SA.MME_PPE_init.call(this, "BloomPostProcess")
	}

};

// init
THREE.BloomPostProcess._init();
