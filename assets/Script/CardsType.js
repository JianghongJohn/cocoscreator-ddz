//牌型判断
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

var Poker = require('Poker');
cc.Class({
    extends: cc.Component,

    properties: {

    },
    start() {

    },

    /** 
     * 判断牌是否为单 
     * 
     * @param myCards 
     *            牌的集合 
     * @return 如果为单，返回true；否则，返回false。 
     */
    isDan(myCards) {
        // 默认不是单  
        var flag = false;
        if (myCards != null && myCards.length == 1) {
            flag = true;
        }
        return flag;
    },
    /** 
     * 判断牌是否为对子 
     * 
     * @param myCards 
     *            牌的集合 
     * @return 如果为对子，返回true；否则，返回false。 
     */
    isDuiZi(myCards) {
        // 默认不是对子  
        var flag = false;

        if (myCards != null && myCards.length == 2) {
            var grade1 = myCards[0].pokerSprite.getComponent('Poker')._grade;
            var grade1 = myCards[1].pokerSprite.getComponent('Poker')._grade;
            if (grade1 == grade2) {
                flag = true;
            }
        }

        return flag;

    },
    /*
     * 判断牌是否为3带1  
     *  
     * @param myCards  
     *            牌的集合  
     * @return 如果为3带1，被带牌的位置，0或3，否则返回-1。炸弹返回-1。  
     */
    isSanDaiYi(myCards) {
        var flag = -1;
        // 默认不是3带1  
        if (myCards != null && myCards.size() == 4) {
            // 对牌进行排序  
            CardUtil.sortCards(myCards);

            var grades = new Array[4];
            grades[0] = myCards[0].pokerSprite.getComponent('Poker')._grade;
            grades[1] = myCards[1].pokerSprite.getComponent('Poker')._grade;
            grades[2] = myCards[2].pokerSprite.getComponent('Poker')._grade;
            grades[3] = myCards[4].pokerSprite.getComponent('Poker')._grade;

            // 暂时认为炸弹不为3带1  
            if ((grades[1] == grades[0]) && (grades[2] == grades[0]) &&
                (grades[3] == grades[0])) {
                return -1;
            }
            // 3带1，被带的牌在牌头  
            else if ((grades[1] == grades[0] && grades[2] == grades[0])) {
                return 0;
            }
            // 3带1，被带的牌在牌尾  
            else if (grades[1] == grades[3] && grades[2] == grades[3]) {
                return 3;
            }
        }
        return flag;
    },
    /** 
     * 判断牌是否为3不带 
     * 
     * @param myCards 
     *            牌的集合 
     * @return 如果为3不带，返回true；否则，返回false。 
     */
    isSanBuDai(myCards) {
        // 默认不是3不带  
        var flag = false;

        if (myCards != null && myCards.length == 3) {
            var grade0 = myCards[0].pokerSprite.getComponent('Poker')._grade;
            var grade1 = myCards[1].pokerSprite.getComponent('Poker')._grade;
            var grade2 = myCards[2].pokerSprite.getComponent('Poker')._grade;

            if (grade0 == grade1 && grade2 == grade0) {
                flag = true;
            }
        }
        return flag;
    },

    /** 
     * 判断牌是否为顺子 
     * 
     * @param myCards 
     *            牌的集合 
     * @return 如果为顺子，返回true；否则，返回false。 
     */
    isShunZi(myCards) {
        // 默认是顺子  
        var flag = true;

        if (myCards != null) {

            var size = myCards.length;
            // 顺子牌的个数在5到12之间  
            if (size < 5 || size > 12) {
                return false;
            }


            for (var n = 0; n < size - 1; n++) {
                var prev = myCards[n].pokerSprite.getComponent('Poker')._grade;
                var next = myCards[n + 1].pokerSprite.getComponent('Poker')._grade;
                // 小王、大王、2不能加入顺子  
                if (prev == 17 || prev == 16 || prev == 15 || next == 17 ||
                    next == 16 || next == 15) {
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
     * 判断牌是否为炸弹 
     * 
     * @param myCards 
     *            牌的集合 
     * @return 如果为炸弹，返回true；否则，返回false。 
     */
    isZhaDan(myCards) {
        // 默认不是炸弹  
        var flag = false;
        if (myCards != null && myCards.length == 4) {

            var grades = new Array[4];
            grades[0] = myCards[0].pokerSprite.getComponent('Poker')._grade;
            grades[1] = myCards[1].pokerSprite.getComponent('Poker')._grade;
            grades[2] = myCards[2].pokerSprite.getComponent('Poker')._grade;
            grades[3] = myCards[3].pokerSprite.getComponent('Poker')._grade;
            if ((grades[1] == grades[0]) && (grades[2] == grades[0]) &&
                (grades[3] == grades[0])) {
                flag = true;
            }
        }
        return flag;
    },

    /** 
     * 判断牌是否为王炸 
     * 
     * @param myCards 
     *            牌的集合 
     * @return 如果为王炸，返回true；否则，返回false。 
     */
    isDuiWang(myCards) {
        // 默认不是对王  
        var flag = false;

        if (myCards != null && myCards.length == 2) {

            var gradeOne = myCards[0].pokerSprite.getComponent('Poker')._grade;
            var gradeTwo = myCards[1].pokerSprite.getComponent('Poker')._grade;

            // 只有小王和大王的等级之后才可能是33  
            if (gradeOne + gradeTwo == 33) {
                flag = true;
            }
        }
        return flag;
    },
    /** 
     * 判断牌是否为连对 
     * 
     * @param myCards 
     *            牌的集合 
     * @return 如果为连对，返回true；否则，返回false。 
     */
    isLianDui(myCards) {
        // 默认是连对  
        var flag = true;
        if (myCards == null) {
            flag = false;
            return flag;
        }

        var size = myCards.length;
        if (size < 6 || size % 2 != 0) {
            flag = false;
        } else {
            // 对牌进行排序  
            CardUtil.sortCards(myCards);
            for (var i = 0; i < size; i = i + 2) {
                var gradeOne = myCards[i].pokerSprite.getComponent('Poker')._grade;
                var gradeTwo = myCards[i + 1].pokerSprite.getComponent('Poker')._grade;
                if (gradeOne != gradeTwo) {
                    flag = false;
                    break;
                }

                if (i < size - 2) {
                    var gradeThree = myCards[i + 2].pokerSprite.getComponent('Poker')._grade;
                    if (gradeOne - gradeThree != -1) {
                        flag = false;
                        break;
                    }
                }
            }
        }

        return flag;
    },


/** 
  * 判断牌是否为飞机 
  * 
  * @param myCards 
  *            牌的集合 
  * @return 如果为飞机，返回true；否则，返回false。 
  */  
isFeiJi( myCards) {  
    var flag = false;  
    // 默认不是单  
    if (myCards != null) {  
 
        var size = myCards.length;  
        if (size >= 6) {  
            // 对牌进行排序  
 
            if (size % 3 == 0 && size % 4 != 0) {  
                flag = this.isFeiJiBuDai(myCards);  
            } else if (size % 3 != 0 && size % 4 == 0) {  
                flag = this.isFeiJiDai(myCards);  
            } else if (size == 12) {  
                flag = this.isFeiJiBuDai(myCards) || this.isFeiJiDai(myCards);  
            }  
        }  
    }  
    return flag;  
},

/** 
  * 判断牌是否为飞机不带 
  * 
  * @param myCards 
  *            牌的集合 
  * @return 如果为飞机不带，返回true；否则，返回false。 
  */  
isFeiJiBuDai( myCards) {  
    if (myCards == null) {  
        return false;  
    }  
 
    var size = myCards.length;  
    var n = size / 3;  
 
var grades = new Array[n];  
 
    if (size % 3 != 0) {  
        return false;  
    } else {  
        for (var i = 0; i < n; i++) {  
            if (!isSanBuDai(myCards.slice(i * 3, i * 3 + 3))) {  
                return false;  
            } else {  
                // 如果连续的3张牌是一样的，记录其中一张牌的grade  
                grades[i] = myCards[i * 3].pokerSprite.getComponent('Poker')._grade;  
            }  
        }  
    }  
 
    for (var i = 0; i < n - 1; i++) {  
        if (grades[i] == 15) {// 不允许出现2  
            return false;  
        }  
 
        if (grades[i + 1] - grades[i] != 1) {  
            System.out.println("等级连续,如 333444"  
                    + (grades[i + 1] - grades[i]));  
            return false;// grade必须连续,如 333444  
        }  
    }  
 
    return true;  
} ,
/** 
    * 判断牌是否为飞机带 
    * 
    * @param myCards 
    *            牌的集合 
    * @return 如果为飞机带，返回true；否则，返回false。 
    */  
isFeiJiDai( myCards) {  
    var size = myCards.length;  
    var n = size / 4;// 此处为“除”，而非取模  
    var i = 0;  
    for (i = 0; i + 2 < size; i = i + 3) {  
        var grade1 = myCards[i].pokerSprite.getComponent('Poker')._grade; 
        var grade2 = myCards[i + 1].pokerSprite.getComponent('Poker')._grade;  
        var grade3 = myCards[i + 2].pokerSprite.getComponent('Poker')._grade; 
        if (grade1 == grade2 && grade3 == grade1) {  

            // return isFeiJiBuDai(myCards.subList(i, i + 3 *  
            // n));8张牌时，下标越界,subList不能取到最后一个元素  
            var  cards = [];  
            for (var j = i; j < i + 3 * n; j++) {// 取字串  
                cards.push(myCards[j]);
            }  
            return isFeiJiBuDai(cards);  
        }  

    }  
    return false;  
} ,
/** 
   * 判断牌是否为4带2 
   * 
   * @param myCards 
   *            牌的集合 
   * @return 如果为4带2，返回true；否则，返回false。 
   */  
isSiDaiEr(myCards) {  
    var flag = false;  
    if (myCards != null && myCards.length == 6) {  

        for (var i = 0; i < 3; i++) {  
            var grade1 = myCards[i].pokerSprite.getComponent('Poker')._grade; 
            var grade2 = myCards[i+1].pokerSprite.getComponent('Poker')._grade; 
            var grade3 = myCards[i+2].pokerSprite.getComponent('Poker')._grade; 
            var grade4 = myCards[i+3].pokerSprite.getComponent('Poker')._grade; 

            if (grade2 == grade1 && grade3 == grade1 && grade4 == grade1) {  
                flag = true;  
            }  
        }  
    }  
    return flag;  
}
});