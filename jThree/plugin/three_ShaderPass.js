/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.ShaderPass = function ( shader, textureID ) {

	this.textureID = ( textureID !== undefined ) ? textureID : "tDiffuse";

	this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

	this.material = new THREE.ShaderMaterial( {

		defines: shader.defines || {},
		uniforms: this.uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader

,blending: THREE.AdditiveBlending
//,blendSrc: THREE.OneFactor

	} );

	this.renderToScreen = false;

	this.enabled = true;
	this.needsSwap = true;
	this.clear = false;


	this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	this.scene  = new THREE.Scene();

	this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
	this.scene.add( this.quad );

};

THREE.ShaderPass.prototype = {

	render: function ( renderer, writeBuffer, readBuffer, delta ) {

// AT: custom source readBuffer
if (/SOURCE_READBUFFER(\d+)/.test(this.textureID) && this.uniforms['tDiffuse']) {
  var EC = MMD_SA_options.MME.PostProcessingEffects
  var c_index = parseInt(RegExp.$1)
  var c = EC._composers_list[c_index]
  if (c._disabled) {
    for (var i = c_index-1; i >= 0; i--) {
      if (!EC._composers_list[i]._disabled) {
        c = EC._composers_list[i]
        break
      }
    }
  }
  this.uniforms['tDiffuse'].value = c._source_readBuffer || c.readBuffer;
//if (this.textureID=="SOURCE_READBUFFER0") this.uniforms['tDiffuse'].value = EC._render_targets_list[0].render_target
}
else
		if ( this.uniforms[ this.textureID ] ) {

			this.uniforms[ this.textureID ].value = readBuffer;

		}

		this.quad.material = this.material;

		if ( this.renderToScreen ) {

			renderer.render( this.scene, this.camera );

		} else {

			renderer.render( this.scene, this.camera, writeBuffer, this.clear );

		}

	}

};
