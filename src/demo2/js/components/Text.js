class Text {
  #el
  constructor(el) {
    this.#el = el

    console.log(this.#el)

    const arr = this.#el.innerHTML.split('')

    this.#el.innerHTML = ''

    arr.forEach((char) => {
      const span = document.createElement('span')
      span.classList.add('char')
      span.innerHTML = char

      this.#el.appendChild(span)
    })
  }
}

export default Text