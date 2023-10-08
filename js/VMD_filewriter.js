// VMD FileWriter
// (2022-05-28)

var VMD_FileWriter = (function () {

  function unicode_to_sjis(text, length_fixed) {
// https://github.com/polygonplanet/encoding.js
const unicodeArray = Encoding.stringToCode(text); // Convert string to code array
const sjisArray = Encoding.convert(unicodeArray, {
  to: 'SJIS',
  from: 'UNICODE'
});

if (length_fixed) {
  for (let i = sjisArray.length; i < length_fixed; i++)
    sjisArray[i] = 0
}

return sjisArray;
  }

  function BinaryStream( buffer, littleEndian ) {
this.dv = new DataView( buffer );
this.offset = 0;
this.littleEndian = littleEndian;
  }

  BinaryStream.prototype.setUint8 = BinaryStream.prototype.setBytes = function (v) {
this.dv.setUint8(this.offset, v)
this.offset += 1
  };

  BinaryStream.prototype.setUint32 = function (v) {
this.dv.setUint32(this.offset, v, this.littleEndian)
this.offset += 4
  };

  BinaryStream.prototype.setFloat32 = function (v) {
this.dv.setFloat32(this.offset, v, this.littleEndian)
this.offset += 4
  };

  BinaryStream.prototype.unicode_to_sjis = function (text, length_fixed) {
unicode_to_sjis(text, length_fixed).forEach(v => { this.setBytes(v) });
  };

  var _interp = new Uint8Array([20,20,20,20,20,20,20,20, 107,107,107,107,107,107,107,107]);

  var MAGIC = [0x56,0x6F,0x63,0x61,0x6C,0x6F,0x69,0x64,0x20,0x4D,0x6F,0x74,0x69,0x6F,0x6E,0x20,0x44,0x61,0x74,0x61,0x20,0x30,0x30,0x30,0x32]; // 'Vocaloid Motion Data 0002'

  return function (filename, boneKeys, morphKeys, is_T_pose=MMD_SA.THREEX.enabled) {
// https://mikumikudance.fandom.com/wiki/VMD_file_format
// https://www.twblogs.net/a/5baa71b72b7177781a0e32e1?lang=zh-cn

var bytes_length = 30 + 20 + (4 + (15 + 4 + 4*3 + 4*4 + 64) * boneKeys.length) + (4 + (15 + 4 + 4) * morphKeys.length) + 4 + 4;

const buffer = new ArrayBuffer(bytes_length);

var bs = new BinaryStream(buffer, true);

// 30 (MAGIC)
MAGIC.forEach(v => { bs.setBytes(v) });
while (++bs.offset < 30) {}

// 20 (model name)
bs.unicode_to_sjis('XR Animator', 20);

// 4 (boneKeys length)
bs.setUint32(boneKeys.length);

boneKeys.forEach(k => {
// 15 (bone name)
  bs.unicode_to_sjis(k.name, 15);

// 4 (frame number)
  bs.setUint32(Math.round(k.time*30));

// 4*3 (pos, -z)
  k.pos.map((f,idx)=>(idx==2)?-f:f).forEach(f => { bs.setFloat32(f) });

// 4*4 (rot, -x/-y)
  let rot;
  if (is_T_pose) {
// not changing the original boneKey
    rot = k.rot.slice();
    MMD_SA.THREEX.utils.convert_T_pose_rotation_to_A_pose(k.name, rot);
  }
  else {
    rot = k.rot;
  }
  rot.map((f,idx)=>(idx==0||idx==1)?-f:f).forEach(f => { bs.setFloat32(f) });

// 64 (16*4 interp)
  for (let i = 0; i < 4; i++) {
    _interp.forEach(ui => { bs.setUint8(ui) });
  }
});

// 4 (morphKeys length)
bs.setUint32(morphKeys.length);

morphKeys.forEach(k => {
// 15 (morph name)
  bs.unicode_to_sjis(k.name, 15);

// 4 (frame number)
  bs.setUint32(Math.round(k.time*30));

// 4 (weight)
  bs.setFloat32(k.weight);
});

// 4 (CameraKey)
bs.setUint32(0);

// 4 (LightKey)
bs.setUint32(0);

//var hex = []; new Uint8Array(buffer).forEach(v=>{hex.push(v.toString(16).toUpperCase())}); console.log(hex)

System._browser.save_file(filename, buffer, 'application/octet-stream');

  };
})();
