const path = require("path");
const common = require("./webpack.common");
const merge = require("webpack-merge");

const options = {
  mode: "production",
  output: {
    path: __dirname + "/dist",
    filename: "main.[contentHash].js"
  }
};

module.exports = merge(common, options);
