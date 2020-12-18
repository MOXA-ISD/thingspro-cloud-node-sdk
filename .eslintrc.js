module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    mocha: true,
    jquery: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  eslintIgnore: [
    '/**/*.min.js',
  ],
  rules: {
    indent: [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    quotes: [
      'error',
      'single'
    ],
    semi: [
      'error',
      'never'
    ],
    'object-curly-spacing': [ 'error', 'always' ],
    'array-bracket-spacing': [ 'error', 'always' ],
    'computed-property-spacing': [ 'error', 'never' ],
    'comma-spacing': [ 'error', { 'before': false, 'after': true } ],
    'space-before-function-paren': [ 'error', 'never' ],
    'no-unused-vars': 'off',
    'no-delete-var': 'off',
    'comma-dangle': [ 'error', 'never' ]
  }
}
