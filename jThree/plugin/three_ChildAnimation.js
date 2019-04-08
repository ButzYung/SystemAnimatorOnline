/**
 */

THREE.ChildAnimation = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },

"tDiffuse_EffectSource": { type: "t", value: null },

"draw_behind": { type:"i", value:0 },

"aspect_ratio": { type:"v2", value:new THREE.Vector2(1,1) }

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

"uniform sampler2D tDiffuse_EffectSource;",

"uniform bool draw_behind;",

"uniform vec2 aspect_ratio;",

//((MMD_SA_options.MME.PostProcessingEffects && MMD_SA_options.MME.PostProcessingEffects.effects_by_name.ChildAnimation && MMD_SA_options.MME.PostProcessingEffects.effects_by_name.ChildAnimation.use_solid_bg) ? '#define SOLID_BG' : ''),


		"void main() {",

			"vec4 texel = texture2D( tDiffuse_EffectSource, (1.0-aspect_ratio)/2.0+vUv*aspect_ratio);",

'vec4 color = texture2D( tDiffuse, vUv );',


'if (draw_behind) {',
'	gl_FragColor = vec4(mix(color.rgb, texel.rgb, (1.0-color.a) * (1.0 + min(texel.a - color.a, 0.0))), pow(color.a + texel.a * (1.0 - color.a), 0.5));',
'}',
'else {',
'	gl_FragColor = vec4(mix(texel.rgb, color.rgb, (1.0-texel.a) * (1.0 + min(color.a - texel.a, 0.0))), pow(texel.a + color.a * (1.0 - texel.a), 0.5));',
'}',

		"}"

	].join( "\n" ),

	_refreshUniforms: function (refresh_all_uniforms, index) {
var EC = MMD_SA_options.MME.PostProcessingEffects
var name = "ChildAnimation" + ((index) ? index : "")
var e = EC._effects[name]

var e_para = EC.effects[e._index]

var cw = document.getElementById("Ichild_animation" + e_para.child_index).contentWindow

if (refresh_all_uniforms) {
  e.uniforms[ 'draw_behind' ].value = (EC.effects[e._index].draw_behind) ? 1 : 0
  if (cw.SL) {
    var ar = (SL.width/SL.height) / (cw.SL.width/cw.SL.height)
    e.uniforms[ 'aspect_ratio' ].value = (ar >= 1) ? new THREE.Vector2(1, 1/ar) : new THREE.Vector2(ar, 1)
  }
}

var filename = '[ChildAnimation' + e_para.child_index + ']'
if (!EC._texture_common[filename]) {
  if (cw.SL)
    EC._texture_common[filename] = new THREE.Texture(cw._canvas_for_copy || cw.SL)
}
if (EC._texture_common[filename]) {
  EC._texture_common[filename].needsUpdate = true
  e.uniforms[ 'tDiffuse_EffectSource' ].value = EC._texture_common[filename]
}

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
for (var i = 0; i < 9; i++)
  THREE["ChildAnimation" + i] = this

var EC = MMD_SA_options.MME.PostProcessingEffects
if (!EC._texture_common)
  EC._texture_common = {}
	}

};

// init
THREE.ChildAnimation._init();
