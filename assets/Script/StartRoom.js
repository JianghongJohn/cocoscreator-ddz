import { Socket } from "dgram";

cc.Class({
    extends: cc.Component,

    properties: {
       roomNumber:cc.EditBox,
       userName:cc.EditBox,
    },
        //创建房间
        createCallback(event) {
            let number = this.roomNumber.string;
            let name = this.userName.string;
            // alert(playerName);
            if (number == '') {
                alert('请输入房间号');
            }else if (name == '') {
                alert('请输入昵称');
            }else{
                Global.playerName = playerName;
                Global.roomNum = number;
                // 跳转房间等候场景
                cc.director.loadScene('RoomWait');
            }
        },
    
        //加入房间
        joinCallback(event) {
            let number = this.roomNumber.string;
            let name = this.userName.string;
            // alert(playerName);
            if (number == '') {
                alert('请输入房间号');
            }else if (name == '') {
                alert('请输入昵称');
            }
            else {
                Global.playerName = playerName;
                Global.roomNum = number;
                // 跳转房间等候场景
                cc.director.loadScene('RoomWait');
            }
        },
    onLoad () {
        //启动网络
        Network.initNetwork();
    },

    start () {

    },

    // update (dt) {},
});
