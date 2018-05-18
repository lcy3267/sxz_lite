import { request } from '../../utils/util';
import api from '../../config/api';

Page({

  data: {
  },

  onLoad: function (options) {
    request(api.productInfo(options.id), null).then((res)=>{
      res.params = res.ts.split('|');
      this.setData({info: res});
    });
  },

  onShareAppMessage: function () {
  },

  jumpIndex: function(){
    const routers = getCurrentPages();
    if(routers.length > 1 && routers[routers.length-2].route=='pages/list/list'){
      wx.navigateBack();
    }else{
      wx.navigateTo({
        url: '/pages/list/list',
      })
    }
  },
  
})