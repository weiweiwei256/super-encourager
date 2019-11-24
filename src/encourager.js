const vscode = require('vscode')
const fs = require('fs')
const path = require('path')
const { getSettings, getExtensionPath, log } = require('./global/util.js')
const { commandHandler } = require('./command/command-handler.js')
let closeCounter = undefined
let { getStateBar } = require('./state-bar.js')
function main() {
    log('展示鼓励页...')
    const resourcePath = path.join(getExtensionPath(), '/src/vue-template/index.html')
    const dirPath = path.dirname(resourcePath)
    let html = fs.readFileSync(resourcePath, 'utf-8')
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
            retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
            enableCommandUris: true,
        },
    )
    panel.webview.html = html
    panel.webview.onDidReceiveMessage(
        async message => {
            log('后台接收消息:' + JSON.stringify(message))
            let sendPkg = await commandHandler.handleCommand(message)
            log('后台发送消息:' + JSON.stringify(sendPkg))
            panel.webview.postMessage(sendPkg)
        },
        undefined,
        context.subscriptions,
    )
    panel.onDidDispose(function() {
        log('鼓励师已销毁')
        getStateBar().text = '超级鼓励师感谢您的使用！'
        setTimeout(() => {
            getStateBar().text = '召唤鼓励师'
        }, 5000)
    })
    let timeLast = parseInt(getSettings('timeLast'))
    if (timeLast !== 0) {
        // 值为0 则不自动关闭
        closeCounter = setTimeout(() => {
            panel.dispose()
        }, timeLast * 1000)
        exports.closeCounter = closeCounter
    }
}
exports.main = main
