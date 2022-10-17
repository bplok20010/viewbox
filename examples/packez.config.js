module.exports = function () {
  return {
    webpack(config) {
      if (config.mode !== "development") {
        config.output.publicPath = "./";
      }

      return config;
    },
  };
};
