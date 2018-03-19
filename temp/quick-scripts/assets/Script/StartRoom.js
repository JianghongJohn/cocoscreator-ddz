(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/StartRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1faec3ANxtGVbPEFSkiTDZJ', 'StartRoom', __filename);
// Script/StartRoom.js

'use strict';

var _dgram = require('dgram');

cc.Class({
    extends: cc.Component,

    properties: {
        roomNumber: cc.EditBox,
        userName: cc.EditBox
    },
    //创建房间
    createCallback: function createCallback(event) {
        var number = this.roomNumber.string;
        var name = this.userName.string;
        // alert(playerName);
        if (number == '') {
            alert('请输入房间号');
        } else if (name == '') {
            alert('请输入昵称');
        } else {
            Global.playerName = playerName;
            Global.roomNum = number;
            // 跳转房间等候场景
            cc.director.loadScene('RoomWait');
        }
    },


    //加入房间
    joinCallback: function joinCallback(event) {
        var number = this.roomNumber.string;
        var name = this.userName.string;
        // alert(playerName);
        if (number == '') {
            alert('请输入房间号');
        } else if (name == '') {
            alert('请输入昵称');
        } else {
            Global.playerName = playerName;
            Global.roomNum = number;
            // 跳转房间等候场景
            cc.director.loadScene('RoomWait');
        }
    },
    onLoad: function onLoad() {
        //启动网络
        Network.initNetwork();
    },
    start: function start() {}
}

// update (dt) {},
);

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
        //# sourceMappingURL=StartRoom.js.map
        