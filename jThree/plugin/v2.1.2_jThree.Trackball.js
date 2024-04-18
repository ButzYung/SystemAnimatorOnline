/*!
 * jThree.Trackball.js JavaScript Library v1.5
 * http://www.jthree.com/
 *
 * Requires jThree v2.0.0
 * Includes TrackballControls.js | Copyright (c) 2010-2013 three.js authors
 *
 * The MIT License
 *
 * Copyright (c) 2014 Matsuda Mitsuhide
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Date: 2015-02-25
 */
// AT: customizations
// (2024-04-18)

THREE.TrackballControls = function ( object, domElement ) {

	var _this = this,
		STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM: 4, TOUCH_PAN: 5 };

	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// API
// AT: getter/setter for .enabled
	this._enabled = true;

	this.screen = { left: 0, top: 0, width: 0, height: 0 };

	this.rotateSpeed = 1.0;
	this.zoomSpeed = 1.2;
	this.panSpeed = 0.3;

	this.noRotate = 
	this.noZoom = 
	this.noPan = 
	this.noRoll = false;

	this.damping = 0.2;

	this.minDistance = 0;
	this.maxDistance = Infinity;

	// internals

	this.target = object._lookAt;

	this.lastPosition = new THREE.Vector3;
	this._eye = new THREE.Vector3;

	var _state = STATE.NONE,
		_prevState = STATE.NONE,

		_rotateStart = new THREE.Vector3,
		_rotateEnd = new THREE.Vector3,

		_zoomStart = new THREE.Vector2,
		_zoomEnd = new THREE.Vector2,

		_touchZoomDistanceStart = 0,
		_touchZoomDistanceEnd = 0,

		_panStart = new THREE.Vector2,
		_panEnd = new THREE.Vector2;

	// for reset

	this.target0 = this.target.clone();
	this.position0 = this.object.position.clone();
	this.up0 = this.object.up.clone();

	// add by jThree
	this._fixed = false;

	// for #getMouseProjectionOnBall

	this.objectUp = new THREE.Vector3;

	// methods

// AT: camera rotation with up fixed
var _rotateStart_fixed_up = new THREE.Vector2();
var _rotateEnd_fixed_up   = new THREE.Vector2();
var _rotateAll_fixed_up   = new THREE.Vector2();

