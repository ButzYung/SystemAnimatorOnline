# see http://blog.goo.ne.jp/torisu_tetosuki/e/209ad341d3ece2b1b4df24abf619d6e4

# some shorthands
size_Int8 = Int8Array.BYTES_PER_ELEMENT
size_Uint8 = Uint8Array.BYTES_PER_ELEMENT
size_Uint16 = Uint16Array.BYTES_PER_ELEMENT
size_Uint32 = Uint32Array.BYTES_PER_ELEMENT
size_Float32 = Float32Array.BYTES_PER_ELEMENT

slice = Array.prototype.slice

class this.MMD.Model # export to top level
  constructor: (directory, filename) ->
    @directory = directory
    @filename = filename
    @vertices = null
    @triangles = null
    @materials = null
    @bones = null
    @morphs = null
    @morph_order = null
    @bone_group_names = null
    @bone_table = null
    @english_flag = null
    @english_name = null
    @english_comment = null
    @english_bone_names = null
    @english_morph_names = null
    @english_bone_group_names = null
    @toon_file_names = null
    @rigid_bodies = null
    @joints = null

  load: (callback) ->
    xhr = new XMLHttpRequest
    xhr.open('GET', @directory + '/' + @filename, true)
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
    offset = @getName(buffer, view, offset)
    offset = @getVertices(buffer, view, offset)
    offset = @getTriangles(buffer, view, offset)
    offset = @getMaterials(buffer, view, offset)
    offset = @getBones(buffer, view, offset)
    offset = @getIKs(buffer, view, offset)
    offset = @getMorphs(buffer, view, offset)
    offset = @getMorphOrder(buffer, view, offset)
    offset = @getBoneGroupNames(buffer, view, offset)
    offset = @getBoneTable(buffer, view, offset)
    return if (offset >= length)
    offset = @getEnglishFlag(buffer, view, offset)
    if @english_flag
      offset = @getEnglishName(buffer, view, offset)
      offset = @getEnglishBoneNames(buffer, view, offset)
      offset = @getEnglishMorphNames(buffer, view, offset)
      offset = @getEnglishBoneGroupNames(buffer, view, offset)
    return if (offset >= length)
    offset = @getToonFileNames(buffer, view, offset)
    return if (offset >= length)
    offset = @getRigidBodies(buffer, view, offset)
    offset = @getJoints(buffer, view, offset)

  checkHeader: (buffer, view, offset) ->
    if view.getUint8(0) != 'P'.charCodeAt(0) or
       view.getUint8(1) != 'm'.charCodeAt(0) or
       view.getUint8(2) != 'd'.charCodeAt(0) or
       view.getUint8(3) != 0x00 or
       view.getUint8(4) != 0x00 or
       view.getUint8(5) != 0x80 or
       view.getUint8(6) != 0x3F
      throw 'File is not PMD'
    offset += 7 * size_Uint8

  getName: (buffer, view, offset) ->
    block = new Uint8Array(buffer, offset, 20 + 256)
    @name = sjisArrayToString(slice.call(block, 0, 20))
    @comment = sjisArrayToString(slice.call(block, 20, 20 + 256))
    offset += (20 + 256) * size_Uint8

  getVertices: (buffer, view, offset) ->
    length = view.getUint32(offset, true)
    offset += size_Uint32
    @vertices =
      for i in [0...length]
        new Vertex(buffer, view, offset + i * Vertex.size)
    offset += length * Vertex.size

  getTriangles: (buffer, view, offset) ->
    length = view.getUint32(offset, true)
    offset += size_Uint32
    @triangles = new Uint16Array(length)
    #left->right handed system (swap 0th and 1st vertices)
    for i in [0...length] by 3
      @triangles[i + 1] = view.getUint16(offset + i * size_Uint16, true)
      @triangles[i] = view.getUint16(offset + (i + 1) * size_Uint16, true)
      @triangles[i + 2] = view.getUint16(offset + (i + 2) * size_Uint16, true)
    offset += length * size_Uint16

  getMaterials: (buffer, view, offset) ->
    length = view.getUint32(offset, true)
    offset += size_Uint32
    @materials =
      for i in [0...length]
        new Material(buffer, view, offset + i * Material.size)
    offset += length * Material.size

  getBones: (buffer, view, offset) ->
    length = view.getUint16(offset, true)
    offset += size_Uint16
    @bones =
      for i in [0...length]
        new Bone(buffer, view, offset + i * Bone.size)
    offset += length * Bone.size

  getIKs: (buffer, view, offset) ->
    length = view.getUint16(offset, true)
    offset += size_Uint16
    @iks =
      for i in [0...length]
        ik = new IK(buffer, view, offset)
        offset += ik.getSize()
        ik
    offset

  getMorphs: (buffer, view, offset) ->
    length = view.getUint16(offset, true)
    offset += size_Uint16
    @morphs =
      for i in [0...length]
        morph = new Morph(buffer, view, offset)
        offset += morph.getSize()
        morph
    offset

  getMorphOrder: (buffer, view, offset) ->
    length = view.getUint8(offset)
    offset += size_Uint8
    @morph_order =
      for i in [0...length]
        view.getUint16(offset + i * size_Uint16, true)
    offset += length * size_Uint16

  getBoneGroupNames: (buffer, view, offset) ->
    length = view.getUint8(offset)
    offset += size_Uint8
    block = new Uint8Array(buffer, offset, 50 * length)
    @bone_group_names =
      for i in [0...length]
        sjisArrayToString(slice.call(block, i * 50, (i + 1) * 50))
    offset += length * 50 * size_Uint8

  getBoneTable: (buffer, view, offset) ->
    length = view.getUint32(offset, true)
    offset += size_Uint32
    @bone_table =
      for i in [0...length]
        bone = {}
        bone.index = view.getUint16(offset, true); offset += size_Uint16
        bone.group_index = view.getUint8(offset); offset += size_Uint8
        bone
    offset

  getEnglishFlag: (buffer, view, offset) ->
    @english_flag = view.getUint8(offset)
    offset += size_Uint8

  getEnglishName: (buffer, view, offset) ->
    block = new Uint8Array(buffer, offset, 20 + 256)
    @english_name = sjisArrayToString(slice.call(block, 0, 20))
    @english_comment = sjisArrayToString(slice.call(block, 20, 20 + 256))
    offset += (20 + 256) * size_Uint8

  getEnglishBoneNames: (buffer, view, offset) ->
    length = @bones.length
    block = new Uint8Array(buffer, offset, 20 * length)
    @english_bone_names =
      for i in [0...length]
        sjisArrayToString(slice.call(block, i * 20, (i + 1) * 20))
    offset += length * 20 * size_Uint8

  getEnglishMorphNames: (buffer, view, offset) ->
    length = @morphs.length - 1
    block = new Uint8Array(buffer, offset, 20 * length)
    @english_morph_names =
      for i in [0...length]
        sjisArrayToString(slice.call(block, i * 20, (i + 1) * 20))
    offset += length * 20 * size_Uint8

  getEnglishBoneGroupNames: (buffer, view, offset) ->
    length = @bone_group_names.length
    block = new Uint8Array(buffer, offset, 50 * length)
    @english_bone_group_names =
      for i in [0...length]
        sjisArrayToString(slice.call(block, i * 50, (i + 1) * 50))
    offset += length * 50 * size_Uint8

  getToonFileNames: (buffer, view, offset) ->
    block = new Uint8Array(buffer, offset, 100 * 10)
    @toon_file_names =
      for i in [0...10]
        sjisArrayToString(slice.call(block, i * 100, (i + 1) * 100))
    offset += 100 * 10 * size_Uint8

  getRigidBodies: (buffer, view, offset) ->
    length = view.getUint32(offset, true)
    offset += size_Uint32
    @rigid_bodies =
      for i in [0...length]
        new RigidBody(buffer, view, offset + i * RigidBody.size)
    offset += length * RigidBody.size

  getJoints: (buffer, view, offset) ->
    length = view.getUint32(offset, true)
    offset += size_Uint32
    @joints =
      for i in [0...length]
        new Joint(buffer, view, offset + i * Joint.size)
    offset += length * Joint.size

