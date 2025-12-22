import * as THREE from 'three';
import { pickByProbability } from './pickByProbability.js';
const _v3A = new THREE.Vector3();
/**
 * Traverse descendants of given object.
 * Once the given function returns `true`, it stops the traversal operation and returns the object.
 *
 * It will perform breadth first search.
 */
function objectBFS(root, fn) {
    const queue = [root];
    while (queue.length > 0) {
        const obj = queue.shift();
        if (fn(obj)) {
            return obj;
        }
        queue.push(...obj.children);
    }
    return null;
}
/**
 * Traverse descendants of given object.
 * It will return an array of object that the given evaluation function returns `true`.
 *
 * It will perform breadth first search.
 */
function objectTraverseFilter(root, fn) {
    const result = [];
    root.traverse((obj) => {
        if (fn(obj)) {
            result.push(obj);
        }
    });
    return result;
}
/**
 * Traverse ancestors of given object.
 * Once the given function returns `true`, it stops the traversal operation and returns the object.
 */
function objectSearchAncestors(root, fn) {
    let obj = root;
    while (obj != null) {
        if (fn(obj)) {
            return obj;
        }
        obj = obj.parent;
    }
    return null;
}
/**
 * Sort the given array of Object3D by world position x.
 * This function sort the array in place, mutates the given array.
 */
function sortObjectArrayByWorldX(objects) {
    const objWorldXMap = new Map();
    for (const obj of objects) {
        objWorldXMap.set(obj, obj.getWorldPosition(_v3A).x);
    }
    return objects.sort((a, b) => objWorldXMap.get(a) - objWorldXMap.get(b));
}
function evaluatorEqual(obj, another) {
    return (obj === another) ? 1 : 0;
}
function evaluatorName(obj, substring) {
    const nameLowerCase = obj.name.toLowerCase();
    return nameLowerCase.includes(substring) ? 1 : 0;
}
/**
 * Determine spine, chest, and upperChest.
 *
 * Give it a hips bone and a bone with three children which is supposed to be a chest bone.
 */
function determineSpineBones(hips, chestCand) {
    // create an array from the hips to the chest
    const spineBones = [];
    objectSearchAncestors(chestCand, (obj) => {
        spineBones.unshift(obj);
        return obj === hips;
    });
    // map spine bones to VRM humanoid definition
    if (spineBones.length < 3) {
        throw new Error('Not enough spine bones.');
    }
    else if (spineBones.length === 3) {
        // hips - spine - chest
        return [spineBones[1], spineBones[2], null];
    }
    else if (spineBones.length === 4) {
        // hips - spine - chest - upperChest
        return [spineBones[1], spineBones[2], spineBones[3]];
    }
    else {
        // too much spine bones
        console.warn('The skeleton has more spine bones than VRM requires. You might get an unexpected result.');
        return [
            spineBones[Math.floor((spineBones.length - 1) / 3.0)],
            spineBones[Math.floor(((spineBones.length - 1) / 3.0) * 2.0)],
            spineBones[spineBones.length - 1],
        ];
    }
}
/**
 * Determine upperLeg, lowerLeg, foot, and toes.
 *
 * Give it a bone which is a child of hips and supposed to be a root of leg.
 */
function determineLegBones(legRoot) {
    var _a, _b;
    const bones = [];
    {
        let currentBone = legRoot;
        let currentDepth = 0;
        while (currentBone != null) {
            const firstChild = currentBone.children[0];
            bones.push({
                bone: currentBone,
                depth: currentDepth,
                len: (_a = firstChild === null || firstChild === void 0 ? void 0 : firstChild.position.length()) !== null && _a !== void 0 ? _a : 0.0,
            });
            currentBone = firstChild;
            currentDepth++;
        }
    }
    if (bones.length < 3) {
        throw new Error('Not enough leg bones.');
    }
    const [upperLeg, lowerLeg] = bones
        .concat()
        .sort((a, b) => b.len - a.len) // sort by bone length, longer comes first
        .slice(0, 2) // pick three longest bones
        .sort((a, b) => a.depth - b.depth); // sort by depth
    const foot = bones[lowerLeg.depth + 1];
    if (foot == null) {
        throw new Error('Could not find the foot bone.');
    }
    const toes = bones[foot.depth + 1];
    return [upperLeg.bone, lowerLeg.bone, foot.bone, (_b = toes === null || toes === void 0 ? void 0 : toes.bone) !== null && _b !== void 0 ? _b : null];
}
/**
 * Determine shoulder, upperArm, lowerArm, and hand.
 *
 * Give it a bone which is a child of chest and supposed to be a root of arm.
 */
