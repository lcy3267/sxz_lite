// pages/addteam/index.js
const _function = require('../../utils/functionData.js');
let app= getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth:0,
    needJoinMemList:[],
    pid:null,
    pname:null,
    MEM_ID:null,
    comId:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let pid = options.pid
    let pname = options.pname
    let comId = options.comId
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          pid:pid,
          pname:pname,
          comId: comId
        })
      },
    })

    _function.getNeedJoinMem(comId, pid,that,function(res)
    {
      that.setData({
        needJoinMemList:res,
      })
    })

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
    _function.getNeedJoinMem(that.data.comId, that.data.pid, that, function (res) {
      that.setData({
        needJoinMemList: res,
      })
    })
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

  to_addTeam:function(e)
  {
    let that=this
    console.log(e.currentTarget.dataset)
    wx.showLoading({
      title: '加入装修队',
    })
    _function.addToTeam(that.data.comId, e.currentTarget.dataset.mid, that.data.pid, e.currentTarget.dataset.role, app.globalData.MEM_ID,that,function(res){
      wx.hideLoading()
      wx.showToast({
        title: '加入成功！',
      })
      _function.getNeedJoinMem(that.data.comId, that.data.pid, that, function (res) {
        that.setData({
          needJoinMemList: res,
        })
      })
    })
  }
})