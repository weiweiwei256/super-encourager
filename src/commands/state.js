const { getContext } = require('../global/util.js')
let context = getContext();
exports.getGlobalState = function getGlobalState() {
    let state = context.globalState._value || {}
    // 设置默认值
    state[types.GLOBAL.HITOKOTO_TYPE] || (state[types.GLOBAL.HITOKOTO_TYPE] = '')
    return state
}
exports.setGlobalState = function setGlobalState(newGlobalState) {
    for (var i in newGlobalState) {
        if (context.globalState.get(i) !== newGlobalState[i]) {
            context.globalState.update(i, newGlobalState[i])
        }
    }
}
exports.getState = function getState(, key, defaultValue) {
    return context.globalState.get(key, defaultValue)
}
exports.setState = function setState(, key, value) {
    return context.globalState.update(key, value)
}

