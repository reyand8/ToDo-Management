export {};

export default {
  preset: 'ts-jest',
  testEnvironment: "jest-environment-jsdom",
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coverageDirectory: 'coverage',
};