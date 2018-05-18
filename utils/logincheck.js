module.exports = {
  check_login: function (app, pageObj, excuteFunc) {
    //保证获取cusId
    // var openid = '';
    wx.showLoading({
      title: '加载中...',
    })
    if (app.globalData.MEM_INFO) {
      console.log('已经登录，并正常获取到ID,mid OK=' + app.globalData.MEM_INFO.id)
      excuteFunc.apply(pageObj, [app.globalData.MEM_INFO]);
    } else {
      console.log('未登录，开始等待通知,memid=')
      app.openidCallback = openidCallback => {
        if (openidCallback) {
          console.log('等待到授权并登录成功，comid=:' + openidCallback.companyId)
          // app.globalData.MEM_INFO = openidCallback
          excuteFunc.apply(pageObj, [app.globalData.MEM_INFO]);
          console.log('excute after')
        }
      }
    }
  }
}