// backported from https://github.com/mrdoob/three.js/tree/dev/src/audio

(function () {

// core
var Object3D = THREE.Object3D;
var Vector3 = THREE.Vector3;
var Quaternion = THREE.Quaternion;
var Clock = THREE.Clock;

// AudioContext.js START
var context;

var AudioContext = {

	getContext: function () {

		if ( context === undefined ) {

			context = new ( window.AudioContext || window.webkitAudioContext )();

		}

		return context;

	},

	setContext: function ( value ) {

		context = value;

	}

};
// AudioContext.js END

// AudioListener.js START
function AudioListener() {

	Object3D.call( this );

	this.type = 'AudioListener';

	this.context = AudioContext.getContext();

	this.gain = this.context.createGain();
	this.gain.connect( this.context.destination );

	this.filter = null;

	this.timeDelta = 0;

}

AudioListener.prototype = Object.assign( Object.create( Object3D.prototype ), {

	constructor: AudioListener,

	getInput: function () {

		return this.gain;

	},

	removeFilter: function ( ) {

		if ( this.filter !== null ) {

			this.gain.disconnect( this.filter );
			this.filter.disconnect( this.context.destination );
			this.gain.connect( this.context.destination );
			this.filter = null;

		}

		return this;

	},

	getFilter: function () {

		return this.filter;

	},

	setFilter: function ( value ) {

		if ( this.filter !== null ) {

			this.gain.disconnect( this.filter );
			this.filter.disconnect( this.context.destination );

		} else {

			this.gain.disconnect( this.context.destination );

		}

		this.filter = value;
		this.gain.connect( this.filter );
		this.filter.connect( this.context.destination );

		return this;

	},

	getMasterVolume: function () {

		return this.gain.gain.value;

	},

	setMasterVolume: function ( value ) {

		this.gain.gain.setTargetAtTime( value, this.context.currentTime, 0.01 );

		return this;

	},

	updateMatrixWorld: ( function () {

		var position = new Vector3();
		var quaternion = new Quaternion();
		var scale = new Vector3();

		var orientation = new Vector3();
		var clock = new Clock();

		return function updateMatrixWorld( force ) {

			Object3D.prototype.updateMatrixWorld.call( this, force );

			var listener = this.context.listener;
			var up = this.up;

			this.timeDelta = clock.getDelta();

			this.matrixWorld.decompose( position, quaternion, scale );

			orientation.set( 0, 0, - 1 ).applyQuaternion( quaternion );

			if ( listener.positionX ) {

				// code path for Chrome (see #14393)

				var endTime = this.context.currentTime + this.timeDelta;

				listener.positionX.linearRampToValueAtTime( position.x, endTime );
				listener.positionY.linearRampToValueAtTime( position.y, endTime );
				listener.positionZ.linearRampToValueAtTime( position.z, endTime );
				listener.forwardX.linearRampToValueAtTime( orientation.x, endTime );
				listener.forwardY.linearRampToValueAtTime( orientation.y, endTime );
				listener.forwardZ.linearRampToValueAtTime( orientation.z, endTime );
				listener.upX.linearRampToValueAtTime( up.x, endTime );
				listener.upY.linearRampToValueAtTime( up.y, endTime );
				listener.upZ.linearRampToValueAtTime( up.z, endTime );

			} else {

				listener.setPosition( position.x, position.y, position.z );
				listener.setOrientation( orientation.x, orientation.y, orientation.z, up.x, up.y, up.z );

			}

		};

	} )()

} );
// AudioListener.js END

// Audio.js START
function Audio( listener ) {

	Object3D.call( this );

	this.type = 'Audio';

	this.listener = listener;
	this.context = listener.context;

	this.gain = this.context.createGain();
	this.gain.connect( listener.getInput() );

	this.autoplay = false;

	this.buffer = null;
	this.detune = 0;
	this.loop = false;
	this.startTime = 0;
	this.offset = 0;
	this.playbackRate = 1;
	this.isPlaying = false;
	this.hasPlaybackControl = true;
	this.sourceType = 'empty';

	this.filters = [];

}

Audio.prototype = Object.assign( Object.create( Object3D.prototype ), {

	constructor: Audio,

	getOutput: function () {

		return this.gain;

	},

	setNodeSource: function ( audioNode ) {

		this.hasPlaybackControl = false;
		this.sourceType = 'audioNode';
		this.source = audioNode;
		this.connect();

		return this;

	},

	setMediaElementSource: function ( mediaElement ) {

		this.hasPlaybackControl = false;
		this.sourceType = 'mediaNode';
		this.source = this.context.createMediaElementSource( mediaElement );
		this.connect();

		return this;

	},

	setBuffer: function ( audioBuffer ) {

		this.buffer = audioBuffer;
		this.sourceType = 'buffer';

		if ( this.autoplay ) this.play();

		return this;

	},

	play: function () {

		if ( this.isPlaying === true ) {

			console.warn( 'THREE.Audio: Audio is already playing.' );
			return;

		}

		if ( this.hasPlaybackControl === false ) {

			console.warn( 'THREE.Audio: this Audio has no playback control.' );
			return;

		}

// AT: Audio_Player
this._player && this._player._dispatchEvent("playing");

		var source = this.context.createBufferSource();

		source.buffer = this.buffer;
		source.detune.value = this.detune;
		source.loop = this.loop;
		source.onended = this.onEnded.bind( this );
		source.playbackRate.setValueAtTime( this.playbackRate, this.startTime );
		this.startTime = this.context.currentTime;
		source.start( this.startTime, this.offset );

		this.isPlaying = true;

		this.source = source;

		return this.connect();

	},

	pause: function () {

		if ( this.hasPlaybackControl === false ) {

			console.warn( 'THREE.Audio: this Audio has no playback control.' );
			return;

		}

		if ( this.isPlaying === true ) {

			this.source.stop();
			this.source.onended = null;
			this.offset += ( this.context.currentTime - this.startTime ) * this.playbackRate;
			this.isPlaying = false;

		}

		return this;

	},

	stop: function () {

		if ( this.hasPlaybackControl === false ) {

			console.warn( 'THREE.Audio: this Audio has no playback control.' );
			return;

		}

		this.source.stop();
		this.source.onended = null;
		this.offset = 0;
		this.isPlaying = false;

		return this;

	},

	connect: function () {

		if ( this.filters.length > 0 ) {

			this.source.connect( this.filters[ 0 ] );

			for ( var i = 1, l = this.filters.length; i < l; i ++ ) {

				this.filters[ i - 1 ].connect( this.filters[ i ] );

			}

			this.filters[ this.filters.length - 1 ].connect( this.getOutput() );

		} else {

			this.source.connect( this.getOutput() );

		}

		return this;

	},

	disconnect: function () {

		if ( this.filters.length > 0 ) {

			this.source.disconnect( this.filters[ 0 ] );

			for ( var i = 1, l = this.filters.length; i < l; i ++ ) {

				this.filters[ i - 1 ].disconnect( this.filters[ i ] );

			}

			this.filters[ this.filters.length - 1 ].disconnect( this.getOutput() );

		} else {

			this.source.disconnect( this.getOutput() );

		}

		return this;

	},

	getFilters: function () {

		return this.filters;

	},

	setFilters: function ( value ) {

		if ( ! value ) value = [];

		if ( this.isPlaying === true ) {

			this.disconnect();
			this.filters = value;
			this.connect();

		} else {

			this.filters = value;

		}

		return this;

	},

	setDetune: function ( value ) {

		this.detune = value;

		if ( this.isPlaying === true ) {

			this.source.detune.setTargetAtTime( this.detune, this.context.currentTime, 0.01 );

		}

		return this;

	},

	getDetune: function () {

		return this.detune;

	},

	getFilter: function () {

		return this.getFilters()[ 0 ];

	},

	setFilter: function ( filter ) {

		return this.setFilters( filter ? [ filter ] : [] );

	},

	setPlaybackRate: function ( value ) {

		if ( this.hasPlaybackControl === false ) {

			console.warn( 'THREE.Audio: this Audio has no playback control.' );
			return;

		}

		this.playbackRate = value;

		if ( this.isPlaying === true ) {

			this.source.playbackRate.setTargetAtTime( this.playbackRate, this.context.currentTime, 0.01 );

		}

		return this;

	},

	getPlaybackRate: function () {

		return this.playbackRate;

	},

	onEnded: function () {

// AT: Audio_Player
this._player && this._player._dispatchEvent("ended");

		this.isPlaying = false;

	},

	getLoop: function () {

		if ( this.hasPlaybackControl === false ) {

			console.warn( 'THREE.Audio: this Audio has no playback control.' );
			return false;

		}

		return this.loop;

	},

	setLoop: function ( value ) {

		if ( this.hasPlaybackControl === false ) {

			console.warn( 'THREE.Audio: this Audio has no playback control.' );
			return;

		}

		this.loop = value;

		if ( this.isPlaying === true ) {

			this.source.loop = this.loop;

		}

		return this;

	},

	getVolume: function () {

		return this.gain.gain.value;

	},

	setVolume: function ( value ) {

		this.gain.gain.setTargetAtTime( value, this.context.currentTime, 0.01 );

		return this;

	}

} );
// Audio.js END

// PositionalAudio.js START
function PositionalAudio( listener ) {

	Audio.call( this, listener );

	this.panner = this.context.createPanner();
	this.panner.connect( this.gain );

}

PositionalAudio.prototype = Object.assign( Object.create( Audio.prototype ), {

	constructor: PositionalAudio,

	getOutput: function () {

		return this.panner;

	},

	getRefDistance: function () {

		return this.panner.refDistance;

	},

	setRefDistance: function ( value ) {

		this.panner.refDistance = value;

		return this;

	},

	getRolloffFactor: function () {

		return this.panner.rolloffFactor;

	},

	setRolloffFactor: function ( value ) {

		this.panner.rolloffFactor = value;

		return this;

	},

	getDistanceModel: function () {

		return this.panner.distanceModel;

	},

	setDistanceModel: function ( value ) {

		this.panner.distanceModel = value;

		return this;

	},

	getMaxDistance: function () {

		return this.panner.maxDistance;

	},

	setMaxDistance: function ( value ) {

		this.panner.maxDistance = value;

		return this;

	},

	setDirectionalCone: function ( coneInnerAngle, coneOuterAngle, coneOuterGain ) {

		this.panner.coneInnerAngle = coneInnerAngle;
		this.panner.coneOuterAngle = coneOuterAngle;
		this.panner.coneOuterGain = coneOuterGain;

		return this;

	},

	updateMatrixWorld: ( function () {

		var position = new Vector3();
		var quaternion = new Quaternion();
		var scale = new Vector3();

		var orientation = new Vector3();

		return function updateMatrixWorld( force ) {

			Object3D.prototype.updateMatrixWorld.call( this, force );

			if ( this.isPlaying === false ) return;

			this.matrixWorld.decompose( position, quaternion, scale );

			orientation.set( 0, 0, 1 ).applyQuaternion( quaternion );

			var panner = this.panner;

			if ( panner.positionX ) {

				// code path for Chrome and Firefox (see #14393)

				var endTime = this.context.currentTime + this.listener.timeDelta;

				panner.positionX.linearRampToValueAtTime( position.x, endTime );
				panner.positionY.linearRampToValueAtTime( position.y, endTime );
				panner.positionZ.linearRampToValueAtTime( position.z, endTime );
				panner.orientationX.linearRampToValueAtTime( orientation.x, endTime );
				panner.orientationY.linearRampToValueAtTime( orientation.y, endTime );
				panner.orientationZ.linearRampToValueAtTime( orientation.z, endTime );

			} else {

				panner.setPosition( position.x, position.y, position.z );
				panner.setOrientation( orientation.x, orientation.y, orientation.z );

			}

		};

	} )()


} );
// PositionalAudio.js END

THREE.AudioContext = AudioContext;
THREE.AudioListener = AudioListener;
THREE.Audio = Audio;
THREE.PositionalAudio = PositionalAudio;

})();
