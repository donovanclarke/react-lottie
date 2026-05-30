import type { CSSProperties } from "react";
import type {
  AnimationConfig,
  AnimationDirection,
  AnimationEventCallback,
  AnimationEventName,
  AnimationItem,
  AnimationSegment,
} from "lottie-web";

export interface LottieEventListener {
  eventName: AnimationEventName;
  callback: AnimationEventCallback;
}

/**
 * Configuration forwarded to `lottie-web`'s `loadAnimation`, minus the
 * `container` (which this component owns). Provide either `animationData`
 * (inline JSON) or `path` (URL to a JSON file).
 */
export type LottieOptions = Omit<AnimationConfig, "container"> & {
  animationData?: unknown;
  path?: string;
};

export interface LottieProps {
  options: LottieOptions;
  eventListeners?: LottieEventListener[];
  height?: number | string;
  width?: number | string;
  renderAs?: "div" | "span";
  isStopped?: boolean;
  isPaused?: boolean;
  speed?: number;
  segments?: AnimationSegment | AnimationSegment[];
  direction?: AnimationDirection;
  role?: string | null;
  ariaLabel?: string;
  isClickToPauseDisabled?: boolean;
  title?: string | null;
  style?: CSSProperties;
  className?: string | null;
  tabIndex?: number;
}

/**
 * Imperative handle exposed via `ref`, letting callers drive the animation
 * directly (e.g. `ref.current?.play()`). `animation` is the underlying
 * `lottie-web` instance, or `null` before mount / after unmount.
 */
export interface LottieRef {
  play(): void;
  pause(): void;
  stop(): void;
  setSpeed(speed: number): void;
  setDirection(direction: AnimationDirection): void;
  goToAndStop(value: number | string, isFrame?: boolean): void;
  goToAndPlay(value: number | string, isFrame?: boolean): void;
  playSegments(
    segments: AnimationSegment | AnimationSegment[],
    forceFlag?: boolean,
  ): void;
  getDuration(inFrames?: boolean): number | undefined;
  readonly animation: AnimationItem | null;
}
