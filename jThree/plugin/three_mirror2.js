/**
 * @author Slayvin / http://slayvin.net
 * @author Stemkoski / http://www.adelphi.edu/~stemkoski
 */

// customized by Butz Yung for System Animator (2020-09-23)

THREE.ShaderLib['mirror'] = {

	uniforms: { //"mirrorColor": { type: "c", value: new THREE.Color(0x7F7F7F) },
				"mirrorSampler": { type: "t", value: null },

// AT: mirror position
"mirrorPosition": { type:"v3", value:new THREE.Vector3(0,0,0) },
"reflection_state": { type:"i", value:0 },
"reflection_alpha": { type:"f", value:1 },
"fade_radius": { type:"f", value:15 },
"fade_min": { type:"f", value:1 },
"fade_max": { type:"f", value:1 },

"depth_render_mode": { type:"i", value:0 },

"baseTexture": 	{ type: "t", value: null },

"baseSpeed": 	{ type: "f", value: 0 },
"noiseTexture": { type: "t", value: null },
"noiseScale": 	{ type: "f", value: 0 },
"bumpScale":	{ type: "f", value: 5 },

"vUv_scale": { type:"v2", value:new THREE.Vector2(1,1) },

"time": { type: "f", value: 0 },

"nIntensity": { type:"f", value:0 },
"sIntensity": { type:"f", value:0.5 },
"sCount": { type:"f", value:512 },

				"textureMatrix" : { type: "m4", value: new THREE.Matrix4() }
	},

	vertexShader: [

		"uniform mat4 textureMatrix;",
		"varying vec4 mirrorCoord;",

// AT: vWorldPosition
"varying vec3 vWorldPosition;",
"varying vec2 vUv;",

"uniform sampler2D noiseTexture;",
"uniform float time;",
"uniform float baseSpeed;",
"uniform float bumpScale;",

		"void main() {",

"vUv = uv;",

			"vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
			"mirrorCoord = textureMatrix * worldPosition;",

"vec3 bumpedPosition = position;",

/*
'float dx = position.x;',
'float dy = position.y;',
'float freq = sqrt(dx*dx + dy*dy);',
'float amp = 0.5;',
'float angle = -time*10.0+freq*6.0;',
'bumpedPosition = bumpedPosition + normal * sin(angle)*amp;',
*/

"vec4 mvPosition;",
"if (baseSpeed > 0.0) {",
"  vec2 uvTimeShift = vUv + vec2( 1.1, 1.9 ) * time * 0.15;", // bumpSpeed;",
"  vec4 bumpData = texture2D( noiseTexture, uvTimeShift );",
			
"  float displacement = (bumpData.g - 0.25) * bumpScale;", // bumpScale
"  bumpedPosition = bumpedPosition + normal * displacement;",
"}",
"mvPosition = modelViewMatrix * vec4( bumpedPosition, 1.0 );",

// AT: vWorldPosition
'vWorldPosition = worldPosition.xyz;',

			"gl_Position = projectionMatrix * mvPosition;",

		"}"

	].join("\n"),

	fragmentShader: [

//		"uniform vec3 mirrorColor;",
		"uniform sampler2D mirrorSampler;",
		"varying vec4 mirrorCoord;",

// AT: vWorldPosition, mirrorPosition, etc
"varying vec3 vWorldPosition;",
"uniform vec3 mirrorPosition;",
"uniform int reflection_state;",
"uniform float reflection_alpha;",
"uniform float fade_radius;",
"uniform float fade_min;",
"uniform float fade_max;",
"uniform vec2 vUv_scale;",
"varying vec2 vUv;",

"uniform sampler2D baseTexture;", // 337

"uniform float baseSpeed;",
"uniform sampler2D noiseTexture;",
"uniform float noiseScale;",
"uniform float time;",

// noise effect intensity value (0 = no effect, 1 = full effect)
"uniform float nIntensity;",
// scanlines effect intensity value (0 = no effect, 1 = full effect)
"uniform float sIntensity;",
// scanlines effect count value (0 = no effect, 4096 = full effect)
"uniform float sCount;",

/*
		"float blendOverlay(float base, float blend) {",
			"return( base < 0.5 ? ( 2.0 * base * blend ) : (1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );",
		"}",
*/

"vec4 FilmShader(vec4 cTextureScreen, vec2 vUv) {",

/**
 * @author alteredq / http://alteredqualia.com/
 * http://www.airtightinteractive.com/demos/js/badtvshader/lib/shaders/FilmShader.js
 */

			// make some noise
			"float x = vUv.x * vUv.y * time *  1000.0;",
			"x = mod( x, 13.0 ) * mod( x, 123.0 );",
			"float dx = mod( x, 0.01 );",

			// add noise
			"vec3 cResult = cTextureScreen.rgb * clamp( 0.1 + dx * 100.0, 0.0, 1.0 );",//cTextureScreen.rgb;",

			// get us a sine and cosine
			"vec2 sc = vec2( sin( vUv.y * sCount ), cos( vUv.y * sCount ) );",

			// add scanlines
			"cResult += cTextureScreen.rgb * vec3( sc.x, sc.y, sc.x ) * sIntensity;",

			// interpolate between source and result by intensity
			"cResult = cTextureScreen.rgb + clamp( nIntensity, 0.0,1.0 ) * ( cResult - cTextureScreen.rgb );",

//"cResult = mix(vec3( cResult.r * 0.3 + cResult.g * 0.59 + cResult.b * 0.11 ), cTextureScreen.rgb, 0.5);",

			"return vec4( cResult, cTextureScreen.a );",
"}",

THREE.ShaderChunk[ "AT_depth_render_mode_pars_fragment" ],

		"void main() {",

THREE.ShaderChunk[ "AT_depth_render_mode_fragment" ],

//			"vec4 color = texture2DProj(mirrorSampler, mirrorCoord);",
//			"color = vec4(blendOverlay(mirrorColor.r, color.r), blendOverlay(mirrorColor.g, color.g), blendOverlay(mirrorColor.b, color.b), 1.0);",

// AT: fading and stuff
'vec4 color;',
'if (reflection_state == 0) {',
'  color = texture2DProj(mirrorSampler, mirrorCoord);',
'} else if (reflection_state == 1) {',
'  color = texture2D( mirrorSampler, vUv * vUv_scale + (1.0-vUv_scale)/2.0);',
'} else {',
'  color = vec4(0,0,0,0);',
'}',

'vec4 baseColor;',
"if (baseSpeed > 0.0) {",
"  vec2 uvTimeShift = vUv + vec2( -0.7, 1.5 ) * time * baseSpeed;",
"  vec4 noiseGeneratorTimeShift = texture2D( noiseTexture, uvTimeShift );",
"  vec2 uvNoiseTimeShift = vUv + noiseScale * vec2( noiseGeneratorTimeShift.r, noiseGeneratorTimeShift.b );",
"  baseColor = texture2D( baseTexture, uvNoiseTimeShift );",
//"  color = baseColor * 0.5 + color * 0.5;",
"}",
'else {',
'  baseColor = texture2D( baseTexture, vUv );',
'}',
'color = vec4(mix(color.rgb, baseColor.rgb, baseColor.a * (1.0 - color.a*reflection_alpha)), baseColor.a + ((1.0-baseColor.a) * color.a*reflection_alpha));',

'if (nIntensity > 0.0) {',
'  color = FilmShader(color, vUv);',
'}',

'if ((fade_max < 1.0) || (fade_min < 1.0)) {',
'  if (fade_max != fade_min) {',
'    float fade_distance = distance(vWorldPosition, mirrorPosition);',
'    float fade_ratio = pow(fade_distance/fade_radius, 2.0);',
'    color.a *= mix(fade_max, fade_min, fade_ratio);',
'  } else {',
'    color.a *= fade_max;',
'  }',
'}',

			"gl_FragColor = color;",

		"}"

	].join("\n")

};

