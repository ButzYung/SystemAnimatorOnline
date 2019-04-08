(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; };

  this.MMD = (function() {

    function MMD(canvas, width, height) {
      this.width = width;
      this.height = height;
//      this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
this.gl = canvas.getContext('webgl', {preserveDrawingBuffer: true}) || canvas.getContext('experimental-webgl', {preserveDrawingBuffer: true});
      if (!this.gl) {
        alert('WebGL not supported in your browser');
        throw 'WebGL not supported';
      }
    }

    MMD.prototype.initShaders = function() {
      var attributes, fshader, line, name, src, type, uniforms, vshader, _i, _j, _k, _l, _len, _len2, _len3, _len4, _ref, _ref2, _ref3;
      vshader = this.gl.createShader(this.gl.VERTEX_SHADER);
      this.gl.shaderSource(vshader, MMD.VertexShaderSource);
      this.gl.compileShader(vshader);
      if (!this.gl.getShaderParameter(vshader, this.gl.COMPILE_STATUS)) {
        alert('Vertex shader compilation error');
        throw this.gl.getShaderInfoLog(vshader);
      }
      fshader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
      this.gl.shaderSource(fshader, MMD.FragmentShaderSource);
      this.gl.compileShader(fshader);
      if (!this.gl.getShaderParameter(fshader, this.gl.COMPILE_STATUS)) {
        alert('Fragment shader compilation error');
        throw this.gl.getShaderInfoLog(fshader);
      }
      this.program = this.gl.createProgram();
      this.gl.attachShader(this.program, vshader);
      this.gl.attachShader(this.program, fshader);
      this.gl.linkProgram(this.program);
      if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
        alert('Shader linking error');
        throw this.gl.getProgramInfoLog(this.program);
      }
      this.gl.useProgram(this.program);
      attributes = [];
this.attributes = attributes
      uniforms = [];
      _ref = [MMD.VertexShaderSource, MMD.FragmentShaderSource];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        src = _ref[_i];
        _ref2 = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '').split(';');
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          line = _ref2[_j];
          type = (_ref3 = line.match(/^\s*(uniform|attribute)\s+/)) != null ? _ref3[1] : void 0;
          if (!type) continue;
          name = line.match(/(\w+)(\[\d+\])?\s*$/)[1];
          if (type === 'attribute' && __indexOf.call(attributes, name) < 0) {
            attributes.push(name);
          }
          if (type === 'uniform' && __indexOf.call(uniforms, name) < 0) {
            uniforms.push(name);
          }
        }
      }
      for (_k = 0, _len3 = attributes.length; _k < _len3; _k++) {
        name = attributes[_k];
        this.program[name] = this.gl.getAttribLocation(this.program, name);
        this.gl.enableVertexAttribArray(this.program[name]);
      }
      for (_l = 0, _len4 = uniforms.length; _l < _len4; _l++) {
        name = uniforms[_l];
        this.program[name] = this.gl.getUniformLocation(this.program, name);
      }

// 2d shaders
var gl = this.gl;

var vs_2d = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs_2d, MMD_SA.vshader_2d);
gl.compileShader(vs_2d);
if (!gl.getShaderParameter(vs_2d, gl.COMPILE_STATUS)) {
  alert('Vertex shader compilation error');
  throw gl.getShaderInfoLog(vs_2d);
}

var fs_2d = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs_2d, MMD_SA.fshader_2d);
gl.compileShader(fs_2d);
if (!gl.getShaderParameter(fs_2d, gl.COMPILE_STATUS)) {
  alert('Fragment shader compilation error');
  throw gl.getShaderInfoLog(fs_2d);
}

this.program_2d = gl.createProgram();
gl.attachShader(this.program_2d, vs_2d);
gl.attachShader(this.program_2d, fs_2d);
gl.linkProgram(this.program_2d);
if (!gl.getProgramParameter(this.program_2d, gl.LINK_STATUS)) {
  alert('Shader linking error');
  throw gl.getProgramInfoLog(this.program_2d);
}

// look up where the vertex data needs to go.
this.positionLocation_2d = gl.getAttribLocation(this.program_2d, "a_position");
this.texCoordLocation_2d = gl.getAttribLocation(this.program_2d, "a_texCoord");

