// #pragma glslify: pnoise = require(glsl-noise/periodic/3d)

// varying float noise;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
