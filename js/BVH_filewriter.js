// BVH FileWriter
// (2024-05-08)

var BVH_FileWriter = (()=>{
  let v1 = new THREE.Vector3();
  let v2 = new THREE.Vector3();
  let q1 = new THREE.Quaternion();
  let q2 = new THREE.Quaternion();

  const modelX = MMD_SA.THREEX.get_model(0);
  const vrm = modelX.model;
  const para = modelX.para;
  const bone_three_to_vrm_name = modelX.bone_three_to_vrm_name;
  const vrm_scale = MMD_SA.THREEX.VRM.vrm_scale;
  const humanBones = vrm.humanoid.humanBones;

  function bvh_parse(bone, hierarchy, hierarchy_list) {
function find_vrm_bones(b) {
  const vrm_bones = [];
  b.children.forEach(_b=>{
    if (_b.type != 'Bone') return;

    const bones = (humanBones[bone_three_to_vrm_name[_b.name]]) ? [_b] : find_vrm_bones(_b);
    if (bones)
      vrm_bones.push(...bones);
  });
  return vrm_bones;
}

const name = bone_three_to_vrm_name[bone.name];
hierarchy.name = name.replace(/ThumbProximal/, 'ThumbIntermediate').replace(/ThumbMetacarpal/, 'ThumbProximal');
if (!hierarchy_list)
  hierarchy_list = hierarchy.list = [];
hierarchy_list.push({ name:hierarchy.name, name_MMD:MMD_SA.THREEX.VRM.bone_map_VRM_to_MMD[name] });
const name_parent = hierarchy.parent_name;

const pos = v1.fromArray(para.pos0[name]).sub((name_parent) ? v2.fromArray(para.pos0[name_parent]) : v2.set(0,0,0)).multiplyScalar(vrm_scale);
if (/spine|upperleg|shoulder/i.test(hierarchy.name)) {
  pos.z = 0;
}
else if (/arm|hand|zzzIntermediate|zzzDistal/i.test(hierarchy.name)) {
  pos.x = Math.sign(pos.x) * pos.length();
  pos.y = pos.z = 0;
}
else if (/leg|chest|neck|head/i.test(hierarchy.name)) {
  pos.y = Math.sign(pos.y) * pos.length();
  pos.x = pos.z = 0;
}
hierarchy.pos = pos.toArray();

const children = [];
bone.children.forEach(b=>{
  if (b.type != 'Bone') return;

  let b_list;
  if (!humanBones[bone_three_to_vrm_name[b.name]]) {
    b_list = find_vrm_bones(b);
    if (!b_list.length) return;
  }
  else {
    b_list = [b];
  }

  b_list.forEach(_b=>{
    const _hierarchy = { parent_name:name };
    bvh_parse(_b, _hierarchy, hierarchy_list);
    children.push(_hierarchy);
  });
});
hierarchy.children = children;
  }

  function bvh_output_hierarchy(hierarchy, tabs=0) {
let lines = [];
let tabs_txt = '';
const tab = '  ';
for (let i = 0; i < tabs; i++)
  tabs_txt += tab;

let channels;
if (!hierarchy) {
  hierarchy = modelX.bvh_hierarchy;
  lines.push('HIERARCHY');
  lines.push('ROOT hips');
  channels = '6 Xposition Yposition Zposition';
}
else {
  lines.push(tabs_txt + 'JOINT ' + hierarchy.name);
  channels = '3';
}
channels += ' Yrotation Xrotation Zrotation';

lines.push(tabs_txt + '{');
lines.push(tabs_txt + tab + 'OFFSET ' + hierarchy.pos.join(' '));
lines.push(tabs_txt + tab + 'CHANNELS ' + channels);

if (hierarchy.children.length) {
  tabs++;
  hierarchy.children.forEach(h=>{
    lines.push(...bvh_output_hierarchy(h, tabs));
  });
}
else {
  lines.push(tabs_txt + tab + 'End Site');
  lines.push(tabs_txt + tab + '{');
  lines.push(tabs_txt + tab+tab + 'OFFSET ' + hierarchy.pos.join(' '));
  lines.push(tabs_txt + tab + '}');
}

lines.push(tabs_txt + '}');

return lines;
  }

  if (!modelX.bvh_hierarchy) {
    const bvh_hierarchy = modelX.bvh_hierarchy = {};
    bvh_parse(humanBones['hips'].node, bvh_hierarchy);
    bvh_hierarchy.txt = bvh_output_hierarchy().join('\n');
    console.log(bvh_hierarchy)
  }

  return function (filename, boneKeys) {
let time_max = 0;

const boneKeys_by_name = {};
boneKeys.forEach((k,idx)=>{
  if (!boneKeys_by_name[k.name])
    boneKeys_by_name[k.name] = { keys:[], keys_full:[] }
  boneKeys_by_name[k.name].keys.push(k);
  time_max = Math.max(time_max, k.time);
});

const f_max = Math.round(time_max*30) + 1;

for (const name in boneKeys_by_name) {
  let f = 0;
  const bk = boneKeys_by_name[name];
  const bk_keys = bk.keys;
  const bk_keys_full = bk.keys_full;
  bk_keys.forEach((k,idx)=>{
    const _f = Math.round(k.time*30);
    if (_f > f) {
      let k_last = bk_keys[idx-1];
      const _f_last = Math.round(k_last.time*30);
      const _f_diff = _f - _f_last;
      for (let i = 1; i < _f_diff; i++) {
        const k_new = { time:(_f_last+i)/30, pos:v1.fromArray(k_last.pos).lerp(v2.fromArray(k.pos), i/_f_diff).toArray(), rot:q1.fromArray(k_last.rot).slerp(q2.fromArray(k.rot), i/_f_diff).toArray() };
        bk_keys_full.push(k_new);
      }
    }

    bk_keys_full.push(k);
    f++;
  });

  if (bk_keys_full.length < f_max) {
    const k_last = bk_keys_full[bk_keys_full.length-1];
    for (let i = bk_keys_full.length; i < f_max; i++)
      bk_keys_full.push(k_last);
  }
}


//console.log(boneKeys_by_name, f_max)

let root_pos_offset;

let data_lines = [];
for (let f = 0; f < f_max; f++) {
  let data = [];
  modelX.bvh_hierarchy.list.forEach(item=>{
    const name = item.name;
    const name_MMD = item.name_MMD;

    if (!name_MMD || !boneKeys_by_name[name_MMD]) {
//if (f==0) console.log(name, name_MMD);
      data.push('0 0 0');
    }
    else {
      const d = (/(left|right)LowerArm/.test(name)) ? ((RegExp.$1 == 'left') ? '左' : '右') : null;
      const k = boneKeys_by_name[name_MMD].keys_full[f];

      let q_multiply, q_premultiply;

      let v = '';
      if (name == 'hips') {
        const pos = v1.fromArray(k.pos);
        const bone_move = boneKeys_by_name['全ての親'];
        if (bone_move) {
          pos.add(v2.fromArray(bone_move.keys_full[f].pos));
        }

        if (f == 0) {
          root_pos_offset = pos.clone();
//console.log(root_pos_offset)
        }
        else {
          pos.add(root_pos_offset);
        }

        v += pos.toArray().join(' ') + ' ';

        const bone_lower_body = boneKeys_by_name['下半身'];
        if (bone_lower_body)
          q_multiply = bone_lower_body.keys_full[f].rot;
      }
      else if (name == 'spine') {
        const bone_lower_body = boneKeys_by_name['下半身'];
        if (bone_lower_body)
          q_premultiply = q1.fromArray(bone_lower_body.keys_full[f].rot).conjugate().toArray();
      }
      else if (d) {
        const bone_twist = boneKeys_by_name[d+'手捩'];
        if (bone_twist)
          q_multiply = bone_twist.keys_full[f].rot;
      }

      const q = q1.fromArray(k.rot);
      if (q_multiply)
        q.multiply(q2.fromArray(q_multiply));
      if (q_premultiply)
        q.premultiply(q2.fromArray(q_premultiply));

      const rot_euler = v1.setEulerFromQuaternion(q, 'YXZ').multiplyScalar(180/Math.PI);
      v += [rot_euler.y, rot_euler.x, rot_euler.z].join(' ');
      data.push(v);
    }
  });
  data_lines.push(data.join(' '));
}

const bvh_txt = [
  modelX.bvh_hierarchy.txt,
  'MOTION',
  'Frames: ' + f_max,
  'Frame Time: ' + 1/30,
  data_lines.join('\n'),
].join('\n');

System._browser.save_file(filename, bvh_txt, 'text/plain');
  };
})();

