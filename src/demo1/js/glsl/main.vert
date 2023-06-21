attribute vec2 uv;
attribute vec2 position;

uniform vec2 uResolution;
uniform vec2 uTextureResolution;

varying vec2 vUv;

#pragma glslify: resizeUvCover = require("./partials/resize-uv-cover.glsl")

void main() {
  vUv = resizeUvCover(uv, uTextureResolution, uResolution);

  gl_Position = vec4(position, 0, 1);
}
