/**
 * jThree.FlyView.js v1.2 - http://www.jthree.co/
 * Includes FirstPersonControls.js
 * mrdoob / http://mrdoob.com/
 * alteredq / http://alteredqualia.com/
 * paulirish / http://paulirish.com/
 */

THREE.FirstPersonControls = function ( object, domElement ) {

	var _this = this;

	this.object = object;
	this.target = new THREE.Vector3;

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	this.movementSpeed =
	this.acceleration = 10;
	this.lookSpeed = 0.1;

	this.lookVertical = true;
	this.autoForward = false;

	this.activeLook = true;

	this.heightSpeed = false;
	this.heightCoef = 1.0;
	this.heightMin = 0.0;
	this.heightMax = 1.0;

	this.constrainVertical = false;
	this.verticalMin = 0;
	this.verticalMax = Math.PI;

	this.autoSpeedFactor =

	this.mouseX =
	this.mouseY =

	this.lat =
	this.lon =
	this.phi =
	this.theta = 0;

	this.moveForward =
	this.moveBackward =
	this.moveLeft =
	this.moveRight =
	this.freeze = false;

	this.viewHalfX =
	this.viewHalfY = 0;

	this.position0 = object.position.clone();
	this.lookAt0 = object._lookAt.clone();

	//

	function onMouseDown( event ) {

		if ( _this.freeze ) return;

		event.preventDefault();
		event.stopPropagation();

		if ( _this.activeLook && event.button !== 1  ) {

			_this[ event.button ? "moveBackward" : "moveForward" ] = true;

		}

	}

	function onMouseUp( event ) {

		if ( _this.freeze ) return;

		event.preventDefault();
		event.stopPropagation();

		if ( _this.activeLook && event.button !== 1 ) {

			_this[ event.button ? "moveBackward" : "moveForward" ] = false;

		}

	}

	function onMouseMove( event ) {

		if ( _this.freeze ) return;

		if ( _this.domElement === document ) {

			_this.mouseX = event.pageX - _this.viewHalfX;
			_this.mouseY = event.pageY - _this.viewHalfY;

		} else {

			_this.mouseX = event.pageX - _this.domElement.offsetLeft - _this.viewHalfX;
			_this.mouseY = event.pageY - _this.domElement.offsetTop - _this.viewHalfY;

		}

	}

	function mousewheel( event ) {

		if ( _this.freeze ) return;

		event.preventDefault();
		event.stopPropagation();

		var delta = 0;

		if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

			delta = event.wheelDelta;

		} else if ( event.detail ) { // Firefox

			delta = - event.detail;

		}

		if ( delta > 0 ) {
			_this.movementSpeed += _this.acceleration;
		} else if ( _this.movementSpeed > _this.acceleration ) {
			_this.movementSpeed -= _this.acceleration;
		} else {
			_this.movementSpeed = 0;
		}

	}

	function onKeyDown( event ) {

		if ( _this.freeze ) return;

		switch ( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ _this.moveForward = true; break;

			case 37: /*left*/
			case 65: /*A*/ _this.moveLeft = true; break;

			case 40: /*down*/
			case 83: /*S*/ _this.moveBackward = true; break;

			case 39: /*right*/
			case 68: /*D*/ _this.moveRight = true; break;

			case 82: /*R*/ _this.moveUp = true; break;
			case 70: /*F*/ _this.moveDown = true; break;

			case 81: /*Q*/ _this.freeze = !_this.freeze; break;

		}

	}

	function onKeyUp( event ) {

		if ( _this.freeze ) return;

		switch( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ _this.moveForward = false; break;

			case 37: /*left*/
			case 65: /*A*/ _this.moveLeft = false; break;

			case 40: /*down*/
			case 83: /*S*/ _this.moveBackward = false; break;

			case 39: /*right*/
			case 68: /*D*/ _this.moveRight = false; break;

			case 82: /*R*/ _this.moveUp = false; break;
			case 70: /*F*/ _this.moveDown = false; break;

		}

	}

	this.mousewheel = function( bool ) {

		if ( bool ) {
			this.domElement.addEventListener( 'mousewheel', mousewheel, false );
			this.domElement.addEventListener( 'DOMMouseScroll', mousewheel, false ); // firefox
		} else {
			this.domElement.removeEventListener( 'mousewheel', mousewheel );
			this.domElement.removeEventListener( 'DOMMouseScroll', mousewheel ); // firefox
		}

		return this;

	};

	this.drag = function( bool ) {

		if ( bool ) {
			this.domElement.addEventListener( 'mousedown', onMouseDown, false );
			this.domElement.addEventListener( 'mouseup', onMouseUp, false );
		} else {
			this.domElement.removeEventListener( 'mousedown', onMouseDown );
			this.domElement.removeEventListener( 'mouseup', onMouseUp );
		}

		return this;

	};

	this.mousemove = function( bool ) {

		if ( bool ) {
			this.domElement.addEventListener( 'mousemove', onMouseMove, false );
		} else {
			this.domElement.removeEventListener( 'mousemove', onMouseMove );
		}

		return this;

	};

	this.mousewheel( true ).mousemove( true ).drag( true );

	this.domElement.addEventListener( 'contextmenu', function ( e ) { e.preventDefault(); }, false );
	window.addEventListener( 'keydown', onKeyDown, false );
	window.addEventListener( 'keyup', onKeyUp, false );

	this.handleResize();
	this.eyeSet();

};

