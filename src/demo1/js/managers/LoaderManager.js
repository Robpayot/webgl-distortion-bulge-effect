import { Texture } from 'ogl'

class LoaderManager {
  constructor() {
    this.assets = {} // Dictionary of assets, can be different type, gltf, texture, img, font, feel free to make a Enum if using TypeScript
  }

  get(name) {
    return this.assets[name]
  }

  load = (data, gl) =>
    new Promise((resolve) => {
      const promises = []
      for (let i = 0; i < data.length; i++) {
        const { name, texture } = data[i]

        if (texture && !this.assets[name]) {
          promises.push(this.loadTexture(texture, name, gl))
        }
      }

      Promise.all(promises).then(() => resolve())
    })

  loadTexture(url, name, gl) {
    if (!this.assets[name]) {
      this.assets[name] = {}
    }
    return new Promise((resolve) => {
      const image = new Image()
      const texture = new Texture(gl)

      image.onload = () => {
        texture.image = image
        this.assets[name] = texture
        resolve(image)
      }

      image.src = url
    })
  }
}

export default new LoaderManager()
