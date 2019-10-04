const { types } = require('./types.js')
exports.getGlobalState = function getGlobalState(context) {
    let state = context.globalState._value || {}
    // 设置默认值
    state[types.GLOBAL.HITOKOTO_TYPE] || (state[types.GLOBAL.HITOKOTO_TYPE] = '')
    return state
}
exports.setGlobalState = function setGlobalState(context, newGlobalState) {
    for (var i in newGlobalState) {
        if (context.globalState.get(i) !== newGlobalState[i]) {
            context.globalState.update(i, newGlobalState[i])
        }
    }
}
exports.getState = function getState(context, key, defaultValue) {
    return context.globalState.get(key, defaultValue)
}
exports.setState = function setState(context, key, value) {
    return context.globalState.update(key, value)
}
