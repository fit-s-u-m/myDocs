import { gsap } from "gsap";
import { Flip } from "gsap/Flip"
import { Camera } from "./utils/camera";
import { Controls, LoopOnce, Matrix4, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { MyMixers } from "./utils/mixer";
gsap.registerPlugin(Flip);

export function loadAnimation() {
	const timeline = gsap.timeline();
	timeline.to("#overlay", {
		opacity: 0,
	})
	timeline.to("#loading-bar", {
		width: "60%"
	})
	timeline.pause()
	return timeline
}

export function lookAtHouse(camera: Camera) {
	const timeline = gsap.timeline();
	timeline.to(camera.position,
		{ duration: 10, x: 0, z: 20, y: 2 });
}
export function openDoor() {
	const mixer = MyMixers.getInstance().getOpenDoorMixer()
	const action = mixer.action
	if (!mixer || !mixer.action) {
		console.warn("No valid mixer or action found for closing the door.");
		return;
	}
	if (MyMixers.getInstance().getDoorState()) {
		return
	}
	console.log("animation open door")
	action.setLoop(LoopOnce, 1);  // Play once
	action.clampWhenFinished = true;
	MyMixers.getInstance().setDoorState(true)
	action.play() // open door
}
export function closeDoor() {
	const mixer = MyMixers.getInstance().getCloseDoorMixer()
	const action = mixer.action
	if (!mixer || !mixer.action) {
		console.warn("No valid mixer or action found for closing the door.");
		return;
	}
	if (MyMixers.getInstance().getDoorState() == false) {
		return
	}
	action.setLoop(LoopOnce, 1);  // Play once
	console.log("animation close door")
	action.clampWhenFinished = true;
	MyMixers.getInstance().setDoorState(false)
	action.play() // close door
}
export function lookAround(camera: Camera, controler: OrbitControls) {
	const timeline = gsap.timeline();

	const mixer = MyMixers.getInstance().getOpenDoorMixer()
	const action = mixer.action
	action.setLoop(LoopOnce, 1);  // Play once
	action.clampWhenFinished = true;
	console.log(action)
	action.play() // open door

	// 1. Move camera to new position while always looking at a point
	timeline.to(camera.position, {
		duration: 10,
		x: 0,
		z: 0,
		y: 1.5,
	});
	controler.update();
	// const center = new Vector3(0, 0, 0);
	// const r = 1
	// timeline.to({ angle: 0 }, {
	// 	duration: 6,
	// 	angle: Math.PI * 2,
	// 	ease: 'none',
	// 	onUpdate() {
	// 		const angle = this.targets()[0].angle;
	//
	// 		// Update position in XZ plane
	// 		const x = r * Math.cos(angle);
	// 		const z = r * Math.sin(angle);
	// 		const y = 1.5;
	//
	// 		camera.position.set(x, y, z);
	//
	// 		const direction = new Vector3().subVectors(camera.position, center).normalize();
	// 		const target = camera.position.clone().add(direction);
	// 		const lookAtMatrix = new Matrix4().lookAt(camera.position, new Vector3(0, 1, 0), target);
	// 		camera.quaternion.setFromRotationMatrix(lookAtMatrix);
	//
	// 	}
	// }, '>');
	//
	// MyMixers.getInstance().getMixers().forEach(mixer => {
	// 	const action = mixer.action
	// 	action.setLoop(LoopOnce, 1);  // Play once
	// 	action.clampWhenFinished = true;
	// 	console.log(action)
	// 	action.play() // open door
	// })
	//
}


export const bringDocsUp = (docName: string) => {
	const doc = document.getElementById(docName) as HTMLDialogElement
	const app = document.getElementById("app")
	if (!doc || !app) return
	doc.showModal()
	// doc.style.display = "flex"
	// app.style.display = "none"
	// doc.classList.toggle("front-display")
}
