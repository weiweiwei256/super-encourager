/*
 * @Author: RUNNERUP
 * @Date: 2019-11-02 22:00:51
 * @Description:
 */
const { getContext, getExtensionPath, log } = require('../../global/util.js')
const vscode = require('vscode')
exports.handle = function() {
    let context = getContext()
    console.log(context)
    log(context.globalState._value)
    let rootUri = vscode.Uri.parse(getExtensionPath())
    vscode.window.showOpenDialog({
        defaultUri: rootUri,
        openLabel: '确定',
        canSelectMany: true,
        canSelectFiles: true,
        canSelectFolders: true, 
    })
    return {}
}
