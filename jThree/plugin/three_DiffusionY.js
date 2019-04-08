/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

/**
 * codes modified to work on System Animator, by Butz Yung/Anime Theme
 * http://www.animetheme.com/sidebar/
 */

THREE.DiffusionY = {

	uniforms: {

		"tDiffuse": { type: "t", value: null }

 ,"ViewportSize": { type: "v2", value: new THREE.Vector2(640,480) }
 ,"tDiffuse_SourceCopy": { type: "t", value: null }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

// concepts borrowed from "Diffusion7" MME effect for MMD, by そぼろ

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

'uniform vec2 ViewportSize;',
'uniform sampler2D tDiffuse_SourceCopy;',

'#define SAMP_NUM 7',
'#define SAMP_NUM_f 7.0' ,
'#define Extent ' + 0.001953125,

'const float scaling = 1.0;',

		"void main() {",

//			"vec4 texel = texture2D( tDiffuse, vUv );",
//			"gl_FragColor = texel;",

'vec2 SampStep = (vec2(Extent,Extent)/ViewportSize*ViewportSize.y) * scaling;',

'vec4 sum = vec4(0.0);',
'float e = 0.0;',
'float f = 0.0;',
'float n = 0.0;',

'for (int i = -SAMP_NUM; i <= SAMP_NUM; i++) {',
'  f = float(i);',

'  e = exp(-pow(f / (SAMP_NUM_f / 2.0), 2.0) / 2.0);', //正規分布
'  sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y + SampStep.y * f)) * e;',
'  n += e;',

'}',

'vec4 Color = sum / n;',

'vec4 ColorOrg = texture2D( tDiffuse_SourceCopy, vUv );',

'vec4 ColorSrc = vec4(pow(ColorOrg.rgb, vec3(2.0)), ColorOrg.a);',

    // Color = 乗算 + ボカし（Pb）　ColorW = 白画面　ColorSrc = 乗算（Pa）　ColorOrg = MMD
    //　スクリーン合成
'Color = ColorSrc + Color - ColorSrc * Color;',

	//　色調補正量を暗さに比例させて合成
'Color.rgb = mix(Color.rgb * vec3(' + MMD_SA_options.MME._toFloat(MMD_SA_options.MME.PostProcessingEffects.effects_by_name.DiffusionY.color_adjust || [1,1,1]) + '), Color.rgb, Color.rgb);',

	//　MMD 出力と合成結果を比較（明）でブレンド
'Color = max(Color, ColorOrg);',

	//　合成比率とアクセサリの不透明度を元にオリジナルと合成
'Color = mix(ColorOrg, Color, 2.0/3.0 * ' + MMD_SA_options.MME._toFloat(MMD_SA_options.MME.PostProcessingEffects.effects_by_name.DiffusionY.opacity || 1) + ');',
//0.75

'Color.a = max(ColorOrg.a, Color.a);',	//　透明部分にもボカシをはみ出させたい場合
//'Color.a = ColorOrg.a;',				//　透明部分にはボカシをはみ出させない場合

'gl_FragColor = Color;',

		"}"

	].join( "\n" ),

	_refreshUniforms: function (refresh_all_uniforms) {
var EC = MMD_SA_options.MME.PostProcessingEffects
var name = "DiffusionY"

if (refresh_all_uniforms) {
  EC._effects.DiffusionY.uniforms[ 'ViewportSize' ].value = new THREE.Vector2(EC._width, EC._height);
}

var composer_last_active_index
for (var i = EC._effects[name]._composer_index-1; i >= 0; i--) {
  if (!EC._composers_list[i]._disabled) {
    composer_last_active_index = i
    break
  }
}
var c = EC._composers_list[composer_last_active_index]
EC._effects[name].uniforms[ 'tDiffuse_SourceCopy' ].value = c._source_readBuffer || c.readBuffer;
	}

};
