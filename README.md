# 超级鼓励师 README

参考其他鼓励师的思路，并扩展相关功能，增强鼓励效果<br />
开源公益不易，你的意见建议是进步的动力。[传送门](https://github.com/weiweiwei256/super-encourager/labels/%E6%84%8F%E8%A7%81%E5%BB%BA%E8%AE%AE)<br />

## 使用方法
- 召唤鼓励师：
    - 通过文件右键菜单
    - 通过右上编辑器导航（礼物图标）
    - F1进入命令选择，激活命令：super.call:召唤鼓励师
- 设置关键字
    - F1进入命令选择，激活命令：super.set:设置关键字
    - 进入vscode settings，进入extensions,选择“超级鼓励师”，设置关键字条目。
    - 还有其他命令，属性等待你探索欧！！！

## Features

- 基于百度图片搜索，根据用户设置的关键字进行个性化搜索，你的最爱在等你。
- 不仅支持特定时间间隔召唤，还支持自然时间（半点，整点）召唤。
- 简单快捷的关键字管理(增加，切换，删除)。
- 支持百度动图搜索，但是搜索有可能存在不准的情况。
- 支持查看本地图片，方便收藏。

## Requirements

- [VS Code 1.35.1+](https://code.visualstudio.com/)
- [Node.js 8+](https://nodejs.org)

## Extension Settings

- superencourager.keyword: 搜索图片关键字
- superencourager.timeLast: 鼓励持续时间设置
- superencourager.timeInterval: 鼓励时间间隔
- superencourager.isGif:是否获取动图
- superencourager.type:鼓励方式
- superencourager.maxImageNum: 每个关键字的最大图片数量

## Extension Commands

- super.call:召唤超级鼓励师
- super.set:设置搜索关键字
- super.switch:切换关键字
- super.clear:删除关键字
- super.showPath:查看图片本地路径

### For more information

- [github](https://github.com/weiweiwei256/super-encourager) 记得 star :P

**Enjoy!**
