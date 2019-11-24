/*
 * @Author: RUNNERUP
 * @Date: 2019-11-02 22:00:51
 * @Description:
 */
const { getExtensionPath } = require('../../global/util.js')
const vscode = require('vscode')
exports.handle = function(arg) {
    let { subpath } = arg
    let rootUri = vscode.Uri.parse(
        path.join(
            getExtensionPath(),
            subpath !== undefined || subpath !== '' ? `/${subpath}/` : '',
        ),
    )
    vscode.window.showOpenDialog({
        defaultUri: rootUri,
        openLabel: '确定',
        canSelectMany: true,
        canSelectFiles: true,
        canSelectFolders: true,
    })
    return {}
}
