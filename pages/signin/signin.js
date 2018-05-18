var util = require('../../utils/util.js');
var _function = require('../../utils/functionData.js');
var data = require('../../utils/data.js');
const app = getApp();

Page({

  data: {
    latitude: 23.099994,
    longitude: 113.324520,
    clockType: 0,
  },

  onLoad: function (options) {
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      time: time
    });
    wx.getLocation({
      type: 'wgs84',
      success: (res)=> {
        var latitude = res.latitude;
        var longitude = res.longitude;
        util.showAddress(this, latitude, longitude, (address)=>{
          this.setData({latitude, longitude, address});
        })
      }
    })
  },

  onShow: function () {
  },

  radioChange: function(e){
    console.log(e,'==')
    this.setData({clockType: e.detail.value});
  },

  signIn: function(){
    const companyId = wx.getStorageSync('companyId');
    const MEM_ID = app.globalData.MEM_ID;
    const {latitude, longitude, clockType} = this.data;
    _function.sendRequest('POST',{
      clockType,
      companyId,
      memberId: app.globalData.MEM_ID,
      laitude: latitude,
      longitude
    }, `${data.SXZ_HOST_URL}/signin`, ()=>{
      wx.showToast({
        title: '签到成功',
        icon: 'success',
        duration: 2000
      })
    });
  }

})