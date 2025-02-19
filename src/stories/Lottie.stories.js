import React, { useState } from 'react';

import Lottie from '../hook';

import * as animationDataA from './pinjump.json';
import * as TwitterHeart from './TwitterHeart.json';

export default {
    title: 'Lottie/Hook Based',
    component: Lottie,
    parameters: {
      // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
      layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
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
    };
    const elementStyle = { margin: "0px auto" };
    const defaultOptions = { animationData: TwitterHeart, loop: false, autoplay: false };
    const { isStopped, isPaused, speed, direction } = state;

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

  export const LottieExample = {};

  export const Toggle = {
    render: () => <ToggleLottie />
  };