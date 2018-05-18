var _RongData = require('data.js');
module.exports = {
  COS_IMAGE_BASE_URL: _RongData.COS_IMAGE_BASE_URL,
  requestUrl: function (data, url, callback, pageobj) {
    wx.showToast({ icon: "loading", title: "请稍后...", duration: 8000 });
    wx.request({
      url: url,
      data: data,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        wx.hideToast();
        if (res.statusCode == 200 && res.data.status == 0) {
          callback.apply(pageobj, [res.data.result])
        } else {
          var error_msg = 'error:接口请求错误';
          if (res.data.returnMessage != 'null' || res.data.returnMessage != '' || res.data.returnMessage != null) {
            error_msg = res.data.returnMessage
          }
          wx.showModal({
            title: '提示',
            content: error_msg,
            showCancel: false
          })
        }
      },
      complete: function () { }
    })
  },
  httpRequest: function (data, url, callback, pageobj) {
    wx.showToast({ icon: "loading", title: "处理中...", duration: 8000 });
    wx.request({
      url: url,
      data: data,
      method: 'put',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        wx.hideToast();
        if (res.statusCode != 200) {
          wx.showModal({
            title: '提示',
            content: "error:接口请求错误",
            showCancel: false
          })
        } else {
          callback.apply(pageobj, [res.data]);
          if (res.data.status != 0) {
            wx.showModal({
              title: '提示',
              content: res.data.returnMessage,
              showCancel: false
            })
          }
        }
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: "error:网络请求失败",
          showCancel: false
        })
      }
    })
  },

  sendRequest: function (method, param, url, callback, pageobj) {
    console.log(param)
    wx.showToast({ icon: "loading", title: "处理中...", duration: 1000 });
    wx.request({
      url: url,
      data: param,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer' + wx.getStorageSync("utoken")
      },
      dataType: "json",
      success: function (res) {

        if (res.data.success) {
          console.log('success!')
          // typeof callback == "function" && callback(res.data)
          callback.apply(pageobj, [res.data.result]);
        }
        else {
          wx.hideLoading();
          let msg
          if (res.statusCode != '200') {
            if (null != res.data.apierror) {
              msg = res.data.apierror.status + ':' + res.data.apierror.message + ' path:' + res.data.apierror.path
            } else {
              msg = res.data.message 
            }
          }
          else {
            msg = res.data.returnCode + ':' + res.data.returnMessage
          }
          wx.showModal({
            title: '处理失败',
            content: msg,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('click ok')
              }
            }
          })
        }
      },
      fail: function () {
        
        wx.showModal({
          title: '提示',
          content: "错误:网络请求失败",
          showCancel: false
        })
      },
      complete: function () {
        wx.hideLoading();
      },
      
    })
  },

  getUserInfo: function (utoken, callback, pageobj) {
    var data = {
      //APPtoken: _RongData.rong_user_token,
      token: utoken,
      _: Date.now()
    };
    this.requestUrl(data, _RongData.rong_user_url, callback, pageobj)
  },
  //取得公司基本信息
  getCompanyInfo: function (utoken, CompanyID, callback, pageobj) {
    var data = {
      //APPtoken: _RongData.rong_user_token,
      token: utoken,
      _: Date.now()
    };
    this.requestUrl(data, _RongData.rong_company_url + "/" + CompanyID, callback, pageobj)
  },
  //更新公司基本信息
  upCompanyInfo: function (companyid, compayInfo, callback, pageobj) {
    this.httpRequest(compayInfo, _RongData.rong_company_url + "/" + companyid, callback, pageobj)
  },
  //取得公司成员信息列表
  getMemberList: function (utoken, CompanyID, callback, pageobj) {
    var data = {
      //APPtoken: _RongData.rong_user_token,
      token: utoken,
      _: Date.now()
    };
    this.requestUrl(data, _RongData.rong_member_list_url + "/" + CompanyID, callback, pageobj)
  },
  //取得公司成员详细信息
  getMemberInfo: function (utoken, memberId, callback, pageobj) {
    var data = {
      //APPtoken: _RongData.rong_user_token,
      token: utoken,
      _: Date.now()
    };
    this.requestUrl(data, _RongData.rong_member_info_url + "/" + memberId, callback, pageobj)
  },
  //更新成员信息
  updateMemberInfo: function (data, memberId, callback, pageobj) {
    this.httpRequest(data, _RongData.rong_member_info_url + "/" + memberId, callback, pageobj)
  },
  //取得宣传活动信息列表
  getPromotionList: function (utoken, CompanyID, caseType, callback, pageobj) {
    var data = {
      _: Date.now()
    };
    this.requestUrl(data, _RongData.rong_promotion_info_url + "/customer/" + CompanyID + "/" + caseType, callback, pageobj)
  },
  //删除宣传活动信息
  delPromotion: function (utoken, id, callback, pageobj) {
    var data = {
      _: Date.now()
    };
    this.sendRequest("DELETE", data, _RongData.rong_promotion_info_url + "/" + id, callback, pageobj)
  },
  //取得宣传活动详细信息
  getPromotionInfo: function (caseId, callback, pageobj) {
    var data = {
      _: Date.now()
    };
    this.requestUrl(data, _RongData.rong_promotion_info_url + "/" + caseId, callback, pageobj)
  },
  //添加宣传活动
  addPromotionInfo: function (data, callback, pageobj) {
    this.sendRequest("POST", data, _RongData.rong_promotion_info_url, callback, pageobj)
  },
  //修改宣传活动
  updatePromotionInfo: function (data, caseId, callback, pageobj) {
    this.sendRequest("PUT", data, _RongData.rong_promotion_info_url + "/" + caseId, callback, pageobj)
  },
  //取得预约信息列表
  getAppintmentList: function (utoken, companyId, callback, pageobj) {
    var data = {
      _: Date.now()
    };
    this.requestUrl(data, _RongData.rong_appintment_list_url + "/" + companyId, callback, pageobj)
  },
  //取得获取当前公司的工程清单
  getProjectList: function (utoken, companyId, callback, pageobj) {
    var data = {
      token: utoken,
      _: Date.now()
    };
    this.requestUrl(data, _RongData.rong_project_url + "/customer/" + companyId, callback, pageobj)
  },
  //添加工程
  addProjectInfo: function (data, callback, pageobj) {
    //console.log(data);
    this.sendRequest("POST", data, _RongData.rong_project_url, callback, pageobj)
  },
  //取得工程日志清单
  getProjectlogList: function (utoken, memberId, callback, pageobj) {
    var data = {
      token: utoken,
      _: Date.now()
    };
    this.requestUrl(data, _RongData.rong_projectlog_url + "/memberlatest/" + memberId, callback, pageobj)
  },
  //参数枚举值获取
  getParams: function (utoken, companyId, paramType, callback, pageobj) {
    var data = {
      //APPtoken: _RongData.rong_user_token,
      token: utoken,
      companyId: companyId,
      paramType: paramType,
      _: Date.now()
    };
    this.requestUrl(data, _RongData.rong_params_info_url + "/" + companyId + "/" + paramType, callback, pageobj)
  },

  //=============sean start===================================================================
  createPrjlog: function (data, pageobj, callback) {
    this.sendRequest('POST', data, _RongData.sxz_url_updatePrjlog, callback, pageobj)
  },
  getQrcode: function (url, pageobj, callback) {
    this.sendRequest('GET', null, _RongData.sxz_url_qrcode + url, callback, pageobj)
  },
  //取得获取当前公司的工程清单
  getMemDynamic: function (utoken, memberId, callback, pageobj) {
    var data = {
      token: utoken,
      _: Date.now()
    };
    this.requestUrl(data, _RongData.rong_project_url + "/corp/mem/" + memberId, callback, pageobj)
  },
  //取得待加入装修队成员清单
  getNeedJoinMem: function (comId, pid, pageobj, callback) {
    var data = {
      _: Date.now()
    };
    this.sendRequest('GET', data, _RongData.sxz_url_prjMem + "/corp/needjoin/" + comId + "/" + pid, callback, pageobj)
  },
  addToTeam: function (comId, mId, pid, role, inviteMemberId, pageobj, callback) {
    var data = {
      companyId: comId,
      projectId: pid,
      memberId: mId,
      inviteMemberId: inviteMemberId,
      role: role,
      _: Date.now()
    };
    this.sendRequest('POST', data, _RongData.sxz_url_prjMem, callback, pageobj)
  },
  //删除bobao
  delPrjlog: function (id, pageobj, callback) {
    var data = {
      _: Date.now()
    };
    this.sendRequest("DELETE", data, _RongData.sxz_url_updatePrjlog + "/" + id, callback, pageobj)
  },
  //置顶bobao
  topPrjlog: function (id, isTop, pageobj, callback) {
    var data = {
      _: Date.now()
    };
    this.sendRequest("PUT", data, _RongData.sxz_url_updatePrjlog+`/corp/totop/${id}?isTop=${isTop}`, callback, pageobj)
  },
  //删除bobao
  delPrjmem: function (id, pageobj, callback) {
    var data = {
      _: Date.now()
    };
    this.sendRequest("DELETE", data, _RongData.sxz_url_prjMem + "/" + id, callback, pageobj)
  },
  //添加工程
  delProjectInfo: function (pid, pageobj, callback) {
    //console.log(data);
    this.sendRequest("DELETE", null, _RongData.rong_project_url + "/" + pid, callback, pageobj)
  },
  //取得待审批工程清单
  getPendingPrj: function (companyId, pageobj, callback) {
    var data = {
      _: Date.now()
    };
    this.sendRequest("GET", data, _RongData.rong_project_url + "/corp/pending/" + companyId, callback, pageobj)
  },
  //取得待审批播报
  getPendingPrjlog: function (companyId, pageobj, callback) {
    var data = {
      _: Date.now()
    };
    this.sendRequest("GET", data, _RongData.sxz_url_updatePrjlog + "/corp/pending/" + companyId, callback, pageobj)
  },
  //审批工程
  approvePorject: function (pid, apprvoeResult, pageobj, callback) {
    var data = {
      _: Date.now(),
      isApproved: apprvoeResult
    };
    this.sendRequest("PUT", data, _RongData.rong_project_url + "/corp/approve/" + pid + '?isApproved=' + apprvoeResult, callback, pageobj)
  },

  //审批工程播报
  approvePrjlog: function (prjlogId, apprvoeResult, pageobj, callback) {
    var data = {
      _: Date.now(),
      isApproved: apprvoeResult
    };
    this.sendRequest("PUT", data, _RongData.sxz_url_updatePrjlog + "/corp/approve/" + prjlogId + '?isApproved=' + apprvoeResult, callback, pageobj)
  },
  //取得待审批播报
  getMyprmt: function (memId, pageobj, callback) {
    var data = {
      _: Date.now()
    };
    this.sendRequest("GET", data, _RongData.sxz_url_netpmt + '/mem/' + memId, callback, pageobj)
  },
   getList: function (controlUrl, companyId, pageobj, callback) {
    var data = {
      token: wx.getStorageSync("utoken"),
      _: Date.now()
    };
    this.sendRequest("GET", data, controlUrl + '/' + companyId, callback, pageobj)
  },
  //=============sean end=====================================================================

  //=============xyz start=====================================================================
  createSubDep: function (utoken, data, pageobj, callback) {
    data['token'] = wx.getStorageSync("utoken");
    this.sendRequest("POST", data, _RongData.sxz_url_subDep, callback, pageobj)
  },
  updateSubDep: function (utoken, data, subDepId, pageobj, callback) {
    var data = {
      token: utoken,
      _: Date.now()
    };
    this.sendRequest("PUT", data, _RongData.sxz_url_subDep + '/' + subDepId, callback, pageobj)
  },
  searchSubDeps: function (utoken, data, pageobj, callback) {
    data['token'] = wx.getStorageSync("utoken");
    this.sendRequest("GET", data, _RongData.sxz_url_subDep, callback, pageobj)
  },
  deleteSubDeps: function (utoken, data, subDepId, pageobj, callback) {
    var data = {
      token: utoken,
      _: Date.now()
    };
    this.sendRequest("DELETE", data, _RongData.sxz_url_subDep + '/' + subDepId, callback, pageobj)
  },

  //=============xyz end=====================================================================

}