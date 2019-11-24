/*
 * @Author: RUNNERUP
 * @Date: 2019-11-02 22:00:51
 * @Description:
 */
const { getContext, getGlobalStoragePath, log } = require('../../global/util.js')
const vscode = require('vscode')
exports.handle = function() {
    let context = getContext()
    console.log(context)
    log(getGlobalStoragePath())
    log(context.globalStoragePath)
    log(context.globalState._value)
    return {}
}
