// const js = require("@eslint/js");
// const globals = require("globals");

// module.exports = [
//   js.configs.recommended,

//   {
//     languageOptions: {
//       globals: globals.node,
//       sourceType: "commonjs",
//     },

//     rules: {
//       "no-unused-vars": "warn",
//     },

//     env: {
//       "browser": true
//     }
//   },
// ];

const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  js.configs.recommended,

  {
    languageOptions: {
      // Use spread operator (...) to combine Node and Browser environments
      globals: {
        ...globals.node,
        ...globals.browser
      },
      sourceType: "commonjs",
    },

    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error", // Optional: helps catch undefined variables
    },
  },
];