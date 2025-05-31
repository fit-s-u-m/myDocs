import { InteractionManager } from "three.interactive";
import { MyScene } from "../scene";
import { assetData } from "./store";
import { Object3D, Camera, Mesh, Vector3 } from "three";

export function addInteraction() {
	const assets = assetData.getState()
	console.log(MyScene.getScene())
	console.log("fron scene", MyScene.getScene().getObjectByName("house"))
	console.log("from assets", assets.loadedAssets.filter(asset => asset.name == "house"))
}
export class Interaction {
	private static interactionManager: InteractionManager
	private static instance: Interaction
	private constructor() { }
	public static addManager(interactionManager: InteractionManager) {
		this.interactionManager = interactionManager
	}
	public static getInstance() {
		if (!Interaction.instance) {
			Interaction.instance = new Interaction()
		}
		return Interaction.instance
	}
	update() {
		Interaction.interactionManager.update()
	}

	makeObjectInteractive(obj: Object3D) {
		Interaction.interactionManager.add(obj)
		console.log(Interaction.interactionManager.interactiveObjects)
	}
}

export function makeHouseInteractive(house: Object3D, interactionManager: InteractionManager, camera: Camera, name: "middle" | "left" | "right" = "middle") {
	house.traverse((child) => {
		if (child instanceof Mesh) {
			interactionManager.add(child);

			child.addEventListener("click", () => {
				console.log("Clicked:", name);
				switch (name) {
					case "middle":
						camera.position.set(0, 3, 10)
						// if (animationActions.middle.doorClose)
						// 	animationActions.middle.doorClose.play()
						// camera.lookAt(0, 3, 0)
						break;
					case 'left':
						const leftHouseVec = new Vector3(-15, 3, 10)
						const dir = leftHouseVec.clone().normalize();
						const camPos = dir.multiplyScalar(5);
						// if (animationActions.left.doorClose)
						// 	animationActions.left.doorClose.play()
						camera.position.copy(camPos)
						camera.lookAt(leftHouseVec);
						break
					case 'right':
						{
							const rightHouseVec = new Vector3(15, 3, 10)
							const dir = rightHouseVec.clone().normalize();
							const camPos = dir.multiplyScalar(5);
							// if (animationActions.right.doorClose)
							// 	animationActions.right.doorClose.play()
							// camera.position.copy(camPos)
							camera.position.copy(camPos)
							camera.lookAt(rightHouseVec);
						}
						break
				}
			});
		}
	});
}