// lookup uniforms
this.resolutionLocation_2d = gl.getUniformLocation(this.program_2d, "u_resolution");
this.alphaUniform_2d = gl.getUniformLocation(this.program_2d, "uAlpha");
    };

    MMD.prototype.addModel = function(model) {
      this.model = model;
    };

    MMD.prototype.initBuffers = function() {
      this.vbuffers = {};
      this.initVertices();
      this.initIndices();
      this.initTextures();
    };

    MMD.prototype.initVertices = function() {
      var bone1, bone2, buffer, data, edge, i, length, model, morphVec, normals, positions1, positions2, rotations1, rotations2, uvs, vectors1, vectors2, vertex, weight, _i, _len, _ref;
      model = this.model;
      length = model.vertices.length;
      weight = new Float32Array(length);
      vectors1 = new Float32Array(3 * length);
      vectors2 = new Float32Array(3 * length);
      rotations1 = new Float32Array(4 * length);
      rotations2 = new Float32Array(4 * length);
      positions1 = new Float32Array(3 * length);
      positions2 = new Float32Array(3 * length);
      morphVec = new Float32Array(3 * length);
      normals = new Float32Array(3 * length);
      uvs = new Float32Array(2 * length);
      edge = new Float32Array(length);
      for (i = 0; 0 <= length ? i < length : i > length; 0 <= length ? i++ : i--) {
        vertex = model.vertices[i];
        bone1 = model.bones[vertex.bone_num1];
        bone2 = model.bones[vertex.bone_num2];
        weight[i] = vertex.bone_weight;
        vectors1[3 * i] = vertex.x - bone1.head_pos[0];
        vectors1[3 * i + 1] = vertex.y - bone1.head_pos[1];
        vectors1[3 * i + 2] = vertex.z - bone1.head_pos[2];
        vectors2[3 * i] = vertex.x - bone2.head_pos[0];
        vectors2[3 * i + 1] = vertex.y - bone2.head_pos[1];
        vectors2[3 * i + 2] = vertex.z - bone2.head_pos[2];
        positions1[3 * i] = bone1.head_pos[0];
        positions1[3 * i + 1] = bone1.head_pos[1];
        positions1[3 * i + 2] = bone1.head_pos[2];
        positions2[3 * i] = bone2.head_pos[0];
        positions2[3 * i + 1] = bone2.head_pos[1];
        positions2[3 * i + 2] = bone2.head_pos[2];
        rotations1[4 * i + 3] = 1;
        rotations2[4 * i + 3] = 1;
        normals[3 * i] = vertex.nx;
        normals[3 * i + 1] = vertex.ny;
        normals[3 * i + 2] = vertex.nz;
        uvs[2 * i] = vertex.u;
        uvs[2 * i + 1] = vertex.v;
        edge[i] = 1 - vertex.edge_flag;
      }
      model.rotations1 = rotations1;
      model.rotations2 = rotations2;
      model.positions1 = positions1;
      model.positions2 = positions2;
      model.morphVec = morphVec;
      _ref = [
        {
          attribute: 'aBoneWeight',
          array: weight,
          size: 1
        }, {
          attribute: 'aVectorFromBone1',
          array: vectors1,
          size: 3
        }, {
          attribute: 'aVectorFromBone2',
          array: vectors2,
          size: 3
        }, {
          attribute: 'aBone1Rotation',
          array: rotations1,
          size: 4
        }, {
          attribute: 'aBone2Rotation',
          array: rotations2,
          size: 4
        }, {
          attribute: 'aBone1Position',
          array: positions1,
          size: 3
        }, {
          attribute: 'aBone2Position',
          array: positions2,
          size: 3
        }, {
          attribute: 'aMultiPurposeVector',
          array: morphVec,
          size: 3
        }, {
          attribute: 'aVertexNormal',
          array: normals,
          size: 3
        }, {
          attribute: 'aTextureCoord',
          array: uvs,
          size: 2
        }, {
          attribute: 'aVertexEdge',
          array: edge,
          size: 1
        }
      ];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        data = _ref[_i];
        buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data.array, this.gl.STATIC_DRAW);
        this.vbuffers[data.attribute] = {
          size: data.size,
          buffer: buffer
        };
      }
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    };

    MMD.prototype.initIndices = function() {
      var indices;
      indices = this.model.triangles;
      this.ibuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibuffer);
      this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.STATIC_DRAW);
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    };

    MMD.prototype.initTextures = function() {
      var fileName, material, model, toonIndex, type, _i, _j, _len, _len2, _ref, _ref2;
      var _this = this;
      model = this.model;
      this.textureManager = new MMD.TextureManager(this);
      this.textureManager.onload = function() {
        return _this.redraw = true;
      };
      _ref = model.materials;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        material = _ref[_i];
        if (!material.textures) material.textures = {};
        toonIndex = material.toon_index;
        fileName = 'toon' + ('0' + (toonIndex + 1)).slice(-2) + '.bmp';
        if (toonIndex === -1 || !model.toon_file_names || fileName === model.toon_file_names[toonIndex]) {
          fileName = 'data/' + fileName;
        } else {
          fileName = model.directory + '/' + model.toon_file_names[toonIndex];
        }
        material.textures.toon = this.textureManager.get('toon', fileName);
        if (material.texture_file_name) {
          _ref2 = material.texture_file_name.split('*');
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            fileName = _ref2[_j];
            switch (fileName.slice(-4)) {
              case '.sph':
                type = 'sph';
                break;
              case '.spa':
                type = 'spa';
                break;
              case '.tga':
                type = 'regular';
                fileName += '.png';
                break;
              default:
                type = 'regular';
            }
            material.textures[type] = this.textureManager.get(type, model.directory + '/' + fileName);
          }
        }
      }
    };

    MMD.prototype.start = function() {
      var before, count, interval, step, t0;
      var _this = this;
//      this.gl.clearColor(1, 1, 1, 1);
      this.gl.clearDepth(1);
      this.gl.enable(this.gl.DEPTH_TEST);
      this.redraw = true;
      if (this.drawSelfShadow) this.shadowMap = new MMD.ShadowMap(this);
      this.motionManager = new MMD.MotionManager;
      count = 0;
      t0 = before = Date.now();
      interval = 1000 / this.fps;
      step = this.step = function() {
        var now;
        _this.move();
        _this.computeMatrices();
        _this.render();
        now = Date.now();
        if (++count % _this.fps === 0) {
          _this.realFps = _this.fps / (now - before) * 1000;
          before = now;
        }
        //return setTimeout(step, (t0 + count * interval) - now);
      };
      //step();
    };

    MMD.prototype.move = function() {
      if (!this.playing || this.textureManager.pendingCount > 0) return;

var para = (this.motionManager.para_SA.BPM || {})
var BPM = (para.BPM || 120)
var vo = Audio_BPM.vo
var playbackRate = (vo.BPM_mode) ? vo._sender.playbackRate : 120/BPM
//DEBUG_show(!!vo.BPM_mode+','+playbackRate)
var t = (window.performance) ? performance.now() : Date.now();
if (this.frame_time_ref) {
  var interval = 1000/30 / playbackRate
  if (para._playbackRate)
    interval /= para._playbackRate
  var time_diff = t - this.frame_time_ref
  t -= time_diff % interval
  var frame = parseInt(time_diff / interval)
//if (time_diff > 100) DEBUG_show(this.frame+':'+frame+','+time_diff,0,1)
  para._playbackRate_countdown -= time_diff
  if (para._playbackRate_countdown <= 0)
    para._playbackRate = null
//EV_sync_update.fps_count_func(frame)
  this.frame += frame - 1
}
else if (use_SVG_Clock || vo.BPM_mode) {
  var beat_frame = para.beat_frame
  if (beat_frame) {
    var current_frame = (this.frame+1)

    // use video time scale to calculate beats
    var beat_interval = 60/BPM
    var time_from_beat_to_beat = (current_frame - beat_frame)/30
//var beats0 = time_from_beat_to_beat / beat_interval
//    time_from_beat_to_beat /= playbackRate
    if (vo.BPM_mode) {
      var ao = vo.audio_obj
      time_from_beat_to_beat -= (ao.currentTime - ao.beat_reference) * playbackRate
    }

    var beat, beats
    beat = beats = time_from_beat_to_beat / beat_interval

    beat -= parseInt(beat)
    if (beat < 0)
      beat++
//beat+=0.5;if(beat>1)beat--
//DEBUG_show(beat,0,1)
    if (beat < 0.5)
      beat = -beat
    else
      beat = 1 - beat

    beats = Math.round(beats + beat)
    if ((beats % 2) && (!vo.BPM_mode || para.match_even_beats_only)) {
      if (beat < 0) {
        beat++
        beats++
      }
      else {
        beat--
        beats--
      }
    }
    var beats_info = '/' + ((beats % 2)?'odd':'even')

    var sec = beat * beat_interval

    if (!vo.BPM_mode) {
      // adjust to real-time scale
      sec /= playbackRate

      var msec = new Date().getMilliseconds()/1000
      sec += msec

      if (sec > 0.5)
        sec -= 1
      else if (sec < -0.5)
        sec += 1

      // revert back to video time scale
      sec *= playbackRate

      beat = sec / beat_interval
    }

    // adjust the video time scale to match the current playbackRate
    sec /= playbackRate

//DEBUG_show(beats+'/'+msec,0,1)
    if (Math.abs(sec) > 0.05) {
      var mod = (Math.abs(beat) > 0.5) ? 2 : 1
      para._playbackRate = 1 + sec/mod
      para._playbackRate_countdown = 1000*mod
//DEBUG_show(para._playbackRate,0,1)
var info = Math.abs(parseInt(beat * 100) / 100) + 'beat'
DEBUG_show('BPM sync(' + ((sec>0)?'+':'-') + info + ')', 2)
    }
    else
      DEBUG_show('(BPM in sync)', 2)
  }
}
this.frame_time_ref = t

      if (++this.frame > this.motionManager.lastFrame) {
this.rewind();
//        this.pause();
//        return;
      }
else if (this.frame > this.motionManager.lastFrame_) { this.rewind() }
      this.moveCamera();
      this.moveLight();
      this.moveModel();
    };

    MMD.prototype.moveCamera = function() {
      var camera;
      camera = this.motionManager.getCameraFrame(this.frame);
      if (camera && !this.ignoreCameraMotion) {
        this.distance = camera.distance;
        this.rotx = camera.rotation[0];
        this.roty = camera.rotation[1];
        this.center = vec3.create(camera.location);
        this.fovy = camera.view_angle;
      }
    };

    MMD.prototype.moveLight = function() {
      var light;
      light = this.motionManager.getLightFrame(this.frame);
      if (light) {
        this.lightDirection = light.location;
        this.lightColor = light.color;
      }
    };

    MMD.prototype.moveModel = function() {
      var bones, model, morphs, _ref;
      model = this.model;
      _ref = this.motionManager.getModelFrame(model, this.frame), morphs = _ref.morphs, bones = _ref.bones;
      this.moveMorphs(model, morphs);
      this.moveBones(model, bones);
    };

    MMD.prototype.moveMorphs = function(model, morphs) {
      var b, base, i, j, morph, vert, weight, _i, _j, _len, _len2, _len3, _ref, _ref2, _ref3;
      if (!morphs) return;
      if (model.morphs.length === 0) return;
      _ref = model.morphs;
      for (j = 0, _len = _ref.length; j < _len; j++) {
        morph = _ref[j];
        if (j === 0) {
          base = morph;
          continue;
        }
        if (!(morph.name in morphs)) continue;
        weight = morphs[morph.name];
        _ref2 = morph.vert_data;
        for (_i = 0, _len2 = _ref2.length; _i < _len2; _i++) {
          vert = _ref2[_i];
          b = base.vert_data[vert.index];
          i = b.index;
          model.morphVec[3 * i] += vert.x * weight;
          model.morphVec[3 * i + 1] += vert.y * weight;
          model.morphVec[3 * i + 2] += vert.z * weight;
        }
      }
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbuffers.aMultiPurposeVector.buffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, model.morphVec, this.gl.STATIC_DRAW);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
      _ref3 = base.vert_data;
      for (_j = 0, _len3 = _ref3.length; _j < _len3; _j++) {
        b = _ref3[_j];
        i = b.index;
        model.morphVec[3 * i] = 0;
        model.morphVec[3 * i + 1] = 0;
        model.morphVec[3 * i + 2] = 0;
      }
    };

    MMD.prototype.moveBones = function(model, bones) {
      var bone, boneMotions, constrainedBones, getBoneMotion, i, individualBoneMotions, length, motion1, motion2, originalBonePositions, parentBones, pos1, pos2, positions1, positions2, resolveIKs, rot1, rot2, rotations1, rotations2, vertex, _len, _ref, _ref2, _ref3;
      if (!bones) return;
      individualBoneMotions = [];
      boneMotions = [];
      originalBonePositions = [];
      parentBones = [];
      constrainedBones = [];
var constrainedBones_list = []
      _ref = model.bones;
      for (i = 0, _len = _ref.length; i < _len; i++) {
        bone = _ref[i];
        individualBoneMotions[i] = (_ref2 = bones[bone.name]) != null ? _ref2 : {
          rotation: quat4.create([0, 0, 0, 1]),
          location: vec3.create()
        };
        boneMotions[i] = {
          r: quat4.create(),
          p: vec3.create(),
          tainted: true
        };
        originalBonePositions[i] = bone.head_pos;
        parentBones[i] = bone.parent_bone_index;
        if (/\u3072\u3056$/.test(bone.name))/*(bone.name.indexOf('\u3072\u3056') > 0)*/ { constrainedBones[i] = true; constrainedBones_list.push(i); }
      }
      getBoneMotion = function(boneIndex) {
        var m, motion, p, parentIndex, parentMotion, r, t;
        motion = boneMotions[boneIndex];
        if (motion && !motion.tainted) return motion;
        m = individualBoneMotions[boneIndex];
        r = quat4.set(m.rotation, motion.r);
        t = m.location;
        p = vec3.set(originalBonePositions[boneIndex], motion.p);
        if (parentBones[boneIndex] === 0xFFFF) {
          return boneMotions[boneIndex] = {
            p: vec3.add(p, t),
            r: r,
            tainted: false
          };
        } else {
          parentIndex = parentBones[boneIndex];
          parentMotion = getBoneMotion(parentIndex);
          r = quat4.multiply(parentMotion.r, r, r);
          p = vec3.subtract(p, originalBonePositions[parentIndex]);
          vec3.add(p, t);
          vec3.rotateByQuat4(p, parentMotion.r);
          vec3.add(p, parentMotion.p);
          return boneMotions[boneIndex] = {
            p: p,
            r: r,
            tainted: false
          };
        }
      };
/*
var checkNaN = function (ii, extra_info, pass_flag) {
if (self._NaN_found) return
var dummy
if (ii >= 0) {
  dummy = quat4.toEuler(boneMotions[ii].r)
  dummy.push(boneMotions[ii].p[0], boneMotions[ii].p[1], boneMotions[ii].p[2])
}
else
  dummy = [ii[0], ii[1], ii[2], ii[3]]
for (var _di_=0,len=dummy.length;_di_<len;_di_++) {
  if (isNaN(dummy[_di_])) {
    if (!pass_flag)
      self._NaN_found = true
    DEBUG_show([ii,dummy.join("/"),(ii>=0)?model.bones[ii].name:"_",(extra_info)?extra_info:"_"],0,1)
    break
  }
}
}
*/
      resolveIKs = function() {
        var axis, axisLen, boneIndex, bonePos, c, i, ik, ikbonePos, ikboneVec, ikboneVecLen, j, maxangle, minLength, motion, n, parentRotation, q, r, sinTheta, targetIndex, targetPos, targetVec, targetVecLen, theta, tmpQ, tmpR, _i, _len2, _ref3, _results;
        targetVec = vec3.create();
        ikboneVec = vec3.create();
        axis = vec3.create();
        tmpQ = quat4.create();
        tmpR = quat4.create();
        _ref3 = model.iks;
        _results = [];
        for (_i = 0, _len2 = _ref3.length; _i < _len2; _i++) {
          ik = _ref3[_i];
//          maxangle = ik.control_weight * 4;
// using a smaller maxangle may reduce some strange rotations in legs for some models
maxangle = ik.control_weight//*1.5

          ikbonePos = getBoneMotion(ik.bone_index).p;
          targetIndex = ik.target_bone_index;
          minLength = 0.1 * vec3.length(vec3.subtract(originalBonePositions[targetIndex], originalBonePositions[parentBones[targetIndex]], axis));
          _results.push((function() {
            var _ref4, _results2;
            _results2 = [];
            for (n = 0, _ref4 = ik.iterations; 0 <= _ref4 ? n < _ref4 : n > _ref4; 0 <= _ref4 ? n++ : n--) {
              targetPos = getBoneMotion(targetIndex).p;
              if (minLength > vec3.length(vec3.subtract(targetPos, ikbonePos, axis))) {
                break;
              }
              _results2.push((function() {
                var _len3, _ref5, _results3;
                _ref5 = ik.child_bones;
                _results3 = [];
                for (i = 0, _len3 = _ref5.length; i < _len3; i++) {
                  boneIndex = _ref5[i];
//if (/^\u53f3/.test(model.bones[boneIndex].name) && (MMD_SA.MMD.frame==5609)) DEBUG_show(model.bones[boneIndex].name+','+boneIndex+','+targetIndex+'/'+targetPos[0]+','+targetPos[1]+','+targetPos[2],0,1)
                  motion = getBoneMotion(boneIndex);
                  bonePos = motion.p;
                  if (i > 0) targetPos = getBoneMotion(targetIndex).p;
                  targetVec = vec3.subtract(targetPos, bonePos, targetVec);
                  targetVecLen = vec3.length(targetVec);
                  if (targetVecLen < minLength) continue;
                  ikboneVec = vec3.subtract(ikbonePos, bonePos, ikboneVec);
                  ikboneVecLen = vec3.length(ikboneVec);
                  if (ikboneVecLen < minLength) continue;
                  axis = vec3.cross(targetVec, ikboneVec, axis);
//if (/\u53f3\u8DB3$/.test(model.bones[boneIndex].name) && (MMD_SA.MMD.frame>=5609)) {if (((MMD_SA.MMD.frame==5609) && (axis[0]>0)) || (MMD_SA.MMD.frame>=5609)) {axis[0]=-axis[0];}}
                  axisLen = vec3.length(axis);
                  sinTheta = axisLen / ikboneVecLen / targetVecLen;
                  if (sinTheta < 0.001) continue;
// sinTheta may be greater than 1 in some rare cases (due to round-up issues?), which will turn theta into an invalid number.
if (sinTheta > 1) sinTheta = 1;
                  theta = Math.asin(sinTheta);
                  if (vec3.dot(targetVec, ikboneVec) < 0) {
                    theta = 3.141592653589793 - theta;
                  }
                  if (theta > maxangle) theta = maxangle;

                  q = quat4.set(vec3.scale(axis, Math.sin(theta / 2) / axisLen), tmpQ);
                  q[3] = Math.cos(theta / 2);
//if ((/\u53f3\u8DB3$/.test(model.bones[boneIndex].name) || boneIndex==targetIndex) && (MMD_SA.MMD.frame>=5608&&MMD_SA.MMD.frame<=5610)) {var _yzx=quat4.toEuler(q); DEBUG_show(MMD_SA.MMD.frame+':'+model.bones[boneIndex].name+','+boneIndex+','+n+','+i+'/'+targetPos[0]+','+targetPos[1]+','+targetPos[2],0,1)}
                  parentRotation = getBoneMotion(parentBones[boneIndex]).r;
                  r = quat4.inverse(parentRotation, tmpR);
                  r = quat4.multiply(quat4.multiply(r, q), motion.r);
                  if (constrainedBones[boneIndex]) {
// to avoid c(w)>1, which turns r into an invalid quat4 with the following operations and makes body parts disappeared
quat4.normalize(r);
                    c = r[3];
                    r = quat4.set([Math.sqrt(1 - c * c), 0, 0, c], r);
// make sure x is positive to avoid "broken" knee :P
var yzx = quat4.toEuler(r)
if (yzx[2] < 0) {
  quat4.inverse(r)
//DEBUG_show(MMD_SA.MMD.frame+'/'+n+'/'+yzx[2],0,1)
}
                    quat4.inverse(boneMotions[boneIndex].r, q);
                    quat4.multiply(r, q, q);
                    q = quat4.multiply(parentRotation, q, q);
//if (!/\u5de6/.test(model.bones[boneIndex].name) && (MMD_SA.MMD.frame>=5609&&MMD_SA.MMD.frame<=5610)) {var _yzx=quat4.toEuler(q); DEBUG_show(MMD_SA.MMD.frame+':'+model.bones[boneIndex].name+','+model.bones[targetIndex].name+','+n+','+i+'/'+yzx[2]/*+'/'+axis[0]+','+axis[1]+','+axis[2]*/+'/'+_yzx[0]+','+_yzx[1]+','+_yzx[2],0,1)}
                  }
//else if (/\u53f3/.test(model.bones[boneIndex].name) && (MMD_SA.MMD.frame>=5609&&MMD_SA.MMD.frame<=5610)) {var _yzx=quat4.toEuler(r); DEBUG_show(model.bones[boneIndex].name+','+n+','+i+'/'+_yzx[0]+','+_yzx[1]+','+_yzx[2],0,1)}
//checkNaN(r,"D")

// to further fix some extreme conditions involving "broken" knees and legs
var child_index = model.bones[boneIndex].tail_pos_bone_index
if (constrainedBones[child_index]) {// && /\u53f3/.test(model.bones[boneIndex].name)) {
  var yzx = quat4.toEuler(r)
//if (yzx[0] > Math.PI/2) DEBUG_show(yzx[0],0,1)
  var modified
  var x = yzx[2]
  if ((x > Math.PI/2) || ((x > Math.PI/4) && (quat4.toEuler(individualBoneMotions[child_index].rotation)[2] > Math.PI/2))) {
//DEBUG_show(MMD_SA.MMD.frame+','+x,0,1)
    modified = true
    x = -x
    r = quat4.fromEuler(yzx[0], yzx[1], x)
  }
/*
  var y = yzx[0]
  var y_abs = Math.abs(y)
  if (y_abs > Math.PI/2) {
    modified = true
    var sign = (y > 0) ? 1 : -1
    y_abs -= (y_abs - Math.PI/2)*2
//DEBUG_show(Math.abs(y)+','+y_abs,0,1)
    r = quat4.fromEuler(0, yzx[1], x)
//    r = quat4.fromEuler(y_abs*sign, yzx[1], x)
  }
*/
  if (modified) {
    quat4.inverse(boneMotions[boneIndex].r, q);
    quat4.multiply(r, q, q);
    q = quat4.multiply(parentRotation, q, q);
  }
}

/*
var a_yzx
if (/\u8DB3\u9996$/.test(model.bones[boneIndex].name) && /\u53f3/.test(model.bones[boneIndex].name)) {
  a_yzx = quat4.toEuler(r)
}
*/
                  quat4.normalize(r, individualBoneMotions[boneIndex].rotation);
                  quat4.multiply(q, motion.r, motion.r);

// to prevent strange rotation for ankles
if (/\u8DB3\u9996$/.test(model.bones[boneIndex].name)) {// && /\u53f3/.test(model.bones[boneIndex].name)) {
  // get the quat4 relative to the parent bone
  var parentRotation_inversed = quat4.create()
  var r_relative = quat4.create()
  quat4.inverse(parentRotation, parentRotation_inversed)
  quat4.multiply(motion.r, parentRotation_inversed, r_relative)
  // main
  var _yzx = quat4.toEuler(r_relative)
//DEBUG_show((_yzx[0]-a_yzx[0])+','+(_yzx[1]-a_yzx[1])+','+(_yzx[2]-a_yzx[2]))
//r_relative = quat4.fromEuler(0, 0, -45)
//var r_yzx = quat4.toEuler(r)
//quat4.normalize(quat4.fromEuler(r_yzx[0]+(0-_yzx[0]), r_yzx[1]+(0-_yzx[1]), r_yzx[2]+(-45-_yzx[2])), individualBoneMotions[boneIndex].rotation);
//quat4.multiply(parentRotation, r_relative, motion.r)
  var _y = _yzx[0]
  if (Math.abs(_y) > Math.PI/4) {
//DEBUG_show(_y)
    _y = Math.PI/4 * ((_y > 0) ? 1 : -1)
    r_relative = quat4.fromEuler(_y, _yzx[1], _yzx[2])
    var r_yzx = quat4.toEuler(r)
    quat4.normalize(quat4.fromEuler(r_yzx[0]+(_y-_yzx[0]), r_yzx[1], r_yzx[2]), individualBoneMotions[boneIndex].rotation);
    quat4.multiply(parentRotation, r_relative, motion.r)
  }
//  DEBUG_show([parseInt(_yzx[0]*180/Math.PI),parseInt(_yzx[1]*180/Math.PI),parseInt(_yzx[2]*180/Math.PI)])
}

                  for (j = 0; 0 <= i ? j < i : j > i; 0 <= i ? j++ : j--) {
                    boneMotions[ik.child_bones[j]].tainted = true;
                  }
                  _results3.push(boneMotions[ik.target_bone_index].tainted = true);
                }
                return _results3;
              })());
            }
            return _results2;
          })());
        }
        return _results;
      };

      resolveIKs();
      for (i = 0, _ref3 = model.bones.length; 0 <= _ref3 ? i < _ref3 : i > _ref3; 0 <= _ref3 ? i++ : i--) {
        getBoneMotion(i);
      }

      rotations1 = model.rotations1;
      rotations2 = model.rotations2;
      positions1 = model.positions1;
      positions2 = model.positions2;
      length = model.vertices.length;
      for (i = 0; 0 <= length ? i < length : i > length; 0 <= length ? i++ : i--) {
        vertex = model.vertices[i];
        motion1 = boneMotions[vertex.bone_num1];
        motion2 = boneMotions[vertex.bone_num2];
        rot1 = motion1.r;
        pos1 = motion1.p;
        rot2 = motion2.r;
        pos2 = motion2.p;
        rotations1[i * 4] = rot1[0];
        rotations1[i * 4 + 1] = rot1[1];
        rotations1[i * 4 + 2] = rot1[2];
        rotations1[i * 4 + 3] = rot1[3];
        rotations2[i * 4] = rot2[0];
        rotations2[i * 4 + 1] = rot2[1];
        rotations2[i * 4 + 2] = rot2[2];
        rotations2[i * 4 + 3] = rot2[3];
        positions1[i * 3] = pos1[0];
        positions1[i * 3 + 1] = pos1[1];
        positions1[i * 3 + 2] = pos1[2];
        positions2[i * 3] = pos2[0];
        positions2[i * 3 + 1] = pos2[1];
        positions2[i * 3 + 2] = pos2[2];
      }
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbuffers.aBone1Rotation.buffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, rotations1, this.gl.STATIC_DRAW);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbuffers.aBone2Rotation.buffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, rotations2, this.gl.STATIC_DRAW);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbuffers.aBone1Position.buffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, positions1, this.gl.STATIC_DRAW);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbuffers.aBone2Position.buffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, positions2, this.gl.STATIC_DRAW);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    };

    MMD.prototype.computeMatrices = function() {
      var up;
      this.modelMatrix = mat4.createIdentity();

var rx = this.rotx, ry = this.roty, d = this.distance, center = this.center.slice(0);
//DEBUG_show(d)
if (self.HeadTrackerAR && HeadTrackerAR.running) {
  ry += (HeadTrackerAR._cx-50)*MMD_SA_options.AR_camera_mod / 180 * Math.PI
  rx += (HeadTrackerAR._cy-50)*MMD_SA_options.AR_camera_mod / 180 * Math.PI
  var z = 1
  if (HeadTrackerAR._cz > 1) {
    z = HeadTrackerAR._cz * HeadTrackerAR._cz_mod
    d /= z
    var z_extra = (z-1) * 7.5 - MMD_SA.center_view[1];
    if (z_extra < 0)
      z_extra = 0
    center[1] += z_extra
  }
//DEBUG_show([(HeadTrackerAR._cx-50),(HeadTrackerAR._cy-50),z])
}
var SA_center = MMD_SA.center_view;

      this.cameraPosition = vec3.create([0, 0, d+SA_center[2]]);
      vec3.rotateX(this.cameraPosition, rx);
      vec3.rotateY(this.cameraPosition, ry);
      vec3.moveBy(this.cameraPosition, center);
      up = [0, 1, 0];
      vec3.rotateX(up, rx);
      vec3.rotateY(up, ry);
vec3.add(center, [SA_center[0],SA_center[1],0])
      this.viewMatrix = mat4.lookAt(this.cameraPosition, center, up);
      this.mvMatrix = mat4.createMultiply(this.viewMatrix, this.modelMatrix);
      this.pMatrix = mat4.perspective(this.fovy, this.width / this.height, 0.1, 1000.0);
      this.nMatrix = mat4.inverseTranspose(this.mvMatrix, mat4.create());
    };

    MMD.prototype.render = function() {
      var attribute, material, offset, vb, _i, _j, _len, _len2, _ref, _ref2, _ref3;
      if (!this.redraw && !this.playing) return;
      this.redraw = false;
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
      this.gl.viewport(0, 0, this.width, this.height);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
      _ref = this.vbuffers;
      for (attribute in _ref) {
        vb = _ref[attribute];
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vb.buffer);
        this.gl.vertexAttribPointer(this.program[attribute], vb.size, this.gl.FLOAT, false, 0, 0);
      }
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibuffer);
      this.setSelfShadowTexture();
      this.setUniforms();
      this.gl.enable(this.gl.CULL_FACE);
      this.gl.enable(this.gl.BLEND);
      this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.SRC_ALPHA, this.gl.DST_ALPHA);
      offset = 0;
      _ref2 = this.model.materials;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        material = _ref2[_i];
        this.renderMaterial(material, offset);
        offset += material.face_vert_count;
      }
      this.gl.disable(this.gl.BLEND);
      offset = 0;
      _ref3 = this.model.materials;
      for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
        material = _ref3[_j];
        this.renderEdge(material, offset);
        offset += material.face_vert_count;
      }
      this.gl.disable(this.gl.CULL_FACE);
      this.renderAxes();
      this.gl.flush();


