/**
 * @author bhouston / http://clara.io
 *
 * For a horizontal blur, use X_STEP 1, Y_STEP 0
 * For a vertical blur, use X_STEP 0, Y_STEP 1
 *
 * For speed, this shader precomputes uv offsets in vert shader to allow for prefetching
 *
 */

THREE.DepthLimitedBlurShaderV = {

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

		"void main() {",

//"gl_FragColor = texture2D( tDepth, vUv ); return;",

			"float depth = getDepth( vUv );",
			"if( depth >= ( 1.0 - EPSILON ) ) {",
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

//"gl_FragColor = vec4(vec3(sampleWeights[0]*5.0), 1.0); return;",

		"}"

	].join( "\n" )

   ,_prevStdDev: null
   ,_prevNumSamples: null
   ,_params: {
				saoBlurRadius: 6,//12,
				saoBlurStdDev: 6,
				saoBlurDepthCutoff: 0.01 *0.01
    }

   ,_refreshUniforms: function (refresh_all_uniforms) {
var EC = MMD_SA_options.MME.PostProcessingEffects
var name = "DepthLimitedBlurShaderV"
var e = EC._effects[name]

if (refresh_all_uniforms) {
  e.uniforms[ 'size' ].value = new THREE.Vector2(EC._width, EC._height);
  e.uniforms[ 'tDepth' ].value = EC._depthRenderTarget

  var camera = MMD_SA.camera_list[0]
  e.uniforms[ 'cameraNear' ].value = camera.near;
  e.uniforms[ 'cameraFar' ].value = camera.far;

  var depthCutoff = this._params.saoBlurDepthCutoff * ( camera.far - camera.near );
  e.uniforms[ 'depthCutoff' ].value = depthCutoff;

				this._params.saoBlurRadius = Math.floor( this._params.saoBlurRadius );
				if(( this._prevStdDev !== this._params.saoBlurStdDev )||
					( this._prevNumSamples !== this._params.saoBlurRadius )) {
					THREE.BlurShaderUtils.configure( e, this._params.saoBlurRadius, this._params.saoBlurStdDev, new THREE.Vector2( 0, 1 ) );
					THREE.BlurShaderUtils.configure( EC._effects.DepthLimitedBlurShaderH, this._params.saoBlurRadius, this._params.saoBlurStdDev, new THREE.Vector2( 1, 0 ) );
					this._prevStdDev = this._params.saoBlurStdDev;
					this._prevNumSamples = this._params.saoBlurRadius;
				}

}
	}

};


THREE.BlurShaderUtils = {

	createSampleWeights: function( kernelRadius, stdDev ) {

		var gaussian = function( x, stdDev ) {
			return Math.exp( - ( x*x ) / ( 2.0 * ( stdDev * stdDev ) ) ) / ( Math.sqrt( 2.0 * Math.PI ) * stdDev );
		};

		var weights = [];

		for( var i = 0; i <= kernelRadius; i ++ ) {
			weights.push( gaussian( i, stdDev ) );
		}

		return weights;
	},

	createSampleOffsets: function( kernelRadius, uvIncrement ) {

		var offsets = [];

		for( var i = 0; i <= kernelRadius; i ++ ) {
			offsets.push( uvIncrement.clone().multiplyScalar( i ) );
		}

		return offsets;

	},

	configure: function( effect, kernelRadius, stdDev, uvIncrement ) {

var material = effect.material
/*
effect.defines[ 'KERNEL_RADIUS' ] = 
effect.uniforms[ 'sampleUvOffsets' ].value = 
effect.uniforms[ 'sampleWeights' ].value = 
*/
material.defines[ 'KERNEL_RADIUS' ] = kernelRadius;
material.uniforms[ 'sampleUvOffsets' ].value = THREE.BlurShaderUtils.createSampleOffsets( kernelRadius, uvIncrement );
material.uniforms[ 'sampleWeights' ].value = THREE.BlurShaderUtils.createSampleWeights( kernelRadius, stdDev );
material.needsUpdate = true;

//console.log(JSON.stringify(material.uniforms[ 'sampleWeights' ].value))
	}

};

