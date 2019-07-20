const vscode = require('vscode')
const settings = require('./settings.js')
const axios = require('axios')
const syncRequest = require('sync-request')
const fs = require('fs')
const path = require('path')
const CronJob = require('cron').CronJob
let timeMeter = null // 计时器
function showEncourager(context, imageNames) {
  let i = Math.floor(Math.random() * imageNames.length)
  let name = imageNames[i]
  let imagePath = `./images/${settings.getSettings('keyword')}/${name}`
  console.log(imagePath)
  const panel = vscode.window.createWebviewPanel(
    'testWebview', // viewType
    'come on!!!', // 视图标题
    vscode.ViewColumn.Two, // 显示在编辑器的哪个部位
    {
      enableScripts: false, // 启用JS，默认禁用
      retainContextWhenHidden: false, // webview被隐藏时保持状态，避免被重置
    },
  )
  const resourcePath = path.join(context.extensionPath, '/index.html')
  const dirPath = path.dirname(resourcePath)
  let html = fs.readFileSync(resourcePath, 'utf-8')
  html = html.replace('$image_path$', imagePath)
  // vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
  html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
    return (
      $1 +
      vscode.Uri.file(path.resolve(dirPath, $2))
        .with({ scheme: 'vscode-resource' })
        .toString() +
      '"'
    )
  })
  panel.webview.html = html
  if (settings.getSettings('timeLast') !== 0) {
    // 值为0 则不自动关闭
    setTimeout(() => {
      panel.dispose()
    }, settings.getSettings('timeLast') * 1000)
  }
}
// 同步获取图片路径
function syncGetImageUrl(offset) {
  let keyword = encodeURI(settings.getSettings('keyword'))
  // 控制下载数量
  let standNum = Math.floor(settings.getSettings('maxImageNum') / 5) // 标准是5次下载完成
  // 极值处理
  let downloadNum = standNum < 10 ? 10 : standNum  
   downloadNum = standNum > 30 ? 30 : standNum
  let url =
    'https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=' +
    keyword +
    '&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=-1&z=&ic=0&word=' +
    keyword +
    '&s=&se=&tab=&width=&height=&face=0&istype=2&qc=&nc=1&hd=1&fr=&pn=' +
    offset +
    '&rn=' +
    downloadNum
  //
  let data = syncRequest('GET', url)
  let imageUrl = []
  JSON.parse(data.getBody()).data.forEach(item => {
    if (item.fromPageTitleEnc) {
      imageUrl.push({
        url: item.thumbURL,
        name: item.fromPageTitleEnc.match(/[\u4e00-\u9fa5\w]+/g).join('') + '.' + item.type,
      })
    }
  })
  return imageUrl
}

function loadImage(context, localIamge = []) {
  return new Promise((resolve, reject) => {
    if (localIamge.length >= settings.getSettings('maxImageNum')) {
      console.log('已达到最大图片数量，不再更新获取新的图片！')
      resolve(localIamge)
      return
    }
    let imageUrl = syncGetImageUrl(localIamge.length)
    console.log('load image:' + settings.getSettings('keyword'))
    let imagePath = path.join(context.extensionPath, '/images/' + settings.getSettings('keyword'))
    console.log(imagePath)
    if (!fs.existsSync(imagePath)) {
      fs.mkdirSync(imagePath)
    }
    let requestImage = []
    imageUrl.forEach(item => {
      requestImage.push(
        axios.get(item.url, { responseType: 'arraybuffer' }).then(data => {
          fs.writeFileSync(imagePath + '/' + item.name, data.data)
        }),
      )
    })
    Promise.all(requestImage).then(() => {
      resolve(imageUrl.map(item => item.name))
    })
  })
}

function checkLocalImage(context) {
  const localKeywordPath = path.join(
    context.extensionPath,
    '/images/',
    settings.getSettings('keyword'),
  )
  if (!fs.existsSync(localKeywordPath)) {
    vscode.window.showInformationMessage(
      `本地不存在${settings.getSettings('keyword')}的相关图片,正在通过网络获取...`,
    )
    return []
  }
  let imageNames = fs.readdirSync(localKeywordPath)
  return imageNames
}

function main(context) {
  let localImages = checkLocalImage(context)
  if (localImages.length === 0) {
    loadImage(context).then(newImages => {
      showEncourager(context, newImages)
    })
  } else {
    loadImage(context, localImages)
    showEncourager(context, localImages)
  }
}
function activate(context) {
  let call = vscode.commands.registerCommand('superencourager.call', () => {
    try {
      main(context)
      if (!timeMeter) {
        let timeSetting
        if (settings.getSettings('type') === 'time-interval') {
          timeSetting = '* */' + settings.getSettings('timeInterval') + ' * * * *'
        } else if (settings.getSettings('type') === 'natural-hour') {
          timeSetting = '00 00 * * * *'
        } else if (settings.getSettings('type') === 'natural-half-hour') {
          timeSetting = '00 00,30 * * * *'
        }
        timeMeter = new CronJob(
          timeSetting,
          function() {
            main(context)
          },
          null,
          true,
        )
      }
    } catch (e) {
      console.error(e)
    }
  })
  let setKeyword = vscode.commands.registerCommand('superencourager.setKeyword', () => {
    vscode.window.showInputBox().then(
      data => {
        settings.setSettings('keyword', data)
        vscode.window.showInformationMessage(`更新搜索关键词${settings.getSettings('keyword')}成功`)
      },
      () => {},
    )
  })
  context.subscriptions.push(call)
  context.subscriptions.push(setKeyword)
}

exports.activate = activate

function deactivate() {}

module.exports = {
  activate,
  deactivate,
}
