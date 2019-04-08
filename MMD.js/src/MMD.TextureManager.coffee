class MMD.TextureManager
  constructor: (mmd) ->
    @mmd = mmd
    @store = {}
    @pendingCount = 0

  get: (type, url) ->
    texture = @store[url]
    return texture if texture

    gl = @mmd.gl
    texture = @store[url] = gl.createTexture()

    loadImage(url, (img) =>
      img = checkSize(img)

      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)

      if type == 'toon'
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      else
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)

      gl.generateMipmap(gl.TEXTURE_2D)
      gl.bindTexture(gl.TEXTURE_2D, null)

      @onload(img) if @onload
      --@pendingCount
    )
    @pendingCount++

    return texture

# utils
checkSize = (img) ->
  w = img.naturalWidth
  h = img.naturalHeight
  size = 1 << (Math.log(Math.min(w, h)) / Math.LN2 | 0) # largest 2^n integer that don't exceed w or h
  if w != h || w != size
    canv = document.createElement('canvas')
    canv.height = canv.width = size
    canv.getContext('2d').drawImage(img, 0, 0, w, h, 0, 0, size, size)
    img = canv

  return img

loadImage = (url, callback) ->
  img = new Image
  img.onload = -> callback(img)
  img.onerror = -> alert('failed to load image: ' + url)
  img.src = url

  return img
