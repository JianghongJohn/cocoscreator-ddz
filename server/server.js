// 'use strict'
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var _socket;

let roomControllerMap = {};
let roomList = []; //所有房间号
let roomMap = {}; //房间号对应的房间
let playerRoomMap = {}; //人对应的房间
let playerMap = {}; //人名对应的人

http.listen(3000, function () {
    console.log('listening on *:3000');
});
// 玩家
function Player(name, index) {
    this.name = name;
    this.index = index;
    this.isPass = false;
    this.isReady = false;
    this.pokerList = new Array();
    this.noGrab = null; //不抢地主
    this.resetNoGrab = function () {
        this.noGrab = null;
    }
};
//房间
function Room(roomNum) {
    this.roomNum = roomNum; //房号
    this.playerList = new Array(); //玩家列表
    this.readyCount = 0; //准备数量
    // 地主牌
    this.dizhuPokers = new Array();
    //加入用户
    this.join = function (playerName) {
        let player = new Player(playerName, this.playerList.length);
        playerMap[playerName] = player;

        this.playerList.push(player);
        playerRoomMap[playerName] = this;
    };
    this.leave = function (player) {
        this.playerList.splice(player.index, 1);
    };

    roomMap[this.roomNum] = this;

    this.addReadyCount = function () {
        this.readyCount++;
    };
    this.subReadyCount = function () {
        this.readyCount--;
    };
    this.resetReadyCount = function () {
        this.readyCount = 0;
    };
};
//控制
function PlayController(room) {
    this.room = room;
    // 正在出牌的序号（0,1,2）
    this.currentPlayingIndex;
    //上一首牌
    this.lastPokers;
    //上一手牌的牌型包装器
    this.lastPokerWraper;
    // 第一手牌
    this.isFirstPoker;
    // 地主牌
    this.dizhuPokers;

    this.lastGrabIndex = -1; //最后抢地主的序号
    this.passCount = 0; //不抢的次数
    this.remainCount = 4; //剩余抢地主次数
    this.resetGrab = function () {
        this.lastGrabIndex = -1;
        this.passCount = 0; //不抢的次数
        this.remainCount = 4; //剩余抢地主次数
    }
};

io.on('connection', function (socket) {
    console.log('a user connected');
    _socket = socket;

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    //获取牌
    // socket.on('getAllCards', function () {
    //     console.log('getAllCards');
    //     loadAllPoker();
    //     console.log("传递前" + allPokers);
    //     socket.emit('startGame', allPokers)
    // });
    //创建房间号
    socket.on('creatRoom', function (roomNumber, userName) {
        var flag = true;
        //检查所有房间
        for (const room of roomList) {
            if (room.roomNum == roomNumber) {
                flag = false;
            }
        }
        if (flag) {
            //创建房间
            let room = new Room(roomNumber);

            //创建玩家
            roomList.push(room);

            room.join(userName);
        }
        console.log("创建房间" + playerRoomMap.roomNumber);
        socket.emit('creatRoomReturn', flag);
    });
    //加入房间号
    socket.on('joinRoom', function (roomNumber, userName) {
        console.log("joinRoom")
        var flag = false;
        //检查所有房间,有且小于三
        for (const room of roomList) {
            if (room.roomNum == roomNumber) {
                var players = room.playerList;
                if (players.length < 3) {
                    room.join(userName);
                    flag = true;
                }
            }
        }
        socket.emit('joinRoomBack', flag);
        if (flag) {
            socket.broadcast.emit("getRoomDataBack" + roomNumber, roomMap[roomNumber].playerList);
        }
    });
    //获取房间信息

    socket.on("getRoomData", function (data) {

        socket.emit("getRoomDataBack" + data, roomMap[data].playerList);

    })

    //准备
    socket.on('readyGame', function (roomNum, roomIndex) {
        console.log("readyGame" + roomNum);

        socket.broadcast.emit('readyGame' + roomNum, roomIndex);

        var room = roomMap[roomNum];
        players = room.playerList;
        player = players[roomIndex];
        //玩家准备状态
        player.isReady = !player.isReady;
        if (player.isReady) {
            room.addReadyCount();
        } else {
            room.subReadyCount();
        }
        //检查准备状态
        if (room.readyCount == 3) {
            //都准备好了
            distributeCards(room);
            socket.emit('startGame' + roomNum)
            socket.broadcast.emit('startGame' + roomNum)
        }
    });
    socket.on("getCards", function (roomNum,playerIndex) {
        console.log("获取卡"+roomNum+"位置"+playerIndex)
        var room = roomMap[roomNum];
        var cards;
        //地主牌
        if (playerIndex>2) {
            cards = room.dizhuPokers;
            socket.emit('getDipaiCardsBack' + roomNum ,cards)
        }else{
            players = room.playerList;
            player = players[playerIndex];
            cards = player.pokerList;
            socket.emit('getCardsBack' + roomNum ,cards)
        }
        
    })

    socket.on("refreshCardsCount", function (roomNum) {
        var room = roomMap[roomNum];
        var players = room.playerList;
        socket.emit('refreshCardsCountBack' + roomNum ,[players[0].pokerList.length,players[1].pokerList.length,players[2].pokerList.length])

    })
});

function broadCast(type, msg) {
    _socket.broadcast.emit(type, msg)
}

function distributeCards(room) {
    var cards = loadAllPoker();
    var players = room.playerList;
    for (let index = 0; index < cards.length; index++) {
        const element = cards[index];

        if (index >= 0 && index < 17) {
            players[0].pokerList.push(element);
        }
        if (index >= 17 && index < 34) {
            players[1].pokerList.push(element);
        }
        if (index >= 34 && index < 51) {
            players[2].pokerList.push(element);
        }
        if (index >= 51 && index < 54) {
            room.dizhuPokers.push(element);
        }
    }
    console.log("地主牌"+room.dizhuPokers);
}
//加载所有卡片
function loadAllPoker() {
    var pokers = [];
    for (let i = 0; i < 54; i++) {
        pokers.push(i + 1);
    }
    pokers = shuffleArray(pokers);
    return pokers;
};
//洗牌算法
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        // 在正数的时候相当于Math.floor()向下取整,负数的时候相当于Math.ceil()：
        var j = (Math.random() * (i + 1)) | 0;
        // console.log(j);
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};