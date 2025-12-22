var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as THREE from "three";
import { GLTFExporter } from "../exporters/GLTFExporter.js";
import { getRootBone } from "./getRootBone.js";
import { mapSkeletonToVRM } from "./mapSkeletonToVRM.js";
import { VRMAnimationExporterPlugin } from "./VRMAnimationExporterPlugin.js";
const _v3A = new THREE.Vector3();
function createSkeletonBoundingBox(skeleton) {
    const boundingBox = new THREE.Box3();
    for (const bone of skeleton.bones) {
        boundingBox.expandByPoint(bone.getWorldPosition(_v3A));
    }
    return boundingBox;
}
export function convertBVHToVRMAnimation(bvh, options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const scale = (_a = options === null || options === void 0 ? void 0 : options.scale) !== null && _a !== void 0 ? _a : 0.01;
        const skeleton = bvh.skeleton.clone();
        const clip = bvh.clip.clone();
        // find root bone of the skeleton
        const rootBone = getRootBone(skeleton);
        // scale the entire tree by 0.01
        rootBone.traverse((bone) => {
            bone.position.multiplyScalar(scale);
        });
        rootBone.updateWorldMatrix(false, true);
        // create a map from vrm bone names to bones
        const vrmBoneMap = mapSkeletonToVRM(rootBone);
        rootBone.userData.vrmBoneMap = vrmBoneMap;
        const hipsBone = vrmBoneMap.get("hips");
        const hipsBoneName = hipsBone.name;
        let hipsPositionTrack = null;
        const spineBone = vrmBoneMap.get("spine");
        const spineBoneName = spineBone.name;
        let spinePositionTrack = null;
        // rename tracks + remove translation tracks other than hips + pickup spine track
        const filteredTracks = [];
        for (const origTrack of bvh.clip.tracks) {
            const track = origTrack.clone();
            track.name = track.name.replace(/\.bones\[(.*)\]/, "$1");
            if (track.name.endsWith(".quaternion")) {
                filteredTracks.push(track);
            }
            if (track.name === `${hipsBoneName}.position`) {
                const newTrack = track.clone();
                newTrack.values = track.values.map((v) => v * (scale));
                hipsPositionTrack = newTrack;
                filteredTracks.push(newTrack);
            }
            if (track.name === `${spineBoneName}.position`) {
                const newTrack = track.clone();
                newTrack.values = track.values.map((v) => v * (scale));
                spinePositionTrack = newTrack;
            }
        }
        clip.tracks = filteredTracks;
        // Remove offsets contained in hips position track
        if (hipsPositionTrack != null) {
            const offset = hipsBone.position.toArray();
            for (let i = 0; i < hipsPositionTrack.values.length; i++) {
                hipsPositionTrack.values[i] -= offset[i % 3];
            }
        }
        // some BVHs does not ground correctly
        const boundingBox = createSkeletonBoundingBox(skeleton);
        if (boundingBox.min.y < 0) {
            rootBone.position.y -= boundingBox.min.y;
        }
        // export as a gltf
        const exporter = new GLTFExporter();
        exporter.register((writer) => new VRMAnimationExporterPlugin(writer));
        const gltf = yield exporter.parseAsync(rootBone, {
            animations: [clip],
            binary: true,
        });
        return gltf;
    });
}
