import { LoadingManager } from "three"
import { loadAnimation } from "./animation"
import { assetsLoaded } from "./utils/store"
export class LoadManager {
	private loadingManager
	tl = loadAnimation()
	constructor() {
		this.loadingManager = new LoadingManager()
		this.loadingManager.onLoad = this.onEnd.bind(this)
		this.loadingManager.onProgress = this.onProgress.bind(this)
		this.loadingManager.onError = this.onError.bind(this)
	}
	get() {
		return this.loadingManager
	}
	private onEnd() {
		console.log("all assets loaded")
		assetsLoaded.setState({ loaded: true })
	}
	private onProgress(_url: string, itemsLoaded: number, itemsTotal: number) {
		const progress = itemsLoaded / itemsTotal
		this.tl.progress(progress)
		const loadingText = document.getElementById("loading-text")
		const progressPercent = (progress * 100).toFixed(0)
		if (loadingText) loadingText.innerText = `${progressPercent}%`
	}
	private onError() {
		console.log("error has happend")
	}
}
