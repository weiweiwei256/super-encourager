const vscode = require('vscode')
const { getSettings, setSettings } = require('./settings.js')
const axios = require('axios')
const syncRequest = require('sync-request')
const fs = require('fs')
const path = require('path')
const CronJob = require('cron').CronJob
const { uncompile } = require('./util.js')
let timeMeter = null // 计时器
let out = null // 终端输出对象
const ALL_KEYWORD = '**全部**'
const GIF_SUFFIX = '_GIF'
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
// 同步获取图片路径
function syncGetImageUrl(offset) {
  let keyword = encodeURI(getSettings('keyword'))
  let lm = getSettings('isGif') ? 6 : 1
  // 控制下载数量
  let standNum = Math.floor(getSettings('maxImageNum') / 5) // 标准是5次下载完成
  // 极值处理
  let downloadNum = standNum
  if (standNum < 10) {
    downloadNum = 10
  } else if (standNum > 30) {
    downloadNum = 30
  }
  log('下载数量为：' + downloadNum)
  let url =
    'https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=' +
    keyword +
    '&cl=2&ie=utf-8&oe=utf-8&adpicid=&st=-1&z=&ic=0&word=' +
    keyword +
    '&s=&se=&tab=&width=&height=&face=0&istype=2&qc=&nc=1&hd=1&fr=&pn=' +
    offset +
    '&rn=' +
    downloadNum +
    '&lm=' +
    lm
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

function loadImage(context, localIamge = []) {
  return new Promise((resolve, reject) => {
    if (localIamge.length >= getSettings('maxImageNum')) {
      log('已达到最大图片数量，不再更新获取新的图片！')
      resolve(localIamge)
      return
    }
    let imageUrl = syncGetImageUrl(localIamge.length)
    log('下载:' + getSettings('keyword') + ' 相关图片')
    let imagePath = getCurrentPath(context)
    if (!fs.existsSync(imagePath)) {
      fs.mkdirSync(imagePath)
    }
    let requestImage = []
    imageUrl.forEach(item => {
      requestImage.push(
        axios.get(item.url, { responseType: 'arraybuffer' }).then(data => {
          log('保存图片：' + imagePath + '/' + item.name)
          fs.writeFileSync(imagePath + '/' + item.name, data.data)
        }),
      )
    })
    Promise.all(requestImage).then(() => {
      resolve(imageUrl.map(item => item.name))
    })
  })
}
function getImageRootPath(context) {
  return path.join(context.extensionPath, '/images/')
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
function getCurrentPath(context) {
  if (!getSettings('isGif')) {
    return path.join(context.extensionPath, '/images/', getSettings('keyword'))
  } else {
    return path.join(context.extensionPath, '/images/', getSettings('keyword') + GIF_SUFFIX)
  }
}
function getKeywords(context) {
  let keywordFolder = fs.readdirSync(getImageRootPath(context))
  let keywords = new Set()
  keywordFolder.forEach(item => {
    if (item !== '.DS_Store') {
      if (item.endsWith(GIF_SUFFIX)) {
        keywords.add(item.substring(0, item.indexOf(GIF_SUFFIX)))
      } else {
        keywords.add(item)
      }
    }
  })
  console.log(Array.from(keywords))
  return []
}
function checkLocalImage(context) {
  const localKeywordPath = getCurrentPath(context)
  if (!fs.existsSync(localKeywordPath)) {
    vscode.window.showInformationMessage(
      `本地不存在${getSettings('keyword')}相关图片,正在通过网络获取...`,
    )
    return []
  }
  let imageNames = fs.readdirSync(localKeywordPath)
  return imageNames
}

function log(msg) {
  if (!out) {
    out = vscode.window.createOutputChannel('super encourager')
    out.show()
  }
  out.appendLine(msg)
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
  let localImages = checkLocalImage(context)
  if (localImages.length === 0) {
    loadImage(context).then(newImages => {
      if (newImages.length === 0) {
        vscode.window.showErrorMessage('无法获取相关图片，请更改关键字')
      }
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
    let select = getKeywords(context).concat(defaultSelect)
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
    let keywordFolder = fs.readdirSync(getImageRootPath(context))
    let keywords = getKeywords(context)
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
    vscode.window.showInformationMessage('超级鼓励师本地资源路径：' + getImageRootPath(context))
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
