import React, { useState } from 'react';

import Lottie from '../hook';

import * as animationDataA from './pinjump.json';
import * as TwitterHeart from './TwitterHeart.json';

export default {
    title: 'Lottie/Hook Based Lottie',
    component: Lottie,
    parameters: {
      layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        style: { margin: '0px auto' },
        isStopped: false,
        height: 200,
        width: 200,
        isPaused: false,
        speed: 1,
        direction: 1,
        options: {
          animationData: animationDataA,
        },
        isClickToPauseDisabled: true,
      },
  };

  const ToggleLottie = () => {
    const [state, setState] = useState({
        isStopped: true,
        isPaused: false,
        speed: 1,
        direction: 1,
        isLike: false,
      });

    const centerStyle = {
      display: 'block',
      margin: '10px auto',
      textAlign: 'center',
      pointer: 'cursor',
    };
    const elementStyle = { margin: "0px auto" };
    const defaultOptions = { animationData: TwitterHeart, loop: false, autoplay: false };
    const { isStopped, isPaused, direction } = state;

    const clickHandler = () => {
      if (!state.isStopped) {
        setState((prevState) => ({ ...prevState, direction: prevState.direction * -1 }));
      }
      setState((prevState) => ({ ...prevState, isStopped: false, isLike: !prevState.isLike }));
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
        <button style={centerStyle} onClick={clickHandler}>{state.isLike ? 'unlike' : 'like'}</button>
      </div>
    );
  }

  const LottieSegment = () => {
    const [state, setState] = useState({
      isStopped: false,
      isPaused: false,
      speed: 1,
      direction: 1,
      endFrame: 50,
    });
    const [startFrame, setStartFrame] = useState(0);
    const [endFrame, setEndFrame] = useState(50);
    const centerStyle = {
      display: 'block',
      margin: '10px auto',
      textAlign: 'center',
    };
    const elementStyle = { margin: "0px auto" };
    const defaultOptions = { animationData: animationDataA };
    const { isStopped, isPaused, speed, direction } = state;

    const handleSetStartFrame = (event) => {
      setStartFrame(event.currentTarget.value);
    }

    const handleSetEndFrame = (event) => {
      setEndFrame(event.currentTarget.value);
    }
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
          type="range" value={speed} min="0" max="3" step="0.5"
          onChange={e => setState({ speed: e.currentTarget.value })}
        />
        <p style={centerStyle}>Segment range: [{startFrame}, {endFrame}]</p>
        <div style={centerStyle}>
          <input
            type="text" value={startFrame}
            onChange={handleSetStartFrame}
          />
          <input
            type="text" value={endFrame}
            onChange={handleSetEndFrame}
          />
        </div>
      </div>
    );
  }

  const LottieAnimation = () => {
    const [toggle, setToggle] = useState(true);
    const elementStyle = { margin: "0px auto" };

    const defaultOptions = { 
      animationData: (toggle ? animationDataA : TwitterHeart) 
    };

    const handleToggleChange = () => {
      setToggle((prevState) => !prevState);
    }

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
    )
  }

  export const Default = {};

  export const Toggle = {
    render: () => <ToggleLottie />
  };

  export const Segment = {
    render: () => <LottieSegment />
  };

  export const ChangeAnimation = {
    render: () => <LottieAnimation />
  };
