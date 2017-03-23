(function (global) {

  var nx = global.nx || require('next-js-core2');
  // types: ['Timeline','AppMessage','QQ','Weibo','QZone'];
  var Wxsdk = nx.declare('nx.Wxsdk', {
    statics:{
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
      share:function(inTypes,inOptions){
        inTypes.forEach(function(item){
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
