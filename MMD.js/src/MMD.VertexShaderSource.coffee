MMD.VertexShaderSource = '''

  uniform mat4 uMVMatrix; // model-view matrix (model -> view space)
  uniform mat4 uPMatrix; // projection matrix (view -> projection space)
  uniform mat4 uNMatrix; // normal matrix (inverse of transpose of model-view matrix)

  uniform mat4 uLightMatrix; // mvpdMatrix of light space (model -> display space)

  attribute vec3 aVertexNormal;
  attribute vec2 aTextureCoord;
  attribute float aVertexEdge; // 0 or 1. 1 if the vertex has an edge. (becuase we can't pass bool to attributes)

  attribute float aBoneWeight;
  attribute vec3 aVectorFromBone1;
  attribute vec3 aVectorFromBone2;
  attribute vec4 aBone1Rotation;
  attribute vec4 aBone2Rotation;
  attribute vec3 aBone1Position;
  attribute vec3 aBone2Position;

  attribute vec3 aMultiPurposeVector;

  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vTextureCoord;
  varying vec4 vLightCoord; // coordinate in light space; to be mapped onto shadow map

  uniform float uEdgeThickness;
  uniform bool uEdge;

  uniform bool uGenerateShadowMap;

  uniform bool uSelfShadow;

  uniform bool uAxis;
  uniform bool uCenterPoint;

  vec3 qtransform(vec4 q, vec3 v) {
    return v + 2.0 * cross(cross(v, q.xyz) - q.w*v, q.xyz);
  }

  void main() {
    vec3 position;
    vec3 normal;

    if (uAxis || uCenterPoint) {

      position = aMultiPurposeVector;

    } else {

      float weight = aBoneWeight;
      vec3 morph = aMultiPurposeVector;

      position = qtransform(aBone1Rotation, aVectorFromBone1 + morph) + aBone1Position;
      normal = qtransform(aBone1Rotation, aVertexNormal);

      if (weight < 0.99) {
        vec3 p2 = qtransform(aBone2Rotation, aVectorFromBone2 + morph) + aBone2Position;
        vec3 n2 = qtransform(aBone2Rotation, normal);

        position = mix(p2, position, weight);
        normal = normalize(mix(n2, normal, weight));
      }
    }

    // return vertex point in projection space
    gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0);

    if (uCenterPoint) {
      gl_Position.z = 0.0; // always on top
      gl_PointSize = 16.0;
    }

    if (uGenerateShadowMap || uAxis || uCenterPoint) return;

    // for fragment shader
    vTextureCoord = aTextureCoord;
    vPosition = (uMVMatrix * vec4(position, 1.0)).xyz;
    vNormal = (uNMatrix * vec4(normal, 1.0)).xyz;

    if (uSelfShadow) {
      vLightCoord = uLightMatrix * vec4(position, 1.0);
    }

    if (uEdge) {
      vec4 pos = gl_Position;
      vec4 pos2 = uPMatrix * uMVMatrix * vec4(position + normal, 1.0);
      vec4 norm = normalize(pos2 - pos);
      gl_Position = pos + norm * uEdgeThickness * aVertexEdge * pos.w; // scale by pos.w to prevent becoming thicker when zoomed
      return;
    }
  }

'''