function determineArmBones(armRoot) {
    var _a, _b;
    const bones = [];
    {
        let currentBone = armRoot;
        let currentDepth = 0;
        while (currentBone != null) {
            const firstChild = currentBone.children[0];
            bones.push({
                bone: currentBone,
                depth: currentDepth,
                len: (_a = firstChild === null || firstChild === void 0 ? void 0 : firstChild.position.length()) !== null && _a !== void 0 ? _a : 0.0,
            });
            currentBone = firstChild;
            currentDepth++;
        }
    }
    if (bones.length < 3) {
        throw new Error('Not enough arm bones.');
    }
    const [upperArm, lowerArm] = bones
        .concat()
        .sort((a, b) => b.len - a.len) // sort by bone length, longer comes first
        .slice(0, 2) // pick three longest bones
        .sort((a, b) => a.depth - b.depth); // sort by depth
    const hand = bones[lowerArm.depth + 1];
    if (hand == null) {
        throw new Error('Could not find the foot bone.');
    }
    const shoulder = upperArm.depth !== 0 ? bones[upperArm.depth - 1] : null;
    return [(_b = shoulder === null || shoulder === void 0 ? void 0 : shoulder.bone) !== null && _b !== void 0 ? _b : null, upperArm.bone, lowerArm.bone, hand.bone];
}
/**
 * Determine finger bones.
 *
 * The given result map must have hand bones.
 */
function determineFingerBones(result) {
    const leftRights = ['left', 'right'];
    const handBoneMap = {
        left: result.get('leftHand'),
        right: result.get('rightHand'),
    };
    const fingerNames = ['thumb', 'index', 'middle', 'ring', 'little'];
    const fingerBoneNamesMap = {
        left: {
            thumb: ['leftThumbMetacarpal', 'leftThumbProximal', 'leftThumbDistal'],
            index: ['leftIndexProximal', 'leftIndexIntermediate', 'leftIndexDistal'],
            middle: ['leftMiddleProximal', 'leftMiddleIntermediate', 'leftMiddleDistal'],
            ring: ['leftRingProximal', 'leftRingIntermediate', 'leftRingDistal'],
            little: ['leftLittleProximal', 'leftLittleIntermediate', 'leftLittleDistal'],
        },
        right: {
            thumb: ['rightThumbMetacarpal', 'rightThumbProximal', 'rightThumbDistal'],
            index: ['rightIndexProximal', 'rightIndexIntermediate', 'rightIndexDistal'],
            middle: ['rightMiddleProximal', 'rightMiddleIntermediate', 'rightMiddleDistal'],
            ring: ['rightRingProximal', 'rightRingIntermediate', 'rightRingDistal'],
            little: ['rightLittleProximal', 'rightLittleIntermediate', 'rightLittleDistal'],
        },
    };
    for (const leftRight of leftRights) {
        const handBone = handBoneMap[leftRight];
        const fingerRoots = handBone.children.concat();
        for (const fingerName of fingerNames) {
            const fingerBoneNames = fingerBoneNamesMap[leftRight][fingerName];
            // find nearest bone of the finger
            const fingerRoot = pickByProbability(fingerRoots, [
                { func: (obj) => evaluatorName(obj, fingerName), weight: 10.0 },
                { func: (obj) => obj.getWorldPosition(_v3A).z, weight: 1.0 },
            ]);
            if (fingerRoot != null) {
                fingerRoots.splice(fingerRoots.indexOf(fingerRoot), 1);
                result.set(fingerBoneNames[0], fingerRoot);
                const child1 = fingerRoot.children[0];
                if (child1 != null) {
                    result.set(fingerBoneNames[1], child1);
                    const child2 = child1.children[0];
                    if (child2 != null) {
                        result.set(fingerBoneNames[2], child2);
                    }
                }
            }
        }
    }
}
/**
 * Determine neck, head, leftEye, and rightEye.
 *
 * Give it a bone which is a child of chest and supposed to be a root of head.
 */
