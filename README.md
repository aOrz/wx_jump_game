# 微信跳一跳自动玩耍工具
[![](https://badge.juejin.im/entry/5a477b485188252bca0533d7/likes.svg?style=flat-square)](https://juejin.im/post/5a477aed6fb9a045167d87bf)
## 安装

先安装 node 和 一些依赖，

安装 `adb`，[https://www.jianshu.com/p/1b3fb1f27b67](https://www.jianshu.com/p/1b3fb1f27b67)

canvas 依赖

OS X `brew install pkg-config cairo libpng jpeg giflib`

Windows `https://github.com/Automattic/node-canvas/wiki/Installation---Windows`

## 开始

确保依赖安装正确，手机连接到电脑上，打开USB调试，使用 adb 命令可以连接上时，执行本

`git clone git@github.com:aOrz/wx_jump_game.git`

`cd wx_jump_game`

`node wx_bump.js`

或者 

`npm i -g wechat-jump-game`

执行命令

`jump`

## 其他

如果跳不过去，试试调一调时间系数，wx_jump.js 192行左右 `let press_time = distance * 1.31; // 时间系数，不准的话可以先调这个，系数越大，跳的越远`

### 一些参考

华为P9 plus 分辨率： 1080 1920 系数： 1.31，3000+分

魅蓝 A5 分辨率 720 1280 系数 1.95，625分（还可以优化哦~）
## 文章

[手把手教你用 node 玩跳一跳](https://fddcn.cn/wechat-jump.html)
## 鸣谢

感谢 @wangshub ，让我们解锁了一个玩游戏的新方式~~


## 分享交流

打赏|加小助手进微信群
:---:|:---:
<img src="https://fddcn.cn/wp-content/uploads/2017/12/WechatIMG117.jpeg" width="200"/>  |  <img src="https://fddcn.cn/wp-content/uploads/2017/12/WechatIMG116.jpeg" width="200"/>

## demo

![](/demo/index.png)
