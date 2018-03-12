(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/pokerTypes.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ca151zZpIJA+q9LeJLw31Wf', 'pokerTypes', __filename);
// Script/pokerTypes.js

'use strict';

/**
 * 牌型
　　火箭：即双王（大王和小王），最大的牌。
　　炸弹：四张点数相同的牌，如：7777。
　　单牌：任意一张单牌。
　　对牌：任意两张点数相同的牌。
　　三张：任意三张点数相同的牌，如888。
　　三带一：点数相同的三张牌+一张单牌或一对牌。如：333+6 或 444+99。
　　单顺：任意五张或五张以上点数相连的牌，如：45678或78910JQK。不包括 2和双王。
　　双顺：三对或更多的连续对牌，如：334455、7788991010JJ。不包括 2 点和双王。
　　三顺：二个或更多的连续三张牌，如：333444 、555666777888。不包括 2 点和双王。
　　飞机带翅膀：三顺＋同数量的单牌或同数量的对牌。如：444555+79 或333444555+7799JJ
　　四带二：四张牌＋两手牌。（注意：四带二不是炸弹）。如：5555＋3＋8 或 4444＋55＋77 。
 */

var CardType = cc.Enum({
    c1: 0, //单牌。  
    c2: -1, //对子。 
    c20: -1, //王炸。  
    c3: -1, //3不带。  
    c4: -1, //炸弹。  
    c31: -1, //3带1。  
    c32: -1, //3带2。  
    c411: -1, //4带2个单，或者一对  
    c422: -1, //4带2对  
    c123: -1, //顺子。  
    c1122: -1, //连队。  
    c111222: -1, //飞机。  
    c11122234: -1, //飞机带单排.  
    c1112223344: -1, //飞机带对子.  
    c0: -1 //不能出牌  
});
cc.Class({
    extends: cc.Component,

    properties: {},

    //获取牌的等级
    getGrade: function getGrade(card) {
        return card.getComponent('Poker')._grade;
    },


    //牌生成一个反应数量的数组
    getCarAnalyseInfo: function getCarAnalyseInfo(cards) {

        var oneArray = [];
        var twoArray = [];
        var threeArray = [];
        var fourArray = [];

        debugger;
        for (var i = 0; i < cards.length; i++) {
            var sameCount = 1;
            var grade = this.getGrade(cards[i]);

            for (var j = i + 1; j < cards.length; j++) {
                var grade1 = this.getGrade(cards[j]);
                if (grade == grade1) {
                    sameCount++;
                }
            }

            switch (sameCount) {
                case 1:
                    if (!this.checkElementIsContain(grade, oneArray)) {
                        oneArray.push(grade);
                    }

                    break;
                case 2:
                    if (!this.checkElementIsContain(grade, twoArray)) {
                        twoArray.push(grade);
                    }

                    break;
                case 3:
                    if (!this.checkElementIsContain(grade, threeArray)) {
                        threeArray.push(grade);
                    }
                    break;
                case 4:
                    if (!this.checkElementIsContain(grade, fourArray)) {
                        fourArray.push(grade);
                    }
                    break;
                default:
                    break;
            }
        };
        var allInfo = [oneArray, twoArray, threeArray, fourArray];
        console.log(allInfo);
    },

    //检查数组是否包含元素
    checkElementIsContain: function checkElementIsContain(element, array) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {

            for (var _iterator = array[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var grade = _step.value;

                if (grade == element) {
                    return true;
                }
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

        return false;
    }
});

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
        //# sourceMappingURL=pokerTypes.js.map
        