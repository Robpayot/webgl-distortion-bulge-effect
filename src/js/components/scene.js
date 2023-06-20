import GUI from 'lil-gui'
import { Renderer, Program, Color, Mesh, Triangle, Vec2 } from 'ogl'
import vertex from '@/js/glsl/main.vert'
import fragment from '@/js/glsl/main.frag'
import LoaderManager from '../managers/LoaderManager'
import { gsap } from 'gsap'
// import LoaderManager from '@/js/managers/LoaderManager'

class Scene {
  #el
  #renderer
  #mesh
  #program
  #guiObj = {
    bulge: 0,
    strength: 1.1,
    radius: 0.95,
    displacementMap: 0.3,
  }
  #mouse = new Vec2(0, 0)
  #elRect
  #canMove = true
  #src
  #index
  constructor(el, src, index) {
    this.#el = el
    this.#src = src
    this.#index = index
    this.setGUI()
    this.setScene()
  }

  setGUI() {
    const gui = new GUI()

    const handleChange = () => {
      this.#program.uniforms.uRadius.value = this.#guiObj.radius
      this.#program.uniforms.uStrength.value = this.#guiObj.strength
    }

    gui.add(this.#guiObj, 'radius', 0, 1).onChange(handleChange)
    gui.add(this.#guiObj, 'strength', 0, 3).onChange(handleChange)
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
          name: `image_${this.#index}`,
          texture: `./img/${this.#src}`,
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

    const texture = LoaderManager.get(`image_${this.#index}`)

    this.#program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: texture },
        uTextureResolution: { value: new Vec2(texture.image.width, texture.image.height) },
        uResolution: { value: new Vec2(gl.canvas.offsetWidth, gl.canvas.offsetHeight) },
        uMouse: { value: this.#mouse },
        uMouseIntro: { value: new Vec2(0.5, 0) },
        uIntro: { value: 0 },
        uBulge: { value: this.#guiObj.bulge },
        uRadius: { value: this.#guiObj.radius },
        uStrength: { value: this.#guiObj.strength },
      },
    })

    this.#mesh = new Mesh(gl, { geometry, program: this.#program })

    this.events()

    this.intro()
  }

  intro() {
    let delay = 0

    if (this.#index === 2) {
      delay = 0.25
    } else if (this.#index === 0) {
      delay = 0.5
    }

    gsap.delayedCall(delay, () => {
      this.#el.parentNode.parentNode.classList.add('is-visible')
    })

    this.tlBulge = gsap.fromTo(
      this.#program.uniforms.uBulge,
      { value: 2 },
      {
        value: 0,
        duration: 2,
        ease: 'expo.out',
        onComplete: () => {
          // this.#canMove = true
          // this.handleResize()
        },
        delay,
      }
    )

    gsap.to(this.#program.uniforms.uIntro, { value: 1, duration: 3, delay })

    // gsap.delayedCall(delay + 1, () => {
    //   this.#canMove = true
    // })
  }

  events() {
    window.addEventListener('resize', this.handleResize, false)
    window.addEventListener('mousemove', this.handleMouseMove, false)

    this.#el.addEventListener('mouseenter', this.handleMouseEnter, false)
    this.#el.addEventListener('mouseleave', this.handleMouseLeave, false)
    requestAnimationFrame(this.handleRAF)
  }

  handleResize = () => {
    const w = this.#el.parentNode.offsetWidth
    const h = this.#el.parentNode.offsetHeight
    this.#renderer.setSize(w, h)

    this.#elRect = this.#el.getBoundingClientRect()

    if (this.#program) {
      this.#program.uniforms.uResolution.value = new Vec2(w, h)
    }
  }

  handleMouseMove = (e) => {
    if (!this.#canMove) return
    this.#elRect = this.#el.getBoundingClientRect()
    const x = (e.clientX - this.#elRect.left) / this.#el.offsetWidth
    const y = 1 - (e.clientY - this.#elRect.top + window.scrollY) / this.#el.offsetHeight

    this.#mouse.x = gsap.utils.clamp(0, 1, x)
    this.#mouse.y = gsap.utils.clamp(0, 1, y)
  }

  handleMouseEnter = () => {
    if (!this.#canMove) return
    this.tlBulge?.kill()
    gsap.fromTo(this.#program.uniforms.uBulge, { value: 0 }, { value: 1, duration: 1, ease: 'expo.out' })
  }
  handleMouseLeave = () => {
    if (!this.#canMove) return
    gsap.to(this.#program.uniforms.uBulge, { value: 0, duration: 1, ease: 'expo.out' })
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
