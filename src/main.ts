import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MyScene } from './scene';
import { Camera } from './utils/camera';
import { Renderer } from './renderer';
import { letThereBeLight } from './utils/light';
import { sizeData } from './utils/store';
import { InteractionManager } from 'three.interactive';
import { Clock, Vector3 } from 'three';
import { AssetLoader } from './utils/assetLoader';
import { Doc } from './utils/docInMesh';
import { addInteraction, Interaction } from './utils/interaction';
import { MyMixers } from './utils/mixer';
import { closeDoor, lookAround, openDoor } from './animation';
import gsap from 'gsap';
import { Flip } from 'gsap/all';



async function main() {
	const app = document.getElementById("app") as HTMLCanvasElement
	if (!app) return
	gsap.registerPlugin(Flip)

	const renderer = new Renderer(app)
	const scene = MyScene.getScene()
	const camera = new Camera(0.1, 1000)
	camera.position.set(0, 1.5, 10); // Position to view the model better

	const assetLoader = new AssetLoader()
	await assetLoader.loadAssets()

	// addManager
	addInteraction()
	const interaction = new InteractionManager(renderer, camera, renderer.domElement)
	Interaction.addManager(interaction)

	const isWithInRadius = (maxRadius: number) => {
		const radiusSq = camera.position.x ** 2 + camera.position.z ** 2
		return radiusSq < maxRadius
	}
	// initalize the doc hanging in the hut
	new Doc().createDocs()

	// light inside the middle house
	letThereBeLight("ambient")
	const spotLight = letThereBeLight("spot")
	spotLight.intensity = 50;
	spotLight.position.set(0, 2.5, 0);
	spotLight.lookAt(0, 0, 0);
	spotLight.castShadow = true;

	const sun = letThereBeLight("directional")
	sun.position.set(5, 10, 10);
	sun.lookAt(0, 0, 0);
	sun.intensity = 3;
	sun.castShadow = true;

	const controls = new OrbitControls(camera, app)

	// stop no phi movement
	controls.minPolarAngle = Math.PI / 2;  // limit vertical rotation (up)90
	controls.maxPolarAngle = Math.PI / 2;  // limit vertical rotation (up)

	controls.target = new Vector3(0, 1.5, 0)

	// enable shadows
	renderer.render(scene, camera)
	renderer.shadowMap.enabled = true;

	// mixer for animation
	const mixers = MyMixers.getInstance().getMixers()

	// open door when close
	controls.addEventListener("end", () => {
		const maxradiusSq = 40
		if (isWithInRadius(maxradiusSq))
			openDoor()
		else
			closeDoor()
	})

	const clock = new Clock();
	function animation() {
		requestAnimationFrame(animation)
		const delta = clock.getDelta();
		mixers.forEach(mixer => mixer.mixer.update(delta))
		Interaction.getInstance().update()
		renderer.render(scene, camera)
	}
	animation()
	window.addEventListener("keydown", (ev) => {
		const key = ev.key
		const dx = 0.5
		const da = 0.05
		const direction = new Vector3();
		camera.getWorldDirection(direction);
		direction.y = 0; // stay level (no vertical movement)
		direction.normalize();
		console.log(camera.rotation.y, Math.PI / 2)
		const doorAngleMin = Math.PI / 2 - 0.1;
		const doorAngleMax = Math.PI / 2 + 0.1;
		const isFacingDoor = camera.rotation.y > doorAngleMin && camera.rotation.y < doorAngleMax
		console.log(isFacingDoor)
		// }

		if (key === "w" || key === "k") {
			camera.position.add(direction.clone().multiplyScalar(dx));
		}
		else if (key === "s" || key === "j") {
			camera.position.add(direction.clone().multiplyScalar(-dx));
		}
		else if (key === "a" || key === "h") {
			const left = new Vector3().crossVectors(camera.up, direction).normalize();
			camera.position.add(left.multiplyScalar(dx));
		}
		else if (key === "d" || key === "l") {
			const right = new Vector3().crossVectors(direction, camera.up).normalize();
			camera.position.add(right.multiplyScalar(dx));
		}
		// rotation
		if (key == "ArrowLeft") { // rotate cw
			camera.rotation.y += da
		}
		else if (key == "ArrowRight") { // rotate ccw
			camera.rotation.y -= da
		}
		const maxRadiusSq = 40
		if (isWithInRadius(maxRadiusSq))
			openDoor()
		else
			closeDoor()
		console.log(key)
	})
	// window.addEventListener("mousemove", onMouseMove)
	window.addEventListener("resize", () => {
		sizeData.setState({
			canvasSize: { x: window.innerWidth, y: window.innerHeight },
			pixelRatio: Math.min(window.devicePixelRatio, 2)
		})
	})
}
main()
