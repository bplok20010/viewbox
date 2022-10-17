module.exports = function (webpack) {
  return {
    webpack(config) {
      config.output.publicPath = "./";

      return config;
    },
  };
};
