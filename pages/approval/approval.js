const _function = require('../../utils/functionData.js');
let app = getApp()
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
    PREVIEW_IMG_FIX: '?imageView2/1/w/150/h/150',
    tabs: ["播报审批", "项目审批"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    manager: '/images/lingkefu.png',
    new: '/images/new.png',
    tuiguang: '/images/tuiguang.png',
    shezhi: '/images/shezhi.png',
    gongcheng: '/images/gongcheng.png',
    uesrinfo: {},
    ProjectList: [],
    PjtLogList: [],
    winWidth3: 100
  },
  onLoad: function () {
    let that = this;
    wx.showLoading({
      title: '加装中...',
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          winWidth: res.windowWidth,
          winWidth3: (res.windowWidth - 60) / 3
        });
      }
    });

    _function.getPendingPrj(app.globalData.COM_ID, that, function (res) {
      that.setData({
        ProjectList: res,
      });
    });
    _function.getPendingPrjlog(app.globalData.COM_ID, that, function (res) {
      for (let i = 0; i < res.length; i++) {
        res[i].createTime = res[i].createTime.substr(5)

        let imgurlList = []
        if (res[i].imageNameList && res[i].imageNameList.length > 0) {
          for (let j = 0; j < res[i].imageNameList.length; j++) {
            imgurlList.push(_function.COS_IMAGE_BASE_URL + res[i].imageNameList[j])
          }
          res[i].imageNameList = imgurlList
        }
      }

      // 按项目归类
      let obj = {};
      res.map((d)=>{
        if(!obj[d.projectId]){
          obj[d.projectId] = {
            id: d.projectId,
            projectName: d.projectName,
            child: []
          };
        }
        obj[d.projectId].child.push(d);
      })

      var arr = []
      for (let i in obj) {
        arr.push(obj[i]); //属性
      }

      that.setData({
        PjtLogList: arr,
      });
      wx.hideLoading()
    });

  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  to_bobao: function () {

    wx.navigateTo({
      url: '../approvaldetail/index',
    })
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
    this.onLoad()
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
  // to_setting: function () {
  //   console.log('dd')
  //   wx.showActionSheet({
  //     itemList: ['公开', '删除', '修改'],
  //   })
  // },
  // refuse_project(e) {
  //   let that = this;
  //   let pid = e.currentTarget.dataset.pid;
  //   _function.approvePorject(pid, false, that, function (res) {
  //     wx.showToast({
  //       title: '拒绝成功',
  //     })
  //     let tmpList = that.data.ProjectList
  //     tmpList.splice(e.currentTarget.dataset.pindex, 1)
  //     that.setData({
  //       ProjectList: tmpList,
  //     });
  //   })
  // },

  
  do_approve(e) {
    // console.log('idnex'+e.currentTarget.dataset.pindex)
    let that = this;
    let rst = e.currentTarget.dataset.rst;
    let apprtype = e.currentTarget.dataset.atype;
    console.log(apprtype + '=' + rst + '=ind=' + e.currentTarget.dataset.pindex)
    let toastTitle, cfmcontent;
    if (rst=='1')
    {
    toastTitle = "审批通过成功";
    cfmcontent = "是否确认同意"
    }
    else{
      toastTitle = "审批拒绝成功";
      cfmcontent = "是否确定拒绝"
    }
    if (apprtype=='prj')
    {
      cfmcontent = cfmcontent + '新建工程?'
    }
    else if (apprtype == 'prjlog')
    {
      cfmcontent = cfmcontent + '发布播报?'
    }
    let pid = e.currentTarget.dataset.pid;
    wx.showModal({
      title: '确认',
      content: cfmcontent,
      showCancel:true,
      success:function(res)
      {
        if (res.confirm) {
          if (apprtype == 'prj') {
            _function.approvePorject(pid, rst, that, function (res) {
              wx.showToast({
                title: toastTitle,
              })
              let tmpList = that.data.ProjectList
              tmpList.splice(e.currentTarget.dataset.pindex, 1)
              that.setData({
                ProjectList: tmpList,
              });
            })
          }
          else if (apprtype == 'prjlog') {
            _function.approvePrjlog(pid, rst, that, function (res) {
              wx.showToast({
                title: toastTitle,
              })
              let tmpList = that.data.PjtLogList
              tmpList.splice(e.currentTarget.dataset.pindex, 1)
              that.setData({
                PjtLogList: tmpList,
              });
            })
          }
        }
      }
    })
    
  },

  // approve_prjlog(e) {
  //   let that = this;
  //   let pid = e.currentTarget.dataset.pid;
  //   console.log(e.currentTarget.dataset.pid)
  //   _function.approvePrjlog(pid, true, that, function (res) {
  //     wx.showToast({
  //       title: '审批通过成功',
  //     })
  //     let tmpList = that.data.PjtLogList
  //     tmpList.splice(e.currentTarget.pindex, 1)
  //     that.setData({
  //       PjtLogList: tmpList,
  //     });
  //   })
  // },
  previewImage: function (e) {
    // console.log(e.target.dataset.src)
    // console.log(e.target.dataset.list)
    var current = e.target.dataset.src
    let imglist = e.target.dataset.list
    wx.previewImage({
      current: current,
      urls: imglist
    })
  },

})