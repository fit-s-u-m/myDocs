import { AnimationAction, AnimationMixer } from 'three'
import { MixerWithAction } from './types';

export class MyMixers {
	private static mixers: MixerWithAction[] = []
	private static instance: MyMixers | null = null
	private static openDoorMixer: MixerWithAction
	private static closeDoorMixer: MixerWithAction
	private static isDoorOpened = false

	private constructor() { } // nobody can instansiate this
	public addMixer(mixer: AnimationMixer, action: AnimationAction) {
		MyMixers.mixers.push({ mixer, action });
	}
	public addOpenDoorMixer(mixer: AnimationMixer, action: AnimationAction) {
		MyMixers.openDoorMixer = { mixer, action }
	}
	public addCloseDoorMixer(mixer: AnimationMixer, action: AnimationAction) {
		MyMixers.closeDoorMixer = { mixer, action }
	}
	public getOpenDoorMixer() {
		return MyMixers.openDoorMixer;
	}
	public getCloseDoorMixer() {
		return MyMixers.closeDoorMixer;
	}
	public getMixers(): MixerWithAction[] {
		return [...MyMixers.mixers, MyMixers.openDoorMixer, MyMixers.closeDoorMixer];
	}
	public setDoorState(value: boolean) {
		MyMixers.isDoorOpened = value
	}
	public getDoorState() {
		return MyMixers.isDoorOpened
	}

	public static getInstance(): MyMixers {
		if (!MyMixers.instance) {
			MyMixers.instance = new MyMixers()
		}
		return MyMixers.instance
	}
}
