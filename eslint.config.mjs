import globals from 'globals'
import stylisticJS from '@stylistic/eslint-plugin-js'

export default [
  {
    files: ['**/*.js'], 
    languageOptions: {
      sourceType: 'commonjs'
    }
  },
  {
    languageOptions: { 
      globals: globals.browser 
    }
  },
  {
    plugins: {
      '@stylistic/js': stylisticJS
    },
    rules: {
      '@stylistic/js/indent': [
        'error',
        2
      ],
      '@stylistic/js/linebreak-style': [
        'error',
        'windows'
      ],
      '@stylistic/js/quotes': [
        'error',
        'single'
      ],
      '@stylistic/js/semi': [
        'error',
        'never'
      ],
      'no-console': 0
    }
  },
  {
    ignores: [
      'dist/*'
    ]
  }
]