THREE.FirstPersonControls.prototype = {

	constructor: THREE.FirstPersonControls,

	stop: function() {
		this.freeze = true;
		this.moveForward =
		this.moveLeft =
		this.moveBackward =
		this.moveRight =
		this.moveUp =
		this.moveDown = false;
		return this;
	},

	start: function() {
		this.freeze = false;
		this.eyeSet();
		return this;
	},

	setup: function( param ) {
		jThree.extend( this, param );
		return this;
	},

	reset: function() {

		this.moveForward =
		this.moveLeft =
		this.moveBackward =
		this.moveRight =
		this.moveUp =
		this.moveDown = false;

		this.object.position.copy( this.position0 );
		this.object.lookAt( this.lookAt0 );

		this.eyeSet();

		return this;
	},

	eyeSet: function() {

		var position = this.object.position,
			lookAt = this.object._lookAt,
			tmp = Math.pow( lookAt.z - position.z, 2 ) + Math.pow( lookAt.x - position.x, 2 );

		this.lon = THREE.Math.radToDeg( Math.atan2( lookAt.z - position.z, lookAt.x - position.x ) );
		this.lat = ( lookAt.y - position.y < 0 ? -1 : 1 ) * THREE.Math.radToDeg( Math.acos( Math.sqrt( tmp ) / Math.sqrt( tmp + Math.pow( lookAt.y - position.y, 2 ) ) ) ) || 0;

		return this;
	},

	handleResize: function () {

		if ( this.domElement === document ) {

			this.viewHalfX = window.innerWidth / 2;
			this.viewHalfY = window.innerHeight / 2;

		} else {

			this.viewHalfX = this.domElement.offsetWidth / 2;
			this.viewHalfY = this.domElement.offsetHeight / 2;

		}

	},

	update: function( delta ) {

		if ( this.freeze ) return;

		if ( this.heightSpeed ) {

			this.autoSpeedFactor = delta * ( ( THREE.Math.clamp( this.object.position.y, this.heightMin, this.heightMax ) - this.heightMin ) * this.heightCoef );

		} else {

			this.autoSpeedFactor = 0.0;

		}

		var actualMoveSpeed = delta * this.movementSpeed;

		if ( this.moveForward || ( this.autoForward && !this.moveBackward ) ) this.object.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor ) );
		if ( this.moveBackward ) this.object.translateZ( actualMoveSpeed );

		if ( this.moveLeft ) this.object.translateX( - actualMoveSpeed );
		if ( this.moveRight ) this.object.translateX( actualMoveSpeed );

		if ( this.moveUp ) this.object.translateY( actualMoveSpeed );
		if ( this.moveDown ) this.object.translateY( - actualMoveSpeed );

		var actualLookSpeed = this.activeLook ? delta * this.lookSpeed : 0,
			verticalLookRatio = this.constrainVertical ? Math.PI / ( this.verticalMax - this.verticalMin ) : 1;

		this.lon += this.mouseX * actualLookSpeed;
		if( this.lookVertical ) this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

		this.lat = Math.max( - 89, Math.min( 89, this.lat ) );
		this.phi = THREE.Math.degToRad( 90 - this.lat );

		this.theta = THREE.Math.degToRad( this.lon );

		if ( this.constrainVertical ) {

			this.phi = THREE.Math.mapLinear( this.phi, 0, Math.PI, this.verticalMin, this.verticalMax );

		}

		var targetPosition = this.target,
			position = this.object.position;

		targetPosition.x = position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
		targetPosition.y = position.y + 100 * Math.cos( this.phi );
		targetPosition.z = position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );

		this.object.lookAt( targetPosition );

	}

};

jThree.flyView = function( selector ) {

	var cameras = [];

	jThree( isFinite( selector ) ? "rdr:eq(" + selector + ")" : selector || "rdr" ).each( function() {

		var camera = new THREE.FirstPersonControls( jThree.three( jThree.getCamera( this ) ), jThree.getCanvas( this ) );

		camera.renderer = this;

		jThree.update( this, function( delta, elapsed ) {
			camera.callback && camera.callback( delta, elapsed );
			camera.update( delta * .001 );
		} );

		jThree( this ).resize( function() {
			camera.handleResize();
		} ).on( "attrChange", function( e ) {

			if ( e.attrName !== "camera" ) return;
			camera.object = jThree.three( jThree.getCamera( this ) );
			camera.eyeSet();

		} );

		cameras.push( camera );

	} );

	return cameras.length > 1 ? cameras : cameras[ 0 ];

};