const _function = require('../../utils/functionData.js');
const _ = require('../../utils/underscore');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth:0,
    uesrinfo:{},
    memberlist: [],
    selfMem:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          selfMem: app.globalData.MEM_INFO
        })
      },
    })
    _function.getMemberList(wx.getStorageSync("utoken"), wx.getStorageSync("companyId"), that.initMemberListData, that)

  },

  onShow: function(){
    this.onLoad();
  },

  initMemberListData: function (data) {
    this.setData({ memberlist: data });
  },
  //详情设置
  memberinfo_bind: function (e) {
    var mid = e.currentTarget.id;
    wx.navigateTo({
      url: '../addpersonal/index?mid=' + mid
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //加载信息
    var that = this
    _function.getMemberList(wx.getStorageSync("utoken"), wx.getStorageSync("companyId"), that.initMemberListData, that)
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