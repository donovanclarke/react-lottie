import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useMemo,
  useEffect,
  useLayoutEffect,
} from "react";
import lottie, { AnimationConfigWithData, AnimationItem } from "lottie-web";

import getSize from "../utils";
import type { LottieEventListener, LottieProps, LottieRef } from "../types";

// Module-scoped so the default keeps a stable identity across renders
// (an inline `[]` default would be a new array every render and would
// thrash the effect that re-registers listeners).
const EMPTY_EVENT_LISTENERS: LottieEventListener[] = [];

export const Lottie = forwardRef<LottieRef, LottieProps>(function Lottie(
  {
    options,
    eventListeners = EMPTY_EVENT_LISTENERS,
    height,
    width,
    renderAs = "div",
    isStopped = false,
    isPaused = false,
    speed = 1,
    segments,
    direction,
    role = null,
    ariaLabel = "animation",
    isClickToPauseDisabled = false,
    title = null,
    style,
    className = null,
    tabIndex = 0,
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  const Element = renderAs as React.ElementType;
  const interactive = !isClickToPauseDisabled;

  const lottieStyles = useMemo(
    () => ({
      width: getSize(width),
      height: getSize(height),
      outline: "none",
      ...style,
    }),
    [width, height, style],
  );

  const lottieOptions = useMemo(
    () => ({
      renderer: "svg",
      loop: true,
      autoplay: true,
      ...options,
    }),
    [options],
  );

  // Expose an imperative handle so callers can drive the animation directly.
  useImperativeHandle(
    ref,
    () => ({
      play: () => animationRef.current?.play(),
      pause: () => animationRef.current?.pause(),
      stop: () => animationRef.current?.stop(),
      setSpeed: (value) => animationRef.current?.setSpeed(value),
      setDirection: (value) => animationRef.current?.setDirection(value),
      goToAndStop: (value, isFrame) =>
        animationRef.current?.goToAndStop(value, isFrame),
      goToAndPlay: (value, isFrame) =>
        animationRef.current?.goToAndPlay(value, isFrame),
      playSegments: (value, forceFlag) =>
        animationRef.current?.playSegments(value, forceFlag),
      getDuration: (inFrames) => animationRef.current?.getDuration(inFrames),
      get animation() {
        return animationRef.current;
      },
    }),
    [],
  );

  // Create (and re-create) the animation. Keyed on the animation source and
  // the listener set: changing `options.animationData` swaps the animation,
  // and the closed-over `animation` instance is what cleanup destroys, which
  // keeps this correct under React 18 StrictMode double-invocation.
  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const animation = lottie.loadAnimation({
      ...lottieOptions,
      container: containerRef.current,
    } as AnimationConfigWithData);
    animationRef.current = animation;

    eventListeners.forEach(({ eventName, callback }) => {
      animation.addEventListener(eventName, callback);
    });

    // Apply initial speed/direction here because the layout effect below
    // runs before this passive effect on mount (no animation yet).
    animation.setSpeed(speed);
    if (direction) {
      animation.setDirection(direction);
    }

    return () => {
      eventListeners.forEach(({ eventName, callback }) => {
        animation.removeEventListener(eventName, callback);
      });
      animation.destroy();
      animationRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.animationData, eventListeners]);

  // Reflect play/pause/stop/segment props onto the animation.
  useEffect(() => {
    const animation = animationRef.current;
    if (!animation) {
      return;
    }

    if (isStopped) {
      animation.stop();
      return;
    }

    if (isPaused) {
      animation.pause();
      return;
    }

    if (segments) {
      animation.playSegments(segments);
      return;
    }

    animation.play();
  }, [isStopped, isPaused, segments]);

  // Reflect speed/direction changes. useLayoutEffect so the change is applied
  // before paint. Skips on mount (handled in the create effect above).
  useLayoutEffect(() => {
    const animation = animationRef.current;
    if (!animation) {
      return;
    }
    animation.setSpeed(speed);
    if (direction) {
      animation.setDirection(direction);
    }
  }, [speed, direction]);

  const togglePlayPause = () => {
    const animation = animationRef.current;
    if (!animation) {
      return;
    }
    if (animation.isPaused) {
      animation.play();
    } else {
      animation.pause();
    }
  };

  const handleClick = () => {
    if (interactive) {
      togglePlayPause();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (
      event.key === "Enter" ||
      event.key === " " ||
      event.key === "Spacebar"
    ) {
      event.preventDefault();
      togglePlayPause();
    }
  };

  return (
    <Element
      ref={containerRef}
      style={lottieStyles}
      className={className}
      onClick={handleClick}
      onKeyDown={interactive ? handleKeyDown : undefined}
      aria-label={ariaLabel}
      data-testid="react-lottie"
      role={role ?? (interactive ? "button" : undefined)}
      title={title}
      tabIndex={tabIndex}
    />
  );
});

Lottie.displayName = "Lottie";

export default Lottie;
