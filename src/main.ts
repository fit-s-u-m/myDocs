import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MyScene } from './scene';
import { Camera } from './utils/camera';
import { Renderer } from './renderer';
import { letThereBeLight } from './utils/light';
import { sizeData } from './utils/store';
import { LoadManager } from './loadingManager';



function main() {


	const scene = MyScene.getScene()
	const camera = new Camera(0.1, 1000)
	camera.position.set(0, 5, 20); // Position to view the model better


	const manager = new LoadManager()

	const loader = new GLTFLoader(manager.get())
	loader.load("/hut.glb", (gltf) => {
		const model = gltf.scene
		scene.add(model)
	})

	letThereBeLight("ambient")

	const app = document.getElementById("app") as HTMLCanvasElement

	if (!app) return
	const controls = new OrbitControls(camera, app)


	const renderer = new Renderer(app)
	renderer.render(scene, camera)

	function animation() {
		controls.update()
		requestAnimationFrame(animation)
		renderer.render(scene, camera)
	}
	animation()

	window.addEventListener("resize", () => {
		sizeData.setState({
			canvasSize: { x: window.innerWidth, y: window.innerHeight },
			pixelRatio: Math.min(window.devicePixelRatio, 2)
		})
	})

}
main()
