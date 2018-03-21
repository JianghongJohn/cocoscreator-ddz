(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/NetWork.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c86c3HOM2NJ9q9FHrWeZOmk', 'NetWork', __filename);
// Script/NetWork.js

'use strict';

var instance = null;
var Network = cc.Class({
    properties: {
        socket: null
    },
    initNetwork: function initNetwork() {
        var socketIo = io.connect('192.168.0.56:3000');
        this.socket = socketIo;
    },

    // 发送消息给服务器并接收
    send: function send(type, sendData, callback) {
        if (cc.sys.isNative) {
            sendData = JSON.stringify(sendData);
        }
        this.socket.emit(type, sendData);
        // 由于目前 Native 不支持 once
        // 并且 on 是只执行一次的所以暂时先这样修改
        if (cc.sys.isNative) {
            this.socket.on(type, function (data) {
                if (cc.sys.isNative) {
                    data = JSON.parse(data);
                }
                callback(data || null);
            });
        } else {
            this.socket.once(type, function (data) {
                if (cc.sys.isNative) {
                    data = JSON.parse(data);
                }
                callback(data || null);
            });
        }
    },

    // 单纯接收服务器消息
    receive: function receive(type, callback) {
        // 由于目前 Native 不支持 once
        // 并且 on 是只执行一次的所以暂时先这样修改
        if (cc.sys.isNative) {
            this.socket.on(type, function (data) {
                if (cc.sys.isNative) {
                    data = JSON.parse(data);
                }
                callback(data || null);
            });
        } else {
            this.socket.once(type, function (data) {
                if (cc.sys.isNative) {
                    data = JSON.parse(data);
                }
                callback(data || null);
            });
        }
    }
});

window.Network = instance ? instance : new Network();

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=NetWork.js.map
        