/*
 * @Author: RUNNERUP
 * @Date: 2019-11-02 22:00:51
 * @Description:
 */
const vscode = require('vscode')
const path = require('path')
const fs = require('fs')
const { getExtensionPath, log } = require('../../global/util.js')
exports.handle = function({ type, name }) {
    log(`展示娱乐页:${type}${name}`)
    const resourcePath = path.join(getExtensionPath(), '/resources/entertainment/game/car/index.html')
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
        'car', // 视图标题
        vscode.ViewColumn.Active, // 显示在编辑器的哪个部位
        {
            enableScripts: true, // 启用JS，默认禁用
            retainContextWhenHidden: false, // webview被隐藏时保持状态，避免被重置
        },
    )
    panel.webview.html = html
    panel.onDidDispose(function() {
        log(`展示娱乐页:${type}${name}已销毁`)
    })
    return {
        msg: '调用成功!',
    }
}
