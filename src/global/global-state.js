let context = undefined
let defaultState = {
    encourager: {
        hitokoto_type: '',
    },
}
const { deepObjectMerge, log } = require('./util.js')

function setGlobalState(newGlobalState) {
    for (var i in newGlobalState) {
        if (this.context.globalState.get(i) !== newGlobalState[i]) {
            this.context.globalState.update(i, newGlobalState[i])
        }
    }
}
function setPageState(page, key, value) {
    let pageData = this.context.globalState.get(page)
    pageData[key] = value
    this.context.globalState.update(page, pageData)
}
function getGlobalState() {
    // TEST:
    // removeGlobalState('encourage')
    //  数据兼容
    if (this.context.globalState.get('hitokoto_type')) {
        defaultState.encourage.hitokoto_type = this.context.globalState.get('hitokoto_type')
    }
    // 默认配置原有配置混合
    let currentState = this.context.globalState._value || {}
    currentState = deepObjectMerge(defaultState, currentState)
    // 更新配置
    setGlobalState(currentState)
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
exports.setGlobalState = setGlobalState
exports.setPageState = setPageState
exports.removeGlobalState = removeGlobalState
exports.initContext = function(context) {
    this.context = context
}
