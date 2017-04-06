(function () {

  var global = window || this;
  var nx = global.nx || require('next-js-core2');
  var wx = global.wx || require('wechat-jssdk');
  var Q = global.Q || require('q');
  var Qqueue = nx.Qqueue || require('next-qqueue');

  var generatedApiList = [
    //basic:
    'ready',
    'checkJsApi',
    'error',
    //share api:
    'onMenuShareTimeline',
    'onMenuShareAppMessage',
    'onMenuShareQQ',
    'onMenuShareWeibo',
    'onMenuShareQZone',

    //about images:
    'chooseImage',
    'previewImage',
    'uploadImage',

    //back to wechat:
    'closeWindow',

    //hide/showOptionMenu
    'hideOptionMenu',
    'showOptionMenu',

    //start/stopRecord
    'startRecord',
    'stopRecord',
    'onVoiceRecordEnd',
    'openLocation',
    'getLocation',
    'scanQRCode',
    'chooseWXPay',
    'openAdreess'
  ];


  var Wxsdk = nx.declare('nx.Wxsdk', {
    statics:{
      VERSION:'1.2.0',
      wx:wx,
      SHARE_TAYPES:['Timeline','AppMessage','QQ','Weibo','QZone'],
      defaults:{
        debug:true,
        jsApiList:[
          'onMenuShareTimeline','onMenuShareAppMessage',
          'onMenuShareQQ','onMenuShareQZone',
          'onMenuShareWeibo',

          'chooseImage',
          'previewImage',
          'uploadImage',

          'closeWindow',
          'hideOptionMenu',
          'showOptionMenu',

          'openLocation',
          'getLocation',

          'scanQRCode',
          'chooseWXPay',

          'openAdreess'
        ]
      },
      __config:null,
      param:function(){
        return {
          url: global.location.href.split('#')[0]
        };
      },
      initialize:function(inOptions){
        this.__config = inOptions;
        switch(true){
          case nx.isBoolean(inOptions.optionMenu):
            wx.ready(function(){
              this.optionMenu(inOptions.optionMenu);
            });
          break;
        }
      },
      config:function(inSignOptions,inOptions){
        var options = nx.mix(Wxsdk.defaults,inSignOptions,inOptions);
        Wxsdk.initialize(options);
        if (typeof wx != 'undefined') {
          wx.config(options);
        } else {
          nx.error('Must import this wx api script: <script src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js" charset="utf-8"></script>')
        }
      },
      share:function(inOptions,inTypes){
        var types = inTypes || Wxsdk.SHARE_TAYPES;
        types.forEach(function(item){
          var api = 'onMenuShare'+item;
          wx[api](inOptions);
        });
      },
      optionMenu:function(inVisible){
        return inVisible ? wx.showOptionMenu() : wx.hideOptionMenu();
      },
      syncUploadImage:function(inOptions){
        var deferred = Q.defer();
        wx.uploadImage(
          nx.mix(inOptions,{
            success:function(response){
              deferred.resolve(response);
            },
            error:function(error){
              deferred.reject(error);
            }
          })
        );
        return deferred.promise;
      },
      syncUploadImages:function(inLocalIds,inOptions){
        var optionList = [];
        inLocalIds.forEach(function(localId){
          inOptions.localId = localId;
          optionList.push(inOptions);
        });
        return Qqueue.queue(optionList,Wxsdk.syncUploadImage);
      }
    }
  });

  //generate wx basic api:
  generatedApiList.forEach(function(item){
    nx.defineStatic(Wxsdk,item,wx[item]);
  });




  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Wxsdk;
  }

}());
