const vertexShader = () => {
    return `
      #version 330
      varying float x;
      varying float y;
      varying float z;
      varying vec3 vUv;
      uniform float u_time;
      uniform float u_amplitude;
      uniform float[64] u_data_arr;

      void main() {
        vUv = position;
        x = abs(position.x);
	      y = abs(position.y);

        float floor_x = round(x);
	      float floor_y = round(y);

        float x_multiplier = (32.0 - x) / 8.0;
        float y_multiplier = (32.0 - y) / 8.0;

        z = sin(u_data_arr[int(floor_x)] / 50.0 + u_data_arr[int(floor_y)] / 50.0) * u_amplitude;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, z, 1.0);
      }
    `;
};

const vertexShader2D = () => {
    return`
    //#version 330

    uniform vec3 uTarget;
    uniform float uMaxVel;
    uniform float uDamp;
    uniform float uForceAmt;
    
    in vec3 iPosition;
    in vec3 iVelocity;
    in vec4 iColor;
    
    out vec3 oPosition;
    out vec3 oVelocity;
    out vec4 oColor;

    void main ()
    {	
      vec3 dir = uTarget - iPosition;
	    vec3 normDir = normalize(dir);
	    float dist = length(dir);
	
	    vec3 acc = normDir * uForceAmt; // magnitude 0.02
	    acc /= (dist*50.0)*(dist*50.0) + 1.0;
	
	    oVelocity =	iVelocity + acc;
	    oVelocity *= uDamp; // damp
    	oVelocity = clamp(oVelocity, vec3(-uMaxVel), vec3(uMaxVel));
	
	    oPosition = iPosition + oVelocity;
	    oColor = vec4(0.1, 0.4, 1.0, 1.0) * (length(oVelocity)*30.0 + 0.01);
    }
    `;
};

/*const vertexShader2D = () => {
  return`
    uniform sampler2D noiseTex;
    //uniform sampler2D vidTex;
    uniform float freq;

    uniform float freqRed;
    uniform float freqGreen;
    uniform float freqBlue;
    varying vec4 FragColor;

    void main ()
    {	
  
    vec2 texcoord = vec2(gl_textureMatrix[0] * gl_MultiTexCoord0);
    texcoord *= vec2(freq);
    vec4 noise = texture2D(noiseTex, texcoord);

    FragColor = vec4(abs(cos(noise.x*freqRed)), abs(sin(noise.x*freqGreen)), abs(cos((noise.x*freqBlue)+1000.0)), 1.0);

    gl_Position = projectionMatrix
       * modelViewMatrix
       * vec4(position.x, position.y, position.z, 1.0);  
    }
  `;
};*/

const fragmentSimulation = () => {
    return `
      uniform float time;
      uniform float delta;
      uniform sampler2D texturePosition;
      void main() 
      {
        
      vec2 uv = gl_FragCoorrd.xy / resolution.xy;
      vec4 tmpPos = texture2D( texturePosition, uv);
      vec3 position = tmpPos.xyz;

      gl_FragColor = vec4( position + vec3(0.001), 1.);
      }
    `;
};

const fragmentShader2D = () => {
  return `
    void main()
    {	
	    //gl_FragColor = gl_FragColor;
      //gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }  
  `;
}

export { vertexShader2D, fragmentShader2D, fragmentSimulation };