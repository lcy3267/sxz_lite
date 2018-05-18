const _function = require('../../utils/functionData.js');
const _upload = require('../../utils/upload.js');
const _ = require('../../utils/underscore.js');
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        area: ['营销活动', '大图宣传'],
        areaIndex: 0,
        imageList: [],
        fileList: [],
        fileNames: [],
        percent: 0,
        sourceTypeIndex: 2,
        sourceType: ['拍照', '相册', '拍照或相册'],
        sizeTypeIndex: 2,
        sizeType: ['压缩', '原图', '压缩或原图'],

        stageIndex: 0,
        countIndex: 8,
        count: [1, 2, 3, 4, 5, 6, 7, 8, 9],

        PromotionInfo: {},
        caseId: 0,
        tempfaceImgurl: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        var cId = options.id;
        that.setData({
            caseId: cId,
        })
        //请求详情
        _function.getPromotionInfo(cId, that.initPromotionInfoData, this)
    },

    initPromotionInfoData: function (data) {
        let imageList = [];
        if (data.photos && data.photos.length > 0) {
            imageList = data.photos.map(d => d.photoImgurl)
        } else {
            imageList = [data.faceImgurl];
        }
        this.setData({
            PromotionInfo: data,
            imageList
        });
    },

    onAreaChange(e) {
        this.setData({
            areaIndex: e.detail.value
        });
    },

    deleteImg: function (e) {
        const {
            index
        } = e.currentTarget.dataset;
        let { imageList, fileList } = this.data;
        if(imageList[index].indexOf('sxz-') == -1){
            fileList = fileList.filter(d=>{
                d.path == imageList[index];
            })
        }
        this.setData({
            imageList: imageList.filter((d, i) => i != index),
            fileList,
        })
    },

    chooseImage: function () {
        var that = this;
        wx.chooseImage({
            sourceType: this.data.sourceType[this.data.sourceTypeIndex],
            sizeType: this.data.sizeType[this.data.sizeTypeIndex],
            count: 9 - that.data.imageList.length,
            success: function (res) {
                that.setData({
                    imageList: [...that.data.imageList, ...res.tempFilePaths],
                    fileList: [...that.data.fileList, ...res.tempFiles]
                })
            },
            fail: function (res) {
                console.log('error')
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

        let {
            imageList
        } = this.data;
        
        let datas = {
            form_id: e.detail.formId,
            companyId: wx.getStorageSync("companyId"),
            token: wx.getStorageSync("utoken"),
            caseType: 1,
            memberId: 0,
            show: true,
            title: param.title,
            description: param.description,
            faceImgurl: imageList[0],
            _: Date.now()
        }

        if (that.data.fileList && that.data.fileList.length > 0) {
            _upload.uploadToCos(e, that.data.fileList, that, function (imgCosUrls) {
                imageList = imageList.filter(d => {
                    return d.indexOf('sxz') > -1;
                })
                imageList = [...imageList, ...imgCosUrls];
                const photos = imageList.map((d, i) => {
                    return {
                        photoImgurl: d,
                        isFace: i == 0
                    }
                })
                datas.photos = photos;
                datas.faceImgurl = imageList[0];
                _function.updatePromotionInfo(datas, that.data.caseId, that.doPromotionInfoData, this)
            });
        } else {
            _function.updatePromotionInfo(datas, that.data.caseId, that.doPromotionInfoData, this)
        }
    },

    doPromotionInfoData: function (data) {
        if (data.caseId > 0) {
            wx.showModal({
                title: '提示',
                content: '修改成功！',
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