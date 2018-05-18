var _function = require('../../utils/functionData.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      PromotionInfo: {},
      caseId : 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this
      var cId = options.id;
      that.setData({
          caseId: cId,
      })
      //请求详情
      _function.getPromotionInfo(cId, that.initPromotionInfoData, this)
  },
  initPromotionInfoData: function (data) {
      this.setData({ PromotionInfo: data });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      //加载信息
      var that = this
      _function.getPromotionInfo(that.data.caseId, that.initPromotionInfoData, that)
      setTimeout(() => {
          wx.stopPullDownRefresh()
      }, 1000) 
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
  
  }
})