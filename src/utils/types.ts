import { AnimationAction, AnimationMixer } from "three";

export type lightType = "ambient" | "spot" | "point" | "directional" | "rectArea";
export type MixerWithAction = { mixer: AnimationMixer, action: AnimationAction }
