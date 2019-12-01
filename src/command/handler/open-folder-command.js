/*
 * @Author: RUNNERUP
 * @Date: 2019-11-02 22:00:51
 * @Description:
 */
const { log, getGlobalStoragePath } = require('../../global/util.js')
const vscode = require('vscode')
const path = require('path')
exports.handle = function(arg) {
    let { subpath } = arg
    let rootUri
    if (subpath === undefined || subpath.lenght === 0) {
        rootUri = vscode.Uri.parse(getGlobalStoragePath())
    } else {
        rootUri = vscode.Uri.parse(path.join(getGlobalStoragePath(), `/${subpath}/`))
    }
    vscode.window.showOpenDialog({
        defaultUri: rootUri,
        openLabel: '确定',
        canSelectMany: true,
        canSelectFiles: true,
        canSelectFolders: true,
    })
    return {}
}
