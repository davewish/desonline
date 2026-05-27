export default {
  testEnvironment: "node",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  collectCoverageFrom: ["src/**/*.js", "!src/index.js", "!src/seed.js"],
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.js"],
};
