module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  extends: ['@nuxtjs', 'plugin:nuxt/recommended'],
  plugins: ['@typescript-eslint'],
  // add your custom rules here
  rules: {
    'nuxt/no-cjs-in-config': 'off',
    'no-useless-catch': 'off',
    'no-console': 'off',
    'no-throw-literal': 'off',
    'require-await': 'off',
    'no-case-declarations': 'off',
    'default-param-last': 'off',
    'prefer-regex-literals': 'off',
    'no-new': 'off',
    'import/no-mutable-exports': 'off',
    'comma-dangle': [2, 'always-multiline'],
    indent: ['error', 2, { SwitchCase: 1 }],
    'vue/this-in-template': 'off',
    'vue/no-mutating-props': 'off',
    'vue/require-prop-types': 'off',
    'vue/custom-event-name-casing': 'off',
    'vue/no-parsing-error': ['error', {
      'control-character-in-input-stream': false,
    }],
    /* 更多配置请戳 http://eslint.cn/docs/rules/ */
  },
}
