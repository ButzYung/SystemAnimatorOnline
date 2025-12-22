const EXTENSION_NAME = 'VRMC_vrm_animation';
export class VRMAnimationExporterPlugin {
    constructor(writer) {
        this.name = EXTENSION_NAME;
        this.writer = writer;
    }
    afterParse(input) {
        var _a, _b, _c;
        if (!Array.isArray(input)) {
            return;
        }
        const root = input[0];
        const vrmBoneMap = (_a = root.userData) === null || _a === void 0 ? void 0 : _a.vrmBoneMap;
        if (vrmBoneMap == null) {
            return;
        }
        const humanBones = {};
        for (const [boneName, bone] of vrmBoneMap) {
            const node = this.writer.nodeMap.get(bone);
            if (node != null) {
                humanBones[boneName] = { node };
            }
        }
        const humanoid = { humanBones };
        const extension = {
            specVersion: '1.0',
            // @ts-expect-error: will fix the three-vrm side later
            humanoid,
        };
        const gltfDef = this.writer.json;
        (_b = gltfDef.extensionsUsed) !== null && _b !== void 0 ? _b : (gltfDef.extensionsUsed = []);
        gltfDef.extensionsUsed.push(EXTENSION_NAME);
        (_c = gltfDef.extensions) !== null && _c !== void 0 ? _c : (gltfDef.extensions = {});
        gltfDef.extensions[EXTENSION_NAME] = extension;
    }
}
