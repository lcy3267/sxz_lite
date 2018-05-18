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
    tabs: ["播报", "装修队"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    uesrinfo: {},
   
    steps2: [
      {
        current: false,
        done: true,
        text: '前期',
        desc: '10.01'
      },
      {
        done: true,
        current: true,
        text: '设计',
        desc: '10.02'
      },
      {
        done: false,
        current: false,
        text: '拆改',
        desc: '10.03'
      },
      {
        done: false,
        current: false,
        text: '水电',
        desc: '10.03'
      },
      {
        done: false,
        current: false,
        text: '泥木',
        desc: '10.03'
      }
    ],
    gx: '/images/gx.png',
    tg: '/images/promotion_fill.png',
    winWidth3:0,
    pl_btn: true,
    zan_btn: true,
    zan: '/imagefile/zan.png',
    zan_on: '/imagefile/zan_on.png',
    pl: '/imagefile/pl.png',
    pl_on: '/imagefile/pl_on.png',
    close: '/imagefile/close.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          winWidth3: (res.windowWidth - 60) / 3
        });
      }
    });
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        that.setData({
          uesrinfo: res.userInfo
        })
      }
    })
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
  to_delete:function(){
    wx.showModal({
      title: '提示',
      content: '确定移除该成员吗',
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
      this.onload();
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