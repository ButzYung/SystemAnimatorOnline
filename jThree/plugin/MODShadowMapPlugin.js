/**
 * @author alteredq / http://alteredqualia.com/
 */
// MOD by katwat
// AT: (2021-08-06)
THREE.ShadowMapPlugin = function () {

	var _gl,
	_renderer,
	_depthMaterial, _depthMaterialMorph, _depthMaterialSkin, _depthMaterialMorphSkin,

	_frustum = new THREE.Frustum(),
	_projScreenMatrix = new THREE.Matrix4(),

	_cullFace,

	_min = new THREE.Vector3(),
	_max = new THREE.Vector3(),

	_tmpV = new THREE.Vector3();

	this.init = function ( renderer ) {

		_gl = renderer.context;
		_renderer = renderer;

		var depthShader = THREE.ShaderLib[ "depthRGBA" ];
		var depthUniforms = THREE.UniformsUtils.clone( depthShader.uniforms );

		_depthMaterial = new THREE.ShaderMaterial( { fragmentShader: depthShader.fragmentShader, vertexShader: depthShader.vertexShader, uniforms: depthUniforms } );
		_depthMaterialMorph = new THREE.ShaderMaterial( { fragmentShader: depthShader.fragmentShader, vertexShader: depthShader.vertexShader, uniforms: depthUniforms, morphTargets: true } );
		_depthMaterialSkin = new THREE.ShaderMaterial( { fragmentShader: depthShader.fragmentShader, vertexShader: depthShader.vertexShader, uniforms: depthUniforms, skinning: true } );
		_depthMaterialMorphSkin = new THREE.ShaderMaterial( { fragmentShader: depthShader.fragmentShader, vertexShader: depthShader.vertexShader, uniforms: depthUniforms, morphTargets: true, skinning: true } );

// AT: fix skin/morph shadow by switching materials per object (i.e. forcing uniforms to update properly, etc)
this._switch_material = (function () {
  var depth_material_by_index = {};
  var index;
  return function (object, useMorphing) {
// use ._model_index_default instead of _model_index_default to avoid PC swap issues
// using -1 for non-MMD-model objects for now (unlikely used anyways), as Object3D.id can change on map restart, and it doesn't work well for clones
    index = (object._model_index_default != null) ? object._model_index_default : -1;

    var m = depth_material_by_index[index]
    if (!m)
      m = depth_material_by_index[index] = { _depthMaterialMorphSkin:_depthMaterialMorphSkin.clone(), _depthMaterialSkin:_depthMaterialSkin.clone() }

    return useMorphing ? m._depthMaterialMorphSkin : m._depthMaterialSkin;
  }
})();

		_depthMaterial._shadowPass = true;
		_depthMaterialMorph._shadowPass = true;
		_depthMaterialSkin._shadowPass = true;
		_depthMaterialMorphSkin._shadowPass = true;

	};

	this.render = function ( scene, camera ) {

		if ( ! ( _renderer.shadowMapEnabled && _renderer.shadowMapAutoUpdate ) ) { return; }
// AT: skip in mirror (not working)
//if (MMD_SA._mirror_rendering_) return

		this.update( scene, camera );

	};

	// ADD by katwat
	function setCullFace( cullFace ) {
		if ( _cullFace === cullFace ) {
			return;
		}
		if ( cullFace === THREE.CullFaceNone) {
			_gl.disable( _gl.CULL_FACE );
		} else {
			_gl.enable( _gl.CULL_FACE );
			switch ( cullFace ) {
			case THREE.CullFaceBack:
				_gl.cullFace( _gl.BACK );
				break;
			case THREE.CullFaceFront:
				_gl.cullFace( _gl.FRONT );
				break;
			case THREE.CullFaceFrontBack:
				_gl.cullFace( _gl.FRONT_AND_BACK );
				break;
			}
		}
		_cullFace = cullFace;
	}

	this.update = function ( scene, camera ) {

		var i, il, j, jl, n,

		shadowMap, shadowMatrix, shadowCamera,
		buffer, material,
		webglObject, object, light,
		renderList,

		lights = [],
		k = 0,

		fog = null;

		// set GL state for depth map

		_gl.clearColor( 1, 1, 1, 1 );
		_gl.disable( _gl.BLEND );

		//_gl.enable( _gl.CULL_FACE );
		_gl.frontFace( _gl.CCW );
		setCullFace( _renderer.shadowMapCullFace ); // MOD by katwat

		_renderer.setDepthTest( true );

// AT: light id
var dir_light_id = -1

		// preprocess lights
		// 	- skip lights that are not casting shadows
		//	- create virtual lights for cascaded shadow maps
//console.log(scene.__lights.length)
		for ( i = 0, il = scene.__lights.length; i < il; i ++ ) {

			light = scene.__lights[ i ];

// AT: light id
// [light type, light id]
// light type: DirectionalLight=0
if (!light.isVirtual) {
  if (light instanceof THREE.DirectionalLight) {
    dir_light_id++
    if (!light._shadowPara)
      light._shadowPara = new THREE.Vector3(0, dir_light_id, 0)
  }
  else {
// dummy for now
    if (!light._shadowPara)
      light._shadowPara = new THREE.Vector3(1,0,0)
  }
}

			if ( ! light.castShadow ) { continue; }

			if ( ( light instanceof THREE.DirectionalLight ) && light.shadowCascade ) {

				for ( n = 0; n < light.shadowCascadeCount; n ++ ) {

					var virtualLight;

					if ( ! light.shadowCascadeArray[ n ] ) {

						virtualLight = createVirtualLight( light, n );
						virtualLight.originalCamera = camera;

// AT: plight id
virtualLight._shadowPara = light._shadowPara.clone();

// AT: cascaded shadow map
scene.add(virtualLight)
/*
						var gyro = new THREE.Gyroscope();
						gyro.position = light.shadowCascadeOffset;

						gyro.add( virtualLight );
						gyro.add( virtualLight.target );

						camera.add( gyro );
*/
						light.shadowCascadeArray[ n ] = virtualLight;

						console.log( "Created virtualLight", virtualLight );

					} else {

						virtualLight = light.shadowCascadeArray[ n ];

					}

					updateVirtualLight( light, n );

					lights[ k ] = virtualLight;
					k ++;

				}

			} else {
// AT: avoid duplicated lights
if (light.isVirtual) continue;

				lights[ k ] = light;
				k ++;

			}

		}

		// render depth map

// AT: frustum debug
var _inside_frustum = {}
var _inside_frustum_count = []
var _inside_frustum_skipped = []
for (let i = 0, il = lights.length; i < il; i ++ ) {
  _inside_frustum_count[i] = 0
  _inside_frustum_skipped[i] = 0
}

		for ( i = 0, il = lights.length; i < il; i ++ ) {

			light = lights[ i ];

			if ( ! light.shadowMap ) {

				var shadowFilter = THREE.LinearFilter;

				if ( _renderer.shadowMapType === THREE.PCFSoftShadowMap ) {

					shadowFilter = THREE.NearestFilter;

				}

				var pars = { minFilter: shadowFilter, magFilter: shadowFilter, format: THREE.RGBAFormat };

				light.shadowMap = new THREE.WebGLRenderTarget( light.shadowMapWidth, light.shadowMapHeight, pars );
				light.shadowMapSize = new THREE.Vector2( light.shadowMapWidth, light.shadowMapHeight );

				light.shadowMatrix = new THREE.Matrix4();

			}

			if ( ! light.shadowCamera ) {

				if ( light instanceof THREE.SpotLight ) {

					light.shadowCamera = new THREE.PerspectiveCamera( light.shadowCameraFov, light.shadowMapWidth / light.shadowMapHeight, light.shadowCameraNear, light.shadowCameraFar );

				} else if ( light instanceof THREE.DirectionalLight ) {

					light.shadowCamera = new THREE.OrthographicCamera( light.shadowCameraLeft, light.shadowCameraRight, light.shadowCameraTop, light.shadowCameraBottom, light.shadowCameraNear, light.shadowCameraFar );

				} else {

					console.error( "Unsupported light type for shadow" );
					continue;

				}

				scene.add( light.shadowCamera );

				if ( scene.autoUpdate === true ) { scene.updateMatrixWorld(); }

			}

			if ( light.shadowCameraVisible && ! light.cameraHelper ) {

				light.cameraHelper = new THREE.CameraHelper( light.shadowCamera );
				light.shadowCamera.add( light.cameraHelper );

			}

			if ( light.isVirtual && virtualLight.originalCamera == camera ) {

				updateShadowCamera( camera, light );

			}

			shadowMap = light.shadowMap;
			shadowMatrix = light.shadowMatrix;
			shadowCamera = light.shadowCamera;

// AT: skip matrix (.position should be more updated)
shadowCamera.position.copy(light.position)
shadowCamera.lookAt(light.target.position)
//			shadowCamera.position.getPositionFromMatrix( light.matrixWorld );
//			_tmpV.getPositionFromMatrix( light.target.matrixWorld );
//			shadowCamera.lookAt( _tmpV );

			shadowCamera.updateMatrixWorld();

			shadowCamera.matrixWorldInverse.getInverse( shadowCamera.matrixWorld );

// AT: shadowBias by light normal
if (!light._shadowBias_range) {
  if (!light.shadowBias_range) light.shadowBias_range = [0.1, 100]
  light._shadowBias_range  = new THREE.Vector3(0, light.shadowBias_range[0], light.shadowBias_range[1]);
}
light._shadowBias_range.x = light.shadowBias;


			if ( light.cameraHelper ) { light.cameraHelper.visible = light.shadowCameraVisible; }
			if ( light.shadowCameraVisible ) { light.cameraHelper.update(); }

			// compute shadow matrix

			// -1.0 <= x,y,z <= 1.0  -->  0.0 <= x,y,z <= 1.0
			shadowMatrix.set( 0.5, 0.0, 0.0, 0.5,
							  0.0, 0.5, 0.0, 0.5,
							  0.0, 0.0, 0.5, 0.5,
							  0.0, 0.0, 0.0, 1.0 );

			shadowMatrix.multiply( shadowCamera.projectionMatrix );
			shadowMatrix.multiply( shadowCamera.matrixWorldInverse );

			// update camera matrices and frustum

			_projScreenMatrix.multiplyMatrices( shadowCamera.projectionMatrix, shadowCamera.matrixWorldInverse );
			_frustum.setFromMatrix( _projScreenMatrix );
//DEBUG_show(shadowCamera.projectionMatrix.flattenToArray([]).reduce(function(acc,cur,idx){return acc+cur*(idx+1);})+'\n'+light.matrixWorld.flattenToArray([]).reduce(function(acc,cur,idx){return acc+cur*(idx+1);})+'\n'+JSON.stringify(light.matrixWorld.decompose()))
			// render shadow map

			_renderer.setRenderTarget( shadowMap );
			_renderer.clear();

			// set object matrices & frustum culling

			renderList = scene.__webglObjects;

			for ( j = 0, jl = renderList.length; j < jl; j ++ ) {

				webglObject = renderList[ j ];

				// ADD by katwat
				objectMaterial = getObjectMaterial( webglObject );

				object = webglObject.object;

				webglObject.render = false;
//webglObject.render = true
//if ( object.visible && objectMaterial.castShadow ) {//}DEBUG_show(j,0,1)
				if ( object.visible && object.castShadow && ( objectMaterial.castShadow !== undefined ? objectMaterial.castShadow : true ) ) { // MOD by katwat
// AT: .intersectsOrContainsObject and _inside_frustum
					if ( ! ( object instanceof THREE.Mesh || object instanceof THREE.ParticleSystem ) || ! ( object.frustumCulled ) || _frustum.intersectsOrContainsObject( object ) ) {//.intersectsObject( object ) ) {//
_inside_frustum_count[i]++
if (_inside_frustum[j]) {
  _inside_frustum_skipped[i]++
  continue
}
if (_frustum._containing) {
  _inside_frustum[j] = true
}
						object._modelViewMatrix.multiplyMatrices( shadowCamera.matrixWorldInverse, object.matrixWorld );

						webglObject.render = true;

					}

				}

			}
//if (i==il-1) DEBUG_show(_inside_frustum_skipped+'\n'+_inside_frustum_count+'\n'+renderList.length+'\n'+Date.now())//if (i==1) DEBUG_show([shadowCamera.top,shadowCamera.right,shadowCamera.bottom,shadowCamera.left]+'\n'+shadowCamera.position.toArray()+'\n'+Date.now())//
			// render regular objects

			var objectMaterial, useMorphing, useSkinning;

			for ( j = 0, jl = renderList.length; j < jl; j ++ ) {

				webglObject = renderList[ j ];

				if ( webglObject.render ) {

					object = webglObject.object;
					buffer = webglObject.buffer;

					objectMaterial = getObjectMaterial( webglObject ); // MOD by katwat

					// ADD by katwat
					if ( objectMaterial.shadowMapCullFace !== undefined ) {
						setCullFace( objectMaterial.shadowMapCullFace );
					} else {
						setCullFace( _renderer.shadowMapCullFace );
					}

					useMorphing = object.geometry.morphTargets.length > 0 && objectMaterial.morphTargets;
					useSkinning = object instanceof THREE.SkinnedMesh && objectMaterial.skinning;

					if ( object.customDepthMaterial ) {

						material = object.customDepthMaterial;

					} else if ( useSkinning ) {
// AT: fix skin/morph shadow by switching materials per object (i.e. forcing uniforms to update properly, etc)
material = this._switch_material(object, useMorphing);
//						material = useMorphing ? _depthMaterialMorphSkin : _depthMaterialSkin;

					} else if ( useMorphing ) {

						material = _depthMaterialMorph;

					} else {

						material = _depthMaterial;

					}

					if ( buffer instanceof THREE.BufferGeometry ) {

						_renderer.renderBufferDirect( shadowCamera, scene.__lights, fog, material, buffer, object );

					} else {

						_renderer.renderBuffer( shadowCamera, scene.__lights, fog, material, buffer, object );

					}

				}

			}
			setCullFace( _renderer.shadowMapCullFace ); // ADD by katwat

			// set matrices and render immediate objects

			renderList = scene.__webglObjectsImmediate;

			for ( j = 0, jl = renderList.length; j < jl; j ++ ) {

				webglObject = renderList[ j ];
				object = webglObject.object;

				if ( object.visible && object.castShadow ) {

					object._modelViewMatrix.multiplyMatrices( shadowCamera.matrixWorldInverse, object.matrixWorld );

					_renderer.renderImmediateObject( shadowCamera, scene.__lights, fog, _depthMaterial, object );

				}

			}

		}

		// restore GL state

		var clearColor = _renderer.getClearColor(),
		clearAlpha = _renderer.getClearAlpha();

		_gl.clearColor( clearColor.r, clearColor.g, clearColor.b, clearAlpha );
		_gl.enable( _gl.BLEND );

		setCullFace( THREE.CullFaceBack ); // MOD by katwat

	};

	function createVirtualLight( light, cascade ) {

		var virtualLight = new THREE.DirectionalLight();

		virtualLight.isVirtual = true;

		virtualLight.onlyShadow = true;
		virtualLight.castShadow = true;

		virtualLight.shadowCameraNear = light.shadowCameraNear;
		virtualLight.shadowCameraFar = light.shadowCameraFar;

		virtualLight.shadowCameraLeft = light.shadowCameraLeft;
		virtualLight.shadowCameraRight = light.shadowCameraRight;
		virtualLight.shadowCameraBottom = light.shadowCameraBottom;
		virtualLight.shadowCameraTop = light.shadowCameraTop;

		virtualLight.shadowCameraVisible = light.shadowCameraVisible;

		virtualLight.shadowDarkness = light.shadowDarkness;

		virtualLight.shadowBias = light.shadowCascadeBias[ cascade ];
		virtualLight.shadowMapWidth = light.shadowCascadeWidth[ cascade ];
		virtualLight.shadowMapHeight = light.shadowCascadeHeight[ cascade ];

// AT: shadowBias_range
virtualLight.shadowBias_range = light.shadowBias_range;

		virtualLight.pointsWorld = [];
		virtualLight.pointsFrustum = [];

		var pointsWorld = virtualLight.pointsWorld,
			pointsFrustum = virtualLight.pointsFrustum;

		for ( var i = 0; i < 8; i ++ ) {

			pointsWorld[ i ] = new THREE.Vector3();
			pointsFrustum[ i ] = new THREE.Vector3();

		}

		var nearZ = light.shadowCascadeNearZ[ cascade ];
		var farZ = light.shadowCascadeFarZ[ cascade ];

		pointsFrustum[ 0 ].set( -1, -1, nearZ );
		pointsFrustum[ 1 ].set(  1, -1, nearZ );
		pointsFrustum[ 2 ].set( -1,  1, nearZ );
		pointsFrustum[ 3 ].set(  1,  1, nearZ );

		pointsFrustum[ 4 ].set( -1, -1, farZ );
		pointsFrustum[ 5 ].set(  1, -1, farZ );
		pointsFrustum[ 6 ].set( -1,  1, farZ );
		pointsFrustum[ 7 ].set(  1,  1, farZ );

		return virtualLight;

	}

	// Synchronize virtual light with the original light

	function updateVirtualLight( light, cascade ) {

		var virtualLight = light.shadowCascadeArray[ cascade ];
/*
// AT: scale virtual light position
if (self.MMD_SA && (cascade > 0) && virtualLight.shadowCamera) {
  let scale = cascade * 2
  virtualLight.position.fromArray(MMD_SA_options.light_position).multiplyScalar(scale).add(THREE.MMD.getModels()[0].mesh.position);
// projectionMatrix will be updated in updateShadowCamera()
  virtualLight.shadowCameraFar = virtualLight.shadowCamera.far = light.shadowCameraFar * scale;
}
else
*/
		virtualLight.position.copy( light.position );
		virtualLight.target.position.copy( light.target.position );
// AT: cascaded shadow map
virtualLight.lookAt( virtualLight.target.position );
//		virtualLight.lookAt( virtualLight.target );
//if (virtualLight instanceof THREE.DirectionalLight) console.log(virtualLight.lookAt);//DEBUG_show(light.target.position.toArray()+'\n'+virtualLight.target.position.toArray()+'\n'+virtualLight.target.matrixWorld.flattenToArray([]))
		virtualLight.shadowCameraVisible = light.shadowCameraVisible;
		virtualLight.shadowDarkness = light.shadowDarkness;

		virtualLight.shadowBias = light.shadowCascadeBias[ cascade ];

		var nearZ = light.shadowCascadeNearZ[ cascade ];
		var farZ = light.shadowCascadeFarZ[ cascade ];

		var pointsFrustum = virtualLight.pointsFrustum;

		pointsFrustum[ 0 ].z = nearZ;
		pointsFrustum[ 1 ].z = nearZ;
		pointsFrustum[ 2 ].z = nearZ;
		pointsFrustum[ 3 ].z = nearZ;

		pointsFrustum[ 4 ].z = farZ;
		pointsFrustum[ 5 ].z = farZ;
		pointsFrustum[ 6 ].z = farZ;
		pointsFrustum[ 7 ].z = farZ;

	}

	// Fit shadow camera's ortho frustum to camera frustum

	function updateShadowCamera( camera, light ) {
//return
		var shadowCamera = light.shadowCamera,
			pointsFrustum = light.pointsFrustum,
			pointsWorld = light.pointsWorld;

		_min.set( Infinity, Infinity, Infinity );
		_max.set( -Infinity, -Infinity, -Infinity );

		for ( var i = 0; i < 8; i ++ ) {

			var p = pointsWorld[ i ];

			p.copy( pointsFrustum[ i ] );
// AT: cascaded shadow map
p.unproject(camera)
//			THREE.ShadowMapPlugin.__projector.unprojectVector( p, camera );

			p.applyMatrix4( shadowCamera.matrixWorldInverse );

			if ( p.x < _min.x ) _min.x = p.x;
			if ( p.x > _max.x ) _max.x = p.x;

			if ( p.y < _min.y ) _min.y = p.y;
			if ( p.y > _max.y ) _max.y = p.y;

			if ( p.z < _min.z ) _min.z = p.z;
			if ( p.z > _max.z ) _max.z = p.z;

		}
//DEBUG_show([shadowCamera.left,shadowCamera.right,shadowCamera.top,shadowCamera.bottom]+'\n'+shadowCamera.far);return;
		shadowCamera.left = _min.x;
		shadowCamera.right = _max.x;
		shadowCamera.top = _max.y;
		shadowCamera.bottom = _min.y;
//DEBUG_show([shadowCamera.left,shadowCamera.right,shadowCamera.top,shadowCamera.bottom]+'\n'+shadowCamera.far)
		// can't really fit near/far
		//shadowCamera.near = _min.z;
		//shadowCamera.far = _max.z;

		shadowCamera.updateProjectionMatrix();

	}

	// MOD by katwat
	function getObjectMaterial( globject ) {
		var material;
		material = globject.object.material;
		if ( material instanceof THREE.MeshFaceMaterial ) {
			material = material.materials[ globject.buffer.materialIndex ];
		}
		return material;
	}

};


//THREE.ShadowMapPlugin.__projector = new THREE.Projector();
