import { Scene } from 'three'

export class MyScene extends Scene {
	private static instance: MyScene | null = null
	private constructor() { super() } // nobody can instansiate this

	public static getScene(): MyScene {
		if (!MyScene.instance) MyScene.instance = new MyScene()
		return MyScene.instance
	}
}
