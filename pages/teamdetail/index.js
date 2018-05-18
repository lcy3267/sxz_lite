var app=getApp();
var utils = require('../../utils/util.js')
var _EnvData = require('../../utils/data.js');
var _loginer = require('../../utils/logincheck.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    you: '/imagefile/you.png',
    memberid:0,
    name:'',
    teamdetail:{},
    promotions:[],
    indicatorDots: true,
    vertical: false,
    autoplay: true, interval: 2000, duration: 500,
    memberlatest:[],
    winWidth3: 0, imagelist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      memberid: options.mid,
      name:options.mname
    })
    wx.setNavigationBarTitle({
      title: options.mname+'的主页',
    })
    console.log(options.mid)
    var that = this;

    _loginer.check_login(app,that,function()
    {
      wx.request({
        url: _EnvData.SXZ_HOST_URL + '/member/' + options.mid,
        header: {
          'content-type': 'application/json'
        },
        method: 'GET',
        success: function (res) {
          console.log(res.data.result)
          that.setData({
            teamdetail: res.data.result
          })
        }
      })
      that.get_memberlatest(options.mid);
      that.get_caselist(options.mid);
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            winWidth3: (res.windowWidth - 100) / 3
          })
        }
      })

    })

    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  
  get_caselist:function(id){
    var that = this;
    let active=[]
    wx.request({
      url: _EnvData.SXZ_HOST_URL + 'promotion/customer/member/' + id,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        // console.log(res.data.result)
        for (let i = 0; i < res.data.result.length; i++) {
          active.push({ caseType: res.data.result[i].caseType, faceImgurl: res.data.result[i].faceImgurl, title: res.data.result[i].title, caseId: res.data.result[i].caseId })
        }
        that.setData({
          promotions: active
        })
      }
    })
  },
  get_memberlatest:function(id){
    var that = this;
    wx.request({
      url: _EnvData.SXZ_HOST_URL + 'projectlog/memberlatest/' + id,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data.result)
        let list = []
        let datas = []
        let previewImgurllist=[]
        let newlist=[]
        for (let i = 0; i < res.data.result.length; i++) {
          datas.push({
             content: res.data.result[i].content, 
             createTime: res.data.result[i].createTime,
             photoList: res.data.result[i].photoList,
             projectName: utils.cutString(res.data.result[i].projectName, 30),
             projectId: res.data.result[i].projectId,
             avatarUrl: res.data.result[i].avatarUrl,
             nickName: utils.cutString(res.data.result[i].nickName, 20)
             })
        }
        for (let i = 0; i < datas.length; i++) {
          list.push(datas[i].photoList)
        }
        for (let i = 0; i < list.length; i++) {
          previewImgurllist.push({previewImgurl:list[i]})
        }
        for (let i = 0; i < previewImgurllist.length; i++) {
          newlist.push({ previewImgurl: previewImgurllist[i].previewImgurl })
        }
        console.log(newlist)
        that.setData({
          memberlatest: datas,
          imagelist: previewImgurllist
        })
      }
    })
 
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  previewImage: function (e) {
    console.log(e.target.dataset.src)
    console.log(e.target.dataset.list)
    var current = e.target.dataset.src
    let imglist = [e.target.dataset.src]
    wx.previewImage({
      current: current,
      urls: imglist
    })
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