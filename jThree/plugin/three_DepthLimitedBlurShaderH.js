/**
 * @author bhouston / http://clara.io
 *
 * For a horizontal blur, use X_STEP 1, Y_STEP 0
 * For a vertical blur, use X_STEP 0, Y_STEP 1
 *
 * For speed, this shader precomputes uv offsets in vert shader to allow for prefetching
 *
 */

THREE.DepthLimitedBlurShaderH = {

	defines: {

		"KERNEL_RADIUS": 4,
		"DEPTH_PACKING": 1,
		"PERSPECTIVE_CAMERA": 1

	},

	uniforms: {

		"tDiffuse":         { type: "t", value: null },
		"size":             { type: "v2", value: new THREE.Vector2( 512, 512 ) },
		"sampleUvOffsets":  { type: "v2v", value: [ new THREE.Vector2( 0, 0 ) ] },
		"sampleWeights":    { type: "1fv", value: [ 1.0 ] },
		"tDepth":           { type: "t", value: null },
		"cameraNear":       { type: "f", value: 10 },
		"cameraFar":        { type: "f", value: 1000 },
		"depthCutoff":      { type: "f", value: 10 },

"tDiffuse_SourceCopy": { type: "t", value: null }

	},

	vertexShader: [

//		"#include <common>",
THREE.ShaderChunk[ 'common' ],

		"uniform vec2 size;",

		"varying vec2 vUv;",
		"varying vec2 vInvSize;",

		"void main() {",

			"vUv = uv;",
			"vInvSize = 1.0 / size;",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

//		"#include <common>",
//		"#include <packing>",
THREE.ShaderChunk[ 'common' ],
THREE.ShaderChunk[ 'packing' ],

		"uniform sampler2D tDiffuse;",
		"uniform sampler2D tDepth;",

		"uniform float cameraNear;",
		"uniform float cameraFar;",
		"uniform float depthCutoff;",

		"uniform vec2 sampleUvOffsets[ KERNEL_RADIUS + 1 ];",
		"uniform float sampleWeights[ KERNEL_RADIUS + 1 ];",

'uniform sampler2D tDiffuse_SourceCopy;',

		"varying vec2 vUv;",
		"varying vec2 vInvSize;",

		"float getDepth( const in vec2 screenPosition ) {",

			"#if DEPTH_PACKING == 1",
"vec4 d_color = texture2D( tDepth, screenPosition );",
"if (all(equal(d_color, vec4(0.0)))) d_color = vec4(1.0);",
"return unpackRGBAToDepth(d_color);",
//				"return unpackRGBAToDepth( texture2D( tDepth, screenPosition ) );",
			"#else",
				"return texture2D( tDepth, screenPosition ).x;",
			"#endif",

		"}",

		"float getViewZ( const in float depth ) {",

			"#if PERSPECTIVE_CAMERA == 1",
				"return perspectiveDepthToViewZ( depth, cameraNear, cameraFar );",
			"#else",
				"return orthoDepthToViewZ( depth, cameraNear, cameraFar );",
			"#endif",

		"}",

"void RGBtoYCbCr(vec3 rgbColor, out float Y, out float Cb, out float Cr) {",
"    Y  =  0.298912 * rgbColor.r + 0.586611 * rgbColor.g + 0.114478 * rgbColor.b;",
"    Cb = -0.168736 * rgbColor.r - 0.331264 * rgbColor.g + 0.5      * rgbColor.b;",
"    Cr =  0.5      * rgbColor.r - 0.418688 * rgbColor.g - 0.081312 * rgbColor.b;",
"}",


"vec3 YCbCrtoRGB(float Y, float Cb, float Cr) {",
"    float R = Y - 0.000982 * Cb + 1.401845 * Cr;",
"    float G = Y - 0.345117 * Cb - 0.714291 * Cr;",
"    float B = Y + 1.771019 * Cb - 0.000154 * Cr;",
"    return vec3( R, G, B );",
"}",

		"void main() {",

//"gl_FragColor = vec4(vec3(texture2D( tDiffuse_SourceCopy, vUv ).a), 1.0); return;",

			"float depth = getDepth( vUv );",
			"if( depth >= ( 1.0 - EPSILON ) ) {",
//"gl_FragColor = texture2D( tDiffuse_SourceCopy, vUv ); return;",
				"discard;",
			"}",

//"gl_FragColor = vec4(vec3(depth), 1.0); return;",
//vec4(vec3(float(KERNEL_RADIUS)/12.0), 1.0)
//texture2D( tDiffuse, vUv )
//texture2D( tDepth, vUv )

			"float centerViewZ = -getViewZ( depth );",
			"bool rBreak = false, lBreak = false;",

			"float weightSum = sampleWeights[0];",
			"vec4 diffuseSum = texture2D( tDiffuse, vUv ) * weightSum;",

//"gl_FragColor = vec4(vec3(weightSum), 1.0); return;",

			"for( int i = 1; i <= KERNEL_RADIUS; i ++ ) {",

				"float sampleWeight = sampleWeights[i];",
				"vec2 sampleUvOffset = sampleUvOffsets[i] * vInvSize;",

				"vec2 sampleUv = vUv + sampleUvOffset;",
				"float viewZ = -getViewZ( getDepth( sampleUv ) );",

				"if( abs( viewZ - centerViewZ ) > depthCutoff ) rBreak = true;",

				"if( ! rBreak ) {",
					"diffuseSum += texture2D( tDiffuse, sampleUv ) * sampleWeight;",
					"weightSum += sampleWeight;",
				"}",

				"sampleUv = vUv - sampleUvOffset;",
				"viewZ = -getViewZ( getDepth( sampleUv ) );",

				"if( abs( viewZ - centerViewZ ) > depthCutoff ) lBreak = true;",

				"if( ! lBreak ) {",
					"diffuseSum += texture2D( tDiffuse, sampleUv ) * sampleWeight;",
					"weightSum += sampleWeight;",
				"}",

			"}",

			"gl_FragColor = diffuseSum / weightSum;",

//"return;",

"vec4 color_source = texture2D( tDiffuse_SourceCopy, vUv );",

//"gl_FragColor = vec4(mix(vec3(0.0), color_source.rgb, gl_FragColor.r+(1.0-gl_FragColor.a)), color_source.a);",

/*
    // RGBからYCbCrへの変換
    float Y, Cb, Cr;
    RGBtoYCbCr( Color.rgb, Y, Cb, Cr);

    // 合成
    float a = clamp(1.0f - 0.05f * AcsSi * ssao, 0.1f, 1.0f);
    float density = 1.0f / a;
    float3 color = lerp(Color.rgb*a, Color.rgb, pow(Color.rgb, density));
    Color.rgb = lerp( YCbCrtoRGB( Y*a, Cb, Cr), color, AcsTr);
*/

"float Y, Cb, Cr;",
"RGBtoYCbCr(color_source.rgb, Y, Cb, Cr);",

"float _a = clamp((gl_FragColor.r+(1.0-gl_FragColor.a)), 0.1, 1.0);",
"float _density = 1.0 / _a;",
"vec3 _color = mix(color_source.rgb*_a, color_source.rgb, pow(color_source.rgb, vec3(_density)));",
"gl_FragColor = vec4(mix(YCbCrtoRGB( Y*_a, Cb, Cr), _color, 0.5), pow(color_source.a, 0.5));",
//YCbCrtoRGB( Y*_a, Cb, Cr)
//color_source.rgb*_a
		"}"

	].join( "\n" )

   ,_prevStdDev: null
   ,_prevNumSamples: null
   ,_params: THREE.DepthLimitedBlurShaderV._params
/*
{
				saoBlurRadius: 12,
				saoBlurStdDev: 6,
				saoBlurDepthCutoff: 0.01
    }
*/
   ,_refreshUniforms: function (refresh_all_uniforms) {
var EC = MMD_SA_options.MME.PostProcessingEffects
var name = "DepthLimitedBlurShaderH"
var e = EC._effects[name]

if (refresh_all_uniforms) {
  e.uniforms[ 'size' ].value = new THREE.Vector2(EC._width, EC._height);
  e.uniforms[ 'tDepth' ].value = EC._depthRenderTarget

  var camera = MMD_SA.camera_list[0]
  e.uniforms[ 'cameraNear' ].value = camera.near;
  e.uniforms[ 'cameraFar' ].value = camera.far;

  var depthCutoff = this._params.saoBlurDepthCutoff * ( camera.far - camera.near );
  e.uniforms[ 'depthCutoff' ].value = depthCutoff;
}

var composer_last_active_index
for (var i = EC._effects[name]._composer_index-1; i >= 0; i--) {
  if (!EC._composers_list[i]._disabled) {
    composer_last_active_index = i
    break
  }
}
var c = EC._composers_list[composer_last_active_index]
e.uniforms[ 'tDiffuse_SourceCopy' ].value = c._source_readBuffer || c.readBuffer;
	}

};
