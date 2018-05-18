// var RONG_HOST_URL = "https://www.sxzhuang.cn";
var SXZ_HOST_URL = "https://api.sxzhuang.cn/sxz/";
// var SXZ_HOST_URL = "http://127.0.0.1/sxz/"; 
var COS_IMAGE_BASE_URL = "https://sxz-1255492784.image.myqcloud.com/"; 
var QRCODE_BASE_URL = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket="; 
var user_token = "gh_a063d665667";
var app_config_version = 10000;
module.exports = {
  SXZ_HOST_URL:SXZ_HOST_URL,
  COS_IMAGE_BASE_URL: COS_IMAGE_BASE_URL,
  QRCODE_BASE_URL: QRCODE_BASE_URL,
  rong_config_version: app_config_version,
  rong_user_token: user_token,
  rong_user_url: SXZ_HOST_URL + "login/",
  rong_company_url: SXZ_HOST_URL + "company", //公司基本信息
  rong_member_list_url: SXZ_HOST_URL + "member/company",//公司成员列表
  rong_member_info_url: SXZ_HOST_URL + "member",//获取成员详细信息
  rong_params_info_url: SXZ_HOST_URL + "params",//参数获取枚举值列表
  rong_promotion_info_url: SXZ_HOST_URL + "promotion",//活动案例
  rong_appintment_list_url: SXZ_HOST_URL + "appintment",//预约信息
  rong_project_url: SXZ_HOST_URL + "project",//预约信息
  sxz_url_updatePrjlog: SXZ_HOST_URL + "projectlog",
  sxz_url_qrcode: SXZ_HOST_URL + "qrcode/corp/",
  sxz_url_prjMem: SXZ_HOST_URL + "projectmember",
  sxz_url_netpmt: SXZ_HOST_URL + "netpmt/corp",
  sxz_url_subDep: SXZ_HOST_URL + "sub-department",
  sxz_url_prjPrc: SXZ_HOST_URL + "prj_process",
}
