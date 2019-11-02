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
const GIF_SUFFIX = '_GIF'

function setContext(context) {
    this.context = context
}
function getContext() {
    return this.context
}
function getSettings(key) {
    return vscode.workspace.getConfiguration('superencourager').get(key)
}
function setSettings(key, value) {
    return vscode.workspace.getConfiguration('superencourager').update(key, value, true)
}
function getExtensionPath() {
    return vscode.extensions.getExtension('runnerup.super-encourager').extensionPath
}
/**
 *获取extension 中 imagesPath 以 '/' 结尾
 *
 * @returns
 */
function getImageRootPath() {
    return path.join(getExtensionPath(), '/images/')
}
/**
 *
 * 处理判断是否是动图的情况
 *
 * @returns
 */
function getImagePath() {
    if (!getSettings('isGif')) {
        return getImageRootPath() + getSettings('keyword')
    } else {
        return getImageRootPath() + getSettings('keyword') + GIF_SUFFIX
    }
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
function uncompile(r) {
    const n = /(_z2C\$q|_z&e3B|AzdH3F)/g
    const t = /([a-w\d])/g
    const e = {
        w: 'a',
        k: 'b',
        v: 'c',
        1: 'd',
        j: 'e',
        u: 'f',
        2: 'g',
        i: 'h',
        t: 'i',
        3: 'j',
        h: 'k',
        s: 'l',
        4: 'm',
        g: 'n',
        5: 'o',
        r: 'p',
        q: 'q',
        6: 'r',
        f: 's',
        p: 't',
        7: 'u',
        e: 'v',
        o: 'w',
        8: '1',
        d: '2',
        n: '3',
        9: '4',
        c: '5',
        m: '6',
        0: '7',
        b: '8',
        l: '9',
        a: '0',
        _z2C$q: ':',
        '_z&e3B': '.',
        AzdH3F: '/',
    }
    let o = r.replace(n, function(t, n) {
        return e[n]
    })
    return o.replace(t, function(t, n) {
        return e[n]
    })
}

exports.GIF_SUFFIX = GIF_SUFFIX
exports.uncompile = uncompile
exports.setContext = setContext
exports.getContext = getContext
exports.getSettings = getSettings
exports.setSettings = setSettings
exports.getExtensionPath = getExtensionPath
exports.getImageRootPath = getImageRootPath
exports.getImagePath = getImagePath
exports.log = log
exports.getKeywords = getKeywords
