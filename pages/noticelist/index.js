import {
  request,
  prompt
} from '../../utils/util';
import api from '../../config/api';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow: function () {
    const companyId = wx.getStorageSync('companyId');
    request(api.noticeList(companyId)).then((res) => {
      this.setData({ list: res });
    })
  },

  to_manager: function (e) {
    const { id } = e.currentTarget.dataset;
    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      success: (res)=> {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            wx.navigateTo({
              url: '../noticeadd/index?id='+id,
            })
          } else if (res.tapIndex == 1) {
            wx.showModal({
              title: '',
              content: '确认要删除该条公告吗？',
              success: (res)=> {
                if (res.confirm) {
                  request(api.noticeInfo(id), null, 'DELETE').then(()=>{
                    wx.showToast({
                      title: '删除成功',
                    })
                    this.onShow();
                  })
                }
              }
            })
          }
        }
      }
    })
  },

  to_noticeadd: function () {
    wx.navigateTo({
      url: '../noticeadd/index',
    })
  },

})