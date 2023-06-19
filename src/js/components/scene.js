import GUI from 'lil-gui'
import { Renderer, Program, Color, Mesh, Triangle, Vec2 } from 'ogl'
import vertex from '@/js/glsl/main.vert'
import fragment from '@/js/glsl/main.frag'
import LoaderManager from '../managers/LoaderManager'
// import LoaderManager from '@/js/managers/LoaderManager'

class Scene {
  #el
  #renderer
  #mesh
  #program
  #guiObj = {
    offset: 1,
    bulgeEffect: 1,
    strength: 1.1,
    radius: 0.95,
    displacementMap: 0.3,
  }
  #mouse = new Vec2(0, 0)
  constructor(el) {
    this.#el = el
    this.setGUI()
    this.setScene()
  }

  setGUI() {
    const gui = new GUI()

    const handleChange = (value) => {
      this.#program.uniforms.uOffset.value = value
    }

    gui.add(this.#guiObj, 'offset', 0.5, 4).onChange(handleChange)
  }

  async setScene() {
    this.#renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      canvas: this.#el,
      width: this.#el.offsetWidth,
      height: this.#el.offsetHeight,
    })

    const { gl } = this.#renderer

    // Preloading
    await LoaderManager.load(
      [
        {
          name: 'image1',
          texture: './img/image1.png',
        },
      ],
      gl
    )

    gl.clearColor(1, 1, 1, 1)

    this.handleResize()

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

    const texture = LoaderManager.get('image1')

    this.#program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: texture },
        uTextureResolution: { value: new Vec2(texture.image.width, texture.image.height) },
        uResolution: { value: new Vec2(gl.canvas.offsetWidth, gl.canvas.offsetHeight) },
        uMouse: { value: this.#mouse },
        uBulge: { value: this.#guiObj.bulgeEffect },
        uRadius: { value: this.#guiObj.radius },
        uStrength: { value: this.#guiObj.strength },
      },
    })

    console.log(this.#program.uniforms)

    this.#mesh = new Mesh(gl, { geometry, program: this.#program })

    this.events()
  }

  events() {
    window.addEventListener('resize', this.handleResize, false)
    window.addEventListener('mousemove', this.handleMouseMove, false)
    requestAnimationFrame(this.handleRAF)
  }

  handleResize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    this.#renderer.setSize(w, h)

    if (this.#program) {
      this.#program.uniforms.uResolution.value = new Vec2(w, h)
    }
  }

  handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth)
    const y = (e.clientY / window.innerHeight)

    this.#mouse.x = x
    this.#mouse.y = y
  }

  handleRAF = (t) => {
    requestAnimationFrame(this.handleRAF)

    this.#program.uniforms.uTime.value = t * 0.001

    this.#program.uniforms.uMouse.value = this.#mouse

    // Don't need a camera if camera uniforms aren't required
    this.#renderer.render({ scene: this.#mesh })
  }
}

export default Scene
