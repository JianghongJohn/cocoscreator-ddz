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
    //第一层根据数量筛选
    sortByLength: function sortByLength(cards) {
        var length = cards.length;
        switch (length) {
            case 0:
                return CardType.c0;
                break;
            case 1:
                //单
                return CardType.c1;
                break;
            case 2:
                //进行对子的判断和王炸判断
                return this.checkIsDuizi;
                break;
            case 3:
                //3不带的判断
                return this.checkIsSanBuDai;
                break;
            case 4:
                //炸弹、3带1。 
                break;
            case 5:
                //三带二、顺子
                break;
            case 6:
                //顺子、四带二、飞机不带、连对
                break;
            case 8:
                //顺子、四带二对、连对、飞机带单
                break;
            default:
                //顺子、连对、飞机（不带、单、双）
                /**
                 * 顺子：每个值差1，5-11张，不含王、2
                 * 连对：偶数，每两个差1，6-18张，不含王、2
                 * 飞机不带：%3为0，每三张差1，6-18张
                 * 飞机带单：%4为0，从前到后或者后到前，每三张差1，8-16张
                 * 飞机带双：%5为0，从前到后或者后到前，每三张差1，10-15张
                 */
                break;
        }
    },

    //进行对子的判断和王炸判断
    checkIsDuizi: function checkIsDuizi(cards) {
        var grade1 = this.getGrade(cards[0]);
        var grade2 = this.getGrade(cards[1]);
        //王炸
        if (grade1 == 17 && grade2 == 16) {
            return CardType.c20;
        }
        if (grade1 == grade2) {
            return CardType.c2;
        } else {
            return CardType.c0;
        }
    },

    //3不带的判断
    checkIsSanBuDai: function checkIsSanBuDai(cards) {
        var grade1 = this.getGrade(cards[0]);
        var grade2 = this.getGrade(cards[1]);
        var grade3 = this.getGrade(cards[2]);
        if (grade1 == grade2 && grade1 == grade3) {
            return CardType.c3;
        } else {
            return CardType.c0;
        }
    },

    //炸弹、3带1。 
    checkIsZhaDan_SanDaiYi: function checkIsZhaDan_SanDaiYi(cards) {

        var grade1 = this.getGrade(cards[0]);
        var grade2 = this.getGrade(cards[1]);
        var grade3 = this.getGrade(cards[2]);
        var grade4 = this.getGrade(cards[3]);
        //炸弹
        if (grade1 == grade2 && grade1 == grade3 && grade1 == grade4) {
            return CardType.c4;
        } else {
            if (grade1 == grade2 && grade1 == grade3 || grade4 == grade2 && grade4 == grade3) {
                return CardType.c31;
            } else {
                //错误牌型
                return CardType.c0;
            }
        }
    },

    //三带二或者顺子
    checkIsSanDaier_ShunZi: function checkIsSanDaier_ShunZi(cards) {
        var grade1 = this.getGrade(cards[0]);
        var grade2 = this.getGrade(cards[1]);
        var grade3 = this.getGrade(cards[2]);
        var grade4 = this.getGrade(cards[3]);
        var grade5 = this.getGrade(cards[4]);
        if (grade1 == grade2 && grade1 == grade3 && grade4 == grade5 || grade1 == grade2 && grade5 == grade3 && grade4 == grade5) {
            return CardType.c32;
        }
        //顺子
        if (checkIsShunZi(cards)) {
            return CardType.c123;
        }

        return CardType.c0;
    },


    //四带二
    chenckIsSiDaiEr: function chenckIsSiDaiEr(cards) {
        var flag = false;
        if (myCards != null && myCards.length == 6) {

            for (var i = 0; i < 3; i++) {
                var grade1 = myCards[i].pokerSprite.getComponent('Poker')._grade;
                var grade2 = myCards[i + 1].pokerSprite.getComponent('Poker')._grade;
                var grade3 = myCards[i + 2].pokerSprite.getComponent('Poker')._grade;
                var grade4 = myCards[i + 3].pokerSprite.getComponent('Poker')._grade;

                if (grade2 == grade1 && grade3 == grade1 && grade4 == grade1) {
                    flag = true;
                }
            }
        }
        return flag;
    },

    //四带二对
    chenckIsSiDaiErDui: function chenckIsSiDaiErDui(cards) {},

    //顺子判断
    checkIsShunZi: function checkIsShunZi(cards) {
        // 默认是顺子  
        var flag = true;

        if (cards != null) {

            var size = cards.length;
            // 顺子牌的个数在5到12之间  
            if (size < 5 || size > 12) {
                return false;
            }
            for (var n = 0; n < size - 1; n++) {
                var prev = this.getGrade(cards[n]);
                var next = this.getGrade(cards[n + 1]);
                // 小王、大王、2不能加入顺子  
                if (prev == 17 || prev == 16 || prev == 15 || next == 17 || next == 16 || next == 15) {
                    flag = false;
                    break;
                } else {
                    if (prev - next != -1) {
                        flag = false;
                        break;
                    }
                }
            }
        }
        return flag;
    },

    /** 
     * 判断牌是否为连对 
     * 
     * @param cards 
     *            牌的集合 
     * @return 如果为连对，返回true；否则，返回false。 
     */
    checkIsLianDui: function checkIsLianDui(cards) {

        // 默认是连对  
        var flag = true;
        if (cards == null) {
            flag = false;
            return flag;
        }

        var size = cards.length;
        if (size < 6 || size % 2 != 0) {
            flag = false;
        } else {

            for (var i = 0; i < size; i = i + 2) {
                var gradeOne = this.getGrade(cards[i]);
                var gradeTwo = this.getGrade(cards[i + 1]);
                if (gradeOne != gradeTwo) {
                    flag = false;
                    break;
                }

                if (i < size - 2) {
                    var gradeThree = this.getGrade(cards[i + 2]);
                    if (gradeOne - gradeThree != -1) {
                        flag = false;
                        break;
                    }
                }
            }
        }

        return flag;
    },


    //获取牌的等级
    getGrade: function getGrade(card) {
        return card.pokerSprite.getComponent('Poker')._grade;
    },


    //牌生成一个反应数量的数组
    getCount: function getCount(cards) {
        var oneArray = [];
        var TwoArray = [];
        var ThreeArray = [];
        var FourArray = [];

        for (var i = 0; i < cards.length; i++) {
            var grade = this.getGrade(cards[i]);
            for (var j = i - 1; j < cards.length; j++) {}
        }
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
        