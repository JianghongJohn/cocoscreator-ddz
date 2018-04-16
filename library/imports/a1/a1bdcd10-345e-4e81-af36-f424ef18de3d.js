"use strict";
cc._RF.push(module, 'a1bdc0QNF5Oga829CTvGN49', 'playerAction');
// Script/playerAction.js

'use strict';

var pokerTypes = require('pokerTypes');
cc.Class({
    extends: cc.Component,

    properties: {
        buchuBtn: cc.Button,
        tishiBtn: cc.Button,
        chupaiBtn: cc.Button
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {},

    /**
     * 检查是否为第一次出牌，隐藏不出按钮
     * @param {是否为第一次出牌} isFirst 
     */
    setBuchu: function setBuchu(isFirst) {
        if (isFirst) {
            this.buchuBtn.active = false;
        } else {
            this.buchuBtn.active = true;
        }
    },
    buchuAction: function buchuAction() {
        //首次出牌不允许不出
        if (Global.isFirst) {
            return;
        }
        var mes = { playerIndex: Global.roomIndex, roomNum: Global.roomNum };

        Network.socket.emit('buchu', Network.stringifyJson(mes));

        this.node.active = false;
    },
    chupaiAction: function chupaiAction() {
        var pokers = Global.selectPokers;
        pokerTypes.bubbleSortCards(pokers);
        if (pokers.length == 0) {
            //牌型不符合
            console.log("未选择牌");
            return;
        }
        var type = pokerTypes.sortByLength(pokers);
        debugger;
        if (type == 14) {
            //牌型不符合
            console.log("牌型错误");
            return;
        }
        var pokerData = new Array();
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = pokers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var card = _step.value;

                var poker = card.getComponent('Poker');
                var cardId = poker._cardId;
                pokerData.push(cardId);
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

        var mes = { pokers: pokerData, cardsType: type, roomNum: Global.roomNum, playerIndex: Global.roomIndex };

        Network.socket.emit('chupai', Network.stringifyJson(mes));
    }
}

// update (dt) {},
);

cc._RF.pop();