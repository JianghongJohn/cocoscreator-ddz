
// 'use strict'
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var allPokers = [];

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
    console.log('a user connected');
    
    socket.emit('hello', 'hello!客户端')
    
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });

    socket.on('getAllCards', function(){
        console.log('getAllCards');
        loadAllPoker();
        console.log("传递前"+allPokers);
        socket.emit('loadCards', allPokers)
      });


  });
  
  //加载所有卡片
function loadAllPoker(){
    allPokers = [];
    for (let i = 0; i < 54; i++) {
        allPokers.push(i+1);
    }
    allPokers = shuffleArray(allPokers);

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
