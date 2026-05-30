import React, { useState } from "react";

import { Lottie } from ".";

import { PinJump, BeatingHeart, TwitterHeart } from "../stories/assets";

export default {
  title: "Lottie/Hook Based Lottie",
  component: Lottie,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    style: { margin: "0px auto" },
    isStopped: false,
    height: 200,
    width: 200,
    isPaused: false,
    speed: 1,
    direction: 1,
    options: {
      animationData: PinJump,
    },
    isClickToPauseDisabled: true,
  },
};

const centerStyle = {
  display: "block",
  margin: "10px auto",
  textAlign: "center",
};
const elementStyle = { margin: "0px auto" };

function ToggleLottie() {
  const [state, setState] = useState({
    isStopped: true,
    isPaused: false,
    speed: 1,
    direction: 1,
    isLike: false,
  });

  const defaultOptions = {
    animationData: TwitterHeart,
    loop: false,
    autoplay: false,
  };
  const { isStopped, isPaused, direction } = state;

  const clickHandler = () => {
    if (!state.isStopped) {
      setState((prevState) => ({
        ...prevState,
        direction: prevState.direction * -1,
      }));
    }
    setState((prevState) => ({
      ...prevState,
      isStopped: false,
      isLike: !prevState.isLike,
    }));
  };

  return (
    <div>
      <Lottie
        style={elementStyle}
        options={defaultOptions}
        height={200}
        width={200}
        isStopped={isStopped}
        isPaused={isPaused}
        speed={1}
        direction={direction}
      />
      <button style={centerStyle} onClick={clickHandler}>
        {state.isLike ? "unlike" : "like"}
      </button>
    </div>
  );
}

function LottieSegment() {
  const [state, setState] = useState({
    isStopped: false,
    isPaused: false,
    speed: 1,
    direction: 1,
    endFrame: 50,
  });
  const [startFrame, setStartFrame] = useState(0);
  const [endFrame, setEndFrame] = useState(50);

  const defaultOptions = { animationData: PinJump };
  const { isStopped, isPaused, speed, direction } = state;

  const handleSetStartFrame = (event) => {
    setStartFrame(event.currentTarget.value);
  };

  const handleSetEndFrame = (event) => {
    setEndFrame(event.currentTarget.value);
  };
  return (
    <div>
      <Lottie
        style={elementStyle}
        options={defaultOptions}
        height={100}
        width={100}
        isStopped={isStopped}
        isPaused={isPaused}
        speed={speed}
        segments={[startFrame || 0, endFrame || 0]}
        direction={direction}
      />
      <p style={centerStyle}>Speed: x{speed}</p>
      <input
        style={centerStyle}
        type="range"
        value={speed}
        min="0"
        max="3"
        step="0.5"
        onChange={(e) => setState({ speed: e.currentTarget.value })}
      />
      <p style={centerStyle}>
        Segment range: [{startFrame}, {endFrame}]
      </p>
      <div style={centerStyle}>
        <input type="text" value={startFrame} onChange={handleSetStartFrame} />
        <input type="text" value={endFrame} onChange={handleSetEndFrame} />
      </div>
    </div>
  );
}

function LottieAnimation() {
  const [toggle, setToggle] = useState(true);
  const elementStyle = { margin: "0px auto" };

  const defaultOptions = {
    animationData: toggle ? PinJump : TwitterHeart,
  };

  const handleToggleChange = () => {
    setToggle((prevState) => !prevState);
  };

  return (
    <div>
      <Lottie
        style={elementStyle}
        options={defaultOptions}
        height={100}
        width={100}
        isStopped={false}
        isPaused={false}
        speed={1}
        direction={1}
      />
      <button onClick={handleToggleChange}>Toggle Animation</button>
    </div>
  );
}

function LottieLoop() {
  const [isTransitioned, setIsTransitioned] = useState(false);

  const defaultOptions = {
    animationData: !isTransitioned ? TwitterHeart : BeatingHeart,
    loop: true,
    autoplay: true,
  };

  const transition = () => {
    setIsTransitioned((prevState) => !prevState);
  };

  const clickHandler = () => {
    setIsTransitioned((prevState) => !prevState);
  };

  return (
    <div>
      <Lottie
        style={elementStyle}
        options={defaultOptions}
        height={200}
        width={200}
        eventListeners={
          !isTransitioned
            ? [
                {
                  eventName: "loopComplete",
                  callback: () => transition(),
                },
              ]
            : []
        }
      />
      <button style={centerStyle} onClick={clickHandler}>
        restart
      </button>
    </div>
  );
}

function LottieTransition() {
  const [showLoopedAnimation, setShowLoopedAnimation] = useState(true);

  const animationOptionsWithLoop = {
    animationData: PinJump,
    loop: true,
  };

  const animationOptionsWithoutLoop = {
    animationData: BeatingHeart,
    loop: false,
  };

  const clickHandler = () => {
    setShowLoopedAnimation((prevState) => !prevState);
  };

  return (
    <div>
      <Lottie
        style={elementStyle}
        options={
          showLoopedAnimation
            ? animationOptionsWithLoop
            : animationOptionsWithoutLoop
        }
        height={200}
        width={200}
      />
      <p style={centerStyle}>
        This animation is {showLoopedAnimation ? "looped" : "not looped"}
      </p>
      <button style={centerStyle} onClick={clickHandler}>
        switch
      </button>
    </div>
  );
}

export const Default = {};

export const Toggle = {
  render: () => <ToggleLottie />,
};

export const Segment = {
  render: () => <LottieSegment />,
};

export const ChangeAnimation = {
  render: () => <LottieAnimation />,
};

export const LottieLoopTransition = {
  render: () => <LottieLoop />,
};

export const TransitionOptions = {
  render: () => <LottieTransition />,
};
