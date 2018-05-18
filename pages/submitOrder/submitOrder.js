import { request, prompt } from '../../utils/util';
import api from '../../config/api';
const app = getApp();

Page({

  data: {
    products: [],
  },

  onLoad: function (options) {
  },

  onShow: function () {
    this.getProducts();
  },

  getProducts: function(){
    const res = wx.getStorageInfoSync();
    let products = [];
    let keys = res.keys?res.keys:[]
    keys.map(k=>{
      if(k.indexOf('product-') > -1 && wx.getStorageSync(k)){
        products.push(wx.getStorageSync(k))
      }
    });
    this.setData({
      keys,
      products,
      selectAll: this.hasSelectAllIcon(products)
    });
  },

  toSelect: function (e) {
    let index = e.currentTarget.dataset.index,
    products = this.data.products;
    products[index].select = !products[index].select;
    this.setGoods(products);
  },

  updateNum: function (e) {
    let index = e.currentTarget.dataset.index,
      isAdd = e.currentTarget.dataset.type == 'add',
      products = this.data.products,
      target = products[index];

    if (target.count == 1 && !isAdd) {
      wx.showModal({
        content: '确定将此商品移出？',
        success: (res) => {
          if (res.confirm) {
            //删除缓存数据
            const { keys } = this.data;
            wx.removeStorageSync(keys[index]);
            products.splice(index, 1);
            this.setGoods(products);
            wx.showToast({
              title: '移出成功',
              icon: 'success',
              duration: 2000
            })
          }
        }
      })
    } else {
      products[index].count = isAdd ? products[index].count + 1 : products[index].count - 1;
      this.setGoods(products);
    }
  },

  selectAll: function () {
    let { products, selectAll } = this.data;
    selectAll = !selectAll;
    products = products.map((g) => {
      g.select = selectAll;
      return g;
    });
    this.setGoods(products);
  },

  //去结算
  toClearing: function () {
    const MEM_ID = app.globalData.MEM_ID;
    const companyId = wx.getStorageSync('companyId');
    let { products, keys } = this.data;
    let selectGoods = products.filter(g => g.select);
    if (this.submiting || selectGoods.length == 0) return;
    this.submiting = true;
    products = products.map(d=>{
      return {
        materialId: d.id,
        counter: d.count,
        mainType: d.mainType,
        setsd: d.setsd,
        mtlTypeId: d.mtlTypeId,
      };
    })
    request(api.submitOrder,{
      companyId,
      customerId: MEM_ID,
      materiaList: products,
      status: 0
    }, "post").then((res)=>{
      this.submiting = false;
      prompt('提交成功');
      keys.map(d=>{
        wx.removeStorageSync(d);
      })
    }).catch(()=>{
      this.submiting = false;
    });
  },

  setGoods: function (products) {
    this.setData({ products, selectAll: this.hasSelectAllIcon(products) });
  },

  //是否勾选全选按钮
  hasSelectAllIcon: function (products) {
    const selectedArr = products.filter(g => g.select);
    return selectedArr.length == products.length;
  },

  jumpToDetail: function(e){
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({url: '/pages/productDetail/productDetail?id='+ id});
  },

})