//return
if (!MMD_SA.fading)
  return

var frame = this.frame - (this.motionManager.firstFrame_ || 0)
if (frame >= 30) {
  return
}

var gl = this.gl;

var attributes = this.attributes;
for (var _k = 0, _len3 = attributes.length; _k < _len3; _k++) {
  var name = attributes[_k];
  gl.disableVertexAttribArray(this.program[name]);
}

gl.disable(gl.DEPTH_TEST);
gl.enable(gl.BLEND);
gl.useProgram(this.program_2d);


// provide texture coordinates for the rectangle.
  var texCoordBuffer = this.texCoordBuffer_2d;
  if (texCoordBuffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  }
  else {
    texCoordBuffer = this.texCoordBuffer_2d = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0]), gl.STATIC_DRAW);
  }
  gl.enableVertexAttribArray(this.texCoordLocation_2d);
  gl.vertexAttribPointer(this.texCoordLocation_2d, 2, gl.FLOAT, false, 0, 0);

  var w = SL.width;
  var h = SL.height;
//w=MMD_SA.fadeout_dummy.width; h=MMD_SA.fadeout_dummy.height;

  // Create a texture.
  gl.activeTexture(gl.TEXTURE0);

  var texture = this.texture_2d;
  if (texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
  }
  else {
    texture = this.texture_2d = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  }
  // Upload the image into the texture.
  if (!MMD_SA.fadeout_texture_uploaded) {
    MMD_SA.fadeout_texture_uploaded = true
//DEBUG_show("(uploading texture " + w + "x" + h + ")",0,1)
//gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0,0,w,h,0);
//    try {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, MMD_SA.fadeout_canvas);
//    } catch (err) { DEBUG_show("(texture error:" + err.description + ")",0,1) }
  }

  gl.uniform1f(this.alphaUniform_2d, (29-frame)/30);

  // set the resolution
  gl.uniform2f(this.resolutionLocation_2d, SL.width, SL.height);

  // Create a buffer for the position of the rectangle corners.
  var buffer = this.buffer_2d;
  if (buffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  }
  else {
    buffer = this.buffer_2d = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    // Set a rectangle the same size as the image.
    var x1 = 0;
    var x2 = 0 + w;
    var y1 = 0;
    var y2 = 0 + h;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2]), gl.STATIC_DRAW);
  }
  gl.enableVertexAttribArray(this.positionLocation_2d);
  gl.vertexAttribPointer(this.positionLocation_2d, 2, gl.FLOAT, false, 0, 0);

  // Draw the rectangle.
  gl.drawArrays(gl.TRIANGLES, 0, 6);


