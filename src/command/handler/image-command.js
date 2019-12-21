/*
 * @Author: RUNNERUP
 * @Date: 2019-11-03 19:08:24
 * @Description: 处理请求鼓励页请求图片
 */
const vscode = require('vscode')
const path = require('path')
const fs = require('fs')
const {
    getSettings,
    getExtensionPath,
    getGlobalStoragePath,
    GIF_SUFFIX,
    log,
    MY_LOVE,
} = require('../../global/util.js')
const { saveImage, findImage, checkLocalImage } = require('../../global/images.js')
async function handle() {
    let result = {}
    // 对我的最爱进行特殊处理
    let keys = getSettings('keyword')
        .split(' ')
        .filter(item => item.length > 0)
    // TEST:
    // let activeKey = '石原里美'
    let activeKey = keys[Math.floor(Math.random(Date.now()) * keys.length)]
    log('当前获取的关键字:' + activeKey)
    let localImages = checkLocalImage(activeKey)
    if (activeKey === MY_LOVE) {
        if (localImages.length === 0) {
            vscode.window.showErrorMessage(`请先收藏图片到“${MY_LOVE}”！`)
            return {}
        } else {
            result.imageUrl = getVscodeImagePath(activeKey, localImages)
        }
    } else if (localImages.length === 0) {
        log('关键字:' + activeKey + '不存在本地图片，正在通过网络获取')
        let newImages = await saveImage(activeKey)
        if (newImages.length === 0) {
            vscode.window.showErrorMessage('无法获取相关图片，请更改关键字')
        }
        result.imageUrl = getVscodeImagePath(activeKey, newImages)
    } else {
        saveImage(activeKey, localImages)
        result.imageUrl = getVscodeImagePath(activeKey, localImages)
    }
    result.isCollected = findImage(MY_LOVE, decodeURI(path.basename(result.imageUrl)))
    return result
}
function getVscodeImagePath(key, imageNames) {
    let i = Math.floor(Math.random(Date.now()) * imageNames.length)
    let name = imageNames[i]
    let folderName = key
    if (getSettings('isGif')) {
        folderName += GIF_SUFFIX
    }
    let realImagePath = `${getGlobalStoragePath()}/images/${folderName}/${name}`
    let imagePath = `../../images/${folderName}` //这个路径是相对于index.html的位置
    const resourcePath = path.join(getExtensionPath(), '/src/vue-template/index.html')
    const dirPath = path.dirname(resourcePath)
    let cacheFolderPath = path.resolve(dirPath, imagePath)
    let cacheImagePath = cacheFolderPath + `/${name}`
    if (!fs.existsSync(cacheFolderPath)) {
        fs.mkdirSync(cacheFolderPath)
    }
    if (!fs.existsSync(cacheImagePath)) {
        fs.writeFileSync(
            path.join(cacheFolderPath, path.basename(realImagePath)),
            fs.readFileSync(realImagePath),
        )
        console.log('cache success')
    }
    let vscodeImagePath = vscode.Uri.file(cacheImagePath)
        .with({ scheme: 'vscode-resource' })
        .toString()
    log('后台获取到的图片路径:' + vscodeImagePath)
    return vscodeImagePath
}
exports.handle = handle
