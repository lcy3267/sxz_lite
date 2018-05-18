const _function = require('../../utils/functionData.js');
const _loginchecker = require('../../utils/logincheck.js');
var _EnvData = require('../../utils/data.js');
const app = getApp()

const { Field, extend } = require('../../zanui/dist/index')

// 在 Page 中混入 Field 里面声明的方法
Page(extend({}, Field, {
  data: {
    uesrinfo:{},
    start:'/images/start.png',
    gp: '/images/gp.png',
    active:'/images/active.png',
    notice: '/images/notice.png',
    winWidth:0,
    bg: _EnvData.COS_IMAGE_BASE_URL + 'bg4.png',
    right: '/images/right.png',
    infos: '/images/infos.png',
    team: '/images/team.png', 
    manager: '/images/manager.png',
    case: '/images/case.png',
    mark: '/images/mark.png',
    notice: '/images/promotion_fill.png',
    sp: '/images/sp.png',
    yx: '/images/yx.png',
    kh: '/images/kh.png',
    qd: '/images/gd.png',
    bj: '/images/lb.png',
    processIcon: '/images/shezhi.png',
    COM_BASE_INFO:null,
    projectList: {},
    IMG_BASE_URL: _EnvData.COS_IMAGE_BASE_URL,
    PREVIEW_IMG_FIX: '?imageView2/1/w/150/h/150',
    winWidth3: 100
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log('onLoad')
    var that=this
    _loginchecker.check_login(app,that,function()
    {
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            winWidth: res.windowWidth,
            winWidth3: (res.windowWidth - 60) / 3,
            uesrinfo: app.globalData.userInfo,
            COM_BASE_INFO: app.globalData.COM_BASE_INFO
          })
        },
      })
      
      _function.getMemDynamic(wx.getStorageSync("utoken"), app.globalData.MEM_ID, that.initProjectListtData, that)

    })
    

  },

  
  initProjectListtData: function (data) {
      this.setData({ projectList: data });
      wx.hideLoading()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  link_web:function(){
    wx.showModal({
      title: '',
      content: '微官网正在维护中...，请稍后重试',
      showCancel:false
    })
  },
  to_noticelist:function(){
    wx.navigateTo({
      url: '../noticelist/index',
    })
  },
  to_active:function(){
    wx.navigateTo({
      url: '../active/index',
    })
  },
  to_mypromotion:function(){
    wx.navigateTo({
      url: '../mypromotion/index',
    })
  },
  to_sign_in:function(){
    wx.navigateTo({
      url: '../signin/signin',
    })
  },
  to_prices:function(){
    wx.navigateTo({
      url: '../pricesList/list',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // ...
  to_approve: function () {
    wx.showModal({
      title: '',
      content: '还在建设中...',
      showCancel: false
    })
  },
  to_cms: function () {
    wx.showModal({
      title: '',
      content: '还在建设中...',
      showCancel: false
    })
  }, 

  to_prjprocess(){
    wx.showModal({
      title: '',
      content: '还在建设中...',
      showCancel: false
    })
    // wx.navigateTo({
    //   url: '../prj_process/list',
    // })
  }, 
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
}));