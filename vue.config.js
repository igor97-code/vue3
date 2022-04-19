const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
	transpileDependencies: true,

	devServer: {
		proxy: 'http://my:8080/',
		client: {
			overlay: false
		}
	},

	css: {
		loaderOptions: {
			scss: {
				additionalData: `
					@import "@/styles/colors.scss";
					@import "@/styles/spacings.scss";
				`
			}
		}
	},

	chainWebpack: (config) => {
		config.module.rules.delete('svg')

		config.module
			.rule('svg')
			.test(/\.(svg)(\?.*)?$/)
			.oneOf('inline')
			.resourceQuery(/inline/)
			.use('vue-loader')
			.loader('vue-loader')
			.end()
			.use('vue-svg-loader')
			.loader('vue-svg-loader')
			.end()
			.end()
			.oneOf('external')
			.resourceQuery(/external/)
			.use('file-loader')
			.loader('file-loader')
			.options({
				name: 'assets/[name].[hash:8].[ext]'
			})

		return config
	},
})
