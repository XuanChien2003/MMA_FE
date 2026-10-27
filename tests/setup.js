globalThis.IS_REACT_ACT_ENVIRONMENT = true;
// React 19 still supports the renderer used by these hook tests; keep other warnings visible.
const originalError = console.error;
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((message, ...args) => {
    if (
      typeof message === "string" &&
      message.startsWith("react-test-renderer is deprecated.")
    )
      return;
    originalError(message, ...args);
  });
});
afterAll(() => console.error.mockRestore());
