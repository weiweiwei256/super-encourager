/*
 * @Author: RUNNERUP
 * @Date: 2019-11-02 22:00:51
 * @Description:
 */
const syncRequest = require('sync-request')
exports.handle = function(arg) {
    let data = syncRequest(arg.method, arg.url, {json:arg.params})
    let result = JSON.parse(data.getBody())
    return result
}
