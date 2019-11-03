const cmds = require('./cmd-constant.js')
const testCommand = require('./test-command.js')
const initCommand = require('./init-command.js')
const imageCommand = require('./image-command.js')
const commandHandler = {
    handleCommand: async function(cmd) {
        let { cmdKey, msgCode, arg } = cmd
        let result
        switch (cmdKey) {
            case cmds.INIT:
                result = initCommand.handle(arg)
                break
            case cmds.TEST:
                result = testCommand.handle(arg)
                break
            case cmds.ENCOURAGER_IMAGE:
                result = await imageCommand.handle(arg)
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
