(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/playing.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '81d5fvpJ95HC5u91j0plkhh', 'playing', __filename);
// Script/playing.js

'use strict';

var _properties;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    player: -1
});
cc.Class({
    extends: cc.Component,

    properties: (_properties = {
        poker: cc.Prefab, //扑克
        startBtn: cc.Button, //开始按钮
        pokerSpriteFrameMap: {
            default: {},
            visible: false
        },
        allPokers: [], //所有牌
        leftPokers: [], //左边牌
        RightPokers: [], //右边牌
        playerPokers: [] }, _defineProperty(_properties, 'leftPokers', []), _defineProperty(_properties, 'RightPokers', []), _defineProperty(_properties, 'playerPokers', []), _properties),

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.loadRes();
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
        this.startBtn.node.active = false;
        this.loadAllPoker();
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

    //生成上家
    startUp: function startUp() {},

    //生成上家
    startDown: function startDown() {},

    //生成当前玩家
    startPlayer: function startPlayer() {
        for (var i = 0; i < 16; i++) {
            var pokerSprite = this.allPokers[i];
            this.playerPokers[i] = pokerSprite;
        }
        this.bubbleSortCards(this.playerPokers);
        this.showPokers(this.playerPokers, PlayerType.player);
    },
    loadAllPoker: function loadAllPoker() {
        for (var i = 0; i < 54; i++) {

            var pokerSprite = cc.instantiate(this.poker);
            var Poker = pokerSprite.getComponent('Poker');
            var pokerName = Poker.creatCard(i + 1)._imageName;
            // console.log("名称" + pokerName);
            pokerSprite.getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrameMap[pokerName];

            this.allPokers[i] = pokerSprite;
        }
        //洗牌
        this.allPokers = this.shuffleArray(this.allPokers);

        this.startPlayer();
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


    //展示Poker
    showPokers: function showPokers(cards, type) {
        if (type == PlayerType.left) {} else if (type == PlayerType.right) {} else {
            var startx = cards.length / 2; //开始x坐标
            for (var i = 0; i < cards.length; i++) {

                var pokerSprite = cards[i];
                var Poker = pokerSprite.getComponent('Poker');
                // console.log("名称" + Poker._imageName);

                var gap = 25; //牌间隙
                pokerSprite.scale = 1;

                this.node.addChild(pokerSprite);
                var x = -startx * gap + i * gap;
                // console.log(x);
                pokerSprite.setPosition(x, -220);
            }
        }
    },
    start: function start() {}
}

// update (dt) {},
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
        