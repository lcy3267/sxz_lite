const _function = require('../../utils/functionData.js');
const _upload = require('../../utils/upload.js');
const _ = require('../../utils/underscore.js');
const _data = require('../../utils/data.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btn_value: '提交',
    logo: '/images/photo.png',
    projectInfo: {},
    imageList: [],
    fileList: [],
    fileNames: [],
    winWidth: 370,
    processList: [], processIndex:0,
    stageType: [], stageTypeIndex: 0,
    houseType: ['普通住宅', '别墅', '公寓', '其他'], houseTypeIndex: 0,
    styleType: ['现代', '中式', '欧式', '美式'], styleTypeIndex: 0,
    contractType: ['全包', '半包', '包工', '包设计'], contractTypeIndex: 0,
    Area1: 0, Area2: 0, Area3: 0, Area4: 0,
    addressDetail: "请通过地图选择地址",
    multiArray: [['0室', '1室', '2室', '3室', '4室', '5室', '6室'], ['0厅', '1厅', '2厅', '3厅', '4厅', '5厅', '6厅'], ['0卫','1卫', '2卫', '3卫', '4卫', '5卫', '6卫'], ['0阳台','1阳台', '2阳台', '3阳台', '4阳台', '5阳台', '6阳台']],
    multiIndex: [0, 0, 0, 0],
    laitude:22.62391,
    longitude:114.15454,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //初始枚举
    // _function.getParams(wx.getStorageSync("utoken"), wx.getStorageSync("companyId"), 'stage', that.initstageParamsData, that)

    _function.getParams(wx.getStorageSync("utoken"), wx.getStorageSync("companyId"), 'houseType', that.inithouseTypeParamsData, that)

    _function.getParams(wx.getStorageSync("utoken"), wx.getStorageSync("companyId"), 'style', that.initstyleTypeParamsData, that)

    _function.getParams(wx.getStorageSync("utoken"), wx.getStorageSync("companyId"), 'contractType', that.initcontractTypeParamsData, that);

    _function.getList(_data.sxz_url_prjPrc, '/bycom/'+wx.getStorageSync("companyId"), that, that.initProcessList);


    if (options.type == 'add') {
      wx.setNavigationBarTitle({
        title: '创建工程',
      })
    } else if (options.type == 'edit') {
      wx.setNavigationBarTitle({
        title: '修改工程',
      })
      this.setData({
        btn_value: '确认修改'
      })
    }
  },

  initProcessList: function (data) {

    // let str = "";
    // let data = this.data.processList;
    // for (var i = 0; i < data.length; i++) {
    //   if (i == 0) {
    //     str += data[i].prcessName
    //   }
    //   else {
    //     str += "," + data[i].prcessName
    //   }
    // }

    this.setData({
      processList: data,
      stageType: data[0].stageTypes
   });
  },

  processChange(e) {

    // let stageStr = "";
    // let data = this.data.processList[e.detail.value].stageTypes;
    // for (var i = 0; i < data.length; i++) {
    //     if (i == 0) {
    //       stageStr += data[i].stageName
    //     }
    //     else {
    //       stageStr += "," + data[i].stageName
    //     }
    //   }

    this.setData({
      processIndex: e.detail.value,
      stageType: this.data.processList[e.detail.value].stageTypes,
      stageTypeIndex:0
    });
  },

  //初始化枚举
  // initstageParamsData: function (data) {
  //   var stageStr = "";
  //   for (var i = 0; i < data.length; i++) {
  //     if (i == 0) {
  //       stageStr += data[i].text
  //     }
  //     else {
  //       stageStr += "," + data[i].text
  //     }
  //   }
  //   this.setData({ stageType: stageStr.split(',') });
  // },
  inithouseTypeParamsData: function (data) {
    var houseTypeStr = "";
    for (var i = 0; i < data.length; i++) {
      if (i == 0) {
        houseTypeStr += data[i].text
      }
      else {
        houseTypeStr += "," + data[i].text
      }
    }

    this.setData({ houseType: houseTypeStr.split(',') });
  },
  initstyleTypeParamsData: function (data) {
    var styleTypeStr = "";
    for (var i = 0; i < data.length; i++) {
      if (i == 0) {
        styleTypeStr += data[i].text
      }
      else {
        styleTypeStr += "," + data[i].text
      }
    }

    this.setData({ styleType: styleTypeStr.split(',') });
  },
  initcontractTypeParamsData: function (data) {
    var contractTypeStr = "";
    for (var i = 0; i < data.length; i++) {
      if (i == 0) {
        contractTypeStr += data[i].text
      }
      else {
        contractTypeStr += "," + data[i].text
      }
    }
    this.setData({ contractType: contractTypeStr.split(',') });
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
  stageTypeChange(e) {
    this.setData({
      stageTypeIndex: e.detail.value,
    });
  },
  houseTypeChange(e) {
    this.setData({
      houseTypeIndex: e.detail.value,
    });
  },
  styleTypeChange(e) {
    this.setData({
      styleTypeIndex: e.detail.value,
    });
  },
  contractTypeChange(e) {
    this.setData({
      contractTypeIndex: e.detail.value,
    });
  },
  /**
    * 开始提交审核
    */
  formSubmit: function (e) {

    var that = this
    let param = e.detail.value


    if (param.projectName == "") {
      this.showMsg("项目名称输入不能为空~");
      return;
    }

    if (that.addressDetail == "") {
      this.showMsg("地址输入不能为空！");
      return;
    }

    if (param.houseNumber == "") {
      this.showMsg("门牌号输入不能为空！");
      return;
    }

    if (param.Area1 == "" || param.Area2 == "" || param.Area3 == "" || param.Area4 == "") {
      this.showMsg("房型输入不能为空！");
      return;
    }

    if (param.decorationArea == "") {
      this.showMsg("建筑面积不能为空！");
      return;
    }

    if (param.decorationBudget == "") {
      this.showMsg("预算不能为空！");
      return;
    }

    wx.showLoading({
      title: '创建工地中',
      mask: true
    })

    if (that.data.imageList && that.data.imageList.length > 0) {

      _upload.uploadToCos(e, that.data.fileList, that, function (imgCosUrls) {
        console.log('well! get the cos url:' + imgCosUrls)

        let addr = that.data.addressDetail
        let provinceindex = addr.indexOf('省')
        let province = addr.slice(0, provinceindex + 1)
        console.log(province)
        let cityindex = addr.indexOf('市')
        let city = addr.slice(provinceindex + 1, cityindex + 1)
        console.log(city)
        let districtindex = addr.indexOf('区')
        let distric = addr.slice(cityindex + 1, districtindex + 1)
        console.log(distric)
        addr = addr.substr(provinceindex + 1)

        var datas = {
          form_id: e.detail.formId,
          companyId: wx.getStorageSync("companyId"),
          token: wx.getStorageSync("utoken"),
          createrId: app.globalData.MEM_ID,
          projectName: param.projectName,
          // stage: that.data.stageType[that.data.stageTypeIndex],
          stageSeqno: that.data.stageTypeIndex,
          processId: that.data.processList[that.data.processIndex].id,
          address: addr,
          residenceName: that.data.residenceName,
          laitude: that.data.laitude,
          longitude: that.data.longitude,
          provice: province,
          city:city,
          district: distric,
          houseNumber: param.houseNumber,
          houseType: that.data.houseType[that.data.houseTypeIndex],
          decorationArea: param.decorationArea,
          decorationStyle: that.data.styleType[that.data.styleTypeIndex],
          contractType: that.data.contractType[that.data.contractTypeIndex],
          decorationBudget: param.decorationBudget,
          houseLayout: (that.data.multiIndex[0]) + '' + (that.data.multiIndex[1]) + (that.data.multiIndex[2]) + (that.data.multiIndex[3]),
          projectImgurl: imgCosUrls[0],
          logType: "1",
          _: Date.now()
        }
        //console.log(datas)
        _function.addProjectInfo(datas, that.doProjectInfoData, this)

      })

    }
    else {
      this.showMsg("图片不能为空！");
      return;
    }


  },
  doProjectInfoData: function (data) {
    console.log(data);
    wx.hideLoading();
    if (data.id > 0) {
      wx.showModal({
        title: '提示',
        content: '操作成功！',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../pages/projectdetail/projectdetail?pid=' + data.id,
            })
          }
        }
      })
    }
  },
  chooseLocation: function () {
    var that = this
    console.log('in chose adress')
    // wx.chooseAddress({
    //   success: function (res) {
    //     console.log(res.userName)
    //     console.log(res.postalCode)
    //     console.log(res.provinceName)
    //     console.log(res.cityName)
    //     console.log(res.countyName)
    //     console.log(res.detailInfo)
    //     console.log(res.nationalCode)
    //     console.log(res.telNumber)
    //   }
    // })
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
          addressDetail: res.address,
          residenceName: res.name,
          laitude:res.latitude,
          longitude:res.longitude,
        })
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
  // onShareAppMessage: function () {

  // },
  bindHouseLayoutChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },

  formatAdress : function(address)
{
    let addr = res.address
    let provinceindex = addr.indexOf('省')
    let province = addr.substr(0,index)
    console.log(province)
    let cityindex = addr.indexOf('市')
    let city = addr.substr(provinceindex, cityindex)
    let districtindex = addr.indexOf('区')
    let distric = addr.substr(cityindex, districtindex)
}

})