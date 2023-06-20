// Test import of a JavaScript module
import Scene from '@/js/components/Scene'
import Text from '@/js/components/Text'

const ASSETS = ['image-7.jpg', 'image1.png', 'image-2.jpg']

;(() => {
  const cards = document.querySelectorAll('.card-container')

  cards.forEach((el, index) => {
    const canvas = el.querySelector('canvas')

    // scene
    new Scene(canvas, ASSETS[index], index)

    const text = el.querySelector('.text')
    new Text(text, index)
  })
})()
