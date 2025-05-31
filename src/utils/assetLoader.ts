import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { AnimationClip, AnimationMixer, Camera, LoopOnce, Object3D, Renderer, TextureLoader, Vector3 } from 'three';
import { LoadManager } from '../loadingManager';
import { EquirectangularReflectionMapping, Mesh } from 'three'
import { MyScene } from '../scene';
import { assetData } from './store';
import { MyMixers } from './mixer';
import { lookAround } from '../animation';
import { Interaction } from './interaction';


export class AssetLoader {
	gltfLoader
	rgbeLoader
	constructor() {
		const manager = new LoadManager()

		this.gltfLoader = new GLTFLoader(manager.get())
		this.rgbeLoader = new RGBELoader(manager.get())
	}
	async loadAssets() {
		await Promise.all(
			assetData.getState().asset2Load
				.filter(asset => asset.type == "glb")
				.map(asset => {
					return new Promise<void>((res, rej) => {

						console.log(asset.name)
						this.gltfLoader.load(asset.path, (gltf) => {
							const obj = gltf.scene.children[0]
							if (asset.name == "ground") {
								obj.receiveShadow = true
								obj.scale.set(10, 1, 10)
							}
							else if (asset.name == "door") {
								const mixer = new AnimationMixer(obj);
								const doorOpen = AnimationClip.findByName(gltf.animations, "open door");

								if (doorOpen) {
									console.log("door open")
									const action = mixer.clipAction(doorOpen);
									MyMixers.getInstance().addOpenDoorMixer(mixer, action)
								}

								const doorClose = AnimationClip.findByName(gltf.animations, "close door.002");

								if (doorClose) {
									const action = mixer.clipAction(doorClose);
									console.log("door close amination", action)
									MyMixers.getInstance().addCloseDoorMixer(mixer, action)
								}

								// Interaction.getInstance().makeObjectInteractive(obj)

								obj.addEventListener("click", () => {
									console.log("door clicked")
								})

							}
							else if (asset.name == "roof") {
								obj.receiveShadow = true
								obj.castShadow = true
							}
							else if (asset.name == "house") {
								obj.traverse((child) => {
									if (child instanceof Mesh) {
										child.receiveShadow = true
										child.castShadow = true
									}
								})
							}

							else
								gltf.scene.children[0].castShadow = true

							assetData.getState().addLoadedAsset({ name: asset.name, obj })
							MyScene.getScene().add(gltf.scene)
							res()
						}, undefined,
							(err) => {
								console.error("Error loading", asset.name, err);
								rej(err);
							})
					})
				})
		)

		await Promise.all(
			assetData.getState().asset2Load
				.filter(asset => asset.type == "hdr")
				.map(asset => {
					return new Promise((res, rej) => {
						this.rgbeLoader.load(
							asset.path,
							(texture) => {
								texture.mapping = EquirectangularReflectionMapping;
								// Apply texture to the scene if needed
								// const scene = MyScene.getScene();
								// scene.background = texture;
								// scene.environment = texture;

								res(texture); // resolve with the texture if you want
							},
							undefined,
							(error) => rej(error)
						);
					});
				})
		);
		await Promise.all(
			assetData.getState().asset2Load
				.filter(asset => asset.type == "png" || asset.type == "jpg")
				.map(asset => {
					return new Promise((res, rej) => {
						const texture = new TextureLoader().load(
							asset.path, undefined,
							undefined,
							(error) => rej(error)
						);
						res(assetData.getState().addLoadedAsset({
							name: asset.name,
							obj: texture,
							isDoc: asset.isDoc
						}));
						// res(texture);
					});
				})
		);

	}
}
