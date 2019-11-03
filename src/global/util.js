/*
 * @Author: RUNNERUP
 * @Date: 2019-10-07 23:02:07
 * @Description:
 */
const path = require('path')
const fs = require('fs')
const vscode = require('vscode')
let out = null // 终端输出对象
let context = undefined

function setContext(context) {
    this.context = context
}
function getContext() {
    return this.context
}
function getConfiguration() {
    return vscode.workspace.getConfiguration('superencourager')
}
function getSettings(key) {
    return getConfiguration().get(key)
}
function setSettings(key, value) {
    return getConfiguration().update(key, value, true)
}
function getExtensionPath() {
    return vscode.extensions.getExtension('runnerup.super-encourager').extensionPath
}

function log(msg) {
    if (!out) {
        out = vscode.window.createOutputChannel('super encourager')
        // out.show()
    }
    out.appendLine(msg)
    console.log(msg)
}
function getKeywords() {
    let keywordFolder = fs.readdirSync(getImageRootPath())
    let keywords = new Set()
    keywordFolder.forEach(item => {
        if (item !== '.DS_Store' && item !== '.gitkeep') {
            if (item.endsWith(GIF_SUFFIX)) {
                keywords.add(item.substring(0, item.indexOf(GIF_SUFFIX)))
            } else {
                keywords.add(item)
            }
        }
    })
    return Array.from(keywords)
}
exports.setContext = setContext
exports.getContext = getContext
exports.getConfiguration = getConfiguration
exports.getSettings = getSettings
exports.setSettings = setSettings
exports.getExtensionPath = getExtensionPath
exports.log = log
exports.getKeywords = getKeywords
exports.MY_LOVE = '⭐我的最爱'
