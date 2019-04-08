/**
 * https://www.shadertoy.com/view/ltc3WH
 *
 * Ambilight Visualization 2.0
 */

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

/**
 * codes modified to work on System Animator, by Butz Yung/Anime Theme
 * http://www.animetheme.com/sidebar/
 */

THREE.AmbilightVisualization2 = {

	uniforms: {
	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

'const float bands = 20.0;',
'const float leds = 25.0;',
'const float colorRange = 0.3; // >0. (=1. full color range, >1. repeat colors)',
'',
'',
'//convert HSV to RGB',
'vec3 hsv2rgb(vec3 c){',
'    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);',
'    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);',
'    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);',
'}',
'',
'',
'void mainImage( out vec4 fragColor, in vec2 fragCoord )',
'{',
'    // middle = (0/0)',
'    vec2 k=(fragCoord.xy-.5*iResolution.xy)/(max(iResolution.x,iResolution.y));',
'        ',
'    ',
'    ',
'    //distance from the middle',
'    float dis = distance(k , vec2(0)); ',
'    ',
'    //and approximated by "leds"',
'    float disA = floor(dis*leds)/leds;',
'    //disA = dis;',
'    ',
'    ',
'    //degree from bottom 0 and top 1.0.  /left right symetric ',
'    float deg = acos(k.y/dis)/3.14;',
'    ',
'    //and approximated by "bands"',
'    float degA = floor(deg*bands)/bands;',
'    ',
'    ',
'    ',
'   //colorwheel, dark in the middle, changing colors over time',
'    vec3 color = hsv2rgb(  vec3( degA*colorRange + iGlobalTime*0.07 , 1.0 , smoothstep(0.0, 0.6, disA) )  );',
'    ',
'    ',
'    ',
'	//brightness of a band by fourier (degree to frequency / magnitude to brightness)',
'    float bandBrightness = texture2D( iChannel0, vec2(degA,0.25)).x;',
'    ',
'    ',
'    //more blinky blinky x^2',
'    color*=bandBrightness*bandBrightness;',
'    ',
'    //brighter',
'    color*=4.;',
'    ',
'',
'    ',
'    float deltaDeg = fract((deg-degA)*bands) - 0.5;',
'    float deltaDis = fract((dis-disA)*leds) - 0.5;',
'    ',
'    float shape = smoothstep(0.5, 0.35, abs(deltaDeg)) *',
'                smoothstep(0.5, 0.35, abs(deltaDis));',
'    ',
'    ',
'    color*=shape;',
'    ',
'	//return',
'    fragColor = vec4(color, 1.0);',
'}',


		"void main() {",
MMD_SA.MME_PPE_main("AmbilightVisualization2"),
		"}"

	].join( "\n" ),

	_refreshUniforms: function (refresh_all_uniforms) {
MMD_SA.MME_PPE_refreshUniforms.call(this, "AmbilightVisualization2", refresh_all_uniforms)
	},

	_init: function () {
MMD_SA.MME_PPE_init.call(this, "AmbilightVisualization2", ['[music canvas]'])
	}

};

// init
THREE.AmbilightVisualization2._init();
