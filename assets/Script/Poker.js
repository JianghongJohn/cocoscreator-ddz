// 一张牌的大类型 
var CardBigType = cc.Enum({
    HEI_TAO: 0,
    HONG_TAO: -1,
    MEI_HUA: -1,
    FANG_KUAI: -1,
    XIAO_WANG: -1,
    DA_WANG: -1
});
// 一张牌的小类型 
var CardSmallType = cc.Enum({
    A: 0,
    ER: -1,
    SAN: -1,
    SI: -1,
    WU: -1,
    LIU: -1,
    QI: -1,
    BA: -1,
    JIU: -1,
    SHI: -1,
    J: -1,
    Q: -1,
    K: -1,
    XIAO_WANG: -1,
    DA_WANG: -1
});
cc.Class({
    extends: cc.Component,
    
    properties: {
        // 牌的数字ID,1到54  
        _cardId: 0,

        // 牌的大类型，方块，梅花,红桃,黑桃,小王,大王  
        _bigType: {
            default :null,
            type:CardBigType
        },

        // 牌的小类型，2_10,A,J,Q,K  
        _smallType:  {
            default :null,
            type:CardSmallType
        },

        // 牌的等级，对牌进行排序时会用到  
        _grade : 0,

        // 牌的图像名字，图形界面显示牌用到  
        _imageName: ""

    },
    creatCard(id) {
        this._cardId = id;
        this._bigType = this.getBigType(id);
        this._smallType = this.getSmallType(id);
        this._grade = this.getGrade(id);
        this._imageName = this.getImageName(id);
        // Icon icon = DdzUtil.getImageIcon(imageName);  
        // setIcon(icon);  
        return this;
    },
    /** 
     * 根据牌的id获得一张牌的大类型：方块，梅花,红桃,黑桃,小王,大王 
     * 
     * @param id 
     *            牌的id 
     * 
     * @return 牌的大类型：方块，梅花,红桃,黑桃,小王,大王 
     */
    getBigType(id) {
        var bigType = null;
        if (id >= 1 && id <= 13) {
            bigType = CardBigType.FANG_KUAI;
        } else if (id >= 14 && id <= 26) {
            bigType = CardBigType.MEI_HUA;
        } else if (id >= 27 && id <= 39) {
            bigType = CardBigType.HONG_TAO;
        } else if (id >= 40 && id <= 52) {
            bigType = CardBigType.HEI_TAO;
        } else if (id == 53) {
            bigType = CardBigType.XIAO_WANG;
        } else if (id == 54) {
            bigType = CardBigType.DA_WANG;
        }
        return bigType;
    },

    /** 
     * 根据牌的id，获取牌的小类型：2_10,A,J,Q,K 
     * 
     * @param id 
     *            牌的id 
     * 
     * @return 牌的小类型：2_10,A,J,Q,K 
     */
    getSmallType(id) {
        if (id < 1 || id > 54) {
            throw new RuntimeException("牌的数字不合法");
        }

        var smallType = null;

        if (id >= 1 && id <= 52) {
            smallType = this.numToType(id % 13);
        } else if (id == 53) {
            smallType = CardSmallType.XIAO_WANG;
        } else if (id == 54) {
            smallType = CardSmallType.DA_WANG;
        } else {
            smallType = null;
        }
        return smallType;
    },

    /** 
     * 将阿拉伯数字0到12转换成对应的小牌型,被getSmallType方法调用 
     * 
     * @param num 
     *            数字（0到12） 
     * @return 牌的小类型 
     */
    numToType(num) {
        var type = null;
        switch (num) {
            case 0:
                type = CardSmallType.K;
                break;
            case 1:
                type = CardSmallType.A;
                break;
            case 2:
                type = CardSmallType.ER;
                break;
            case 3:
                type = CardSmallType.SAN;
                break;
            case 4:
                type = CardSmallType.SI;
                break;
            case 5:
                type = CardSmallType.WU;
                break;
            case 6:
                type = CardSmallType.LIU;
                break;
            case 7:
                type = CardSmallType.QI;
                break;
            case 8:
                type = CardSmallType.BA;
                break;
            case 9:
                type = CardSmallType.JIU;
                break;
            case 10:
                type = CardSmallType.SHI;
                break;
            case 11:
                type = CardSmallType.J;
                break;
            case 12:
                type = CardSmallType.Q;
                break;

        }
        return type;
    },
    /** 
     * 根据牌的id，获得一张牌的等级 
     * 
     * @param id 
     *            牌的id 
     * @return 与牌数字对应的等级 
     */
    getGrade(id) {

        if (id < 1 || id > 54) {
            throw new RuntimeException("牌的数字不合法");
        }

        var grade = 0;

        // 2个王必须放在前边判断  
        if (id == 53) {
            grade = 16;
        } else if (id == 54) {
            grade = 17;
        } else {
            var modResult = id % 13;

            if (modResult == 1) {
                grade = 14;
            } else if (modResult == 2) {
                grade = 15;
            } else if (modResult == 3) {
                grade = 3;
            } else if (modResult == 4) {
                grade = 4;
            } else if (modResult == 5) {
                grade = 5;
            } else if (modResult == 6) {
                grade = 6;
            } else if (modResult == 7) {
                grade = 7;
            } else if (modResult == 8) {
                grade = 8;
            } else if (modResult == 9) {
                grade = 9;
            } else if (modResult == 10) {
                grade = 10;
            } else if (modResult == 11) {
                grade = 11;
            } else if (modResult == 12) {
                grade = 12;
            } else if (modResult == 0) {
                grade = 13;
            }

        }

        return grade;
    },

    /** 
     * 根据牌的id获得牌图片的名字 
     * 
     * @param id 
     *            牌的id 
     * @return 图片的名字 
     */
    getImageName(id) {
        // 得到图片的前一个字符，表示是第几个牌  
        var imageName = "";

        if (id == 53) {
            imageName += "xiaowang_0";
        } else if (id == 54) {
            imageName += "dawang_0";
        } else {
            var mod = id % 13;
            var firstLetter = "";
            switch (mod) {
                case 0:
                    firstLetter = "13";
                    break;
                default:
                    firstLetter = "" + mod;
                    break;
            }
            //方块，梅花,红桃,黑桃,小王,大王 
            var secondLetter = "";
            // 得到图片的后一个字符，表示什么颜色的牌  
            if (id >= 1 && id <= 13) {
                secondLetter = "fangzhuan_";
            } else if (id >= 14 && id <= 26) {
                secondLetter = "meihua_";
            } else if (id >= 27 && id <= 39) {
                secondLetter = "hongxin_";
            } else if (id >= 40 && id <= 52) {
                secondLetter = "heitao_";
            }

            imageName = secondLetter + firstLetter;
        }
        // var extension = ".png";
        var extension = "";

        return imageName + extension;
    },


    onLoad() {
        // console.log("启动");
        // var card =  this.creatCard(15);
        // console.log(card._imageName);

    },

    start() {

    },

    // update (dt) {},
});

module.exports = {
    CardBigType: CardBigType,
    CardSmallType: CardSmallType,
};