#http://blog.goo.ne.jp/torisu_tetosuki/e/5a1b16e2f61067838dfc66d010389707
#float pos[3]; // x, y, z // 座標
#float normal_vec[3]; // nx, ny, nz // 法線ベクトル
#float uv[2]; // u, v // UV座標 // MMDは頂点UV
#WORD bone_num[2]; // ボーン番号1、番号2 // モデル変形(頂点移動)時に影響
#BYTE bone_weight; // ボーン1に与える影響度 // min:0 max:100 // ボーン2への影響度は、(100 - bone_weight)
#BYTE edge_flag; // 0:通常、1:エッジ無効 // エッジ(輪郭)が有効の場合
class Vertex
  constructor: (buffer, view, offset) ->
    @x = view.getFloat32(offset, true); offset += size_Float32
    @y = view.getFloat32(offset, true); offset += size_Float32
    @z = - view.getFloat32(offset, true); offset += size_Float32 # left->right handed system
    @nx = view.getFloat32(offset, true); offset += size_Float32
    @ny = view.getFloat32(offset, true); offset += size_Float32
    @nz = - view.getFloat32(offset, true); offset += size_Float32 # left->right handed system
    @u = view.getFloat32(offset, true); offset += size_Float32
    @v = view.getFloat32(offset, true); offset += size_Float32
    @bone_num1 = view.getUint16(offset, true); offset += size_Uint16
    @bone_num2 = view.getUint16(offset, true); offset += size_Uint16
    @bone_weight = view.getUint8(offset); offset += size_Uint8
    @edge_flag = view.getUint8(offset); offset += size_Uint8

