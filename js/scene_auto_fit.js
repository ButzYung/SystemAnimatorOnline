// auto fit
// (2023-05-05)

const v1 = new THREE.Vector3();
const v2 = new THREE.Vector3();
const v3 = new THREE.Vector3();
const v4 = new THREE.Vector3();
const v5 = new THREE.Vector3();
const v6 = new THREE.Vector3();

const ref_pt_core = new THREE.Vector3();
const ref_pt_shift = new THREE.Vector3();

const q1 = new THREE.Quaternion();

function auto_fit_core() {
  function transform_contact_point(v, depth_v, af_motion_para) {
    rotation_offset = (af.rotation) ? v5.copy(af.rotation).multiplyScalar(Math.PI/180) : v5.set(0,0,0);

    if (af_motion_para) {
      const depth_y = depth_v.y;
      depth_v.setY(0);
      if (af_motion_para.rotation) {
        rotation_offset.add(v4.copy(af_motion_para.rotation).multiplyScalar(Math.PI/180));
        depth_v.applyEuler(v4);
      }
      if (af_motion_para.depth_rotation) {
        depth_v.applyEuler(v4.copy(af_motion_para.depth_rotation).multiplyScalar(Math.PI/180));
      }
      if (af_motion_para.depth_scale) {
        depth_v.multiplyScalar(af_motion_para.depth_scale);
      }
      depth_v.setY(depth_y);
    }
//DEBUG_show('\nDepth:\n'+depth_v.toArray().join('\n')+'\n',0,1)
    ref_pt_core.copy(v).multiply(object_3d._mesh.scale).applyQuaternion(object_3d._mesh.quaternion).applyEuler(rotation_offset);
    ref_pt_shift.copy(object_3d._mesh.position).sub(model_position0).add(depth_v);
    v.copy(ref_pt_core).add(ref_pt_shift);
//DEBUG_show('\nref_pt_core:\n'+ref_pt_core.toArray().join('\n')+'\n',0,1)
//DEBUG_show('\nref_pt_shift:\n'+ref_pt_shift.toArray().join('\n')+'\n',0,1)
//DEBUG_show('\nv:\n'+v.toArray().join('\n')+'\n',0,1)
    return v;
  }

  let scale_offset, position_offset, rotation_offset;
  let position_offset_y_ignored = false;

  if (af.motion_target) {
    if (af.motion_target.indexOf(MMD_SA.MMD.motionManager.filename) == -1)
      return false;
  }

  if (type == 'chair') {
//    if (!System._browser.camera.poseNet.enabled) return;
    if (!motion_para.motion_tracking_upper_body_only) return false;

    const legL = model.get_bone_position_by_MMD_name('左足', true);
    const hip = v1.copy(legL).add(model.get_bone_position_by_MMD_name('右足', true).sub(legL).multiplyScalar(0.5));

    const legL0 = model.get_bone_origin_by_MMD_name('左足');
    const af_motion_para = motion_para.auto_fit?.chair;
    if (!af_motion_para) {
      const leg_angle = Math.min(Math.abs(model.get_bone_by_MMD_name('左足').quaternion.toAxisAngle()[1]), Math.abs(model.get_bone_by_MMD_name('右足').quaternion.toAxisAngle()[1]));
      if (leg_angle < Math.PI/4) return false;
      if ((hip.y > legL0[1]*2/3) || (hip.y < legL0[1]*0.4)) return false;
    }

    const thigh_thickness = legL0[1]/10;

    const upper_leg_length = v3.fromArray(legL0).distanceTo(v4.fromArray(model.get_bone_origin_by_MMD_name('左ひざ')));
    const depth_v = v3.set(0, 0, -upper_leg_length/2);

    const ankle_y = Math.min(model.get_bone_position_by_MMD_name('左ひざ', true).y, model.get_bone_position_by_MMD_name('右ひざ', true).y);
    const hip_offset = (hip.y - ankle_y) - 0.1;
//DEBUG_show(hip_offset,0,1)
    if (hip_offset > 0) {
      depth_v.y += Math.min(hip_offset/2, thigh_thickness/2);
      depth_v.z += Math.min(hip_offset*2, upper_leg_length/3);
    }

    const ref_pt = transform_contact_point(v2.copy(af.reference_point), depth_v, af_motion_para);

    const hip_y = hip.y - thigh_thickness;
    if (af.scale) {
      scale_offset = af.scale;
    }
    else {
      scale_offset = hip_y/ref_pt.y;
      position_offset_y_ignored = true;
    }
    position_offset = v3.copy(hip);
  }
  else if (type == 'floor') {
//    if (!System._browser.camera.poseNet.enabled) return;
    if (!motion_para.motion_tracking_upper_body_only) return false;

    const legL = model.get_bone_position_by_MMD_name('左足', true);
    const hip = v1.copy(legL).add(model.get_bone_position_by_MMD_name('右足', true).sub(legL).multiplyScalar(0.5));

    const legL0 = model.get_bone_origin_by_MMD_name('左足');
    if (hip.y > legL0[1]*0.4) return false;

    const thigh_thickness = legL0[1]/10;

    const ref_pt = transform_contact_point(v2.copy(af.reference_point), v3.set(0,0,0));

    hip.y -= thigh_thickness;
    scale_offset = 1;
    position_offset = v3.copy(hip);
  }
  else if (type == 'table') {
//    if (!System._browser.camera.poseNet.enabled) return;
    if (!motion_para.motion_tracking_upper_body_only) return false;

    const af_motion_para = motion_para.auto_fit?.table;
    if (!af_motion_para) {
      if (!motion_para.motion_tracking?.arm_tracking?.elbow_lock) return false;
      if (!!motion_para.motion_tracking.arm_tracking.elbow_lock.left ^ !!motion_para.motion_tracking.arm_tracking.elbow_lock.right) return false;
    }

    const ref_bones = af_motion_para?.reference_bones || ['左ひじ', '右ひじ'];
    const pos = v1.set(0,0,0);
    let contact_y = 9999;
    ref_bones.forEach(b=>{
      const p = model.get_bone_position_by_MMD_name(b, true);
      contact_y = Math.min(p.y, contact_y);
      pos.add(p.multiplyScalar(1/ref_bones.length));
    });
    if (ref_bones.length > 1)
      pos.x = 0;

    const is_arm = ['手','ひじ'].some(b=>ref_bones[0].indexOf(b)!=-1);

    const ref_depth_bones = (is_arm) ? ['左ひじ', '左手首'] : ['左ひざ', '左足'];
    const ref_depth = v3.fromArray(model.get_bone_origin_by_MMD_name(ref_depth_bones[0])).distanceTo(v4.fromArray(model.get_bone_origin_by_MMD_name(ref_depth_bones[1])));

    const depth_v = v3.set(0, 0, ref_depth/2);
    const ref_pt = transform_contact_point(v2.copy(af.reference_point), depth_v, af_motion_para);

    const pos_y = contact_y - ref_depth/16;
    scale_offset = pos_y/ref_pt.y;
    position_offset = v3.copy(pos);
    position_offset_y_ignored = true;
  }
  else {
    const ref_pt = transform_contact_point(v2.copy(af.reference_point), v3.set(0,0,0));

    scale_offset = 1;
    position_offset = v3.set(0,0,0);
  }

//DEBUG_show(type+'/'+Date.now())
//DEBUG_show(scale_offset,0,1)
  position_offset.add(model_position_offset).sub(v4.copy(ref_pt_core).multiplyScalar(scale_offset)).sub(v4.copy(ref_pt_shift));
  if (position_offset_y_ignored)
    position_offset.setY(0);

  if (af.position)
    position_offset.add(af.position);

  const mesh0_pos = v6.copy(object_3d._mesh.position).sub(model_position0);

  const q_offset = q1.setFromEuler(rotation_offset);

  const transform_list = (af.global_transform) ? MMD_SA.THREEX._object3d_list_ : [object_3d];
  transform_list.forEach(obj=>{
    if (obj.parent_bone?.name) return;

    const mesh_pos = v2.copy(obj._mesh.position).sub(model_position0);
    const _position_offset = v1.copy(position_offset);
    if (obj != object_3d) {
      _position_offset.add(v4.copy(mesh_pos).sub(mesh0_pos).multiplyScalar(scale_offset).applyQuaternion(q_offset)).sub(mesh_pos).add(mesh0_pos);
    }

    obj.user_data._default_state_.position.add(_position_offset);
    obj.user_data._default_state_.scale *= scale_offset;
    obj._mesh.position.add(_position_offset);
    obj._mesh.scale.multiplyScalar(scale_offset);

    for (const d of ['x','y','z'])
      obj.user_data._rotation_[d] += rotation_offset[d];
    obj._mesh.quaternion.multiply(q_offset);

    if (!obj.user_data._auto_fit_)
      obj.user_data._auto_fit_ = {};
    obj.user_data._auto_fit_.position_offset = (obj.user_data._auto_fit_.position_offset||new THREE.Vector3()).add(_position_offset);
    obj.user_data._auto_fit_.rotation_offset = (obj.user_data._auto_fit_.rotation_offset||new THREE.Vector3()).add(rotation_offset);
    obj.user_data._auto_fit_.scale_offset = (obj.user_data._auto_fit_.scale_offset||1) * scale_offset;

    if (af.global_transform)
      obj.user_data._auto_fit_.global_transform = true;
  });

  if (af.center_view || af.center_view_lookAt) {
    if (af.center_view) {
      af._center_view_ = [MMD_SA.MMD.motionManager.filename, motion_para.center_view];
      motion_para.center_view = af.center_view;
    }
    if (af.center_view_lookAt) {
      af._center_view_lookAt_ = [MMD_SA.MMD.motionManager.filename, motion_para.center_view_lookAt];
      motion_para.center_view_lookAt = af.center_view_lookAt;
    }
    MMD_SA.reset_camera();
  }

  return true;
}

