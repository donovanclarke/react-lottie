import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import lottie, { AnimationSegment } from "lottie-web";
import Lottie from "./Lottie";
import type { LottieEventListener, LottieOptions, LottieRef } from "../types";

const loadAnimation = lottie.loadAnimation as unknown as jest.Mock;

// Mock the `loadAnimation` function from `lottie-web`
jest.mock("lottie-web", () => ({
  loadAnimation: jest.fn().mockReturnValue({
    play: jest.fn(),
    pause: jest.fn(),
    stop: jest.fn(),
    setSpeed: jest.fn(),
    setDirection: jest.fn(),
    playSegments: jest.fn(),
    goToAndStop: jest.fn(),
    goToAndPlay: jest.fn(),
    getDuration: jest.fn(),
    isPaused: false,
    destroy: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }),
}));

describe("Lottie Component", () => {
  let mockOptions: LottieOptions;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    mockOptions = {
      animationData: {},
      loop: true,
      autoplay: true,
      rendererSettings: {},
    };
  });

  it("should render without crashing", () => {
    render(<Lottie options={mockOptions} />);
    const element = screen.getByTestId("react-lottie");
    expect(element).toBeInTheDocument();
  });

  it("should call loadAnimation on mount", () => {
    render(<Lottie options={mockOptions} />);
    expect(loadAnimation).toHaveBeenCalledTimes(1);
  });

  it("should apply the correct styles", () => {
    const style = { width: "200px", height: "200px" };
    render(<Lottie options={mockOptions} style={style} />);
    const element = screen.getByTestId("react-lottie");
    expect(element).toHaveStyle("width: 200px");
    expect(element).toHaveStyle("height: 200px");
  });

  it("should play the animation on mount when not paused or stopped", () => {
    render(<Lottie options={mockOptions} />);
    const lottieInstanceMock = loadAnimation.mock.results[0].value;

    expect(lottieInstanceMock.play).toHaveBeenCalled();
  });

  it("should pause the animation when isPaused is true", () => {
    render(<Lottie options={mockOptions} isPaused />);
    const lottieInstanceMock = loadAnimation.mock.results[0].value;

    expect(lottieInstanceMock.pause).toHaveBeenCalled();
  });

  it("should stop the animation when isStopped is true", () => {
    render(<Lottie options={mockOptions} isStopped />);
    const lottieInstanceMock = loadAnimation.mock.results[0].value;

    expect(lottieInstanceMock.stop).toHaveBeenCalled();
  });

  it("should toggle playback on click when click-to-pause is enabled", () => {
    const { container } = render(<Lottie options={mockOptions} />);
    const lottieInstance = container.firstChild;
    const lottieInstanceMock = loadAnimation.mock.results[0].value;

    // ignore any play/pause calls made during the mount effects
    lottieInstanceMock.pause.mockClear();

    act(() => {
      fireEvent.click(lottieInstance as Element);
    });

    // the mock reports isPaused: false, so clicking should pause it
    expect(lottieInstanceMock.pause).toHaveBeenCalledTimes(1);
  });

  it("should not toggle playback on click when click-to-pause is disabled", () => {
    const { container } = render(
      <Lottie options={mockOptions} isClickToPauseDisabled />,
    );
    const lottieInstance = container.firstChild;
    const lottieInstanceMock = loadAnimation.mock.results[0].value;

    lottieInstanceMock.pause.mockClear();

    act(() => {
      fireEvent.click(lottieInstance as Element);
    });

    expect(lottieInstanceMock.pause).not.toHaveBeenCalled();
  });

  it("should call playSegments when segments are passed", () => {
    const segments: AnimationSegment = [0, 50];
    render(<Lottie options={mockOptions} segments={segments} />);
    const lottieInstanceMock = loadAnimation.mock.results[0].value;

    expect(lottieInstanceMock.playSegments).toHaveBeenCalledWith(segments);
  });

  it("should set the correct speed", () => {
    const speed = 2;
    render(<Lottie options={mockOptions} speed={speed} />);
    const lottieInstanceMock = loadAnimation.mock.results[0].value;

    waitFor(() => {
      expect(lottieInstanceMock.setSpeed).toHaveBeenCalledWith(speed);
    });
  });

  it("should set the correct direction", () => {
    const direction = -1;
    render(<Lottie options={mockOptions} direction={direction} />);
    const lottieInstanceMock = loadAnimation.mock.results[0].value;

    waitFor(() => {
      expect(lottieInstanceMock.setDirection).toHaveBeenCalledWith(direction);
    });
  });

  it("should update animation when animationData changes", () => {
    const { rerender } = render(
      <Lottie
        options={{ ...mockOptions, animationData: { version: "1.0" } }}
      />,
    );
    const lottieInstanceMock = loadAnimation.mock.results[0].value;

    expect(lottieInstanceMock.destroy).not.toHaveBeenCalled();

    rerender(
      <Lottie
        options={{ ...mockOptions, animationData: { version: "2.0" } }}
      />,
    );

    expect(lottieInstanceMock.destroy).toHaveBeenCalledTimes(1);
    expect(loadAnimation).toHaveBeenCalledTimes(2);
  });

  it("should handle event listeners correctly", () => {
    const eventListeners: LottieEventListener[] = [
      { eventName: "complete", callback: jest.fn() },
      { eventName: "loopComplete", callback: jest.fn() },
    ];
    render(<Lottie options={mockOptions} eventListeners={eventListeners} />);

    const lottieInstanceMock = loadAnimation.mock.results[0].value;

    expect(lottieInstanceMock.addEventListener).toHaveBeenCalledTimes(2);
    expect(lottieInstanceMock.addEventListener).toHaveBeenCalledWith(
      "complete",
      eventListeners[0].callback,
    );
    expect(lottieInstanceMock.addEventListener).toHaveBeenCalledWith(
      "loopComplete",
      eventListeners[1].callback,
    );
  });

  it("should clean up event listeners on destroy", () => {
    const eventListeners: LottieEventListener[] = [
      { eventName: "complete", callback: jest.fn() },
      { eventName: "loopComplete", callback: jest.fn() },
    ];
    const { unmount } = render(
      <Lottie options={mockOptions} eventListeners={eventListeners} />,
    );

    const lottieInstanceMock = loadAnimation.mock.results[0].value;

    expect(lottieInstanceMock.addEventListener).toHaveBeenCalledTimes(2);
    unmount();

    expect(lottieInstanceMock.removeEventListener).toHaveBeenCalledTimes(2);
  });

  it("exposes an imperative handle via ref", () => {
    const ref = React.createRef<LottieRef>();
    render(<Lottie ref={ref} options={mockOptions} />);
    const lottieInstanceMock = loadAnimation.mock.results[0].value;

    act(() => {
      ref.current?.play();
      ref.current?.setSpeed(3);
      ref.current?.goToAndStop(10, true);
    });

    expect(lottieInstanceMock.play).toHaveBeenCalled();
    expect(lottieInstanceMock.setSpeed).toHaveBeenCalledWith(3);
    expect(lottieInstanceMock.goToAndStop).toHaveBeenCalledWith(10, true);
    expect(ref.current?.animation).toBe(lottieInstanceMock);
  });
});
