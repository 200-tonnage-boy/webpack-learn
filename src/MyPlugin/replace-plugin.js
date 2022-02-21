const JSZip = require("jszip");
const webpack = require('webpack')
const { RawSource } = require('webpack-sources');
const { Compilation, sources } = require('webpack');

class ReplacePlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('Replace', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'Replace',
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
        },
        (assets) => {
          const file = compilation.getAsset('bundle.js');
          console.log('cjy 陈济远', file)
          // update main.js with new content
          compilation.updateAsset(
            'bundle.js',
            new sources.RawSource(file.source.source().replace('cjy', '陈继远'))
          );
        }
      );
    });
  }
}
module.exports = ReplacePlugin;
