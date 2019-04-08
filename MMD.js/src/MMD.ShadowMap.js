(function() {

  MMD.ShadowMap = (function() {

    function ShadowMap(mmd) {
      this.mmd = mmd;
      this.framebuffer = this.texture = null;
      this.width = this.height = 2048;
      this.viewBroadness = 0.6;
      this.debug = false;
      this.initFramebuffer();
    }

    ShadowMap.prototype.initFramebuffer = function() {
      var gl, renderbuffer;
      gl = this.mmd.gl;
      this.framebuffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
      this.texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      renderbuffer = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
      return gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };

    ShadowMap.prototype.computeMatrices = function() {
      var cameraPosition, center, cx, cy, lengthScale, lightDirection, size, viewMatrix;
      center = vec3.create(this.mmd.center);
      lightDirection = vec3.createNormalize(this.mmd.lightDirection);
      vec3.add(lightDirection, center);
      cameraPosition = vec3.create(this.mmd.cameraPosition);
      lengthScale = vec3.lengthBetween(cameraPosition, center);
      size = lengthScale * this.viewBroadness;
      viewMatrix = mat4.lookAt(lightDirection, center, [0, 1, 0]);
      this.mvMatrix = mat4.createMultiply(viewMatrix, this.mmd.modelMatrix);
      mat4.multiplyVec3(viewMatrix, center);
      cx = center[0];
      cy = center[1];
      this.pMatrix = mat4.ortho(cx - size, cx + size, cy - size, cy + size, -size, size);
    };

    ShadowMap.prototype.beforeRender = function() {
      var gl, program;
      gl = this.mmd.gl;
      program = this.mmd.program;
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
      gl.viewport(0, 0, this.width, this.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniform1i(program.uGenerateShadowMap, true);
      gl.uniformMatrix4fv(program.uMVMatrix, false, this.mvMatrix);
      gl.uniformMatrix4fv(program.uPMatrix, false, this.pMatrix);
    };

    ShadowMap.prototype.afterRender = function() {
      var gl, program;
      gl = this.mmd.gl;
      program = this.mmd.program;
      gl.uniform1i(program.uGenerateShadowMap, false);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.bindTexture(gl.TEXTURE_2D, null);
      if (this.debug) this.debugTexture();
    };

    ShadowMap.prototype.getLightMatrix = function() {
      var lightMatrix;
      lightMatrix = mat4.createMultiply(this.pMatrix, this.mvMatrix);
      mat4.applyScale(lightMatrix, [0.5, 0.5, 0.5]);
      mat4.applyTranslate(lightMatrix, [0.5, 0.5, 0.5]);
      return lightMatrix;
    };

    ShadowMap.prototype.debugTexture = function() {
      var canvas, ctx, data, gl, i, imageData, pixelarray, _ref;
      gl = this.mmd.gl;
      pixelarray = new Uint8Array(this.width * this.height * 4);
      gl.readPixels(0, 0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, pixelarray);
      canvas = document.getElementById('shadowmap');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'shadowmap';
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.style.border = 'solid black 1px';
        canvas.style.width = this.mmd.width + 'px';
        canvas.style.height = this.mmd.height + 'px';
        document.body.appendChild(canvas);
      }
      ctx = canvas.getContext('2d');
      imageData = ctx.getImageData(0, 0, this.width, this.height);
      data = imageData.data;
      for (i = 0, _ref = data.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        data[i] = pixelarray[i];
      }
      return ctx.putImageData(imageData, 0, 0);
    };

    ShadowMap.prototype.getTexture = function() {
      return this.texture;
    };

    return ShadowMap;

  })();

}).call(this);
