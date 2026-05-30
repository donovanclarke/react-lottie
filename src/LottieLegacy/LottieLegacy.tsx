import React, { Component } from "react";
import lottie, { AnimationItem } from "lottie-web";

import getSize from "../utils";
import type { LottieEventListener, LottieProps } from "../types";

interface LottieRefStore {
  element: HTMLElement | null;
  options: Record<string, unknown> | null;
  anim: AnimationItem | null;
}

class Lottie extends Component<LottieProps> {
  static defaultProps: Partial<LottieProps> = {
    renderAs: "div",
    eventListeners: [],
    isStopped: false,
    isPaused: false,
    speed: 1,
    role: null,
    ariaLabel: "animation",
    isClickToPauseDisabled: false,
    title: null,
    className: null,
    tabIndex: 0,
  };

  ReactLottieRef: { current: LottieRefStore } = {
    current: { element: null, options: null, anim: null },
  };

  componentDidMount() {
    const { options, eventListeners } = this.props;
    const { loop, autoplay, animationData, rendererSettings } = options;

    const createOptions = {
      container: this.ReactLottieRef.current.element,
      renderer: "svg",
      loop: loop !== false,
      autoplay: autoplay !== false,
      animationData,
      rendererSettings,
      ...options,
    };

    this.setOptions(createOptions);
    this.ReactLottieRef.current.anim = lottie.loadAnimation(
      this.getOptions() as never,
    );
    this.registerEvents(eventListeners as LottieEventListener[]);
  }

  componentDidUpdate(nextProps: LottieProps) {
    /* Recreate the animation handle if the data is changed */
    const { eventListeners, isStopped, segments } = this.props;

    if (nextProps.options.animationData !== this.props.options.animationData) {
      this.deRegisterEvents(eventListeners as LottieEventListener[]);
      this.destroy();

      const updateOptions = {
        ...this.ReactLottieRef.current.options,
        ...this.props.options,
      };
      this.setOptions(updateOptions);
      this.ReactLottieRef.current.anim = lottie.loadAnimation(
        this.getOptions() as never,
      );
      this.registerEvents(nextProps.eventListeners as LottieEventListener[]);
    }

    if (isStopped) {
      this.stop();
    } else if (segments) {
      this.playSegments();
    } else {
      this.play();
    }

    this.pause();
    this.setSpeed();
    this.setDirection();
  }

  componentWillUnmount() {
    this.deRegisterEvents(this.props.eventListeners as LottieEventListener[]);
    this.destroy();
    if (this.ReactLottieRef.current.options) {
      this.ReactLottieRef.current.options.animationData = null;
    }
    this.ReactLottieRef.current.anim = null;
  }

  setOptions(options: Record<string, unknown>) {
    this.ReactLottieRef.current.options = {
      ...this.ReactLottieRef.current.options,
      ...options,
    };
  }

  getOptions() {
    return this.ReactLottieRef.current.options;
  }

  setSpeed() {
    this.ReactLottieRef.current.anim?.setSpeed(this.props.speed ?? 1);
  }

  setDirection() {
    if (this.props.direction) {
      this.ReactLottieRef.current.anim?.setDirection(this.props.direction);
    }
  }

  play() {
    this.ReactLottieRef.current.anim?.play();
  }

  playSegments() {
    if (this.props.segments) {
      this.ReactLottieRef.current.anim?.playSegments(this.props.segments);
    }
  }

  stop() {
    this.ReactLottieRef.current.anim?.stop();
  }

  pause() {
    const { anim } = this.ReactLottieRef.current;
    if (!anim) {
      return;
    }
    if (this.props.isPaused && !anim.isPaused) {
      anim.pause();
    } else if (!this.props.isPaused && anim.isPaused) {
      anim.pause();
    }
  }

  destroy() {
    this.ReactLottieRef.current.anim?.destroy();
  }

  registerEvents(eventListeners: LottieEventListener[]) {
    eventListeners.forEach(({ eventName, callback }) => {
      this.ReactLottieRef.current.anim?.addEventListener(eventName, callback);
    });
  }

  deRegisterEvents(eventListeners: LottieEventListener[]) {
    eventListeners.forEach(({ eventName, callback }) => {
      this.ReactLottieRef.current.anim?.removeEventListener(
        eventName,
        callback,
      );
    });
  }

  handleClickToPause() {
    // The pause() method is for handling pausing by passing a prop isPaused
    // This method is for handling the ability to pause by clicking on the animation
    const { anim } = this.ReactLottieRef.current;
    if (!anim) {
      return;
    }
    if (anim.isPaused) {
      anim.play();
      return;
    }
    anim.pause();
  }

  render() {
    const {
      renderAs,
      width,
      height,
      ariaLabel,
      isClickToPauseDisabled,
      style,
      isStopped,
      isPaused,
      eventListeners,
      options,
      ...extraProps
    } = this.props;

    const lottieStyles = {
      width: getSize(width),
      height: getSize(height),
      outline: "none",
      ...style,
    };
    const onClickHandler = isClickToPauseDisabled
      ? () => null
      : this.handleClickToPause;
    const Element = renderAs as React.ElementType;

    return (
      <Element
        ref={(element: HTMLElement | null) => {
          this.ReactLottieRef.current.element = element;
        }}
        style={lottieStyles}
        onClick={onClickHandler}
        aria-label={ariaLabel}
        data-testid="react-lottie"
        {...(extraProps as Record<string, unknown>)}
      />
    );
  }
}

const LottieWithRef = React.forwardRef<Lottie, LottieProps>((props, ref) => (
  <Lottie {...props} ref={ref} />
));

export { Lottie, LottieWithRef };
