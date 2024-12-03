import { LoadingManager } from "three"
import { loadAnimation } from "./animation"
export class LoadManager {
	private loadingManager
	tl = loadAnimation()
	constructor() {
		this.loadingManager = new LoadingManager()
		this.loadingManager.onProgress = this.onProgress.bind(this)
		this.loadingManager.onError = this.onError.bind(this)
	}
	get() {
		return this.loadingManager
	}
	private onProgress(_url: string, itemsLoaded: number, itemsTotal: number) {
		const progress = itemsLoaded / itemsTotal
		this.tl.progress(progress)
		console.log(progress, this.tl.progress())
	}
	private onError() {
		console.log("error has happend")
	}
}
