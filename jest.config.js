module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  transform: {
    "^.+\\.js$": [
      "babel-jest",
      {
        babelrc: false,
        configFile: false,
        presets: [["@babel/preset-env", { targets: { node: "current" } }]],
      },
    ],
  },
};
