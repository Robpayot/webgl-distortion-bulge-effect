import { Vec2 } from 'ogl'

export function getCoverUV(gl, image) {
  // crop image like a "background: cover"
  const aspectOfScene = gl.canvas.offsetWidth / gl.canvas.offsetHeight
  const aspectOfImage1 = image.width / image.height

  const repeat = new Vec2()
  const offset = new Vec2()

  if (aspectOfScene / aspectOfImage1 > 1) {
    repeat.set([1.0, aspectOfImage1 / aspectOfScene])
  } else {
    repeat.set([aspectOfScene / aspectOfImage1, 1.0])
  }

  offset.set([(1 - repeat[0]) / 2, (1 - repeat[1]) / 2])

  return { offset, repeat }
}
