// 'use strict'
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var allPokers = {};

let roomList = []; //所有房间号
let playerRoomMap = {}; //人对应的房间
let playerReadyRoomMap = {}; //房间的准备状态

http.listen(3000, function () {
    console.log('listening on *:3000');
});

io.on('connection', function (socket) {
    console.log('a user connected');

    socket.emit('hello', 'hello!客户端')

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
            if (room == roomNumber) {
                flag = false;
            }
        }
        if (flag) {
            roomList.push(roomNumber);
            var players = [userName];
            playerRoomMap[roomNumber] = players;
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
            if (room == roomNumber) {
                var players = playerRoomMap[roomNumber];
                if (players.length < 3) {
                    players.push(userName);
                    flag = true;
                }
            }
        }
        socket.emit('joinRoomBack', flag);
        if (flag) {
            socket.broadcast.emit("getRoomDataBack"+roomNumber,playerRoomMap[roomNumber]);
        }
    });
    //获取房间信息
       
    socket.on("getRoomData",function(data){

        socket.emit("getRoomDataBack"+data,playerRoomMap[data]);
        
    })

    //准备
        socket.on('readyGame', function (roomNum,roomIndex) {
            console.log("readyGame" + roomNum);

            socket.broadcast.emit('readyGame'+roomNum,roomIndex);  

            var readys =  playerReadyRoomMap[roomNum];
            if (readys != undefined) {
                readys[roomIndex] = 1;
            }else{
                readys = [0,0,0];
                readys[roomIndex] = 1;
            }
            playerReadyRoomMap[roomNum] = readys;
            console.log(readys);
            //检查准备状态
            if (readys[0]==1&&readys[1]==1&&readys[2]==1) {
                //都准备好了
            var cards =  loadAllPoker();
            allPokers[roomNum] =  cards;
            console.log("传递前" + allPokers[roomNum]);
            socket.emit('startGame'+roomNum, cards)
            socket.broadcast.emit('startGame'+roomNum, cards)
            }
        });



    
});

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