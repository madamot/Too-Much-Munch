module.exports = {

  images: {
    domains: [
      'www.datocms-assets.com',
      'via.placeholder.com',
      'res.cloudinary.com'
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