// save some headaches, and turn this on only in TPS mode
this.rotate_with_up_fixed = false//true
this.getMouseOnScreen_fixed_up = function (pageX, pageY, v2) {
  return this.getMouseOnScreen( pageX, pageY, (v2||new THREE.Vector2()) );
}

	this.rotateCamera = (function(){

		var axis = new THREE.Vector3,
			quaternion = new THREE.Quaternion;

// AT: _eye, temp and stuff
var _eye  = new THREE.Vector3()
var _eye2 = new THREE.Vector3()
var _eye3 = new THREE.Vector3()
var _v3  = new THREE.Vector3()
var _q = new THREE.Quaternion()

var max, min
function camera_limit0() {
  max = min = null
  if (!self.MMD_SA || !MMD_SA_options.trackball_camera_limit)
    return false

  var limit = MMD_SA_options.trackball_camera_limit
  max = limit.max
  min = limit.min
  _eye.copy(this._eye).applyQuaternion( quaternion )
//DEBUG_show(this._eye.toArray()+'\n'+_this.object.up.toArray())
  var result = limit.adjust && limit.adjust(_eye)
  if (result) {
//DEBUG_show(Date.now())
    return result
  }
  if (max) {
    if ((_eye.x > max.x) || (_eye.y > max.y) || (_eye.z > max.z)) {
      return true
    }
  }
  if (min) {
    if ((_eye.x < min.x) || (_eye.z < min.z))
      return true
  }

  return false
}
function camera_limit1() {
  if (!min || !(this._eye.y < min.y))
    return false

// to keep the camera length, find the scale factor for x and z, while y is fixed at min.y
  let cam_len_sq = this._eye.lengthSq()
  let x_sq = this._eye.x * this._eye.x
  let z_sq = this._eye.z * this._eye.z
  let scale_adjust = (cam_len_sq - min.y*min.y) / (x_sq + z_sq)

// new camera position
  _eye2.x = ((this._eye.x<0)?-1:1) * Math.sqrt(x_sq * scale_adjust)
  _eye2.z = ((this._eye.z<0)?-1:1) * Math.sqrt(z_sq * scale_adjust)
  _eye2.y = min.y

  return true
}

		return function () {

if (this.rotate_with_up_fixed) {
  if (_rotateStart_fixed_up.distanceToSquared(_rotateEnd_fixed_up) > this.EPS) {//(true) {//

    _eye.subVectors( this.position0, this.target );
    _eye3.set(0, _eye.y, -Math.sqrt(_eye.x*_eye.x + _eye.z*_eye.z));
    let tilt = Math.atan2(_eye3.y, -_eye3.z);
    let clamp_upper =  1.9 - tilt/(Math.PI/4);
    let clamp_lower = -1.9 - tilt/(Math.PI/4);

//_rotateAll_fixed_up
    _v3.copy(_rotateAll_fixed_up).add(_rotateEnd_fixed_up).sub(_rotateStart_fixed_up);
    _v3.y = THREE.Math.clamp( _v3.y, clamp_lower, clamp_upper );
    quaternion.setFromEuler(MMD_SA.TEMP_v3.set(_v3.y*45/180*Math.PI, -_v3.x*180/180*Math.PI, 0), "YXZ");

/*
//no _rotateAll_fixed_up
    _v3.copy(_rotateEnd_fixed_up).sub(_rotateStart_fixed_up);
    quaternion.setFromEuler(MMD_SA.TEMP_v3.set(_v3.y*45/180*Math.PI, -_v3.x*180/180*Math.PI, 0), "YXZ");
*/
    _eye2.copy(this._eye);

    let _angle = _eye3.angleTo(_eye);//this._eye);
    _q.setFromAxisAngle( axis.set(0,1,0), _angle );
    quaternion.multiplyQuaternions(_q, quaternion);
    this._eye.copy(_eye3);

//DEBUG_show(Date.now())
    let result0 = camera_limit0.call(this)
    if (result0) {
      this._eye.copy(_eye2)
      _rotateStart_fixed_up.copy(_rotateEnd_fixed_up)
      return
    }

    this._eye.applyQuaternion( quaternion );

    if (camera_limit1.call(this)) {
      this._eye.copy(_eye2)
      _rotateStart_fixed_up.y = _rotateEnd_fixed_up.y;
    }

//_rotateAll_fixed_up
    _rotateAll_fixed_up.add(_rotateEnd_fixed_up).sub(_rotateStart_fixed_up);
    _rotateAll_fixed_up.y = THREE.Math.clamp( _rotateAll_fixed_up.y, clamp_lower, clamp_upper );

    _rotateStart_fixed_up.add(_v3.copy(_rotateEnd_fixed_up).sub(_rotateStart_fixed_up).multiplyScalar(this.damping))
  }
  return
}

//if (self.MMD_SA && MMD_SA_options.Dungeon && MMD_SA_options.Dungeon.character.TPS_mode) _rotateStart.y = _rotateEnd.y = 0;

// AT: use .angleTo
			var angle = _rotateStart.angleTo(_rotateEnd);//Math.acos( _rotateStart.dot( _rotateEnd ) / _rotateStart.length() / _rotateEnd.length() );

			if ( angle ) {

				axis.crossVectors( _rotateStart, _rotateEnd ).normalize();
//DEBUG_show(axis.toArray().join("\n"))
				angle *= _this.rotateSpeed;

				quaternion.setFromAxisAngle( axis, -angle );
//quaternion.setFromEuler(new THREE.Vector3().setEulerFromQuaternion(quaternion).setZ(0))
// AT: camera limit
if (camera_limit0.call(this)) {
  _rotateStart.copy(_rotateEnd)
  return
}

				this._eye.applyQuaternion( quaternion );
				!_this._fixed && _this.object.up.applyQuaternion( quaternion );
//DEBUG_show(this._eye.toArray()+'\n'+_this.object.up.toArray())
				_rotateEnd.applyQuaternion( quaternion );

				quaternion.setFromAxisAngle( axis, angle * ( _this.damping - 1.0 ) );
//quaternion.setFromEuler(new THREE.Vector3().setEulerFromQuaternion(quaternion).setZ(0))
				_rotateStart.applyQuaternion( quaternion );
//var a = MMD_SA.TEMP_v3.setEulerFromQuaternion(quaternion).multiplyScalar(180/Math.PI)
//DEBUG_show(a.toArray())

// AT: camera limit
if (camera_limit1.call(this)) {
// angle to the new position
  let _axis = _v3.crossVectors(_eye, _eye2).normalize()
  let _a = _eye.angleTo(_eye2)
  _q.setFromAxisAngle( _axis, _a )

  this._eye.applyQuaternion(_q);

  !_this._fixed && _this.object.up.applyQuaternion(_q);
  _rotateEnd.applyQuaternion(_q);
  _rotateStart.applyQuaternion(_q);
}

			}
		};

	}());

