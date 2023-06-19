// Test import of a JavaScript module
import Scene from '@/js/components/scene'

;(() => {
  const canvasEl = document.querySelector('.scene')

  // scene
  new Scene(canvasEl)
})()
