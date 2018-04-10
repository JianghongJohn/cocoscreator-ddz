"use strict";
cc._RF.push(module, 'ca151zZpIJA+q9LeJLw31Wf', 'pokerTypes');
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

//获取牌的等级
function getGrade(card) {
    debugger;
    return card.getComponent('Poker')._grade;
};

//牌生成一个反应数量的数组
function getCarAnalyseInfo(cards) {
    debugger;
    var oneArray = [];
    var twoArray = [];
    var threeArray = [];
    var fourArray = [];
    //循环跳过的数量=相同牌的数量
    var jumpCount = 1;
    for (var i = 0; i < cards.length; i += jumpCount) {
        var sameCount = 1;
        var grade = getGrade(cards[i]);

        for (var j = i + 1; j < cards.length; j++) {
            var grade1 = getGrade(cards[j]);
            if (grade != grade1) {
                break;
            }
            sameCount++;
        }
        jumpCount = sameCount;

        switch (sameCount) {
            case 1:

                oneArray.push(grade);

                break;
            case 2:

                twoArray.push(grade);

                break;
            case 3:

                threeArray.push(grade);

                break;
            case 4:

                fourArray.push(grade);

                break;
            default:
                break;
        }
    };
    var allInfo = [oneArray, twoArray, threeArray, fourArray];
    console.log(allInfo);
    return allInfo;
}
//根据长度筛选先
function sortByLength(cards) {
    var length = cards.length;
    var cardsInfo = getCarAnalyseInfo(cards);
    debugger;
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
            if (checkIsWangzha(cards)) {
                return CardType.c20;
            } else if (cardsInfo[1].length == 1) {
                return CardType.c2;
            }
            break;
        case 3:
            //3不带的判断
            if (cardsInfo[2].length == 1) {
                return CardType.c3;
            }
            break;
        case 4:
            //炸弹、3带1。
            if (cardsInfo[2].length == 1) {
                return CardType.c31;
            } else if (cardsInfo[3].length == 0) {
                return CardType.c4;
            }
            break;
        case 5:
            //三带二、顺子
            //炸弹、3带1。
            if (cardsInfo[2].length == 1) {
                return CardType.c31;
            } else if (cardsInfo[3].length == 0) {
                return CardType.c4;
            } else if (checkIsShunzi(cardsInfo, length)) {
                return CardType.c123;
            }
            break;
        case 6:
            //顺子、四带二、飞机不带、连对
            if (cardsInfo[3].length == 1) {
                return CardType.c411;
            } else if (cardsInfo[2].length == 2) {
                return CardType.c111222;
            } else if (checkIsShunzi(cardsInfo, length)) {
                return CardType.c123;
            } else if (checkIsLianDuizi(cardsInfo, length)) {
                return CardType.c1122;
            }
            break;
        case 8:
            //顺子、四带二对、连对、飞机带单
            if (cardsInfo[3].length == 1 && cardsInfo[1].length == 2) {
                return CardType.c422;
            } else if (cardsInfo[2].length == 2) {
                return CardType.c11122234;
            } else if (checkIsShunzi(cardsInfo, length)) {
                return CardType.c123;
            } else if (checkIsLianDuizi(cardsInfo, length)) {
                return CardType.c1122;
            }
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
            if (checkIsShunzi(cardsInfo, length)) {
                return CardType.c123;
            } else if (checkIsLianDuizi(cardsInfo, length)) {
                return CardType.c1122;
            } else if (checkIsFeiJi(cardsInfo, length, 3)) {
                //飞机不带
                return CardType.c111222;
            } else if (checkIsFeiJi(cardsInfo, length, 4)) {
                //飞机带单
                return CardType.c11122234;
            } else if (checkIsFeiJi(cardsInfo, length, 5)) {
                //飞机带对子
                return CardType.c1112223344;
            }
            break;
    }
    return CardType.c0;
}

//进行对子的判断和王炸判断
function checkIsWangzha(cards) {
    var grade1 = getGrade(cards[0]);
    var grade2 = getGrade(cards[1]);
    //王炸
    if (grade1 == 17 && grade2 == 16) {
        return true;
    }
    return false;
}
//顺子的判断
function checkIsShunzi(cardsInfo, length) {
    var flag = false;
    if (cardsInfo[0].length != length) {
        //单排数组长度为所有扑克牌
    } else if (checkElementIsContain(17, cardsInfo[0]) || checkElementIsContain(16, cardsInfo[0]) || checkElementIsContain(15, cardsInfo[0])) {
        //不可以包含王、2
    } else if (cardsInfo[0][length - 1] - cardsInfo[0][0] == length - 1) {
        //（第一张牌值  - 最后一张牌值）== (length-1)
        flag = true;
    }

    return flag;
}
//连对子判断
function checkIsLianDuizi(cardsInfo, length) {
    var flag = false;
    if (cardsInfo[1].length != length / 2 || 0 != length % 2) {
        //对子数组长度为所有扑克牌/2 length为2的整除
    } else if (checkElementIsContain(17, cardsInfo[1]) || checkElementIsContain(16, cardsInfo[1]) || checkElementIsContain(15, cardsInfo[1])) {
        //不可以包含王、2
    } else if (cardsInfo[1][length - 1] - cardsInfo[1][0] == length / 2 - 1) {
        //（第一张牌值  - 最后一张牌值）== (length/2-1)
        flag = true;
    }

    return flag;
}

function checkIsFeiJi(cardsInfo, length, count) {
    var flag = false;
    if (cardsInfo[2].length != length / count || 0 != length % 3) {
        //对子数组长度为所有扑克牌/2 length为2的整除
    } else if (checkElementIsContain(15, cardsInfo[count])) {
        //不可以包含、2
    } else if (cardsInfo[2][length - 1] - cardsInfo[2][0] == length / count - 1) {
        //（第一张牌值  - 最后一张牌值）== (length/3-1)
        flag = true;
    }
    return flag;
}

//检查数组是否包含元素
function checkElementIsContain(element, array) {
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
};
module.exports = {
    CardType: CardType,
    sortByLength: sortByLength
};

cc._RF.pop();