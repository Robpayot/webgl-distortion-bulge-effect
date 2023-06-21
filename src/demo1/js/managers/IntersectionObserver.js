class IntersectObserver {
  entries = {}
  observer

  constructor() {
    this.observer = new IntersectionObserver(this.onElementObserved, {
      threshold: 0.0,
    })
  }

  observe(id, el, method) {
    this.entries[id] = { el, method }

    this.observer.observe(el)
  }

  unobserve(id, el) {
    this.observer.unobserve(el)
    delete this.entries[id]
  }

  onElementObserved = (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.dataset.intersectId

      if (id && this.entries[id] && entry.isIntersecting) {
        this.entries[id].method(entry)
      }
    })
  }
}

export default new IntersectObserver()
