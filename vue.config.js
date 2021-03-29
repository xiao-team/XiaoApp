module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true
        }
    },
    lintOnSave: false,
    devServer: {
        overlay: {
            warnings: false,
            errors: false
        },
      
    }
}