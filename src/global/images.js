/**
 * 所以文件操作参数 默认 /images/目录开始处理
 */
const fs = require('fs')
const path = require('path')
const vscode = require('vscode')
const axios = require('axios')
const syncRequest = require('sync-request')
let { getSettings,getImageRootPath, log,GIF_SUFFIX } = require('./util.js')

/**
 *
 * 处理判断是否是动图的情况
 *
 * @returns
 */
function getImagePath(key) {
    if (!getSettings('isGif')) {
        return getImageRootPath() + key
    } else {
        return getImageRootPath() + key + GIF_SUFFIX
    }
}
/**
 *根据关键字读取本地图片 如果不存在则返回空数组
 *
 * @param {*} key
 * @returns
 */
function checkLocalImage(key) {
    const localKeywordPath = getImagePath(key)
    if (!fs.existsSync(localKeywordPath)) {
        if (!getSettings('isGif')) {
            vscode.window.showInformationMessage(`本地不存在${key}相关图片,正在通过网络获取...`)
        } else {
            vscode.window.showInformationMessage(`本地不存在${key}相关动图,正在通过网络获取...`)
        }
        return []
    }
    let imageNames = fs.readdirSync(localKeywordPath)
    return imageNames
}
function syncGetImageUrl(key, offset) {
    let keyword = encodeURI(key)
    let lm = getSettings('isGif') ? 6 : 1
    let hd = getSettings('isGif') ? 0 : 1
    // 控制下载数量
    let standNum = Math.floor(getSettings('maxImageNum') / 5) // 标准是5次下载完成
    // 极值处理
    let downloadNum = standNum
    if (standNum < 2) {
        downloadNum = 2
    } else if (standNum > 5) {
        downloadNum = 5
    }
    log('下载数量为：' + downloadNum)
    let url =
        'https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=' +
        keyword +
        '&cl=2&ie=utf-8&oe=utf-8&adpicid=&st=-1&z=&ic=0&word=' +
        keyword +
        '&s=&se=&tab=&width=&height=&face=0&istype=2&qc=&nc=1&fr=&pn=' +
        offset +
        '&rn=' +
        downloadNum +
        '&lm=' +
        lm
    '&hd=' + hd
    //
    let data = syncRequest('GET', url)
    let imageUrl = []
    JSON.parse(data.getBody()).data.forEach((item, index) => {
        if (item.fromPageTitleEnc) {
            imageUrl.push({
                url: uncompile(item.objURL),
                name: `${key}_${offset + index}.${item.type}`,
            })
        }
    })
    return imageUrl
}

function saveImage(key, localImage = []) {
    return new Promise((resolve, reject) => {
        if (localImage.length >= parseInt(getSettings('maxImageNum'))) {
            log('已达到最大图片数量，不再更新获取新的图片！')
            resolve(localImage)
            return
        }
        let imageUrl = syncGetImageUrl(key, localImage.length)
        log('获取关键字:' + key + ' 相关图片的链接完成')
        let imagePath = getImagePath(key)
        if (!fs.existsSync(imagePath)) {
            fs.mkdirSync(imagePath)
        }
        let requestImage = []
        imageUrl.forEach(item => {
            requestImage.push(
                axios
                    .get(item.url, { responseType: 'arraybuffer' })
                    .then(data => {
                        log('保存图片：' + imagePath + '/' + item.name)
                        fs.writeFileSync(imagePath + '/' + item.name, data.data)
                    })
                    .catch(err => {
                        console.error('err', err)
                    }),
            )
        })
        Promise.all(requestImage)
            .then(() => {
                log('下载图片完成')
                resolve(imageUrl.map(item => item.name))
            })
            .catch(err => {
                console.error('err', err)
            })
    })
}

/**
 *
 * 
 * @param {*} name 文件路径获得文件夹路径  都会删除
 * @param {boolean} [inner=false] 关键字  自动获取关键字对应文件夹并删除
 * @returns
 */
function delImages(name, inner = false) {
    console.log(getSettings())
    let imagePath = name
    if (!inner) {
        imagePath = path.join(getImageRootPath(), name)
    }
    if (!fs.existsSync(imagePath)) {
        log('路径不存在:'+imagePath)
        return '路径不存在'
    }
    let info = fs.statSync(imagePath)
    if (info.isDirectory()) {
        //目录
        let data = fs.readdirSync(imagePath)
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                delImages(`${imagePath}/${data[i]}`, true) //使用递归
                if (i == data.length - 1) {
                    //删了目录里的内容就删掉这个目录
                    delImages(`${imagePath}`, true)
                }
            }
        } else {
            fs.rmdirSync(imagePath) //删除空目录
        }
    } else if (info.isFile()) {
        fs.unlinkSync(imagePath) //删除文件
    }
}
1
/**
 *
 * 拷贝文件到指定目录
 * @param {*} sourceImage 源文件
 * @param {*} targetFolder  目标文件夹路径
 */
function cloneImage(sourcePath, targetFolder) {
    // 校验
    if (!fs.existsSync(sourcePath)) {
        log(`图片:${sourcePath} 不存在`)
        return
    }
    let targetPath = path.join(getImageRootPath(), targetFolder)
    if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath)
    }
    fs.writeFileSync(path.join(targetPath, path.basename(sourcePath)), fs.readFileSync(sourcePath))
}

/**
 *
 *
 * @param {*} sourceImage
 * @param {*} targetFolder
 */
function findImage(folder, name) {
    // 校验
    let parentPath = path.join(getImageRootPath(), folder)
    if (!fs.existsSync(parentPath)) {
        log(`文件夹目录:${parentPath} 不存在`)
        return
    }
    let targetPath = path.join(parentPath, name)
    if (!fs.existsSync(targetPath)) {
        return false
    } else {
        return true
    }
}
function uncompile(r) {
    const n = /(_z2C\$q|_z&e3B|AzdH3F)/g
    const t = /([a-w\d])/g
    const e = {
        w: 'a',
        k: 'b',
        v: 'c',
        1: 'd',
        j: 'e',
        u: 'f',
        2: 'g',
        i: 'h',
        t: 'i',
        3: 'j',
        h: 'k',
        s: 'l',
        4: 'm',
        g: 'n',
        5: 'o',
        r: 'p',
        q: 'q',
        6: 'r',
        f: 's',
        p: 't',
        7: 'u',
        e: 'v',
        o: 'w',
        8: '1',
        d: '2',
        n: '3',
        9: '4',
        c: '5',
        m: '6',
        0: '7',
        b: '8',
        l: '9',
        a: '0',
        _z2C$q: ':',
        '_z&e3B': '.',
        AzdH3F: '/',
    }
    let o = r.replace(n, function(t, n) {
        return e[n]
    })
    return o.replace(t, function(t, n) {
        return e[n]
    })
}
exports.getImagePath = getImagePath
exports.uncompile = uncompile
exports.findImage = findImage
exports.checkLocalImage = checkLocalImage
exports.syncGetImageUrl = syncGetImageUrl
exports.saveImage = saveImage
exports.delImages = delImages
exports.cloneImage = cloneImage