/**
 * jThree.Trackball.js v1.3 - http://www.jthree.co/
 * Includes TrackballControls.js
 * Eberhard Graether / http://egraether.com/
 * Mark Lundin 		 / http://mark-lundin.com
 */

THREE.TrackballControls = function ( object, domElement ) {

	var _this = this,
		STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2 };

	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// API

	this.enabled = true;

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

		_panStart = new THREE.Vector2,
		_panEnd = new THREE.Vector2;

	// for reset

	this.target0 = this.target.clone();
	this.position0 = this.object.position.clone();
	this.up0 = this.object.up.clone();

	// for #getMouseProjectionOnBall

	this.objectUp = new THREE.Vector3;

	// methods

	this.rotateCamera = (function(){

		var axis = new THREE.Vector3,
			quaternion = new THREE.Quaternion;


		return function () {

			var angle = Math.acos( _rotateStart.dot( _rotateEnd ) / _rotateStart.length() / _rotateEnd.length() );

			if ( angle ) {

				axis.crossVectors( _rotateStart, _rotateEnd ).normalize();

				angle *= _this.rotateSpeed;

				quaternion.setFromAxisAngle( axis, -angle );

				this._eye.applyQuaternion( quaternion );
				_this.object.up.applyQuaternion( quaternion );

				_rotateEnd.applyQuaternion( quaternion );

				quaternion.setFromAxisAngle( axis, angle * ( _this.damping - 1.0 ) );
				_rotateStart.applyQuaternion( quaternion );

			}
		};

	}());

	this.zoomCamera = function () {

		var factor = 1.0 + ( _zoomEnd.y - _zoomStart.y ) * this.zoomSpeed;

		if ( factor !== 1.0 && factor > 0.0 ) {

			this._eye.multiplyScalar( factor );

			_zoomStart.y += ( _zoomEnd.y - _zoomStart.y ) * this.damping;

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

	this.reset = function () {

		_state = _prevState = STATE.NONE;

		this.object.position.copy( this.position0 );
		this.object.up.copy( this.up0 );
// AT: disable lookAt for AR
//if (!(MMD_SA_options.use_JSARToolKit && MMD_SA.AR_obj._m4))
		this.object.lookAt( this.target0 );

		this._eye.subVectors( this.object.position, this.target );

		this.lastPosition.copy( this.object.position );

		return this;

	};

	// listeners

	function mousedown( event ) {

		if ( ! _this.enabled ) return;

		event.preventDefault();
		event.stopPropagation();

		if ( _state === STATE.NONE ) {

			_state = event.button;

		}

		if ( _state === STATE.ROTATE && !_this.noRotate ) {

			_rotateStart = _this.getMouseProjectionOnBall( event.pageX, event.pageY, _rotateStart );
			_rotateEnd.copy(_rotateStart);

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

		if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

			delta = event.wheelDelta / 40;

		} else if ( event.detail ) { // Firefox

			delta = - event.detail / 3;

		}

		_zoomStart.y += delta * 0.01;

	}

// AT: mouse events
if (self.Animate_RAF) {
	Lbody_host.addEventListener( 'mousedown', function (e) { if (e.button !== 0) return; mousedown(e); }, false );
	Lbody_host.addEventListener( 'mousewheel', mousewheel, false );
	Lbody_host.addEventListener( 'DOMMouseScroll', mousewheel, false ); // firefox
}
else {
	this.domElement.addEventListener( "contextmenu", function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( "mousedown", mousedown, false );

	this.domElement.addEventListener( "mousewheel", mousewheel, false );
	this.domElement.addEventListener( "DOMMouseScroll", mousewheel, false ); // firefox
}

	this.handleResize();

};

THREE.TrackballControls.prototype = {

	constructor: THREE.TrackballControls,

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

	handleResize: function () {

		if ( this.domElement === document ) {

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

		return ( optionalTarget || new THREE.Vector2 ).set(
			( pageX - this.screen.left ) / this.screen.width,
			( pageY - this.screen.top ) / this.screen.height
		);

	},

	getMouseProjectionOnBall: function ( pageX, pageY, projection ) {

		var mouseOnBall = new THREE.Vector3(
			( pageX - this.screen.width * 0.5 - this.screen.left ) / (this.screen.width*.5),
			( this.screen.height * 0.5 + this.screen.top - pageY ) / (this.screen.height*.5),
			0.0
		),
		length = mouseOnBall.length();

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

	update: function () {

		if ( ! this.enabled ) return;

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

// AT: TEST
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

		this.checkDistances();

// AT: disable lookAt for AR
//if (!(MMD_SA_options.use_JSARToolKit && MMD_SA.AR_obj._m4))
		this.object.lookAt( this.target );

		if ( this.lastPosition.distanceToSquared( this.object.position ) > 0 ) {

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
			ball.handleResize();
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
//var ball = balls[0]
//ball.object.position.applyQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Vector3(0,Math.PI/4,0)));
//var xyz = ball.object.position.clone().applyQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Vector3(0,Math.PI/4,0))).applyQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Vector3(0,-Math.PI/4,0)));
//DEBUG_show(xyz.x+','+xyz.y+','+xyz.z,0,1)

	return balls.length > 1 ? balls : balls[ 0 ];

};