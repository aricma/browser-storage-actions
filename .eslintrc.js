module.exports = {
    env: {
        'browser': true,
        'es2021': true,
        'node': true,
        'jest/globals': true,
    },
    extends: [
        '@aricma/eslint-config',
        'plugin:jest/recommended',
        'plugin:jest/style',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: [
        'jest',
        '@typescript-eslint',
    ],
};
