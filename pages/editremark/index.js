const _function = require('../../utils/functionData.js');
const _ = require('../../utils/underscore');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mid: 0,
    phone:'',
    minfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

   
    var that = this
    var m_id = options.mid;
    that.setData({
      mid: m_id,
    })
    //请求详情
    _function.getMemberInfo(wx.getStorageSync("utoken"), m_id, that.initMemberInfoData, this)
    
  },
  initMemberInfoData: function (data) {
    this.setData({ minfo: data, phone: data.phone });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //加载信息
    var that = this
    _function.getMemberInfo(wx.getStorageSync("utoken"), that.data.mid, that.initMemberInfoData, that)
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },

  formSubmit: function (e) {
    var that = this
    const values = _.extend(e.detail.value, {
      form_id: e.detail.formId,
      token: wx.getStorageSync("utoken"),
      companyId: wx.getStorageSync("companyId"),
      id: that.data.mid,
      phone: that.data.phone,
      _: Date.now()
    });

    if (values.resume == "") {
      this.showMsg("简介输入不能为空!");
      return;
    }
    _function.updateMemberInfo(values, that.data.mid, that.doMemberInfoData, this)
  },
  doMemberInfoData: function (data) {
    var that = this
    if (data.status == 0) {
      wx.showModal({
        title: '提示',
        content: '修改成功！',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '../addpersonal/index?mid=' + that.data.mid
            })
          }
        }
      })
    }
  },

  /**
   * 显示提示信息
   */
  showMsg: function (content) {
    wx.showModal({
      content: content,
      showCancel: false,
    });
  },
  
})