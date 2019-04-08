/**
 */

THREE.EffectToNormalSize = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },

"tDiffuse_EffectSource": { type: "t", value: null }

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

((MMD_SA_options.MME.PostProcessingEffects && MMD_SA_options.MME.PostProcessingEffects.effects_by_name.EffectToNormalSize && MMD_SA_options.MME.PostProcessingEffects.effects_by_name.EffectToNormalSize.use_solid_bg) ? '#define SOLID_BG' : ''),


		"void main() {",

			"vec4 texel = texture2D( tDiffuse_EffectSource, vUv );",

'vec4 color = texture2D( tDiffuse, vUv );',


'#ifdef SOLID_BG',
			"gl_FragColor = vec4(texel.rgb + color.rgb * (1.0 - texel.a*0.9), 1.0);",
'#else',
			"gl_FragColor = vec4(texel.rgb + color.rgb * (1.0 - texel.a*0.9), pow(texel.a + color.a * (1.0 - texel.a), 0.5));",
'#endif',

		"}"

	].join( "\n" ),

	_refreshUniforms: function (refresh_all_uniforms, index) {
var EC = MMD_SA_options.MME.PostProcessingEffects
var name = "EffectToNormalSize" + ((index) ? index : "")
var e = EC._effects[name]

if (refresh_all_uniforms) {
}

var composer_last_active_index = []
for (var i = e._composer_index-1; i >= 0; i--) {
  if (!EC._composers_list[i]._disabled) {
    if (composer_last_active_index.push(i) == 2)
      break
  }
}
//e.uniforms[ 'tDiffuse' ].value = EC._composers_list[composer_last_active_index-1].readBuffer;
var c = EC._composers_list[composer_last_active_index[1] || 0]
e.uniforms[ 'tDiffuse_EffectSource' ].value = c._source_readBuffer || c.readBuffer;
	},

	_init: function () {
for (var i = 0; i < 9; i++)
  THREE["EffectToNormalSize" + i] = this
	}

};

// init
THREE.EffectToNormalSize._init();
