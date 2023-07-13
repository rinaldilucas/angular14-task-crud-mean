var OFF = 0,
  WARN = 1,
  ERROR = 2;

module.exports = {
  root: true,
  ignorePatterns: ['api-dist/*', 'app-dist/*', 'node_modules/*'],
  overrides: [
    {
      extends: [
        'plugin:@angular-eslint/recommended', //
        'plugin:@angular-eslint/template/process-inline-templates',
        'airbnb-typescript/base'
      ],
      files: ['*.ts'],
      parserOptions: {
        createDefaultProgram: true,
        project: ['tsconfig.json']
      },
      rules: {
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: 'app',
            style: 'camelCase'
          }
        ],
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: 'app',
            style: 'kebab-case'
          }
        ],
        "newline-after-var": OFF,
        '@typescript-eslint/explicit-function-return-type': ERROR,
        '@typescript-eslint/lines-between-class-members': OFF,
        '@typescript-eslint/no-explicit-any': OFF,
        '@typescript-eslint/no-this-alias': OFF,
        '@typescript-eslint/no-unused-vars': WARN,
        '@typescript-eslint/no-use-before-define': OFF,
        '@typescript-eslint/no-var-requires': OFF,
        'dot-notation': OFF,
        'import/extensions': OFF,
        'import/no-extraneous-dependencies': OFF,
        'new-cap': OFF,
        'newline-after-var': OFF,
        'no-debugger': WARN,
        'no-lonely-if': ERROR,
        'no-new': OFF,
        'no-undef': OFF,
        'no-unused-vars': WARN,
        'no-useless-constructor': OFF,
        'prefer-rest-params': OFF,
        'prefer-spread': OFF,
        semi: [ERROR, 'always'],
      }
    },
    {
      extends: ['plugin:@angular-eslint/template/recommended'],
      files: ['*.html'],
      rules: {
        '@angular-eslint/template/no-autofocus': WARN,
        '@angular-eslint/template/mouse-events-have-key-events': WARN,
        '@angular-eslint/template/click-events-have-key-events': WARN,
        '@angular-eslint/template/accessibility-interactive-supports-focus': OFF,
        '@angular-eslint/template/accessibility-valid-aria': WARN,
        '@angular-eslint/template/accessibility-role-has-required-aria': WARN,
        '@angular-eslint/template/button-has-type': WARN,
        '@angular-eslint/template/accessibility-elements-content': WARN,
        '@angular-eslint/template/accessibility-label-has-associated-control': WARN,
        '@angular-eslint/template/accessibility-table-scope': WARN,
        '@angular-eslint/template/no-distracting-elements': WARN,
        '@angular-eslint/template/button-has-type': WARN
      }
    }
  ]
};
