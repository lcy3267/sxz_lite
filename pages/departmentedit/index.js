// pages/departmentedit/index.js
const _function = require('../../utils/functionData.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    but_value: '确定',
    sudDepId: '',
    //更新标志位：false代表新增，true代表更新
    update: false,
    //新增部门名称
    subDepNme:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type == 'edit') {
      this.setData({
        but_value: '修改',
        sudDepId: options.id,
        subDepNme: options.name,
        update: true,
      })
      wx.setNavigationBarTitle({
        title: '修改部门',
      })
    }
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
  input: function (e) {
    this.setData({
      subDepNme: e.detail.value
    })
  },
  //自定义方法
  doSubDepartment() {
    let that = this
    if (this.data.update) {
      _function.updateSubDep(wx.getStorageSync("utoken"),
        {
          subDepartmentName: that.data.subDepNme,
          _: Date.now()
        }, that.data.sudDepId,that, function (res) {
          wx.navigateBack()
        });
    } else {
      _function.createSubDep(wx.getStorageSync("utoken"),{
        companyId: app.globalData.COM_ID,
        subDepartmentName: that.data.subDepNme,
        _: Date.now()
      }, that, function (res) {
        wx.navigateBack()
      });
    }
  }
})
