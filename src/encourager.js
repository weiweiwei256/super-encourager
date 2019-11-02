const vscode = require('vscode')
const fs = require('fs')
const path = require('path')
const { getSettings } = require('./global/settings.js')
const { getExtensionPath, GIF_SUFFIX, log } = require('./global/util.js')
const { saveImage, checkLocalImage } = require('./global/images.js')
const { commandHandler } = require('./commands/command-handler.js')
let stateBar = undefined
const MY_LOVE = '⭐我的最爱'

function showEncourager(imageNames) {
    log('展示鼓励页...')
    if (imageNames.length === 0) {
        return
    }
    let i = Math.floor(Math.random(20180804) * imageNames.length)
    let name = imageNames[i]
    let folderName = getSettings('keyword')
    if (getSettings('isGif')) {
        folderName += GIF_SUFFIX
    }
    let imagePath = `../../images/${folderName}/${name}` //这个路径是相对于index.html的位置
    // const resourcePath = path.join(getExtensionPath(), '/src/template/index.html')
    const resourcePath = path.join(getExtensionPath(), '/src/vue-template/index.html')
    const dirPath = path.dirname(resourcePath)
    let html = fs.readFileSync(resourcePath, 'utf-8')
    html = html.replace('$image_path$', imagePath)
    // vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
    html = html.replace(/(<link.+?href="|<img.+?src="|<script.+?src=")(.+?)"/g, (m, $1, $2) => {
        let result =
            $1 +
            vscode.Uri.file(path.resolve(dirPath, $2))
                .with({ scheme: 'vscode-resource' })
                .toString() +
            '"'
        return result
    })
    const panel = vscode.window.createWebviewPanel(
        'super-encourager', // viewType
        '超级鼓励师', // 视图标题
        vscode.ViewColumn.Beside, // 显示在编辑器的哪个部位
        {
            enableScripts: true, // 启用JS，默认禁用
            retainContextWhenHidden: false, // webview被隐藏时保持状态，避免被重置
        },
    )
    panel.webview.html = html
    panel.webview.onDidReceiveMessage(
        message => {
            log('后台接收消息:' + JSON.stringify(message))
            let ret = commandHandler.handleCommand(message)
            panel.webview.postMessage(ret)

            // switch (message.command) {
            //     case types.COMMANDS.INIT_GLOBAL_STATE:
            //         // 局部变量
            //         let currentState = {
            //             [types.CURRENT.CURRENT_COLLECT_STATE]: findImage(MY_LOVE, name),
            //         }
            //         panel.webview.postMessage({
            //             command: types.COMMANDS.INIT_GLOBAL_STATE,
            //             value: { globalState: getGlobalState(context), currentState },
            //         })
            //         break
            //     case types.COMMANDS.UPDATE_GLOBAL_STATE:
            //         setGlobalState(context, message.value)
            //         break
            //     case types.COMMANDS.UPDATE_COLLECT_STATE:
            //         if (message.value) {
            //             cloneImage(`${folderName}/${name}`, MY_LOVE)
            //         } else {
            //             delImages(path.join(MY_LOVE, name))
            //         }
            //         break
            //     default:
            // }
        },
        undefined,
        context.subscriptions,
    )
    panel.onDidDispose(function() {
        log('鼓励师已销毁')
        stateBar.text = '超级鼓励师感谢您的使用！'
        setTimeout(() => {
            stateBar.text = '召唤鼓励师'
        }, 5000)
    })
    let timeLast = parseInt(getSettings('timeLast'))
    if (timeLast !== 0) {
        // 值为0 则不自动关闭
        setTimeout(() => {
            panel.dispose()
        }, timeLast * 1000)
    }
}
function main() {
    // 对我的最爱进行特殊处理
    let localImages = checkLocalImage()
    if (getSettings('keyword') === MY_LOVE) {
        showEncourager(localImages)
        return
    }
    if (localImages.length === 0) {
        saveImage()
            .then(newImages => {
                if (newImages.length === 0) {
                    vscode.window.showErrorMessage('无法获取相关图片，请更改关键字')
                }
                showEncourager(newImages)
            })
            .then(undefined, err => {
                console.error('err', err)
            })
    } else {
        saveImage(localImages)
        showEncourager(localImages)
    }
}
exports.main = main
