/*
 * @Author: RUNNERUP
 * @Date: 2019-11-03 20:55:04
 * @Description:
 */
const path = require('path')
const { MY_LOVE, log } = require('../../global/util.js')
const { cloneImage, delImages } = require('../../global/images.js')
exports.handle = function(value) {
    let { collectState, imageUrl } = value
    if (collectState === false) {
        // 不再收藏
        let imageName = decodeURI(path.basename(imageUrl))
        delImages(path.join(MY_LOVE, imageName))
        return {
            msg: '取消收藏成功',
        }
    } else {
        // 收藏
        imageUrl = decodeURI(imageUrl)
        imageUrl = imageUrl.substring('vscode-file:'.length)
        cloneImage(imageUrl, MY_LOVE)
        return {
            msg: '收藏成功',
        }
    }
    return {}
}
