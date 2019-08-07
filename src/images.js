const fs = require('fs')
const vscode = require('vscode')
const { getSettings } = require('./settings.js')
const axios = require('axios')
const syncRequest = require('sync-request')
const { uncompile, getImagePath, log } = require('./util.js')
function checkLocalImage() {
  const localKeywordPath = getImagePath()
  if (!fs.existsSync(localKeywordPath)) {
    if (!getSettings('isGif')) {
      vscode.window.showInformationMessage(
        `本地不存在${getSettings('keyword')}相关图片,正在通过网络获取...`,
      )
    } else {
      vscode.window.showInformationMessage(
        `本地不存在${getSettings('keyword')}相关动图,正在通过网络获取...`,
      )
    }
    return []
  }
  let imageNames = fs.readdirSync(localKeywordPath)
  return imageNames
}
function syncGetImageUrl(offset) {
  let keyword = encodeURI(getSettings('keyword'))
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
        name: `${getSettings('keyword')}_${offset + index}.${item.type}`,
      })
    }
  })
  return imageUrl
}

function loadImage(localIamge = []) {
  return new Promise((resolve, reject) => {
    if (localIamge.length >= parseInt(getSettings('maxImageNum'))) {
      log('已达到最大图片数量，不再更新获取新的图片！')
      resolve(localIamge)
      return
    }
    let imageUrl = syncGetImageUrl(localIamge.length)
    log('下载:' + getSettings('keyword') + ' 相关图片')
    let imagePath = getImagePath()
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
          .then(undefined, err => {
            console.error('err', err)
          }),
      )
    })
    Promise.all(requestImage)
      .then(() => {
        log('下载完所有图片')
        resolve(imageUrl.map(item => item.name))
      })
      .then(undefined, err => {
        console.error('err', err)
      })
  })
}
function delImages(imagePath) {
  if (!fs.existsSync(imagePath)) {
    log('路径不存在')
    return '路径不存在'
  }
  let info = fs.statSync(imagePath)
  if (info.isDirectory()) {
    //目录
    let data = fs.readdirSync(imagePath)
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        delImages(`${imagePath}/${data[i]}`) //使用递归
        if (i == data.length - 1) {
          //删了目录里的内容就删掉这个目录
          delImages(`${imagePath}`)
        }
      }
    } else {
      fs.rmdirSync(imagePath) //删除空目录
    }
  } else if (info.isFile()) {
    fs.unlinkSync(imagePath) //删除文件
  }
}
exports.checkLocalImage = checkLocalImage
exports.syncGetImageUrl = syncGetImageUrl
exports.loadImage = loadImage
exports.delImages = delImages
