import { Fog, Scene } from 'three'

export class MyScene extends Scene {
	private static instance: MyScene | null = null
	private constructor() { super() } // nobody can instansiate this

	public static getScene(): MyScene {
		if (!MyScene.instance) {
			MyScene.instance = new MyScene()
			MyScene.instance.fog = new Fog("black", 10, 25)
		}
		return MyScene.instance
	}
}
