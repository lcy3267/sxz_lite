//app.js
const _function = require('utils/functionData.js');
var _EnvData = require('utils/data.js');
const network = require('utils/network.js');
App({ 
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.setStorageSync("utoken", 6);
    wx.setStorageSync("companyId", 2);
    //获取设备信息(高度，宽度)
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowWidth + 'X' + res.windowHeight)
        that.globalData.systemInfo = res
      }
    })

    // wx.getUserInfo({
    //   withCredentials: true,
    //   success: function (res1) {
    //     console.log("====user nickname:" + res1.userInfo.nickName)
    //     console.log("====user unionid:" + res1.userInfo.unionId)
    //     that.globalData.userInfo = res1.userInfo
    //     //开始登录
    //     that.get_Login()
    //   }
    //   ,
    //   fail: function (res) {
    //     wx.navigateTo({
    //       url: '../register/index',
    //     })
    //   }
    // })

    that.get_userinfo();
    
    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },

  //获取公司信息
  get_companyinfo: function () {
    var that = this;
    wx.request({
      url: _EnvData.SXZ_HOST_URL + 'company/base/' + that.globalData.COM_ID,
      header: {
        'content-type': 'application/json' // 
      },
      method: 'GET',
      success: function (res) {
        if (res.data.success)
        {
        that.globalData.COM_BASE_INFO = res.data.result
        if (that.openidCallback) {
          that.openidCallback(res.data);
        }
        }
      }
    })
  },

  //sean start
  get_userinfo: function () {
    let that = this;
    wx.getUserInfo({
      withCredentials: true,
      success: function (res1) {
        console.log("====user nickname:" + res1.userInfo.nickName)
        //console.log("====user unionid:" + res1.userInfo.unionId)
        that.globalData.userInfo = res1.userInfo
        //开始登录
        that.get_Login()
      }
      ,
      fail: function (res) { //用户点了“拒绝”
        // 向用户提示需要权限才能继续
        wx.showModal({
          title: '用户未授权',
          content: '如需正常使用小程序功能，请按确定后在【设置-我的】页面中打开授权。本小程序不保存用户隐私信息。',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.openSetting({
                success: function (res) {
                  if (res.authSetting["scope.userInfo"]) {
                    console.log('成功打开授权')
                    //重新获取一次
                    wx.getUserInfo({
                      withCredentials: true,
                      // 如果成功打开授权
                      success: function (res1) {
                        console.log("====userInfo nickname:" + res1.userInfo.nickName)
                        console.log("====userInfo unionid:" + res1.userInfo.unionId)
                        console.log("====userInfo openid:" + res1.userInfo.openid)
                        that.globalData.userInfo = res1.userInfo
                        that.get_Login()
                        
                      }
                    })

                  }
                  else {
                    console.log('用户依然拒绝授权')

                    // wx.showModal({
                    //   title: '无法使用',
                    //   content: '如需正常使用小程序功能，请按确定后在【设置-我的】页面中打开授权。本小程序不保存用户隐私信息。',
                    //   showCancel: false,
                    wx.navigateTo({
                      url: '../register/index',
                    })
                  } 
                },
                fail: function () { //调用失败，授权登录不成功
                  // fail()
                  console.log('调用失败，授权登录不成功')
                  wx.navigateTo({
                    url: '../register/index',
                  })
                }
              })
            }
          }
        })
      }
    })
  },
  //开始登录
  get_Login: function () {
    var that = this
    wx.login({
      success: function (res_login2) {
        var requestUrl = 'mlogin/' + res_login2.code;
        var jsonData = {
          // code: res_login2.code,
          // encryptedData: res_login2.encryptedData,
          // iv: res_login2.iv
          nickName: that.globalData.userInfo.nickName,
          avatarUrl: that.globalData.userInfo.avatarUrl,
          // companyId: that.globalData.COM_ID,
          gender: that.globalData.userInfo.gender,
          city: that.globalData.userInfo.city,
          country: that.globalData.userInfo.country,
          province: that.globalData.userInfo.province,
          language: that.globalData.userInfo.language
        };
        network.REQUEST(that, 'POST', requestUrl, jsonData, function (res) {
          console.log('Login success! MEM_ID:' + res.result.id + ' COM_ID:' + res.result.companyId);
          that.globalData.MEM_ID = res.result.id
          that.globalData.MEM_INFO = res.result
          that.globalData.COM_ID = res.result.companyId;
          wx.setStorageSync("utoken", res.headers.token);
          that.get_companyinfo()
          // if (that.openidCallback) {
          //   that.openidCallback(res.result);
          // }
        }, function (res) {
          //设置获取cusid失败异常情况的标识  
console.warn('登录失败')
          // wx.showLoading({
          //   title: '异常重试中',
          //   mask:true
          // })
          wx.navigateTo({
            url: '../error/error',
          })
        });
      }
    })
  },
  globalData: {
    systemInfo:null,
    userInfo: null,
    MEM_ID: 16,
    MEM_INFO:null,
    // ISADMIN:null,
    // ROLEID:null,
    AUTH_TOKEN:null,
    COM_ID: 2,
    COM_BASE_INFO:null,
  }
})