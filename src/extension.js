const vscode = require('vscode')
const settings = require('./settings.js')
const request = require('request')
const syncRequest = require('sync-request')
const fs = require('fs')
const path = require('path')
/**
 * 获取某个扩展文件相对于webview需要的一种特殊路径格式
 * 形如：vscode-resource:/Users/toonces/projects/vscode-cat-coding/media/cat.gif
 * @param context 上下文
 * @param relativePath 扩展中某个文件相对于根目录的路径，如 images/test.jpg
 */
function getExtensionFileVscodeResource(context, relativePath) {
  const diskPath = vscode.Uri.file(path.join(context.extensionPath, relativePath))
  return diskPath.with({ scheme: 'vscode-resource' }).toString()
}

/**
 * 从某个HTML文件读取能被Webview加载的HTML内容
 * @param {*} context 上下文
 * @param {*} templatePath 相对于插件根目录的html文件相对路径
 */
function showEncourager(context) {
  const resourcePath = path.join(context.extensionPath, '/index.html')
  const dirPath = path.dirname(resourcePath)
  let html = fs.readFileSync(resourcePath, 'utf-8')
  html = html.replace('$image_path$', './images/邓紫棋.jpeg')
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
  return html
}
function syncGetImageUrl() {
  let keyword = encodeURI(settings.getSettings('keyword'))
  let pn = 1
  let url =
    'https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=' +
    keyword +
    '&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=-1&z=&ic=0&word=' +
    keyword +
    '&s=&se=&tab=&width=&height=&face=0&istype=2&qc=&nc=1&fr=&pn=' +
    pn +
    '&rn=10'
  let data = syncRequest('GET', url)
  let imageUrl =[]
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

function loadImage(context) {
  let imageUrl = syncGetImageUrl()
  console.log(imageUrl)
  let imagePath = path.join(context.extensionPath, '/images/' + settings.getSettings('keyword'))
  if (!fs.existsSync(imagePath)) {
    // fs.mkdirSync(imagePath)
    return
  }
  imageUrl.forEach(item => {
    request(item.url).pipe(fs.createWriteStream('/' + imagePath + '/' + item.name))
  })
  return pathResult
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
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let call = vscode.commands.registerCommand('superencourager.call', () => {
    // checkLocalImage(context)
    loadImage(context)
    const panel = vscode.window.createWebviewPanel(
      'testWebview', // viewType
      'come on!!!', // 视图标题
      vscode.ViewColumn.Two, // 显示在编辑器的哪个部位
      {
        enableScripts: false, // 启用JS，默认禁用
        retainContextWhenHidden: false, // webview被隐藏时保持状态，避免被重置
      },
    )

    panel.webview.html = showEncourager(context)

    setTimeout(() => {
      panel.dispose()
    }, 10000)
  })
  let setKeyword = vscode.commands.registerCommand('superencourager.setKeyword', () => {
    vscode.window.showInputBox().then(
      data => {
        console.log(data)
        settings.setSettings('keyword', data)
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
