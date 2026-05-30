import type { CSSProperties } from "react";
import type {
  AnimationDirection,
  AnimationEventCallback,
  AnimationEventName,
  AnimationSegment,
} from "lottie-web";

export interface LottieEventListener {
  eventName: AnimationEventName;
  callback: AnimationEventCallback;
}

export interface LottieOptions {
  animationData?: unknown;
  path?: string;
  loop?: boolean | number;
  autoplay?: boolean;
  rendererSettings?: Record<string, unknown>;
  segments?: boolean | AnimationSegment | AnimationSegment[];
  [key: string]: unknown;
}

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
