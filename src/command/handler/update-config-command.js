/*
 * @Author: RUNNERUP
 * @Date: 2019-11-02 22:00:51
 * @Description:
 */
const { setPageState } = require('../../global/global-state.js')
exports.handle = function(arg) {
    let { page, key, value } = arg
    setPageState(page, key, value)
    return {
        msg: `修改page:${page} key:${key} to value:${value}成功`,
    }
}
