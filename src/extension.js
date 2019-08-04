const fs = require('fs')
const path = require('path')
const vscode = require('vscode')
const { getSettings, setSettings } = require('./settings.js')
const CronJob = require('cron').CronJob
const { GIF_SUFFIX, getImageRootPath, getKeywords, log } = require('./util.js')
const { loadImage, delImages, checkLocalImage } = require('./images.js')
let timeMeter = null // 计时器
const ALL_KEYWORD = '**全部**'
function showEncourager(context, imageNames) {
  if (imageNames.length === 0) {
    return
  }
  let i = Math.floor(Math.random(20180804) * imageNames.length)
  let name = imageNames[i]
  let folderName = getSettings('keyword')
  if (getSettings('isGif')) {
    folderName += GIF_SUFFIX
  }
  let imagePath = `./images/${folderName}/${name}`
  let panel = vscode.window.createWebviewPanel(
    name, // viewType
    'come on!!!', // 视图标题
    vscode.ViewColumn.Two, // 显示在编辑器的哪个部位
    {
      enableScripts: true, // 启用JS，默认禁用
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
  if (getSettings('timeLast') !== 0) {
    // 值为0 则不自动关闭
    setTimeout(() => {
      panel.dispose()
    }, getSettings('timeLast') * 1000)
  }
}

function initTimer(context) {
  if (!timeMeter) {
    let timeSetting
    if (getSettings('type') === 'time-interval') {
      timeSetting = '00 */' + getSettings('timeInterval') + ' * * * *'
    } else if (getSettings('type') === 'natural-hour') {
      timeSetting = '00 00 * * * *'
    } else if (getSettings('type') === 'natural-half-hour') {
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
}
function main(context) {
  let localImages = checkLocalImage()
  if (localImages.length === 0) {
    loadImage().then(newImages => {
      if (newImages.length === 0) {
        vscode.window.showErrorMessage('无法获取相关图片，请更改关键字')
      }
      showEncourager(context, newImages)
    })
  } else {
    loadImage(localImages)
    showEncourager(context, localImages)
  }
}
function activate(context) {
  let call = vscode.commands.registerCommand('superencourager.call', () => {
    try {
      getImageRootPath()
      main(context)
      initTimer(context)
      vscode.workspace.onDidChangeConfiguration(function(event) {
        Promise.resolve(event.affectsConfiguration('superencourager.type')).then(data => {
          if (data) {
            //true 代表这个属性已经被修改
            timeMeter = undefined
            initTimer(context)
          }
        })
      })
    } catch (e) {
      console.error(e)
    }
  })
  let setKeyword = vscode.commands.registerCommand('superencourager.setKeyword', () => {
    vscode.window.showInputBox().then(
      data => {
        if (data === undefined) {
          return
        }
        setSettings('keyword', data).then(() => {
          vscode.window.showInformationMessage(`设置关键词 ${data} 成功!`)
        })
      },
      () => {},
    )
  })
  let switchKeyword = vscode.commands.registerCommand('superencourager.switchKeyword', () => {
    let defaultSelect = ['邓紫棋', '石原里美', '火影忍者', '刺客信条', '极品飞车']
    let select = getKeywords().concat(defaultSelect)
    vscode.window.showQuickPick(select).then(data => {
      if (data === undefined) {
        return
      }
      setSettings('keyword', data).then(() => {
        vscode.window.showInformationMessage(`切换关键词 ${data} 成功！`)
      })
    })
  })
  let clearImage = vscode.commands.registerCommand('superencourager.clearImage', () => {
    let keywordFolder = fs.readdirSync(getImageRootPath())
    let keywords = getKeywords()
    keywords.push(ALL_KEYWORD)
    vscode.window.showQuickPick(keywords).then(
      data => {
        log(data)
        if (data === undefined) {
          return
        }
        if (data !== ALL_KEYWORD) {
          delImages(path.join(context.extensionPath, '/images/' + data))
          // 同时移出动图文件夹
          delImages(path.join(context.extensionPath, '/images/' + data + GIF_SUFFIX))
        } else {
          keywordFolder.forEach(item => {
            delImages(path.join(context.extensionPath, '/images/' + item))
            // 同时移出动图文件夹
            delImages(path.join(context.extensionPath, '/images/' + item + GIF_SUFFIX))
          })
        }
      },
      () => {},
    )
  })
  let showPath = vscode.commands.registerCommand('superencourager.showPath', () => {
    vscode.window.showInformationMessage('超级鼓励师本地资源路径：' + getImageRootPath())
  })
  context.subscriptions.push(call)
  context.subscriptions.push(setKeyword)
  context.subscriptions.push(switchKeyword)
  context.subscriptions.push(clearImage)
  context.subscriptions.push(showPath)
}

exports.activate = activate

function deactivate() {}

module.exports = {
  activate,
  deactivate,
}
