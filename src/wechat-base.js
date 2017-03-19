//getWeixinShareSign
//url	http://xxx.xxx.xx
//前端需要用js获取当前页面除去'#'hash部分的链接（可用location.href.split('#')[0]获取,而且需要encodeURIComponent	必填



//返回数据格式：
/*
{
   "appId"：//appid
   "timestamp": //时间戳
   "nonceStr": //随机码
   "signature": //签名
}
*/


var nx = require('next-js-core2');

var WechatBase = nx.declare({
  statics:{
    config:function(inOptions){
      wx.config(inOptions);
    },
    ready:function(inCallback,inContext){
      return inCallback.call(inContext);
    }
  }
});


if (typeof module !== 'undefined' && module.exports) {
	module.exports = WechatBase;
}






