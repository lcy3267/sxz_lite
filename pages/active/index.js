const _function = require('../../utils/functionData.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      winwidth: 0,
      Promotion: {},
      id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winwidth: res.windowWidth
        })
      },
    })

    _function.getPromotionList(wx.getStorageSync("utoken"), wx.getStorageSync("companyId"), 1, that.initPromotionListData, that)
  },
  initPromotionListData: function (data) {
      this.setData({ Promotion: data });
  },
  
  to_detail:function(e){
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../activedetail/index?id='+id,
    })
  },
  to_edit:function(e){

    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../activeedit/index?id=' + id,
    })
  },
  to_delete:function(e){
    var that = this;
    var id = e.currentTarget.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该条数据吗?',
      success: function (res) {
          if (res.confirm) {
              _function.delPromotion(wx.getStorageSync("utoken"), id, that.onPullDownRefresh, that)
        }
      },
    })
  },
  

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //加载信息
    var that = this
    _function.getPromotionList(wx.getStorageSync("utoken"), wx.getStorageSync("companyId"), 1, that.initPromotionListData, that)
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