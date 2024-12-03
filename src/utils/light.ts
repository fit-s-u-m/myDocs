import { lightType } from "./types";
import { AmbientLight, PointLight, SpotLight } from "three";
import { MyScene } from "../scene";
export function letThereBeLight(type: lightType) {
	let light: AmbientLight | PointLight | SpotLight
	switch (type) {
		case "ambient":
			light = new AmbientLight()
			break
		case "point":
			light = new PointLight()
			break
		case "spot":
			light = new SpotLight()
			break
	}
	MyScene.getScene().add(light)
	return light
}
