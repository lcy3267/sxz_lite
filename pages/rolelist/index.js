var _function = require('../../utils/functionData.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mid:'',
    MemberInfo:{},
    showDialog: false,
    showDialogRight: false,
    items: [],
    role:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var role = options.role;
    let mid = options.mid;
    console.log('mid'+mid)
    if (role)
    {
    that.setData({
      role: role,
      mid:mid
    })
    }

    //初始成员资料
    // _function.getMemberInfo(wx.getStorageSync("utoken"), m_id, that.initMemberInfoData, this)

    //初始枚举
    _function.getParams(wx.getStorageSync("utoken"), wx.getStorageSync("companyId"), 'role', that.initParamsData, this)

    
  },
  initParamsData: function (data) {
    var inititems = data;
    // inititems.splice(0,1)
    for (var i = 0; i < inititems.length; i++) {
      if (inititems[i].text == this.data.role) {
        inititems[i].checked = true;
      } else {
        inititems[i].checked = false;
      }    
    }
    this.setData({
      items: inititems,
      // role: this.data.MemberInfo.role
    })
  },


  initMemberInfoData: function (data) {
    this.setData({ MemberInfo: data })
  },


  radioChange: function (e) {
    var that = this
    that.setData({
      value: e.detail.value
    })

    var items = this.data.items;
    var checkArr = e.detail.value;

    for (var i = 0; i < items.length; i++) {
      //if (checkArr.indexOf(i + "") != -1) {
      if (checkArr == i) {
        items[i].checked = true; 
        this.setData({
          role: items[i].text
        })
      } else {
        items[i].checked = false;
      }
    }
    this.setData({
      items: items
    })
  },
  /**
  checkChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e)
    var that = this
    that.setData({
      value: e.detail.value
    })
    console.log(this.data.value)
    var items = this.data.items;
    console.log(this.data.items)
    var checkArr = e.detail.value;
    console.log(e.detail.value)

    for (var i = 0; i < items.length; i++) {
      if (checkArr.indexOf(i + "") != -1) {
        items[i].checked = true;
      } else {
        items[i].checked = false;
      }
    }
    this.setData({
      items: items
    })
  },
 */
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

  //确认  修改手机号
  confirmrole: function () {
    var that = this   
   // console.log(that.data.role);   
    var data = {
      token: wx.getStorageSync("utoken"),
      companyId: wx.getStorageSync("companyId"),
      id: that.data.mid,
      role: that.data.role,
      _: Date.now()
    };

    _function.updateMemberInfo(data, that.data.mid, that.initupdateMemberInfoData, this)
  },
  initupdateMemberInfoData: function (data) {
    var that = this 
    if (data.status == 0) {
      wx.showModal({
        title: '提示',
        content: '修改成功！',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '../addpersonal/index?mid=' + that.data.mid
            })
          }
        }
      })
    }

  },
})