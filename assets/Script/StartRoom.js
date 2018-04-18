
cc.Class({
    extends: cc.Component,

    properties: {
        roomNumber: cc.EditBox,
        userName: cc.EditBox,
    },
    //创建房间
    createCallback(event) {
        let number = this.roomNumber.string;
        let name = this.userName.string;
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
    joinCallback(event) {
        let number = this.roomNumber.string;
        let name = this.userName.string;
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
                    Global.roomWaitType = "join"
                    // 跳转房间等候场景
                    cc.director.loadScene('WaitingRoom');
                }else{
                    alert('房间无法加入');
                }
            });
            Network.socket.emit('joinRoom', number,name);

        }
    },
    onLoad() {
        //启动网络
        Network.initNetwork();
    },

    start() {

    },

    // update (dt) {},
});