/**
 * @author spite / http://www.clicktorelease.com/
 * @author mrdoob / http://mrdoob.com/
 */

//https://github.com/mrdoob/three.js/wiki/Migration-Guide

THREE.BufferGeometryUtils = {

fromGeometry: function geometryToBufferGeometry( geometry, settings ) {

    if ( geometry instanceof THREE.BufferGeometry ) {

        return geometry;

    }

    settings = settings || { 'vertexColors': THREE.NoColors };

    var vertices = geometry.vertices;
    var faces = geometry.faces;
    var faceVertexUvs = geometry.faceVertexUvs;
    var vertexColors = settings.vertexColors;
    var hasFaceVertexUv = faceVertexUvs[ 0 ].length > 0;

// AT: Face4
var is_Face4 = faces[0] instanceof THREE.Face4;
var face_mod = (is_Face4) ? 2 : 1;

    var bufferGeometry = new THREE.BufferGeometry();

    bufferGeometry.attributes = {

        position: {
// AT: needsUpdate
needsUpdate: true,
            itemSize: 3,
            array: new Float32Array( faces.length * 3 * 3 *face_mod)
        },
        normal: {
// AT: needsUpdate
needsUpdate: true,
            itemSize: 3,
            array: new Float32Array( faces.length * 3 * 3 *face_mod)
        }

    }

    var positions = bufferGeometry.attributes.position.array;
    var normals = bufferGeometry.attributes.normal.array;

    if ( vertexColors !== THREE.NoColors ) {

        bufferGeometry.attributes.color = {
// AT: needsUpdate
needsUpdate: true,
            itemSize: 3,
            array: new Float32Array( faces.length * 3 * 3 *face_mod)
        };

        var colors = bufferGeometry.attributes.color.array;

    }

    if ( hasFaceVertexUv === true ) {

        bufferGeometry.attributes.uv = {
// AT: needsUpdate
needsUpdate: true,
            itemSize: 2,
            array: new Float32Array( faces.length * 3 * 2 *face_mod)
        };

        var uvs = bufferGeometry.attributes.uv.array;

    }

    var i2 = 0, i3 = 0;

    for ( var i = 0; i < faces.length; i ++ ) {

        var face = faces[ i ];

        var a = vertices[ face.a ];
        var b = vertices[ face.b ];
        var c = vertices[ face.c ];
// AT: Face4
var d = (is_Face4) ? vertices[ face.d ] : null;

        positions[ i3     ] = a.x;
        positions[ i3 + 1 ] = a.y;
        positions[ i3 + 2 ] = a.z;

        positions[ i3 + 3 ] = b.x;
        positions[ i3 + 4 ] = b.y;
        positions[ i3 + 5 ] = b.z;

        positions[ i3 + 6 ] = c.x;
        positions[ i3 + 7 ] = c.y;
        positions[ i3 + 8 ] = c.z;

// AT: Face4
if (is_Face4) {
        positions[ i3 +  9 ] = a.x;
        positions[ i3 + 10 ] = a.y;
        positions[ i3 + 11 ] = a.z;

        positions[ i3 + 12 ] = d.x;
        positions[ i3 + 13 ] = d.y;
        positions[ i3 + 14 ] = d.z;

        positions[ i3 + 15 ] = c.x;
        positions[ i3 + 16 ] = c.y;
        positions[ i3 + 17 ] = c.z;
}

        var na = face.vertexNormals[ 0 ];
        var nb = face.vertexNormals[ 1 ];
        var nc = face.vertexNormals[ 2 ];
// AT: Face4
var nd = face.vertexNormals[ 3 ];

        normals[ i3     ] = na.x;
        normals[ i3 + 1 ] = na.y;
        normals[ i3 + 2 ] = na.z;

        normals[ i3 + 3 ] = nb.x;
        normals[ i3 + 4 ] = nb.y;
        normals[ i3 + 5 ] = nb.z;

        normals[ i3 + 6 ] = nc.x;
        normals[ i3 + 7 ] = nc.y;
        normals[ i3 + 8 ] = nc.z;

// AT: Face4
if (is_Face4) {
        normals[ i3 +  9 ] = na.x;
        normals[ i3 + 10 ] = na.y;
        normals[ i3 + 11 ] = na.z;

        normals[ i3 + 12 ] = nd.x;
        normals[ i3 + 13 ] = nd.y;
        normals[ i3 + 14 ] = nd.z;

        normals[ i3 + 15 ] = nc.x;
        normals[ i3 + 16 ] = nc.y;
        normals[ i3 + 17 ] = nc.z;
}

        if ( vertexColors === THREE.FaceColors ) {

            var fc = face.color;

            colors[ i3     ] = fc.r;
            colors[ i3 + 1 ] = fc.g;
            colors[ i3 + 2 ] = fc.b;

            colors[ i3 + 3 ] = fc.r;
            colors[ i3 + 4 ] = fc.g;
            colors[ i3 + 5 ] = fc.b;

            colors[ i3 + 6 ] = fc.r;
            colors[ i3 + 7 ] = fc.g;
            colors[ i3 + 8 ] = fc.b;

// AT: Face4
if (is_Face4) {
            colors[ i3 +  9 ] = fc.r;
            colors[ i3 + 10 ] = fc.g;
            colors[ i3 + 11 ] = fc.b;

            colors[ i3 + 12 ] = fc.r;
            colors[ i3 + 13 ] = fc.g;
            colors[ i3 + 14 ] = fc.b;

            colors[ i3 + 15 ] = fc.r;
            colors[ i3 + 16 ] = fc.g;
            colors[ i3 + 17 ] = fc.b;
}
        } else if ( vertexColors === THREE.VertexColors ) {

            var vca = face.vertexColors[ 0 ];
            var vcb = face.vertexColors[ 1 ];
            var vcc = face.vertexColors[ 2 ];
// AT: Face4
var vcd = face.vertexColors[ 3 ];

            colors[ i3     ] = vca.r;
            colors[ i3 + 1 ] = vca.g;
            colors[ i3 + 2 ] = vca.b;

            colors[ i3 + 3 ] = vcb.r;
            colors[ i3 + 4 ] = vcb.g;
            colors[ i3 + 5 ] = vcb.b;

            colors[ i3 + 6 ] = vcc.r;
            colors[ i3 + 7 ] = vcc.g;
            colors[ i3 + 8 ] = vcc.b;

// AT: Face4
if (is_Face4) {
            colors[ i3 +  9 ] = vca.r;
            colors[ i3 + 10 ] = vca.g;
            colors[ i3 + 11 ] = vca.b;

            colors[ i3 + 12 ] = vcd.r;
            colors[ i3 + 13 ] = vcd.g;
            colors[ i3 + 14 ] = vcd.b;

            colors[ i3 + 15 ] = vcc.r;
            colors[ i3 + 16 ] = vcc.g;
            colors[ i3 + 17 ] = vcc.b;
}
        }

        if ( hasFaceVertexUv === true ) {

            var uva = faceVertexUvs[ 0 ][ i ][ 0 ];
            var uvb = faceVertexUvs[ 0 ][ i ][ 1 ];
            var uvc = faceVertexUvs[ 0 ][ i ][ 2 ];
// AT: Face4
var uvd = faceVertexUvs[ 0 ][ i ][ 3 ];

            uvs[ i2     ] = uva.x;
            uvs[ i2 + 1 ] = uva.y;

            uvs[ i2 + 2 ] = uvb.x;
            uvs[ i2 + 3 ] = uvb.y;

            uvs[ i2 + 4 ] = uvc.x;
            uvs[ i2 + 5 ] = uvc.y;

if (is_Face4) {
            uvs[ i2 +  6 ] = uva.x;
            uvs[ i2 +  7 ] = uva.y;

            uvs[ i2 +  8 ] = uvd.x;
            uvs[ i2 +  9 ] = uvd.y;

            uvs[ i2 + 10 ] = uvc.x;
            uvs[ i2 + 11 ] = uvc.y;
}
        }

        i3 += 9 *face_mod;
        i2 += 6 *face_mod;

    }


// AT: custom
if (geometry.boundingSphere) {
  bufferGeometry.boundingSphere = geometry.boundingSphere
  bufferGeometry.boundingBox = geometry.boundingBox
  bufferGeometry.boundingBox_list = geometry.boundingBox_list
}
else
    bufferGeometry.computeBoundingSphere();
console.log(geometry)
console.log(bufferGeometry)

    return bufferGeometry;

}

};

// AT: custom
// AT: TEST

THREE.PlaneBufferGeometry = function ( width, height, widthSegments, heightSegments ) {
  return THREE.BufferGeometryUtils.fromGeometry(new THREE.PlaneGeometry( width, height, widthSegments, heightSegments))
//  THREE.PlaneGeometry.call(this, width, height, widthSegments, heightSegments);
//  THREE.Geometry.call( this );

//  Object.assign(this, THREE.BufferGeometryUtils.fromGeometry(new THREE.PlaneGeometry( width, height, widthSegments, heightSegments)));
}

THREE.SphereBufferGeometry = function ( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength ) {
  return THREE.BufferGeometryUtils.fromGeometry(new THREE.SphereGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength ))
}
