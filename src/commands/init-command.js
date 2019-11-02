// const { getGlobalState, setGlobalState } = require('./state.js')
const vscode = require('vscode')
exports.handle = function(arg) {
    let config = vscode.workspace.getConfiguration('superencourager')
    let extensionsData = vscode.extensions.getExtension('runnerup.super-encourager')
    console.error('-----------------------------------------')
    console.log(config)
    console.log(extensionsData)
    return { config }
}
