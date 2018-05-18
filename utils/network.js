// var app = getApp();
var _EnvData = require('data.js');
function POST_REQ(url, params, res_func) {
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: app.globalData.BASE_URL + url,
      data: params,
      method: 'POST',
      header: { "Content-Type": "application/json" },
      // dataType: "json",
      success: function (res) {
        console.log('返回结果：')
        console.log(res.data)
        if (res.data.success) {
          console.log('post success')
          typeof res_func == "function" && res_func(res.data);
          // app.netWorkData.result = res.data
          resolve(res)
        }
      },
      fail: function () {
        reject('error')
      }
    })
  });
  return promise
}

function GET_REQ(url, params, res_func) {
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: _EnvData.SXZ_HOST_URL + url,
      data: params,
      method: 'GET',
      header: { "Content-Type": "application/json",
      dataType: "json",

      },
      success: function (res) {
        console.log('response:' + res.data)
        if (res.data.success)
        {
          console.log('get success')
          typeof res_func == "function" && res_func(res.data)
        }
        resolve(res)       
      },
      fail: function (res) {
        reject('error')
      }
    })
  });
  return promise
}

function REQUEST(app,reqtype, url, params, succ_func,fail_func) {
  // let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: _EnvData.SXZ_HOST_URL + url,
      data: params,
      method: reqtype,
      header: {
      "Content-Type": "application/json",
      'customerId': app.globalData.MEM_ID,
      'companyId': app.globalData.COM_ID,
      'AuthToken': app.globalData.token,
      },
      dataType: "json",
      success: function (res) {
        // console.log('response:' + res.data)
        if (res.data.success) {
          console.log('success!')
          typeof succ_func == "function" && succ_func(res.data)
        }
        else{
          let msg
          console.info('error http status:' + res.statusCode)
          typeof fail_func == "function" && fail_func(res)
          if (!fail_func)
          {
            if (res.statusCode!='200')
            {
              msg = res.data.status + ':' + res.data.message + ' path:' + res.data.path
            }
            else
            {
              msg = res.data.returnCode + ':' + res.data.returnMessage 
            }
            wx.showModal({
              title: '处理失败',
              content: msg,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('click ok')
                }
              }
            })
          }
        }
      },
      fail: function (res) {
        console.log(res)
        typeof fail_func == "function" && fail_func(res)
        wx.showModal({
          title: '出现异常，请稍后重试',
          content: res.errMsg,//.data.message + ':' + res.data.debugMessage,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('click ok')
            }
          }
        })
      }
    })
  
  // return promise
}

module.exports = {
  POST_REQ: POST_REQ,
  GET_REQ: GET_REQ,
  REQUEST: REQUEST
}