function auto_fit_loop(obj) {
  obj_para = obj;

  model_para = obj_para.model_para;
  placement = model_para.placement;
  af = obj_para.auto_fit;
  type = af.type;

  object_3d = MMD_SA.THREEX._object3d_list_.find(obj=>obj.uuid==obj_para._object3d_uuid);

  const fitted = auto_fit_core();

  let visible;
  const ev = (fitted) ? af.on_fit : af.on_unfit;

  object_3d._obj_proxy.hidden = ev?.visible === false;

  return fitted;
}

function auto_fit(list) {
  model = MMD_SA.THREEX.get_model(0);
  model_position0 = MMD_SA_options.Dungeon_options.options_by_area_id[MMD_SA_options.Dungeon.area_id]._startup_position_;
  model_position_offset.copy(model.mesh.position).sub(model_position0);
  motion_para = MMD_SA.MMD.motionManager.para_SA;

  if (!list) {
    para.json.XR_Animator_scene.object3D_list.forEach(obj_para=>{
      af = obj_para.auto_fit;
      if (!af) return;

      if (af._center_view_) {
        MMD_SA_options.motion_para[af._center_view_[0]].center_view = af._center_view_[1];
        delete af._center_view_;
      }
      if (af._center_view_lookAt_) {
        MMD_SA_options.motion_para[af._center_view_lookAt_[0]].center_view_lookAt = af._center_view_lookAt_[1];
        delete af._center_view_lookAt_;
      }

      object_3d = MMD_SA.THREEX._object3d_list_.find(obj=>obj.uuid==obj_para._object3d_uuid);

      const transform_list = (af.global_transform) ? MMD_SA.THREEX._object3d_list_ : [object_3d];
      transform_list.forEach(obj=>{
        if (obj.parent_bone?.name) return;

        const _af_ = obj.user_data._auto_fit_;
        if (!_af_) return;

        obj.user_data._default_state_.position.sub(_af_.position_offset);
        obj.user_data._default_state_.scale /= _af_.scale_offset;
        obj._mesh.position.sub(_af_.position_offset);
        obj._mesh.scale.multiplyScalar(1/_af_.scale_offset);

        for (const d of ['x','y','z'])
          obj.user_data._rotation_[d] -= _af_.rotation_offset[d];
        obj._mesh.quaternion.multiply(q1.setFromEuler(_af_.rotation_offset).conjugate());

        delete obj.user_data._auto_fit_;
      });
    });

    if (para.json.XR_Animator_scene.auto_fit_list) {
      para.json.XR_Animator_scene.auto_fit_list.some(af_list=>{
        let _fitted;
        af_list.some(af=>{
          const obj = para.json.XR_Animator_scene.object3D_list.find(obj=>obj.id==af.object_id);

          obj.auto_fit = Object.assign({}, af);

          const fitted = auto_fit_loop(obj);
          _fitted = _fitted || fitted;

          return !fitted;
        });

        return _fitted;
      });
      return;
    }

    list = para.json.XR_Animator_scene.object3D_list;
  }

  list.forEach(obj=>{
    auto_fit_loop(obj);
  });
}

let para;

let model;
let motion_para;
let obj_para, model_para, placement, af, type;
let object_3d;

let model_position0;
const model_position_offset = new THREE.Vector3();

const fadeout_disabled = { condition:()=>false };

function load(p) {
  para = p;

  window.addEventListener('SA_MMD_model0_onmotionended', (e)=>{
    if (e.detail.is_loop) return;

    const _motion_blending = MMD_SA.MMD.motionManager.para_SA.motion_blending;
    let _fadeout;
    if (_motion_blending) {
      _motion_blending.fadeout = fadeout_disabled;
      _fadeout = _motion_blending.fadeout;
    }

    System._browser.on_animation_update.remove(auto_fit, 0);
    System._browser.on_animation_update.add(auto_fit, 1,0);
    if (_motion_blending)
      System._browser.on_animation_update.add(()=>{_motion_blending.fadeout=_fadeout}, 1,0);

//    System._browser.on_animation_update.add(auto_fit, 30,0);
  });

  auto_fit();  
}

export { load };