module.exports = {
	eslint: {
		enable: true,
		configure: (eslintConfig, { env, paths }) => {
			return eslintConfig;
		},
		pluginOptions: (eslintPluginOptions, { env, paths }) => {
			return eslintPluginOptions;
		},
	},
};