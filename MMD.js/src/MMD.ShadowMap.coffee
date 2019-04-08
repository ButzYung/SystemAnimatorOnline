class MMD.ShadowMap
  constructor: (mmd) ->
    @mmd = mmd
    @framebuffer = @texture = null
    @width = @height = 2048
    @viewBroadness = 0.6
    @debug = false

    @initFramebuffer()

  initFramebuffer: ->
    gl = @mmd.gl
    @framebuffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, @framebuffer)

    @texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, @texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST)
    gl.generateMipmap(gl.TEXTURE_2D)

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, @width, @height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)

    renderbuffer = gl.createRenderbuffer()
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer)
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, @width, @height)

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, @texture, 0)
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer)

    gl.bindTexture(gl.TEXTURE_2D, null)
    gl.bindRenderbuffer(gl.RENDERBUFFER, null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

  computeMatrices: ->
    # from mmd's vectors and matrices, calculate the "light" space's transform matrices

    center = vec3.create(@mmd.center) # center of view in world space

    lightDirection = vec3.createNormalize(@mmd.lightDirection) # becomes the camera direction in light space
    vec3.add(lightDirection, center)

    cameraPosition = vec3.create(@mmd.cameraPosition)
    lengthScale = vec3.lengthBetween(cameraPosition, center)
    size = lengthScale * this.viewBroadness # size of shadowmap

    viewMatrix = mat4.lookAt(lightDirection, center, [0, 1, 0])

    @mvMatrix = mat4.createMultiply(viewMatrix, @mmd.modelMatrix)

    mat4.multiplyVec3(viewMatrix, center) # transform center in view space
    cx = center[0]; cy = center[1]
    @pMatrix = mat4.ortho(cx - size, cx + size, cy - size, cy + size, -size, size) # orthographic projection; near can be negative
    return

  beforeRender: ->
    gl = @mmd.gl
    program = @mmd.program

    gl.bindFramebuffer(gl.FRAMEBUFFER, @framebuffer)

    gl.viewport(0, 0, @width, @height)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    gl.uniform1i(program.uGenerateShadowMap, true)
    gl.uniformMatrix4fv(program.uMVMatrix, false, @mvMatrix)
    gl.uniformMatrix4fv(program.uPMatrix, false, @pMatrix)

    return

  afterRender: ->
    gl = @mmd.gl
    program = @mmd.program

    gl.uniform1i(program.uGenerateShadowMap, false)

    gl.bindTexture(gl.TEXTURE_2D, @texture)
    gl.generateMipmap(gl.TEXTURE_2D)
    gl.bindTexture(gl.TEXTURE_2D, null)
    @debugTexture() if (@debug)
    return

  getLightMatrix: ->
    # display matrix transforms projection space to screen space. in fragment shader screen coordinates are available as gl_FragCoord
    # http://www.c3.club.kyutech.ac.jp/gamewiki/index.php?3D%BA%C2%C9%B8%CA%D1%B4%B9
    lightMatrix = mat4.createMultiply(@pMatrix, @mvMatrix)
    mat4.applyScale(lightMatrix, [0.5, 0.5, 0.5])
    mat4.applyTranslate(lightMatrix, [0.5, 0.5, 0.5])
    return lightMatrix

  debugTexture: ->
    gl = @mmd.gl
    pixelarray = new Uint8Array(@width * @height * 4)
    gl.readPixels(0, 0, @width, @height, gl.RGBA, gl.UNSIGNED_BYTE, pixelarray)

    canvas = document.getElementById('shadowmap')
    if not canvas
      canvas = document.createElement('canvas')
      canvas.id = 'shadowmap'
      canvas.width = @width
      canvas.height = @height
      canvas.style.border = 'solid black 1px'
      canvas.style.width = @mmd.width + 'px'
      canvas.style.height = @mmd.height + 'px'
      document.body.appendChild(canvas)

    ctx = canvas.getContext('2d')
    imageData = ctx.getImageData(0, 0, @width, @height)
    data = imageData.data
    data[i] = pixelarray[i] for i in [0...data.length]
    ctx.putImageData(imageData, 0, 0)

  getTexture: ->
    @texture
