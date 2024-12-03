import { WebGLRenderer } from "three";
import { sizeData, sizeType } from "./utils/store";

export class Renderer extends WebGLRenderer {
	constructor(canvas: HTMLElement) {
		super({ canvas, antialias: true })
		const { canvasSize } = sizeData.getState()
		this.setSize(canvasSize.x, canvasSize.y)
		sizeData.subscribe(this.updateWithSize.bind(this))
	}
	updateWithSize(sizeData: sizeType) {
		const { canvasSize } = sizeData
		this.setSize(canvasSize.x, canvasSize.y)
	}
}
