(function(e){function t(t){for(var o,r,i=t[0],c=t[1],u=t[2],f=0,d=[];f<i.length;f++)r=i[f],Object.prototype.hasOwnProperty.call(s,r)&&s[r]&&d.push(s[r][0]),s[r]=0;for(o in c)Object.prototype.hasOwnProperty.call(c,o)&&(e[o]=c[o]);l&&l(t);while(d.length)d.shift()();return a.push.apply(a,u||[]),n()}function n(){for(var e,t=0;t<a.length;t++){for(var n=a[t],o=!0,i=1;i<n.length;i++){var c=n[i];0!==s[c]&&(o=!1)}o&&(a.splice(t--,1),e=r(r.s=n[0]))}return e}var o={},s={app:0},a=[];function r(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,r),n.l=!0,n.exports}r.m=e,r.c=o,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],c=i.push.bind(i);i.push=t,i=i.slice();for(var u=0;u<i.length;u++)t(i[u]);var l=c;a.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"0373":function(e,t,n){},"0c2a":function(e,t,n){"use strict";var o=n("0373"),s=n.n(o);s.a},2395:function(e,t,n){},"431f":function(e,t,n){},"4d7b":function(e,t,n){},"56d7":function(e,t,n){"use strict";n.r(t);n("96cf");var o=n("89ba"),s=(n("e260"),n("e6cf"),n("cca6"),n("a79d"),n("2b0e")),a=(n("d3b7"),n("bc3a")),r=n.n(a),i={},c=r.a.create(i);c.interceptors.request.use((function(e){return e}),(function(e){return Promise.reject(e)})),c.interceptors.response.use((function(e){return e}),(function(e){return Promise.reject(e)})),Plugin.install=function(e,t){e.axios=c,window.axios=c,Object.defineProperties(e.prototype,{axios:{get:function(){return c}},$axios:{get:function(){return c}}})},s["default"].use(Plugin);Plugin,n("32dd");var u=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{ref:"root",attrs:{id:"root"}},[n("view-nav",{attrs:{"def-view":e.activeItem},on:{change:e.handleChange}}),n("div",{staticClass:"page-container",attrs:{flex:"dir:top"}},[n("div",{staticClass:"page-header",attrs:{"flex-box":"0",flex:"main:justify cross:center"}},[n("div",{staticClass:"title"},[e._v(e._s(e.pageTitle))]),n("span",{directives:[{name:"show",rawName:"v-show",value:e.countDown>0,expression:"countDown>0"}],staticClass:"counter",on:{click:e.stopClose}},[e._v("自动关闭: "+e._s(e.countDown)+"秒")]),n("span",{directives:[{name:"show",rawName:"v-show",value:e.countDown<=0,expression:"countDown<=0"}],staticClass:"counter"},[e._v("请手动关闭")])]),n("div",{staticClass:"page-content",attrs:{"flex-box":"1"}},[n("encourager",{directives:[{name:"show",rawName:"v-show",value:e.activeItem===e.ENCOURAGER,expression:"activeItem===ENCOURAGER"}]}),n("common-API",{directives:[{name:"show",rawName:"v-show",value:e.activeItem===e.COMMONAPI,expression:"activeItem===COMMONAPI"}]}),n("test",{directives:[{name:"show",rawName:"v-show",value:e.activeItem===e.TEST,expression:"activeItem===TEST"}]})],1),n("div",{staticClass:"page-footer",attrs:{"flex-box":"0"}},[e._v(" 广告位 ")])])],1)},l=[],f="super/command/test",d="super/command/log",m="super/command/init",p="super/command/stopClose",h="super/command/encourager_image",v="super/command/encourager_change_image_collect",g="super/mutations/test",b="super/actions/test",w="super/mutations/setSetting",_="super/actions/postmessage",C=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{ref:"nav",attrs:{id:"view-nav"},on:{mouseover:e.handleOver}},[n("el-radio-group",{model:{value:e.radioValue,callback:function(t){e.radioValue=t},expression:"radioValue"}},[n("el-radio-button",{staticClass:"iconfont item",attrs:{label:e.ENCOURAGER}},[e._v(" ")]),n("el-radio-button",{staticClass:"iconfont item",attrs:{label:e.COMMONAPI}},[e._v("")])],1)],1)},y=[],O={name:"view-nav",components:{},props:{defView:{type:String,default:""}},data:function(){return{isMoveNav:!1,yOffset:0,radioValue:this.defView,ENCOURAGER:"encourager",COMMONAPI:"common-API"}},watch:{radioValue:function(e){this.$emit("change",e)}},methods:{handleOver:function(){var e=this.$refs["nav"];e.style.cursor="move"}},mounted:function(){var e=this.$refs["nav"];e.onmousedown=function(t){var n=t.clientY,o=e.offsetTop;this.yOffset=n-o,this.isMoveNav=!0,e.style.cursor="move"},e.onmousemove=function(t){if(0!=this.isMoveNav){var n=t.clientY,o=n-this.yOffset;e.style.top=o+"px"}},e.onmouseup=function(){this.isMoveNav=!1,e.style.cursor="default"}}},k=O,j=(n("bbe8"),n("2877")),x=Object(j["a"])(k,C,y,!1,null,"e2e50200",null),S=x.exports,M=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"common-api"}},e._l(e.Publink,(function(e,t,o){return n("div",{key:o,staticClass:"link-container"},[n("link-group",{attrs:{title:t,list:e}})],1)})),0)},R=[],N=n("f410"),P=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"link-group"},[n("el-divider",{attrs:{"content-position":"left"}},[e._v(e._s(e.title))]),e._l(e.list,(function(t,o){return[t.desc?n("el-tooltip",{key:o,staticClass:"link",attrs:{content:t.desc,placement:"top"}},[n("el-link",{attrs:{href:t.url}},[e._v(e._s(t.name))])],1):e._e(),t.desc?e._e():n("el-link",{key:o,staticClass:"link",attrs:{href:t.url}},[e._v(e._s(t.name))])]}))],2)},E=[],I=(n("e3ea"),n("450d"),n("7bc3")),A=n.n(I),D={name:"Encourager",components:{ElDivider:A.a},props:{title:{type:String,required:!1,default:"标题"},list:{type:Array,required:!1,default:function(){return[]}}},data:function(){return{}}},T=D,U=(n("b959"),Object(j["a"])(T,P,E,!1,null,"da5526e4",null)),J=U.exports,G={name:"common-api",components:{LinkGroup:J},props:{},data:function(){return{Publink:N}}},W=G,$=(n("0c2a"),Object(j["a"])(W,M,R,!1,null,"72758808",null)),z=$.exports,V=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{ref:"encourager",attrs:{id:"encourager"}},[n("div",{staticClass:"header"},[n("span",[e._v("当前时间: "+e._s(e.time))])]),n("div",{staticClass:"hi-container"},[n("span",{staticClass:"title"},[e._v("一言精选: ")]),n("span",{staticClass:"icon iconfont",on:{click:function(t){return t.stopPropagation(),e.getHiWord(t)}}},[e._v(" ")]),n("span",{staticClass:"icon iconfont"},[e._v("")]),n("p",{staticClass:"hi-content"},[e._v(e._s(e.hiData.hitokoto))]),n("p",{staticClass:"from"},[e._v("出处: "),n("span",{staticStyle:{"font-weight":"bold"}},[e._v(e._s(e.hiData.from))]),e._v(" 类型: "),n("span",{staticStyle:{"font-weight":"bold"}},[e._v(e._s(e.hType))])]),n("p",{staticClass:"thanks"},[n("span",{staticStyle:{"vertical-align":"middle"}},[e._v("鸣谢:")]),n("el-link",{attrs:{href:"https://hitokoto.cn/"}},[e._v("https://hitokoto.cn/提供一言资源")])],1)]),n("div",{staticClass:"image-container"},[n("div",{staticClass:"title",attrs:{flex:"main:justify"}},[n("span",[e._v("欣赏美图休息一下吧！！！(点击切换下一张)")]),n("el-checkbox",{staticClass:"combo",on:{change:e.handleCollect},model:{value:e.isCollected,callback:function(t){e.isCollected=t},expression:"isCollected"}},[e._v('收藏至"⭐我的最爱"')])],1),n("el-tooltip",{staticClass:"link",attrs:{content:"点击切换至下一张",transition:"el-fade-in-linear","open-delay":3e3,"hide-after":5e3,placement:"top"}},[n("img",{staticClass:"image-content",attrs:{src:e.imageUrl},on:{click:function(t){return t.stopPropagation(),e.getImage(t)}}})])],1)])},L=[],K=(n("0d03"),n("4ec9"),n("3ca3"),n("ddb0"),"加载中..."),q=new Map([["a","动画"],["b","漫画"],["c","游戏"],["d","小说"],["e","原创"],["f","来自网络"],["g","其他"]]),H={name:"encoureager",components:{},props:{},data:function(){return{timer:void 0,time:K,hiData:{hitokoto:K,from:K},imageUrl:"",isCollected:!1}},computed:{hType:function(){return this.hiData.type?q.get(this.hiData.type):K}},created:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(){var t=this;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:this.timer=setInterval((function(){var e=new Date;t.time=e.toLocaleDateString()+" "+e.toLocaleTimeString()}),1e3),this.getHiWord(),this.getImage();case 3:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),methods:{handleCollect:function(){this.sendMessage(v,{imageUrl:this.imageUrl,collectState:this.isCollected})},getHiWord:function(){var e=this;this.axios.get("https://v1.hitokoto.cn/?c=").then((function(t){e.hiData=t.data}))},getImage:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(){var t,n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.sendMessage(h);case 2:t=e.sent,n=t.result,this.imageUrl=n.imageUrl,this.isCollected=n.isCollected;case 6:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()},beforeDestroy:function(){clearInterval(this.timer)}},Y=H,F=(n("79ae"),Object(j["a"])(Y,V,L,!1,null,"f14838d4",null)),X=F.exports,B=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"test"}},[n("h4",[e._v("test")]),n("el-button",{on:{click:function(t){return t.stopPropagation(),e.handleMutations(t)}}},[e._v("invoke mutations")]),n("el-button",{on:{click:function(t){return t.stopPropagation(),e.handleActions(t)}}},[e._v("invoke actions")]),n("el-button",{on:{click:function(t){return t.stopPropagation(),e.testSendMessage(t)}}},[e._v("test send message")]),n("h5",[e._v("config")]),n("div",[e._v(e._s(e.setting.config))]),n("h5",[e._v("globalState")]),n("div",[e._v(e._s(e.setting.globalState))])],1)},Q=[],Z={name:"Test",mounted:function(){console.log("settings:"+this.setting)},computed:{setting:function(){return this.getters("setting")}},methods:{handleMutations:function(){this.commit(g,"page invoke")},handleActions:function(){this.dispatch(b)},testSendMessage:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.sendMessage(f);case 2:e.sent;case 3:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()}},ee=Z,te=Object(j["a"])(ee,B,Q,!1,null,null,null),ne=te.exports,oe={components:{ViewNav:S,CommonAPI:z,Encourager:X,Test:ne},data:function(){return{activeItem:"encourager",ENCOURAGER:"encourager",COMMONAPI:"common-API",TEST:"test",Countdowner:void 0,countDown:0}},computed:{pageTitle:function(){var e="";switch(this.activeItem){case this.TEST:e="测试页";break;case this.ENCOURAGER:e="鼓励";break;case this.COMMONAPI:e="常见API";break;default:console.log("未知activeItem:"+this.activeItem)}return e}},created:function(){var e=this;this.countDown=this.getters("setting").config.timeLast,this.countDown>0&&(this.Countdowner=setInterval((function(){e.countDown--,e.countDown<=0&&e.invokeClose()}),1e3))},methods:{stopClose:function(){this.countDown=-1,clearInterval(this.Countdowner),console.log("终止自动关闭"),this.sendMessage(p)},invokeClose:function(){console.log("关闭...")},handleChange:function(e){this.activeItem=e},handRootClock:function(){this.stopClose(),this.$refs["root"].removeEventListener("click",this.handRootClock,!0)}},mounted:function(){this.$refs["root"].addEventListener("click",this.handRootClock,!0)}},se=oe,ae=(n("7c55"),n("d936"),Object(j["a"])(se,u,l,!1,null,"0d3c65bd",null)),re=ae.exports,ie=(n("0fb7"),n("f529")),ce=n.n(ie),ue=(n("3c52"),n("0d7b")),le=n.n(ue),fe=(n("fe07"),n("6ac5")),de=n.n(fe),me=(n("0c67"),n("299c")),pe=n.n(me),he=(n("560b"),n("dcdc")),ve=n.n(he),ge=(n("fd71"),n("a447")),be=n.n(ge),we=(n("1951"),n("eedf")),_e=n.n(we);s["default"].use(_e.a),s["default"].use(be.a),s["default"].use(ve.a),s["default"].use(pe.a),s["default"].use(de.a),s["default"].use(le.a),s["default"].prototype.$message=ce.a;var Ce,ye,Oe,ke=n("2fa7"),je=n("2f62"),xe={randomString:function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:20,t="ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",n=t.length,o="",s=0;s<e;s++)o+=t.charAt(Math.floor(Math.random()*n));return o}},Se=xe,Me=n("911a"),Re=n.n(Me),Ne={subscribe:function(e,t){return Re.a.subscribe(e,(function(e,n){return t(n)}))},unsubscribe:function(e){return Re.a.unsubscribe(e)},publish:function(e,t){return Re.a.publish(e,t)},publishSync:function(e,t){return Re.a.publishSync(e,t)}},Pe=Ne,Ee=n("f6f5"),Ie=(Ce={},Object(ke["a"])(Ce,d,(function(e){var t=e.msg;return console.info("extension收到数据:"+t),{value:"seceive message"}})),Object(ke["a"])(Ce,f,(function(){return console.info("extension收到测试命令"),{}})),Object(ke["a"])(Ce,m,(function(){return console.log("发送设置!"),{config:{isGif:!1,keyword:"迪丽热巴",maxImageNum:5,needTip:!1,timeInterval:30,timeLast:10,type:"natural-hour"},globalState:{hitokoto_type:"a"}}})),Object(ke["a"])(Ce,h,{imageUrl:Ee,isCollected:!0}),Object(ke["a"])(Ce,v,(function(e){return{msg:"改变成功"}})),Object(ke["a"])(Ce,p,{msg:"终止自动关闭"}),Ce),Ae=Ie,De={postMessage:function(e){window.postMessage(e)},onDidReceiveMessage:function(e){var t,n=e.msgCode,o=e.cmdKey,s=e.value;if(console.log("extension接收到数据:"+JSON.stringify(s)),Ae[o]instanceof Function)t=Ae[o](s);else if(Ae[o]instanceof Object)t=Ae[o];else if(!Ae[o])return void console.error("请增加命令:"+o+"的模拟数据");var a={cmdKey:o,msgCode:n,result:t};this.postMessage(a)}},Te=De,Ue={postMessage:function(e){console.log("sending message"+JSON.stringify(e)),Te.onDidReceiveMessage(e)}},Je=Ue;s["default"].use(je["a"]),window.addEventListener("message",(function(e){var t=e.data;t.msgCode?Pe.publish(t.msgCode,e.data):console.error("未识别message"+JSON.stringify(e))}));var Ge=!1,We=Ge?Je:acquireVsCodeApi(),$e=new je["a"].Store({state:{vscode:We,setting:{}},getters:{vscode:function(e){return e.vscode},setting:function(e){return e.setting}},mutations:(ye={},Object(ke["a"])(ye,g,(function(e,t){console.log("test mutations"),console.log(t)})),Object(ke["a"])(ye,w,(function(e,t){e.setting=t,console.log("设置setting完成")})),ye),actions:(Oe={},Object(ke["a"])(Oe,b,function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,n){console.log("action invoke"),t.commit(g,"action invoke")})));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()),Object(ke["a"])(Oe,_,(function(e,t){var n=t.cmdKey,o=t.value;return new Promise((function(e,t){var s=Se.randomString(8),a=function(t){e(t),Pe.unsubscribe(s)};Pe.subscribe(s,a);var r={msgCode:s,cmdKey:n,value:o};We.postMessage(r)}))})),Oe)}),ze=$e;s["default"].config.productionTip=!1,s["default"].mixin({methods:{dispatch:function(e,t){return ze.dispatch(e,t)},commit:function(e,t){return ze.commit(e,t)},getters:function(e,t){return t?ze.getters[e](t):ze.getters[e]},sendMessage:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(t,n){var o;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.dispatch(_,{cmdKey:t,value:n});case 2:return o=e.sent,console.log("前端页面收到:"+JSON.stringify(o)),e.abrupt("return",o);case 5:case"end":return e.stop()}}),e,this)})));function t(t,n){return e.apply(this,arguments)}return t}()}}),ze.dispatch(_,{cmdKey:m}).then((function(e){ze.commit(w,e.result),new s["default"]({store:ze,render:function(e){return e(re)}}).$mount("#app")}))},"79ae":function(e,t,n){"use strict";var o=n("431f"),s=n.n(o);s.a},"7c55":function(e,t,n){"use strict";var o=n("2395"),s=n.n(o);s.a},8246:function(e,t,n){},b959:function(e,t,n){"use strict";var o=n("8246"),s=n.n(o);s.a},bbe8:function(e,t,n){"use strict";var o=n("4d7b"),s=n.n(o);s.a},d936:function(e,t,n){"use strict";var o=n("f079"),s=n.n(o);s.a},f079:function(e,t,n){},f410:function(e){e.exports=JSON.parse('{"MDN":[{"name":"String","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String"},{"name":"Array","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array"},{"name":"Date","url":"https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date"},{"name":"Map","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map"},{"name":"Object","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object"},{"name":"Element","url":"https://developer.mozilla.org/en-US/docs/Web/API/Element"},{"name":"Set","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set"},{"name":"Math","url":"https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math"},{"name":"Number","url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number"}],"前端模块":[{"name":"moment","url":"http://momentjs.cn/","desc":"JavaScript日期处理类库"},{"name":"v-distpicker","url":"http://momentjs.cn/","desc":"可用于中国省，市和地区的灵活，高度可用区域选择器"},{"name":"vConsole","url":"https://github.com/Tencent/vConsole","desc":"用于移动网页的轻量级，可扩展的前端开发人员工具,用于移动端调试"},{"name":"flex.css","url":"https://codepen.io/webstermobile/pen/apXEER/","desc":"flex.css，轻量级移动端布局神器，让你用最快的速度，并且用最优雅的方式完成复杂的移动端布局，让你专注于编写内容呈现效果，完美兼容Android，ios，微信端。"},{"name":"howler","url":"https://github.com/goldfire/howler.js","desc":"适用于现代网络的Javascript音频库"},{"name":"v-chart","url":"https://v-charts.js.org/#/"}],"Node模块":[{"name":"cron","url":"https://github.com/kelektiv/node-cron#readme","desc":"比setIntervl更强大触发任务库,支持自然时间执行/固定时间间隔执行等"}],"手册":[{"name":"vue官网","url":"https://cn.vuejs.org/v2/guide/"},{"name":"mint-ui","url":"https://mint-ui.github.io/docs/#/zh-cn2"},{"name":"jquery","url":" http://jquery.cuishifeng.cn/"},{"name":"caniuse","url":"https://caniuse.com/"},{"name":"node官方文档","url":"http://nodejs.cn/api/"},{"name":"ES6 阮一峰","url":"http://es6.ruanyifeng.com/"},{"name":"linux 命令大全","url":"https://www.runoob.com/linux/linux-command-manual.html"}],"推荐":[{"name":"vimium","url":"https://www.jianshu.com/p/f803bbba0ba5","desc":"让使用chrome快的飞起"},{"name":"Whistle","url":"https://www.jianshu.com/p/3b483b416f9d","desc":"快速构建本地代码,可用于移动端真机联调,与Chrome插件SwitchyOmega搭配效果更加"},{"name":"SwitchyOmega","url":"https://proxy-switchyomega.com/","desc":"快速配置chrome的代理模式,活用规则快速切换本地代码使用的测试/线上服务"}]}')},f6f5:function(e,t,n){e.exports=n.p+"assets/img/石原里美.7fff895d.jpeg"}});