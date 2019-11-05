/*
 * @Author: RUNNERUP
 * @Date: 2019-11-02 22:00:51
 * @Description: 
 */
const { getContext } = require('../../global/util.js')
const vscode = require('vscode')
exports.handle = function() {
    let context = getContext()
    console.log(context)
    console.log(context.globalState._value)
    console.log(vscode)
    vscode.commands.executeCommand('workbench.action.files.saveAs','asdfasdfasdfasdfas.txt')
    return {}
}
