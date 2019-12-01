/*
 * @Author: RUNNERUP
 * @Date: 2019-11-02 22:00:51
 * @Description:
 */
const { getExtensionPath, log } = require('../../global/util.js')
const path = require('path')
const fs = require('fs')
exports.handle = function() {
    let defaultImagePath = path.join(getExtensionPath(), '/src/resources/super-encourager.png')
    let base64 = fs.readFileSync(defaultImagePath)
    log(defaultImagePath)
    let value = base64.toString('base64')
    return {
        base64: value,
    }
}
