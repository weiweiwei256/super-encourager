# 超级鼓励师 README

基于百度搜索定制您的私人鼓励师,希望能为努力工作的您带来鼓励和温暖!

开源,公益,不易，您的建议是我前进的动力。

源码地址:[https://github.com/weiweiwei256/super-encourager](https://github.com/weiweiwei256/super-encourager/labels/%E6%84%8F%E8%A7%81%E5%BB%BA%E8%AE%AE) 记得star :P

## 基于Vue的全新vscode 插件"超级鼓励师"正式上线了
### vue源码仓库:https://github.com/weiweiwei256/super-encourager-vue
-  新增功能:
	-  常见API: MDN,前端模块,后端模块,各种手册,工具推荐
	-  常见工具: 二维码生成器,日期时间戳转化,字符串处理
	-  娱乐放松: 小游戏,搞破坏,发发呆
	-  设置页: 暂时仅支持设置一言请求类型.
- 功能优化:
	- 右上角提示鼓励师关闭时间,任意点击后会终止自动关闭.
	- 多关键字设置: 
	  不再支持单一关键字设置,而采用空格分隔多个关键字<br>
    例如:"石原里美 邓紫棋 新垣结衣 ⭐我的最爱"<br> 
    插件会从多个关键字中随机选择关键字,获取美图展示.
  - 除切换关键字命令
  - 支持点击获取下一张美图.

## 使用方法

-   召唤鼓励师的几种方式：
    -   通过右上编辑器导航（礼物图标）
    -   通过点击右下角的状态栏“超级鼓励师”
    -   通过文件右键菜单
    -   F1 进入命令选择，激活命令：super.call:召唤鼓励师
    -   通过 Ctrl+F1 热键触发
-   设置关键字的几种方式
    -   F1 进入命令选择，激活命令：super.set:设置关键字
    -   进入 vscode settings，进入 extensions,选择“超级鼓励师”，设置关键字条目。
    -   还有其他命令，属性等待您探索欧！！！

## 特点

-   一言精选功能 (最新)
-   基于百度图片搜索，根据用户设置的关键字进行个性化搜索，您的最爱在等你。
-   支持收藏功能，动手网罗天下美图吧！ 记得及时切换关键字为“⭐ 我的最爱”使用这些美图呦！
-   不仅支持特定时间间隔召唤，还支持自然时间（半点，整点）召唤。
-   简单快捷的关键字管理(增加，切换，删除)。
-   支持百度动图搜索，但是搜索有可能存在不准的情况。
-   支持查看本地图片，方便收藏。

## 依赖

-   [VS Code 1.35.1+](https://code.visualstudio.com/)
-   [Node.js 8+](https://nodejs.org)

## Extension Settings

-   superencourager.keyword: 搜索图片关键字
-   superencourager.needTip: 鼓励前是否需要消息提示
-   superencourager.timeLast: 鼓励持续时间设置
-   superencourager.timeInterval: 鼓励时间间隔
-   superencourager.isGif:是否获取动图
-   superencourager.type:鼓励方式
-   superencourager.maxImageNum: 每个关键字的最大图片数量

## Extension Commands

-   super.call:召唤超级鼓励师
-   super.set:设置搜索关键字
-   super.clear:删除关键字的图片
-   super.showPath:查看图片本地路径

### For more information

#### 相关博客链接

-   [掘金:基于百度图片搜索的 vscode 插件——超级鼓励师](https://juejin.im/post/5d4d138951882575595c44e0)

-   [简书:基于百度图片搜索的 vscode 插件——超级鼓励师](https://www.jianshu.com/p/ae750a86eaf8)

#### 鸣谢意见建议
-  [v1.hitokoto.cn](v1.hitokoto.cn) 提供的一言API

-  [liguobao](https://github.com/liguobao) 

    - [issues#3](https://github.com/weiweiwei256/super-encourager/issues/3)

    - 建议使用一言API

-  [Elisony](https://github.com/Elisony) 
    - [issues#2](https://github.com/weiweiwei256/super-encourager/issues/2)

**Enjoy!**
