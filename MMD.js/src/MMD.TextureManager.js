(function() {
  var checkSize, loadImage;

  MMD.TextureManager = (function() {

    function TextureManager(mmd) {
      this.mmd = mmd;
      this.store = {};
      this.pendingCount = 0;
    }

    TextureManager.prototype.get = function(type, url) {
      var gl, texture;
      var _this = this;
      texture = this.store[url];
      if (texture) return texture;
      gl = this.mmd.gl;
      texture = this.store[url] = gl.createTexture();
      loadImage(url, function(img) {
        img = checkSize(img);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        if (type === 'toon') {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        } else {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        }
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        if (_this.onload) _this.onload(img);
        return --_this.pendingCount;
      });
      this.pendingCount++;
      return texture;
    };

    return TextureManager;

  })();

  checkSize = function(img) {
    var canv, h, size, w;
    w = img.naturalWidth;
    h = img.naturalHeight;
    size = 1 << (Math.log(Math.min(w, h)) / Math.LN2 | 0);
    if (w !== h || w !== size) {
      canv = document.createElement('canvas');
      canv.height = canv.width = size;
      canv.getContext('2d').drawImage(img, 0, 0, w, h, 0, 0, size, size);
      img = canv;
    }
    return img;
  };

  loadImage = function(url, callback) {
    var img;
    img = new Image;
    img.onload = function() {
      return callback(img);
    };
    img.onerror = function() {
      return alert('failed to load image: ' + url);
    };
if (/data\//.test(url)) url = "MMD.js/" + url
if (!/^\w+\:/.test(url)) url = toFileProtocol(System.Gadget.path + '/' + url)
    img.src = url;
    return img;
  };

}).call(this);
