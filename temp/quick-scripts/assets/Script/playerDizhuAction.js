(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/playerDizhuAction.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7a27fblYqFHIZ6bEArNK5Df', 'playerDizhuAction', __filename);
// Script/playerDizhuAction.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        buqiangBtn: cc.Button,
        qiangBtn: cc.Button
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {},
    buqiang: function buqiang() {
        var mes = { playerIndex: Global.roomIndex, roomNum: Global.roomNum, qiangdizhu: false };
        Network.socket.emit('qiangdizhu', Network.stringifyJson(mes));
        this.node.active = false;
    },
    qiang: function qiang() {
        var mes = { playerIndex: Global.roomIndex, roomNum: Global.roomNum, qiangdizhu: true };
        Network.socket.emit('qiangdizhu', Network.stringifyJson(mes));
        this.node.active = false;
    }
    // update (dt) {},

});

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
        //# sourceMappingURL=playerDizhuAction.js.map
        