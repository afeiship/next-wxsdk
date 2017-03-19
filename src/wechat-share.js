var nx = require('next-js-core2');
var SHARE_TYPES = {
  timeline:'onMenuShareTimeline',
  friend:'onMenuShareAppMessage',
  qq:'onMenuShareQQ',
  weibo:'onMenuShareWeibo',
  qzone:'onMenuShareQZone'
};

var WechatShare = nx.declare({
  statics:{
    share:function(inTypes,inOptions){
      inTypes.forEach(function(item){
        wx[SHARE_TYPES[item]](inOptions);
      });
    }
  }
});


if (typeof module !== 'undefined' && module.exports) {
	module.exports = WechatShare;
}

