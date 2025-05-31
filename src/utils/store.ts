import { createStore } from "zustand/vanilla";
import * as THREE from "three";

export type sizeType = {
	canvasSize: { x: number, y: number }
	pixelRatio: number
}
export const sizeData = createStore<sizeType>(() => ({
	canvasSize: { x: window.innerWidth, y: window.innerHeight },
	pixelRatio: Math.min(window.devicePixelRatio, 2)
}))

const assets2Load = [
	{ path: "/hut/roof.glb", name: "roof", type: "glb" },
	{ path: "/hut/door_1.glb", name: "door", type: "glb" },
	{ path: "/hut/house.glb", name: "house", type: "glb" },
	{ path: "/hut/ground.glb", name: "ground", type: "glb" },
	{ path: "/hut/ladder.glb", name: "ladder", type: "glb" },
	{ path: "/hut/pot1.glb", name: "pot", type: "glb" },
	{ path: "/hut/basket1.glb", name: "basket1", type: "glb" },
	{ path: "/hut/pot2.glb", name: "pot2", type: "glb" },
	{ path: "/hut/basket2.glb", name: "basket2", type: "glb" },

	{ path: "/background.hdr", name: "background", type: "hdr" },

	// docs 
	{ path: "/pics/hackathonPrize.jpg", name: "HackathonPrize", type: "jpg", isDoc: true },
	{ path: "/pics/hackathonWithMinstors.jpg", name: "HackathonPhoto", type: "jpg", isDoc: true },
	{ path: "/pics/learningMs.png", name: "GatResult", type: "png", isDoc: true },
	{ path: "/pics/meetingPrimeMinstor.png", name: "MeetingAbiy", type: "png", isDoc: true },
	{ path: "/pics/niceGrade.png", name: "niceGrade", type: "png", isDoc: true },

	// tree look
	{ path: "/pics/tree/albedo.png", name: "treeAlbedo", type: "png" },
	{ path: "/pics/tree/height.png", name: "treeHeight", type: "png" },
	{ path: "/pics/tree/metallic.png", name: "treeMetallic", type: "png" },
	{ path: "/pics/tree/normal.png", name: "treeNormal", type: "png" },
	{ path: "/pics/tree/roughness.png", name: "treeRoughness", type: "png" },
]
type loadedAssetType = { name: string, obj: THREE.Object3D<THREE.Object3DEventMap> | THREE.Texture, isDoc?: boolean }
export type assetType = {
	asset2Load: typeof assets2Load,
	loadedAssets: loadedAssetType[],
	addLoadedAsset: (asset: loadedAssetType) => void
}
export const assetData = createStore<assetType>((set) => ({
	asset2Load: assets2Load,
	loadedAssets: [],
	addLoadedAsset: (asset) => { set(state => ({ ...state, loadedAssets: [...state.loadedAssets, asset] })) }
}))

type assetLoaded = {
	loaded: boolean
}
export const assetsLoaded = createStore<assetLoaded>(() => ({
	loaded: false
}))


type doc = {
	name: string
	texture: THREE.Texture,
	mesh: THREE.Mesh
}
type docData = {
	doc: doc[]
	addDoc: (doc: doc) => void
}

export const docData = createStore<docData>((set) => (
	{
		doc: [],
		addDoc: (doc: doc) => { set(state => ({ ...state, doc: [...state.doc, doc] })) },
	}
))
