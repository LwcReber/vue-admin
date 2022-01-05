module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    "vue/html-self-closing": 'off',
    "vue/max-attributes-per-line": [2, {
      "singleline": 10,
      "multiline": {
        "max": 1,
        "allowFirstLine": false
      }
    }],
    'vue/prop-name-casing': 'off',
    'prefer-promise-reject-errors': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-prototype-builtins': 'off',
    "space-before-function-paren": ["error", {
      "anonymous": "ignore",
      "named": "ignore",
      "asyncArrow": "ignore"
    }],
  }
}
