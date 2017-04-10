(function () {

  var global = window || this;
  var nx = global.nx || require('next-js-core2');
  var wx = global.wx = global.wx || require('wechat-jssdk');
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
    'getLocalImgData',

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
    statics: {
      VERSION: '1.2.0',
      wx: wx,
      SHARE_TAYPES: ['Timeline', 'AppMessage', 'QQ', 'Weibo', 'QZone'],
      defaults: {
        debug: true,
        jsApiList: [
          'onMenuShareTimeline', 'onMenuShareAppMessage',
          'onMenuShareQQ', 'onMenuShareQZone',
          'onMenuShareWeibo',

          'chooseImage',
          'previewImage',
          'uploadImage',
          'getLocalImgData',

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
      __config: null,
      param: function () {
        return {
          url: global.location.href.split('#')[0]
        };
      },
      updateTitle: function (inTitle) {
        var body = document.getElementsByTagName('body')[0];
        document.title = inTitle;
        var iframe = document.createElement("iframe");
        iframe.setAttribute("src", "favicon.ico");
        iframe.style.visibility = 'hidden';
        iframe.style.position = 'absolute';
        iframe.style.zIndex = -1;

        iframe.addEventListener('load', __loadFn);

        function __loadFn() {
          setTimeout(function () {
            iframe.removeEventListener('load', __loadFn);
            document.body.removeChild(iframe);
          }, 0);
        }

        document.body.appendChild(iframe);
      },
      initialize: function (inOptions) {
        this.__config = inOptions;
        switch (true) {
          case nx.isBoolean(inOptions.optionMenu):
            wx.ready(function () {
              Wxsdk.optionMenu(inOptions.optionMenu);
            });
            break;
        }
      },
      config: function (inSignOptions, inOptions) {
        var options = nx.mix(Wxsdk.defaults, inSignOptions, inOptions);
        Wxsdk.initialize(options);
        if (typeof wx != 'undefined') {
          wx.config(options);
        } else {
          nx.error('Must import this wx api script: <script src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js" charset="utf-8"></script>')
        }
      },
      share: function (inOptions, inTypes) {
        var types = inTypes || Wxsdk.SHARE_TAYPES;
        types.forEach(function (item) {
          var api = 'onMenuShare' + item;
          wx[api](inOptions);
        });
      },
      optionMenu: function (inVisible) {
        return inVisible ? wx.showOptionMenu() : wx.hideOptionMenu();
      },
      syncChooseImageWithData: function (inOptions) {
        var deferred = Q.defer();
        var options = nx.mix({
          count: 9,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera']
        }, inOptions, {
          success: function (response) {
            return Qqueue.queue(response.localIds, Wxsdk.syncGetLocalImgData).then(function (res) {
              var result = res.map(function (item) {
                return item.localData;
              });

              deferred.resolve({
                localIds: response.localIds,
                localDatas: result
              });
            }, function (error) {
              deferred.reject(error);
            });
          }
        });
        wx.chooseImage(options);
        return deferred.promise;
      },
      syncChooseImage: function (inOptions) {
        var deferred = Q.defer();
        var options = nx.mix({
          count: 9,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera']
        }, inOptions, Wxsdk.__toPromiseResponse(deferred));
        wx.chooseImage(options);
        return deferred.promise;
      },
      syncGetLocalImgData: function (inLocalId) {
        //todo:wrap this to common expression? or q has one?
        var deferred = Q.defer();
        var options = nx.mix({localId: inLocalId}, Wxsdk.__toPromiseResponse(deferred));
        wx.getLocalImgData(options);
        return deferred.promise;
      },
      syncUploadImage: function (inOptions) {
        var deferred = Q.defer();
        wx.uploadImage(
          nx.mix(inOptions, Wxsdk.__toPromiseResponse(deferred))
        );
        return deferred.promise;
      },
      syncUploadImages: function (inLocalIds, inOptions) {
        var optionList = [];
        inLocalIds.forEach(function (localId) {
          var option = nx.mix({}, inOptions, {localId: localId});
          optionList.push(option);
        });
        return Qqueue.queue(optionList, Wxsdk.syncUploadImage);
      },
      chooseToUpload: function (inChooseOptions, inUploadOptions) {
        var deferred = Q.defer();
        var uploadOptions = nx.mix({
          isShowProgressTips: 1
        }, inUploadOptions);

        var chooseOptions = nx.mix({
          count: 9,
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera']
        }, inChooseOptions);

        Wxsdk.syncChooseImageWithData(chooseOptions).then(function (response) {
          Wxsdk.syncUploadImages(response.localIds, uploadOptions).then(function (result) {
            result.forEach(function (item, index) {
              item.localData = response.localDatas[index];
            });
            deferred.resolve(result);
          }, function (error) {
            deferred.reject(error);
          });
        }, function (error) {
          deferred.reject(error);
        });
        return deferred.promise;
      },

      __toPromiseResponse: function (inDeferred) {
        return {
          success: function (response) {
            inDeferred.resolve(response);
          },
          error: function (error) {
            inDeferred.reject(error);
          }
        };
      }
    }
  });

  //generate wx basic api:
  generatedApiList.forEach(function (item) {
    nx.defineStatic(Wxsdk, item, wx[item]);
  });


  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Wxsdk;
  }

}());
