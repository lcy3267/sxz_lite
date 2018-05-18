var COS = require('cos-wx-sdk-v5');
var _EnvData = require('data.js');
const usl = _EnvData.SXZ_HOST_URL + 'cosauth?bucket=1'
var COSKEY=null
module.exports = {
  //事件处理函数
  uploadToCos: function (e, fileList,pageobj,endCallback,useNameOnly) {
    var Bucket = 'sxz-1255492784';
    var Region = 'ap-guangzhou';

    // 初始化实例
    var cos = new COS({
      getAuthorization: function (options, callback) {
        // 异步获取签名
        if (COSKEY)
        {
          console.log("have a key " + COSKEY);
          callback(COSKEY);}
        else
        {
          //let usl = EnvData.SXZ_HOST_URL + 'cosauth?bucket=1'
          console.log(usl)
        wx.request({
          url: usl, // 步骤二提供的签名接口
          // data: {
          //   Method: params.Method,
          //   Key: params.Key
          // },
          // dataType: 'json',
          success: function (rsp) {
            console.log('OK ,i get a coskey!' + rsp.data.result)
            COSKEY = rsp.data.result
            callback(rsp.data.result);
          }
        });
      }
      }
    });

    let uploadedFileNames = []
    // if (fileList)
    for (let i = 0, len = fileList.length; i < len; ++i) {

      // 获取文件路径
      let file = fileList[i];
      console.log(file.path + "===size=" + file.size);
      let filename = file.path.substr(file.path.lastIndexOf('/') + 1);
      
      console.log("ready to upload file=" + filename);
      cos.postObject({
        Bucket: Bucket,
        Region: Region,
        Key: filename,
        FilePath: file.path,
        TaskReady: function (taskId) {
          // TaskId = taskId
          console.log('taskId' + taskId)
        },
        onProgress: function (info) {
          console.log(JSON.stringify(info));
          pageobj.setData({
            percent: info.percent
          })
        }
      }, 
      function (err, data) {
        console.log('finished upload ' + filename + 'err?'+ err || data);

        if (err && err.error) {
          wx.showModal({ title: '上传文件失败', content: '请求失败：' + err.error.Message + '；状态码：' + err.statusCode, showCancel: false });
        } else if (err) {
          wx.showModal({ title: '上传文件失败', content: '请求出错：' + err + '；状态码：' + err.statusCode, showCancel: false });
        } else {
          // wx.showToast({ title: '请求成功', icon: 'success', duration: 3000 });
          console.log('Upload cos successful.')
          //TODO 适配发布播报时，不送COS URL useNameOnly
          if (useNameOnly) {
            uploadedFileNames.push(filename)
          }
          else {
            uploadedFileNames.push(_EnvData.COS_IMAGE_BASE_URL + filename)
          }
          //最后一个才执行end回调
          if (uploadedFileNames.length == fileList.length) {  
            console.log("ok all:" + uploadedFileNames);
            // console.log("ok all:" + FileNamesStr);
            // endCallback.apply(pageobj, [FileNamesStr])
            endCallback.apply(pageobj, [uploadedFileNames])
          }
        }
      });
    }
  }
}