import { request, prompt } from '../../utils/util';
import api from '../../config/api';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    publisher: '',
    noticeInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      wx.setNavigationBarTitle({title: '编辑通知'})
      request(api.noticeInfo(options.id)).then((noticeInfo)=>{
        this.setData({noticeInfo})
      });
    }
  },
  
  onShow: function () {
  },

  titleChange: function(e){
    const { noticeInfo } = this.data;
    noticeInfo.title = e.detail.detail.value;
    this.setData({ noticeInfo })
  },

  publisherChange: function(e){
    const { noticeInfo } = this.data;
    noticeInfo.publisher = e.detail.detail.value;
    this.setData({ noticeInfo })
  },

  contentChange: function(e){
    const { noticeInfo } = this.data;
    noticeInfo.text = e.detail.value;
    this.setData({ noticeInfo });
  },

  submit: function(){
    const companyId = wx.getStorageSync('companyId');
    const MEM_ID = app.globalData.MEM_ID;
    const { noticeInfo } = this.data;

    if(!noticeInfo.title) return prompt('请输入标题');
    if(!noticeInfo.text) return prompt('请输入通知内容');

    const url = noticeInfo.id ? api.noticeInfo(noticeInfo.id) : api.addNotice;
    const method = noticeInfo.id?"PUT":"POST";

    request(url, {
      ...noticeInfo,
      companyId,
      createrId: MEM_ID
    }, method ).then((res)=>{
      prompt(noticeInfo.id?'修改成功':'发布成功', 'success');
      setTimeout(()=>{
        wx.navigateBack()
      },1500)
    }).catch(()=>{
      prompt('系统异常')
    })
  },
})