/*
 * @Author: RUNNERUP
 * @Date: 2019-11-02 22:00:51
 * @Description:
 */
const { updateGlobalState } = require('../../global/global-state.js')
const { setSettings, getSettings, log } = require('../../global/util.js')
// scope constant
const GLOBAL_STATE = 'globalState'
const CONFIG = 'config'

exports.handle = function(arg) {
    let { scope, key, value, sub } = arg
    if (scope === GLOBAL_STATE) {
        updateGlobalState(sub, key, value)
        log(`修改属性 scope:${scope},key:${key} to value:${value} sub:${sub}成功`)
    } else if (scope === CONFIG) {
        if (getSettings(key) !== value) {
            setSettings(key, value)
            log(`修改属性 scope:${scope},key:${key} to value:${value} sub:${sub}成功`)
        } else {
            log('属性值未发生改变无需设置')
        }
    }
    return {
        msg: `修改属性key:${key} to value:${value}成功`,
    }
}
