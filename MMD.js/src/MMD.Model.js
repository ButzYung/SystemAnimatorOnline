(function() {
  var Bone, IK, Joint, Material, Morph, RigidBody, Vertex, size_Float32, size_Int8, size_Uint16, size_Uint32, size_Uint8, slice;

  size_Int8 = Int8Array.BYTES_PER_ELEMENT;

  size_Uint8 = Uint8Array.BYTES_PER_ELEMENT;

  size_Uint16 = Uint16Array.BYTES_PER_ELEMENT;

  size_Uint32 = Uint32Array.BYTES_PER_ELEMENT;

  size_Float32 = Float32Array.BYTES_PER_ELEMENT;

  slice = Array.prototype.slice;

  this.MMD.Model = (function() {

    function Model(directory, filename) {
if (/^\w+\:/.test(directory)) directory = toFileProtocol(directory) 
      this.directory = directory;
      this.filename = filename;
      this.vertices = null;
      this.triangles = null;
      this.materials = null;
      this.bones = null;
      this.morphs = null;
      this.morph_order = null;
      this.bone_group_names = null;
      this.bone_table = null;
      this.english_flag = null;
      this.english_name = null;
      this.english_comment = null;
      this.english_bone_names = null;
      this.english_morph_names = null;
      this.english_bone_group_names = null;
      this.toon_file_names = null;
      this.rigid_bodies = null;
      this.joints = null;
    }

    Model.prototype.load = function(callback) {
      var xhr;
      var _this = this;
      xhr = new XMLHttpRequest;
      xhr.open('GET', this.directory + '/' + this.filename, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function() {
        console.time('parse');
        _this.parse(xhr.response);
        console.timeEnd('parse');
        return callback();
      };
      return xhr.send();
    };

    Model.prototype.parse = function(buffer) {
      var length, offset, view;
      length = buffer.byteLength;
      view = new DataView(buffer, 0);
      offset = 0;
      offset = this.checkHeader(buffer, view, offset);
      offset = this.getName(buffer, view, offset);
      offset = this.getVertices(buffer, view, offset);
      offset = this.getTriangles(buffer, view, offset);
      offset = this.getMaterials(buffer, view, offset);
      offset = this.getBones(buffer, view, offset);
      offset = this.getIKs(buffer, view, offset);
      offset = this.getMorphs(buffer, view, offset);
      offset = this.getMorphOrder(buffer, view, offset);
      offset = this.getBoneGroupNames(buffer, view, offset);
      offset = this.getBoneTable(buffer, view, offset);
      if (offset >= length) return;
      offset = this.getEnglishFlag(buffer, view, offset);
      if (this.english_flag) {
        offset = this.getEnglishName(buffer, view, offset);
        offset = this.getEnglishBoneNames(buffer, view, offset);
        offset = this.getEnglishMorphNames(buffer, view, offset);
        offset = this.getEnglishBoneGroupNames(buffer, view, offset);
      }
      if (offset >= length) return;
      offset = this.getToonFileNames(buffer, view, offset);
      if (offset >= length) return;
      offset = this.getRigidBodies(buffer, view, offset);
      return offset = this.getJoints(buffer, view, offset);
    };

    Model.prototype.checkHeader = function(buffer, view, offset) {
      if (view.getUint8(0) !== 'P'.charCodeAt(0) || view.getUint8(1) !== 'm'.charCodeAt(0) || view.getUint8(2) !== 'd'.charCodeAt(0) || view.getUint8(3) !== 0x00 || view.getUint8(4) !== 0x00 || view.getUint8(5) !== 0x80 || view.getUint8(6) !== 0x3F) {
        throw 'File is not PMD';
      }
      return offset += 7 * size_Uint8;
    };

    Model.prototype.getName = function(buffer, view, offset) {
      var block;
      block = new Uint8Array(buffer, offset, 20 + 256);
      this.name = sjisArrayToString(slice.call(block, 0, 20));
      this.comment = sjisArrayToString(slice.call(block, 20, 20 + 256));
      return offset += (20 + 256) * size_Uint8;
    };

    Model.prototype.getVertices = function(buffer, view, offset) {
      var i, length;
      length = view.getUint32(offset, true);
      offset += size_Uint32;
      this.vertices = (function() {
        var _results;
        _results = [];
        for (i = 0; 0 <= length ? i < length : i > length; 0 <= length ? i++ : i--) {
          _results.push(new Vertex(buffer, view, offset + i * Vertex.size));
        }
        return _results;
      })();
      return offset += length * Vertex.size;
    };

    Model.prototype.getTriangles = function(buffer, view, offset) {
      var i, length;
      length = view.getUint32(offset, true);
      offset += size_Uint32;
      this.triangles = new Uint16Array(length);
      for (i = 0; i < length; i += 3) {
        this.triangles[i + 1] = view.getUint16(offset + i * size_Uint16, true);
        this.triangles[i] = view.getUint16(offset + (i + 1) * size_Uint16, true);
        this.triangles[i + 2] = view.getUint16(offset + (i + 2) * size_Uint16, true);
      }
      return offset += length * size_Uint16;
    };

    Model.prototype.getMaterials = function(buffer, view, offset) {
      var i, length;
      length = view.getUint32(offset, true);
      offset += size_Uint32;
      this.materials = (function() {
        var _results;
        _results = [];
        for (i = 0; 0 <= length ? i < length : i > length; 0 <= length ? i++ : i--) {
          _results.push(new Material(buffer, view, offset + i * Material.size));
        }
        return _results;
      })();
      return offset += length * Material.size;
    };

    Model.prototype.getBones = function(buffer, view, offset) {
      var i, length;
      length = view.getUint16(offset, true);
      offset += size_Uint16;
      this.bones = (function() {
        var _results;
        _results = [];
        for (i = 0; 0 <= length ? i < length : i > length; 0 <= length ? i++ : i--) {
          _results.push(new Bone(buffer, view, offset + i * Bone.size));
        }
        return _results;
      })();
      return offset += length * Bone.size;
    };

    Model.prototype.getIKs = function(buffer, view, offset) {
      var i, ik, length;
      length = view.getUint16(offset, true);
      offset += size_Uint16;
      this.iks = (function() {
        var _results;
        _results = [];
        for (i = 0; 0 <= length ? i < length : i > length; 0 <= length ? i++ : i--) {
          ik = new IK(buffer, view, offset);
          offset += ik.getSize();
          _results.push(ik);
        }
        return _results;
      })();
      return offset;
    };

    Model.prototype.getMorphs = function(buffer, view, offset) {
      var i, length, morph;
      length = view.getUint16(offset, true);
      offset += size_Uint16;
      this.morphs = (function() {
        var _results;
        _results = [];
        for (i = 0; 0 <= length ? i < length : i > length; 0 <= length ? i++ : i--) {
          morph = new Morph(buffer, view, offset);
          offset += morph.getSize();
          _results.push(morph);
        }
        return _results;
      })();
      return offset;
    };

    Model.prototype.getMorphOrder = function(buffer, view, offset) {
      var i, length;
      length = view.getUint8(offset);
      offset += size_Uint8;
      this.morph_order = (function() {
        var _results;
        _results = [];
        for (i = 0; 0 <= length ? i < length : i > length; 0 <= length ? i++ : i--) {
          _results.push(view.getUint16(offset + i * size_Uint16, true));
        }
        return _results;
      })();
      return offset += length * size_Uint16;
    };

    Model.prototype.getBoneGroupNames = function(buffer, view, offset) {
      var block, i, length;
      length = view.getUint8(offset);
      offset += size_Uint8;
      block = new Uint8Array(buffer, offset, 50 * length);
      this.bone_group_names = (function() {
        var _results;
        _results = [];
        for (i = 0; 0 <= length ? i < length : i > length; 0 <= length ? i++ : i--) {
          _results.push(sjisArrayToString(slice.call(block, i * 50, (i + 1) * 50)));
        }
        return _results;
      })();
      return offset += length * 50 * size_Uint8;
    };

    Model.prototype.getBoneTable = function(buffer, view, offset) {
      var bone, i, length;
      length = view.getUint32(offset, true);
      offset += size_Uint32;
      this.bone_table = (function() {
        var _results;
        _results = [];
        for (i = 0; 0 <= length ? i < length : i > length; 0 <= length ? i++ : i--) {
          bone = {};
          bone.index = view.getUint16(offset, true);
          offset += size_Uint16;
          bone.group_index = view.getUint8(offset);
          offset += size_Uint8;
          _results.push(bone);
        }
        return _results;
      })();
var bones = this.bones
var bone_group_names = this.bone_group_names
var bone_table = this.bone_table
var bone_table_by_name = {}
for (var i = 0, len = bone_table.length; i < len; i++) {
  bone_table_by_name[bones[bone_table[i].index].name] = { index: bone_table[i].index, group_name: bone_group_names[bone_table[i].group_index-1] }
}
this.bone_table_by_name = bone_table_by_name
      return offset;
    };

    Model.prototype.getEnglishFlag = function(buffer, view, offset) {
      this.english_flag = view.getUint8(offset);
      return offset += size_Uint8;
    };

    Model.prototype.getEnglishName = function(buffer, view, offset) {
      var block;
      block = new Uint8Array(buffer, offset, 20 + 256);
      this.english_name = sjisArrayToString(slice.call(block, 0, 20));
      this.english_comment = sjisArrayToString(slice.call(block, 20, 20 + 256));
      return offset += (20 + 256) * size_Uint8;
    };

    Model.prototype.getEnglishBoneNames = function(buffer, view, offset) {
      var block, i, length;
      length = this.bones.length;
      block = new Uint8Array(buffer, offset, 20 * length);
      this.english_bone_names = (function() {
        var _results;
        _results = [];
        for (i = 0; 0 <= length ? i < length : i > length; 0 <= length ? i++ : i--) {
          _results.push(sjisArrayToString(slice.call(block, i * 20, (i + 1) * 20)));
        }
        return _results;
      })();
      return offset += length * 20 * size_Uint8;
    };

    Model.prototype.getEnglishMorphNames = function(buffer, view, offset) {
      var block, i, length;
      length = this.morphs.length - 1;
// fixed bug which occurs when an english model has no morphs (from https://github.com/edvakf/MMD.js/commit/f8a2fae1d1bcd782525389443ab1afcc1e150d80)
if (length < 0) {
  length = 0;
}
      block = new Uint8Array(buffer, offset, 20 * length);
      this.english_morph_names = (function() {
        var _results;
        _results = [];
        for (i = 0; 0 <= length ? i < length : i > length; 0 <= length ? i++ : i--) {
          _results.push(sjisArrayToString(slice.call(block, i * 20, (i + 1) * 20)));
        }
        return _results;
      })();
      return offset += length * 20 * size_Uint8;
    };

    Model.prototype.getEnglishBoneGroupNames = function(buffer, view, offset) {
      var block, i, length;
      length = this.bone_group_names.length;
      block = new Uint8Array(buffer, offset, 50 * length);
      this.english_bone_group_names = (function() {
        var _results;
        _results = [];
        for (i = 0; 0 <= length ? i < length : i > length; 0 <= length ? i++ : i--) {
          _results.push(sjisArrayToString(slice.call(block, i * 50, (i + 1) * 50)));
        }
        return _results;
      })();
      return offset += length * 50 * size_Uint8;
    };

    Model.prototype.getToonFileNames = function(buffer, view, offset) {
      var block, i;
      block = new Uint8Array(buffer, offset, 100 * 10);
      this.toon_file_names = (function() {
        var _results;
        _results = [];
        for (i = 0; i < 10; i++) {
          _results.push(sjisArrayToString(slice.call(block, i * 100, (i + 1) * 100)));
        }
        return _results;
      })();
      return offset += 100 * 10 * size_Uint8;
    };

    Model.prototype.getRigidBodies = function(buffer, view, offset) {
      var i, length;
      length = view.getUint32(offset, true);
      offset += size_Uint32;
      this.rigid_bodies = (function() {
        var _results;
        _results = [];
        for (i = 0; 0 <= length ? i < length : i > length; 0 <= length ? i++ : i--) {
          _results.push(new RigidBody(buffer, view, offset + i * RigidBody.size));
        }
        return _results;
      })();
      return offset += length * RigidBody.size;
    };

    Model.prototype.getJoints = function(buffer, view, offset) {
      var i, length;
      length = view.getUint32(offset, true);
      offset += size_Uint32;
      this.joints = (function() {
        var _results;
        _results = [];
        for (i = 0; 0 <= length ? i < length : i > length; 0 <= length ? i++ : i--) {
          _results.push(new Joint(buffer, view, offset + i * Joint.size));
        }
        return _results;
      })();
      return offset += length * Joint.size;
    };

    return Model;

  })();

  Vertex = (function() {

    function Vertex(buffer, view, offset) {
      this.x = view.getFloat32(offset, true);
      offset += size_Float32;
      this.y = view.getFloat32(offset, true);
      offset += size_Float32;
      this.z = -view.getFloat32(offset, true);
      offset += size_Float32;
      this.nx = view.getFloat32(offset, true);
      offset += size_Float32;
      this.ny = view.getFloat32(offset, true);
      offset += size_Float32;
      this.nz = -view.getFloat32(offset, true);
      offset += size_Float32;
      this.u = view.getFloat32(offset, true);
      offset += size_Float32;
      this.v = view.getFloat32(offset, true);
      offset += size_Float32;
      this.bone_num1 = view.getUint16(offset, true);
      offset += size_Uint16;
      this.bone_num2 = view.getUint16(offset, true);
      offset += size_Uint16;
      this.bone_weight = view.getUint8(offset);
      offset += size_Uint8;
      this.edge_flag = view.getUint8(offset);
      offset += size_Uint8;
    }

    return Vertex;

  })();

  Vertex.size = size_Float32 * 8 + size_Uint16 * 2 + size_Uint8 * 2;

  Material = (function() {

    function Material(buffer, view, offset) {
      var i, tmp;
      tmp = [];
      tmp[0] = view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[1] = view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[2] = view.getFloat32(offset, true);
      offset += size_Float32;
      this.diffuse = new Float32Array(tmp);
      this.alpha = view.getFloat32(offset, true);
      offset += size_Float32;
      this.shininess = view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[0] = view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[1] = view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[2] = view.getFloat32(offset, true);
      offset += size_Float32;
      this.specular = new Float32Array(tmp);
      tmp[0] = view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[1] = view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[2] = view.getFloat32(offset, true);
      offset += size_Float32;
      this.ambient = new Float32Array(tmp);
      this.toon_index = view.getInt8(offset);
      offset += size_Int8;
      this.edge_flag = view.getUint8(offset);
      offset += size_Uint8;
      this.face_vert_count = view.getUint32(offset, true);
      offset += size_Uint32;
      this.texture_file_name = sjisArrayToString((function() {
        var _results;
        _results = [];
        for (i = 0; i < 20; i++) {
          _results.push(view.getUint8(offset + size_Uint8 * i));
        }
        return _results;
      })());
    }

    return Material;

  })();

  Material.size = size_Float32 * 11 + size_Uint8 * 2 + size_Uint32 + size_Uint8 * 20;

  Bone = (function() {

    function Bone(buffer, view, offset) {
      var tmp;
      this.name = sjisArrayToString(new Uint8Array(buffer, offset, 20));
      offset += size_Uint8 * 20;
      this.parent_bone_index = view.getUint16(offset, true);
      offset += size_Uint16;
      this.tail_pos_bone_index = view.getUint16(offset, true);
      offset += size_Uint16;
      this.type = view.getUint8(offset);
      offset += size_Uint8;
      this.ik_parent_bone_index = view.getUint16(offset, true);
      offset += size_Uint16;
      tmp = [];
      tmp[0] = view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[1] = view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[2] = -view.getFloat32(offset, true);
      offset += size_Float32;
      this.head_pos = new Float32Array(tmp);
    }

    return Bone;

  })();

  Bone.size = size_Uint8 * 21 + size_Uint16 * 3 + size_Float32 * 3;

  IK = (function() {

    function IK(buffer, view, offset) {
      var chain_length, i;
      this.bone_index = view.getUint16(offset, true);
      offset += size_Uint16;
      this.target_bone_index = view.getUint16(offset, true);
      offset += size_Uint16;
      chain_length = view.getUint8(offset);
      offset += size_Uint8;
      this.iterations = view.getUint16(offset, true);
      offset += size_Uint16;
      this.control_weight = view.getFloat32(offset, true);
      offset += size_Float32;
      this.child_bones = (function() {
        var _results;
        _results = [];
        for (i = 0; 0 <= chain_length ? i < chain_length : i > chain_length; 0 <= chain_length ? i++ : i--) {
          _results.push(view.getUint16(offset + size_Uint16 * i, true));
        }
        return _results;
      })();
    }

    IK.prototype.getSize = function() {
      return size_Uint16 * 3 + size_Uint8 + size_Float32 + size_Uint16 * this.child_bones.length;
    };

    return IK;

  })();

  Morph = (function() {

    function Morph(buffer, view, offset) {
      var data, i, vert_count;
      this.name = sjisArrayToString(new Uint8Array(buffer, offset, 20));
      offset += size_Uint8 * 20;
      vert_count = view.getUint32(offset, true);
      offset += size_Uint32;
      this.type = view.getUint8(offset);
      offset += size_Uint8;
      this.vert_data = (function() {
        var _results;
        _results = [];
        for (i = 0; 0 <= vert_count ? i < vert_count : i > vert_count; 0 <= vert_count ? i++ : i--) {
          data = {};
          data.index = view.getUint32(offset, true);
          offset += size_Uint32;
          data.x = view.getFloat32(offset, true);
          offset += size_Float32;
          data.y = view.getFloat32(offset, true);
          offset += size_Float32;
          data.z = -view.getFloat32(offset, true);
          offset += size_Float32;
          _results.push(data);
        }
        return _results;
      })();
    }

    Morph.prototype.getSize = function() {
      return size_Uint8 * 21 + size_Uint32 + (size_Uint32 + size_Float32 * 3) * this.vert_data.length;
    };

    return Morph;

  })();

  RigidBody = (function() {

    function RigidBody(buffer, view, offset) {
      var tmp;
      this.name = sjisArrayToString(new Uint8Array(buffer, offset, 20));
      offset += size_Uint8 * 20;
      this.rel_bone_index = view.getUint16(offset, true);
      offset += size_Uint16;
      this.group_index = view.getUint8(offset);
      offset += size_Uint8;
      this.group_target = view.getUint8(offset);
      offset += size_Uint8;
      this.shape_type = view.getUint8(offset, true);
      offset += size_Uint8;
      this.shape_w = view.getFloat32(offset, true);
      offset += size_Float32;
      this.shape_h = view.getFloat32(offset, true);
      offset += size_Float32;
      this.shape_d = view.getFloat32(offset, true);
      offset += size_Float32;
      tmp = [];
      tmp[0] = view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[1] = view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[2] = -view.getFloat32(offset, true);
      offset += size_Float32;
      this.pos = new Float32Array(tmp);
      tmp[0] = -view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[1] = -view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[2] = view.getFloat32(offset, true);
      offset += size_Float32;
      this.rot = new Float32Array(tmp);
      this.weight = view.getFloat32(offset, true);
      offset += size_Float32;
      this.pos_dim = view.getFloat32(offset, true);
      offset += size_Float32;
      this.rot_dim = view.getFloat32(offset, true);
      offset += size_Float32;
      this.recoil = view.getFloat32(offset, true);
      offset += size_Float32;
      this.friction = view.getFloat32(offset, true);
      offset += size_Float32;
      this.type = view.getUint8(offset);
      offset += size_Uint8;
    }

    return RigidBody;

  })();

  RigidBody.size = size_Uint8 * 23 + size_Uint16 * 2 + size_Float32 * 14;

  Joint = (function() {

    function Joint(buffer, view, offset) {
      var tmp;
      this.name = sjisArrayToString(new Uint8Array(buffer, offset, 20));
      offset += size_Uint8 * 20;
      this.rigidbody_a = view.getUint32(offset, true);
      offset += size_Uint32;
      this.rigidbody_b = view.getUint32(offset, true);
      offset += size_Uint32;
      tmp = [];
      tmp[0] = view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[1] = view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[2] = -view.getFloat32(offset, true);
      offset += size_Float32;
      this.pos = new Float32Array(tmp);
      tmp[0] = -view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[1] = -view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[2] = view.getFloat32(offset, true);
      offset += size_Float32;
      this.rot = new Float32Array(tmp);
      tmp[0] = view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[1] = view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[2] = -view.getFloat32(offset, true);
      offset += size_Float32;
      this.constrain_pos_1 = new Float32Array(tmp);
      tmp[0] = view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[1] = view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[2] = -view.getFloat32(offset, true);
      offset += size_Float32;
      this.constrain_pos_2 = new Float32Array(tmp);
      tmp[0] = -view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[1] = -view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[2] = view.getFloat32(offset, true);
      offset += size_Float32;
      this.constrain_rot_1 = new Float32Array(tmp);
      tmp[0] = -view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[1] = -view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[2] = view.getFloat32(offset, true);
      offset += size_Float32;
      this.constrain_rot_2 = new Float32Array(tmp);
      tmp[0] = view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[1] = view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[2] = -view.getFloat32(offset, true);
      offset += size_Float32;
      this.spring_pos = new Float32Array(tmp);
      tmp[0] = -view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[1] = -view.getFloat32(offset, true);
      offset += size_Float32;
      tmp[2] = view.getFloat32(offset, true);
      offset += size_Float32;
      this.spring_rot = new Float32Array(tmp);
    }

    return Joint;

  })();

  Joint.size = size_Int8 * 20 + size_Uint32 * 2 + size_Float32 * 24;

}).call(this);
