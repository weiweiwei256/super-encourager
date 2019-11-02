let context = undefined
exports.initContext = function(context) {
    this.context = context
}
exports.getGlobalState = function getGlobalState() {
    let state = this.context.globalState._value || {}
    // 设置默认值
    return state
}
exports.setGlobalState = function setGlobalState(newGlobalState) {
    for (var i in newGlobalState) {
        if (this.context.globalState.get(i) !== newGlobalState[i]) {
            this.context.globalState.update(i, newGlobalState[i])
        }
    }
}
exports.getState = function getState(key, defaultValue) {
    return this.context.globalState.get(key, defaultValue)
}
exports.setState = function setState(key, value) {
    return this.context.globalState.update(key, value)
}