Vertex.size = size_Float32 * 8 + size_Uint16 * 2 + size_Uint8 * 2 # 38

#http://blog.goo.ne.jp/torisu_tetosuki/e/ea0bb1b1d4c6ad98a93edbfe359dac32
#float diffuse_color[3]; // dr, dg, db // 減衰色
#float alpha;
#float specularity;
#float specular_color[3]; // sr, sg, sb // 光沢色
#float mirror_color[3]; // mr, mg, mb // 環境色(ambient)
#BYTE toon_index; // toon??.bmp // 0.bmp:0xFF, 1(01).bmp:0x00 ・・・ 10.bmp:0x09
#BYTE edge_flag; // 輪郭、影
#DWORD face_vert_count; // 面頂点数 // インデックスに変換する場合は、材質0から順に加算
#char texture_file_name[20]; // テクスチャファイル名またはスフィアファイル名 // 20バイトぎりぎりまで使える(終端の0x00は無くても動く)
class Material
  constructor: (buffer, view, offset) ->
    tmp = []
    tmp[0] = view.getFloat32(offset, true); offset += size_Float32
    tmp[1] = view.getFloat32(offset, true); offset += size_Float32
    tmp[2] = view.getFloat32(offset, true); offset += size_Float32
    @diffuse = new Float32Array(tmp)
    @alpha = view.getFloat32(offset, true); offset += size_Float32
    @shininess = view.getFloat32(offset, true); offset += size_Float32
    tmp[0] = view.getFloat32(offset, true); offset += size_Float32
    tmp[1] = view.getFloat32(offset, true); offset += size_Float32
    tmp[2] = view.getFloat32(offset, true); offset += size_Float32
    @specular = new Float32Array(tmp)
    tmp[0] = view.getFloat32(offset, true); offset += size_Float32
    tmp[1] = view.getFloat32(offset, true); offset += size_Float32
    tmp[2] = view.getFloat32(offset, true); offset += size_Float32
    @ambient = new Float32Array(tmp)
    @toon_index = view.getInt8(offset); offset += size_Int8
    @edge_flag = view.getUint8(offset); offset += size_Uint8
    @face_vert_count = view.getUint32(offset, true); offset += size_Uint32
    @texture_file_name = sjisArrayToString(
      view.getUint8(offset + size_Uint8 * i) for i in [0...20])

