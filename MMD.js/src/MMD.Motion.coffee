# see http://blog.goo.ne.jp/torisu_tetosuki/e/bc9f1c4d597341b394bd02b64597499d

# some shorthands
size_Uint8 = Uint8Array.BYTES_PER_ELEMENT
size_Uint32 = Uint32Array.BYTES_PER_ELEMENT
size_Float32 = Float32Array.BYTES_PER_ELEMENT

slice = Array.prototype.slice

class this.MMD.Motion # export to top level
  constructor: (path) ->
    @path = path

  load: (callback) ->
    xhr = new XMLHttpRequest
    xhr.open('GET', @path, true)
    xhr.responseType = 'arraybuffer'
    xhr.onload = =>
      console.time('parse')
      @parse(xhr.response)
      console.timeEnd('parse')
      callback()
    xhr.send()

  parse: (buffer) ->
    length = buffer.byteLength
    view = new DataView(buffer, 0)
    offset = 0
    offset = @checkHeader(buffer, view, offset)
    offset = @getModelName(buffer, view, offset)
    offset = @getBoneMotion(buffer, view, offset)
    offset = @getMorphMotion(buffer, view, offset)
    offset = @getCameraMotion(buffer, view, offset)
    offset = @getLightMotion(buffer, view, offset)
    offset = @getSelfShadowMotion(buffer, view, offset)

  checkHeader: (buffer, view, offset) ->
    if 'Vocaloid Motion Data 0002\0\0\0\0\0' !=
      String.fromCharCode.apply(null,
        slice.call(new Uint8Array(buffer, offset, 30)))
          throw 'File is not VMD'
    offset += 30 * size_Uint8

  getModelName: (buffer, view, offset) ->
    @model_name = sjisArrayToString(new Uint8Array(buffer, offset, 20))
    offset += size_Uint8 * 20

  getBoneMotion: (buffer, view, offset) ->
    length = view.getUint32(offset, true)
    offset += size_Uint32
    @bone =
      for i in [0...length]
        new BoneMotion(buffer, view, offset + i * BoneMotion.size)
    offset += length * BoneMotion.size

  getMorphMotion: (buffer, view, offset) ->
    length = view.getUint32(offset, true)
    offset += size_Uint32
    @morph =
      for i in [0...length]
        new MorphMotion(buffer, view, offset + i * MorphMotion.size)
    offset += length * MorphMotion.size

  getCameraMotion: (buffer, view, offset) ->
    length = view.getUint32(offset, true)
    offset += size_Uint32
    @camera =
      for i in [0...length]
        new CameraMotion(buffer, view, offset + i * CameraMotion.size)
    offset += length * CameraMotion.size

  getLightMotion: (buffer, view, offset) ->
    length = view.getUint32(offset, true)
    offset += size_Uint32
    @light =
      for i in [0...length]
        new LightMotion(buffer, view, offset + i * LightMotion.size)
    offset += length * LightMotion.size

  getSelfShadowMotion: (buffer, view, offset) ->
    length = view.getUint32(offset, true)
    offset += size_Uint32
    @selfshadow =
      for i in [0...length]
        new SelfShadowMotion(buffer, view, offset + i * SelfShadowMotion.size)
    offset += length * SelfShadowMotion.size


#char BoneName[15];
#DWORD FlameNo;
#float Location[3];
#float Rotatation[4]; // Quaternion
#BYTE Interpolation[64]; // [4][4][4]
class BoneMotion
  constructor: (buffer, view, offset) ->
    @name = sjisArrayToString(new Uint8Array(buffer, offset, 15))
    offset += size_Uint8 * 15
    @frame = view.getUint32(offset, true); offset += size_Uint32
    tmp = []
    tmp[0] = view.getFloat32(offset, true); offset += size_Float32
    tmp[1] = view.getFloat32(offset, true); offset += size_Float32
    tmp[2] = - view.getFloat32(offset, true); offset += size_Float32 # left->right handed system
    @location = new Float32Array(tmp)
    tmp[0] = - view.getFloat32(offset, true); offset += size_Float32 # left->right handed system
    tmp[1] = - view.getFloat32(offset, true); offset += size_Float32 # left->right handed system
    tmp[2] = view.getFloat32(offset, true); offset += size_Float32
    tmp[3] = view.getFloat32(offset, true); offset += size_Float32
    @rotation = new Float32Array(tmp)
    for i in [0...64]
      tmp[i] = view.getUint8(offset, true); offset += size_Uint8
    @interpolation = new Uint8Array(tmp)

