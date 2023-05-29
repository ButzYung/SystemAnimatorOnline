import {
	Color
} from 'three';
import { Pass } from './Pass.js';
// AT: CopyShader/ShaderPass
import { CopyShader } from '../shaders/CopyShader.js';
import { ShaderPass } from './ShaderPass.js';

class RenderPass extends Pass {

	constructor( scene, camera, overrideMaterial, clearColor, clearAlpha ) {

		super();

		this.scene = scene;
		this.camera = camera;

		this.overrideMaterial = overrideMaterial;

		this.clearColor = clearColor;
		this.clearAlpha = ( clearAlpha !== undefined ) ? clearAlpha : 0;

		this.clear = true;
		this.clearDepth = false;
		this.needsSwap = false;
		this._oldClearColor = new Color();

	}

	render( renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ ) {

		const oldAutoClear = renderer.autoClear;
		renderer.autoClear = false;

		let oldClearAlpha, oldOverrideMaterial;

		if ( this.overrideMaterial !== undefined ) {

			oldOverrideMaterial = this.scene.overrideMaterial;

			this.scene.overrideMaterial = this.overrideMaterial;

		}

		if ( this.clearColor ) {

			renderer.getClearColor( this._oldClearColor );
			oldClearAlpha = renderer.getClearAlpha();

			renderer.setClearColor( this.clearColor, this.clearAlpha );

		}

		if ( this.clearDepth ) {

			renderer.clearDepth();

		}

// AT: depthTexture
if (this._renderTarget_with_depthTexture) {
  renderer.setRenderTarget(this._renderTarget_with_depthTexture);
}
else
		renderer.setRenderTarget( this.renderToScreen ? null : readBuffer );

		// TODO: Avoid using autoClear properties, see https://github.com/mrdoob/three.js/pull/15571#issuecomment-465669600
		if ( this.clear ) renderer.clear( renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil );
		renderer.render( this.scene, this.camera );

		if ( this.clearColor ) {

			renderer.setClearColor( this._oldClearColor, oldClearAlpha );

		}

		if ( this.overrideMaterial !== undefined ) {

			this.scene.overrideMaterial = oldOverrideMaterial;

		}

		renderer.autoClear = oldAutoClear;

// AT: depthTexture
if (this._renderTarget_with_depthTexture) {
  this._copyPass = this._copyPass || new ShaderPass( CopyShader );
  this._copyPass.render( renderer, readBuffer, this._renderTarget_with_depthTexture  );
}

	}

// AT: setSize/dispose
setSize( width, height ) {
  this._renderTarget_with_depthTexture?.setSize( width, height );
}
dispose() {
  this._renderTarget_with_depthTexture?.dispose();
  this._copyPass?.dispose();
}

}

export { RenderPass };
