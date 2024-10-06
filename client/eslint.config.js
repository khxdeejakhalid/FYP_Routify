// eslint.config.js
module.exports = [
  {
    files: ["src/**/*.js"],
    rules: {
      semi: "error",
      "prefer-const": "error",
      "no-console": "warn",
      eqeqeq: "error",
      curly: "error",
      indent: ["error", 2], // Enforces 2 spaces for indentation,
      camelcase: "error",
      "no-unused-vars": "warn",
    },
  },
];
