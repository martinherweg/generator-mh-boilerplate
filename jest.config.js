module.exports = {
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['.history/'],
  testPathIgnorePatterns: [
    '__tests__/__mocks__/**/*.js',
    '__tests__/__snapshots__/**/*.js',
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
  },
};