BoneMotion.size = size_Uint8 * (15 + 64) + size_Uint32 + size_Float32 * 7

#char SkinName[15];
#DWORD FlameNo;
#float Weight;
class MorphMotion
  constructor: (buffer, view, offset) ->
    @name = sjisArrayToString(new Uint8Array(buffer, offset, 15))
    offset += size_Uint8 * 15
    @frame = view.getUint32(offset, true); offset += size_Uint32
    @weight = view.getFloat32(offset, true); offset += size_Float32

MorphMotion.size = size_Uint8 * 15 + size_Uint32 + size_Float32

#DWORD FlameNo;
#float Length; // -(距離)
#float Location[3];
#float Rotation[3]; // オイラー角 // X軸は符号が反転しているので注意
#BYTE Interpolation[24]; // おそらく[6][4](未検証)
#DWORD ViewingAngle;
#BYTE Perspective; // 0:on 1:off
class CameraMotion
  constructor: (buffer, view, offset) ->
    @frame = view.getUint32(offset, true); offset += size_Uint32
    @distance = - view.getFloat32(offset, true); offset += size_Float32
    tmp = []
    tmp[0] = view.getFloat32(offset, true); offset += size_Float32
    tmp[1] = view.getFloat32(offset, true); offset += size_Float32
    tmp[2] = - view.getFloat32(offset, true); offset += size_Float32 # left->right handed system
    @location = new Float32Array(tmp)
    tmp[0] = - view.getFloat32(offset, true); offset += size_Float32 # left->right handed system
    tmp[1] = - view.getFloat32(offset, true); offset += size_Float32 # left->right handed system
    tmp[2] = view.getFloat32(offset, true); offset += size_Float32
    @rotation = new Float32Array(tmp)
    for i in [0...24]
      tmp[i] = view.getUint8(offset, true); offset += size_Uint8
    @interpolation = new Uint8Array(tmp)
    @view_angle = view.getUint32(offset, true); offset += size_Uint32
    @noPerspective = view.getUint8(offset, true); offset += size_Uint8

CameraMotion.size = size_Float32 * 7 + size_Uint8 * 25 + size_Float32 * 2

#DWORD FlameNo;
#float RGB[3]; // RGB各値/256
#float Location[3];
class LightMotion
  constructor: (buffer, view, offset) ->
    @frame = view.getUint32(offset, true); offset += size_Uint32
    tmp = []
    tmp[0] = view.getFloat32(offset, true); offset += size_Float32
    tmp[1] = view.getFloat32(offset, true); offset += size_Float32
    tmp[2] = view.getFloat32(offset, true); offset += size_Float32
    @color = new Float32Array(tmp)
    tmp = []
    tmp[0] = - view.getFloat32(offset, true); offset += size_Float32
    tmp[1] = - view.getFloat32(offset, true); offset += size_Float32
    tmp[2] = view.getFloat32(offset, true); offset += size_Float32 # left->right handed system
    @location = new Float32Array(tmp)

LightMotion.size = size_Float32 * 6 + size_Uint32

#DWORD FlameNo;
#BYTE Mode; // 00-02
#float Distance; // 0.1 - (dist * 0.00001)
class SelfShadowMotion
  constructor: (buffer, view, offset) ->
    @frame = view.getUint32(offset, true); offset += size_Uint32
    @mode = view.getUint8(offset, true); offset += size_Uint8
    @distance = view.getFloat32(offset, true); offset += size_Float32

SelfShadowMotion.size = size_Float32 + size_Uint8 + size_Float32

