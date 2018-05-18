const _function = require('../../utils/functionData.js');
const _upload = require('../../utils/upload.js');
const _ = require('../../utils/underscore.js');
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        area: ['营销活动', '大图宣传'], areaIndex: 0,
        imageList: [],
        fileList: [],
        fileNames: [],
        percent: 0,

        stageIndex: 0,
        countIndex: 8,
        count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    },

    onLoad: function (options) {
    },

   
    onAreaChange(e) {
        this.setData({
            areaIndex: e.detail.value
        });
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    chooseImage: function () {
        var that = this
        wx.chooseImage({
            count: 9-that.data.imageList.length,
            success: function (res) {
                that.setData({
                    imageList: [...that.data.imageList, ...res.tempFilePaths],
                    fileList: [...that.data.fileList, ...res.tempFiles]
                })
            },
            fail: function (res) {
            }
        })
    },

    previewImage: function (e) {
        var current = e.target.dataset.src
        wx.previewImage({
            current: current,
            urls: this.data.imageList
        })
    },

    deleteImg: function(e){
        const { index } = e.currentTarget.dataset;
        this.setData({
            imageList: this.data.imageList.filter((d , i)=> i!= index),
            fileList: this.data.fileList.filter((d , i)=> i != index),
        })
    },

    formSubmit: function (e) {
        var that = this
        let param = e.detail.value

        if (param.title == "") {
            this.showMsg("标题输入不能为空~");
            return;
        }

        if (param.description == "") {
            this.showMsg("描述信息输入不能为空！");
            return;
        }
        

        if (that.data.imageList && that.data.imageList.length > 0) {
            console.log(that.data.fileList);
            
            _upload.uploadToCos(e, that.data.fileList, that, function (imgCosUrls) {
                console.log('well! get the cos url:' + imgCosUrls)

                const photos = imgCosUrls.map((d, i)=>{
                    return {
                        photoImgurl: d,
                        isFace: i==0
                    }
                })
                var datas = {
                    form_id: e.detail.formId,
                    companyId: wx.getStorageSync("companyId"),
                    token: wx.getStorageSync("utoken"),
                    caseType: 1,
                    memberId: app.globalData.MEM_ID,
                    show: true,
                    title: param.title,
                    description: param.description,
                    faceImgurl: imgCosUrls[0],
                    photos,
                    _: Date.now()
                }
                
                _function.addPromotionInfo(datas, that.doPromotionInfoData, this)
                
            })
            
        }
        else {
            this.showMsg("图片不能为空！");
            return;
        }
    },

    doPromotionInfoData: function (data) {
        if (data.caseId>0) {
            wx.showModal({
                title: '提示',
                content: '发布成功！',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '../../pages/active/index'
                        })
                    }
                }
            })
        }
    },

    /**
    * 显示提示信息
    */
    showMsg: function (content) {
        wx.showModal({
            content: content,
            showCancel: false,
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
    
    }
})