var sliderWidth = 46; // 需要设置slider的宽度，用于计算中间位置
function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["新项目", "进行中", "已完成"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    manager: '/images/lingkefu.png',
    new: '/images/new.png',
    tuiguang: '/images/tuiguang.png',
    shezhi: '/images/shezhi.png',
    gongcheng: '/images/gongcheng.png',
    uesrinfo: {}
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });

    var that = this

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth
        })
      },
    })
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        that.setData({
          uesrinfo: res.userInfo
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

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