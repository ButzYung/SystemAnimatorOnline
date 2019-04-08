MMD.FragmentShaderSource = '''

  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vTextureCoord;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec4 vLightCoord;

  uniform vec3 uLightDirection; // light source direction in world space
  uniform vec3 uLightColor;

  uniform vec3 uAmbientColor;
  uniform vec3 uSpecularColor;
  uniform vec3 uDiffuseColor;
  uniform float uAlpha;
  uniform float uShininess;

  uniform bool uUseTexture;
  uniform bool uUseSphereMap;
  uniform bool uIsSphereMapAdditive;

  uniform sampler2D uToon;
  uniform sampler2D uTexture;
  uniform sampler2D uSphereMap;

  uniform bool uEdge;
  uniform float uEdgeThickness;
  uniform vec3 uEdgeColor;

  uniform bool uGenerateShadowMap;
  uniform bool uSelfShadow;
  uniform sampler2D uShadowMap;

  uniform bool uAxis;
  uniform vec3 uAxisColor;
  uniform bool uCenterPoint;

  // from http://spidergl.org/example.php?id=6
  vec4 pack_depth(const in float depth) {
    const vec4 bit_shift = vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0);
    const vec4 bit_mask  = vec4(0.0, 1.0/256.0, 1.0/256.0, 1.0/256.0);
    vec4 res = fract(depth * bit_shift);
    res -= res.xxyz * bit_mask;
    return res;
  }
  float unpack_depth(const in vec4 rgba_depth)
  {
    const vec4 bit_shift = vec4(1.0/(256.0*256.0*256.0), 1.0/(256.0*256.0), 1.0/256.0, 1.0);
    float depth = dot(rgba_depth, bit_shift);
    return depth;
  }

  void main() {
    if (uGenerateShadowMap) {
      //gl_FragData[0] = pack_depth(gl_FragCoord.z);
      gl_FragColor = pack_depth(gl_FragCoord.z);
      return;
    }
    if (uAxis) {
      gl_FragColor = vec4(uAxisColor, 1.0);
      return;
    }
    if (uCenterPoint) {
      vec2 uv = gl_PointCoord * 2.0 - 1.0; // transform [0, 1] -> [-1, 1] coord systems
      float w = dot(uv, uv);
      if (w < 0.3 || (w > 0.5 && w < 1.0)) {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
      } else {
        discard;
      }
      return;
    }

    // vectors are in view space
    vec3 norm = normalize(vNormal); // each point's normal vector in view space
    vec3 cameraDirection = normalize(-vPosition); // camera located at origin in view space

    vec3 color;
    float alpha = uAlpha;

    if (uEdge) {

      color = uEdgeColor;

    } else {

      color = vec3(1.0, 1.0, 1.0);
      if (uUseTexture) {
        vec4 texColor = texture2D(uTexture, vTextureCoord);
        color *= texColor.rgb;
        alpha *= texColor.a;
      }
      if (uUseSphereMap) {
        vec2 sphereCoord = 0.5 * (1.0 + vec2(1.0, -1.0) * norm.xy);
        if (uIsSphereMapAdditive) {
          color += texture2D(uSphereMap, sphereCoord).rgb;
        } else {
          color *= texture2D(uSphereMap, sphereCoord).rgb;
        }
      }

      // specular component
      vec3 halfAngle = normalize(uLightDirection + cameraDirection);
      float specularWeight = pow( max(0.001, dot(halfAngle, norm)) , uShininess );
      //float specularWeight = pow( max(0.0, dot(reflect(-uLightDirection, norm), cameraDirection)) , uShininess ); // another definition
      vec3 specular = specularWeight * uSpecularColor;

      vec2 toonCoord = vec2(0.0, 0.5 * (1.0 - dot( uLightDirection, norm )));

      if (uSelfShadow) {
        vec3 lightCoord = vLightCoord.xyz / vLightCoord.w; // projection to texture coordinate (in light space)
        vec4 rgbaDepth = texture2D(uShadowMap, lightCoord.xy);
        float depth = unpack_depth(rgbaDepth);
        if (depth < lightCoord.z - 0.01) {
          toonCoord = vec2(0.0, 0.55);
        }
      }

      color *= uAmbientColor + uLightColor * (uDiffuseColor + specular);

      color = clamp(color, 0.0, 1.0);
      color *= texture2D(uToon, toonCoord).rgb;

    }
    gl_FragColor = vec4(color, alpha);

  }

'''
