precision highp float;
uniform float uTime;
uniform vec3 uColor;
uniform float uOffset;
varying vec2 vUv;

void main() {
  gl_FragColor.rgb = 0.3 + 0.3 * cos(vUv.xyx * uOffset + uTime) + uColor;
  gl_FragColor.a = 1.0;
}