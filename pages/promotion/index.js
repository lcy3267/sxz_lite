// pages/promotion/index.js
const _function = require('../../utils/functionData.js');
let app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bg: _function.COS_IMAGE_BASE_URL + 'bg4.png',
    web: '/images/web.png',
    wg: '/images/wg.png',
    gd: '/images/gd.png',
    dt: '/images/dt.png',
    sm: '/images/sm.png',
    lb: '/images/lb.png',
    ph: '/images/yx.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  to_promotion_corpor: function (e) {
    console.log('dd' + e.currentTarget.dataset.pid)
    let that = this

    wx.navigateToMiniProgram({
      appId: 'wx4a7643da2e234afd',
      path: 'pages/index/index?act=prmt&comid=2&mid=' + app.globalData.MEM_ID,
      extraData: {
        mid: app.globalData.MEM_ID
      },
      envVersion: 'trial',
      success(res) {
        // 打开成功
        console.log('ok' + res)
      },
      fail(res) {
        console.log('fail:' + res)
      },
      complete(res) {
        console.log('complete:' + res)
      }
    })

  },
  to_promotion_project: function (e) {
    console.log('dd' + e.currentTarget.dataset.pid)
    let that = this
    // 
    wx.showActionSheet({
      itemList: ['微信朋友/群全员推广', '朋友圈全员推广(小程序二维码)', '全民监工邀请卡(公众号二维码)', '工程永久二维码(进入小程序)'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          console.log('in' + res.tapIndex)
          wx.navigateToMiniProgram({
            appId: 'wx4a7643da2e234afd',
            path: 'pages/videodetail/index?act=prmt&pid=' + e.currentTarget.dataset.pid,
            extraData: {
              mid: app.globalData.MEM_ID
            },
            envVersion: 'trial',
            success(res) {
              // 打开成功
              console.log('ok' + res)
            },
            fail(res) {
              console.log('fail:' + res)
            },
            complete(res) {
              console.log('complete:' + res)
            }
          })
        }
        if (res.tapIndex == 1) {

        }
        if (res.tapIndex == 2) {

        }
        if (res.tapIndex == 3) {

        }
        if (res.tapIndex == 4) {

        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
})