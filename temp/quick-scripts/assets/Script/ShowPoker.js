(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ShowPoker.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '06e39cM1mxDYYVCeDUY5YnP', 'ShowPoker', __filename);
// Script/ShowPoker.js

'use strict';

var POSITION_UP = 1;
var POSITION_DOWN = 2;
cc.Class({
    extends: cc.Component,

    properties: {
        canTouch: false,
        _pokerSpriteList: null,
        _touchStart: null,
        _touchMove: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        console.log('mynode on load.');
        //只有用户手牌允许点击
        if (this.canTouch) {
            this.node.on('touchstart', this.startCallback, this);
            this.node.on('touchend', this.endCallback, this);
            this.node.on('touchmove', this.moveCallback, this);
        }
        this._pokerSpriteList = [];
    },
    onDestroy: function onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.startCallback, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.endCallback, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.moveCallback, this);
    },

    //销毁Poker
    desTroyPokers: function desTroyPokers(cards) {
        if (cards == 'undefined') {
            cards = this._pokerSpriteList;
        }
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = cards[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _pokerSprite = _step.value;

                _pokerSprite.destroy();
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    },
    start: function start() {},

    /* 展示poker */
    showPokers: function showPokers(cards, type) {
        var startx = cards.length / 2; //开始x坐标

        for (var i = 0; i < cards.length; i++) {

            var _pokerSprite2 = cards[i];
            //存储Poker节点
            this._pokerSpriteList.push(_pokerSprite2);

            // var Poker = pokerSprite.getComponent('Poker');
            this.node.addChild(_pokerSprite2);
            if (type == 0) {
                var gap = 18; //牌间隙
                _pokerSprite2.scale = 0.8;
                var x = -startx * gap + i * gap + gap / 2;
                // console.log(x);
                _pokerSprite2.setPosition(-150 + x, 0);
            } else if (type == 1) {
                var _gap = 18; //牌间隙
                _pokerSprite2.scale = 0.8;
                var _x = -startx * _gap + i * _gap + _gap / 2;
                // console.log(x);
                _pokerSprite2.setPosition(150 + _x, 0);
            } else if (type == 3) {
                var _gap2 = 80; //牌间隙
                _pokerSprite2.scale = 0.5;
                var _x2 = -startx * _gap2 + _gap2 / 2 + i * _gap2;
                // console.log(x);
                _pokerSprite2.setPosition(_x2, 0);
            } else if (type == 4) {
                var _gap3 = 12; //牌间隙
                _pokerSprite2.scale = 0.6;
                var _x3 = -startx * _gap3 + _gap3 / 2 + i * _gap3;
                // console.log(x);
                _pokerSprite2.setPosition(_x3, 0);
            } else {
                var _gap4 = 25; //牌间隙
                _pokerSprite2.scale = 1;
                var _x4 = -startx * _gap4 + i * _gap4 + _gap4 / 2;
                // console.log(x);
                _pokerSprite2.setPosition(_x4, 0);
            }
        }
    },

    //点击事件

    /**
     * 收起所有牌
     */
    pokerAllDown: function pokerAllDown() {
        for (var i in this._pokerSpriteList) {
            var _pokerSprite3 = this._pokerSpriteList[i];
            if (_pokerSprite3.status === POSITION_UP) _pokerSprite3.y -= 20;

            _pokerSprite3.status = POSITION_DOWN;
            _pokerSprite3.isChiose = false;
            // pokerSprite.opacity = 255;
            _pokerSprite3.color = new cc.color(255, 255, 255);

            Global.selectPokers = [];
        }
    },


    //点击到牌
    _getCardForTouch: function _getCardForTouch(touch) {
        for (var i = this._pokerSpriteList.length - 1; i >= 0; i--) {
            // 需要倒序
            var _pokerSprite4 = this._pokerSpriteList[i];
            //全屏坐标系
            var box = _pokerSprite4.getBoundingBoxToWorld();
            if (cc.rectContainsPoint(box, touch)) {
                console.log('in');
                _pokerSprite4.isChiose = true;
                _pokerSprite4.color = new cc.color(200, 200, 200);

                // pokerSprite.opacity = 185;
                return; //关键， 找到一个就返回
            } else {
                    //this.pokerAllDown();
                }
        }
    },


    //检测牌复原
    _checkSelectCardReserve: function _checkSelectCardReserve(touchBegan, touchMoved) {
        // console.log('_checkSelectCardReserve');
        var p1 = touchBegan.x < touchMoved.x ? touchBegan : touchMoved;

        if (p1 === touchMoved) {
            // for (let i = this._pokerSpriteList.length - 1; i >= 0; i--) {
            for (var i in this._pokerSpriteList) {
                var sprite = this._pokerSpriteList[i];
                if (p1.x - sprite.x > -25) {
                    //
                    pokerSprite.color = new cc.color(255, 255, 255);
                    // sprite.opacity = 255;
                    sprite.isChiose = false;
                }
            }
        } else {
            var width = Math.abs(touchBegan.x - touchMoved.x);
            var height = Math.abs(touchBegan.y - touchMoved.y) > 5 ? Math.abs(touchBegan.y - touchMoved.y) : 5;
            var rect = cc.rect(p1.x, p1.y, width, height);

            for (var _i = 0; _i < this._pokerSpriteList.length; _i++) {
                if (!cc.rectIntersectsRect(this._pokerSpriteList[_i].getBoundingBoxToWorld(), rect)) {
                    this._pokerSpriteList[_i].isChiose = false;
                    pokerSprite.color = new cc.color(255, 255, 255);
                    // this._pokerSpriteList[i].opacity = 255;
                }
            }
        }
    },

    /**
     * 
     * @param {点击事件} event 
     */
    startCallback: function startCallback(event) {
        // console.log(touchLoc.x + "," + touchLoc.y)
        var touches = event.getTouches();
        var touchLoc = touches[0].getLocation();
        console.log("start:" + touchLoc.x + "," + touchLoc.y);
        this._touchStart = this.node.convertToNodeSpace(touchLoc); //将坐标转换为当前节点坐标
        // console.log(this._touchStart.x + "," + this._touchStart.y)
        this._getCardForTouch(this._touchStart);
    },
    moveCallback: function moveCallback(event) {
        var touches = event.getTouches();
        var touchLoc = touches[0].getLocation();
        console.log("move:" + touchLoc.x + "," + touchLoc.y);
        this._touchMove = this.node.convertToNodeSpace(touchLoc); //将坐标转换为当前节点坐标
        this._getCardForTouch(this._touchMove);
        //当选过头了，往回拖的时候取消选择
        // this._checkSelectCardReserve(this._touchStart, this._touchMove);
    },
    endCallback: function endCallback(event) {
        console.log("end");

        for (var i = 0; i < this._pokerSpriteList.length; i++) {
            var _pokerSprite5 = this._pokerSpriteList[i];

            if (_pokerSprite5.isChiose) {
                _pokerSprite5.isChiose = false;
                // pokerSprite.opacity = 255;
                _pokerSprite5.color = new cc.color(255, 255, 255);
                if (_pokerSprite5.status === POSITION_UP) {
                    _pokerSprite5.status = POSITION_DOWN;
                    _pokerSprite5.y -= 20;

                    //移除所选牌
                    var index = -1;
                    for (var k in Global.selectPokers) {
                        var selectPoker = Global.selectPokers[k];
                        //选中的卡牌
                        var selectCard = selectPoker.getComponent('Poker');
                        //数组里的卡牌
                        var card = _pokerSprite5.getComponent('Poker');
                        if (selectPoker._imageName == card._imageName) index = k;
                    }
                    if (index != -1) Global.selectPokers.splice(index, 1);
                } else {
                    _pokerSprite5.status = POSITION_UP;
                    _pokerSprite5.y += 20;

                    //添加选择的牌
                    Global.selectPokers.push(_pokerSprite5);
                }
            } else {}
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
        