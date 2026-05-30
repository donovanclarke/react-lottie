import React from "react";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import { loadAnimation } from 'lottie-web';

import { LottieWithRef, Lottie as ReactLottie } from "./LottieLegacy";
import { PinJump, BeatingHeart } from "../stories/assets"; 

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: PinJump,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

// Mock the lottie-web library
jest.mock('lottie-web', () => {
  const pinjump = require('../stories/assets/pinjump.json');

  return {
    loadAnimation: jest.fn(() => ({
      anim: {
        animationData: pinjump,
      },
      stop: jest.fn(),
      play: jest.fn(),
      pause: jest.fn(),
      setSpeed: jest.fn(),
      setDirection: jest.fn(),
      destroy: jest.fn(),
    })),
  };
});


describe("react-lottie", () => {
  describe("props", () => {
    describe("isClickToPauseDisabled", () => {
      it("should prevent handleClickToPause from being called when true", () => {
        const handleClickToPauseSpy = jest.fn();

        ReactLottie.prototype.handleClickToPause = handleClickToPauseSpy;

        const { rerender } = render(<ReactLottie options={defaultOptions} />);
      
        // Get the div element from the rendered component
        const div = screen.getByTestId("react-lottie");
      
        // Click the div and check if the spy was called
        fireEvent.click(div);
        expect(handleClickToPauseSpy).toHaveBeenCalledTimes(1); // Expect it to be called once
      
        // Rerender the component with `isClickToPauseDisabled` prop set to true
        rerender(<ReactLottie options={defaultOptions} isClickToPauseDisabled />);
      
        // Click again and check if the spy is still called the same number of times
        fireEvent.click(div);
        expect(handleClickToPauseSpy).toHaveBeenCalledTimes(1); // Expect it to NOT be called again
      });
    });

    describe("ariaRole, ariaLabel, and title", () => {
      it("should set the aria role correctly", () => {
        render(
          <ReactLottie
            options={defaultOptions}
            role="test"
            ariaLabel="testlabel"
            title="title"
          />
        );

        const divElement = screen.getByTestId('react-lottie');

        expect(divElement).toHaveAttribute("aria-label", "testlabel");
        expect(divElement).toHaveAttribute(("title", "title"));
      });
    });

    describe("height and width", () => {
      it("should set the inline styles correctly", () => {
        render(
          <ReactLottie options={defaultOptions} height={199} width={188} />
        );

        const divElement = screen.getByTestId('react-lottie');

        expect(divElement).toHaveStyle("width: 188px");
        expect(divElement).toHaveStyle("height: 199px");
      });
    });
  });

  describe("component lifecycle", () => {
    afterEach(() => {
      cleanup();
      jest.clearAllMocks();
    });
    describe("componentDidMount", () => {
      it("should register events", async () => {
        const registerEventsSpy = jest.fn();
        // Mock the registerEvents function in the component's prototype
        ReactLottie.prototype.registerEvents = registerEventsSpy;

        // Render the component
        await act(async () => {
          render(<ReactLottie options={{ animationData: PinJump, loop: true, autoplay: true }} />);
        });

        expect(registerEventsSpy).toHaveBeenCalledTimes(1);
      });

      it("should load the animation", async () => {
        const ref = React.createRef();
  
        // Initially render with the first animationData (pinjump)
        render(
          <LottieWithRef ref={ref} options={{ animationData: PinJump }} />
        );

        // Access the component instance via ref
        const componentInstance = ref.current;
        // Access the ref's element, which was assigned in componentDidMount
        const element = componentInstance?.ReactLottieRef?.current?.anim;

        // Ensure anim is properly initialized
        expect(element).toHaveProperty('anim');
        expect(element.anim).toHaveProperty('animationData');
        await act(async () => {
          // Ensures the component has mounted and componentDidMount has been called
          await Promise.resolve(); // Allow async lifecycle methods to run
        });
  
        expect(JSON.stringify(element.anim.animationData.layers)).toContain(JSON.stringify(PinJump.layers));
      });
    });

    describe("componentDidUpdate", () => {
      it("should register events when animationData changes", async () => {
        const registerEventsSpy = jest.fn();
        const { rerender } = render(
          <ReactLottie options={{ ...defaultOptions, animationData: PinJump }} />
        );

        // Mock the registerEvents function on the instance of the component
        const instance = ReactLottie.prototype;
        instance.registerEvents = registerEventsSpy;

        await act(async () => {
          rerender(
            <ReactLottie
              options={{
                ...defaultOptions,
                animationData: JSON.parse(JSON.stringify(BeatingHeart)),
              }}
            />
          );
        });

        await act(async () => {
          rerender(
            <ReactLottie
              options={{
                ...defaultOptions,
                animationData: JSON.parse(JSON.stringify(BeatingHeart)),
              }}
            />
          );
        });

        expect(registerEventsSpy).toHaveBeenCalled();
      });
    });

    describe("componentDidUnmount", () => {
      it("should de-register events", async () => {
        const deRegisterEventsSpy = jest.fn();

        const { unmount } = render(
          <ReactLottie options={defaultOptions} />
        );

        const instance = ReactLottie.prototype;
        instance.deRegisterEvents = deRegisterEventsSpy;

        unmount();

        expect(deRegisterEventsSpy).toHaveBeenCalledTimes(1);
      });

      it("should destroy the animation", async () => {
        const destroySpy = jest.fn();
        const deRegisterEventsSpy = jest.fn();

        // Mock the ReactLottie prototype methods
        ReactLottie.prototype.deRegisterEvents = deRegisterEventsSpy;
        ReactLottie.prototype.destroy = destroySpy;

        const { unmount } = render(
          <ReactLottie options={defaultOptions} />
        )

        // check that loadAnimation is called at the creation of the component
        expect(loadAnimation).toHaveBeenCalledTimes(1);
        expect(loadAnimation).toHaveBeenCalledWith(expect.objectContaining({ animationData: PinJump }))

        unmount();

        expect(deRegisterEventsSpy).toHaveBeenCalledTimes(1);
        expect(destroySpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
