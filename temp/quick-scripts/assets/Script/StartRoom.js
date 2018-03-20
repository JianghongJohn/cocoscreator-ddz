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
            Network.socket.emit('creatRoom', number, name);
            Network.socket.on('creatRoomReturn', function (flag) {
                if (flag) {
                    Global.playerName = name;
                    Global.roomNum = number;
                    // 跳转房间等候场景
                    cc.director.loadScene('WaitingRoom');
                } else {
                    alert('房间已存在您可以加入游戏');
                }
            });
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
            //加入房间号
            Network.socket.on('joinRoomBack', function (flag) {
                if (flag) {
                    Global.playerName = name;
                    Global.roomNum = number;
                    // 跳转房间等候场景
                    cc.director.loadScene('WaitingRoom');
                } else {
                    alert('房间无法加入');
                }
            });
            Network.socket.emit('joinRoom', number, name);
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
        