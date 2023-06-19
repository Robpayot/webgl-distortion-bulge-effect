precision highp float;

uniform float uTime;
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uRadius;
uniform float uStrength;
uniform float uBulge;


varying vec2 vUv;

vec2 bulge(vec2 uv, vec2 mouse) {

  uv -= mouse; // center to mouse

  float distAmount = length(uv) / uRadius; // amount of distortion based on mouse pos
  float distAmountSq = pow(distAmount, 4.); // exponential as you ar far from the mouse
  float strengthAmount = uStrength / (1.0 + distAmountSq); // strenght

  uv *= (1. - uBulge) + uBulge * strengthAmount; // use uBulge to smoothly reset/add effect

  uv += mouse; // reset pos

  return uv;
}

void main() {
  // Add bulge effect based on mouse
  vec2 bulgeUV = bulge(vUv, uMouse);

  vec4 tex = texture2D(uTexture, bulgeUV);

  gl_FragColor.rgb = tex.rgb;
  gl_FragColor.a = 1.0;
}