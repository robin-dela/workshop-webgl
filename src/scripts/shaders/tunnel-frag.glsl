// varying float noise;
varying vec2 vUv;
uniform vec2 resolution;

uniform vec3 color1;
uniform vec3 color2;
uniform float amount;

void main(){
  //vec2 uv = vUv / resolution;
  //gl_FragColor = vec4(1.0 * vUv.x, 0.0, 1.0 * vUv.y, 1.0);

  float p = abs(fract(amount*vUv.x)*2.0-1.0);
  vec3 col = mix(color1, color2, vec3(p));
  gl_FragColor = vec4(col, 1.0);
}
