/*
 * @Author: RUNNERUP
 * @Date: 2019-11-02 22:00:51
 * @Description:
 */
exports.handle = function() {
    let { closeCounter } = require('../../encourager.js')
    if (closeCounter) {
        clearTimeout(closeCounter)
    }
    return {
        msg: '终止关闭成功',
    }
}
