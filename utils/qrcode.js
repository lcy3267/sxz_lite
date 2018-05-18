module.exports = {

  genarateQrImage: function (pageObj, canvasid,bgImgUrl, qrcodeUrl,text1,text2,text3,text4) {

    pageObj.setData({
      canvas_on: false
    })
    let qrpath = null
    wx.getImageInfo({
      src: qrcodeUrl,
      success: function (sres) {
        // console.log('qrpath')
        qrpath = sres.path
        console.log('qrpath=' + qrpath);

        wx.getImageInfo({
          src: bgImgUrl,//'https://sxz-1255492784.image.myqcloud.com/20180323pg.png',
          success: function (sres2) {
            console.log('localqr=' + sres2.path);
            const ctx = wx.createCanvasContext(canvasid)

            // 底图that.data.cachBackgrdImage
            ctx.drawImage(sres2.path, 0, 0, 320, 471)
            console.log('in 1 callback')
            ctx.setFillStyle('#000000')  // 文字颜色：黑色
            ctx.setFontSize(17)         // 文字字号：22px

            ctx.fillText(text2, 15, 200)
            // ctx.draw()
            ctx.setFillStyle('#404040')
            ctx.setFontSize(12)
            ctx.fillText(text3, 86, 30)
            // ctx.draw()
            ctx.setFillStyle('#FFFFFF')  // 文字颜色：黑色
            ctx.setFontSize(20)         // 文字字号：22px
            // ctx.setTextAlign('center')
            ctx.fillText(text1, 10, 90)
            ctx.setFillStyle('#FFFFFF')  // 文字颜色：黑色
            ctx.setFontSize(16)         // 文字字号：22px
            // ctx.setTextAlign('center')
            ctx.fillText(text4, 10, 130)
            console.log('in 2callback')

            // 小程序码
            const qrImgSize = 170
            ctx.drawImage(qrpath, 105, 260, qrImgSize, qrImgSize)
            ctx.stroke()
            ctx.draw(true, setTimeout(function callback(res) {
              console.log('in draw...')
              wx.canvasToTempFilePath({
                canvasId: canvasid,
                // destWidth: 320,
                // destHeight: 471,
                quality: 1,
                success: function (res) {
                  console.log('生成：' + res.tempFilePath);
                  pageObj.setData({
                    canvas_on: true
                  })
                  wx.previewImage({
                    current: res.tempFilePath,
                    urls: [res.tempFilePath],
                    success: function (res) {
                      pageObj.setData({
                        canvas_on: true
                      })
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
  },

  promotionQr: function (pageObj, canvasid, bgImgUrl, qrcodeUrl, text1, text2, text3, text4) {

    pageObj.setData({
      canvas_on: false
    })
    let qrpath = null
    wx.getImageInfo({
      src: qrcodeUrl,
      success: function (sres) {
        // console.log('qrpath')
        qrpath = sres.path
        console.log('qrpath=' + qrpath);

        wx.getImageInfo({
          src: bgImgUrl,//'https://sxz-1255492784.image.myqcloud.com/20180323pg.png',
          success: function (sres2) {
            console.log('localqr=' + sres2.path);
            const ctx = wx.createCanvasContext(canvasid)

            // 底图that.data.cachBackgrdImage
            ctx.drawImage(sres2.path, 0, 0, 320, 471)
            console.log('in 1 callback')
            ctx.setFillStyle('#000000')  // 文字颜色：黑色
            ctx.setFontSize(17)         // 文字字号：22px

            ctx.fillText(text2, 15, 200)
            // ctx.draw()
            ctx.setFillStyle('#404040')
            ctx.setFontSize(12)
            ctx.fillText(text3, 86, 30)
            // ctx.draw()
            ctx.setFillStyle('#FFFFFF')  // 文字颜色：黑色
            ctx.setFontSize(20)         // 文字字号：22px
            // ctx.setTextAlign('center')
            ctx.fillText(text1, 10, 90)
            ctx.setFillStyle('#FFFFFF')  // 文字颜色：黑色
            ctx.setFontSize(16)         // 文字字号：22px
            // ctx.setTextAlign('center')
            ctx.fillText(text4, 10, 130)
            console.log('in 2callback')

            // 小程序码
            const qrImgSize = 170
            ctx.drawImage(qrpath, 105, 260, qrImgSize, qrImgSize)
            ctx.stroke()
            ctx.draw(true, setTimeout(function callback(res) {
              console.log('in draw...')
              wx.canvasToTempFilePath({
                canvasId: canvasid,
                // destWidth: 320,
                // destHeight: 471,
                quality: 1,
                success: function (res) {
                  console.log('生成：' + res.tempFilePath);
                  pageObj.setData({
                    canvas_on: true
                  })
                  wx.previewImage({
                    current: res.tempFilePath,
                    urls: [res.tempFilePath],
                    success: function (res) {
                      pageObj.setData({
                        canvas_on: true
                      })
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



