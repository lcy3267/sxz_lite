var _function = require('../../utils/functionData.js');
var _upload = require('../../utils/upload.js');
var app = getApp();

import {
  request,
  prompt
} from '../../utils/util';
import api from '../../config/api';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    checked: true,
    mid: 0,
    minfo: {},
    hiddenmodalput: true,
    hiddenmodalputphone: true,
    winWidth: 0,
    fileNames: '',
    nickName: '',
    phone: '',
    showFlag: false,
    imageList: [],
    fileList: [],
    fileNames: [],
    ISADMIN: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var m_id = options.mid;
    if (m_id) {
      console.log('管理修改')
      that.setData({
        mid: m_id,
        ISADMIN: app.globalData.MEM_INFO.adminFlag,
      })
      //请求详情
      _function.getMemberInfo(wx.getStorageSync("utoken"), m_id, that.initMemberInfoData, that)
    }
    else {
      that.check_login(that,function()
      {
        that.setData({
          mid: app.globalData.MEM_INFO.id,
          ISADMIN: app.globalData.MEM_INFO.adminFlag,
        })
        //请求详情
        _function.getMemberInfo(wx.getStorageSync("utoken"), that.data.mid, that.initMemberInfoData, that)
      })
    
    }
    
  },
  initMemberInfoData: function (data) {
    this.setData({ 
      minfo: data,
    showFlag: data.showFlag
     });
  },

  updateAdmin: function(e){
    const { minfo, ISADMIN } = this.data;
    if(ISADMIN){
      minfo.adminFlag = !minfo.adminFlag;
      request(api.editMember(minfo.id), minfo, "PUT").then((res)=>{
        prompt('修改成功')
      });
    }else{
      wx.showModal({title: '您不是管理员，修改失败'})
    }
  },

  deleteMember: function(e){
    const { minfo, ISADMIN } = this.data;
    if(ISADMIN){
      wx.showModal({
        content: "确定删除该员工",
        showCancel: true,
        confirmText: "确定",
        success: (res_)=> {
          if (res_.confirm) {
            request(api.editMember(minfo.id), null, "DELETE").then((res)=>{
              prompt('删除成功')
              setTimeout(()=>{
                wx.navigateBack();
              }, 1500)
            });
          }
        },
        fail: function () {
         console.log('用户点击取消')
        }
      })
      
    }
  },

  //选择图片 
  uplodeImage: function (e) {


    var that = this
    wx.chooseImage({
      sourceType: ['camera', 'album'],
      sizeType: ['compressed', 'original'],
      success: function (res) {
        console.log('chose over :' + res.tempFiles)
        that.setData({
          imageList: res.tempFilePaths,
          fileList: res.tempFiles,
        })
        console.log('chose over  file paths:' + that.data.imageList)

        if (that.data.imageList && that.data.imageList.length > 0) {
          _upload.uploadToCos(e, that.data.fileList, that, function (imgCosUrls) {
            console.log('well! get the cos url:' + imgCosUrls)

            var data = {
              token: wx.getStorageSync("utoken"),
              companyId: wx.getStorageSync("companyId"),
              id: that.data.mid,
              headImgurl: imgCosUrls[0],
              _: Date.now()
            };

            _function.updateMemberInfo(data, that.data.mid, that.onPullDownRefresh, this)
          })
        }

      },
      fail: function (res) {
        console.log('error')
      }
    })
  },


  //显示输入弹框
  modalInput: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  modalInputphone: function () {
    this.setData({
      hiddenmodalputphone: !this.data.hiddenmodalputphone
    })
  },
  //初始化值
  nicknameInput: function (e) {
    this.setData({
      nickName: e.detail.value
    })
  },
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  cancelphone: function () {
    this.setData({
      hiddenmodalputphone: true
    });
  },
  //确认  修改手机号
  confirmphone: function () {
    var that = this
    if (this.data.phone == "") {
      this.showMsg("手机号输入不能为空!");
      return;
    }

    var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(this.data.phone)) {
      this.showMsg("您输入的手机号格式有误！");
      return;
    }

    var data = {
      token: wx.getStorageSync("utoken"),
      companyId: wx.getStorageSync("companyId"),
      id: that.data.mid,
      phone: that.data.phone,
      _: Date.now()
    };

    _function.updateMemberInfo(data, that.data.mid, that.onPullDownRefresh, this)

    that.setData({
      hiddenmodalputphone: true
    })
  },
  //修改昵称
  confirm: function () {
    var that = this
    if (this.data.nickName == "") {
      this.showMsg("昵称输入不能为空!");
      return;
    }

    if (this.data.nickName.length < 2) {
      this.showMsg("昵称输入不能少于2个字!");
      return;
    }
    var data = {
      token: wx.getStorageSync("utoken"),
      companyId: wx.getStorageSync("companyId"),
      id: that.data.mid,
      nickName: that.data.nickName,
      _: Date.now()
    };

    _function.updateMemberInfo(data, that.data.mid, that.onPullDownRefresh, this)

    that.setData({
      hiddenmodalput: true
    })
  },
  //修改展示微官
  switchChangeShowFlag: function (e) {
    var that = this
    var data = {
      token: wx.getStorageSync("utoken"),
      companyId: wx.getStorageSync("companyId"),
      id: that.data.mid,
      showFlag: e.detail.value,
      _: Date.now()
    };
    _function.updateMemberInfo(data, that.data.mid, that.onPullDownRefresh, this)
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
  to_linkremark: function (e) {
    var mid = e.currentTarget.id;
    wx.navigateTo({
      url: '../editremark/index?mid=' + mid
    })
  },
  to_linkziwei: function (e) {
    var mid = e.currentTarget.dataset.mid;
    console.log(mid)
    wx.navigateTo({
      url: '../rolelist/index?mid=' + e.currentTarget.dataset.mid + '&role=' + e.currentTarget.dataset.role
    })
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

  check_login: function (pageObj, excuteFunc) {
    //保证获取cusId
    // var openid = '';
    if (app.globalData.MEM_INFO) {
      console.log('已经登录，并正常获取到ID,mid OK=' + app.globalData.MEM_INFO.id)
      excuteFunc.apply(pageObj, [app.globalData.MEM_INFO]);
    } else {
      console.log('未登录，开始等待通知,memid=')
      app.openidCallback = openidCallback => {
        if (openidCallback.id != '') {
          console.log('等待到授权并登录 id:' + openidCallback.id)
          // app.globalData.MEM_INFO = openidCallback
          excuteFunc.apply(pageObj, [app.globalData.MEM_INFO]);
          console.log('in send req end')
        }
      }
    }
  },
  to_index:function()
  {
    wx.switchTab({
      url: '../index/index'
    })
  }


})