/*!
 * jThree.XFile.js JavaScript Library v1.1
 * http://www.jthree.com/
 *
 * Requires jThree v2.0.0
 * Includes XLoader.js | Copyright (c) 2014 Matsuda Mitsuhide
 *
 * The MIT License
 *
 * Copyright (c) 2014 Matsuda Mitsuhide
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Date: 2014-09-12
 */

THREE.XLoader = function( url, fn, error ) {
	this.txrPath = /\//.test( url ) ? url.slice( 0, url.lastIndexOf( "/" ) + 1 ) : "";
// AT: url
this.url = url
	this.onload = fn;
	this.onerror = error;

	this.mode = null;
	this.modeArr = [];
	this.uvIdx = [];
	this.txrs = {};
	this.nArr = [];
	this.uvArr = [];
	this.vColors = [];
	this.vId = {};
	this.txrLength = 0;
	this.meshNormalsVector = [];

	this.gmt = new THREE.Geometry;
	this.mtrs = new THREE.MeshFaceMaterial;

// AT: XMLHttpRequestZIP
	var xhr = new XMLHttpRequestZIP;
	var that = this;

	xhr.onload = function() {
// AT: Ignore xhr.status, since it may be 0 for offline load.
		if (1 || xhr.status === 200 ) {
			that.parse( xhr.response );
		} else {
			that.onerror && that.onerror( url, xhr.statusText );
		}
		that = xhr = null;
	};
	xhr.onerror = function() {
		that.onerror && that.onerror( url, xhr.statusText );
	};
	xhr.open( 'GET', url, true );
//xhr.overrideMimeType('text\/plain; charset=x-user-defined');
	xhr.responseType = 'text';
	xhr.send();

};