function determineHeadBones(headRoot) {
    let head = headRoot;
    // neck might have two or more bones
    while (head.children.length === 1) {
        head = head.children[0];
    }
    const neck = headRoot === head ? null : headRoot;
    let leftEye = null;
    let rightEye = null;
    if (head.children.length === 0) {
        leftEye = pickByProbability(head.children, [
            { func: (obj) => evaluatorName(obj, 'lefteye'), weight: 10.0 },
            { func: (obj) => evaluatorName(obj, 'l_faceeye'), weight: 10.0 },
            { func: (obj) => evaluatorName(obj, 'eye'), weight: 1.0 },
            { func: (obj) => obj.getWorldPosition(_v3A).x, weight: 1.0 },
        ]);
        rightEye = pickByProbability(head.children, [
            { func: (obj) => evaluatorEqual(obj, leftEye), weight: -100.0 },
            { func: (obj) => evaluatorName(obj, 'righteye'), weight: 10.0 },
            { func: (obj) => evaluatorName(obj, 'r_faceeye'), weight: 10.0 },
            { func: (obj) => evaluatorName(obj, 'eye'), weight: 1.0 },
            { func: (obj) => -obj.getWorldPosition(_v3A).x, weight: 1.0 },
        ]);
    }
    return [neck, head, leftEye, rightEye];
}
/**
 * Map given hierarchy to VRM humanoid.
 */
