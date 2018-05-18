const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function cutString(str, len) {
  if (!str)
  { return '' } 
  //length属性读出来的汉字长度为1 
  if (str.length * 2 <= len) {
    return str;
  }
  var strlen = 0;
  var s = "";
  for (var i = 0; i < str.length; i++) {
    s = s + str.charAt(i);
    if (str.charCodeAt(i) > 128) {
      strlen = strlen + 2;
      if (strlen >= len) {
        return s.substring(0, s.length - 1) + "...";
      }
    } else {
      strlen = strlen + 1;
      if (strlen >= len) {
        return s.substring(0, s.length - 2) + "...";
      }
    }
  }
  return s;
}

//JavaScript函数,格式时间 
var minute = 1000 * 60;
var hour = minute * 60;
var day = hour * 24;
var halfamonth = day * 15;
var month = day * 30;
function getDateDiff(dateTimeStamp) {
  var now = new Date().getTime();
  var diffValue = now - dateTimeStamp;
  if (diffValue < 0) {
    //若日期不符则弹出窗口告之 
    //alert("结束日期不能小于开始日期！"); 
  }
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  if (monthC >= 1) {
    result = "发表于" + parseInt(monthC) + "个月前";
  }
  else if (weekC >= 1) {
    result = "发表于" + parseInt(weekC) + "周前";
  }
  else if (dayC >= 1) {
    result = "发表于" + parseInt(dayC) + "天前";
  }
  else if (hourC >= 1) {
    result = "发表于" + parseInt(hourC) + "个小时前";
  }
  else if (minC >= 1) {
    result = "发表于" + parseInt(minC) + "分钟前";
  } else
    result = "刚刚发表";
  return result;
} 

//js函数代码：字符串转换为时间戳 
function getDateTimeStamp(dateStr) {
  return Date.parse(dateStr.replace(/-/gi, "/"));
} 

// 腾讯地图逆向解析地址
function showAddress(pageObj, latitude, longitude, callback) {
  var that = pageObj;
  var qqMapApi = 'http://apis.map.qq.com/ws/geocoder/v1/' + "?location=" + latitude + ',' +
    longitude + "&key=" + 'WLEBZ-HBYW3-HNP3V-YUDAE-HEXRO-NMBVB' + "&get_poi=1";
  wx.request({
    url: qqMapApi,
    data: {},
    method: 'GET',
    success: (res) => {
      console.log(res)
      if (res.statusCode == 200 && res.data.status == 0) {
        console.log('Get address:' + res.data.result.address)
        let addr = res.data.result.address.substr(0, 100)
        that.setData({
          nowWhere: addr,
        });
        wx.setStorageSync('mapAddress', addr);
        // typeof cb == "function" && cb(that.globalData.CUS_ID)
        typeof callback == "function" && callback.apply(that, [addr])
      }
    },
    fail: (res) => {
      console.log('error:' + res)
    }
  })
}

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET") {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer' + wx.getStorageSync("utoken")
      },
      success: function (res) {
        if (res.data.returnCode == '000000') {
          resolve(res.data.result);
        } else {
          reject(res.errMsg);
        }
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}

function prompt(msg, icon = 'none'){
  wx.showToast({
    title: msg,
    icon,
    duration: 2000
  })
}

module.exports = {
  prompt,
  request,
  showAddress,
  formatTime: formatTime,
  cutString: cutString,
  getDateDiff: getDateDiff
}
