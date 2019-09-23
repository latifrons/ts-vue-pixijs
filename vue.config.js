module.exports = {
  lintOnSave: false,
  configureWebpack: {
    devtool: "source-map",
    output: {
        devtoolModuleFilenameTemplate: info => {
            // console.log(info.resourcePath);
            var $filename = `sources://${info.resourcePath}`;
            if (info.resourcePath.match(/\.vue$/) && !info.query.match(/type=script/)) {
                // js inside ts project
                if  (!info.resourcePath.match(/^src/)){
                    $filename = `webpack-generated:///${info.resourcePath}?${info.hash}`;
                }
            }
            return $filename;
        },
        devtoolFallbackModuleFilenameTemplate: "webpack:///[resource-path]?[hash]",
    }
  }
}