THREE.XLoader.prototype = {
	constructor: THREE.XLoader,
	parse: function( text ) {

		var that = this;

		text.replace( /^xof[\s.]+?\r\n/, "" ).split( "\r\n" ).forEach( function( row ) {
			that.decision( row );
		} );

		if ( this.uvArr.length ) {
			this.uvIdx.forEach( function( arr ) {
				that.gmt.faceVertexUvs[ 0 ].push( [ that.uvArr[ arr[ 0 ] ], that.uvArr[ arr[ 1 ] ], that.uvArr[ arr[ 2 ] ], that.uvArr[ arr[ 3 ] ] ] );
			} );
/*
var uv_x_min = []
var uv_x_max = []
var uv_y_min = []
var uv_y_max = []
for (var i = 0; i < 20; i++) {
  uv_x_min[i] =  999
  uv_x_max[i] = -999
  uv_y_min[i] =  999
  uv_y_max[i] = -999
}

this.gmt.faces.forEach( function( face, idx ) {
  var m_index = face.materialIndex
  that.gmt.faceVertexUvs[ 0 ][idx].forEach(function (uv) {
if (!uv) return
    uv_x_min[m_index] = Math.min(uv_x_min[m_index], uv.x)
    uv_x_max[m_index] = Math.max(uv_x_max[m_index], uv.x)
    uv_y_min[m_index] = Math.min(uv_y_min[m_index], uv.y)
    uv_y_max[m_index] = Math.max(uv_y_max[m_index], uv.y)
  });
});

for (var i = 0; i < 20; i++) {
  if (uv_x_min[i] ==  999)
    break

  var map = this.mtrs.materials[i].map
  if (!map)
    continue

  var x_repeat = Math.round(Math.max(Math.abs(uv_x_min[i]), Math.abs(uv_x_max[i])-1))
  var y_repeat = Math.round(Math.max(Math.abs(uv_y_min[i]), Math.abs(uv_y_max[i])-1))
  if (!x_repeat && !y_repeat)
    continue

  map.wrapS = map.wrapT = THREE.RepeatWrapping;
//  map.repeat.set(2, 2)
//  map.needsUpdate = true

  console.log(uv_x_min[i]+','+uv_y_min[i]+'/'+uv_x_max[i]+','+uv_y_max[i])
}
*/
		}

		if ( this.vColors.length ) {
			this.gmt.faces.forEach( function( face ) {
				face.vertexColors = [ that.vColors[ face.a ], that.vColors[ face.b ], that.vColors[ face.c ] ];
				isFinite( face.d ) && ( face.vertexColors[ 3 ] = that.vColors[ face.d ] );
			} );
		}

		this.gmt.computeCentroids();
// AT: always compute face normals (mainly for better collision detetction)
//		!this.meshNormalsVector.length && this.gmt.computeFaceNormals();
this.gmt.computeFaceNormals();
		this.gmt.computeVertexNormals();
// AT: boundings
if (self.MMD_SA) {
  this.gmt.computeBoundingBox();
  this.gmt.boundingSphere = this.gmt.boundingBox.getBoundingSphere();
  console.log(toLocalPath(this.txrPath)+'\n'+JSON.stringify(this.gmt.boundingBox))

//  this.gmt = THREE.BufferGeometryUtils.fromGeometry(this.gmt)
}
		!this.txrLength && this.onload( new THREE.Mesh( this.gmt, this.mtrs ) );

// AT: need to keep .txrPath
//		this.txrPath =
		this.mode =
		this.modeArr =
		this.uvIdx =
		this.txrs =
		this.nArr =
		this.uvArr =
		this.vColors =
		this.meshNormalsVector =
		this.vId = null;

	},
	decision: function ( row ) {

		if ( !row || /^\s+$/.test( row ) ) return;

		if ( /{.+?}/.test( row ) ) {
			if ( /^\s*TextureFilename/.test( row ) ) {
				this.TextureFilename( row.match( /{\s*(.+)?\s*}/ )[ 1 ] );
			}
			return;
		} else if ( /{/.test( row ) ) {
			this.modeArr.push( this.mode );
			this.mode = row.match( /^\s*([a-zA-Z]+)/ )[ 1 ];
			this.nArr.push( this.n );
			this.n = 0;
			return;
		} else if ( /}/.test( row ) ) {
			this.mode = this.modeArr.pop();
			this.n = this.nArr.pop();
			return;
		}

		if ( this.mode && !/^(Header|template)$/.test( this.mode ) ) {
			this.n++;
			this[ this.mode ] && this[ this.mode ]( row );
		}

	},
	toRgb: function( r, g, b ) {
		return "rgb(" + Math.floor( r * 100 ) + "%," + Math.floor( g * 100 ) + "%," + Math.floor( b * 100 ) + "%)";
	},
	Mesh: function( row ) {

		row = row.split( ";" );

		if ( row.length === 2 && row[ 1 ] === "" ) {
			return;
		} else if ( row.length === 3 || row[ 2 ] === "" || row.length === 2 && /,/.test( row[ 1 ] ) ) {//face

			var num = row[ 1 ].split( "," );

			if ( /3/.test( row[ 0 ] ) ) {//face3

				this.gmt.faces.push( new THREE.Face3( +num[ 2 ], +num[ 1 ], +num[ 0 ] ) );
				this.uvIdx.push( [ +num[ 2 ], +num[ 1 ], +num[ 0 ] ] );

			} else {//face4

				this.gmt.faces.push( new THREE.Face4( +num[ 3 ], +num[ 2 ], +num[ 1 ], +num[ 0 ] ) );
				this.uvIdx.push( [ +num[ 3 ], +num[ 2 ], +num[ 1 ], +num[ 0 ] ] );

			}

		} else {//vector

			var id = row.join( ";" ), v = this.vId[ id ] = this.vId[ id ] || new THREE.Vector3( +row[ 0 ], +row[ 1 ], -row[ 2 ] );
			this.gmt.vertices.push( v );

		}

	},
	MeshNormals: function( row ) {

		row = row.split( ";" );

		if ( row.length === 2 ) {
			return;
		} else if ( row.length === 3 || row[ 2 ] === "" ) {//face

			!this.faceN && ( this.faceN = this.n );

			var num = row[ 1 ].split( "," );

			//Correct probably face.vertexNormals...
			if ( /3/.test( row[ 0 ] ) ) {//face3

				this.gmt.faces[ this.n - this.faceN ].normal = this.meshNormalsVector[ +num[ 0 ] ];

			} else {//face4

				this.gmt.faces[ this.n - this.faceN ].normal = this.meshNormalsVector[ +num[ 0 ] ];

			}

		} else {//vector

			this.meshNormalsVector.push( new THREE.Vector3( +row[ 0 ], +row[ 1 ], -row[ 2 ] ) );

		}

	},
	MeshMaterialList: function( row ) {
		if ( this.n < 3 ) return;
		this.gmt.faces[ this.n - 3 ].materialIndex = +row.match( /[0-9]+/ )[ 0 ];
/*
if (this.gmt.faces[ this.n - 3 ].materialIndex==0) {
  if (!this._TEMP_face_)
    this._TEMP_face_=[]
  this._TEMP_face_.push(this.gmt.faces[ this.n - 3 ])
}
*/
	},
	Material: function( row ) {
		row = row.split( ";" );

		if ( this.n === 1 ) {
			this.mtr = new THREE.MeshPhongMaterial( { ambient: "#444", color: this.toRgb( row[ 0 ], row[ 1 ], row[ 2 ] ), opacity: +row[ 3 ] } );

// AT: material_para
var material_para = this.material_para[this.mtrs.materials.length] || this.material_para._default_ || {}
if (material_para.side == 2)
  this.mtr.side = THREE.DoubleSide
if (material_para.transparent === false)
  this.mtr.transparent = false
if (material_para.opacity != null)
  this.mtr.opacity = material_para.opacity
if (material_para.alphaTest != null)
  this.mtr.alphaTest = material_para.alphaTest
this.transparency_check(material_para)

// AT: base color (will be reverted if the material has texture)
this.mtr.base_color = [row[ 0 ], row[ 1 ], row[ 2 ]].join(",")
this.mtr.color.setStyle("#FFF")
this.mtr.ambient.setStyle(material_para.ambient || "#FFF")

			this.mtrs.materials.push( this.mtr );
		} else if ( this.n === 2 ) {
			this.mtr.shininess = + row[ 0 ];
		} else if ( this.n === 3 ) {
//this.mtr.specular.setStyle("rgb(100%,100%,100%)")
			this.mtr.specular.setStyle( this.toRgb( row[ 0 ], row[ 1 ], row[ 2 ] ) );
//console.log([row[ 0 ], row[ 1 ], row[ 2 ]].join(","))
		} else if ( this.n === 4 ) {
			this.mtr.emissive.setStyle( this.toRgb( row[ 0 ], row[ 1 ], row[ 2 ] ) );
		}

	},

// AT: transparency_check
transparency_check: (function () {
  var material_count = 0
  var opaque_count = 0
  window.addEventListener("MMDStarted", function () {
    if (material_count)
      console.log("X object opaque/total material count:" + opaque_count+'/'+material_count)
  });

  return function (material_para, tex_src) {
    if (!tex_src) {
      material_count++
// default
      if (this.mtr.opacity == 1) this.mtr.transparent = false
      if (!this.mtr.transparent) opaque_count++
      return
    }

    if ((material_para.transparent === false) || ((this.mtr.opacity == 1) && /\.jpg$/i.test(tex_src) && !/\.jpga\.jpg$/i.test(tex_src))) {
      this.mtr.transparent = false
    }
    else {
      this.mtr.transparent = true
      opaque_count--
    }
  };
})(),

	TextureFilename: function( row ) {
//console.log(this.txrPath + ',' + row)
		row = row.split( '"' )[ 1 ].split( "\\" ).join( "/" ).split( "*" )[ 0 ];
// AT: utf-8
/*
var row_array = []
//var index_utf8 = 0
for (var i = 0; i < row.length; i++) {
  var c = row.charAt(i)
  if (c.charCodeAt(0) <= 255) {
    row_array.push(c)
//    index_utf8++
  }
  else {
    row_array.push(encodeURIComponent(c).replace(/\%([0-9A-F]{2})/g, function (match, p1) { console.log("0x" + p1); return String.fromCharCode(parseInt("0x" + p1)); }))
//    row_array[index_utf8] = (row_array[index_utf8]||"") + encodeURIComponent(c)
  }
}

var row_utf8 = row_array.map(function (c) {
  if (c.length == 1)
    return c
  return utf8.encode(c)
}).join("");
console.log(row_utf8)
*/
//console.log(encodeURIComponent(row))
//console.log("瓦".charCodeAt(0).toString(16))
//console.log("\uEFBF")
//console.log("\xEF".charCodeAt(0))
//console.log(row+'/'+row.codePointAt(0)+'/'+row.charCodeAt(0)+'/'+encodeURIComponent(row)+'/'+row.length)

// AT: material_para
var material_para = this.material_para[this.mtrs.materials.length-1] || this.material_para._default_ || {}

// AT: revert base color
if (this.mtr.base_color) {
  this.mtr.color.setArray(this.mtr.base_color.split(",").map(function (c) { return parseFloat(c) * 255; }))
  this.mtr.base_color = null
  this.mtr.ambient.setStyle(material_para.ambient || "#444")
}

		if ( this.txrs[ row ] ) {
			this.mtr.map = this.txrs[ row ];
// AT: transparency_check
this.transparency_check(material_para, row)
			return;
		}

// AT: check if file exists
if (self.MMD_SA) {
  if (!FSO_OBJ.FileExists(toLocalPath(this.txrPath + row))) {
    console.error("Texture file not found (" + toLocalPath(this.txrPath + row) + ")")
    return
  }
}

		var that = this;
		this.txrLength++;

// AT: child animation as texture
if (self.MMD_SA && MMD_SA_options.child_animation_as_texture && MMD_SA_options.child_animation_as_texture_swap_list) {
  var texture_swapped = 0
  MMD_SA_options.child_animation_as_texture_swap_list.forEach(function (filename, idx) {
    if (row.indexOf(filename) == -1)
      return

    that.mtr.map = that.txrs[ row ] = jThree('#ChildAnimation' + idx + 'TXR').three(0)
    texture_swapped++
  });

  if (texture_swapped) {
    if ( --that.txrLength == 0 )
      that.onload( new THREE.Mesh( that.gmt, that.mtrs ) )
    return
  }
}

// AT: normal map, specular map, etc
if (self.MMD_SA) {
  var is_zip = /\.zip\#/i.test(toLocalPath(this.txrPath))

  var row_normalMap = row.replace(/\.(png|jpg|bmp|jpeg|tga)$/i, "_normal." + ((material_para.use_normal_jpg)?"jpg":"png"))
  var normalMap = this.txrPath + row_normalMap
  if (material_para.use_normal || ((browser_native_mode || is_zip) ? material_para.use_normal : FSO_OBJ.FileExists(toLocalPath(normalMap)))) {
		if ( this.txrs[ row_normalMap ] ) {
			this.mtr.normalMap = this.txrs[ row_normalMap ];
			return;
		}
		this.txrLength++;
		this.mtr.normalMap = this.txrs[ row_normalMap ] = THREE.ImageUtils.loadTexture( this.txrPath + row_normalMap, undefined, function() {
			if ( --that.txrLength ) return;
			that.onload( new THREE.Mesh( that.gmt, that.mtrs ) );
			that = null;
		}, function() {
			if ( --that.txrLength ) return;
			that.onerror( new THREE.Mesh( that.gmt, that.mtrs ) );
			that = null;
		} );
// AT: always us RepeatWrapping
this.mtr.normalMap.wrapS = this.mtr.normalMap.wrapT = THREE.RepeatWrapping;
console.log("Normal map", row_normalMap)
  }

  var row_specularMap = row.replace(/\.(png|jpg|bmp|jpeg|tga)$/i, "_specular." + ((material_para.use_specular_jpg)?"jpg":"png"))
  var specularMap = this.txrPath + row_specularMap
  if (material_para.use_specular || ((browser_native_mode || is_zip) ? material_para.use_specular : FSO_OBJ.FileExists(toLocalPath(specularMap)))) {
		if ( this.txrs[ row_specularMap ] ) {
			this.mtr.specularMap = this.txrs[ row_specularMap ];
			return;
		}
		this.txrLength++;
		this.mtr.specularMap = this.txrs[ row_specularMap ] = THREE.ImageUtils.loadTexture( this.txrPath + row_specularMap, undefined, function(tex_specular) {
var row_metalMap = row.replace(/\.(png|jpg|bmp|jpeg|tga)$/i, "_metalness." + ((material_para.use_metalness_jpg)?"jpg":"png"))
var metalMap = that.txrPath + row_metalMap
if (material_para.use_metalness || ((browser_native_mode || is_zip) ? material_para.use_metalness : FSO_OBJ.FileExists(toLocalPath(metalMap)))) {
  THREE.ImageUtils.loadTexture( that.txrPath + row_metalMap, undefined, function(tex_metal) {
    let canvas = document.createElement("canvas")
    let w = canvas.width  = tex_specular.image.width
    let h = canvas.height = tex_specular.image.height
    let ctx = canvas.getContext("2d")
    ctx.drawImage(tex_specular.image, 0,0)
    let s_image = ctx.getImageData(0,0,w,h)
    let s_data = s_image.data
    ctx.drawImage(tex_metal.image, 0,0,tex_metal.image.width,tex_metal.image.height, 0,0,w,h)
    let m_data = ctx.getImageData(0,0,w,h).data
    for (var i = 0, i_length = s_data.length; i < i_length; i+=4) {
      s_data[i+1] = m_data[i+1]
    }
    ctx.putImageData(s_image, 0,0)

    tex_metal.image = canvas
    s_image = s_data = m_data = undefined
    console.log("Metal map merged with specular map", row_metalMap)

			if ( --that.txrLength ) return;
			that.onload( new THREE.Mesh( that.gmt, that.mtrs ) );
			that = null;
  });
  return;
}
else if (!material_para.use_specular_as_metalness) {
    let canvas = document.createElement("canvas")
    let w = canvas.width  = tex_specular.image.width
    let h = canvas.height = tex_specular.image.height
    let ctx = canvas.getContext("2d")
    ctx.drawImage(tex_specular.image, 0,0)
    let s_image = ctx.getImageData(0,0,w,h)
    let s_data = s_image.data
    for (var i = 0, i_length = s_data.length; i < i_length; i+=4) {
      s_data[i+1] = s_data[i+2] = 0
    }
    ctx.putImageData(s_image, 0,0)

    tex_specular.image = canvas
    s_image = s_data = undefined
}

			if ( --that.txrLength ) return;
			that.onload( new THREE.Mesh( that.gmt, that.mtrs ) );
			that = null;
		}, function() {
			if ( --that.txrLength ) return;
			that.onerror( new THREE.Mesh( that.gmt, that.mtrs ) );
			that = null;
		} );
this.mtr.specular.setStyle("rgb(100%,100%,100%)");
// AT: always us RepeatWrapping
this.mtr.specularMap.wrapS = this.mtr.specularMap.wrapT = THREE.RepeatWrapping;
console.log("Specular map", row_specularMap)
  }
}

		this.mtr.map = this.txrs[ row ] = THREE.ImageUtils.loadTexture( this.txrPath + row, undefined, function() {
			if ( --that.txrLength ) return;
			that.onload( new THREE.Mesh( that.gmt, that.mtrs ) );
			that = null;
		}, function() {
			if ( --that.txrLength ) return;
			that.onerror( new THREE.Mesh( that.gmt, that.mtrs ) );
			that = null;
		} );
// AT: always us RepeatWrapping
this.mtr.map.wrapS = this.mtr.map.wrapT = THREE.RepeatWrapping;
// AT: transparency_check
this.transparency_check(material_para, row)
	},
	MeshTextureCoords: function( row ) {
		if ( this.n === 1 ) return;
		row = row.split( ";" );
		var v;
		row[1] = 1 - row[1]; // reverse V
//if (this.uvArr.length==3) DEBUG_show(row+"\n",0,1)
		// adjustment
		v = +row[0];
// AT: always use RepeatWrapping, so no need to adjust uv
/*
// AT: avoid (1 % 1)
if (v!=1)
		v = v % 1.0;
		if ( v < 0 ) {
			v += 1;
		}
*/
		row[0] = v;
		v = row[1];
// AT: always use RepeatWrapping, so no need to adjust uv
/*
// AT: avoid (1 % 1)
if (v!=1)
		v = v % 1.0;
		if ( v < 0 ) {
			v += 1;
		}
*/
		row[1] = v;
//if (this.uvArr.length==3) DEBUG_show(row+"\n",0,1)
		this.uvArr.push( new THREE.Vector2( row[ 0 ], row[ 1 ] ) );
	},
	MeshVertexColors: function( row ) {
		return;
		if ( this.n === 1 ) {
			this.mtrs.materials.forEach( function( mtr ) {
				this.vertexColors = THREE.VertexColors;
			} );
			return;
		}
		row = row.split( ";" );
		this.vColors[ +row[ 0 ] ] = new THREE.Color( this.toRgb( row[ 1 ], row[ 2 ], row[ 3 ] ) );

	}

// AT: material_para
 ,_material_para: null
 ,get material_para() {
if (this._material_para)
  return this._material_para

this._material_para = {}
if (self.MMD_SA) {
  var model_filename = toLocalPath(this.url).replace(/^.+[\/\\]/, "")
  var model_filename_cleaned = model_filename.replace(/[\-\_]copy\d+\.x$/, ".x").replace(/[\-\_]v\d+\.x$/, ".x")
  var model_para = MMD_SA_options.model_para[model_filename] || MMD_SA_options.model_para[model_filename_cleaned]
  this._material_para = (model_para && model_para.material_para) || this._material_para
//console.log(999, model_filename_cleaned, this._material_para)
}

return this._material_para
  }

};

jThree.modelHooks.x = function( url, loaded, errored ) {
	new THREE.XLoader( url, function( mesh ) {
// AT: fix an unknown bug, and castShadow
if (!loaded) return
//console.log(mesh)
//mesh.castShadow=true
//if (self.MMD_SA) mesh.castShadow = !!MMD_SA_options.use_shadowMap;
		loaded( mesh );
		loaded = errored = null;
	}, function() {
		errored();
		loaded = errored = null;
	} );
};