const _function = require('../../utils/functionData.js');
const _upload = require('../../utils/upload.js');
const _ = require('../../utils/underscore.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo: '/images/photo.png',
    winWidth: 0,
    companyInfo: {},
    imageList: [],
    fileList: [],
    fileNames: [],
    imageList1: [],
    fileList1: [],
    imageList2: [],
    fileList2: [],
    percent: 0,
    sourceTypeIndex: 2,
    sourceType: ['拍照', '相册', '拍照或相册'],
    sizeTypeIndex: 2,
    sizeType: ['压缩', '原图', '压缩或原图'],

    countIndex: 8,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    serviceItem:[],
    companyAddress:'',
    laitude:0,
    longitude:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth
        })
      },
    })
    _function.getCompanyInfo(wx.getStorageSync("utoken"), wx.getStorageSync("companyId"), that.initCompanyInfoData, that);
    _function.getParams(wx.getStorageSync("utoken"), app.globalData.COM_ID, 'services', that.initServicsParamsData, that);
  },


  initCompanyInfoData: function (data) {
      this.setData({ 
        companyInfo: data,
        companyAddress: data.companyAddress,
        laitude: data.laitude,
        longitude: data.longitude,
      });
      if (data.logoImgurl != '')
      {
          this.setData({ logo: data.logoImgurl,
            imageList1: data.qualificationImgurls,
            imageList2: data.showImgurls
           });
      }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //加载信息
    var that = this
    _function.getCompanyInfo(wx.getStorageSync("utoken"), wx.getStorageSync("companyId"), that.initCompanyInfoData, that)
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },

  /**
    * 开始提交审核
    */
  formSubmit: function (e) {
   
      var that = this
      let param = e.detail.value
      /*
      const values = _.extend(e.detail.value, {
      form_id: e.detail.formId,
      companyid: wx.getStorageSync("companyId"),
      token: wx.getStorageSync("utoken"),
      _: Date.now()
    });
      */

      if (param.companyName == "") {
      this.showMsg("公司名称输入不能为空~");
      return;
    }

      if (param.phone == "") {
      this.showMsg("电话号码输入不能为空！");
      return;
    }

      if (that.data.companyAddress == "") {
      this.showMsg("公司地址输入不能为空！");
      return;
    }

      if (param.companyId == "") {
      this.showMsg("公司ID不能为空！");
      return;
    }
      let listtmp = that.data.fileList
      listtmp = listtmp.concat(that.data.fileList1)
      listtmp = listtmp.concat(that.data.fileList2)
    let length1 = that.data.fileList1.length;
    console.log('file1Index:' + length1)
    console.log('file2Index:' + that.data.fileList2.length)
    console.log('zong :' + listtmp.length)
      // let filenames =[];
      // for()
      // {
      //   let filename = file.path.substr(file.path.lastIndexOf('/') + 1);
      // }


    if (listtmp && listtmp.length > 0) {
      _upload.uploadToCos(e, listtmp, that, function (imgCosUrls) {
        
              console.log('well! get the cos url:' + imgCosUrls)
              
              // let img3 = imgCosUrls.slice(1 + file1Index)
              // console.log('img3'+img3)
              var datas = {
                  form_id: e.detail.formId,
                  companyId: wx.getStorageSync("companyId"),
                  token: wx.getStorageSync("utoken"),
                  phone: param.phone,
                  companyName: param.companyName,
                  companyAddress: that.data.companyAddress,
                  slogan: param.slogan,
                  brief: param.brief,
                  laitude: that.data.laitude,
                  longitude: that.data.longitude,

                  // logoImgurl: i,
                  // qualificationImgurls:img2,
                  // showImgurls:img3,
                  _: Date.now()
              }
        if (that.data.fileList.length==1)
          datas.logoImgurl = imgCosUrls[0];
        
        if (that.data.fileList1.length>0)
        {
          let img2 = imgCosUrls.slice(that.data.fileList.length, that.data.fileList.length +that.data.fileList1.length)
          console.log('img2' + img2)
          datas.qualificationImgurls=img2
        }

        if (that.data.fileList2.length > 0) {
          let img3 = imgCosUrls.slice(0-that.data.fileList2.length)
          console.log('img3' + img3)
          datas.showImgurls = img3
        }
        
        
              _function.upCompanyInfo(wx.getStorageSync("companyId"), datas, that.doCompanyInfoData, this)
          })
    }
    else {
        var dataz = {
            form_id: e.detail.formId,
            companyId: wx.getStorageSync("companyId"),
            // token: wx.getStorageSync("utoken"),
            phone: param.phone,
            companyName: param.companyName,
            companyAddress: that.data.companyAddress,
            slogan: param.slogan,
            brief: param.brief,
            _: Date.now()
        }
        _function.upCompanyInfo(wx.getStorageSync("companyId"), dataz, that.doCompanyInfoData, this)
    }

   
  },
  doCompanyInfoData: function (data) {
    if (data.status == 0) {
    wx.showModal({
      title: '提示',
      content: '修改成功！',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          wx.switchTab({
            url: '../../pages/index/index'
          })
        }
      }
    })
    }
  },
  chooseImage: function () {
      var that = this
      wx.chooseImage({

          success: function (res) {
              console.log('chose over :' + res.tempFiles)
              that.setData({
                  imageList: res.tempFilePaths,
                  fileList: res.tempFiles,
                  logo: res.tempFilePaths
              })
              console.log('chose over  file paths:' + that.data.imageList)
          },
          fail: function (res) {
              console.log('error')
          }
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
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  // },

  chooseImage1: function () {
    var that = this
    wx.chooseImage({
      sourceType: this.data.sourceType[this.data.sourceTypeIndex],
      sizeType: this.data.sizeType[this.data.sizeTypeIndex],
      count: 3,
      success: function (res) {
        console.log('chose over :' + res.tempFiles)
        that.setData({
          imageList1: res.tempFilePaths,
          fileList1: res.tempFiles
        })
        console.log('chose over  file paths:' + that.data.imageList1)
      },
      fail: function (res) {
        console.log('error')
      }
    })
  },
  previewImage1: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList1
    })
  },
  chooseImage2: function () {
    var that = this
    wx.chooseImage({
      sourceType: this.data.sourceType[this.data.sourceTypeIndex],
      sizeType: this.data.sizeType[this.data.sizeTypeIndex],
      count: 9,
      success: function (res) {
        console.log('chose over :' + res.tempFiles)
        that.setData({
          imageList2: res.tempFilePaths,
          fileList2: res.tempFiles
        })
        console.log('chose over  file paths:' + that.data.imageList2)
      },
      fail: function (res) {
        console.log('error')
      }
    })
  },
  previewImage2: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList2
    })
  },

  initServicsParamsData:function(res)
  {

    this.setData({ serviceItem: res });
  },
  chooseSericeItme:function(e)
  {
    var index = e.currentTarget.dataset.index;  //获取自定义的ID值  
    this.setData({
      id: index,
      // choseReason: this.data.reasonList[index]
    })
    console.log(this.data.id)

  },

  chooseLocation: function () {
    let that = this
    console.log('in chose adress')
    wx.chooseLocation({
      success: function (res) {
        // let addr = res.address
        // let provinceindex = addr.indexOf('省')
        // let province = addr.slice(0, provinceindex+1)
        // console.log(province)
        // let cityindex = addr.indexOf('市')
        // let city = addr.slice(provinceindex+1, cityindex+1)
        // console.log(city)
        // let districtindex = addr.indexOf('区')
        // let distric = addr.slice(cityindex+1, districtindex+1)
        // console.log(distric)
        that.setData({
          companyAddress: res.address,
          // residenceName: res.name,
          laitude: res.latitude,
          longitude: res.longitude,
          // companyInfo: tmp
        })
      }
    })
  },
})