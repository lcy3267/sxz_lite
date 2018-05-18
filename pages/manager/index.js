var _EnvData = require('../../utils/data.js');
const _function = require('../../utils/functionData.js');
var utils = require('../../utils/util.js')
let app = getApp()
var sliderWidth = 46; // 需要设置slider的宽度，用于计算中间位置
var pageno = 0
const initPageSize = 4
var pagesize = 4
var ALL_FLAG = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["新项目", "进行中", "已完成"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    IMG_FIX_URL: '?imageView2/1/w/120/h/120',
    manager: '/images/lingkefu.png',
    new: '/images/new.png',
    tuiguang: '/images/tuiguang.png',
    shezhi: '/images/shezhi.png',
    gongcheng: '/images/gongcheng.png',
    uesrinfo: {},
    projects: [],
    projectList: [],
    datalist: [],
    queryKey: '',
    queryValue: '',
    querySort: '',
    queryPageSize: 2
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          winWidth: res.windowWidth,
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    // wx.showNavigationBarLoading()

    wx.showLoading({
      title: '数据加载中...',
    })
    that.get_project(pageno, pagesize, '','','')

  },

  get_project: function (pageno, pagesize, sort, qrykey, qryvalue) {
    console.log('here get');
    var that = this;
    var url_string = _EnvData.SXZ_HOST_URL + 'project/member/' + app.globalData.MEM_ID
    //'project/customer/qry/' + app.globalData.COM_ID + '?pageNo=' + pageno + '&pageSize=' + pagesize + '&sort=' + sort + '&qryKey=' + qrykey + '&qryValue=' + qryvalue;
    wx.request({
      url: url_string,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        let newprojects = []
        if (res.data.success) {
          
          if (res.data.result.length < pagesize)
            ALL_FLAG = 'Y';
          if (res.data.result.length != 0) {
            for (let i = 0; i < res.data.result.length; i++) {
              // newprojects.push({
              //   id: res.data.result.content[i].id,
              //   stage: res.data.result.content[i].stage,
              //   projectName: utils.cutString(res.data.result.content[i].projectName, 30),
              //   pageViewCount: res.data.result.content[i].pageViewCount,
              //   commentCount: res.data.result.content[i].commentCount,
              //   prjlogCount: res.data.result.content[i].prjlogCount,
              //   // latestPrjlog: res.data.result.content[i].latestPrjlog,
              //   // fansList: res.data.result.content[i].fansList,
              //   createTime: res.data.result.content[i].createTime,
              //   content: res.data.result.content[i].content,
              //   // time: res.data.result.content[i].latestPrjlog.createTime
              // })
              let houseLayout = res.data.result[i].houseLayout;
              if (houseLayout.length==4)
              {
                let newhouseLayout = houseLayout.substr(0,1)+'室';
                newhouseLayout = newhouseLayout + houseLayout.substr(1, 1) + '厅';
                newhouseLayout = newhouseLayout + houseLayout.substr(2, 1) + '卫';
                newhouseLayout = newhouseLayout + houseLayout.substr(3, 1) + '阳台';
                res.data.result[i].houseLayout = newhouseLayout;
              }
            }
            that.setData({
              // projects: newprojects,
              projectList: res.data.result
            })
          }
          else if (res.data.result.length == 0 && pagesize == initPageSize) {
            that.setData({
              // projects: newprojects,
              projectList: res.data.result
            })
          }
        }
        
      },
      fail(res)
      {
        wx.showModal({
          title: '提示',
          content: "error:网络请求失败",
          showCancel: false
        }) 
      },
      complete()
      {
        wx.hideLoading();
      }

    })
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });

    var that = this

  
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
    var that = this
    that.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    console.log('in onReachBottom:' + ALL_FLAG)
    if (ALL_FLAG == 'Y') {
      console.log('all is showed.')
    }
    else {
      wx.showLoading({
        title: '数据加载中...',
      })
      pagesize = pagesize + that.data.queryPageSize
      that.get_project(pageno, pagesize, that.data.querySort, that.data.queryKey, that.data.queryValue);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
     
  },
  to_promotion:function(e)
  {
    console.log('dd' + e.currentTarget.dataset.pid)
    let that = this
    // 
    wx.showActionSheet({
      itemList: ['微信朋友/群全员推广', '朋友圈全员推广(小程序二维码)', '全民监工邀请卡(公众号二维码)','工程永久二维码(进入小程序)'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          console.log('in' + res.tapIndex)
          wx.navigateToMiniProgram({
            appId: 'wx4a7643da2e234afd',
            path: 'pages/videodetail/index?act=prmt&pid=' + e.currentTarget.dataset.pid,
            extraData: {
              mid: app.globalData.MEM_ID
            },
            envVersion: 'trial',
            success(res) {
              // 打开成功
              console.log('ok' +res)
            },
            fail(res)
            {
              console.log('fail:'+res)
            },
            complete(res)
            {
              console.log('complete:' + res)
            }
          })
        }
        if (res.tapIndex == 1) {

        }
        if (res.tapIndex == 2) {

        }
        if (res.tapIndex == 3) {

        }
        if (res.tapIndex == 4) {

        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  to_setting:function(e){
    console.log('dd' + e.currentTarget.dataset.index)
    let that = this
   wx.showActionSheet({
     itemList: ['公开','删除','修改'],
     success: function (res) {
       console.log(res.tapIndex)
       if (res.tapIndex==1)
       {
         if (app.globalData.MEM_ID != e.currentTarget.dataset.creater)
         {
           wx.showModal({
             title: '您没有权限',
             content:'工程创建者才可以删除.',
             showCancel:false
           })
         }
         else
         that.del_project(e.currentTarget.dataset.pid, e.currentTarget.dataset.index)
       }
       if (res.tapIndex == 0) {

       }
       if (res.tapIndex == 2) {

       }
     },
     fail: function (res) {
       console.log(res.errMsg)
     }
   })
  },
  del_project:function(pid,pindex)
  {
    let that = this
    _function.delProjectInfo(pid,that,function(res)
    {

      let tmp = that.data.projectList;
      tmp.splice(pindex,1)
      that.setData({
        projectList:tmp
      })
      wx.showToast({
        title: '删除成功',
      })
    })
  }
})