export function mapSkeletonToVRM(root) {
    const result = new Map();
    // find hips - the first descendant of the root which has three children
    const hips = objectBFS(root, (obj) => {
        return obj.children.length >= 3;
    });
    if (hips == null) {
        throw new Error('Cannot find hips.');
    }
    result.set('hips', hips);
    // find chest candidate - descendants of the hips which has three or more children
    const chestCands = objectTraverseFilter(hips, (obj) => {
        return obj !== hips && obj.children.length >= 3;
    });
    const chestCand = pickByProbability(chestCands, [
        { func: (obj) => evaluatorName(obj, 'upperchest'), weight: 1.0 },
        { func: (obj) => evaluatorName(obj, 'chest'), weight: 1.0 },
    ]);
    if (chestCand == null) {
        throw new Error('Cannot find chest.');
    }
    const [spine, chest, upperChest] = determineSpineBones(hips, chestCand);
    result.set('spine', spine);
    result.set('chest', chest);
    if (upperChest != null) {
        result.set('upperChest', upperChest);
    }
    // find leg roots - two children of hips extends to below
    const leftLegRoot = pickByProbability(hips.children, [
        { func: (obj) => evaluatorName(obj, 'leftupperleg'), weight: 10.0 },
        { func: (obj) => evaluatorName(obj, 'l_upperleg'), weight: 10.0 },
        { func: (obj) => evaluatorName(obj, 'leg'), weight: 1.0 },
        { func: (obj) => obj.getWorldPosition(_v3A).x, weight: 1.0 },
    ]);
    const rightLegRoot = pickByProbability(hips.children, [
        { func: (obj) => evaluatorEqual(obj, leftLegRoot), weight: -100.0 },
        { func: (obj) => evaluatorName(obj, 'rightupperleg'), weight: 10.0 },
        { func: (obj) => evaluatorName(obj, 'r_upperleg'), weight: 10.0 },
        { func: (obj) => evaluatorName(obj, 'leg'), weight: 1.0 },
        { func: (obj) => -obj.getWorldPosition(_v3A).x, weight: 1.0 },
    ]);
    // determine leg bones
    const [leftUpperLeg, leftLowerLeg, leftFoot, leftToes] = determineLegBones(leftLegRoot);
    result.set('leftUpperLeg', leftUpperLeg);
    result.set('leftLowerLeg', leftLowerLeg);
    result.set('leftFoot', leftFoot);
    if (leftToes != null) {
        result.set('leftToes', leftToes);
    }
    const [rightUpperLeg, rightLowerLeg, rightFoot, rightToes] = determineLegBones(rightLegRoot);
    result.set('rightUpperLeg', rightUpperLeg);
    result.set('rightLowerLeg', rightLowerLeg);
    result.set('rightFoot', rightFoot);
    if (rightToes != null) {
        result.set('rightToes', rightToes);
    }
    // assuming z+ is the front, determine left arm and right arm
    const leftArmRoot = pickByProbability(chestCand.children, [
        { func: (obj) => evaluatorName(obj, 'leftshoulder'), weight: 10.0 },
        { func: (obj) => evaluatorName(obj, 'l_shoulder'), weight: 10.0 },
        { func: (obj) => evaluatorName(obj, 'leftupperarm'), weight: 10.0 },
        { func: (obj) => evaluatorName(obj, 'l_upperarm'), weight: 10.0 },
        { func: (obj) => evaluatorName(obj, 'shoulder'), weight: 1.0 },
        { func: (obj) => evaluatorName(obj, 'arm'), weight: 1.0 },
        { func: (obj) => obj.getWorldPosition(_v3A).x, weight: 1.0 },
    ]);
    const rightArmRoot = pickByProbability(chestCand.children, [
        { func: (obj) => evaluatorEqual(obj, leftArmRoot), weight: -100.0 },
        { func: (obj) => evaluatorName(obj, 'rightshoulder'), weight: 10.0 },
        { func: (obj) => evaluatorName(obj, 'r_shoulder'), weight: 10.0 },
        { func: (obj) => evaluatorName(obj, 'rightupperarm'), weight: 10.0 },
        { func: (obj) => evaluatorName(obj, 'r_upperarm'), weight: 10.0 },
        { func: (obj) => evaluatorName(obj, 'shoulder'), weight: 1.0 },
        { func: (obj) => evaluatorName(obj, 'arm'), weight: 1.0 },
        { func: (obj) => -obj.getWorldPosition(_v3A).x, weight: 1.0 },
    ]);
    const headRoot = pickByProbability(chestCand.children, [
        { func: (obj) => evaluatorEqual(obj, leftArmRoot), weight: -100.0 },
        { func: (obj) => evaluatorEqual(obj, rightArmRoot), weight: -100.0 },
        { func: (obj) => evaluatorName(obj, 'neck'), weight: 1.0 },
        { func: (obj) => evaluatorName(obj, 'head'), weight: 1.0 },
        { func: (obj) => Math.abs(obj.getWorldPosition(_v3A).x), weight: -1.0 },
    ]);
    // determine hand bones
    const [leftShoulder, leftUpperArm, leftLowerArm, leftHand] = determineArmBones(leftArmRoot);
    if (leftShoulder != null) {
        result.set('leftShoulder', leftShoulder);
    }
    result.set('leftUpperArm', leftUpperArm);
    result.set('leftLowerArm', leftLowerArm);
    result.set('leftHand', leftHand);
    const [rightShoulder, rightUpperArm, rightLowerArm, rightHand] = determineArmBones(rightArmRoot);
    if (rightShoulder != null) {
        result.set('rightShoulder', rightShoulder);
    }
    result.set('rightUpperArm', rightUpperArm);
    result.set('rightLowerArm', rightLowerArm);
    result.set('rightHand', rightHand);
    // determine finger bones
    determineFingerBones(result);
    // determine head
    const [neck, head, leftEye, rightEye] = determineHeadBones(headRoot);
    if (neck != null) {
        result.set('neck', neck);
    }
    result.set('head', head);
    if (leftEye != null) {
        result.set('leftEye', leftEye);
    }
    if (rightEye != null) {
        result.set('rightEye', rightEye);
    }
    return result;
}
