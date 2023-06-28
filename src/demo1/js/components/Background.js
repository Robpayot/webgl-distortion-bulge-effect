import GUI from 'lil-gui'
import { Renderer, Program, Color, Mesh, Triangle, Vec2 } from 'ogl'
import vertex from '../glsl/background/vertex.glsl'
import fragment from '../glsl/background/fragment.glsl'
import { isTouch } from '../utils/isTouch'

export default class Backround {
  #el
  #renderer
  #mesh
  #program
  #isTouch
  #guiObj
  #visible
  constructor({ el }) {
    this.#el = el
    // this.#guiObj = guiObj
    this.setScene()

    this.#isTouch = isTouch()
  }

  get type() {
    return 'background'
  }

  get program() {
    return this.#program
  }

  async setScene() {
    this.#renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      canvas: this.#el,
      width: window.innerWidth,
      height: window.innerHeight,
    })

    const { gl } = this.#renderer

    gl.clearColor(1, 1, 1, 1)

    this.resize()

    // Rather than using a plane (two triangles) to cover the viewport here is a
    // triangle that includes -1 to 1 range for 'position', and 0 to 1 range for 'uv'.
    // Excess will be out of the viewport.

    //         position                uv
    //      (-1, 3)                  (0, 2)
    //         |\                      |\
    //         |__\(1, 1)              |__\(1, 1)
    //         |__|_\                  |__|_\
    //   (-1, -1)   (3, -1)        (0, 0)   (2, 0)

    const geometry = new Triangle(gl)

    this.#program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uColor1: { value: new Color('#fdfaee') },
        uColor2: { value: new Color('#d6abb4') },
        uResolution: { value: new Vec2(gl.canvas.offsetWidth, gl.canvas.offsetHeight) },
      },
    })

    this.#mesh = new Mesh(gl, { geometry, program: this.#program })
  }

  render = (t) => {
    if (!this.#program) return
    this.#program.uniforms.uTime.value = t
    // console.log(this.#program.uniforms.uTime.value)

    // Don't need a camera if camera uniforms aren't required
    this.#renderer.render({ scene: this.#mesh })
  }

  scroll = (s) => {
    this.#program.uniforms.uScroll.value = s * 2
  }

  resize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    this.#renderer.setSize(w, h)

    if (this.#program) {
      this.#program.uniforms.uResolution.value = new Vec2(w, h)
    }

    this.#isTouch = isTouch()
  }
}
