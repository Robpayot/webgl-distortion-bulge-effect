precision highp float;

uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec2 vUv;

void main() {
  vec3 color = mix(uColor1, uColor2, vUv.x);

  gl_FragColor.rgb = color;
  gl_FragColor.a = 1.0;
}
