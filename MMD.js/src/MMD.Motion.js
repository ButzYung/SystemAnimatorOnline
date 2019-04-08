(function() {
  var BoneMotion, CameraMotion, LightMotion, MorphMotion, SelfShadowMotion, size_Float32, size_Uint32, size_Uint8, slice;

  size_Uint8 = Uint8Array.BYTES_PER_ELEMENT;

  size_Uint32 = Uint32Array.BYTES_PER_ELEMENT;

  size_Float32 = Float32Array.BYTES_PER_ELEMENT;

  slice = Array.prototype.slice;

  this.MMD.Motion = (function() {

    function Motion(path) {
path = toFileProtocol((/^\w+\:/.test(path)) ? path : System.Gadget.path + '/' + path)
      this.path = path;
    }

    Motion.prototype.load = function(callback) {
      var xhr;
      var _this = this;
      xhr = new XMLHttpRequest;
      xhr.open('GET', this.path, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function() {
        console.time('parse');
        _this.parse(xhr.response);
        console.timeEnd('parse');
        return callback.call(_this);
      };
      return xhr.send();
    };

    Motion.prototype.parse = function(buffer) {
      var length, offset, view;
      length = buffer.byteLength;
      view = new DataView(buffer, 0);
      offset = 0;
      offset = this.checkHeader(buffer, view, offset);
      offset = this.getModelName(buffer, view, offset);
      offset = this.getBoneMotion(buffer, view, offset);
      offset = this.getMorphMotion(buffer, view, offset);
      offset = this.getCameraMotion(buffer, view, offset);
      offset = this.getLightMotion(buffer, view, offset);
if (offset < length)
  offset = this.getSelfShadowMotion(buffer, view, offset);
      return offset;
    };

    Motion.prototype.checkHeader = function(buffer, view, offset) {
//if (String.fromCharCode.apply(null, slice.call(new Uint8Array(buffer, offset, 30))).indexOf('Vocaloid Motion Data 0002') == -1) {
      if ('Vocaloid Motion Data 0002\0\0\0\0\0' !== String.fromCharCode.apply(null, slice.call(new Uint8Array(buffer, offset, 30)))) {
        throw 'File is not VMD';
      }
      return offset += 30 * size_Uint8;
    };

    Motion.prototype.getModelName = function(buffer, view, offset) {
      this.model_name = sjisArrayToString(new Uint8Array(buffer, offset, 20));
      return offset += size_Uint8 * 20;
    };

    Motion.prototype.getBoneMotion = function(buffer, view, offset) {
      var i, length;
      length = view.getUint32(offset, true);
      offset += size_Uint32;
      this.bone = (function() {
        var _results;
        _results = [];
        for (i = 0; 0 <= length ? i < length : i > length; 0 <= length ? i++ : i--) {
          _results.push(new BoneMotion(buffer, view, offset + i * BoneMotion.size));
        }
        return _results;
      })();
      return offset += length * BoneMotion.size;
    };

    Motion.prototype.getMorphMotion = function(buffer, view, offset) {
      var i, length;
      length = view.getUint32(offset, true);
      offset += size_Uint32;
      this.morph = (function() {
        var _results;
        _results = [];
        for (i = 0; 0 <= length ? i < length : i > length; 0 <= length ? i++ : i--) {
          _results.push(new MorphMotion(buffer, view, offset + i * MorphMotion.size));
        }
        return _results;
      })();
      return offset += length * MorphMotion.size;
    };

    Motion.prototype.getCameraMotion = function(buffer, view, offset) {
      var i, length;
      length = view.getUint32(offset, true);
      offset += size_Uint32;
      this.camera = (function() {
        var _results;
        _results = [];
        for (i = 0; 0 <= length ? i < length : i > length; 0 <= length ? i++ : i--) {
          _results.push(new CameraMotion(buffer, view, offset + i * CameraMotion.size));
        }
        return _results;
      })();
      return offset += length * CameraMotion.size;
    };

    Motion.prototype.getLightMotion = function(buffer, view, offset) {
      var i, length;
      length = view.getUint32(offset, true);
      offset += size_Uint32;
      this.light = (function() {
        var _results;
        _results = [];
        for (i = 0; 0 <= length ? i < length : i > length; 0 <= length ? i++ : i--) {
          _results.push(new LightMotion(buffer, view, offset + i * LightMotion.size));
        }
        return _results;
      })();
      return offset += length * LightMotion.size;
    };

    Motion.prototype.getSelfShadowMotion = function(buffer, view, offset) {
      var i, length;
      length = view.getUint32(offset, true);
      offset += size_Uint32;
      this.selfshadow = (function() {
        var _results;
        _results = [];
        for (i = 0; 0 <= length ? i < length : i > length; 0 <= length ? i++ : i--) {
          _results.push(new SelfShadowMotion(buffer, view, offset + i * SelfShadowMotion.size));
        }
        return _results;
      })();
      return offset += length * SelfShadowMotion.size;
    };

    return Motion;

  })();

  BoneMotion = (function() {

    function BoneMotion(buffer, view, offset) {
      var i, tmp;
      this.name = sjisArrayToString(new Uint8Array(buffer, offset, 15));
      offset += size_Uint8 * 15;
      this.frame = view.getUint32(offset, true);
      offset += size_Uint32;
      tmp = [];
      tmp[0] = view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[1] = view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[2] = -view.getFloat32(offset, true);
      offset += size_Float32;
      this.location = new Float32Array(tmp);
      tmp[0] = -view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[1] = -view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[2] = view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[3] = view.getFloat32(offset, true);
      offset += size_Float32;
      this.rotation = new Float32Array(tmp);
      for (i = 0; i < 64; i++) {
        tmp[i] = view.getUint8(offset, true);
        offset += size_Uint8;
      }
      this.interpolation = new Uint8Array(tmp);
    }

    return BoneMotion;

  })();

  BoneMotion.size = size_Uint8 * (15 + 64) + size_Uint32 + size_Float32 * 7;

  MorphMotion = (function() {

    function MorphMotion(buffer, view, offset) {
      this.name = sjisArrayToString(new Uint8Array(buffer, offset, 15));
      offset += size_Uint8 * 15;
      this.frame = view.getUint32(offset, true);
      offset += size_Uint32;
      this.weight = view.getFloat32(offset, true);
      offset += size_Float32;
    }

    return MorphMotion;

  })();

  MorphMotion.size = size_Uint8 * 15 + size_Uint32 + size_Float32;

  CameraMotion = (function() {

    function CameraMotion(buffer, view, offset) {
      var i, tmp;
      this.frame = view.getUint32(offset, true);
      offset += size_Uint32;
      this.distance = -view.getFloat32(offset, true);
      offset += size_Float32;
      tmp = [];
      tmp[0] = view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[1] = view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[2] = -view.getFloat32(offset, true);
      offset += size_Float32;
      this.location = new Float32Array(tmp);
      tmp[0] = -view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[1] = -view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[2] = view.getFloat32(offset, true);
      offset += size_Float32;
      this.rotation = new Float32Array(tmp);
      for (i = 0; i < 24; i++) {
        tmp[i] = view.getUint8(offset, true);
        offset += size_Uint8;
      }
      this.interpolation = new Uint8Array(tmp);
      this.view_angle = view.getUint32(offset, true);
      offset += size_Uint32;
      this.noPerspective = view.getUint8(offset, true);
      offset += size_Uint8;
    }

    return CameraMotion;

  })();

  CameraMotion.size = size_Float32 * 7 + size_Uint8 * 25 + size_Float32 * 2;

  LightMotion = (function() {

    function LightMotion(buffer, view, offset) {
      var tmp;
      this.frame = view.getUint32(offset, true);
      offset += size_Uint32;
      tmp = [];
      tmp[0] = view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[1] = view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[2] = view.getFloat32(offset, true);
      offset += size_Float32;
      this.color = new Float32Array(tmp);
      tmp = [];
      tmp[0] = -view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[1] = -view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[2] = view.getFloat32(offset, true);
      offset += size_Float32;
      this.location = new Float32Array(tmp);
    }

    return LightMotion;

  })();

  LightMotion.size = size_Float32 * 6 + size_Uint32;

  SelfShadowMotion = (function() {

    function SelfShadowMotion(buffer, view, offset) {
      this.frame = view.getUint32(offset, true);
      offset += size_Uint32;
      this.mode = view.getUint8(offset, true);
      offset += size_Uint8;
      this.distance = view.getFloat32(offset, true);
      offset += size_Float32;
    }

    return SelfShadowMotion;

  })();

  SelfShadowMotion.size = size_Float32 + size_Uint8 + size_Float32;

}).call(this);
