import React, { useRef, useMemo, useEffect, useLayoutEffect } from "react";
import lottie, { AnimationConfigWithData, AnimationItem } from "lottie-web";

import getSize from "../utils";
import type { LottieEventListener, LottieProps } from "../types";

export function Lottie({
  options,
  eventListeners = [],
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
}: LottieProps) {
  const ref = useRef<HTMLDivElement>(null);
  const loadFunc = useRef<AnimationItem | null>(null);
  const previousOptions = useRef<unknown>(null);

  const Element = renderAs as React.ElementType;

  const lottieStyles = useMemo(
    () => ({
      width: getSize(width),
      height: getSize(height),
      outline: "none",
      ...style,
    }),
    [width, height, style],
  );

  const lottieOptions = useMemo(() => {
    const { loop, autoplay, animationData, rendererSettings } = options;

    return {
      renderer: "svg",
      loop: loop ?? true,
      autoplay: autoplay ?? true,
      segments: options.segments ?? true,
      animationData,
      rendererSettings,
      ...options,
    } as unknown as AnimationConfigWithData;
  }, [options]);

  const registerEvents = (listeners: LottieEventListener[]) => {
    listeners.forEach(({ eventName, callback }) => {
      loadFunc.current?.addEventListener(eventName, callback);
    });
  };

  const destroyRegisterEvents = (listeners: LottieEventListener[]) => {
    listeners.forEach(({ eventName, callback }) => {
      loadFunc.current?.removeEventListener(eventName, callback);
    });

    loadFunc.current?.destroy();
  };

  // handle initialization
  useEffect(() => {
    if (ref.current) {
      previousOptions.current = options.animationData;
      loadFunc.current = lottie.loadAnimation({
        ...lottieOptions,
        container: ref.current,
      });
      registerEvents(eventListeners);
    }

    return () => {
      destroyRegisterEvents(eventListeners);

      loadFunc.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handle pause, stop, segments
  useEffect(() => {
    if (!loadFunc.current) {
      return;
    }

    if (isStopped) {
      loadFunc.current.stop();
      return;
    }

    if (isPaused) {
      loadFunc.current.pause();
      return;
    }

    if (segments) {
      loadFunc.current.playSegments(segments);
      return;
    }

    loadFunc.current.play();
  }, [isStopped, isPaused, segments]);

  // handle speed, direction
  // useLayoutEffect used as it will fire consistently before the browser is painted.
  useLayoutEffect(() => {
    if (loadFunc.current) {
      loadFunc.current.play();
      loadFunc.current.setSpeed(speed);

      if (direction) {
        loadFunc.current.setDirection(direction);
      }
    }
  }, [speed, direction]);

  // handle change of animation
  useEffect(() => {
    if (ref.current && options.animationData !== previousOptions.current) {
      destroyRegisterEvents(eventListeners);

      previousOptions.current = options.animationData;
      loadFunc.current = lottie.loadAnimation({
        ...lottieOptions,
        container: ref.current,
      });
      registerEvents(eventListeners);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.animationData]);

  // handle click to pause functionality
  const handleClickToPause = () => {
    if (isClickToPauseDisabled || !loadFunc.current) {
      return;
    }

    if (loadFunc.current.isPaused) {
      loadFunc.current.play();
      return;
    }

    loadFunc.current.pause();
  };

  return (
    <Element
      ref={ref}
      style={lottieStyles}
      className={className}
      onClick={handleClickToPause}
      aria-label={ariaLabel}
      data-testid="react-lottie"
      role={role}
      title={title}
      tabIndex={tabIndex}
    />
  );
}

export default Lottie;