// AT: camera limit
var AT_camera_zoom_limit = (function () {
  var _eye = new THREE.Vector3();
  return function (eye, factor) {
if (!self.MMD_SA || !MMD_SA_options.trackball_camera_limit) {
  eye.multiplyScalar( factor )
  return
}

var limit = MMD_SA_options.trackball_camera_limit
var max = limit.max
var min = limit.min

var length = _eye.copy(eye).multiplyScalar( factor ).length();

if ((max && (length > max.length)) || (min && (length < min.length)))
  return

if (limit.adjust && limit.adjust(eye))
  return

eye.multiplyScalar( factor )

if (max) {
  if (eye.x > max.x)
    eye.x = max.x
  if (eye.y > max.y)
    eye.y = max.y
  if (eye.z > max.z)
    eye.z = max.z
}
if (min) {
  if (eye.x < min.x)
    eye.x = min.x
  if (eye.y < min.y)
    eye.y = min.y
  if (eye.z < min.z)
    eye.z = min.z
}
//DEBUG_show(eye.toArray()+'\n'+eye.length())
  };
})();

	this.zoomCamera = function () {

		if ( _state === STATE.TOUCH_ZOOM ) {

			var factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
			_touchZoomDistanceStart = _touchZoomDistanceEnd;
// AT: camera limit
AT_camera_zoom_limit(this._eye, factor)
//			this._eye.multiplyScalar( factor );

		} else {

			var factor = 1.0 + ( _zoomEnd.y - _zoomStart.y ) * this.zoomSpeed;

			if ( factor !== 1.0 && factor > 0.0 ) {
// AT: camera limit
AT_camera_zoom_limit(this._eye, factor)
//				this._eye.multiplyScalar( factor );

				_zoomStart.y += ( _zoomEnd.y - _zoomStart.y ) * this.damping;

			}

		}

	};

	this.panCamera = (function(){

		var mouseChange = new THREE.Vector2,
			objectUp = new THREE.Vector3,
			pan = new THREE.Vector3;

		return function () {

			mouseChange.copy( _panEnd ).sub( _panStart );

			if ( mouseChange.lengthSq() ) {

				mouseChange.multiplyScalar( this._eye.length() * _this.panSpeed );

				pan.copy( this._eye ).cross( _this.object.up ).setLength( mouseChange.x );
				pan.add( objectUp.copy( _this.object.up ).setLength( mouseChange.y ) );

				_this.object.position.add( pan );
				_this.target.add( pan );

				_panStart.add( mouseChange.subVectors( _panEnd, _panStart ).multiplyScalar( _this.damping ) );

			}
		};

	}());

// AT: rot_delta_accumulated, zoom_scale
var rot_delta_accumulated = new THREE.Vector3()
var zoom_scale = 1

	this.reset = function () {

// AT: reset wallpaper mode mousedown state, and others
if (self.MMD_SA)
  System._browser._wallpaper_mousedown = false
rot_delta_accumulated.set(0,0,0)
zoom_scale = 1
_rotateStart_fixed_up = new THREE.Vector2()
_rotateEnd_fixed_up   = new THREE.Vector2()
_rotateAll_fixed_up   = new THREE.Vector2()
_rotateStart = new THREE.Vector3()
_rotateEnd   = new THREE.Vector3()

		_state = _prevState = STATE.NONE;

		this.object.position.copy( this.position0 );
		this.object.up.copy( this.up0 );
		this.object.lookAt( this.target0 );

		this._eye.subVectors( this.object.position, this.target );

		this.lastPosition.copy( this.object.position );

		return this;

	};

