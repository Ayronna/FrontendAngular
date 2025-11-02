const presets = require("jest-preset-angular/presets");

module.exports = {
  ...presets.createCjsPreset(),
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
};
