"use strict";
cc._RF.push(module, '7a27fblYqFHIZ6bEArNK5Df', 'playerDizhuAction');
// Script/playerDizhuAction.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        buqiangLabel: cc.Label,
        qiangLabel: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {},

    //设置叫和抢
    setFirst: function setFirst(isFirst) {
        if (isFirst) {
            this.buqiangLabel.string = "不叫";
            this.qiangLabel.string = "叫地主";
        } else {
            this.buqiangLabel.string = "不抢";
            this.qiangLabel.string = "抢地主";
        }
    },
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