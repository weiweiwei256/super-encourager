# 超级鼓励师 README

参考其他鼓励师的思路，并扩展相关功能，增强鼓励效果
注意：为节约性能，需要主动触发第一次鼓励,才可触发自动鼓励。

## Features

- 基于百度图片搜索，根据用户设置的关键字进行个性化搜索，提供你的最爱。
- 不仅支持特定时间间隔召唤，还支持自然时间（暂时支持：半点，整点）召唤。
- 简单快捷的关键字管理。
- 支持百度动图搜索，但是搜索有可能存在不准的情况。
- 支持查看本地图片。

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

## Release Notes

### 1.0.1

init

### 1.0.2

处理依赖导致无法运行问题

---

### For more information

- [github](https://github.com/weiweiwei256/super-encourager)   记得star :P

**Enjoy!**
