var _function = require('../../utils/functionData.js');
const _upload = require('../../utils/upload.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    imageList: [],
    fileList: [],
    fileNames: [],
    memberlist: {},

    contractType: ['全包', '半包'], contractTypeIndex: 0,
    // houseType: ['二房两厅', '三房两厅', '四房两厅'], houseTypeIndex: 0,
    decorationStyle: '',

    authoNickNameType: ['设计师', '木工'], authoNickNameTypeIndex: 0,

    projectList: {},
    projectType: ['工程一', '工程二'], projectTypeIndex: 0,
    multiArray: [[1, 2, 3, 4, 5, 6, 7], [1, 2, 3, 4, 5, 6, 7], [1, 2, 3, 4, 5, 6, 7], [1, 2, 3, 4, 5, 6, 7]],
    multiIndex: [0, 0, 0, 0],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //初始枚举
    _function.getParams(wx.getStorageSync("utoken"), wx.getStorageSync("companyId"), 'style', that.initParamsData, that)
    //初始化成员
    _function.getMemberList(wx.getStorageSync("utoken"), wx.getStorageSync("companyId"), that.initMemberListData, that)

    //初始化工程列表
    _function.getProjectList(wx.getStorageSync("utoken"), wx.getStorageSync("companyId"), that.initProjectData, that)
  },
  //初始化枚举
  initParamsData: function (data) {
    //console.log(data);
    this.setData({
      items: data,
    })
  },
  //初始化成员
  initMemberListData: function (data) {
    var authoNickName = "";
    for (var i = 0; i < data.length; i++) {
      if (i == 0) {
        authoNickName += data[i].nickName
      }
      else {
        authoNickName += "," + data[i].nickName
      }
    }
    this.setData({ memberlist: data, authoNickNameType: authoNickName.split(',') });
  },
  //初始化工程列表
  initProjectData: function (data) {
    var ProjectName = "";
    for (var i = 0; i < data.length; i++) {
      if (i == 0) {
        // ProjectName += data[i].projectName
        ProjectName = '无'
      }
      // else 
      {
        ProjectName += "," + data[i].projectName
      }
    }
    console.log(ProjectName)
    this.setData({ projectList: data, projectType: ProjectName.split(',') });
  },
  radioChange: function (e) {
    var that = this
    that.setData({
      value: e.detail.value
    })

    var items = this.data.items;
    var checkArr = e.detail.value;
    for (var i = 0; i < items.length; i++) {
      // if (checkArr.indexOf(i + "") != -1) {
      if (checkArr == i) {
        items[i].checked = true;
        this.setData({
          decorationStyle: items[i].text
        })
      } else {
        items[i].checked = false;
      }
    }
    this.setData({
      items: items
    })
  },
  deleteImg: function(e){
    const { index } = e.currentTarget.dataset;
    this.setData({
        imageList: this.data.imageList.filter((d , i)=> i!= index),
        fileList: this.data.fileList.filter((d , i)=> i != index),
    })
  },
  onAreaChange(e) {
    this.setData({
      contractTypeIndex: e.detail.value,
    });
  },
  houseTypehange(e) {
    this.setData({
      houseTypeIndex: e.detail.value,
    });
  },
  authoNickNameChange(e) {
    this.setData({
      authoNickNameTypeIndex: e.detail.value,
    });
  },
  projectChange(e) {
    this.setData({
      projectTypeIndex: e.detail.value,
    });
  },
  formSubmit: function (e) {
    var that = this
    let param = e.detail.value

    if (param.title == "") {
      this.showMsg("标题输入不能为空~");
      return;
    }

    if (param.description == "") {
      this.showMsg("描述信息输入不能为空！");
      return;
    }

    if (param.decorationBudget == "") {
      this.showMsg("装修单价输入不能为空！");
      return;
    }

    if (param.decorationArea == "") {
      this.showMsg("房屋面积输入不能为空！");
      return;
    }


    if (that.data.imageList && that.data.imageList.length > 0) {
      console.log(that.data.fileList);


      _upload.uploadToCos(e, that.data.fileList, that, function (imgCosUrls) {
        console.log('well! get the cos url:' + imgCosUrls)

        const photos = imgCosUrls.map((d, i)=>{
          return {
              photoImgurl: d,
              isFace: i==0
          }
        })

        var authoArvatarUrl = "";
        if (that.data.memberlist[that.data.authoNickNameTypeIndex].headImgurl != "") {
          authoArvatarUrl = that.data.memberlist[that.data.authoNickNameTypeIndex].headImgurl;
        }
        else {
          authoArvatarUrl = that.data.memberlist[that.data.authoNickNameTypeIndex].avatarUrl;
        }

        let pid = null;
        let pname=null;
        if (that.data.projectTypeIndex>=1)
          {
            pid=that.data.projectList[that.data.projectTypeIndex-1].id;
            pname = that.data.projectList[that.data.projectTypeIndex - 1].projectName; 
          }
        var datas = {
          form_id: e.detail.formId,
          companyId: wx.getStorageSync("companyId"),
          token: wx.getStorageSync("utoken"),
          caseType: 2,
          memberId: app.globalData.MEM_ID,
          show: true,
          title: param.title,
          description: param.description,
          decorationBudget: param.decorationBudget,
          decorationArea: param.decorationArea,
          decorationStyle: that.data.decorationStyle,
          // houseType: that.data.houseType[that.data.houseTypeIndex],
          houseLayout: that.data.multiArray[0][that.data.multiIndex[0]] + '' + that.data.multiArray[1][that.data.multiIndex[1]] + that.data.multiArray[2][that.data.multiIndex[2]] + that.data.multiArray[3][that.data.multiIndex[3]],
          contractType: that.data.contractType[that.data.contractTypeIndex],
          faceImgurl: imgCosUrls[0],
          authoArvatarUrl: authoArvatarUrl,
          authoNickName: that.data.memberlist[that.data.authoNickNameTypeIndex].nickName,
          author: that.data.memberlist[that.data.authoNickNameTypeIndex].id,
          projectId: pid,
          projectName: pname,
          photos,
          // projectId:6,
          _: Date.now()
        }
        //  console.log(datas)
        _function.addPromotionInfo(datas, that.doPromotionInfoData, this)

      })

    }
    else {
      this.showMsg("图片不能为空！");
      return;
    }

  },

  doPromotionInfoData: function (data) {
    if (data.caseId > 0) {
      wx.showModal({
        title: '提示',
        content: '发布成功！',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../pages/caselist/index'
            })
          }
        }
      })
    }
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
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      count: 9-that.data.imageList.length,
      success: function (res) {
          that.setData({
              imageList: [...that.data.imageList, ...res.tempFilePaths],
              fileList: [...that.data.fileList, ...res.tempFiles]
          })
      },
      fail: function (res) {
        console.log('error')
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
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})