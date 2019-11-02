/*
 * @Author: RUNNERUP
 * @Date: 2019-11-02 22:00:51
 * @Description: 
 */
const { getContext } = require('../global/util.js')
exports.handle = function() {
    let context = getContext()
    console.log(context)
    console.log(context.globalState._value)
    return {}
}
