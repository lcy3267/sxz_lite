var sourceType = [['camera'], ['album'], ['camera', 'album']]
var sizeType = [['compressed'], ['original'], ['compressed', 'original']]

var app = getApp();
Page({
  data: {
    imageList: [],
    sourceTypeIndex: 2,
    sourceType: ['拍照', '相册', '拍照或相册'],

    sizeTypeIndex: 2,
    sizeType: ['压缩', '原图', '压缩或原图'],

    countIndex: 8,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    weizhi: false,
    weizhishow: false,
    onloction: '',
    checkedvalue: '',
    z: '',
    Name: '',
    AvatarUrl: '', imagepath: ''
  },


  checkloction: function () {
    var loc = this;
    wx.chooseLocation({
      success: function (res) {
        loc.setData({
          onloction: res.address,
          weizhishow: true,
          checkedvalue: 'checked',
        });

      },
    })
  },

  sourceTypeChange: function (e) {
    this.setData({
      sourceTypeIndex: e.detail.value
    })
  },
  sizeTypeChange: function (e) {
    this.setData({
      sizeTypeIndex: e.detail.value
    })
  },
  countChange: function (e) {
    this.setData({
      countIndex: e.detail.value
    })
  },

  previewImage: function (e) {
    var current = e.target.dataset.src

    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  chooseImage: function () {
    var that = this
    var img = this;
    wx.chooseImage({
      sourceType: sourceType[this.data.sourceTypeIndex],
      sizeType: sizeType[this.data.sizeTypeIndex],
      count: this.data.count[this.data.countIndex],
      success: function (res) {
        console.log(res)
        that.setData({
          imageList: res.tempFilePaths
        });
        wx.uploadFile({
          url: 'https://small.jinbinghulian.com/api/Talk/UploadImg',
          filePath: res.tempFilePaths[0],
          name: 'file',
          header: {
            'content-type': 'multipart/form-data'
          },
          success: function (p) {
            console.log(p.data)
            //do something
            img.setData({
              imagepath: p.data
            })
          }
        })
      }
    })
  },
  showTopTips: function (e) {
    var img = this;
    wx.login({
      success: function (res) {
        console.log(res.code);
        var code = res.code;

        wx.request({
          url: "https://small.jinbinghulian.com/api/Books/GetAuth?code=" + code,
          method: 'GET',
          success: function (eg) {
            console.log("push ok");
            console.log(eg);
            console.log(eg.data.Openid);
            console.log(e.detail.value.Contents);
            if (eg.data.Id != "0") {
              var imgpathstring = e.currentTarget.dataset.path;
              console.log(imgpathstring);
              var model = {
                Name: eg.data.Name,
                AvatarUrl: eg.data.AvatarUrl,
                ImageUrl: imgpathstring,
                Openid: eg.data.Openid,
                Contents: e.detail.value.Contents,
                Loction: e.currentTarget.dataset.loc,
              };
              console.log(model);
              if (e.detail.value.Contents == "") {
                wx.showModal({
                  showCancel: false,
                  content: '说说内容不能为空哦',
                  confirmText: "确定"
                })
                return false;
              }
              console.log(model);
              wx.request({
                url: 'https://small.jinbinghulian.com/api/Talk/AddTalk?model=' + JSON.stringify(model),
                method: 'POST',
                header: {
                  'Content-Type': 'application/json'
                },
                success: function (ss) {
                  console.log(ss.data);
                  if (ss.data) {
                    wx.navigateTo({
                      url: '../succeful/index',
                    })
                  }
                },
              });

            }
            else {
              wx.showModal({
                content: '抱歉！你还没有校脉名片，暂不能用该功能',
                confirmText: "去创建",
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.navigateTo({
                      url: '../edituser/index',
                    })

                  } else if (res.cancel) {
                    console.log('用户点击取消')
                    return false;
                  }
                }
              });
            }

          },
          fail: function (err) {
            // fail  
            console.log("push err")
            console.log(err);
          }
        });
      }
    });


  }
})










