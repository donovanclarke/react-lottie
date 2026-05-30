# Lottie Animation View Wrapper for React

## Demo
https://github.com/donovanclarke/react-lottie

## Wrapper of bodymovin.js

[bodymovin](https://github.com/bodymovin/bodymovin) is [Adobe After Effects](http://www.adobe.com/products/aftereffects.html) plugin for exporting animations as JSON, also it provide bodymovin.js for render them as svg/canvas/html.

## Why Lottie?

#### Flexible After Effects features
We currently support solids, shape layers, masks, alpha mattes, trim paths, and dash patterns. And we’ll be adding new features on a regular basis.

#### Manipulate your animation any way you like
You can go forward, backward, and most importantly you can program your animation to respond to any interaction.

#### Small file sizes
Bundle vector animations within your app without having to worry about multiple dimensions or large file sizes. Alternatively, you can decouple animation files from your app’s code entirely by loading them from a JSON API.

[Learn more](http://airbnb.design/introducing-lottie/) › http://airbnb.design/lottie/

Looking for lottie files › https://www.lottiefiles.com/

## Installation

Install through npm:
```
npm install --save react-lottie-wrapper
```

> **TypeScript:** Type definitions are bundled with the package (ESM + CJS) — there is no need to install a separate `@types/...`. The exported types `LottieProps`, `LottieOptions`, `LottieEventListener`, and `LottieRef` are available from `react-lottie-wrapper`.

## Exports

The package exports three components:

- **`Lottie`** — the modern hooks-based component (recommended).
- **`ReactLottie`** — the legacy class-based component. **Deprecated since v2.1; will be removed in v3.**
- **`ReactLottieWithRef`** — the legacy class component wrapped with `forwardRef`. **Deprecated since v2.1; will be removed in v3.**

> The legacy class components now emit a one-time deprecation warning in
> development and are marked `@deprecated` for editors/TypeScript. New code
> should use `Lottie` (it supports refs — see below). See [MIGRATION.md](./MIGRATION.md).

## Usage
A react functional component example (React 16.8.0+).

```jsx
import { useState } from "react";
import { Lottie } from "react-lottie-wrapper";
import * as animationData from "./pinjump.json";

const LottieControl = () => {
  const [isStopped, setIsStopped] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData.default,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <Lottie 
      options={defaultOptions}
      height={400}
      width={400}
      isStopped={isStopped}
      isPaused={isPaused}
    />
  )
}
```
### Imperative control with a ref

Pass a `ref` to drive the animation directly:

```jsx
import { useRef } from "react";
import { Lottie } from "react-lottie-wrapper";
import * as animationData from "./pinjump.json";

const Player = () => {
  const lottieRef = useRef(null);

  return (
    <>
      <Lottie ref={lottieRef} options={{ animationData: animationData.default }} />
      <button type="button" onClick={() => lottieRef.current?.play()}>play</button>
      <button type="button" onClick={() => lottieRef.current?.pause()}>pause</button>
      <button type="button" onClick={() => lottieRef.current?.setSpeed(2)}>2x</button>
    </>
  );
};
```

The ref exposes `play`, `pause`, `stop`, `setSpeed`, `setDirection`,
`goToAndStop`, `goToAndPlay`, `playSegments`, `getDuration`, and the underlying
`animation` instance. (TypeScript: `useRef<LottieRef>(null)`.)

A class based example of implementation. Import pinjump.json.json as animation data.

NOTE: We will be deprecating this in future versions. It is advised that you use the functional version provided. You can see an example of the implementation above. 

```jsx
import React, { Component } from "react"
import { ReactLottie } from "react-lottie-wrapper";
import * as animationData from "./pinjump.json"

export default class LottieControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isStopped: false,
      isPaused: false
    };
    this.handleAnimationAction = this.handleAnimationAction.bind(this);
  }

  handleAnimationAction(action, value) {
    if (action === "play" || action === "stop") {
      const isStopped = value;
      return this.setState({ isStopped });
    }
    this.setState(prevState => ({
      isPaused: !prevState.isPaused
    }));
  };

  render() {
    const { isStopped, isPaused } = this.state;
    const buttonStyle = {
      display: "block",
      margin: "10px auto"
    };

    const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: animationData.default,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };

    return (
      <>
        <ReactLottie
          options={defaultOptions}
          height={400}
          width={400}
          isStopped={isStopped}
          isPaused={isPaused}
        />
        <button
          type="button"
          style={buttonStyle}
          onClick={() => this.handleAnimationAction("stop", true)}
        >
          stop
        </button>
        <button
          type="button"
          style={buttonStyle}
          onClick={() => this.handleAnimationAction("play", false)}
        >
          play
        </button>
        <button
          type="button"
          style={buttonStyle}
          onClick={() => this.handleAnimationAction("pause")}
        >
          pause
        </button>
      </>
    )
  }
}
```

### props
The `<Lottie /> and <ReactLottie />` Components supports the following properties:

**options** *required* 

**animationData** *required*

**rendererSettings** *optional* 

Below are a the available options that are exposed through lottie-web,
these options are available in react-lottie-wrapper.

```
options = {
  loop: // optional
  autoplay: // optional
  animationData: // required 
  path: // optional
  rendererSettings: {
    context: // optional
    preserveAspectRatio: // optional
    clearCanvas: // optional
    progressiveLoad: // optional
    hideOnTransparent: // optional
    className: // optional
    id: // optional
  }
}
```
**renderAs** *optional* [default: `div`]

You are given the option of either a `div` or `span` element. 

**styles** *optional* [default: `{{height: 100%, width: 100%, outline: none}}`]

Insert inline styling for container.

**className** *optional* [default: `null`]

Insert class name for container.

**loop** *optional* [default: `true`]

Should animation loop.

**autoplay** *optional* [default: `true`]

Should animation begin to play automatically.

**isClickToPauseDisabled** *optional* [default: `false`]

Disables click-to-pause. When enabled (the default), clicking the animation
toggles play/pause, and the container also responds to `Enter`/`Space` and
exposes `role="button"` for keyboard accessibility.

**isStopped** *optional* [default: `false`]

Handler to stop the animation.

**isPaused** *optional* [default: `false`]

Handler to pause the animation.

**width** *optional* [default: `100%`]

Pixel value for containers width.

**height** *optional* [default: `100%`]

Pixel value for containers height.

**speed** *optional* [default: `1`]

Set the speed of the animation (`normal === 1`).

**direction** *optional*

Set the direction of the animation. `1` plays forward, `-1` plays in reverse.

**segments** *optional*

Play a specific segment (or array of segments) of the animation, e.g. `[0, 50]`.

**role** *optional* [default: `null`, or `"button"` when click-to-pause is enabled]

**ariaLabel** *optional* [default: `animation`]

**title** *optional* [default: `null`]

**tabIndex** *optional* [default: `0`]

Set the tab index of the container for accessibility. 

**eventListeners** *optional* [default: `[]`]

This is an array of objects containing a `eventName` and `callback` function that will be registered as  eventlisteners on the animation object. refer to [bodymovin#events](https://github.com/bodymovin/bodymovin#events) where the mention using addEventListener, for a list of available custom events.

example:
```jsx
eventListeners=[
  {
    eventName: 'complete',
    callback: () => console.log('the animation completed:'),
  },
]
```

## Related Projects

* [Bodymovin](https://github.com/bodymovin/bodymovin) react-lottie is a wrapper of bodymovin
* [React Native Lottie](https://github.com/airbnb/lottie-react-native) react native implementation by airbnb
* [IOS Lottie](https://github.com/airbnb/lottie-ios) ios implementation by airbnb
* [Android Lottie](https://github.com/airbnb/lottie-android) android implementation by airbnb

## Contribution
Your contributions and suggestions are heartily welcome.

## License
MIT

