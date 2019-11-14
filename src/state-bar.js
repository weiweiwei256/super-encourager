const vscode = require('vscode')
let stateBar = undefined;
function initBar() {
    stateBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 0)
    stateBar.command = 'superencourager.call'
    stateBar.text = '召唤鼓励师'
    stateBar.tooltip = '召唤超级鼓励师'
    stateBar.show()
}
function getStateBar(){
    return stateBar;
}
exports.getStateBar = getStateBar;
exports.initBar = initBar;