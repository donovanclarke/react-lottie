import React, { Component } from "react";
import PropTypes from "prop-types";
import { loadAnimation } from "lottie-web";

import getSize from "../utils";

class Lottie extends Component {
  constructor(props) {
    super(props)

    this.ReactLottieRef = React.createRef();
    this.ReactLottieRef.current = { element: null, options: null, anim: null };
  }

  static propTypes = {
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

  static defaultProps = {
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

  componentDidMount() {
    const { options, eventListeners } = this.props;
    const { loop, autoplay, animationData, rendererSettings, segments } =
      options;

    const createOptions = {
      container: this.ReactLottieRef.current.element,
      renderer: "svg",
      loop: loop !== false,
      autoplay: autoplay !== false,
      segments: segments !== false,
      animationData,
      rendererSettings,
      ...options,
    }

    this.setOptions(createOptions);
    this.ReactLottieRef.current.anim = loadAnimation(this.getOptions());
    this.registerEvents(eventListeners);
  }

  componentDidUpdate(nextProps) {
    /* Recreate the animation handle if the data is changed */
    const { eventListeners, isStopped, segments } = this.props;

    if (nextProps.options.animationData !== this.props.options.animationData) {
      console.log('update');
      this.deRegisterEvents(eventListeners);
      this.destroy();

      const updateOptions = { ...this.ReactLottieRef.current.options, ...this.props.options };
      this.setOptions(updateOptions);
      this.ReactLottieRef.current.anim = loadAnimation(this.getOptions());
      this.registerEvents(nextProps.eventListeners);
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
    this.deRegisterEvents(this.props.eventListeners);
    this.destroy();
    this.ReactLottieRef.current.options.animationData = null;
    this.ReactLottieRef.current.anim = null;
  }

  setOptions(options) {
    this.ReactLottieRef.current.options = { ...this.ReactLottieRef.current.options, ...options };
  }

  getOptions() {
    return this.ReactLottieRef.current.options;
  }

  setSpeed() {
    this.ReactLottieRef.current.anim.setSpeed(this.props.speed);
  }

  setDirection() {
    this.ReactLottieRef.current.anim.setDirection(this.props.direction);
  }

  play() {
    this.ReactLottieRef.current.anim.play();
  }

  playSegments() {
    this.ReactLottieRef.current.anim.playSegments(this.props.segments);
  }

  stop() {
    this.ReactLottieRef.current.anim.stop();
  }

  pause() {
    if (this.props.isPaused && !this.ReactLottieRef.current.anim.isPaused) {
      this.ReactLottieRef.current.anim.pause();
    } else if (!this.props.isPaused && this.ReactLottieRef.current.anim.isPaused) {
      this.ReactLottieRef.current.anim.pause();
    }
  }

  destroy() {
    this.ReactLottieRef.current.anim.destroy();
  }

  registerEvents(eventListeners) {
    eventListeners.forEach(({ eventName, callback }) => {
      this.ReactLottieRef.current.anim.addEventListener(eventName, callback);
    });
  }

  deRegisterEvents(eventListeners) {
    eventListeners.forEach(({ eventName, callback }) => {
      this.ReactLottieRef.current.anim.removeEventListener(eventName, callback);
    });
  }

  handleClickToPause() {
    // The pause() method is for handling pausing by passing a prop isPaused
    // This method is for handling the ability to pause by clicking on the animation
    if (this.ReactLottieRef.current.anim.isPaused) {
      return this.ReactLottieRef.current.anim.play();
    }
    this.ReactLottieRef.current.anim.pause();
  };

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
    const Element = renderAs;

    return (
      <Element
        ref={(element) => {
          this.ReactLottieRef.current.element = element;
        }}
        style={lottieStyles}
        onClick={onClickHandler}
        aria-label={ariaLabel}
        data-testid="react-lottie"
        {...extraProps}
      />
    );
  }
}

const LottieWithRef = React.forwardRef((props, ref) => {
  return <Lottie {...props} ref={ref} />;
});

export { Lottie, LottieWithRef };
