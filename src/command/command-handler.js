const cmds = require('./cmd-constant.js')
const testCommand = require('./handler/test-command.js')
const initCommand = require('./handler/init-command.js')
const imageCommand = require('./handler/image-command.js')
const changeIamgeCollectCommand = require('./handler/change-image-collect-command.js')
const stopCloseCommand = require('./handler/stop-close-command.js')
const updateConfigCommand = require('./handler/update-config-command.js')
const saveFileCommand = require('./handler/save-file-command.js')
const commandHandler = {
    handleCommand: async function(cmd) {
        let { cmdKey, msgCode, value } = cmd
        let result
        switch (cmdKey) {
            case cmds.INIT:
                result = initCommand.handle(value)
                break
            case cmds.TEST:
                result = testCommand.handle(value)
                break
            case cmds.ENCOURAGER_IMAGE:
                result = await imageCommand.handle(value)
                break
            case cmds.ENCOURAGER_CHANGE_IMAGE_COLLECT:
                result = await changeIamgeCollectCommand.handle(value)
                break
            case cmds.STOP_CLOSE:
                result = await stopCloseCommand.handle(value)
                break
            case cmds.UPDATE_WEB_CONFIG:
                result = await updateConfigCommand.handle(value)
                break
            case cmds.SAVE_FILE:
                result = await saveFileCommand.handle(value)
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
