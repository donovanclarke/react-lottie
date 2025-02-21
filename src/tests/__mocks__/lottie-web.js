module.exports = {
  loadAnimation: jest.fn(() => ({
    stop: jest.fn(),
    play: jest.fn(),
    setSpeed: jest.fn(),
    destroy: jest.fn(),
  })),
};