Material.size = size_Float32 * 11 + size_Uint8 * 2 + size_Uint32 + size_Uint8 * 20 # 70

#http://blog.goo.ne.jp/torisu_tetosuki/e/638463f52d0ad6ca1c46fd315a9b17d0
#char bone_name[20]; // ボーン名
#WORD parent_bone_index; // 親ボーン番号(ない場合は0xFFFF)
#WORD tail_pos_bone_index; // tail位置のボーン番号(チェーン末端の場合は0xFFFF) // 親：子は1：多なので、主に位置決め用
#BYTE bone_type; // ボーンの種類
#WORD ik_parent_bone_index; // IKボーン番号(影響IKボーン。ない場合は0)
#float bone_head_pos[3]; // x, y, z // ボーンのヘッドの位置
class Bone
  constructor: (buffer, view, offset) ->
    @name = sjisArrayToString(new Uint8Array(buffer, offset, 20))
    offset += size_Uint8 * 20
    @parent_bone_index = view.getUint16(offset, true); offset += size_Uint16
    @tail_pos_bone_index = view.getUint16(offset, true); offset += size_Uint16
    @type = view.getUint8(offset); offset += size_Uint8
    @ik_parent_bone_index = view.getUint16(offset, true); offset += size_Uint16
    tmp = []
    tmp[0] = view.getFloat32(offset, true); offset += size_Float32
    tmp[1] = view.getFloat32(offset, true); offset += size_Float32
    tmp[2] = - view.getFloat32(offset, true); offset += size_Float32 # left->right handed system
    @head_pos = new Float32Array(tmp)

Bone.size = size_Uint8 * 21 + size_Uint16 * 3 + size_Float32 * 3

#http://blog.goo.ne.jp/torisu_tetosuki/e/445cbbbe75c4b2622c22b473a27aaae9
#WORD ik_bone_index; // IKボーン番号
#WORD ik_target_bone_index; // IKターゲットボーン番号 // IKボーンが最初に接続するボーン
#BYTE ik_chain_length; // IKチェーンの長さ(子の数)
#WORD iterations; // 再帰演算回数 // IK値1
#float control_weight; // IKの影響度 // IK値2
#WORD ik_child_bone_index[ik_chain_length]; // IK影響下のボーン番号
class IK
  constructor: (buffer, view, offset) ->
    @bone_index = view.getUint16(offset, true); offset += size_Uint16
    @target_bone_index = view.getUint16(offset, true); offset += size_Uint16
    chain_length = view.getUint8(offset); offset += size_Uint8
    @iterations = view.getUint16(offset, true); offset += size_Uint16
    @control_weight = view.getFloat32(offset, true); offset += size_Float32
    @child_bones = (view.getUint16(offset + size_Uint16 * i, true) for i in [0...chain_length])
  getSize: ->
    size_Uint16 * 3 + size_Uint8 + size_Float32 + size_Uint16 * @child_bones.length

#http://blog.goo.ne.jp/torisu_tetosuki/e/8553151c445d261e122a3a31b0f91110
class Morph
  constructor: (buffer, view, offset) ->
    @name = sjisArrayToString(new Uint8Array(buffer, offset, 20))
    offset += size_Uint8 * 20
    vert_count = view.getUint32(offset, true); offset += size_Uint32
    @type = view.getUint8(offset); offset += size_Uint8
    @vert_data =
      for i in [0...vert_count]
        data = {}
        data.index = view.getUint32(offset, true); offset += size_Uint32
        data.x = view.getFloat32(offset, true); offset += size_Float32
        data.y = view.getFloat32(offset, true); offset += size_Float32
        data.z = - view.getFloat32(offset, true); offset += size_Float32 # left->right handed system
        data

  getSize: ->
    size_Uint8 * 21 + size_Uint32 + (size_Uint32 + size_Float32 * 3) * @vert_data.length

