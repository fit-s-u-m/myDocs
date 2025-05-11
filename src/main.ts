// import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MyScene } from './scene';
import { Camera } from './utils/camera';
import { Renderer } from './renderer';
import { letThereBeLight } from './utils/light';
import { sizeData } from './utils/store';
import { LoadManager } from './loadingManager';
import { InteractionManager } from 'three.interactive';
import { Group, Mesh, Object3D, Vector3 } from 'three';



function main() {
	const app = document.getElementById("app") as HTMLCanvasElement
	if (!app) return

	const renderer = new Renderer(app)


	const scene = MyScene.getScene()
	const camera = new Camera(0.1, 1000)
	camera.position.set(0, 2, 10); // Position to view the model better


	const manager = new LoadManager()
	console.log("DOM Element:", renderer.domElement); // Should NOT be undefined

	const clickManager = new InteractionManager(renderer, camera, renderer.domElement);

	let house: Object3D | null = null
	let floor: Object3D | null = null
	let laddar: Object3D | null = null
	let pot: Object3D | null = null
	/*
	function setColor(object: Object3D, color: Color | string | number) {
		object.traverse((child) => {
			if ((child as Mesh).isMesh) {
				const mesh = child as Mesh;
				// Make sure we clone the material, so we don't affect other instances
				mesh.material = mesh.material.clone();
				if ('color' in mesh.material) {
					mesh.material.color.set(color);
				}
			}
		});
	}
	*/
	function makeHouseInteractive(house: Object3D, name: "middle" | "left" | "right" = "middle") {
		house.traverse((child) => {
			if (child instanceof Mesh) {
				clickManager.add(child);

				child.addEventListener("click", () => {
					console.log("Clicked:", name);
					switch (name) {
						case "middle":
							camera.position.set(0, 3, 10)
							// camera.lookAt(0, 3, 0)
							break;
						case 'left':
							const leftHouseVec = new Vector3(-15, 3, 10)
							const dir = leftHouseVec.clone().normalize();
							const camPos = dir.multiplyScalar(5);
							camera.position.copy(leftHouseVec)
							// camera.lookAt(leftHouseVec);
							break
						case 'right':
							{
								const rightHouseVec = new Vector3(15, 3, 10)
								const dir = rightHouseVec.clone().normalize();
								const camPos = dir.multiplyScalar(5);
								camera.position.copy(camPos)
								// camera.lookAt(rightHouseVec);
							}
							break
					}
				});
			}
		});
	}

	const loader = new GLTFLoader(manager.get())
	loader.load("/hut.glb", (gltf) => {
		const model = gltf.scene
		let houseCollection = new Group()
		let potCollection = new Group()
		model.traverse((child) => {
			console.log(child.name)
			if (child.name) {

				// Clone deeply to detach from scene graph
				if (child.name == "floor") {
					console.log('Storing:', child.name);
					floor = child.clone(true);
				}
				else if (child.name == "roof" || child.name == "wall" || child.name == "houseFoundation") {
					console.log('Storing:', child.name);
					houseCollection.add(child.clone(true))
				}
				else if (child.name == "laddar") {
					console.log('Storing:', child.name);
					laddar = child.clone(true)
				}
				else if (child.name.includes("pot")) {
					console.log('Storing:', child.name);
					potCollection.add(child.clone(true))
				}
			}
		});
		house = houseCollection
		pot = potCollection

		if (floor) {
			floor.receiveShadow = true
			floor.scale.set(20, 1, 20)
			scene.add(floor);
		}
		if (house) {
			makeHouseInteractive(house)
			house.receiveShadow = true
			house.castShadow = true
			scene.add(house);
			// left house
			const leftHouse = house.clone(true)
			makeHouseInteractive(leftHouse, "left")
			leftHouse.receiveShadow = true
			leftHouse.castShadow = true
			leftHouse.rotateY(45)
			leftHouse.position.set(-15, 0, 5)
			scene.add(leftHouse);

			// right house
			const rightHouse = house.clone(true)
			makeHouseInteractive(rightHouse, "right")
			rightHouse.receiveShadow = true
			rightHouse.castShadow = true
			rightHouse.position.set(15, 0, 5)
			rightHouse.rotateY(-45)
			scene.add(rightHouse);
		}
		if (laddar) {
			laddar.castShadow = true
			scene.add(laddar);
		}
		if (pot) {
			pot.castShadow = true
			scene.add(pot);
		}
	})

	// light inside the middle house
	letThereBeLight("ambient")
	const spotLight = letThereBeLight("spot")
	spotLight.intensity = 50;
	spotLight.position.set(0, 2.5, 0);
	spotLight.lookAt(0, 0, 0);
	spotLight.castShadow = true;

	// light inside the left house
	const spotLightLeft = letThereBeLight("spot")
	spotLightLeft.intensity = 100;
	spotLightLeft.position.set(-15, 2.5, 5);
	spotLightLeft.lookAt(-15, 5, 5);
	spotLightLeft.color.set(0xff0000);
	spotLightLeft.castShadow = true;

	// light inside the right house
	const spotLightRight = letThereBeLight("spot")
	spotLightRight.intensity = 100;
	spotLightRight.position.set(15, 2.5, 5);
	spotLightRight.color.set(0x0000ff);
	spotLightRight.lookAt(15, 5, 5);
	spotLightRight.castShadow = true;

	const sun = letThereBeLight("directional")
	sun.position.set(5, 10, 10);
	sun.lookAt(0, 0, 0);
	sun.castShadow = true;

	const controls = new OrbitControls(camera, app)
	controls.minDistance = 0; // minimum zoom
	controls.maxDistance = 50; // maximum zoom

	controls.minPolarAngle = Math.PI / 4;  // limit vertical rotation (down)
	controls.maxPolarAngle = Math.PI / 2;  // limit vertical rotation (up)

	controls.minAzimuthAngle = -Math.PI / 4; // limit horizontal rotation (left)
	controls.maxAzimuthAngle = Math.PI / 4;  // limit horizontal rotation (right)


	renderer.render(scene, camera)
	renderer.shadowMap.enabled = true;


	function animation() {
		controls.update()
		requestAnimationFrame(animation)
		clickManager.update()
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
