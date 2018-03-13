(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ShowPoker.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '06e39cM1mxDYYVCeDUY5YnP', 'ShowPoker', __filename);
// Script/ShowPoker.js

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

cc.Class({
    extends: cc.Component,

    properties: {},

    // onLoad () {},

    start: function start() {},

    //展示Poker
    showPokers: function showPokers(cards, type) {
        var startx = cards.length / 2; //开始x坐标
        for (var i = 0; i < cards.length; i++) {

            var pokerSprite = cards[i];
            var Poker = pokerSprite.getComponent('Poker');
            this.node.addChild(pokerSprite);
            if (type == 0) {
                var gap = 18; //牌间隙
                pokerSprite.scale = 0.8;
                var x = -startx * gap + i * gap + gap / 2;
                // console.log(x);
                pokerSprite.setPosition(-150 + x, 0);
            } else if (type == 1) {
                var _gap = 18; //牌间隙
                pokerSprite.scale = 0.8;
                var _x = -startx * _gap + i * _gap + _gap / 2;
                // console.log(x);
                pokerSprite.setPosition(150 + _x, 0);
            } else if (type == 3) {
                var _gap2 = 80; //牌间隙
                pokerSprite.scale = 0.5;
                var _x2 = -startx * _gap2 + _gap2 / 2 + i * _gap2;
                // console.log(x);
                pokerSprite.setPosition(_x2, 0);
            } else if (type == 4) {
                var _gap3 = 12; //牌间隙
                pokerSprite.scale = 0.6;
                var _x3 = -startx * _gap3 + _gap3 / 2 + i * _gap3;
                // console.log(x);
                pokerSprite.setPosition(_x3, 0);
            } else {
                var _gap4 = 25; //牌间隙
                pokerSprite.scale = 1;
                var _x4 = -startx * _gap4 + i * _gap4 + _gap4 / 2;
                // console.log(x);
                pokerSprite.setPosition(_x4, 0);
            }
        }
    }
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
        //# sourceMappingURL=ShowPoker.js.map
        