
var nx = require('next-js-core2');

var WechatUpload = nx.declare({
  statics:{
    upload:function(inOptions){
      // wx.config(inOptions);
    }
  }
});


if (typeof module !== 'undefined' && module.exports) {
	module.exports = WechatUpload;
}



