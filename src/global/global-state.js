let context = undefined
let defaultState = {
    common: {
        hasActiveDriver: false,
    },
    encourager: {
        hitokoto_type: '',
    },
}
const { deepObjectMerge, log } = require('./util.js')

function saveGlobalState(newGlobalState) {
    for (var i in newGlobalState) {
        if (this.context.globalState.get(i) !== newGlobalState[i]) {
            this.context.globalState.update(i, newGlobalState[i])
        }
    }
}
function updateGlobalState(page, key, value) {
    let pageData = this.context.globalState.get(page)
    pageData[key] = value
    this.context.globalState.update(page, pageData)
}

function getGlobalState() {
    // TEST:
    // 不再数据向前兼容
    // 默认配置原有配置混合
    let currentState = this.context.globalState._value || {}
    currentState = deepObjectMerge(defaultState, currentState)
    // 更新配置
    saveGlobalState(currentState)
    // 设置默认值
    return currentState
}
function removeGlobalState(key) {
    this.context.globalState.update(key, undefined).then(function() {
        console.log(this.context.globalState.get(key))
    })
}
function getState(key, defaultValue) {
    return this.context.globalState.get(key, defaultValue)
}
function setState(key, value) {
    return this.context.globalState.update(key, value)
}
exports.getState = getState
exports.setState = setState
exports.getGlobalState = getGlobalState
exports.updateGlobalState = updateGlobalState
exports.removeGlobalState = removeGlobalState

// FIX ME: 通过getContext方式获取 会更优雅
exports.initContext = function(context) {
    this.context = context
}
