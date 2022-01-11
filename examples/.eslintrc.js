module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: ['eslint:recommended', 'plugin:prettier/recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {
        'prettier/prettier': ['error', { singleQuote: true }],
        '@typescript-eslint/ban-types': 0,
        '@typescript-eslint/ban-ts-comment': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-non-null-assertion': 0,
    },
    overrides: [
        {
            files: ['webpack.config.js'],
            rules: {
                '@typescript-eslint/no-var-requires': ['off'],
                '@typescript-eslint/ban-types': 0,
            },
        },
    ],
};
