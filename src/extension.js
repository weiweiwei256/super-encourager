const vscode = require('vscode')
const CronJob = require('cron').CronJob
const {
    setContext,
    getSettings,
    setSettings,
    getImageRootPath,
    getKeywords,
    log,
    MY_LOVE
} = require('./global/util.js')
const { initContext } = require('./global/global-state.js')
const { delImages,GIF_SUFFIX } = require('./global/images.js')
const { main } = require('./encourager.js')
let timeMeter = null // 计时器
let stateBar = undefined
const ALL_KEYWORD = '**全部**'
function activate(context) {
    log('super encourager is starting!')
    setContext(context)
    initContext(context)
    initBar()
    initTimer()
    let call = vscode.commands.registerCommand('superencourager.call', () => {
        try {
            main()
            initTimer()
            // 注入当插件属性值被修改后的即使更新回调
            vscode.workspace.onDidChangeConfiguration(function(event) {
                Promise.resolve(event.affectsConfiguration('superencourager.type'))
                    .then(data => {
                        if (data) {
                            //true 代表这个属性已经被修改
                            timeMeter = undefined
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
                            timeMeter = undefined
                            initTimer()
                        }
                    })
                    .then(undefined, err => {
                        console.error('err', err)
                    })
            })
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
                data => {
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

function initBar() {
    stateBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 0)
    stateBar.command = 'superencourager.call'
    stateBar.text = '召唤鼓励师'
    stateBar.tooltip = '召唤超级鼓励师'
    stateBar.show()
}
function initTimer() {
    if (!timeMeter) {
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
                stateBar.text = '召唤鼓励师(已就绪)'
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
        log('timer init')
    }
}

exports.activate = activate

exports.deactivate = function() {}
