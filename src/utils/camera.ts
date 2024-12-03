import { PerspectiveCamera } from 'three'
import { sizeData, sizeType } from './store';

export class Camera extends PerspectiveCamera {
	constructor(near: number, far: number) {
		const cavasSize = sizeData.getState().canvasSize
		const fov = 75
		super(fov, cavasSize.x / cavasSize.y, near, far)

		sizeData.subscribe(this.updateWithSize.bind(this))
	}
	move() {

	}
	updateWithSize(sizeData: sizeType) {
		const { canvasSize } = sizeData
		this.aspect = canvasSize.x / canvasSize.y;
		this.updateProjectionMatrix();
	}

}
