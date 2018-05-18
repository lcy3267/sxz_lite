var app = getApp()
var Vlder = require('../../utils/validator.js');
const _function = require('../../utils/functionData.js');
const _upload = require('../../utils/upload.js');
const _ = require('../../utils/underscore');
let UploadFinish = false
let PrjId = 6
var cosKey = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reasonList: ["出现错误", "使用不方便", "增加功能", "有虚假信息", "界面不好看", "受到骚扰", "填写信息不完善", "其它问题"],
    imageList: [],
    fileList: [],
    fileNames: [],
    percent: null,

    stageArray:[],
    stageIndex:0,
    countIndex: 8,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    projectName:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    //初始枚举
    _function.getParams(wx.getStorageSync("utoken"), app.globalData.COM_ID, 'stage', that.initstageParamsData, that)
    if (options.pid)
    {
      PrjId = options.pid
      console.log(PrjId)
      that.setData({
        projectName:options.pname,
        percent:null
      })
    }
    else{
      wx.showModal({
        title: '错误',
        content: '请从工程页进入',
      })
    }
    UploadFinish=false
  },


  stageChange: function (e) {
    this.setData({
      stageIndex: e.detail.value
    })
  },

  deleteImg: function(e){
    const { index } = e.currentTarget.dataset;
    this.setData({
        imageList: this.data.imageList.filter((d , i)=> i!= index),
        fileList: this.data.fileList.filter((d , i)=> i != index),
    })
  },

  chooseImage: function () {
    var that = this
    // wx.showLoading({
    //   title: '图片载入中...',
    // })
    wx.chooseImage({
      count: 9-that.data.imageList.length,
      success: function (res) {
        that.setData({
          imageList: [...that.data.imageList, ...res.tempFilePaths],
          fileList: [...that.data.fileList, ...res.tempFiles],
        })
      },
      fail: function(res)
      {
        console.log('error' + res)
      },
      complete:function()
      {
        console.log('complete')
      }
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },

  prjlogInfo_bind:function(e)
  {

  },
  submit_uptLog:function(e)
  {
    let that=this
    let param = e.detail.value
    console.log(param)
    

    if (Vlder.required(param.Contents,'内容') &&
      Vlder.required(''+param.stage,'阶段'))
    {
     
      if (that.data.imageList && that.data.imageList.length>0)
      {
        wx.showLoading({
          title: '发布播报中',
        })
        console.log(that.data.imageList)
        _upload.uploadToCos(e, that.data.fileList,that,function(imgCosUrls){
          // that.setData({
          //   fileList: fileNames
          // })
          console.log('well! get the cos url:' + imgCosUrls)
          that.submitPrjlog(param, imgCosUrls)
        },true)
      }
      else{
      wx.showModal({
        content: "确定不上传照片吗？多秀照片才有人关注哦！",
        showCancel: true,
        confirmText: "确定",
        success: function (res_) {
          if (res_.confirm) {
            wx.showLoading({
              title: '发布播报中',
            })
            //  console.log('用户点击确定')
            that.submitPrjlog(param)
           
          }
        },
        fail: function () {
         console.log('用户点击取消')
        }
      })

    }
    }
    //send
  },


  submitPrjlog: function (param,imgUrls)
  {
    //  console.log('用户点击确定')
    let that =this
    let vrImgurl
    if (param.isVr) {
      vrImgurl = imgUrls[0]
    } else
    { vrImgurl=null}
    let datas = {
      content: param.Contents,
      memberId: app.globalData.MEM_ID,
      nickName: app.globalData.userInfo.nickName,
      projectName:that.data.projectName,
      imageNameList: imgUrls,
      projectId: PrjId,
      stage: param.stage,
      vrFlag: param.isVr,
      vrImgurl: vrImgurl,
      logType: '01',
      companyId: app.globalData.COM_ID
    }


    _function.createPrjlog(datas, that, function (res) {
      // that.setData({
      //   commentLists: tmplist
      // })
      wx.showToast({
        title: '提交成功',
      })
      wx.hideLoading()
      //跳转
      wx.navigateTo({
        url: '../projectdetail/projectdetail?pid=' + PrjId
      })
    }
    );
    
  },

  switchVr:function(e)
  {
    let that = this
    if (e.detail.value)
      that.setData({
        countIndex:0
      })
      else
      that.setData({
        countIndex: 8
      })
  },
  //初始化枚举
  initstageParamsData: function (data) {
    let stageStr = [];
    for (var i = 0; i < data.length; i++) {
      stageStr.push(data[i].text)
    }
    this.setData({ stageArray: stageStr });
  },
})