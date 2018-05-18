const _function = require('../../utils/functionData.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      AppintmentList: {},
      appType: ['装修报价', '免费量房设计', '意见和投诉', '咨询', '活动报名','预约看工地']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that=this;

      _function.getAppintmentList(wx.getStorageSync("utoken"), wx.getStorageSync("companyId"), that.initAppintmentListData, that)

  },
  initAppintmentListData: function (data) {
      this.setData({ AppintmentList: data });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      //加载信息
      var that = this     
      _function.getAppintmentList(wx.getStorageSync("utoken"), wx.getStorageSync("companyId"), that.initAppintmentListData, that)
      setTimeout(() => {
          wx.stopPullDownRefresh()
      }, 1000)
  },
  toCall: function (e) {
      wx.makePhoneCall({
          phoneNumber: e.currentTarget.dataset.phone //仅为示例，并非真实的电话号码
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})