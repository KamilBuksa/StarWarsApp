module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],

  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    // '@typescript-eslint/interface-name-prefix': 'off',
    // '@typescript-eslint/explicit-function-return-type': 'off',
    // '@typescript-eslint/explicit-module-boundary-types': 'off',
    // // trhow error if any type is used
    // '@typescript-eslint/no-explicit-any': 'off',
    // '@typescript-eslint/no-namespace': 'off',
    // //  if "error" - throw error if unused variable
    // "@typescript-eslint/no-unused-vars": "error",
    // // to enforce using type for object type definitions, can be type or interface
    // // error jak nie jest type okreslone
    // "@typescript-eslint/consistent-type-definitions": ["error", "type"],
  },
};
