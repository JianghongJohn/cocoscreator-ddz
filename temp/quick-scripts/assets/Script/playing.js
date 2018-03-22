(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/playing.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '81d5fvpJ95HC5u91j0plkhh', 'playing', __filename);
// Script/playing.js

"use strict";

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
        leftPokers: [], //左边牌
        rightPokers: [], //右边牌
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

        playerHandCards: cc.Node, //玩家手牌
        playerOutCards: cc.Node, //玩家出牌
        playerAction: cc.Node, //玩家按钮
        playerDizhuAction: cc.Node, //玩家按钮

        dipaiShowPoker: cc.Node //右边展示Poker
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

        Network.socket.on("readyGame" + Global.roomNum, function (roomIndex) {
            if (roomIndex == self.leftIndex) {
                self.leftReady.string = "准备";
            } else if (roomIndex == self.rightIndex) {
                self.rightReady.string = "准备";
            } else {}
        });
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
        var self = this;
        //获取所有Poker
        Network.socket.on('startGame' + Global.roomNum, function (cards) {
            //隐藏控件
            self.maskBackground.active = false;

            self.leftbuchu.string = "";

            self.rightbuchu.string = "";

            self.playerAction.active = false;

            self.playerDizhuAction.active = false;

            Network.socket.emit('getCards', Global.roomNum, Global.roomIndex);
            Network.socket.emit('getCards', Global.roomNum, 3);
            Network.socket.on('getCardsBack' + Global.roomNum, function (cards) {
                console.log(cards);
                self.startPlayer(cards);
            });
            Network.socket.on('getDipaiCardsBack' + Global.roomNum, function (cards) {
                console.log(cards);
                self.startDipai(cards);
            });
        });
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

    //生成当前玩家
    startPlayer: function startPlayer(cards) {
        var pokers = this.loadAllPoker(cards);
        for (var i = 0; i < cards.length; i++) {
            var pokerSprite = pokers[i];
            this.playerPokers[i] = pokerSprite;
        }
        this.bubbleSortCards(this.playerPokers);
        this.showCards(PlayerType.player);
        //刷新数量
        this.refreshCount();
    },

    //生成三张底牌
    startDipai: function startDipai(cards) {
        var pokers = this.loadAllPoker(cards);
        for (var i = 0; i < cards.length; i++) {
            var pokerSprite = pokers[i];
            this.dipaiPokers[i] = pokerSprite;
        }
        this.showCards(PlayerType.dipai);
        // this.showPokers(this.dipaiPokers, PlayerType.dipai);
    },
    showCards: function showCards(type) {
        if (type == PlayerType.left) {
            var showPoker = this.leftShowPoker.getComponent('ShowPoker');
            showPoker.showPokers(this.leftPokers, PlayerType.left);
        } else if (type == PlayerType.right) {
            var showPoker = this.rightShowPoker.getComponent('ShowPoker');
            showPoker.showPokers(this.rightPokers, PlayerType.right);
        } else if (type == PlayerType.player) {
            var showPoker = this.playerHandCards.getComponent('ShowPoker');
            showPoker.showPokers(this.playerPokers, PlayerType.player);
        } else if (type == PlayerType.shoupai) {
            var showPoker = this.playerOutCards.getComponent('ShowPoker');
            showPoker.showPokers(cards, PlayerType.shoupai);
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

    /** 
     * 对牌进行排序，从小到大，使用冒泡排序，此种方法不是很好 
     * 
     * @param cards 
     *            牌 
     */
    bubbleSortCards: function bubbleSortCards(cards) {
        if (cards == null) {
            return cards;
        }
        var size = cards.length;
        // 冒泡排序,从左到右，从小到大  
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size - 1 - i; j++) {
                var pokerSpriteOne = cards[j];
                var PokerOne = pokerSpriteOne.getComponent('Poker');
                var pokerSpriteTwo = cards[j + 1];
                var PokerTwo = pokerSpriteTwo.getComponent('Poker');

                var gradeOne = PokerOne._grade;
                var gradeTwo = PokerTwo._grade;

                var isExchange = false;
                if (gradeOne < gradeTwo) {
                    isExchange = true;
                } else if (gradeOne == gradeTwo) {
                    // 2张牌的grade相同  
                    var type1 = PokerOne._bigType;
                    var type2 = PokerTwo._bigType;

                    // 从左到右，方块、梅花、红桃、黑桃  
                    if (type1 == PokerObj.CardBigType.HEI_TAO) {
                        isExchange = true;
                    } else if (type1 == PokerObj.CardBigType.HONG_TAO) {
                        if (type2 == PokerObj.CardBigType.MEI_HUA || type2 == PokerObj.CardBigType.FANG_KUAI) {
                            isExchange = true;
                        }
                    } else if (type1 == PokerObj.CardBigType.MEI_HUA) {
                        if (type2 == PokerObj.CardBigType.FANG_KUAI) {
                            isExchange = true;
                        }
                    }
                }
                if (isExchange) {
                    cards[j + 1] = pokerSpriteOne;
                    cards[j] = pokerSpriteTwo;
                }
            }
        }
        // console.log("我的牌"+ cards);
        return cards;
    },

    //刷新显示数量
    refreshCount: function refreshCount() {
        var self = this;
        Network.socket.emit('refreshCardsCount', Global.roomNum);
        Network.socket.on('refreshCardsCountBack' + Global.roomNum, function (datas) {
            console.log(datas);
            self.leftCount.string = "" + datas[self.leftIndex];
            self.rightCount.string = "" + datas[self.rightIndex];
        });
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
    start: function start() {}
}

// update (dt) {

// },
);

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=playing.js.map
        