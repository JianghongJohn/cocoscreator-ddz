

cc.Class({
    extends: cc.Component,

    properties: {
        buqiangBtn: cc.Button, 
        qiangBtn: cc.Button, 
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    buqiang(){
        let mes = {playerIndex:Global.roomIndex,roomNum: Global.roomNum,qiangdizhu:false};
        Network.socket.emit('qiangdizhu',  Network.stringifyJson(mes));
        this.node.active = false;
    },
    qiang(){
        let mes = {playerIndex:Global.roomIndex,roomNum: Global.roomNum,qiangdizhu:true};
        Network.socket.emit('qiangdizhu',   Network.stringifyJson(mes));
        this.node.active = false;
    }
    // update (dt) {},
});
