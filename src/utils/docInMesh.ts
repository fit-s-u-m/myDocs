import { assetData, assetsLoaded, docData } from "./store";
import { MeshStandardMaterial, BoxGeometry, Mesh, RectAreaLight, Texture } from "three";
import { letThereBeLight } from "./light";
import { MyScene } from "../scene";
import { Interaction } from "./interaction";
import { bringDocsUp } from "../animation";
export class Doc {
	constructor() {
		// assetsLoaded.subscribe(this.createDocs.bind(this))
	}
	public createDocs() {
		console.log("docs")
		console.log(assetData.getState().loadedAssets.filter(asset => asset.isDoc))
		assetData.getState()
			.loadedAssets
			.filter(asset => asset.isDoc)
			.forEach((docs, index) => {
				console.log(docs)

				const radius = 4 - .3
				const angle = index * Math.PI / 6

				// avoid the door
				const gap = Math.PI / 6
				if (angle > Math.PI / 2 - gap && angle < Math.PI / 2 + gap) return

				//  rect
				const material = new MeshStandardMaterial({ color: 0xffffff, roughness: 0 });
				material.map = docs.obj as Texture
				const geometry = new BoxGeometry(0.1, 1, 0.8)
				const cube = new Mesh(geometry, material)
				Interaction.getInstance().makeObjectInteractive(cube)
				cube.addEventListener("click", () => {
					console.log(docs.name)
					bringDocsUp("digitalHealth")
					// cube.scale.set(2, 2, 2)
					// cube
					// if(docs.name == "HackathonPrize"){
					//
					// }
				})

				cube.rotation.y = -angle
				// TODO: Thing about the performance
				// cube.castShadow = true
				// cube.receiveShadow = true


				// rect light
				const light = letThereBeLight("rectArea") as RectAreaLight
				light.color.set(0xffffff)
				light.intensity = 5
				light.width = 0.8
				light.height = 1
				light.rotateY(angle)
				const xl = (radius - 1) * Math.cos(angle)
				const zl = (radius - 1) * Math.sin(angle)
				light.position.set(xl, 1.5, zl)


				const x = radius * Math.cos(angle)
				const z = radius * Math.sin(angle)
				light.lookAt(x, 1.5, z)
				cube.position.set(x, 1.5, z)

				MyScene.getScene().add(cube, light)
				docData.getState().addDoc({ name: docs.name, texture: docs.obj as Texture, mesh: cube })
			})
	}
}
// const texture = assetData.getState().loadedAssets.find(asset => asset.name == "niceGrade")?.obj as THREE.Texture
// const roughness = assetData.getState().loadedAssets.find(asset => asset.name == "treeRoughness")?.obj as THREE.Texture
//
// const normalMap = assetData.getState().loadedAssets.find(asset => asset.name == "treeNormal")?.obj as THREE.Texture
// material.map = texture
// material.roughnessMap = roughness
// material.normalMap = normalMap
