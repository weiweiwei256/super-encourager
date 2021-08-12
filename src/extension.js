const vscode = require('vscode')
const fs = require('fs')
const path = require('path')
const CronJob = require('cron').CronJob
const {
    setContext,
    getSettings,
    setSettings,
    getKeywords,
    getExtensionPath,
    getGlobalStoragePath,
    getImageRootPath,
    log,
    MY_LOVE,
    GIF_SUFFIX,
} = require('./global/util.js')
const { delImages } = require('./global/images.js')
const { initContext } = require('./global/global-state.js')
let { initBar, getStateBar } = require('./state-bar.js')
const { main } = require('./encourager.js')
let timeMeter = null // 计时器
const ALL_KEYWORD = '**全部**'
function activate(context) {
    log('super encourager is starting!')
    setContext(context)
    initContext(context)
    initGlobalStoragePath()
    initBar()
    initTimer()
    // 增加属性修改监听
    vscode.workspace.onDidChangeConfiguration(function(event) {
        Promise.resolve(event.affectsConfiguration('superencourager.type'))
            .then(data => {
                if (data) {
                    //true 代表这个属性已经被修改
                    initTimer()
                }
            })
            .then(undefined, err => {
                console.error('err', err)
            })
    })
    vscode.workspace.onDidChangeConfiguration(function(event) {
        Promise.resolve(event.affectsConfiguration('superencourager.timeInterval'))
            .then(data => {
                if (data) {
                    //true 代表这个属性已经被修改
                    initTimer()
                }
            })
            .then(undefined, err => {
                console.error('err', err)
            })
    })
    let call = vscode.commands.registerCommand('superencourager.call', () => {
        try {
            main()
        } catch (e) {
            console.error(e)
        }
    })
    let setKeyword = vscode.commands.registerCommand('superencourager.setKeyword', () => {
        vscode.window
            .showInputBox()
            .then(
                data => {
                    if (data === undefined) {
                        return
                    }
                    setSettings('keyword', data)
                        .then(() => {
                            vscode.window.showInformationMessage(`设置关键词 ${data} 成功!`)
                        })
                        .then(undefined, err => {
                            console.error('err', err)
                        })
                },
                () => {},
            )
            .then(undefined, err => {
                console.error('err', err)
            })
    })
    let clearImage = vscode.commands.registerCommand('superencourager.clearImage', () => {
        let keywords = getKeywords()
        keywords = keywords.filter(item => item != MY_LOVE)
        keywords.push(ALL_KEYWORD)
        vscode.window
            .showQuickPick(keywords)
            .then(
                function(data) {
                    log(data)
                    if (data === undefined) {
                        return
                    }
                    if (data !== ALL_KEYWORD) {
                        delImages(data)
                        // 同时移出动图文件夹
                        delImages(data + GIF_SUFFIX)
                    } else {
                        keywords.forEach(item => {
                            delImages(item)
                            // 同时移出动图文件夹
                            delImages(item + GIF_SUFFIX)
                        })
                    }
                },
                () => {},
            )
            .then(undefined, err => {
                console.error('err', err)
            })
    })
    let showPath = vscode.commands.registerCommand('superencourager.showPath', () => {
        vscode.window.showInformationMessage('超级鼓励师本地资源路径：' + getImageRootPath())
    })
    context.subscriptions.push(call)
    context.subscriptions.push(setKeyword)
    context.subscriptions.push(clearImage)
    context.subscriptions.push(showPath)
}

function initTimer() {
    // 如果已有计时器则重新设置
    if (timeMeter) {
        timeMeter.stop()
        log('当前倒计时已销毁')
        timeMeter = undefined
    }
    let timeSetting = '*/10 * * * * *' // 每5秒执行一次 用于测试
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
            getStateBar().text = '召唤鼓励师(已就绪)'
            if (getSettings('needTip')) {
                vscode.window
                    .showInformationMessage('超级鼓励师已就绪，等待您的召唤', '召唤')
                    .then(data => {
                        if (data) {
                            main()
                        }
                    })
            } else {
                main()
            }
        },
        null,
        true,
    )
    log('计时器初始化完成')
}
function initGlobalStoragePath() {
    // 检测公共资源目录是否已经存在 如果不存在就创建
    let globalStoragePath = getGlobalStoragePath()
    if (!fs.existsSync(globalStoragePath)) {
        fs.mkdirSync(globalStoragePath)
    }
    let forderName = ['images',`images/${MY_LOVE}`, 'resources']
    forderName.forEach(name => {
        let checkPath = path.join(globalStoragePath, `/${name}/`)
        if (!fs.existsSync(checkPath)) {
            fs.mkdirSync(checkPath)
        }
    })
    // 默认收藏第一张图到我的最爱
    let sourcePath = path.join(getExtensionPath(), '/src/resources/super-encourager.png')
    let targetPath = path.join(globalStoragePath, `images/${MY_LOVE}`)
    fs.writeFileSync(path.join(targetPath, path.basename(sourcePath)), fs.readFileSync(sourcePath))

}
exports.activate = activate

exports.deactivate = function() {}
