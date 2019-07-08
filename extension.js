// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')
const request = require('request')
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
function getWebViewContent(context, templatePath) {
  const resourcePath = path.join(context.extensionPath, templatePath)
  const dirPath = path.dirname(resourcePath)
  let html = fs.readFileSync(resourcePath, 'utf-8')
  html = html.replace('$image_path$','./resources/images/邓紫棋女神.jpeg')
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
function showInfo(context) {
  console.log(context)
  console.log(vscode)
  console.log(context.globalStoragePath)
}
function createFolder(to) { //文件写入
  var sep = path.sep
  console.log(sep)
  var folders = path.dirname(to).split(sep);
  var p = '';
  while (folders.length) {
      p += folders.shift() + sep;
      if (!fs.existsSync(p)) {
          fs.mkdirSync(p);
      }
  }
};
function loadImage(context) {
  var keyword = encodeURI('邓紫棋')
  var pn = 1
  var url =
    'https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=' +
    keyword +
    '&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=-1&z=&ic=0&word=' +
    keyword +
    '&s=&se=&tab=&width=&height=&face=0&istype=2&qc=&nc=1&fr=&pn=' +
    pn +
    '&rn=10'
  request.get(url, {}, function(err, res, body) {
    let pathResult = []
    JSON.parse(body).data.forEach(item => {
      if (!item.fromPageTitleEnc) {
        return
      }
      pathResult.push({
        url: item.thumbURL,
        name:
          item.fromPageTitleEnc.match(/[\u4e00-\u9fa5\w]+/g).join('') +
          '.' +
          item.type,
      })
    })
    console.log('获取图片成功！')
    pathResult.forEach(item =>{
      let imagePath = path.join(context.extensionPath,'/resources/images/' + item.name)
      console.log(imagePath)
      request(item.url).pipe(fs.createWriteStream(imagePath))
    })
    console.log('图片下载中')
  })
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "super-encourage" is now active!')

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('extension.superencourage', () => {
    // showInfo(context)
    loadImage(context)
    vscode.window.showInputBox().then((data)=>{
      console.log(data)
    },()=>{

    })
    // Display a message box to the user
    vscode.window.showInformationMessage('super encourage is running!')
    const panel = vscode.window.createWebviewPanel(
      'testWebview', // viewType
      'come on!!!', // 视图标题
      vscode.ViewColumn.Two, // 显示在编辑器的哪个部位
      {
        enableScripts: true, // 启用JS，默认禁用
        retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
      }
    )

    panel.webview.html = getWebViewContent(context, '/index.html')

    setTimeout(() => {
      panel.dispose()
    }, 10000)
  })

  context.subscriptions.push(disposable)
}

exports.activate = activate

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
}