THREE.FlatMirror = function ( renderer, camera, options ) {

	THREE.Object3D.call( this );
	this.name = 'flatMirror_' + this.id;

	function isPowerOfTwo ( value ) {
		return ( value & ( value - 1 ) ) === 0;
	};

	options = options || {};

	this.matrixNeedsUpdate = true;

	var width = options.textureWidth !== undefined ? options.textureWidth : 512;
	var height = options.textureHeight !== undefined ? options.textureHeight : 512;

	this.clipBias = options.clipBias !== undefined ? options.clipBias : 0.0;

//	var mirrorColor = options.color !== undefined ? new THREE.Color(options.color) : new THREE.Color(0x7F7F7F);

	this.renderer = renderer;
	this.mirrorPlane = new THREE.Plane();
	this.normal = new THREE.Vector3( 0, 0, 1 );
	this.mirrorWorldPosition = new THREE.Vector3();
	this.cameraWorldPosition = new THREE.Vector3();
	this.rotationMatrix = new THREE.Matrix4();
	this.lookAtPosition = new THREE.Vector3(0, 0, -1);
	this.clipPlane = new THREE.Vector4();
	
	// For debug only, show the normal and plane of the mirror
	var debugMode = options.debugMode !== undefined ? options.debugMode : false;
	if (debugMode){
		var arrow = new THREE.ArrowHelper(new THREE.Vector3( 0, 0, 1 ), new THREE.Vector3( 0, 0, 0 ), 10, 0xffff80 );
		var planeGeometry = new THREE.Geometry();
		planeGeometry.vertices.push( new THREE.Vector3( -10, -10, 0 ) );
		planeGeometry.vertices.push( new THREE.Vector3( 10, -10, 0 ) );
		planeGeometry.vertices.push( new THREE.Vector3( 10, 10, 0 ) );
		planeGeometry.vertices.push( new THREE.Vector3( -10, 10, 0 ) );
		planeGeometry.vertices.push( planeGeometry.vertices[0] );
		var plane = new THREE.Line( planeGeometry, new THREE.LineBasicMaterial( { color: 0xffff80 } ) );

		this.add(arrow);
		this.add(plane);
	}

	if ( camera instanceof THREE.PerspectiveCamera )
		this.camera = camera;
	else {
		this.camera = new THREE.PerspectiveCamera();
		console.log(this.name + ': camera is not a Perspective Camera!')
	}

	this.textureMatrix = new THREE.Matrix4();

	this.mirrorCamera = this.camera.clone();

// AT: not using stencil
var _para = { stencilBuffer: false }
	this.texture = new THREE.WebGLRenderTarget( width, height, _para );
	this.tempTexture = new THREE.WebGLRenderTarget( width, height, _para );

	var mirrorShader = THREE.ShaderLib[ "mirror" ];
	var mirrorUniforms = THREE.UniformsUtils.clone( mirrorShader.uniforms );

	this.material = new THREE.ShaderMaterial( { fragmentShader: mirrorShader.fragmentShader, vertexShader: mirrorShader.vertexShader, uniforms: mirrorUniforms } );
//console.log(this.material)
	this.material.uniforms.mirrorSampler.value = this.texture;
//	this.material.uniforms.mirrorColor.value = mirrorColor;
	this.material.uniforms.textureMatrix.value = this.textureMatrix;

// AT: AR camera, custom uniforms and stuff
if (self.MMD_SA) {
  this.mirrorCamera.matrixAutoUpdate = true
  this.mirror_index = options.mirror_index

  this.clip_y = options.clip_y

  var mirror_obj = MMD_SA.mirror_obj[this.mirror_index]
  var u = this.material.uniforms

// AT: Fix some visual glitches near the edge of the mirror plane when viewed at certain angles
  if (!mirror_obj.reflection_state)
    this.mirrorCamera.fov *= 1.75

  u.baseTexture.value = (/^\#/.test(mirror_obj.baseTexture)) ? jThree( mirror_obj.baseTexture ).three( 0 ) : THREE.ImageUtils.loadTexture(toFileProtocol(mirror_obj.baseTexture));

  u.reflection_state.value = mirror_obj.reflection_state || 0;
  if (mirror_obj.reflection_alpha != null)
    u.reflection_alpha.value = mirror_obj.reflection_alpha
  if (mirror_obj.fade_radius != null)
    u.fade_radius.value = mirror_obj.fade_radius
  if (mirror_obj.fade_min != null)
    u.fade_min.value = mirror_obj.fade_min
  if (mirror_obj.fade_max != null)
    u.fade_max.value = mirror_obj.fade_max

  this.time_ref = performance.now();
  u.time.value = mirror_obj.time || 0;

  if (mirror_obj.baseSpeed != null) {
    u.baseSpeed.value = mirror_obj.baseSpeed || 0.5;

    var noiseTexture = new THREE.ImageUtils.loadTexture(toFileProtocol(mirror_obj.noiseTexture));
    noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping; 
    u.noiseTexture.value = noiseTexture;
    u.noiseScale.value = mirror_obj.noiseScale || 0.5337;

    if (!mirror_obj.bumpScale)
      mirror_obj.bumpScale = 5
    u.bumpScale.value = mirror_obj.bumpScale;
  }

  if (mirror_obj.nIntensity != null) {
    u.nIntensity.value = mirror_obj.nIntensity
    if (mirror_obj.sIntensity != null)
      u.sIntensity.value = mirror_obj.sIntensity
    if (mirror_obj.sCount != null)
      u.sCount.value = mirror_obj.sCount
  }
}

// AT: WebGL2
// MMD_SA.use_webgl2 is still undefined at this stage. Wrap things inside init and run it on "WebGL_initialized" event.
function init(width, height) {
/*
	if (( !isPowerOfTwo(width) || !isPowerOfTwo(height) ) && (!self.MMD_SA || !MMD_SA.use_webgl2)) {
		this.texture.generateMipmaps = false;
		this.tempTexture.generateMipmaps = false;
	}
*/
// AT: WebGL2
if (self.MMD_SA && MMD_SA.use_webgl2 && !is_mobile) this.texture._use_multisample = 4;
// No mipmap for dynamic texture for better performance (?)
[this.texture, this.tempTexture].forEach(function (tex) {
  tex.generateMipmaps = false
  tex.minFilter = tex.magFilter
});

	this.updateTextureMatrix();
	this.render();

}

// AT: "WebGL_initialized" event
var _this = this;
if (self.MMD_SA && !MMD_SA.WebGL_initialized)
  window.addEventListener("WebGL_initialized", ()=>{init.call(_this, width,height)})
else
  init.call(_this, width,height)

};

THREE.FlatMirror.prototype = Object.create( THREE.Object3D.prototype );

THREE.FlatMirror.prototype.renderWithMirror = function (otherMirror) {

	// update the mirror matrix to mirror the current view
	this.updateTextureMatrix();
	this.matrixNeedsUpdate = false;

	// set the camera of the other mirror so the mirrored view is the reference view
	var tempCamera = otherMirror.camera;
	otherMirror.camera = this.mirrorCamera;

	// render the other mirror in temp texture
	otherMirror.renderTemp();
	otherMirror.material.uniforms.mirrorSampler.value = otherMirror.tempTexture;

	// render the current mirror
	this.render();
	this.matrixNeedsUpdate = true;

	// restore material and camera of other mirror
	otherMirror.material.uniforms.mirrorSampler.value = otherMirror.texture;
	otherMirror.camera = tempCamera;

	// restore texture matrix of other mirror
	otherMirror.updateTextureMatrix();
};

// AT: temp vars and stuff
THREE.FlatMirror.prototype.updateTextureMatrix = (function () {
  var q = new THREE.Vector4();
  var c;// = new THREE.Vector4();
  var mirror_pos = new THREE.Vector3();

  return function () {

	function sign(x) { return x ? x < 0 ? -1 : 1 : 0; }

	this.updateMatrixWorld();
	this.camera.updateMatrixWorld();

	this.mirrorWorldPosition.getPositionFromMatrix( this.matrixWorld );
	this.cameraWorldPosition.getPositionFromMatrix( this.camera.matrixWorld );

	this.rotationMatrix.extractRotation( this.matrixWorld );

	this.normal.set( 0, 0, 1 );
	this.normal.applyMatrix4( this.rotationMatrix );

// AT: handle custom camera
// NOTE: this != jThree(this._mesh_id).three(0)
var _mesh = self.MMD_SA && jThree(this._mesh_id).three(0);
if (!_mesh || (_mesh.material.uniforms.reflection_state.value != 1)) {
	var view = this.mirrorWorldPosition.clone().sub( this.cameraWorldPosition );
	var reflectView = view.reflect( this.normal );
	reflectView.add( this.mirrorWorldPosition );

	this.rotationMatrix.extractRotation( this.camera.matrixWorld );

	this.lookAtPosition.set(0, 0, -1);
	this.lookAtPosition.applyMatrix4( this.rotationMatrix );
	this.lookAtPosition.add( this.cameraWorldPosition );

	var target = this.mirrorWorldPosition.clone().sub( this.lookAtPosition );
	var reflectTarget = target.reflect( this.normal );
	reflectTarget.add( this.mirrorWorldPosition );

	this.up.set(0, -1, 0);
	this.up.applyMatrix4( this.rotationMatrix );
	var reflectUp = this.up.reflect( this.normal );

	this.mirrorCamera.position.copy(reflectView);
	this.mirrorCamera.up = reflectUp;
	this.mirrorCamera.lookAt(reflectTarget);
}

	this.mirrorCamera.updateProjectionMatrix();
	this.mirrorCamera.updateMatrixWorld();
	this.mirrorCamera.matrixWorldInverse.getInverse(this.mirrorCamera.matrixWorld);

	// Update the texture matrix
	this.textureMatrix.set( 0.5, 0.0, 0.0, 0.5,
							0.0, 0.5, 0.0, 0.5,
							0.0, 0.0, 0.5, 0.5,
							0.0, 0.0, 0.0, 1.0 );
	this.textureMatrix.multiply(this.mirrorCamera.projectionMatrix);
	this.textureMatrix.multiply(this.mirrorCamera.matrixWorldInverse);

//MMD_SA._debug_msg.push([this.cameraWorldPosition.toArray(), reflectView.toArray()].join("\n"))
//MMD_SA._debug_msg.push(this.textureMatrix.flattenToArray([]).join("\n"))

// AT: update cloned mirror material(s)
if (_mesh) {
  var mirror_obj = MMD_SA.mirror_obj[this.mirror_index]
  if (mirror_obj.renderDepth != null) {
    _mesh.renderDepth = mirror_obj.renderDepth
    mirror_obj.renderDepth = null
  }
  var uniforms = _mesh.material.uniforms
  uniforms.textureMatrix.value = this.textureMatrix
  uniforms.mirrorPosition.value = this.mirrorWorldPosition
  if (!this._baseTexture_loaded) {
    var _tex = uniforms.baseTexture.value
// image.complete can be true even when .src hasn't been defined
    if (_tex && _tex.image && ((_tex.image.complete && _tex.image.src) || _tex.image._canvas_ready)) {
      if (_tex.image._canvas_ready) {
        _tex.needsUpdate = jThree( mirror_obj.baseTexture ).three( 0 ).needsUpdate
      }
      else {
        this._baseTexture_loaded = true
        _tex.needsUpdate = true
      }
    }
  }
  if (!this._noiseTexture_loaded) {
    var _tex = uniforms.noiseTexture.value
    if (_tex && _tex.image && (_tex.image.complete && _tex.image.src)) {
       this._noiseTexture_loaded = true
      _tex.needsUpdate = true
    }
  }

  if (!mirror_obj.vUv_scale) {
    if (mirror_obj.plane) {
      var dim = Math.max(mirror_obj.plane[0], mirror_obj.plane[1])
      mirror_obj.vUv_scale = new THREE.Vector2(mirror_obj.plane[0]/dim, mirror_obj.plane[1]/dim)
    }
    else {
      mirror_obj.vUv_scale = new THREE.Vector2(1, 1)
    }
  }
  uniforms.vUv_scale.value = mirror_obj.vUv_scale

  var now = performance.now()
  uniforms.time.value += (now - this.time_ref) / 1000
  this.time_ref = now
}

// AT: normal reflection only
if (!_mesh || (_mesh.material.uniforms.reflection_state.value == 1)) return


	// Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
	// Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
// AT: .clip_y
mirror_pos.copy(this.mirrorWorldPosition);
if (this.clip_y != null) {
  mirror_pos.y = this.clip_y
//DEBUG_show(mirror_pos.y+'/'+Date.now())
}
	this.mirrorPlane.setFromNormalAndCoplanarPoint( this.normal, mirror_pos);//this.mirrorWorldPosition );
	this.mirrorPlane.applyMatrix4(this.mirrorCamera.matrixWorldInverse);

	this.clipPlane.set(this.mirrorPlane.normal.x, this.mirrorPlane.normal.y, this.mirrorPlane.normal.z, this.mirrorPlane.constant );

//	var q = new THREE.Vector4();
	var projectionMatrix = this.mirrorCamera.projectionMatrix;

	q.x = (sign(this.clipPlane.x) + projectionMatrix.elements[8]) / projectionMatrix.elements[0];
	q.y = (sign(this.clipPlane.y) + projectionMatrix.elements[9]) / projectionMatrix.elements[5];
	q.z = -1.0;
	q.w = (1.0 + projectionMatrix.elements[10]) / projectionMatrix.elements[14];

	// Calculate the scaled plane vector
//	var c = new THREE.Vector4();
	c = this.clipPlane.multiplyScalar( 2.0 / this.clipPlane.dot(q) );

	// Replacing the third row of the projection matrix
	projectionMatrix.elements[2] = c.x;
	projectionMatrix.elements[6] = c.y;
	projectionMatrix.elements[10] = c.z + 1.0 - this.clipBias;
	projectionMatrix.elements[14] = c.w;

  };
})();

// AT: custom (texture_target || this.texture)
THREE.FlatMirror.prototype.render = function (texture_target) {
// AT: skip if not visible
var mesh = self.MMD_SA && jThree(this._mesh_id).three(0);
if (mesh && !mesh.visible) return;

	if (this.matrixNeedsUpdate)
		this.updateTextureMatrix();

	this.matrixNeedsUpdate = true;

	// Render the mirrored view of the current scene into the target texture
	var scene = this;
	while ( scene.parent !== undefined ) {
		scene = scene.parent;
	}

// AT: handle mirror inside mirror
if (!mesh || !mesh.visible) return;

var reflection_state, _reflection_state
var mirror_obj, skip_reflection_list, _visible = {}
//DEBUG_show(Date.now())
reflection_state = mesh.material.uniforms.reflection_state
_reflection_state = reflection_state.value
reflection_state.value = -1

if (self.MMD_SA) {
  mirror_obj = MMD_SA.mirror_obj[this.mirror_index]
  skip_reflection_list = mirror_obj.skip_reflection_list
  if (!skip_reflection_list)
    skip_reflection_list = [this._mesh_id]
  skip_reflection_list.forEach(function (id) {
var obj = (/^\#(.+)$/.test(id)) ? MMD_SA_options.mesh_obj_by_id[RegExp.$1] : MMD_SA_options.x_object_by_name[id]
if (obj && obj.visible) {
  _visible[id] = true
  obj.hide()
}
  });
}
// not working (trying to fix some WebGL warnings)
// https://github.com/jbouny/ocean/issues/7
/*
var _mirrorSampler=this.material.uniforms.mirrorSampler.value
if (!MMD_SA._mirrorSampler_dummy) MMD_SA._mirrorSampler_dummy=new THREE.WebGLRenderTarget(1, 1)
this.material.uniforms.mirrorSampler.value=MMD_SA._mirrorSampler_dummy;
*/

	if ( scene !== undefined && scene instanceof THREE.Scene)
		this.renderer.render(scene, this.mirrorCamera, (texture_target || this.texture), true);

//this.material.uniforms.mirrorSampler.value=_mirrorSampler
reflection_state.value = _reflection_state
if (self.MMD_SA) {
  for (var id in _visible) {
    var obj = (/^\#(.+)$/.test(id)) ? MMD_SA_options.mesh_obj_by_id[RegExp.$1] : MMD_SA_options.x_object_by_name[id]
    if (obj)
      obj.show()
  }
}

};

THREE.FlatMirror.prototype.renderTemp = function () {
// AT: simplified version
this.render(this.tempTexture)
/*
	if (this.matrixNeedsUpdate)
		this.updateTextureMatrix();

	this.matrixNeedsUpdate = true;

	// Render the mirrored view of the current scene into the target texture
	var scene = this;
	while ( scene.parent !== undefined ) {
		scene = scene.parent;
	}

	if ( scene !== undefined && scene instanceof THREE.Scene)
		this.renderer.render(scene, this.mirrorCamera, this.tempTexture, true);
*/
};

// AT: for GOML/misc

THREE.MirrorMaterial = function ( param ) {
// renderer, camera, options
  var camera = jThree(param.camera).three(0)

  var mirror = new THREE.FlatMirror(null, camera, param)
  MMD_SA._THREE_mirror.push(mirror)
  mirror.material._mirror = mirror

  mirror._mesh_id = param.mesh
  mirror._renderer_id = param.renderer

  return mirror.material
};

// updates/changes necessary to work with the latest versions of THREE.js
THREE.Math.isPowerOfTwo = function ( value ) {
	return ( value & ( value - 1 ) ) === 0;
};

THREE.Vector3.prototype.setFromMatrixPosition = THREE.Vector3.prototype.getPositionFromMatrix;

// https://github.com/mrdoob/three.js/blob/master/src/cameras/PerspectiveCamera.js (r71)
THREE.PerspectiveCamera.prototype.clone = function () {

	var camera = new THREE.PerspectiveCamera();

	THREE.Camera.prototype.clone.call( this, camera );

	camera.zoom = this.zoom;

	camera.fov = this.fov;
	camera.aspect = this.aspect;
	camera.near = this.near;
	camera.far = this.far;

	camera.projectionMatrix.copy( this.projectionMatrix );

	return camera;

};

/*
THREE.PerspectiveCamera.prototype.clone = function ( object ) {

	if ( object === undefined ) object = new THREE.PerspectiveCamera();
object.updateProjectionMatrix = this.updateProjectionMatrix;

	THREE.Object3D.prototype.clone.call( this, object );

	return object;

};
*/