/*
 * @Author: RUNNERUP
 * @Date: 2019-11-02 22:00:51
 * @Description:
 */
const vscode = require('vscode')
const { updateGlobalState, updateConfig } = require('../../global/global-state.js')
const { getConfiguration } = require('../../global/utils.js')
// scope constant
const GLOBAL_STATE = 'globalState'
const CONFIG = 'config'

function updateConfig(key, value) {
    getConfiguration.update(key, value).then(data => {
        console.log(data)
    })
}

exports.handle = function(arg) {
    let { page, key, value } = arg
    let { scope, key, value, sub } = arg
    console.log(scope)
    console.log(key)
    console.log(value)
    console.log(sub)
    if (scope === GLOBAL_STATE) {
        updateGlobalState(sub, key, value)
    } else if (scope === CONFIG) {
        updateConfig(key, value)
    }
    return {
        msg: `修改page:${page} key:${key} to value:${value}成功`,
    }
}
