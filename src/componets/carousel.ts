
export function carousel() {
	const carousels = document.getElementsByClassName("carousel")
	if (!carousels) return
	for (let i = 0; i < carousels.length; i++) {
		const elm = carousels.item(i)
		if (!elm) break
		const figs = Array.from(elm.getElementsByTagName("figure"))
		if (!figs) break
		let current = 0
		const len = figs.length
		const updateCarousel = () => {
			figs.forEach(x => x.className = "")// clear prev className

			figs[current].classList.add("active")
			console.log(current, figs[current])

			const prevIndex = current - 1 < 0 ? null : current - 1
			const nextIndex = (current + 1) > len - 1 ? null : current + 1
			if (prevIndex)
				figs[prevIndex].classList.add("prev")
			if (nextIndex)
				figs[nextIndex].classList.add("next")
		}
		elm.getElementsByClassName("next")[0]?.addEventListener("click", () => {
			current++
			updateCarousel()
		})
		elm.getElementsByClassName("prev")[0]?.addEventListener("click", () => {
			current++
			updateCarousel()
		})
		updateCarousel()
	}
}
