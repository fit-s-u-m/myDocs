import { createStore } from "zustand/vanilla";

export interface sizeType {
	canvasSize: { x: number, y: number }
	pixelRatio: number
}
export const sizeData = createStore<sizeType>(() => ({
	canvasSize: { x: window.innerWidth, y: window.innerHeight },
	pixelRatio: Math.min(window.devicePixelRatio, 2)
}))

