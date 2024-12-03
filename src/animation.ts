import { gsap } from "gsap";
import { Flip } from "gsap/Flip"
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
