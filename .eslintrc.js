module.exports = {
  extends: ['@tbif/base', 'plugin:vue/essential'],
  plugins: ['node'],
  env: {
    jest: true,
  },
  rules: {
    'space-before-function-paren': 0,
    indent: [
      'error',
      2,
      {
        MemberExpression: 'off',
      },
    ],
    'node/no-extraneous-require': [
      'error',
      {
        allowModules: ['@vue/cli-test-utils'],
      },
    ],
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.js', '**/cli-test-utils/**/*.js'],
      rules: {
        'node/no-extraneous-require': 'off',
      },
    },
  ],
};
