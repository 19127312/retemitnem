module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "airbnb",
    "plugin:prettier/recommended",
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  settings: {
    "import/resolver": {
      node: { extensions: [".js", ".json", ".tsx", ".ts"] },
    },
  },
  rules: {
    "prefer-destructuring": ["error", { object: true, array: false }],
    "react/jsx-props-no-spreading": "off",
    "import/extensions": "off",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "no-param-reassign": 0,
    "react/prop-types": "off",
    "no-underscore-dangle": "off",
    "import/prefer-default-export": "off",
    "import/no-named-as-default": 0,
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    "no-plusplus": "off",
    "react/no-unstable-nested-components": [
      "off",
      {
        allowAsProps: true,
      },
    ],
  },
};
