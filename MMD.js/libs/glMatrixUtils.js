// utility for glMatrix
mat4.createIdentity = function() {
  return mat4.identity(mat4.create());
};
mat4.createMultiply = function(a, b) {
  return mat4.multiply(a, b, mat4.create());
};
mat4.createInverse = function(mat) {
  return mat4.inverse(mat, mat4.create());
};
mat4.inverseTranspose = function(mat, dest) {
  if (!dest || mat == dest) {
    return mat4.transpose(mat4.inverse(mat));
  }
  return mat4.transpose(mat4.inverse(mat, dest));
};
mat4.applyScale = function(mat, vec) {
  var scaling = mat4.scale(mat4.identity(mat4.create()), vec);
  return mat4.multiply(scaling, mat, mat);
};
mat4.applyTranslate = function(mat, vec) {
  var translation = mat4.translate(mat4.identity(mat4.create()), vec);
  return mat4.multiply(translation, mat, mat);
};

vec3.moveBy = vec3.add;
vec3.createAdd = function(a, b) {
  return vec3.add(a, b, vec3.create());
};
vec3.rotateX = function(vec, angle, dest) {
  var rotation = mat4.rotateX(mat4.identity(mat4.create()), angle);
  return mat4.multiplyVec3(rotation, vec, dest);
};
vec3.rotateY = function(vec, angle, dest) {
  var rotation = mat4.rotateY(mat4.identity(mat4.create()), angle);
  return mat4.multiplyVec3(rotation, vec, dest);
};
vec3.createNormalize = function(vec) {
  return vec3.normalize(vec3.create(vec));
};
vec3.lengthBetween = function(a, b) {
  return vec3.length([a[0] - b[0], a[1] - b[1], a[2] - b[2]]);
};
vec3.multiplyMat4 = function(vec, mat, dest) {
  return mat4.multiplyVec3(mat, vec, dest);
};
vec3.multiplyQuat4 = function(vec, quat, dest) {
  return quat4.multiplyVec3(quat, vec, dest);
};
vec3.createSubtract = function(vec, vec2) {
  return vec3.subtract(vec, vec2, vec3.create());
};
vec3.createLerp = function(vec, vec2, lerp) {
  return vec3.lerp(vec, vec2, lerp, vec3.create());
};
vec3.lerp3 = function(vec, vec2, lerp3, dest) {
  if (!dest) { dest = vec; }
  dest[0] = vec[0] + lerp3[0] * (vec2[0] - vec[0]);
  dest[1] = vec[1] + lerp3[1] * (vec2[1] - vec[1]);
  dest[2] = vec[2] + lerp3[2] * (vec2[2] - vec[2]);
  return dest;
};
vec3.createLerp3 = function(vec, vec2, lerp3) {
  return vec3.lerp3(vec, vec2, lerp3, vec3.create());
};
vec3.rotateByQuat4 = function(vec, quat, dest) {
  if (!dest) { dest = vec; }
  if (dest[0] === 0 && dest[1] === 0 && dest[2] === 0) return dest;
  quat4.multiplyVec3(quat, vec, dest);
  return vec3.set(dest, quat4.multiply(
    [dest[0], dest[1], dest[2], 0],
    [-quat[0], -quat[1], -quat[2], quat[3]]));
};

quat4.createMultiply = function(quat, quat2) {
  return quat4.multiply(quat, quat2, quat4.create());
};
quat4.createSlerp = function(quat, quat2, slerp) {
  return quat4.slerp(quat, quat2, slerp, quat4.create());
};
quat4.createInverse = function(quat) {
  return quat4.inverse(quat, quat4.create())
};
quat4.dot = function(quat, quat2) {
  return quat[0] * quat2[0] + quat[1] * quat2[1] + quat[2] * quat2[2] + quat[3] * quat2[3];
};
