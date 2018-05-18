var _function = require('../../utils/functionData.js');
const _upload = require('../../utils/upload.js');
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

        imageList: [],
        fileList: [],
        fileNames: [],
        sourceTypeIndex: 2,
        sourceType: ['拍照', '相册', '拍照或相册'],
        sizeTypeIndex: 2,
        sizeType: ['压缩', '原图', '压缩或原图'],

        contractType: ['全包', '半包', '软装'],
        contractTypeIndex: 0,
        houseType: ['一房一厅', '二房一厅', '二房两厅', '三房两厅', '四房两厅'],
        houseTypeIndex: 0,
        decorationStyle: '',

        PromotionInfo: {},
        caseId: 0,
        tempfaceImgurl: [],

        memberlist: {},
        authoNickNameType: ['设计师', '木工'],
        authoNickNameTypeIndex: 0,

        projectList: {},
        projectType: ['工程一', '工程二'],
        projectTypeIndex: 0,
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

        //初始枚举
        _function.getParams(wx.getStorageSync("utoken"), wx.getStorageSync("companyId"), 'style', that.initParamsData, this)


        //初始化工程列表
        _function.getProjectList(wx.getStorageSync("utoken"), wx.getStorageSync("companyId"), that.initProjectData, that)

        //初始化成员
        _function.getMemberList(wx.getStorageSync("utoken"), wx.getStorageSync("companyId"), that.initMemberListData, that)




    },
    initParamsData: function (data) {
        var inititems = data;
        for (var i = 0; i < inititems.length; i++) {
            if (inititems[i].text == this.data.PromotionInfo.decorationStyle) {
                inititems[i].checked = true;
            } else {
                inititems[i].checked = false;
            }
        }
        this.setData({
            items: inititems,
            decorationStyle: this.data.PromotionInfo.decorationStyle
        })

        for (var i = 0; i < this.data.contractType.length; i++) {
            if (this.data.contractType[i] == this.data.PromotionInfo.contractType) {
                this.setData({
                    contractTypeIndex: i,
                })
            }
        }

        for (var i = 0; i < this.data.houseType.length; i++) {
            if (this.data.houseType[i] == this.data.PromotionInfo.houseType) {
                this.setData({
                    houseTypeIndex: i,
                })
            }
        }

        this.setData({
            items: data,
        })
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
            imageList,
            tempfaceImgurl: [data.faceImgurl]
        });
    },
    //初始化成员
    initMemberListData: function (data) {
        var that = this
        var authoNickName = "";
        for (var i = 0; i < data.length; i++) {
            if (i == 0) {
                authoNickName += data[i].nickName
            } else {
                authoNickName += "," + data[i].nickName
            }
        }
        this.setData({
            memberlist: data,
            authoNickNameType: authoNickName.split(',')
        });

        for (var i = 0; i < that.data.authoNickNameType.length; i++) {
            if (that.data.authoNickNameType[i] == that.data.PromotionInfo.authoNickName) {
                this.setData({
                    authoNickNameTypeIndex: i,
                })
            }
        }
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
    //初始化工程列表
    initProjectData: function (data) {
        var that = this
        var ProjectName = "";
        for (var i = 0; i < data.length; i++) {
            if (i == 0) {
                ProjectName += data[i].projectName
            } else {
                ProjectName += "," + data[i].projectName
            }
        }
        this.setData({
            projectList: data,
            projectType: ProjectName.split(',')
        });

        for (var i = 0; i < that.data.projectType.length; i++) {
            if (that.data.projectType[i] == that.data.PromotionInfo.projectName) {
                this.setData({
                    projectTypeIndex: i,
                })
            }
        }
    },
    radioChange: function (e) {
        var that = this
        that.setData({
            value: e.detail.value
        })

        var items = this.data.items;
        var checkArr = e.detail.value;
        for (var i = 0; i < items.length; i++) {
            // if (checkArr.indexOf(i + "") != -1) {
            if (checkArr == i) {
                items[i].checked = true;
                this.setData({
                    decorationStyle: items[i].text
                })
            } else {
                items[i].checked = false;
            }
        }
        this.setData({
            items: items
        })
    },
    onAreaChange(e) {
        this.setData({
            contractTypeIndex: e.detail.value,
        });
    },
    houseTypehange(e) {
        this.setData({
            houseTypeIndex: e.detail.value,
        });
    },
    authoNickNameChange(e) {
        this.setData({
            authoNickNameTypeIndex: e.detail.value,
        });
    },
    projectChange(e) {
        this.setData({
            projectTypeIndex: e.detail.value,
        });
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

        if (param.decorationBudget == "") {
            this.showMsg("装修单价输入不能为空！");
            return;
        }

        if (param.decorationArea == "") {
            this.showMsg("房屋面积输入不能为空！");
            return;
        }

        var authoArvatarUrl = "";
        if (that.data.memberlist[that.data.authoNickNameTypeIndex].headImgurl != "") {
            authoArvatarUrl = that.data.memberlist[that.data.authoNickNameTypeIndex].headImgurl;
        } else {
            authoArvatarUrl = that.data.memberlist[that.data.authoNickNameTypeIndex].avatarUrl;
        }

        let datas = {
            form_id: e.detail.formId,
            companyId: wx.getStorageSync("companyId"),
            token: wx.getStorageSync("utoken"),
            caseType: 2,
            memberId: 0,
            show: true,
            title: param.title,
            description: param.description,
            decorationBudget: param.decorationBudget,
            decorationArea: param.decorationArea,
            decorationStyle: that.data.decorationStyle,
            houseType: that.data.houseType[that.data.houseTypeIndex],
            contractType: that.data.contractType[that.data.contractTypeIndex],
            faceImgurl: that.data.tempfaceImgurl[0],
            authoArvatarUrl: authoArvatarUrl,
            authoNickName: that.data.memberlist[that.data.authoNickNameTypeIndex].nickName,
            author: that.data.memberlist[that.data.authoNickNameTypeIndex].id,
            projectId: that.data.projectList[that.data.projectTypeIndex].id,
            projectName: that.data.projectList[that.data.projectTypeIndex].projectName,
            _: Date.now()
        }

        if (that.data.fileList && that.data.fileList.length > 0) {
            _upload.uploadToCos(e, that.data.fileList, that, function (imgCosUrls) {
                let { imageList } = this.data;
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
                _function.updatePromotionInfo(datas, that.data.caseId, that.doPromotionInfoData, this)
            })
        }else{
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
                            url: '../../pages/caselist/index'
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
    chooseImage: function () {
        var that = this
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
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})