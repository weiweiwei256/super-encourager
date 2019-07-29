const vscode = require('vscode')
exports.getSettings = function getSettings(key) {
  return vscode.workspace.getConfiguration('superencourager').get(key)
}
exports.setSettings = function getSettings(key, value) {
  return vscode.workspace
    .getConfiguration('superencourager')
    .update(key, value, true)
    .then(() => {
      vscode.window.showInformationMessage(`属性key:${key}更新为value:${value}`)
    })
}
