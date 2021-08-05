module.exports = {

  images: {
    domains: [
      'www.datocms-assets.com',
      'via.placeholder.com',
    ]
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  }
};
