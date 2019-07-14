import { workspace, WorkspaceConfiguration } from "vscode";
export function getSettings() {
  return workspace.getConfiguration("Super Encourager");
}
