(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/playerAction.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a1bdc0QNF5Oga829CTvGN49', 'playerAction', __filename);
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
    buchuAction: function buchuAction() {
        var mes = { playerIndex: Global.roomIndex, roomNum: Global.roomNum };

        Network.socket.emit('buchu', Network.stringifyJson(mes));

        this.node.active = false;
    },
    chupaiAction: function chupaiAction() {
        var pokers = Global.selectPokers;
        debugger;
        var type = pokerTypes.sortByLength(pokers);
        var pokerData = new Array();
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = pokers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var card = _step.value;

                var poker = card.getComponent('Poker');
                // let cardId = poker._cardId;
                // pokerData.push(cardId);
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

        debugger;
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
        //# sourceMappingURL=playerAction.js.map
        