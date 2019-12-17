module.exports = {
    'env': {
        'commonjs': true,
        'es6': true,
        'node': true
    },
    'extends': 'eslint:recommended',
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2018
    },
    'rules': {
        'arrow-spacing': [
            'error', { 'before': true, 'after': true }
        ],
        'eol-last': [ 'error', 'always' ],
        'eqeqeq': 'error',
        'indent': [ 'error', 4, { 'SwitchCase': 1 } ],
        'linebreak-style': [ 'error', 'unix' ],
        'no-trailing-spaces': 'error',
        'object-curly-spacing': [ 'error', 'always' ],
        'quotes': [ 'error', 'single' ],
        'semi': [ 'error', 'never' ]
    }
}
