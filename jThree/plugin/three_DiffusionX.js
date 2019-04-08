/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

/**
 * codes modified to work on System Animator, by Butz Yung/Anime Theme
 * http://www.animetheme.com/sidebar/
 */

THREE.DiffusionX = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },

"ViewportSize": { type: "v2", value: new THREE.Vector2(640,480) }

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
'vec4 texel;',

'for (int i = -SAMP_NUM; i <= SAMP_NUM; i++) {',
'  f = float(i);',

'  e = exp(-pow(f / (SAMP_NUM_f / 2.0), 2.0) / 2.0);', //正規分布
'  sum += pow(texture2D(tDiffuse, vec2(vUv.x + SampStep.x * f, vUv.y)), vec4(2.0)) * e;', //RGBを2乗
'  n += e;',

'}',

'gl_FragColor = sum / n;',

		"}"

	].join( "\n" ),

	_refreshUniforms: function (refresh_all_uniforms) {
var EC = MMD_SA_options.MME.PostProcessingEffects
var name = "DiffusionX"
var e = EC._effects[name]

if (refresh_all_uniforms) {
  e.uniforms[ 'ViewportSize' ].value = new THREE.Vector2(EC._width, EC._height);
}

if (e.textureID != "MANUAL_ASSIGN")
  return

var composer_last_active_index
for (var i = EC._effects[name]._composer_index-1; i >= 0; i--) {
  if (!EC._composers_list[i]._disabled) {
    composer_last_active_index = i
    break
  }
}
e.uniforms[ 'tDiffuse' ].value = EC._composers_list[composer_last_active_index].readBuffer;//EC._depthRenderTarget//
	}

};