#http://blog.goo.ne.jp/torisu_tetosuki/e/1e25fc196f2d7a7798f5cea87a942943
#char rigidbody_name[20]; // 諸データ：名称 // 頭
#WORD rigidbody_rel_bone_index; // 諸データ：関連ボーン番号 // 03 00 == 3 // 頭
#BYTE rigidbody_group_index; // 諸データ：グループ // 00
#WORD rigidbody_group_target; // 諸データ：グループ：対象 // 0xFFFFとの差 // 38 FE
#BYTE shape_type; // 形状：タイプ(0:球、1:箱、2:カプセル) // 00 // 球
#float shape_w; // 形状：半径(幅) // CD CC CC 3F // 1.6
#float shape_h; // 形状：高さ // CD CC CC 3D // 0.1
#float shape_d; // 形状：奥行 // CD CC CC 3D // 0.1
#float pos_pos[3]; // 位置：位置(x, y, z)
#float pos_rot[3]; // 位置：回転(rad(x), rad(y), rad(z))
#float rigidbody_weight; // 諸データ：質量 // 00 00 80 3F // 1.0
#float rigidbody_pos_dim; // 諸データ：移動減 // 00 00 00 00
#float rigidbody_rot_dim; // 諸データ：回転減 // 00 00 00 00
#float rigidbody_recoil; // 諸データ：反発力 // 00 00 00 00
#float rigidbody_friction; // 諸データ：摩擦力 // 00 00 00 00
#BYTE rigidbody_type; // 諸データ：タイプ(0:Bone追従、1:物理演算、2:物理演算(Bone位置合せ)) // 00 // Bone追従
class RigidBody
  constructor: (buffer, view, offset) ->
    @name = sjisArrayToString(new Uint8Array(buffer, offset, 20))
    offset += size_Uint8 * 20
    @rel_bone_index = view.getUint16(offset, true); offset += size_Uint16
    @group_index = view.getUint8(offset); offset += size_Uint8
    @group_target = view.getUint8(offset); offset += size_Uint8
    @shape_type = view.getUint8(offset, true); offset += size_Uint8
    @shape_w = view.getFloat32(offset, true); offset += size_Float32
    @shape_h = view.getFloat32(offset, true); offset += size_Float32
    @shape_d = view.getFloat32(offset, true); offset += size_Float32
    tmp = []
    tmp[0] = view.getFloat32(offset, true); offset += size_Float32
    tmp[1] = view.getFloat32(offset, true); offset += size_Float32
    tmp[2] = - view.getFloat32(offset, true); offset += size_Float32 # left->right handed system
    @pos = new Float32Array(tmp)
    tmp[0] = - view.getFloat32(offset, true); offset += size_Float32 # left->right handed system
    tmp[1] = - view.getFloat32(offset, true); offset += size_Float32 # left->right handed system
    tmp[2] = view.getFloat32(offset, true); offset += size_Float32
    @rot = new Float32Array(tmp)
    @weight = view.getFloat32(offset, true); offset += size_Float32
    @pos_dim = view.getFloat32(offset, true); offset += size_Float32
    @rot_dim = view.getFloat32(offset, true); offset += size_Float32
    @recoil = view.getFloat32(offset, true); offset += size_Float32
    @friction = view.getFloat32(offset, true); offset += size_Float32
    @type = view.getUint8(offset); offset += size_Uint8

RigidBody.size = size_Uint8 * 23 + size_Uint16 * 2 + size_Float32 * 14

