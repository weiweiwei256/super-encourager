const cmds = require('./cmd-constant.js')
const testCmd = require('./handler/test-command.js')
const initCmd = require('./handler/init-command.js')
const imageCmd = require('./handler/image-command.js')
const changeIamgeCollectCmd = require('./handler/change-image-collect-command.js')
const stopCloseCmd = require('./handler/stop-close-command.js')
const updateConfigCmd = require('./handler/update-config-command.js')
const saveFileCmd = require('./handler/save-file-command.js')
const callEntertainmentCmd = require('./handler/call-entertainment-command.js')
const commandHandler = {
    handleCommand: async function(cmd) {
        let { cmdKey, msgCode, value } = cmd
        let result
        switch (cmdKey) {
            case cmds.INIT:
                result = initCmd.handle(value)
                break
            case cmds.TEST:
                result = testCmd.handle(value)
                break
            case cmds.ENCOURAGER_IMAGE:
                result = await imageCmd.handle(value)
                break
            case cmds.ENCOURAGER_CHANGE_IMAGE_COLLECT:
                result = await changeIamgeCollectCmd.handle(value)
                break
            case cmds.STOP_CLOSE:
                result = await stopCloseCmd.handle(value)
                break
            case cmds.UPDATE_WEB_CONFIG:
                result = await updateConfigCmd.handle(value)
                break
            case cmds.SAVE_FILE:
                result = await saveFileCmd.handle(value)
                break
            case cmds.CALL_ENTERAINMENT:
                result = await callEntertainmentCmd.handle(value)
                break
            default:
                console.error('unknown cmd key:' + cmdKey)
        }
        let sendPkg = {
            cmdKey,
            msgCode,
            result,
        }
        return sendPkg
    },
}
exports.commandHandler = commandHandler
