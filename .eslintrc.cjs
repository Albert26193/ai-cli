module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    "no-unused-vars": "off",
    'prettier/prettier': 'error',
    "@typescript-eslint/no-unused-vars": "off",
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
