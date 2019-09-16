const path = require("path");
const common = require("./webpack.common");
const merge = require("webpack-merge");

const options = {
  mode: "development",
  output: {
    path: __dirname + "/dist",
    filename: "main.js"
  }
};

module.exports = merge(common, options);
