import Card from '@/demo1/js/components/Card'
import Background from '@/demo1/js/components/Background'
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { isTouch } from './utils/isTouch'
import GUI from 'lil-gui'

const ASSETS = ['image-1.jpg', 'image-2.jpg', 'image-3.jpg', 'image-4.jpg', 'image-5.jpg', 'image-6.jpg']

export default class App {
  #components
  #lenis
  #guiCard = {
    bulge: 0,
    strength: 1.1,
    radius: 0.95,
  }
  #debug
  constructor() {
    this.#components = this.createComponents()

    this.#lenis = this.createLenis()
    this.#debug = this.createDebugger()

    this.events()
  }

  createComponents() {
    const components = []

    const cards = document.querySelectorAll('.card')

    // Set up components
    cards.forEach((el, index) => {
      const canvas = el.querySelector('canvas')

      // scene
      components.push(new Card({ el: canvas, src: ASSETS[index], index, guiObj: this.#guiCard }))
    })

    const background = document.querySelector('.background__canvas')
    components.push(new Background({ el: background }))

    return components
  }

  createLenis() {
    // Set up Lenis scroll
    const lenis = new Lenis({ infinite: false, lerp: 0.08 })
    this.scrollEl = document.querySelector('.scroll')

    lenis.on('scroll', this.handleScroll)

    return lenis
  }

  events() {
    gsap.ticker.add(this.handleRAF)

    window.addEventListener('resize', this.handleResize, false)

    if (isTouch()) {
      window.addEventListener('touchmove', this.handleMouseMove, false)
    } else {
      window.addEventListener('mousemove', this.handleMouseMove, false)
    }
  }

  handleRAF = (time) => {
    this.#lenis.raf(time * 1000)

    for (let i = 0; i < this.#components.length; i++) {
      const comp = this.#components[i]

      if (typeof comp.render === 'function') {
        comp.render(time)
      }
    }
  }

  handleResize = () => {
    for (let i = 0; i < this.#components.length; i++) {
      const comp = this.#components[i]

      if (typeof comp.resize === 'function') {
        comp.resize()
      }
    }
  }

  handleMouseMove = (e) => {
    for (let i = 0; i < this.#components.length; i++) {
      const comp = this.#components[i]

      if (typeof comp.mouseMove === 'function') {
        comp.mouseMove(e)
      }
    }
  }

  handleScroll = (e) => {
    this.scrollEl.classList.remove('is-visible')

    for (let i = 0; i < this.#components.length; i++) {
      const comp = this.#components[i]

      if (typeof comp.scroll === 'function') {
        comp.scroll(e.progress)
      }
    }
  }

  createDebugger() {
    const gui = new GUI()

    const handleChange = () => {
      for (let i = 0; i < this.#components.length; i++) {
        const comp = this.#components[i]

        if (comp.type === 'card') {
          comp.program.uniforms.uRadius.value = this.#guiCard.radius
          comp.program.uniforms.uStrength.value = this.#guiCard.strength
        }
      }
    }

    gui.add(this.#guiCard, 'radius', 0, 1).onChange(handleChange)
    gui.add(this.#guiCard, 'strength', 0, 3).onChange(handleChange)

    return gui
  }
}
