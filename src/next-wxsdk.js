(function (global) {

  var nx = global.nx || require('next-js-core2');
  var TYPES = ['Timeline','AppMessage','QQ','Weibo','QZone'];
  var wx = global.wx || require('wechat-jssdk');

  var Wxsdk = nx.declare('nx.Wxsdk', {
    statics:{
      version:'1.2.0',
      config:function(inOptions){
        if (typeof wx != 'undefined') {
          wx.config(inOptions);
        } else {
          nx.error('Must import this wx api script: <script src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js" charset="utf-8"></script>')
        }
      },
      ready:function(inCallback,inContext){
        wx.ready(function(){
          inCallback.call(inContext);
        });
      },
      share:function(inOptions){
        (inTypes || TYPES).forEach(function(item){
          var api = nx.format('onMenuShare{0}',[item]);
          wx[api](inOptions);
        });
      }
    }
  });


  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Wxsdk;
  }

}(this));
