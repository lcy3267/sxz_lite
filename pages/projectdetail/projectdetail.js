const network = require('../../utils/network.js');
var _EnvData = require('../../utils/data.js');
var _function = require('../../utils/functionData.js');
var app = getApp()
var initThumbupStrList = []
var changedThumbupStrList = []
var thumbupNameLists = []
var sliderWidth = 45; // 需要设置slider的宽度，用于计算中间位置
var pid = null
var action = null
var followStatus = null
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

  // inputValue: '',
  /**
   * 页面的初始数据
   */
  data: {
    gx: '/images/gx.png',
    tg: '/images/promotion_fill.png',
    windowWidth: 300,
    windowHeight: 500,
    IMG_BASE_URL: _EnvData.COS_IMAGE_BASE_URL,
    PREVIEW_IMG_FIX: '?imageView2/1/w/150/h/150',
    windowWidth: '',
    windowHeight: '',
    phone: '/imagefile/kefu.png',
    you: '/imagefile/you.png',
    zixun: '/imagefile/duihua.png',
    zan: '/imagefile/zan.png',
    zan_on: '/imagefile/zan_on.png',
    pl: '/imagefile/pl.png',
    pl_on: '/imagefile/pl_on.png',
    close: '/imagefile/close.png',
    gongdi: '/imagefile/gongdi.png',
    beijin: '/imagefile/bg.jpg',
    tabs: ["直播间", "装修小分队", "去点评"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    xiaoqu: '/imagefile/xiaoqu.png',
    projects: {},
    src: '',
    company: null, 
    projectmember: [],
    winWidth3: 0,
    previewImgurlList: [],
    imgurlList: [],
    pl_btn: true,
    zan_btn: true,
    thumbupStrList: [],
    thumbupShowFlags: [],
    thumbupIds: [],
    commentLists: [],
    title: '', adress: '', housetype: '', area: '', style: '',
    // customerId: app.globalData.CUS_ID,
    logid: 0, fan_on: true, new_fan_on: true,
    canvas_on: true,
    fansCount: 0,
    buttonShow: false,
    NO_USERINFO_MSG: null,
    company: null, remark: '',
    cachBackgrdImage: '',
    // memberId: app.globalData.MEM_ID,
    followList: [],
    marginleft: 1,
    prj_logs:[],
    MEM_INFO:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    followStatus = null;
    console.log('options:' + options)
    // console.log('nickName:'+app.globalData.userInfo.nickName)

    var that = this;
    // let systeminfo = app.globalData.systemInfo
    // wx.getSystemInfo({
    //   success: function (res) {
    //     that.setData({
    //       sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
    //       sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
    //       winWidth3: (res.windowWidth - 60) / 3
    //     });
    //   }
    // });
    that.setData({
      windowWidth: app.globalData.systemInfo.windowWidth,
      windowHeight: app.globalData.systemInfo.windowHeight,
      sliderLeft: (app.globalData.systemInfo.windowWidth / that.data.tabs.length - sliderWidth) / 2,
      sliderOffset: app.globalData.systemInfo.windowWidth / that.data.tabs.length * that.data.activeIndex,
      winWidth3: (app.globalData.systemInfo.windowWidth - 60) / 3,
      company: app.globalData.COM_BASE_INFO
    })
    // if (pid == null)
    pid = options.pid
    if (pid == null)
    { pid = '6' }
    console.log('start  =' + pid)

    wx.showLoading({
      title: '努力加载中...',
      mask: false,
    })

    //保证获取cusId
    // var openid = '';
    if (app.globalData.MEM_ID && app.globalData.MEM_ID != '' && app.globalData.MEM_ID > 0) {
      console.log('已经授权，并正常获取到CUSID,pid OK=' + pid)

      that.get_projectDetail()
    } else {
      console.log('未授权，开始等待通知,cusid=' + app.globalData.MEM_ID)
      app.openidCallback = openidCallback => {
        if (openidCallback != '') {
          console.log('等待到app初始化授权 id:' + openidCallback)
          // openid = openidCallback;
          // this.openid = openid;
          // app.globalData.MEM_ID = openidCallback
          // wx.navigateTo({
          //   url: '../videodetail/index?id=' + '6',
          // })
          // clearInterval(intv)
          that.get_projectDetail()

          console.log('in send req end')
        }
      }
    }

    console.info('first  over')


    // let tryNum = 0
    // let outFlag = false
    // let intv = setInterval(function () {

    //   console.info('触发循环内操作：' + app.globalData.CUS_ID)
    //   if (app.globalData.CUS_ID == 0 || outFlag) {
    //     console.info('等待到不授权的游客模式')
    //     that.setData({
    //       NO_USERINFO_MSG: app.globalData.NO_USERINFO_MSG
    //     })
    //     that.get_projectDetail()
    //     clearInterval(intv)
    //   }
    //   //当得到授权 且获取到cusid，此时应该有前面的触发，此处停止循环等待
    //   else if (app.globalData.CUS_ID > 0) {
    //     console.log('正常CUSID,停止循环')
    //     clearInterval(intv)
    //   }
    //   //异常情况
    //   else if (app.globalData.CUS_ID == -1) {
    //     console.log('cusid获取异常')
    //     tryNum = tryNum + 1
    //     app.getCusId()
    //   }
    //   else {
    //     console.info('等待用户决定是否授权')
    //   }
    //   console.log('trynum:' + tryNum)
    //   if (tryNum > 2) {
    //     console.error('后台无法获取cusid，已重试5次')
    //     outFlag = true
    //     // app.globalData.CUS_ID = 0 无效
    //     // clearInterval(intv)
    //   }
    // }, 2000)


    // // wx.setNavigationBarTitle({
    // //   title: options.title,
    // // })
    // wx.setStorageSync('pid', options.id)

   
    console.log('end load')
  },

  onShow: function () {

    console.log('onshow')

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady')
  },
  to_fansList: function (e) {
    console.log(e.currentTarget.dataset.list)
    wx.navigateTo({
      url: '../fans/index?list=' + JSON.stringify(e.currentTarget.dataset.list),
    })
  },
  
  to_subevaluate: function (e) {
    console.log(e.currentTarget.dataset.pid)
    console.log(e.currentTarget.dataset.pname)
    console.log(e.currentTarget.dataset.stage)
    wx.navigateTo({
      url: '../customerevaluate/index?pid=' + e.currentTarget.dataset.pid + '&pname=' + e.currentTarget.dataset.pname + '&stage=' + e.currentTarget.dataset.stage,
    })
  },

  tovideo: function () {
    wx.navigateTo({
      url: '../liangfang/index?type=yy',
    })
  },
  to_follow: function (e) {
    var that = this;
    let prjid
    let qrFollow
    if (e.currentTarget) {
      prjid = e.currentTarget.dataset.pid
    }
    //当是自动调用时
    else if (e) {
      prjid = e
      qrFollow = true
    }
    else {
      console.log('ERROR')
      reutrn
    }
    //游客模式弹出授权
    if (!app.globalData.CUS_ID || app.globalData.CUS_ID == 0 || app.globalData.CUS_ID == -1) {
      console.log('游客模式下走关注')
      //TODO
      that.getAuth(app, function () {
        console.log('cao!')
        // let that = this
        // console.log('wait 1.5s')
        that.follow_qrget()
        // setTimeout(that.follow_qrget(),1500)
      })
    }
    else {
      console.log('有授权后')
      if (qrFollow) {
        console.info('来自公众号的静默关注')
        that.follow_sub(prjid)
      }

      //点击按钮进来的
      else {
        //已关注公众号的 直接加关注
        if (app.globalData.REF_MPOPEN) {
          that.follow_sub(prjid)
        }
        else {
          that.follow_qrget(prjid)
        }
      }
    }

  },


  follow_qrget: function (prjid) {
    let that = this

    console.log('判断是否小程序内未完成关注=' + followStatus)
    if (followStatus < 3) {
      // 未做任何关注
      if (followStatus == 1) {
        that.follow_sub(prjid)
      }

      console.info('提示通过二维码关注')
      wx.showModal({
        content: "您还未关注装企秀服务号，无法收到工程最新消息，点击关注按钮去关注？",
        showCancel: true,
        confirmText: "关注",
        success: function (res_) {
          if (res_.confirm) {
            // wx.showLoading({
            //   title: '正在生成图片',
            //   mask: true,
            // })
            wx.getImageInfo({
              src: 'https://sxz-1255492784.image.myqcloud.com/fllowqr.png',
              success: function (sres2) {
                console.log('local follwrqr=' + sres2.path);
                wx.previewImage({
                  current: sres2.path,
                  urls: [sres2.path],
                  success: function (res) {
                    console.log('showed the followqr')
                    // wx.hideLoading()
                    wx.saveImageToPhotosAlbum({
                      filePath: sres2.path,
                      success: function (fres) {
                        console.log(fres);
                      }
                    })
                  }
                })

              }
            })
          }
          else {
            console.log('用户选择了不关注')
          }

        },
        fail: function () {
          console.log('erro showModal ')
        }
      })
    }
    else {
      wx.showToast({
        title: '    已关注！    ',
      })
    }
  },

  follow_sub: function (prjid) {
    let that = this
    let url = 'v1/fans/follow/' + app.globalData.COM_ID + '/' + prjid + '/' + app.globalData.CUS_ID
    let jsonData = {}
    network.REQUEST(app, 'GET', url, jsonData, function (res) {
      // console.log(res.status)
      console.log(res.result.avatarUrl)
      wx.showToast({
        title: '     关注成功！    ',
      })
      //todo refresh fanslist
      // let listTmp = that.data.projects.fansList
      // listTmp.push(fansList)
      followStatus = followStatus + 1
      let tmpflag
      if (app.globalData.REF_MPOPEN) {
        tmpflag = false
        followStatus = 3
      }
      else {
        tmpflag = true
      }
      that.setData({
        fan_on: tmpflag,
        new_fan_on: false,
        fan_on_avatarUrl: res.result.avatarUrl,
        fansCount: that.data.fansCount + 1
      })
    })
  },


  getAuth: function (app, getauthCallback) {
    let that = this
    wx.showModal({
      title: '用户未授权',
      content: '如需正常使用小程序功能，请按确定后在【设置-我的】页面中打开授权。本小程序不保存用户隐私信息。',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.openSetting({
            success: function (res) {
              if (res.authSetting["scope.userInfo"]) {
                console.log('成功打开授权')
                //重新获取一次
                wx.getUserInfo({
                  withCredentials: true,
                  success: function (res1) {
                    console.log("=============userInfo=================" + res1.userInfo.nickName)
                    console.log("=============userInfo=================" + res1.userInfo.unionId)
                    app.globalData.userInfo = res1.userInfo
                    app.getCusId()
                    app.globalData.NO_USERINFO_MSG = ''
                    that.setData({
                      NO_USERINFO_MSG: null,
                    })

                    let intv2 = setInterval(function () {
                      if (app.globalData.CUS_ID && app.globalData.CUS_ID != '' && app.globalData.CUS_ID > 0 && followStatus) {
                        clearInterval(intv2)
                        console.log('OK! app getcusid over=' + app.globalData.CUS_ID)
                        typeof getauthCallback == "function" && getauthCallback()

                      }
                      else {
                        console.log('继续等待app getcusid 和 获取是否已关注')
                      }
                    }, 1000)

                    //  if (app.globalData.CUS_ID && app.globalData.CUS_ID != '' && app.globalData.CUS_ID != 0) {
                    //    console.log('OK app getcusid over=' + app.globalData.CUS_ID)
                    //    callback(pid)
                    //  } else {
                    //    console.log('加一个监听等待')
                    //  app.openidCallback = openidCallback => {
                    //    if (openidCallback != '') {
                    //      console.log('等待到app初始化授权完成 id:' + openidCallback)
                    //      callback(pid)
                    //    }
                    //  }
                    //    setTimeout(function()
                    //    {
                    //      console.log('等待到?app cusid=' + app.globalData.CUS_ID)
                    //    }, 5000)
                    //  }
                  }
                })

              } // 如果成功打开授权
              else {
                console.log('用户依然拒绝授权')
                app.globalData.CUS_ID = 0
                let userinfo = { 'nickName': '游客', 'avatarUrl': '' }
                app.globalData.userInfo = userinfo
                app.globalData.NO_USERINFO_MSG = '游客模式中...请开启授权后使用完整功能'
              } // 如果用户依然拒绝授权
            },
            fail: function () { //调用失败，授权登录不成功
              // fail()
              app.globalData.CUS_ID = 0
              let userinfo = { 'nickName': '游客', 'avatarUrl': '' }
              app.globalData.userInfo = userinfo
              app.globalData.NO_USERINFO_MSG = '游客模式中...请开启授权后使用完整功能'
            }
          })
        }
        else {
          console.log('用户点击取消')
        }
      }
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  pl_submit: function (e) {
    var that = this;
    console.log('plid' + e.target.dataset.id)
    that.setData({
      pl_btn: false,
      logid: e.target.dataset.id,
      commontPlIndex: e.target.dataset.index
    })

  },
  pl_on_submit: function (e) {
    var that = this;
    that.setData({
      pl_btn: true,

    })

  },
  zan_submit: function (e) {
    console.log('in zan')
    var that = this;
    let index = e.currentTarget.dataset.index
    wx.request({
      url: _EnvData.SXZ_HOST_URL + 'projectlog/thumbup',
      data: {
        customerId: app.globalData.CUS_ID,
        projectlogId: e.currentTarget.dataset.plid,
        // id: e.currentTarget.dataset.pid
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        // console.log(res.data)
        if (res.data.success) {
          // var id=wx.getStorageSync('pid');
          let thumbupShowFlagTmp = that.data.thumbupShowFlags
          thumbupShowFlagTmp[index] = !thumbupShowFlagTmp[index]
          let thumbupStrTmp = that.data.thumbupStrList
          console.log('init:' + thumbupNameLists[index])
          let tmpList = thumbupNameLists[index]
          tmpList.push(app.globalData.userInfo.nickName)
          thumbupStrTmp[index] = tmpList.join(',')
          thumbupNameLists[index] = tmpList
          console.log('changed:' + thumbupNameLists[index])
          let tempids = that.data.thumbupIds
          tempids[index] = res.data.result.id
          that.setData({
            thumbupStrList: thumbupStrTmp,
            thumbupShowFlags: thumbupShowFlagTmp,
            thumbupIds: tempids
            // changedThumbupStrList = []
          })
        }
      }
    })
  },
  zan_on_submit: function (e) {
    console.log('in zan_on')
    var that = this;

    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    console.log('index:' + index)
    wx.request({
      url: _EnvData.SXZ_HOST_URL + 'projectlog/thumbup/' + id,
      header: {
        'content-type': 'application/json'
      },

      header: {
        'content-type': 'application/json'
      },
      method: 'DELETE',
      success: function (res) {
        console.log(res.data)
        if (res.data.success) {
          let thumbupShowFlagTmp = that.data.thumbupShowFlags
          thumbupShowFlagTmp[index] = !thumbupShowFlagTmp[index]
          let thumbupStrTmp = that.data.thumbupStrList
          let nameListTmp = thumbupNameLists[index]
          console.info('init:' + nameListTmp)
          let indTmp = nameListTmp.indexOf(app.globalData.userInfo.nickName)
          console.log('str index=' + indTmp)
          nameListTmp.splice(indTmp, 1)
          thumbupNameLists[index] = nameListTmp
          console.info('change:' + nameListTmp)
          if (nameListTmp.length == 0) {
            thumbupStrTmp[index] = '暂时还没有人'
          }
          else {
            thumbupStrTmp[index] = nameListTmp.join(',')
          }
          // thumbupStrTmp[index] = changedThumbupStrList[index]
          that.setData({
            thumbupStrList: thumbupStrTmp,
            thumbupShowFlags: thumbupShowFlagTmp
            // changedThumbupStrList = []
          })
        }
      }
    })
  },
  to_close: function () {
    var that = this;
    that.setData({
      pl_btn: true
    })
  },
  sub_pl: function (e) {

    let remark = e.detail.value.remark
    let id = e.detail.target.dataset.id
    let index = e.detail.target.dataset.index
    console.log(id + " __  " + index)
    if (remark == '') {
      wx.showModal({
        title: '提示',
        content: '评论内容未填写',
        showCancel: false
      })
      return false;
    }

    var that = this;
    wx.request({
      url: _EnvData.SXZ_HOST_URL + 'comment',
      data: {
        commentText: remark,
        customerId: app.globalData.MEM_ID,
        nickName: app.globalData.MEM_INFO.name,
        projectlogId: id,
        role: app.globalData.MEM_INFO.role,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        if (res.data.success) {
        
          let listtmp = that.data.commentLists
          let tmp = listtmp[index]
          tmp.push(res.data.result)
          listtmp[index] = tmp
          that.setData({
            pl_btn: true,
            commentLists: listtmp,
            remark: ''
          })
          wx.showToast({
            title: '提交成功',
          })
        }
      }
    })
  },
  dalete_pl: function (e) {
    var that = this;

    let index = e.currentTarget.dataset.index
    let indexson = e.currentTarget.dataset.indexson
    console.log(index + '--' + indexson)

    wx.showModal({
      content: "确定要删除吗",
      showCancel: true,
      confirmText: "确定",
      success: function (res_) {
        if (res_.confirm) {
          //  console.log('用户点击确定')
          let url = 'comment/' + e.currentTarget.dataset.id
          let jsonData = {}

          network.REQUEST(app, 'DELETE', url, jsonData, function (res) {
            let tmplist = that.data.commentLists
            let tmp = tmplist[index]
            tmp.splice(indexson, 1)
            tmplist[index] = tmp
            that.setData({
              commentLists: tmplist
            })
          })
        }
      },
      fail: function () {

      }
    })
  },
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },


  to_company: function () {
    wx.switchTab({
      url: '../index/index?id=' + app.globalData.COM_ID,
    })
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
    let tmp={
      pid:pid,
    }
    this.onLoad(tmp)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('bottom')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log('in button' + res.target)
    }
    // var pid =wx.getStorageSync('pid')
    console.log('pid' + pid)
    return {
      title: '邀请您关注工地',
      path: '/pages/videodetail/index?act=f&pid=' + pid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  bindInputBlur: function (e) {
    this.inputValue = e.detail.value
  },
  bindButtonTap: function () { //视频下载
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: ['front', 'back'],
      success: function (res) {
        that.setData({
          src: res.tempFilePath
        })
      }
    })
  },
  bindSendDanmu: function () {
    this.videoContext.sendDanmu({
      text: this.inputValue,
      color: getRandomColor()
    })
  },
  videoErrorCallback: function (e) {
    console.log('视频错误信息:');
    console.log(e.detail.errMsg);
  },

  to_index: function (e) {
    console.log('to index')
    wx.navigateTo({
      url: '../index/index',
    })
  },

  //sean start
  get_projectDetail: function () {
    let that = this

    // //先执行关注操作
    // if (action == 'f') {
    //   that.to_follow(pid)
    // }

    // if (app.globalData.CUS_ID > 0) {
    //   //验证是否关注
    //   wx.request({
    //     url: _EnvData.SXZ_HOST_URL + 'v1/fans/isfollowed/' + pid + '/' + app.globalData.CUS_ID,
    //     header: {
    //       'content-type': 'application/json'
    //     },
    //     method: 'GET',
    //     success: function (res) {
    //       console.log(res.data.result)
    //       if (res.data.result > 2) {
    //         console.log('判断关注完成 ，为已关注')
    //         that.setData({
    //           fan_on: false
    //         })
    //       }
    //       else {
    //         console.log('判断关注完成 ，为未关注')
    //       }
    //       followStatus = res.data.result;
    //     }
    //   })
    // }
    // else {
    //   that.setData({
    //     fan_on: true
    //   })
    // }
    //获取工程参与成员
    wx.request({
      url: _EnvData.SXZ_HOST_URL + 'projectmember/project/' + pid,
      header: {
        'content-type': 'application/json' // 
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data.result)
        that.setData({
          projectmember: res.data.result
        })
      }
    })

    //获取当前工程
    wx.request({
      url: _EnvData.SXZ_HOST_URL + 'project/' + pid,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data.result)
        var datas = res.data.result
        // that.setData({
        //   projects: res.data.result,
        // })
        let thumbupShowFlags = []
        let thumbupIds = []
        let commentLists = []
        let prj_logs = datas.prjlogs
        for (let i = 0; i < prj_logs.length; i++) {
          //传图片名称的改造
          let ilistTmp = prj_logs[i].imageNameList
          let imgurlList = []
          // let preimgurlList = []
          if (ilistTmp && ilistTmp.length > 0) {
            for (let j = 0; j < ilistTmp.length; j++) {
              imgurlList.push(_EnvData.COS_IMAGE_BASE_URL + ilistTmp[j])
              // preimgurlList
            }
            prj_logs[i].imageNameList = imgurlList
          }
          //end


          commentLists[i] = datas.prjlogs[i].commentList
          // console.log('commentLists:'+ i + '=' + datas.prjlogs[i].commentList.length)
          thumbupIds[i] = ''
          thumbupShowFlags[i] = true
          // thumbupNameLists[i] = datas.prjlogs[i].thumbupNickNames
          // if (datas.prjlogs[i].thumbupList.length == 0) {
          //   //还没赞 可以去赞
          //   initThumbupStrList[i] = null//'暂时还没有人'
          //   changedThumbupStrList[i] = app.globalData.userInfo.nickName

          // }
          // else {

          //   initThumbupStrList[i] = datas.prjlogs[i].thumbupNickNames.join(",") + ' 等'

          //   for (let j = 0; j < datas.prjlogs[i].thumbupList.length; j++) {
          //     if (datas.prjlogs[i].thumbupList[j].customerId == app.globalData.CUS_ID) {
          //       thumbupShowFlags[i] = false
          //       thumbupIds[i] = datas.prjlogs[i].thumbupList[j].id
          //       break
          //     }
          //   }
          //   if (thumbupShowFlags[i]) {
          //     changedThumbupStrList[i] = initThumbupStrList[i] + ',' + app.globalData.userInfo.nickName
          //   }
          //   else {
          //     changedThumbupStrList[i] = initThumbupStrList[i].replace(app.globalData.userInfo.nickName, '').replace(',,', ',')
          //   }

          // }
        }
        let pfans = datas.fansList
        let marginleft = that.data.windowWidth - 85
        let tmp = parseInt((marginleft - 20) / 38) - 1
        if (pfans && pfans.length >tmp)
        {
          pfans = pfans.slice(0, tmp)
        }
        // if (pfans.length>6)
        // {
        //   marginleft = 0 - parseInt((pfans.length - 6) * 38 / pfans.length)
        // }
        let houseLayout = res.data.result.houseLayout;
        if (houseLayout.length==4)
        {
        let newhouseLayout = houseLayout.substr(0, 1) + '室';
        newhouseLayout = newhouseLayout + houseLayout.substr(1, 1) + '厅';
        newhouseLayout = newhouseLayout + houseLayout.substr(2, 1) + '卫';
        newhouseLayout = newhouseLayout + houseLayout.substr(3, 1) + '阳台';
        res.data.result.houseLayout = newhouseLayout;
        }

        that.setData({
          company: app.globalData.COM_BASE_INFO,
          projects: res.data.result,
          // previewImgurlList: list,
          fansCount: res.data.result.fansCount,
          thumbupStrList: initThumbupStrList,
          thumbupShowFlags: thumbupShowFlags,
          // changedThumbupStrList: changedThumbupStrList,
          thumbupIds: thumbupIds,
          commentLists: commentLists,
          followList: pfans,
          marginleft: tmp,
          prj_logs: prj_logs,
          MEM_INFO: app.globalData.MEM_INFO,
        })
        wx.setNavigationBarTitle({
          title: res.data.result.projectName,
        })
      wx.hideLoading()
      }
    });

   
    
  },

  //邀请围观二维码生成
  handleConfirm: function (e) {
    wx.showLoading({
      title: '正在生成图片',
      mask: true,
    })
    // this.showCanvas()

    // wx.hideLoading()
    this.drawQr(e.currentTarget.dataset.id, 'f')
    // .then((res) => {
    console.log('In then.hideload:' + e.currentTarget.dataset.id)

    //   that.setData({
    //     canvas_on: true
    //   })
    // }).catch(err => {
    //   console.log(err)
    //   wx.hideLoading()
    // })
  },

  drawQr: function (pid, actTyp) {
    var that = this
    that.setData({
      canvas_on: false
    })

    let mid
    if (actTyp == 'f') {
      mid = app.globalData.MEM_ID
    }
    else {
      mid = null
    }
    //获取二维码
    wx.request({
      url: _EnvData.SXZ_HOST_URL + 'netpmt',
      data: {
        memberId: mid,
        companyId: app.globalData.COM_ID,
        projectId: pid,
        promotionType: 1,
        authorType: 0
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        if (res.data.success) {

          var qrpath = null
          wx.getImageInfo({
            src: 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + res.data.result.qrcodeTicket,
            success: function (sres) {
              // console.log('qrpath')
              qrpath = sres.path
              console.log('qrpath=' + qrpath);

              wx.getImageInfo({
                src: 'https://sxz-1255492784.image.myqcloud.com/20180323pg.png',
                success: function (sres2) {
                  console.log('localqr=' + sres2.path);
                  const ctx = wx.createCanvasContext('shareCanvas')

                  // 底图that.data.cachBackgrdImage
                  ctx.drawImage(sres2.path, 0, 0, 320, 471)
                  // ctx.stroke()
                  // ctx.draw()
                  console.log('in 1 callback')
                  // 作者名称
                  //ctx.setTextAlign('center')    // 文字居中
                  ctx.setFillStyle('#000000')  // 文字颜色：黑色
                  ctx.setFontSize(22)         // 文字字号：22px

                  ctx.fillText('微信扫描二维码关注工程：', 40, 200)
                  // ctx.draw()
                  ctx.setFontSize(14)
                  ctx.fillText('(长按图片发送给朋友)', 40, 220)
                  // ctx.draw()
                  ctx.setFillStyle('#FFFFFF')  // 文字颜色：黑色
                  ctx.setFontSize(20)         // 文字字号：22px
                  // ctx.setTextAlign('center')
                  ctx.fillText(app.globalData.userInfo.nickName + ' 邀您一起来监工！', 10, 90)
                  // ctx.draw()
                  // ctx.draw(true)
                  console.log('in 2callback')

                  // 小程序码
                  const qrImgSize = 170
                  ctx.drawImage(qrpath, 105, 260, qrImgSize, qrImgSize)
                  ctx.stroke()
                  ctx.draw(true, setTimeout(function callback(res) {
                    console.log('in draw...')
                    wx.canvasToTempFilePath({
                      canvasId: 'shareCanvas',
                      // destWidth: 320,
                      // destHeight: 471,
                      quality: 1,
                      success: function (res) {
                        console.log('生成：' + res.tempFilePath);
                        wx.previewImage({
                          current: res.tempFilePath,
                          urls: [res.tempFilePath],
                          success: function (res) {
                            //  that.setData({
                            //    canvas_on: true
                            //  })
                            console.log('showed the qr')
                            wx.hideLoading()
                          }
                        })

                        // wx.saveImageToPhotosAlbum({
                        //   filePath: rtpath.tempFilePath,
                        //   success: function (fres) {
                        //     console.log(fres);
                        //   }
                        // })
                      },
                      fail(res) {
                        console.log('draw fail')
                      }

                    })

                  }, 1000
                  )
                  )
                }

              })
            }
          })
        }
      }
    })
  },

  previewVr :function(e)
  {
    let that = this
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        if (res.networkType != 'wifi') {
          that.tipForVr()
        }
        else {
          wx.navigateTo({
            url: '../webview/index?url=https://www.sxzhuang.cn/sxz/vr?imgName=' + e.target.dataset.src,
          })
        }
      },
      fail: function (res) {
        that.tipForVr()
      }
    })
  },



    tipForVr: function() {
    wx.showModal({
      title: '省心装全景展示',
      content: '即将进入全景展示，将消耗约13M左右流量，请问是否继续？',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../webview/index?url=https://www.sxzhuang.cn/sxz/vr?imgName=' + e.target.dataset.src,
          })
        }
      }
    })
  },
  add_mem_own:function()
  {

  },
  to_memberDetail : function(e)
  {
    console.log(e.currentTarget.dataset.role)
    if (e.currentTarget.dataset.role!='业主')
    {
      wx.navigateTo({
        url: '../teamdetail/index?mid=' + e.currentTarget.dataset.mid + '&mname=' + e.currentTarget.dataset.mname
      })
    }
    
  },
  to_delete_prjlog: function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定要删除该条播报吗?',
      success: function (res) {
        if (res.confirm) {
          _function.delPrjlog(id, that,function()
          {
            let tmp = that.data.prj_logs
            tmp.splice(index,1)
            that.setData(
            {
              prj_logs: tmp,
              })
          })
        }
      },
    })
  },
  to_top_prjlog: function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let { prj_logs } = that.data
    const obj = prj_logs[index];

    wx.showModal({
      title: '提示',
      content: `确定要${obj.topFlag?'取消置顶':'置顶'}该条播报吗?`,
      success: function (res) {
        if (res.confirm) {
          _function.topPrjlog(id, !obj.topFlag, that,function()
          {
            wx.showToast({
              title: '操作成功',
              icon: 'success',
              duration: 2000
            })
            that.get_projectDetail();
            // obj.topFlag = true;
            // prj_logs.splice(index,1)
            // prj_logs.unshift(obj);            
            // that.setData({ prj_logs });
          })
        }
      },
    })
  },
  to_delete_team : function(e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let name = e.currentTarget.dataset.name;
    let cont = '确定要从装修队移除[' + name+']吗？'
    wx.showModal({
      title: '提示',
      content: cont,
      success: function (res) {
        if (res.confirm) {
          _function.delPrjmem(id, that, function () {
            let tmp = that.data.projectmember
            tmp.splice(index, 1)
            that.setData(
              {
                projectmember: tmp,
              })
          })
        }
      },
    })
  },
})