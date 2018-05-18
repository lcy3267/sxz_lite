// pages/clientadd/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    area: ['目标客户', '潜在客户'], areaIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type=='add'){
      wx.setNavigationBarTitle({
        title: '添加客户',
      })
    } else if(options.type == 'edit'){
      wx.setNavigationBarTitle({
        title: '编辑客户',
      })
    }
  },
  onAreaChange(e) {
    this.setData({
      areaIndex: e.detail.value
    });
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
  
  }
})