// AT: SA_adjust
if (self.MMD_SA) {

  this.SA_adjust = (function () {
var pos0 = new THREE.Vector3()
var pos_v3 = new THREE.Vector3()
var pos_v3a = new THREE.Vector3()
var _q = new THREE.Quaternion()

var para = {
  filter: function (obj) {
    return obj.no_camera_collision
  }
};

return function (_pos_delta, rot_delta) {
  pos0.copy(this.object.position)

  var pos_delta, pos_delta_target
  if (_pos_delta) {
    if (_pos_delta instanceof Array) {
      pos_delta = _pos_delta[0]
      pos_delta_target = _pos_delta[1]
    }
    else
      pos_delta = pos_delta_target = _pos_delta
    this.object.position.sub(this.target).multiplyScalar(1/zoom_scale).add(this.target).add(pos_delta)
    this.target.add(pos_delta_target)
/*
var center_view_lookAt = MMD_SA.center_view_lookAt
var model_pos = THREE.MMD.getModels()[0].mesh.position
this.target.set(model_pos.x+center_view_lookAt[0], model_pos.y+10+center_view_lookAt[1], model_pos.z+center_view_lookAt[2])
*/
    zoom_scale = 1
  }

  if (rot_delta) {
/*
    if (MMD_SA_options.Dungeon && (MMD_SA_options.Dungeon.key_map_by_id["camera_preset_switch"].camera_position_preset_index==1))
      rot_delta = null
    else
*/
      rot_delta_accumulated.add(rot_delta)
  }

  var zoom_factor = 10
  var zoom_min = 2
  var zoom_lvl = 1
  var zoom_lvl_max = 2
  var zoom_ini = 0

// zoom_scale is finalized on zoom_lvl==1, if camera is not blocked (i.e. s==10) or blocked beyond zoom_min (in this case, rot_delta_accumulated is not reset).
// in all other cases, zoom_scale is finalized on the last zoom_lvl (==zoom_lvl_max)
  var q_delta_accumulated
  if (rot_delta_accumulated.x || rot_delta_accumulated.y || rot_delta_accumulated.z)
    q_delta_accumulated = _q.setFromEuler(rot_delta_accumulated)
  for (var s = 10; s >= zoom_min; s--) {
    pos_v3a.copy(pos_v3.copy(this.object.position).sub(this.target).multiplyScalar(1/zoom_scale * (zoom_ini + s/zoom_factor)))
    if (q_delta_accumulated)
      pos_v3.applyQuaternion(q_delta_accumulated)

    var result = { return_value:null }
    window.dispatchEvent(new CustomEvent("SA_camera_adjust", { detail:{ rot_delta:rot_delta_accumulated, pos_v3:pos_v3, result:result } }));
    if (!result.return_value) {
      if ((zoom_lvl < zoom_lvl_max) && (s < 10) && ((zoom_lvl > 1) || (s > zoom_min))) {
        zoom_lvl++
        zoom_ini += s/zoom_factor
        zoom_factor = Math.pow(10, zoom_lvl)
        s = 10
        zoom_min = 0
        continue
      }
      if ((zoom_lvl == zoom_lvl_max) || ((zoom_lvl == 1) && ((s == 10) || (s == zoom_min))))
        rot_delta_accumulated.set(0,0,0)
      this.object.position.copy(pos_v3).add(this.target)
      zoom_scale = zoom_ini + s/zoom_factor
      break
    }
    if ((zoom_lvl == 1) && (s == zoom_min)) {
      this.object.position.copy(pos_v3a).add(this.target)
      zoom_scale = zoom_ini + s/zoom_factor
    }
  }
//DEBUG_show(zoom_scale+'/'+Date.now())
//MMD_SA_options.Dungeon.check_camera_ray_intersection
  var d = MMD_SA_options.Dungeon
  if (d && (zoom_scale > 2/10)) {
    var intersected = !d.no_camera_collision && d.check_ray_intersection(this.target, pos_v3.copy(this.object.position).sub(this.target), para)
    if (intersected) {
      var len = pos_v3.length() / zoom_scale
      var _zoom_scale = Math.max(intersected.nearest.distance/len, 2/10)
      this.object.position.sub(this.target).multiplyScalar(1/zoom_scale * _zoom_scale).add(this.target)
      zoom_scale = _zoom_scale
    }
  }

//DEBUG_show(this._eye.toArray()+'\n'+this.object.up.toArray()+'\n'+_v3.add(pos_delta).toArray())
//				this._eye.applyQuaternion( quaternion );
//				!_this._fixed && _this.object.up.applyQuaternion( quaternion );

// reset it for proper "look_at_mouse" (skip for movement "noise")
  if (pos_delta_target && (pos_delta_target.lengthSq() > 0.01*0.01))
    MMD_SA._mouse_pos_3D = []
  this.object.updateMatrixWorld()
// adjust .position0 as required by "look_at_mouse" as well
  this.position0.add(this.object.position).sub(pos0)
};
  })();
}

	// listeners

	function mousedown( event ) {

		if ( ! _this.enabled ) return;

		event.preventDefault();
		event.stopPropagation();

		if ( _state === STATE.NONE ) {
// AT: pan
			_state = (event.ctrlKey) ? STATE.PAN : event.button;

		}

		if ( _state === STATE.ROTATE && !_this.noRotate ) {

			_rotateStart = _this.getMouseProjectionOnBall( event.pageX, event.pageY, _rotateStart );
			_rotateEnd.copy(_rotateStart);

// AT: camera rotation with up fixed
_this.rotate_with_up_fixed && _rotateEnd_fixed_up.copy(_this.getMouseOnScreen_fixed_up(event.pageX, event.pageY, _rotateStart_fixed_up));

		} else if ( _state === STATE.ZOOM && !_this.noZoom ) {

			_zoomStart = _this.getMouseOnScreen( event.pageX, event.pageY, _zoomStart );
			_zoomEnd.copy(_zoomStart);

		} else if ( _state === STATE.PAN && !_this.noPan ) {

			_panStart = _this.getMouseOnScreen( event.pageX, event.pageY, _panStart);
			_panEnd.copy(_panStart);

		}

		document.addEventListener( "mousemove", mousemove, false );
		document.addEventListener( "mouseup", mouseup, false );

	}

	function mousemove( event ) {

		if ( ! _this.enabled ) return;

		event.preventDefault();
		event.stopPropagation();

		if ( _state === STATE.ROTATE && !_this.noRotate ) {

			_rotateEnd = _this.getMouseProjectionOnBall( event.pageX, event.pageY, _rotateEnd );

// AT: camera rotation with up fixed
_this.rotate_with_up_fixed && _this.getMouseOnScreen_fixed_up(event.pageX, event.pageY, _rotateEnd_fixed_up);

		} else if ( _state === STATE.ZOOM && !_this.noZoom ) {

			_zoomEnd = _this.getMouseOnScreen( event.pageX, event.pageY, _zoomEnd );

		} else if ( _state === STATE.PAN && !_this.noPan ) {

			_panEnd = _this.getMouseOnScreen( event.pageX, event.pageY, _panEnd );

		}

	}

	function mouseup( event ) {

		if ( ! _this.enabled ) return;

		event.preventDefault();
		event.stopPropagation();

		_state = STATE.NONE;

		document.removeEventListener( "mousemove", mousemove );
		document.removeEventListener( "mouseup", mouseup );

	}

	function mousewheel( event ) {

		if ( ! _this.enabled ) return;

		event.preventDefault();
		event.stopPropagation();

		var delta = 0;

// AT: DOM standard
if ( event.deltaY) {
  delta = event.deltaY / ((event.deltaMode == 0) ? 40 : 1);
}
else
		if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

			delta = event.wheelDelta / 40;

		} else if ( event.detail ) { // Firefox

			delta = - event.detail / 3;

		}

		_zoomStart.y += delta * 0.01;

	}

	function touchstart( event ) {

		if ( _this.enabled === false ) return;

// AT: ignore joystick touch
var touches = [];
for (var i = 0; i < event.touches.length; i++) {
  if (event.touches[i].target.id != "Ljoystick") touches.push(event.touches[i]);
}
if (touches.length != event.touches.length) event = { touches:touches };

		switch ( event.touches.length ) {

			case 1:
				_state = STATE.TOUCH_ROTATE;
				_rotateEnd.copy( _this.getMouseProjectionOnBall( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, _rotateStart ));

// AT: camera rotation with up fixed
_this.rotate_with_up_fixed && _rotateEnd_fixed_up.copy(_this.getMouseOnScreen_fixed_up(event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, _rotateStart_fixed_up));

				break;

			case 2:
				_state = STATE.TOUCH_ZOOM;
				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				_touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt( dx * dx + dy * dy );
				break;

			case 3:
				_state = STATE.TOUCH_PAN;
				_panEnd.copy( _this.getMouseOnScreen( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, _panStart ));
				break;

			default:
				_state = STATE.NONE;

		}

	}

	function touchmove( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();
//var msgs=[Date.now()]; for (var i=0; i<event.touches.length; i++) msgs.push(event.touches[i].target.id); DEBUG_show(msgs.join("\n"));

// AT: ignore joystick touch
var touches = [];
for (var i = 0; i < event.touches.length; i++) {
  if (event.touches[i].target.id != "Ljoystick") touches.push(event.touches[i]);
}
if (touches.length != event.touches.length) event = { touches:touches };

		switch ( event.touches.length ) {

			case 1:
				_rotateEnd = _this.getMouseProjectionOnBall( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, _rotateEnd );

// AT: camera rotation with up fixed
_this.rotate_with_up_fixed && _this.getMouseOnScreen_fixed_up(event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, _rotateEnd_fixed_up);

				break;

			case 2:
				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				_touchZoomDistanceEnd = Math.sqrt( dx * dx + dy * dy )
				break;

			case 3:
				_panEnd = _this.getMouseOnScreen( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, _panEnd );
				break;

			default:
				_state = STATE.NONE;

		}

	}

	function touchend( event ) {

		if ( _this.enabled === false ) return;

// AT: ignore joystick touch
var touches = [];
for (var i = 0; i < event.touches.length; i++) {
  if (event.touches[i].target.id != "Ljoystick") touches.push(event.touches[i]);
}
if (touches.length != event.touches.length) event = { touches:touches };

		switch ( event.touches.length ) {

			case 1:
				_rotateStart.copy( _this.getMouseProjectionOnBall( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, _rotateEnd ));

// AT: camera rotation with up fixed
_this.rotate_with_up_fixed && _rotateStart_fixed_up.copy(_this.getMouseOnScreen_fixed_up(event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, _rotateStart_fixed_up));

				break;

			case 2:
				_touchZoomDistanceStart = _touchZoomDistanceEnd = 0;
				break;

			case 3:
				_panStart.copy( _this.getMouseOnScreen( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, _panEnd ));
				break;

		}

		_state = STATE.NONE;

	}


