# 基于百度图片搜索的vscode插件——超级鼓励师

## 简介

超级鼓励师是一款vscode插件，基于百度图片搜索服务，根据用户设置的关键字获取图片。并通过webview展示给用户。缓解程序猿/媛工作压力，给予你爱的鼓励。
    
vscode 插件市场搜索超级鼓励师立即使用

源码地址：[https://github.com/weiweiwei256/super-encourager](https://github.com/weiweiwei256/super-encourager)

![简介图](https://github.com/weiweiwei256/super-encourager/raw/master/blogs/images/introduce.jpeg)

### 效果图：

![效果图](https://github.com/weiweiwei256/super-encourager/raw/master/blogs/images/effect.jpeg)

广告做完了 说正事:P

<hr>

## 百度搜索请求解析
1. 百度图片请求
    打开[百度图片网站](https://image.baidu.com/)或在[搜索页面](https://image.baidu.com/search/index?ct=201326592&z=&tn=baiduimage&ipn=r&word=%E7%9F%B3%E5%8E%9F%E9%87%8C%E7%BE%8E&pn=0&istype=2&ie=utf-8&oe=utf-8&cl=2&lm=-1&st=-1&fr=&fmq=&ic=0&se=&sme=&width=&height=&face=0&hd=1&latest=0&copyright=0)切换请求可以在开发者工具,network看到xhr请求 
    https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=%E7%9F%B3%E5%8E%9F%E9%87%8C%E7%BE%8E&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=-1&z=&ic=0&hd=1&latest=&copyright=&word=%E7%9F%B3%E5%8E%9F%E9%87%8C%E7%BE%8E&s=&se=&tab=&width=&height=&face=0&istype=2&qc=&nc=1&fr=&expermode=&force=&pn=30&rn=30&gsm=1e&1565319711348=
    
    由于存在跨域限制，所以前端无法直接通过GET请求获取返回值。而vscode自带node环境，通过服务端访问就避免了跨域问题。通过node服务将获取的图片保存到本地，可以实现在没有网络的情况下工作。

    部分请求参数解析：
    * queryword和word 为搜索关键字 主要需要encodeURI编码
    * offset 偏移量 从第几张还是获取
    * rn 获取图片数量
    * hd 是否获取高清
    * lm 6为获取动图  1为获取正常 图片

其他的参数可通过不断更改网站参数，对比url自己探索。

返回参数主要看data,它包含图片的各种信息：
![data数据截图](https://github.com/weiweiwei256/super-encourager/raw/master/blogs/images/response-data.png)

其中hoverURL，middleURL,thumbURL的值很多时候是相同的，可以选取其一。

<b>注意: 这个地址是预览图片地址，图片真正的地址保存在objURL中,经过百度加密过。后面有详细说明。

实例数据：objURL: "ippr_z2C$qAzdH3FAzdH3Ft42n_z&e3B17tpwg2_z&e3Bv54AzdH3F7rs5w1fAzdH3Ftpj4AzdH3Fda8mamAzdH3Fd9AzdH3Fda8mamd9da9bc8_pQgti_z&e3B3rj2"
</b>

2. 获取百度动图

当通过百度搜索动图的时候，你会发现很多图并不动，只有悬浮时才会加载真正的动图。通过查看data.thumbUrl的图片发现是静止的，而且资源很小。可以进一步证实。

探索之路开始：

1. 通过悬浮功能，查看dom变化，发现image src发生改变，外层li增加class hactive。

![hactive in code](https://github.com/weiweiwei256/super-encourager/raw/master/blogs/images/hactive.png)

2. 全局搜索hactive，sources只可以单文件搜索（也可能我见识浅陋）有由于百度加载文件较多，这样搜索会死人的。可以通过network ctrl+F从所以通过网络获取资源中搜索。这样就相当与全局搜索。如果有需要可以根据资源路径找到源码，断点调试。
3. 找到 data-objURL属性

![data-objURL in code](https://github.com/weiweiwei256/super-encourager/raw/master/blogs/images/data-objURL.png)

4. 找到 objURL 属性 解析后

![objURL in code](https://github.com/weiweiwei256/super-encourager/raw/master/blogs/images/objURL.png)

5. 百度检索  存在没有与时俱进的问题
[百度返回的JSON数据解析返回的objURL](https://blog.csdn.net/sinat_35045195/article/details/79205578)

6. 再次搜索映射关键字，找到uncompile源码  授之以鱼不如授之以渔 再也不用担心百度修改编码了

![objURL in code](https://github.com/weiweiwei256/super-encourager/raw/master/blogs/images/uncompile.png)

通过解码后的objURL就可以获取真实地址。

[测试地址]（https://github.com/weiweiwei256/super-encourager/blob/master/note/test.js）

## 自然时间鼓励
    
超级鼓励师支持自然时间（整点，半点）鼓励。采用node-cron <b>详情请参考最后链接</b>

## vscode 插件开发注意点
    
* 监控属性变化
```
vscode.workspace.onDidChangeConfiguration(function(event) {
    Promise.resolve(event.affectsConfiguration('superencourager.type'))
        .then(data => {
        if (data) {
            //true 代表这个属性已经被修改
            timeMeter = undefined
            initTimer(context)
        }
        })
        .then(undefined, err => {
        console.error('err', err)
        })
    })
```
* output输出
```
let out;
if (!out) {
    out = vscode.window.createOutputChannel('super encourager')
    out.show()
  }
  out.appendLine(msg)
```
* 属性类型设置为number 但是在window下读取是 string 记得转型。

有些入门博客也不错，请看参考链接

插件基本都是开源的，有啥需要的功能直接去找已经实现该功能的插件源码就行。我参考了很多LeetCode的代码


## 插件开发注意事项

## 参考链接

[制作爬虫爬取百度图片](https://blog.csdn.net/mingzhiqing/article/details/82778954)

[百度返回的JSON数据解析返回的objURL](https://blog.csdn.net/sinat_35045195/article/details/79205578)

[node-cron github地址](https://github.com/kelektiv/node-cron#readme)

[vscode 扩展开发从入门到颈椎病康复](https://zhuanlan.zhihu.com/p/43999448)

[VSCode插件开发全攻略](https://www.cnblogs.com/liuxianan/p/vscode-plugin-overview.html)

[vscode-extentions 官网](https://code.visualstudio.com/api/extension-guides/webview)

[LeetCode github地址](https://github.com/jdneo/vscode-leetcode)