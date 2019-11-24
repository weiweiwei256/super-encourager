const { getConfiguration, getGlobalStoragePath } = require('../../global/util.js')
const { getGlobalState } = require('../../global/global-state.js')
exports.handle = function(value) {
    let config = getConfiguration()
    let globalState = getGlobalState()
    let extra = {
        rootPath: getGlobalStoragePath(),
    }
    return { config, extra, globalState }
}
