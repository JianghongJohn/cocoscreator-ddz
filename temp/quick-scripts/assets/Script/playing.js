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

cc.Class({
    extends: cc.Component,

    properties: (_properties = {
        poker: cc.Prefab, //扑克
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
        var startx = 16 / 2; //开始x坐标
        for (var i = 0; i < 16; i++) {

            var pokerSprite = this.allPokers[i];
            var Poker = pokerSprite.getComponent('Poker');
            console.log("名称" + Poker.pokerName);

            var gap = 20; //牌间隙
            pokerSprite.scale = 1;

            this.node.addChild(pokerSprite);
            var x = -startx * gap + i * gap;
            // console.log(x);
            pokerSprite.setPosition(x, 0);
        }
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
        //排序
        this.allPokers = this.shuffleArray(this.allPokers);

        this.startPlayer();
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
        