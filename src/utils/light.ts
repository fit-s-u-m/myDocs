import { lightType } from "./types";
import {
	AmbientLight,
	PointLight,
	SpotLight,
	PointLightHelper,
	SpotLightHelper,
	DirectionalLight,
	DirectionalLightHelper,
	RectAreaLight
} from "three";
import { MyScene } from "../scene";

export function letThereBeLight(type: lightType) {
	let light: AmbientLight | PointLight | SpotLight | DirectionalLight | RectAreaLight
	let helper: PointLightHelper | SpotLightHelper | DirectionalLightHelper | undefined
	switch (type) {
		case "ambient":
			light = new AmbientLight()
			break
		case "point":
			light = new PointLight()
			helper = new PointLightHelper(light)
			break
		case "spot":
			light = new SpotLight()
			helper = new SpotLightHelper(light)
			break
		case "rectArea":
			light = new RectAreaLight()
			break
		case "directional":
			light = new DirectionalLight()
			helper = new DirectionalLightHelper(light)
			break

	}
	MyScene.getScene().add(light)
	if (helper)
		MyScene.getScene().add(helper)
	return light
}
