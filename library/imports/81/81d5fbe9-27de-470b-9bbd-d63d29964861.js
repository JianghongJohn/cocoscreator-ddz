"use strict";
cc._RF.push(module, '81d5fvpJ95HC5u91j0plkhh', 'playing');
// Script/playing.js

'use strict';

// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var PokerObj = require("Poker");
var pokerTypes = require('pokerTypes');
var PlayerType = cc.Enum({
    left: 0,
    right: -1,
    player: -1,
    dipai: -1,
    shoupai: -1
});
cc.Class({
    extends: cc.Component,

    properties: {
        poker: cc.Prefab, //扑克
        allPokers: [], //所有牌
        // leftPokers: [], //左边牌
        // rightPokers: [], //右边牌
        playerPokers: [], //玩家牌
        dipaiPokers: [], //底牌
        leftPokersOut: [], //左边打出牌
        rightPokersOut: [], //右边打出牌
        playerPokersOut: [], //玩家打出牌
        pokerSpriteFrameMap: {
            default: {},
            visible: false
        },
        leftReady: cc.Label, //左边准备
        rightReady: cc.Label, //右边准备
        playerReady: cc.Label, //玩家准备
        //控制的东西
        maskBackground: cc.Node, //开始前的遮罩
        startBtn: cc.Button, //开始按钮
        leftCount: cc.Label, //左边数量
        leftbuchu: cc.Label, //左边不出
        leftShowPoker: cc.Node, //左边展示Poker
        rightCount: cc.Label, //右边数量
        rightShowPoker: cc.Node, //右边展示Poker
        rightbuchu: cc.Label, //右边不出

        playerbuchu: cc.Label, //玩家不出或不抢

        playerHandCards: cc.Node, //玩家手牌
        playerOutCards: cc.Node, //玩家出牌
        playerAction: cc.Node, //玩家按钮
        playerDizhuAction: cc.Node, //玩家按钮

        dipaiShowPoker: cc.Node, //右边展示Poker

        leftTip: cc.Node, //左边手牌了
        rightTip: cc.Node, //右边出牌了
        playerTip: cc.Node //玩家出牌了
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {

        this.socketAction();
        this.loadRes();
        this.setIndex();
    },

    /**
     * socket处理
     */
    socketAction: function socketAction() {
        if (Network.socket == null) {
            //启动网络
            Network.initNetwork();
        }
        var self = this;
        // Network.socket.on('hello', function (msg) {
        //     console.log(msg);
        // });
        console.log(Global.roomNum);
        //准备开始
        this.socketOn();
    },

    //加载卡片资源
    loadRes: function loadRes() {

        var self = this;
        cc.loader.loadRes('poker', cc.SpriteAtlas, function (err, assets) {
            console.log('====' + assets);

            var sflist = assets.getSpriteFrames();
            for (var i = 0; i < sflist.length; i++) {
                var sf = sflist[i];
                self.pokerSpriteFrameMap[sf._name] = sf;
            }
            console.log("获取完全部Poker");
        });
    },

    //测试获取Poker
    startPoker: function startPoker() {
        if (this.playerReady.string == "已准备") {
            this.playerReady.string = "请准备";
        } else {
            this.playerReady.string = "已准备";
        }

        Network.socket.emit('readyGame', Global.roomNum, Global.roomIndex);
    },

    //洗牌算法
    shuffleArray: function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            // 在正数的时候相当于Math.floor()向下取整,负数的时候相当于Math.ceil()：
            var j = Math.random() * (i + 1) | 0;
            // console.log(j);
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    },

    /**
     * 重新发牌开始
     */
    restartGame: function restartGame() {

        //清空页面的一些东西
        var playerHandCardsShow = this.playerHandCards.getComponent('ShowPoker');
        playerHandCardsShow.desTroyPokers(new Array());

        var dipai = this.dipaiShowPoker.getComponent('ShowPoker');
        dipai.desTroyPokers(new Array());

        var left = this.leftShowPoker.getComponent('ShowPoker');
        left.desTroyPokers(new Array());

        var right = this.rightShowPoker.getComponent('ShowPoker');
        right.desTroyPokers(new Array());
    },
    testBtn: function testBtn() {
        Network.socket.emit('restarGame', Global.roomNum, Global.roomIndex);
    },

    /**
     * 显示poker
     * @param {数字Poker} cards 
     * @param {展示位置} playerType 
     */
    startShowPokers: function startShowPokers(cards, playerType) {

        var pokerDatas = [];
        var pokers = this.loadAllPoker(cards);
        for (var i = 0; i < cards.length; i++) {
            var pokerSprite = pokers[i];
            pokerDatas[i] = pokerSprite;
        }
        //左边
        if (playerType == PlayerType.left) {
            this.leftPokersOut = pokerDatas;
            pokerTypes.bubbleSortCards(this.leftPokersOut);
        } else if (playerType == PlayerType.right) {
            this.rightPokersOut = pokerDatas;
            pokerTypes.bubbleSortCards(this.rightPokersOut);
        } else if (playerType == PlayerType.shoupai) {
            this.playerPokersOut = pokerDatas;
            pokerTypes.bubbleSortCards(this.playerPokersOut);
        }
        this.showCards(playerType);
    },

    //生成当前玩家
    startPlayer: function startPlayer(cards) {
        this.playerPokers = [];
        var pokers = this.loadAllPoker(cards);
        for (var i = 0; i < cards.length; i++) {
            var pokerSprite = pokers[i];
            this.playerPokers[i] = pokerSprite;
        }
        pokerTypes.bubbleSortCards(this.playerPokers);
        this.showCards(PlayerType.player);
        //刷新数量
        this.refreshCount();
    },

    //生成三张底牌
    startDipai: function startDipai(cards) {
        this.dipaiPokers = [];
        var pokers = this.loadAllPoker(cards);
        for (var i = 0; i < cards.length; i++) {
            var pokerSprite = pokers[i];
            this.dipaiPokers[i] = pokerSprite;
        }
        this.showCards(PlayerType.dipai);
        // this.showPokers(this.dipaiPokers, PlayerType.dipai);
    },

    //调用子类的展示方法
    showCards: function showCards(type) {
        if (type == PlayerType.left) {
            var showPoker = this.leftShowPoker.getComponent('ShowPoker');
            showPoker.showPokers(this.leftPokersOut, PlayerType.left);
        } else if (type == PlayerType.right) {
            var showPoker = this.rightShowPoker.getComponent('ShowPoker');
            showPoker.showPokers(this.rightPokersOut, PlayerType.right);
        } else if (type == PlayerType.player) {
            var showPoker = this.playerHandCards.getComponent('ShowPoker');
            showPoker.showPokers(this.playerPokers, PlayerType.player);
        } else if (type == PlayerType.shoupai) {
            //打出的牌
            var showPoker = this.playerOutCards.getComponent('ShowPoker');
            showPoker.showPokers(this.playerPokersOut, PlayerType.shoupai);
        } else {
            var showPoker = this.dipaiShowPoker.getComponent('ShowPoker');
            showPoker.showPokers(this.dipaiPokers, PlayerType.dipai);
        }
    },
    loadAllPoker: function loadAllPoker(originCards) {

        var pokers = [];
        for (var i = 0; i < originCards.length; i++) {

            var pokerSprite = cc.instantiate(this.poker);
            var Poker = pokerSprite.getComponent('Poker');
            var pokerName = Poker.creatCard(originCards[i])._imageName;
            // console.log("名称" + pokerName);
            pokerSprite.getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrameMap[pokerName];

            pokers.push(pokerSprite);
        }
        return pokers;
    },


    //刷新显示数量
    refreshCount: function refreshCount() {
        var self = this;
        Network.socket.emit('refreshCardsCount', Global.roomNum);
    },

    //设置Index
    setIndex: function setIndex() {
        if (Global.roomIndex == 0) {
            this.leftIndex = 2;
            this.rightIndex = 1;
        } else if (Global.roomIndex == 1) {
            this.leftIndex = 0;
            this.rightIndex = 2;
        } else {
            this.leftIndex = 1;
            this.rightIndex = 0;
        }
    },

    //设置提示的显示
    setTip: function setTip(index) {
        this.leftTip.active = index == this.leftIndex;
        this.rightTip.active = index == this.rightIndex;
        this.playerTip.active = index == Global.roomIndex;
    },

    /**
     * socket接收处理
     */
    socketOn: function socketOn() {
        var self = this;
        Network.socket.on("readyGame" + Global.roomNum, function (roomIndex) {
            if (roomIndex == self.leftIndex) {
                self.leftReady.string = "准备";
            } else if (roomIndex == self.rightIndex) {
                self.rightReady.string = "准备";
            } else {}
        });
        //获取所有Poker
        Network.socket.on('startGame' + Global.roomNum, function (playerIndex) {
            self.restartGame();
            //隐藏控件
            self.maskBackground.active = false;

            self.leftbuchu.string = "";

            self.rightbuchu.string = "";

            self.playerbuchu.string = "";

            self.playerAction.active = false;

            self.playerDizhuAction.active = false;

            if (playerIndex == Global.roomIndex) {

                self.playerDizhuAction.active = true;
            }
            //当前操作对象
            self.setTip(playerIndex);

            Network.socket.emit('getCards', Global.roomNum, Global.roomIndex);
            Network.socket.on('getCardsBack' + Global.roomNum, function (cards) {
                console.log(cards);
                self.startPlayer(cards);
            });
            Network.socket.on('getDipaiCardsBack' + Global.roomNum, function (cards) {
                console.log(cards);
                self.startDipai(cards);
            });
        });
        //有人抢地主
        Network.socket.on('qiangdizhuResult', function (msg) {

            console.log(msg);
            var data = Network.parseJson(msg);
            var playerIndex = data.index;
            var qiangdizhu = data.qiangdizhuResult;

            if (playerIndex == self.leftIndex) {
                self.leftbuchu.string = qiangdizhu ? "抢地主" : "不抢";
            } else if (playerIndex == self.rightIndex) {
                self.rightbuchu.string = qiangdizhu ? "抢地主" : "不抢";
            } else {
                self.playerbuchu.string = qiangdizhu ? "抢地主" : "不抢";
            }
        });
        //目前抢地主用户
        Network.socket.on('qiangdizhuNotice', function (msg) {
            var data = Network.parseJson(msg);
            var isFirst = data.isFirst;
            //当前操作对象
            self.setTip(data.nextIndex);

            if (data.nextIndex == Global.roomIndex) {
                self.playerDizhuAction.active = true;
            } else {
                self.playerDizhuAction.active = false;
            }
            //叫地主和抢地主
            if (isFirst) {
                var dizhuNode = self.playerDizhuAction.getComponent('playerDizhuAction');
                dizhuNode.setFirst(true);
            } else {
                var _dizhuNode = self.playerDizhuAction.getComponent('playerDizhuAction');
                _dizhuNode.setFirst(false);
            }
        });
        //开始出牌
        Network.socket.on('startPlayerPoker', function (playerIndex) {
            self.playerDizhuAction.active = false;
            self.leftbuchu.string = "";
            self.rightbuchu.string = "";
            self.playerbuchu.string = "";
            //当前操作对象
            self.setTip(playerIndex);
            //展示底牌
            Network.socket.emit('getCards', Global.roomNum, 3);
            if (playerIndex == self.leftIndex) {
                self.leftbuchu.string = "出牌";
                self.refreshCount();
            } else if (playerIndex == self.rightIndex) {
                self.rightbuchu.string = "出牌";
                self.refreshCount();
            } else {
                self.playerAction.active = true;
                Network.socket.emit('getCards', Global.roomNum, Global.roomIndex);
                //重置poker
                var showPoker = self.playerHandCards.getComponent('ShowPoker');
                showPoker.pokerAllDown();
            }
        });
        Network.socket.on('playeAction', function (playerIndex) {

            //当前操作对象
            self.setTip(playerIndex);
            if (playerIndex == Global.roomIndex) {
                self.playerAction.active = true;
                var blank = new Array();
                self.startShowPokers(blank, PlayerType.shoupai);
            }
        });
        //不出
        Network.socket.on('buchu', function (playerIndex) {
            var blank = new Array();
            if (playerIndex == self.leftIndex) {
                self.leftbuchu.string = "不出";

                self.startShowPokers(blank, PlayerType.left);
            } else if (playerIndex == self.rightIndex) {
                self.rightbuchu.string = "不出";
                self.startShowPokers(blank, PlayerType.right);
            } else {
                self.playerAction.active = false;
                self.playerbuchu.string = "不出";
                self.startShowPokers(blank, PlayerType.shoupai);
                //重置poker
                var showPoker = this.playerHandCards.getComponent('ShowPoker');
                showPoker.pokerAllDown();
            }
        });
        //出牌
        Network.socket.on('chupai', function (mes) {
            var data = Network.parseJson(mes);
            var playerIndex = data.playerIndex;
            var pokers = data.pokers;

            if (playerIndex == self.leftIndex) {
                self.leftbuchu.string = "";
                self.refreshCount();
                //出的牌
                self.startShowPokers(pokers, PlayerType.left);
            } else if (playerIndex == self.rightIndex) {
                self.rightbuchu.string = "";
                self.refreshCount();
                //出的牌
                self.startShowPokers(pokers, PlayerType.right);
            } else {
                self.playerAction.active = false;
                //手牌
                Network.socket.emit('getCards', Global.roomNum, Global.roomIndex);
                //出的牌
                self.startShowPokers(pokers, PlayerType.shoupai);
                //重置poker
                var showPoker = self.playerHandCards.getComponent('ShowPoker');
                showPoker.pokerAllDown();
            }
        });
        Network.socket.on('refreshCardsCountBack' + Global.roomNum, function (datas) {
            console.log(datas);
            self.leftCount.string = "" + datas[self.leftIndex];
            self.rightCount.string = "" + datas[self.rightIndex];
        });
    },
    start: function start() {}
}

// update (dt) {

// },
);

cc._RF.pop();