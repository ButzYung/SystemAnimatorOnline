export function getRootBone(skeleton) {
    const boneSet = new Set(skeleton.bones);
    for (const bone of skeleton.bones) {
        if (bone.parent == null || !boneSet.has(bone.parent)) {
            return bone;
        }
    }
    throw new Error("Invalid skeleton. Could not find the root bone of the given skeleton.");
}
