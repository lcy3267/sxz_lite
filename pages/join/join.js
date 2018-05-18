// pages/join/index.js
const _function = require('../../utils/functionData.js');
var _EnvData = require('../../utils/data.js');
var _Qrcode = require('../../utils/qrcode.js');
var app = getApp()
var joinType =null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: null,
    qrcodeUrl: '/images/code.jpg',
    joinTypeText:'【加入公司】',
    joinPrjName:'',
    canvas_on:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let action = options.type
    console.log('action:' + action)
    let that = this
    that.setData(
      {
        nickName: app.globalData.userInfo.nickName,
     
      }
    )
    let datas = {
    }

      console.log('action:' + options.pid + options.pname)
    if (action == 'owner' && options.pid && options.pname)
    {
      that.setData(
        {
          joinTypeText: '【成为业主】',
          joinTypeText2: '(仅限加入两位业主)',
          joinPrjName: options.pname
        }
      )
      joinType = 'owner'

      let urlparam = 12 + '/' + app.globalData.MEM_ID + '/' + app.globalData.COM_ID + '/' + options.pid
        _function.getQrcode(urlparam, that, function (res) {
          that.setData(
            {
              qrcodeUrl: _EnvData.QRCODE_BASE_URL + res,
            }
          )

        })

    }
    else
    {
      that.setData(
        {
          joinTypeText: '【加入公司】',
          joinTypeText2: '(最多加入10人，30天内有效)',
          joinPrjName: options.pname
        })
      joinType = 'member'
    let tmp = null;//wx.getStorageSync("qrcodeUrl_mem");
      if (tmp)
      {
        that.setData(
          {
            qrcodeUrl: tmp,
          }
        )
      }
      else
      {
        let urlparam = 11 + '/' + app.globalData.MEM_ID + '/' + app.globalData.COM_ID + '/0'
        _function.getQrcode(urlparam, that, function (res) {
          that.setData(
            {
              qrcodeUrl: _EnvData.QRCODE_BASE_URL + res,
            }
          )
          //wx.setStorageSync("qrcodeUrl_mem", that.data.qrcodeUrl);
        })
      }
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

  sendAppinment:function(e)
  {
    let that  = this
    let txt1,txt2,txt3,txt4
    if (joinType=='owner')
    {
      txt1 = that.data.nickName + '邀您成为业主！'
      txt3 = '(长按图片发送给工程业主)'
      txt2 = '请业主朋友在微信识别二维码加入:'
      txt4 = '工程:'+that.data.joinPrjName
    }
    else
    {
      txt1 = that.data.nickName + '邀您加入！'
      txt3 = '(长按图片发送给同事)'
      txt2 = '微信中长按,识别二维码加入：'
      txt4 = '公司 : ' + app.globalData.COM_BASE_INFO.companyName
    }
    _Qrcode.genarateQrImage(this, 'shareCanvas', 'https://sxz-1255492784.image.myqcloud.com/20180323pg.png', this.data.qrcodeUrl,txt1,txt2,txt3,txt4)
    
  }
})