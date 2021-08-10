# dragonfly 商家线下点餐小程序

## 前言

- 通过微信小程序开发文档的一个线下点餐小程序，首页即为菜品点餐下单页，提供各种菜品选择、每日换新功
  能、顾客可以选择堂食或者外带两种方法，小程序包含订单页、用户页、搜索页、购物袋、支付页面，地址页等多个页面。

云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

> 因个人号无法发布该类型小程序，故以体验版展示

<a href="https://dcanmera.github.io" target="_blank">
  <img src="https://dcanmera.github.io/dragonfly/dragonfly.jpg" alt="微信小程序体验码" style="width:60px;height:60px;"/>
</a>

# 项目架构

```
│  project.config.js                  // 项目工程文件, 记录用户偏好(编辑器主题色，字体大小...)
├─cloudfunctions
|      ├─add_address                  // 添加地址云函数
|      ├─add_order                    // 添加订单云函数
|      ├─add_shopcart                 // 添加购物车云函数
|      ├─edit_address                 // 编辑地址云函数
|      ├─get_address                  // 获取地址云函数
|      ├─get_address_by_key           // 查询地址云函数
|      ├─get_aisde_menu_list          // 获取侧栏导航云函数
|      ├─get_menu_list                // 获取菜品云函数
|      ├─get_order                    // 获取订单云函数
|      ├─get_products                 // 搜索菜品云函数
|      ├─get_shopcart                 // 获取购物车云函数
|      ├─get_shopcart_by_id           // 查询购物车id云函数
|      ├─remove_address               // 删除地址云函数
|      ├─remove_shopcart              // 删除购物车云函数
|      ├─update_address_byid          // 根据id更新地址云函数
|      └─update_shopcart              // 更新购物车云函数
├─data
|   ├─img                             // 菜品图片
|   ├─aisde_menu_list.json            // 菜品侧栏数据
|   └─menu_list                       // 菜品数据
|
└─miniprogram
    │  app.js                         // 小程序入口文件
    │  app.json                       // 小程序全局配置
    │  app.wxss                       // 小程序样式, 类似css
    │  sitemap.json                   // 微信索引(可以标记小程序页面可在微信中搜索)
    ├─components
    │  ├─FoodChoices                  // 菜品规格组件
    │  ├─MenuItem                     // 菜品组件
    │  ├─NavItem                      // 侧栏导航组件
    │  ├─OrderItem                    // 订单组件
    │  └─Popup                        // 弹出窗组件
    ├─images
    |  ├─tabBar                       // tabBar底部栏图库
    |  └─logo.png                     // dragonfly logo
    ├─js
    |  └─utils.js                     // 公共方法文件
    ├─pages
    │  ├─address                      // 地址页
    │  ├─edit_address                 // 新增地址页
    │  ├─feedback                     // 客服页
    │  ├─home                         // 首页
    │  ├─order                        // 订单页
    │  ├─orderDetail                  // 订单详情页
    │  ├─pay                          // 支付页
    │  ├─profile                      // 我的页
    │  └─search                       // 搜索页
    └─style
       ├─common.wxss                  // 公共样式
       └─iconfont.wxss                // icon样式

```

# 技术栈

- 云函数
- 云数据库
- 云存储
- 小程序 API
- ES6
- css3
- JSON
- WXML
- WXSS
- JavaScript

# 功能模块

- 首页模块
- 订单模块
- 我的模块
- 菜品模块
- 搜索模块
- 购物车模块
- 支付模块
- 订单详情模块
- 地址、新增地址模块
- 客服模块
- 自定义菜品模块
- 自定义菜品规格选择模块
- 自定义订单模块
- 自定义导航模块
- 自定义弹出窗模块
