import React, { useRef, useMemo, useEffect, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import { loadAnimation } from "lottie-web";

import getSize from "../utils";

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
}) {
  const ref = useRef(null);
  const loadFunc = useRef(null);
  const previousOptions = useRef(null);

  const Element = renderAs;

  const lottieStyles = useMemo(() => {
    return {
      width: getSize(width),
      height: getSize(height),
      outline: "none",
      ...style,
    };
  }, [width, height, style]);

  const lottieOptions = useMemo(() => {
    const { loop, autoplay, animationData, rendererSettings, segments } =
      options;

    return {
      renderer: "svg",
      loop: loop ?? true,
      autoplay: autoplay ?? true,
      segments: segments ?? true,
      animationData,
      rendererSettings,
      ...options,
    };
  }, [options]);

  // handle initialization
  useEffect(() => {
    if (ref.current) {
      previousOptions.current = options.animationData;
      loadFunc.current = loadAnimation({
        ...lottieOptions,
        container: ref.current,
      });
      registerEvents(eventListeners);
    }

    return () => {
      destroyRegisterEvents(eventListeners);

      loadFunc.current = null;
    }
  }, []);

  // handle pause, stop, segments
  useEffect(() => {
    if (isStopped) {
      return loadFunc.current.stop();
    }

    if (isPaused) {
      return loadFunc.current.pause();
    }

    if (segments) {
      return loadFunc.current.playSegments(segments);
    }

    loadFunc.current.play();
  }, [isStopped, isPaused, segments]);

  // handle speed, direction
  // useLayoutEffect used as it will fire consistently before the browser is painted.
  useLayoutEffect(() => {
    if (loadFunc.current) {
      loadFunc.current.play();

      loadFunc.current.setSpeed(speed);
      loadFunc.current.setDirection(direction);
    }
  }, [speed, direction]);

  // handle change of animation
  useEffect(() => {
    if (options.animationData !== previousOptions.current) {
      destroyRegisterEvents(eventListeners);

      previousOptions.current = options.animationData;
      loadFunc.current = loadAnimation({
        ...lottieOptions,
        container: ref.current,
      });
      registerEvents(eventListeners);
    }
  }, [options.animationData]);

  const registerEvents = (eventListeners) => {
    eventListeners.forEach(({ eventName, callback }) => {
      loadFunc.current.addEventListener(eventName, callback);
    });
  };

  const destroyRegisterEvents = (eventListeners) => {
    eventListeners.forEach(({ eventName, callback }) => {
      loadFunc.current.removeEventListener(eventName, callback);
    });

    return loadFunc.current.destroy();
  };

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

Lottie.propTypes = {
  options: PropTypes.object.isRequired,
  eventListeners: PropTypes.arrayOf(PropTypes.object),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  renderAs: PropTypes.oneOf(["div", "span"]),
  isStopped: PropTypes.bool,
  isPaused: PropTypes.bool,
  speed: PropTypes.number,
  segments: PropTypes.arrayOf(PropTypes.number),
  direction: PropTypes.number,
  role: PropTypes.string,
  ariaLabel: PropTypes.string,
  isClickToPauseDisabled: PropTypes.bool,
  title: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  tabIndex: PropTypes.number,
};

export default Lottie;
