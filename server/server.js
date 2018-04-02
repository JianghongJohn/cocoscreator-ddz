// 'use strict'
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

let roomControllerMap = {};
let roomList = []; //所有房间号
let roomMap = {}; //房间号对应的房间
let playerRoomMap = {}; //人对应的房间
let playerMap = {}; //人名对应的人

http.listen(3000, function () {
    console.log('listening on *:3000');
});
// 玩家
function Player(socket,name, index) {
    this.name = name;
    this.socket = socket;
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
function Room(socket,roomNum) {
    this.roomNum = roomNum; //房号
    this.playerList = new Array(); //玩家列表
    this.readyCount = 0; //准备数量
    // 地主牌
    this.dizhuPokers = new Array();
    //加入用户
    this.join = function (playerSocket,playerName) {
        let player = new Player(playerSocket,playerName, this.playerList.length);
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
            let room = new Room(socket,roomNumber);

            //创建玩家
            roomList.push(room);

            room.join(socket,userName);
        }
        console.log("创建房间" + roomNumber);
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
                    room.join(socket,userName);
                    flag = true;
                }
            }
        }
        socket.emit('joinRoomBack', flag);
        // if (flag) {
        //     socket.broadcast.emit("getRoomDataBack" + roomNumber, roomMap[roomNumber].playerList);
        // }
    });
    //获取房间信息

    socket.on("getRoomData", function (data) {
        console.log("获取房间信息"+data)
        var room = roomMap[data];
        var playersName = [];
        for (const player of room.playerList) {
            playersName.push(player.name);
        }
        broadCast("getRoomDataBack"  ,playersName,room);

    })

    //准备
    socket.on('readyGame', function (roomNum, roomIndex) {
        console.log("readyGame" + roomNum);

        var room = roomMap[roomNum];

        broadCast('readyGame' + roomNum, roomIndex,room);
        
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
            //开始抢地主序号
            let dizhuIndex = Math.round(Math.random() * 10) % 3;
            broadCast('startGame' + roomNum,dizhuIndex,room)
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
    //刷新回显Poker数量
    socket.on("refreshCardsCount", function (roomNum) {
        var room = roomMap[roomNum];
        var players = room.playerList;
        socket.emit('refreshCardsCountBack' + roomNum ,[players[0].pokerList.length,players[1].pokerList.length,players[2].pokerList.length])

    });
    //叫地主
    socket.on("qiangdizhu", function (msg) {
        let data =  parseJson(msg);
        qiangdizhu(data);
    });
});
/**
 * 广播
 * @param {消息文字} 消息文字 
 * @param {消息内容} 消息内容
 * @param {房间号} 房间号
 */
function broadCast(type, msg ,room) {
    //获取该用户的socket对象
    var players = room.playerList;
    for (const player of players) {
        
        socket = player.socket;
        console.log("传递消息："+type+"\n内容："+msg);
        socket.emit(type,msg);
    }
}

/**
 * 
 * @param {根据房间号生成Poker并分配} room 
 */
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
    let pc = new PlayController(room);
    roomControllerMap[room.roomNum] = pc;
    pc.dizhuPokers = room.dizhuPokers;
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

function qiangdizhu (msg) {
    //抢地主逻辑
	console.log('onQiangDizhu');
	let msgBean = msg;

	let playerIndex = msgBean.playerIndex;
	let roomNum = msgBean.roomNum;
	let qiangdizhu = msgBean.qiangdizhu;

	let room = roomMap[roomNum];
	let pc = roomControllerMap[roomNum];
    let player = room.playerList[playerIndex];
    
	player.noGrab = !qiangdizhu;

    if (room && pc && player) {
		if (qiangdizhu) {
			pc.lastGrabIndex = player.index;
		}
		pc.remainCount--;

		if (pc.passCount >= 2) {
			if (pc.lastGrabIndex == -1) {//重新发牌
				dealingCard(room);
			} else {//通知出牌
				notifyPlayerPlay(room, pc);
			}
		} else {
			if (pc.remainCount <= 0) {
				if (pc.lastGrabIndex == -1) {//重新发牌
					dealingCard(room);
				}
				else {//通知出牌
					notifyPlayerPlay(room, pc);
				}
			} else {
				if (qiangdizhu == false)
					pc.passCount++;

				//下一家是否不抢
				let nextIndex = (player.index + 1) % 3;
				let nextPlayer = room.playerList[nextIndex];
				console.log('noGrab:', nextPlayer.noGrab);
				if (nextPlayer.noGrab === null || !nextPlayer.noGrab) {//下一家上一次抢地主为空或抢地主，则通知再抢地主
                    let _msg = { f: nextPlayer.name + 'qiangdizhu', msg: 'qiangdizhu' };
                    let message = qiangdizhu

					broadCast(_msg);
				} else {
					//判断下下家
					let doubleNextIndex = (player.index + 2) % 3;
					let doubleNextPlayer = room.playerList[doubleNextIndex];
					console.log('下下家：', doubleNextIndex, ' lastGrabIndex:', pc.lastGrabIndex);
					if (doubleNextIndex == pc.lastGrabIndex) {//通知下下出牌
						notifyPlayerPlay(room, pc);
					}
					else {//通知下下家抢地主
						let _msg = { f: doubleNextPlayer.name + 'qiangdizhu', msg: 'qiangdizhu' };
						broadCast(_msg);
					}
				}
			}
		}
	}
}




//字符串转json
function parseJson(s) {
	try {
		return JSON.parse(s);
	} catch (e) { }
};

//json转字符串
function stringifyJson(j) {
	try {
		return JSON.stringify(j);
	} catch (e) { }
};

//检测变量是否存在
function checkExist(obj) {
	return typeof obj != 'undefined';
};