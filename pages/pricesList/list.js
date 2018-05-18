import { request } from '../../utils/util';
import api from '../../config/api';

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  onLoad: function (options) {
    const companyId = wx.getStorageSync('companyId');
    this.setData({ companyId });
  },

  onShow: function () {
    const { companyId } = this.data;

    request(api.labelList(companyId), null).then(res=>{
      res = res.filter(d=>d.materialMainTypes.length>0);
      if(res.length > 0){
        this.chooseLabel(null,res[0].id,res[0].materialMainTypes[0].id)
        this.setData({labelList: res});
      }
    });
  },

  chooseLabel: function(e, labelId, id){
    if(e){
      labelId = e.currentTarget.dataset.labelId;
      id = e.currentTarget.dataset.id;
    }
    const { companyId } = this.data;

    request(api.productList(companyId, id), null).then(res=>{
      let mains = res.filter(d=>d.mainType==0);
      let ingredients = res.filter(d=>d.mainType==1);
      //已选择主料
      const chooseMain = wx.getStorageSync(`product-${labelId}-${id}-1`);
      chooseMain && mains.forEach(d=>{
        d.select = d.id == chooseMain.id;
      })
      //已选择辅料
      const chooseIngredient = wx.getStorageSync(`product-${labelId}-${id}-2`);
      chooseIngredient && ingredients.forEach(d=>{
        d.select = d.id == chooseIngredient.id;
      })
      this.setData({
        mains,
        ingredients,
        labelId,
        mtlTypeId: id,
        active: `${labelId}-${id}`
      });
    });
  },

  chooseProduct: function(e){
    const { index, type } = e.currentTarget.dataset;
    let { mains, ingredients, labelId, mtlTypeId } = this.data;
    if( type == 1){
      mains = this.toSlect(mains, index, type)
      this.setData({mains})
    }else{
      ingredients = this.toSlect(ingredients, index, type)
      this.setData({ingredients});
    }
  },

  toSlect: function(arr, index, type){
    let { labelId, mtlTypeId, labelList } = this.data;
    return arr.map((d, i)=>{
      if(i == index){
        if(d.select){//已选择，则取消选择
          d.select = false;
          wx.setStorageSync(`product-${labelId}-${mtlTypeId}-${type}`, null);
        }else{
          let labelInfo = labelList.filter(d=>d.id==labelId)[0];
          d.setsd = labelId;
          d.mtlTypeId = mtlTypeId;
          d.labelName = labelInfo.setsName;
          d.mtlName = labelInfo.materialMainTypes.filter(d=>d.id == mtlTypeId)[0].mtlTypeName;
          d.mainType = type;
          d.count = 1;
          d.select = true;
          wx.setStorageSync(`product-${labelId}-${mtlTypeId}-${type}`, d);
        }
      }else{
        d.select = false;
      }
      return d;
    })
  },

  jumpToNext: function(e){
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({url: '/pages/productDetail/productDetail?id='+ id});
  },

  submit: function(){
    wx.navigateTo({url: '/pages/submitOrder/submitOrder'})
  },


})