precision highp float;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uTime;
uniform float uScroll;

varying vec2 vUv;

#pragma glslify: cnoise2 = require(glsl-noise/classic/2d)

void main() {
  float noise = cnoise2(vUv * 1. + uScroll + sin(uTime / 10.));
  vec3 color = mix(uColor1, uColor2, noise);

  gl_FragColor.rgb = color;
  gl_FragColor.a = 1.0;
}
