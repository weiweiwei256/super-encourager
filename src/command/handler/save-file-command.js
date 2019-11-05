/*
 * @Author: RUNNERUP
 * @Date: 2019-11-02 22:00:51
 * @Description:
 */
const fs = require('fs')
const path = require('path')
const { getExtensionPath } = require('../../global/util.js')
exports.handle = function(arg) {
    let { saveData, fileName } = arg
    let base64Data = saveData.replace(/^data:image\/\w+;base64,/, '')
    let dataBuffer = new Buffer(base64Data, 'base64')
    let savePath = path.join(getExtensionPath(), '/download/')
    if (!fs.existsSync(savePath)) {
        fs.mkdirSync(savePath)
    }
    if (!fileName) {
        fileName = 'qrcode_' + new Date().getTime() + '.png'
    }
    fs.writeFileSync(savePath + fileName, dataBuffer)
    return {
        msg: '保存文件:' + fileName + '成功',
    }
}
