// Test import of a JavaScript module
import Scene from '@/js/components/scene'

const ASSETS = ['image1.png', 'image-2.jpg'];

(() => {
  const cards = document.querySelectorAll('.card-container')

  cards.forEach((el, index) => {
    const canvas = el.querySelector('canvas')

    // scene
    new Scene(canvas, ASSETS[index], index)
  })
})()
