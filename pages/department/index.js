// pages/department/index.js
const _function = require('../../utils/functionData.js');
const _configData = require('../../utils/data.js');
import {
  prompt,
  request
} from '../../utils/util';
import api from '../../config/api';

let app = getApp()



Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    departments: [],
    companyMembers: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('=========')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    let datas = {}

    const companyId = wx.getStorageSync('companyId');


    _function.getList(_configData.sxz_url_subDep, 'list/' + companyId, that, function (res) {

      request(api.companyMember(companyId)).then((members) => {
        res.push({
          subDeparmentId: null,
          subDepartmentName: '其他'
        })
        res.map((res) => {
          res.members = members.filter(d => {
            return d.subDepartmentId == res.subDeparmentId;
          });
        })
        // const companyMembers = members.filter(d => !d.subDeparmentId)
        this.setData({
          members,
          departments: res,
        })
      })
    });
  },

  updateDepartment: function(e){
    const { index, id } = e.currentTarget.dataset;
    this.setData({ showModal: true, index, memberId: id })
  },

  bindPickerChange: function(e){
    this.setData({showModal: false})
    const { departments, memberId, members} = this.data;
    const department = departments[e.detail.value];
    const member = members.filter(d=>d.id == memberId)[0];
    member.subDepartmentId = department.subDeparmentId;
    request(api.editMember(memberId), member, 'PUT').then(()=>{
      prompt('切换成功！')
      this.onShow();
    })
  },

  closeModal: function(){
    this.setData({ showModal: false })
  },

  returnClose: function(){},

  to_dep: function (event) {
    let that = this
    let value = event.currentTarget.dataset.value
    let index = event.currentTarget.dataset.index;
    let id = value.subDeparmentId
    let name = value.subDepartmentName
    let data = '../departmentedit/index?type=edit&id=' + id + "&name=" + name
    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      success: function (e) {
        if (e.tapIndex == 0) {
          wx.navigateTo({
            url: data,
          })
        } else if (e.tapIndex == 1) {
          wx.showModal({
            title: '提示',
            content: '确定要删除该部门吗？',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                _function.deleteSubDeps(wx.getStorageSync("utoken"), {
                  _: Date.now()
                }, id, that, function (res) {
                  let departments = that.data.departments
                  departments.splice(index, 1);
                  this.setData({
                    departments: departments,
                  })
                  wx.showToast({
                    icon: 'none',
                    title: '删除' + name + '成功',
                  })
                });
              }
            }
          })
        }
      }
    })
  },

  add_dep: function () {
    wx.navigateTo({
      url: '../departmentedit/index?id=add',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onShow();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})