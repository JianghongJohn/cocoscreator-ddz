"use strict";
cc._RF.push(module, '7a27fblYqFHIZ6bEArNK5Df', 'playerDizhuAction');
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