gl.disableVertexAttribArray(this.texCoordLocation_2d);
gl.disableVertexAttribArray(this.positionLocation_2d);

gl.enable(gl.DEPTH_TEST);
gl.disable(gl.BLEND);
gl.useProgram(this.program);
for (var _k = 0, _len3 = attributes.length; _k < _len3; _k++) {
  var name = attributes[_k];
  gl.enableVertexAttribArray(this.program[name]);
}
    };

    MMD.prototype.setSelfShadowTexture = function() {
      var material, model, offset, _i, _len, _ref, _ref2;
      if (!this.drawSelfShadow) return;
      model = this.model;
      this.shadowMap.computeMatrices();
      this.shadowMap.beforeRender();
      offset = 0;
      _ref = model.materials;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        material = _ref[_i];
        if ((0.979 < (_ref2 = material.alpha) && _ref2 < 0.981)) continue;
        this.gl.drawElements(this.gl.TRIANGLES, material.face_vert_count, this.gl.UNSIGNED_SHORT, offset * 2);
        offset += material.face_vert_count;
      }
      this.shadowMap.afterRender();
      this.gl.activeTexture(this.gl.TEXTURE3);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.shadowMap.getTexture());
      this.gl.uniform1i(this.program.uShadowMap, 3);
      this.gl.uniformMatrix4fv(this.program.uLightMatrix, false, this.shadowMap.getLightMatrix());
      this.gl.uniform1i(this.program.uSelfShadow, true);
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
      this.gl.viewport(0, 0, this.width, this.height);
    };

    MMD.prototype.setUniforms = function() {
      var lightDirection;
      this.gl.uniform1f(this.program.uEdgeThickness, this.edgeThickness);
      this.gl.uniform3fv(this.program.uEdgeColor, this.edgeColor);
      this.gl.uniformMatrix4fv(this.program.uMVMatrix, false, this.mvMatrix);
      this.gl.uniformMatrix4fv(this.program.uPMatrix, false, this.pMatrix);
      this.gl.uniformMatrix4fv(this.program.uNMatrix, false, this.nMatrix);
      lightDirection = vec3.createNormalize(this.lightDirection);
      mat4.multiplyVec3(this.nMatrix, lightDirection);
      this.gl.uniform3fv(this.program.uLightDirection, lightDirection);
      this.gl.uniform3fv(this.program.uLightColor, this.lightColor);
    };

    MMD.prototype.renderMaterial = function(material, offset) {
      var textures;
      this.gl.uniform3fv(this.program.uAmbientColor, material.ambient);
      this.gl.uniform3fv(this.program.uSpecularColor, material.specular);
      this.gl.uniform3fv(this.program.uDiffuseColor, material.diffuse);
      this.gl.uniform1f(this.program.uAlpha, material.alpha);
      this.gl.uniform1f(this.program.uShininess, material.shininess);
      this.gl.uniform1i(this.program.uEdge, false);
      textures = material.textures;
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, textures.toon);
      this.gl.uniform1i(this.program.uToon, 0);
      if (textures.regular) {
        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, textures.regular);
        this.gl.uniform1i(this.program.uTexture, 1);
      }
      this.gl.uniform1i(this.program.uUseTexture, !!textures.regular);
      if (textures.sph || textures.spa) {
        this.gl.activeTexture(this.gl.TEXTURE2);
        this.gl.bindTexture(this.gl.TEXTURE_2D, textures.sph || textures.spa);
        this.gl.uniform1i(this.program.uSphereMap, 2);
        this.gl.uniform1i(this.program.uUseSphereMap, true);
        this.gl.uniform1i(this.program.uIsSphereMapAdditive, !!textures.spa);
      } else {
        this.gl.uniform1i(this.program.uUseSphereMap, false);
      }
      this.gl.cullFace(this.gl.BACK);
      this.gl.drawElements(this.gl.TRIANGLES, material.face_vert_count, this.gl.UNSIGNED_SHORT, offset * 2);
    };

    MMD.prototype.renderEdge = function(material, offset) {
      if (!this.drawEdge || !material.edge_flag) return;
      this.gl.uniform1i(this.program.uEdge, true);
      this.gl.cullFace(this.gl.FRONT);
      this.gl.drawElements(this.gl.TRIANGLES, material.face_vert_count, this.gl.UNSIGNED_SHORT, offset * 2);
      this.gl.cullFace(this.gl.BACK);
      return this.gl.uniform1i(this.program.uEdge, false);
    };

    MMD.prototype.renderAxes = function() {
      var axis, axisBuffer, color, i;
      axisBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, axisBuffer);
      this.gl.vertexAttribPointer(this.program.aMultiPurposeVector, 3, this.gl.FLOAT, false, 0, 0);
      if (this.drawAxes) {
        this.gl.uniform1i(this.program.uAxis, true);
        for (i = 0; i < 3; i++) {
          axis = [0, 0, 0, 0, 0, 0];
          axis[i] = 65;
          color = [0, 0, 0];
          color[i] = 1;
          this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(axis), this.gl.STATIC_DRAW);
          this.gl.uniform3fv(this.program.uAxisColor, color);
          this.gl.drawArrays(this.gl.LINES, 0, 2);
        }
        axis = [-50, 0, 0, 0, 0, 0, 0, 0, -50, 0, 0, 0];
        for (i = -50; i <= 50; i += 5) {
          if (i !== 0) axis.push(i, 0, -50, i, 0, 50, -50, 0, i, 50, 0, i);
        }
        color = [0.7, 0.7, 0.7];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(axis), this.gl.STATIC_DRAW);
        this.gl.uniform3fv(this.program.uAxisColor, color);
        this.gl.drawArrays(this.gl.LINES, 0, 84);
        this.gl.uniform1i(this.program.uAxis, false);
      }
      if (this.drawCenterPoint) {
        this.gl.uniform1i(this.program.uCenterPoint, true);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.center), this.gl.STATIC_DRAW);
        this.gl.drawArrays(this.gl.POINTS, 0, 1);
        this.gl.uniform1i(this.program.uCenterPoint, false);
      }
      this.gl.deleteBuffer(axisBuffer);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    };

    MMD.prototype.registerKeyListener = function(element) {
      var _this = this;
      element.addEventListener('keydown', function(e) {
        switch (e.keyCode + e.shiftKey * 1000 + e.ctrlKey * 10000 + e.altKey * 100000) {
          case 37:
            _this.roty += Math.PI / 12;
            break;
          case 39:
            _this.roty -= Math.PI / 12;
            break;
          case 38:
            _this.rotx += Math.PI / 12;
            break;
          case 40:
            _this.rotx -= Math.PI / 12;
            break;
          case 33:
            _this.distance -= 3 * _this.distance / _this.DIST;
            break;
          case 34:
            _this.distance += 3 * _this.distance / _this.DIST;
            break;
          case 36:
            _this.rotx = _this.roty = 0;
            _this.center = [0, 10, 0];
            _this.distance = _this.DIST;
            break;
          case 1037:
            vec3.multiplyMat4(_this.center, _this.mvMatrix);
            _this.center[0] -= _this.distance / _this.DIST;
            vec3.multiplyMat4(_this.center, mat4.createInverse(_this.mvMatrix));
            break;
          case 1039:
            vec3.multiplyMat4(_this.center, _this.mvMatrix);
            _this.center[0] += _this.distance / _this.DIST;
            vec3.multiplyMat4(_this.center, mat4.createInverse(_this.mvMatrix));
            break;
          case 1038:
            vec3.multiplyMat4(_this.center, _this.mvMatrix);
            _this.center[1] += _this.distance / _this.DIST;
            vec3.multiplyMat4(_this.center, mat4.createInverse(_this.mvMatrix));
            break;
          case 1040:
            vec3.multiplyMat4(_this.center, _this.mvMatrix);
            _this.center[1] -= _this.distance / _this.DIST;
            vec3.multiplyMat4(_this.center, mat4.createInverse(_this.mvMatrix));
            break;
          default:
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        return _this.redraw = true;
      }, true);
    };

    MMD.prototype.registerMouseListener = function(element) {
      this.registerDragListener(element);
      this.registerWheelListener(element);
    };

    MMD.prototype.registerDragListener = function(element) {
      var _this = this;
      element.addEventListener('mousedown', function(e) {
        var modifier, move, onmousemove, onmouseup, ox, oy;
        if (e.button !== 0) return;
        modifier = e.shiftKey * 1000 + e.ctrlKey * 10000 + e.altKey * 100000;
        if (modifier !== 0 && modifier !== 1000) return;
        ox = e.clientX;
        oy = e.clientY;
        move = function(dx, dy, modi) {
          if (modi === 0) {
            _this.roty -= dx / 100;
            _this.rotx -= dy / 100;
            return _this.redraw = true;
          } else if (modi === 1000) {
            vec3.multiplyMat4(_this.center, _this.mvMatrix);
            _this.center[0] -= dx / 30 * _this.distance / _this.DIST;
            _this.center[1] += dy / 30 * _this.distance / _this.DIST;
            vec3.multiplyMat4(_this.center, mat4.createInverse(_this.mvMatrix));
            return _this.redraw = true;
          }
        };
        onmouseup = function(e) {
          var modi;
          if (e.button !== 0) return;
          modi = e.shiftKey * 1000 + e.ctrlKey * 10000 + e.altKey * 100000;
          move(e.clientX - ox, e.clientY - oy, modi);
          element.removeEventListener('mouseup', onmouseup, false);
          element.removeEventListener('mousemove', onmousemove, false);
          e.stopPropagation();
          return e.preventDefault();
        };
        onmousemove = function(e) {
          var modi, x, y;
          if (e.button !== 0) return;
          modi = e.shiftKey * 1000 + e.ctrlKey * 10000 + e.altKey * 100000;
          x = e.clientX;
          y = e.clientY;
          move(x - ox, y - oy, modi);
          ox = x;
          oy = y;
          e.stopPropagation();
          return e.preventDefault();
        };
        e.stopPropagation();
        element.addEventListener('mouseup', onmouseup, false);
        return element.addEventListener('mousemove', onmousemove, false);
      }, false);
    };

    MMD.prototype.registerWheelListener = function(element) {
      var onwheel;
      var _this = this;
      onwheel = function(e) {
        var delta;
        delta = e.detail || e.wheelDelta / (-40);
        _this.distance += delta * _this.distance / _this.DIST;
        _this.redraw = true;
        e.stopPropagation();
        return e.preventDefault();
      };
      if ('onmousewheel' in window) {
        element.addEventListener('mousewheel', onwheel, false);
      } else {
        element.addEventListener('DOMMouseScroll', onwheel, false);
      }
    };

    MMD.prototype.initParameters = function() {
      this.ignoreCameraMotion = false;
      this.rotx = this.roty = 0;
      this.distance = this.DIST = 35;
      this.center = [0, 10, 0];
      this.fovy = 40;
      this.drawEdge = true;
      this.edgeThickness = 0.004;
      this.edgeColor = [0, 0, 0];
      this.lightDirection = [0.5, 1.0, 0.5];
      this.lightDistance = 8875;
//      this.lightColor = [0.6, 0.6, 0.6];
      this.lightColor = [0.4*MMD_SA_options.light_mod, 0.4*MMD_SA_options.light_mod, 0.4*MMD_SA_options.light_mod];
//      this.drawSelfShadow = true;
//      this.drawAxes = true;
      this.drawCenterPoint = false;
      this.fps = 20;
this.frame_time_ref = 0;
      this.realFps = this.fps;
      this.playing = false;
      this.frame = -1;
    };

    MMD.prototype.addCameraLightMotion = function(motion, merge_flag, frame_offset) {
      this.motionManager.addCameraLightMotion(motion, merge_flag, frame_offset);
    };

    MMD.prototype.addModelMotion = function(model, motion, merge_flag, frame_offset) {
      this.motionManager.addModelMotion(model, motion, merge_flag, frame_offset);
    };

    MMD.prototype.play = function() {
      this.playing = true;
    };

    MMD.prototype.pause = function() {
      this.playing = false;
    };

    MMD.prototype.rewind = function() {
      this.setFrameNumber(0);
MMD_SA.motion_shuffle()
    };

    MMD.prototype.setFrameNumber = function(num) {
// reset frame_time_ref so that fps is checked on next frame
this.frame_time_ref = 0
      this.frame = num;
    };

    return MMD;

  })();

}).call(this);
