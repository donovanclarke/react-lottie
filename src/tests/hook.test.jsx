import React from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import Lottie from "../Lottie";
import { loadAnimation } from "lottie-web";

// Mock the `loadAnimation` function from `lottie-web`
jest.mock("lottie-web", () => ({
  loadAnimation: jest.fn().mockReturnValue({
    play: jest.fn(),
    pause: jest.fn(),
    stop: jest.fn(),
    setSpeed: jest.fn(),
    setDirection: jest.fn(),
    playSegments: jest.fn(),
    isPaused: false,
    destroy: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }),
}));

describe("Lottie Component", () => {
  let mockOptions;

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

  it("should call play when isPaused is false", () => {
    const { container } = render(<Lottie options={mockOptions} isPaused={false} />);
    const lottieInstance = container.firstChild;
    const lottieInstanceMock = loadAnimation.mock.results[0].value;

    act(() => {
      fireEvent.click(lottieInstance);
    });

    expect(lottieInstanceMock.play).toHaveBeenCalledTimes(1);
  });

  it("should call pause when isPaused is true", () => {
    const { container } = render(<Lottie options={mockOptions} isPaused={true} />);
    const lottieInstance = container.firstChild;
    const lottieInstanceMock = loadAnimation.mock.results[0].value;

    act(() => {
      fireEvent.click(lottieInstance);
    });

    expect(lottieInstanceMock.pause).toHaveBeenCalledTimes(1);
  });

  it("should stop the animation when isStopped is true", () => {
    const { container } = render(<Lottie options={mockOptions} isStopped={true} />);
    const lottieInstance = container.firstChild;
    const lottieInstanceMock = loadAnimation.mock.results[0].value;

    act(() => {
      fireEvent.click(lottieInstance);
    });

    expect(lottieInstanceMock.stop).toHaveBeenCalledTimes(1);
  });

  it("should call playSegments when segments are passed", () => {
    const segments = [0, 50];
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
    })
  });

  it("should set the correct direction", () => {
    const direction = -1;
    render(<Lottie options={mockOptions} direction={direction} />);
    const lottieInstanceMock = loadAnimation.mock.results[0].value;

    waitFor(() => {
      expect(lottieInstanceMock.setDirection).toHaveBeenCalledWith(direction);
    })
  });

  it("should update animation when animationData changes", () => {
    const { rerender } = render(<Lottie options={{ ...mockOptions, animationData: { version: "1.0" } }} />);
    const lottieInstanceMock = loadAnimation.mock.results[0].value;

    expect(lottieInstanceMock.destroy).not.toHaveBeenCalled();

    rerender(<Lottie options={{ ...mockOptions, animationData: { version: "2.0" } }} />);
    
    expect(lottieInstanceMock.destroy).toHaveBeenCalledTimes(1);
    expect(loadAnimation).toHaveBeenCalledTimes(2);
  });

  it("should handle event listeners correctly", () => {
    const eventListeners = [
      { eventName: "complete", callback: jest.fn() },
      { eventName: "loopComplete", callback: jest.fn() },
    ];
    render(<Lottie options={mockOptions} eventListeners={eventListeners} />);

    const lottieInstanceMock = loadAnimation.mock.results[0].value;

    expect(lottieInstanceMock.addEventListener).toHaveBeenCalledTimes(2);
    expect(lottieInstanceMock.addEventListener).toHaveBeenCalledWith("complete", eventListeners[0].callback);
    expect(lottieInstanceMock.addEventListener).toHaveBeenCalledWith("loopComplete", eventListeners[1].callback);
  });

  it("should clean up event listeners on destroy", () => {
    const eventListeners = [
      { eventName: "complete", callback: jest.fn() },
      { eventName: "loopComplete", callback: jest.fn() },
    ];
    const { unmount } = render(
      <Lottie options={mockOptions} eventListeners={eventListeners} />
    );

    const lottieInstanceMock = loadAnimation.mock.results[0].value;

    expect(lottieInstanceMock.addEventListener).toHaveBeenCalledTimes(2);
    unmount();
    
    expect(lottieInstanceMock.removeEventListener).toHaveBeenCalledTimes(2);
  });
});