// AT: mouse events
if (self.Animate_RAF) {
	Lbody_host.addEventListener( 'mousedown', function (e) { if (e.button !== 0) return; mousedown(e); }, false );
	Lbody_host.addEventListener( 'wheel', mousewheel, false );
//	Lbody_host.addEventListener( 'mousewheel', mousewheel, false );
//	Lbody_host.addEventListener( 'DOMMouseScroll', mousewheel, false ); // firefox

	Lbody_host.addEventListener( 'touchstart', touchstart, false );
	Lbody_host.addEventListener( 'touchend', touchend, false );
	Lbody_host.addEventListener( 'touchmove', touchmove, false );

  window.addEventListener("resize", function () { _this.resize(); });
}
else {
	this.domElement.addEventListener( "contextmenu", function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( "mousedown", mousedown, false );

	this.domElement.addEventListener( "mousewheel", mousewheel, false );
	this.domElement.addEventListener( "DOMMouseScroll", mousewheel, false ); // firefox

	this.domElement.addEventListener( 'touchstart', touchstart, false );
	this.domElement.addEventListener( 'touchend', touchend, false );
	this.domElement.addEventListener( 'touchmove', touchmove, false );
}

	this.resize();

};

THREE.TrackballControls.prototype = {

	constructor: THREE.TrackballControls,

// AT: getter/setter for .enabled
    get enabled() {
return this._enabled && MMD_SA.THREEX.camera.control.enabled;
    },
    set enabled(v) {
this._enabled = v;
    },

	stop: function() {
		this.enabled = false;
		return this;
	},

	start: function() {
		this.enabled = true;
		return this;
	},

	setup: function( param ) {
		jThree.extend( this, param );
		return this;
	},

	fixUp: function( bool ) {
		this._fixed = bool === undefined ? !this._fixed : bool;
	},

	resize: function () {
// AT: save some headache for browser mode, assuming that 3D is always using the full window
		if (true) {// this.domElement === document ) {

			this.screen.left = 
			this.screen.top = 0;
			this.screen.width = window.innerWidth;
			this.screen.height = window.innerHeight;

		} else {

			jThree.extend( this.screen, this.domElement.getBoundingClientRect() );
			//getBoundingClientRect() is readOnly
			// adjustments come from similar code in the jquery offset() function
			var d = this.domElement.ownerDocument.documentElement;
			this.screen.left += window.pageXOffset - d.clientLeft;
			this.screen.top += window.pageYOffset - d.clientTop;

		}

	},

	getMouseOnScreen: function ( pageX, pageY, optionalTarget ) {

// AT: 3D mirrored
if (System._browser.camera.mirror_3D) pageX = this.screen.width - ( pageX - this.screen.left );

		return ( optionalTarget || new THREE.Vector2 ).set(
			( pageX - this.screen.left ) / this.screen.width,
			( pageY - this.screen.top ) / this.screen.height
		);

	},

	getMouseProjectionOnBall: function ( pageX, pageY, projection ) {

// AT: 3D mirrored
if (System._browser.camera.mirror_3D) pageX = this.screen.width - ( pageX - this.screen.left );

		var mouseOnBall = new THREE.Vector3(
			( pageX - this.screen.width * 0.5 - this.screen.left ) / (this.screen.width*.5),
			( this.screen.height * 0.5 + this.screen.top - pageY ) / (this.screen.height*.5),
			0.0
		);

//DEBUG_show(mouseOnBall.toArray().join("\n"));
//this._fixed=true;mouseOnBall.y*=Math.pow(0.5*(1-Math.abs(mouseOnBall.x)),2);mouseOnBall.x*=0.5;//if(mouseOnBall.y<0)mouseOnBall.y=0;//this.damping=0.3;//this.rotateSpeed=2;//if(mouseOnBall.y<0)mouseOnBall.y=-mouseOnBall.y*0.5;mouseOnBall.x*=0.25;this.rotateSpeed=4;

		var length = mouseOnBall.length();

		if ( this.noRoll ) {

			if ( length < Math.SQRT1_2 ) {

				mouseOnBall.z = Math.sqrt( 1.0 - length*length );

			} else {

				mouseOnBall.z = .5 / length;

			}

		} else if ( length > 1.0 ) {

			mouseOnBall.normalize();

		} else {

			mouseOnBall.z = Math.sqrt( 1.0 - length * length );

		}

		this._eye.copy( this.object.position ).sub( this.target );

		projection.copy( this.object.up ).setLength( mouseOnBall.y );
		projection.add( this.objectUp.copy( this.object.up ).cross( this._eye ).setLength( mouseOnBall.x ) );
		projection.add( this._eye.setLength( mouseOnBall.z ) );
//DEBUG_show(projection.toArray().join("\n"))//var _len=projection.length();projection.y*=0.25;projection.setLength(_len);
		return projection;

	},

	checkDistances: function () {

		if ( !this.noZoom || !this.noPan ) {

			if ( this._eye.lengthSq() > this.maxDistance * this.maxDistance ) {

				this.object.position.addVectors( this.target, this._eye.setLength( this.maxDistance ) );

			}

			if ( this._eye.lengthSq() < this.minDistance * this.minDistance ) {

				this.object.position.addVectors( this.target, this._eye.setLength( this.minDistance ) );

			}

		}

	},

// AT: EPS
// https://github.com/mrdoob/three.js/blob/master/examples/js/controls/TrackballControls.js
EPS: 0.000001,

	update: function () {

// AT: getter/setter for .enabled
		if ( ! this._enabled ) return;

		this._eye.subVectors( this.object.position, this.target );

		if ( !this.noRotate ) {

			this.rotateCamera();

		}

		if ( !this.noZoom ) {

			this.zoomCamera();

		}

		if ( !this.noPan ) {

			this.panCamera();

		}

		this.object.position.addVectors( this.target, this._eye );

/*
// AT: TEST (obsolete)
var z_extra;

var p = this.object.position
if (MMD_SA._AR_roty_last)
  p.applyQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Vector3(0, -MMD_SA._AR_roty_last, 0)));
if (MMD_SA._AR_rotx_last)
  p.applyQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Vector3(-MMD_SA._AR_rotx_last, 0, 0)));
if (MMD_SA._AR_y_last) {
  p.y -= MMD_SA._AR_y_last
  this.target.y -= MMD_SA._AR_y_last * 0.75
}
if (MMD_SA._AR_z_last)
  p.z -= MMD_SA._AR_z_last
MMD_SA._AR_y_last = MMD_SA._AR_z_last = MMD_SA._AR_rotx_last = MMD_SA._AR_roty_last = 0

if (self.HeadTrackerAR && HeadTrackerAR.running) {
// Notice the swapping of x and y.
  MMD_SA._AR_roty = (HeadTrackerAR._cx-50)*MMD_SA_options.AR_camera_mod / 180 * Math.PI
  MMD_SA._AR_rotx = (HeadTrackerAR._cy-50)*MMD_SA_options.AR_camera_mod / 180 * Math.PI
  var d=1, z=1;
  if (HeadTrackerAR._cz > 1) {
    d = MMD_SA_options.camera_position[2]
    z = HeadTrackerAR._cz * HeadTrackerAR._cz_mod;
    MMD_SA._AR_z = d/z - d

    z_extra = (z-1) * 7.5 - MMD_SA.center_view[1];
    if (z_extra < 0)
      z_extra = 0
    MMD_SA._AR_y = z_extra;
  }
  else {
    MMD_SA._AR_z = MMD_SA._AR_y = 0
  }
//DEBUG_show(MMD_SA._AR_z+'/'+d+'/'+d/z)
}

if (MMD_SA._AR_z) {
  p.z += MMD_SA._AR_z
  MMD_SA._AR_z_last = MMD_SA._AR_z
}
if (MMD_SA._AR_y) {
  p.y += MMD_SA._AR_y
  this.target.y += MMD_SA._AR_y * 0.75
  MMD_SA._AR_y_last = MMD_SA._AR_y
}
if (MMD_SA._AR_rotx) {
  p.applyQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Vector3(MMD_SA._AR_rotx, 0, 0)));
  MMD_SA._AR_rotx_last = MMD_SA._AR_rotx
}
if (MMD_SA._AR_roty) {
  p.applyQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Vector3(0, MMD_SA._AR_roty, 0)));
  MMD_SA._AR_roty_last = MMD_SA._AR_roty
}
*/

		this.checkDistances();

		this.object.lookAt( this.target );

		if ( this.lastPosition.distanceToSquared( this.object.position ) > this.EPS ) {

			this.lastPosition.copy( this.object.position );

		}

	}

};

jThree.Trackball = function( selector ) {

	var balls = [];

	jThree( isFinite( selector ) ? "rdr:eq(" + selector + ")" : selector || "rdr" ).each( function() {

		var ball = new THREE.TrackballControls( jThree.three( jThree.getCamera( this ) ), jThree.getCanvas( this ) );

		jThree.update( this, function() {
			ball.callback && ball.callback();
			ball.update();
		} );

		jThree( this ).resize( function() {
			ball.resize();
		} ).on( "attrChange", function( e ) {

			if ( e.attrName !== "camera" ) return;
			ball.object = jThree.three( jThree.getCamera( this ) );
			ball.target = ball.object._lookAt;

		} );

		balls.push( ball );

	} );

// AT: make the trackball object portable
if (self.MMD_SA)
  MMD_SA._trackball_camera = balls[0]

	return balls.length > 1 ? balls : balls[ 0 ];

};