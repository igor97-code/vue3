module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: [
		'plugin:vue/vue3-essential',
		'plugin:vue/vue3-strongly-recommended',
		'plugin:vue/vue3-recommended',
		'eslint:recommended'
	],
	parserOptions: {
		parser: '@babel/eslint-parser',
	},
	rules: {
		// 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		// 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-var': 'error',
		'no-empty': 'error',
		'no-duplicate-case': 'error',
		'no-undefined': 'error',
		'no-unused-vars': 'error',
		'no-constant-condition': 'error',
		'no-dupe-args': 'error',
		'no-dupe-keys': 'error',
		'no-extra-semi': 'error',

		indent: ['error', 'tab'],
		semi: ['error', 'never'],
		quotes: ['error', 'single'],

		'vue/script-indent': ['error', 'tab'],
		'vue/html-indent': ['error', 'tab'],
	},
}