#http://blog.goo.ne.jp/torisu_tetosuki/e/b96dc839798f251ac235138b992a4481
#char joint_name[20]; // 諸データ：名称 // 右髪1
#DWORD joint_rigidbody_a; // 諸データ：剛体A
#DWORD joint_rigidbody_b; // 諸データ：剛体B
#float joint_pos[3]; // 諸データ：位置(x, y, z) // 諸データ：位置合せでも設定可
#float joint_rot[3]; // 諸データ：回転(rad(x), rad(y), rad(z))
#float constrain_pos_1[3]; // 制限：移動1(x, y, z)
#float constrain_pos_2[3]; // 制限：移動2(x, y, z)
#float constrain_rot_1[3]; // 制限：回転1(rad(x), rad(y), rad(z))
#float constrain_rot_2[3]; // 制限：回転2(rad(x), rad(y), rad(z))
#float spring_pos[3]; // ばね：移動(x, y, z)
#float spring_rot[3]; // ばね：回転(rad(x), rad(y), rad(z))

class Joint
  constructor: (buffer, view, offset) ->
    @name = sjisArrayToString(new Uint8Array(buffer, offset, 20))
    offset += size_Uint8 * 20
    @rigidbody_a = view.getUint32(offset, true); offset += size_Uint32
    @rigidbody_b = view.getUint32(offset, true); offset += size_Uint32
    tmp = []
    tmp[0] = view.getFloat32(offset, true); offset += size_Float32
    tmp[1] = view.getFloat32(offset, true); offset += size_Float32
    tmp[2] = - view.getFloat32(offset, true); offset += size_Float32 # left->right handed system
    @pos = new Float32Array(tmp)
    tmp[0] = - view.getFloat32(offset, true); offset += size_Float32 # left->right handed system
    tmp[1] = - view.getFloat32(offset, true); offset += size_Float32 # left->right handed system
    tmp[2] = view.getFloat32(offset, true); offset += size_Float32
    @rot = new Float32Array(tmp)
    tmp[0] = view.getFloat32(offset, true); offset += size_Float32
    tmp[1] = view.getFloat32(offset, true); offset += size_Float32
    tmp[2] = - view.getFloat32(offset, true); offset += size_Float32 # left->right handed system
    @constrain_pos_1 = new Float32Array(tmp)
    tmp[0] = view.getFloat32(offset, true); offset += size_Float32
    tmp[1] = view.getFloat32(offset, true); offset += size_Float32
    tmp[2] = - view.getFloat32(offset, true); offset += size_Float32 # left->right handed system
    @constrain_pos_2 = new Float32Array(tmp)
    tmp[0] = - view.getFloat32(offset, true); offset += size_Float32 # left->right handed system
    tmp[1] = - view.getFloat32(offset, true); offset += size_Float32 # left->right handed system
    tmp[2] = view.getFloat32(offset, true); offset += size_Float32
    @constrain_rot_1 = new Float32Array(tmp)
    tmp[0] = - view.getFloat32(offset, true); offset += size_Float32 # left->right handed system
    tmp[1] = - view.getFloat32(offset, true); offset += size_Float32 # left->right handed system
    tmp[2] = view.getFloat32(offset, true); offset += size_Float32
    @constrain_rot_2 = new Float32Array(tmp)
    tmp[0] = view.getFloat32(offset, true); offset += size_Float32
    tmp[1] = view.getFloat32(offset, true); offset += size_Float32
    tmp[2] = - view.getFloat32(offset, true); offset += size_Float32 # left->right handed system
    @spring_pos = new Float32Array(tmp)
    tmp[0] = - view.getFloat32(offset, true); offset += size_Float32 # left->right handed system
    tmp[1] = - view.getFloat32(offset, true); offset += size_Float32 # left->right handed system
    tmp[2] = view.getFloat32(offset, true); offset += size_Float32
    @spring_rot = new Float32Array(tmp)

Joint.size = size_Int8 * 20 + size_Uint32 * 2 + size_Float32 * 24
