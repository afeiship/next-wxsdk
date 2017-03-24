(function (global) {

  var nx = global.nx || require('next-js-core2');
  var wx = global.wx || require('wechat-jssdk');
  var Q = global.Q || require('q');

  var Wxsdk = nx.declare('nx.Wxsdk', {
    statics:{
      VERSION:'1.2.0',
      SHARE_TAYPES:['Timeline','AppMessage','QQ','Weibo','QZone'],
      defaults:{
        debug:true,
        jsApiList:[
          'onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ',
          'onMenuShareWeibo','onMenuShareQZone'
        ]
      },
      config:function(inOptions){
        var options = nx.mix(Wxsdk.defaults,inOptions);
        if (typeof wx != 'undefined') {
          wx.config(options);
        } else {
          nx.error('Must import this wx api script: <script src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js" charset="utf-8"></script>')
        }
      },
      ready:function(inCallback){
        return wx.ready(inCallback);
      },
      checkJsApi:function(inOptions){
        return wx.checkJsApi(inOptions);
      },
      error:function(inCallback){
        return Q.nfcall(wx.error,inCallback);
      },
      share:function(inOptions,inTypes){
        var types = inTypes || Wxsdk.SHARE_TAYPES;
        types.forEach(function(item){
          var api = 'onMenuShare'+item;
          wx[api](inOptions);
        });
      },
      chooseImage:function(inOptions){
        return Q.denodeify(wx.chooseImage,inOptions);
      }
    }
  });


  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Wxsdk;
  }

}(this));
