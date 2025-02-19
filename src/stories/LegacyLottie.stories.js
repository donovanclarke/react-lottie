import Lottie from '../index';
import * as animationDataA from './pinjump.json';

export default {
    title: 'Example/Legacy Lottie',
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
        }
      },
  };

  export const LottieExample = {
    args: {
      isClickToPauseDisabled: {}
    }
  };