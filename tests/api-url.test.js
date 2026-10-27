import { resolveApiUrl } from "../src/config/resolveApiUrl";

test("iPhone uses the computer serving Expo, with the backend port", () => {
  expect(resolveApiUrl({ platform: "ios", hostUri: "192.168.2.11:8081" })).toBe(
    "http://192.168.2.11:9999",
  );
  expect(
    resolveApiUrl({ platform: "ios", hostUri: "exp://192.168.2.12:8081/--/" }),
  ).toBe("http://192.168.2.12:9999");
});
test("an explicit backend URL works with an Expo tunnel and has no trailing slash", () => {
  expect(
    resolveApiUrl({
      override: "https://api.example.com/",
      platform: "ios",
      hostUri: "demo.exp.direct:80",
    }),
  ).toBe("https://api.example.com");
});
test("web uses its own hostname and configurable backend port", () => {
  expect(
    resolveApiUrl({ platform: "web", webHostname: "localhost", port: 9998 }),
  ).toBe("http://localhost:9998");
});
test("phones never silently fall back to localhost or the Expo tunnel host", () => {
  for (const hostUri of [
    undefined,
    "localhost:8081",
    "127.0.0.1:8081",
    "abc.exp.direct:80",
  ])
    expect(resolveApiUrl({ platform: "ios", hostUri })).toBe("");
});
test("invalid API URL configuration is rejected", () => {
  for (const override of ["192.168.2.11:9999", "ftp://api.example.com"])
    expect(() => resolveApiUrl({ override })).toThrow();
});
