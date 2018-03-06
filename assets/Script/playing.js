// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var PokerObj = require("Poker");

var PlayerType = cc.Enum({
    left:0,
    right:-1,
    player:-1,
})
cc.Class({
    extends: cc.Component,

    properties: {
        poker: cc.Prefab, //扑克
        startBtn: cc.Button, //开始按钮
        pokerSpriteFrameMap: {
            default: {},
            visible: false,
        },
        allPokers: [], //所有牌
        leftPokers: [], //左边牌
        RightPokers: [], //右边牌
        playerPokers: [], //玩家牌
        leftPokers: [], //左边打出牌
        RightPokers: [], //右边打出牌
        playerPokers: [], //玩家打出牌

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.loadRes();
    },

    //加载卡片资源
    loadRes() {

        let self = this;
        cc.loader.loadRes('poker', cc.SpriteAtlas, function (err, assets) {
            console.log('====' + assets);

            let sflist = assets.getSpriteFrames();
            for (let i = 0; i < sflist.length; i++) {
                let sf = sflist[i];
                self.pokerSpriteFrameMap[sf._name] = sf;
            }
            console.log("获取完全部Poker")
        });

    },
    //测试获取Poker
    startPoker() {
        this.startBtn.node.active = false;
        this.loadAllPoker();

    },
    //洗牌算法
    shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            // 在正数的时候相当于Math.floor()向下取整,负数的时候相当于Math.ceil()：
            var j = (Math.random() * (i + 1)) | 0;
            // console.log(j);
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    },
    //生成上家
    startUp() {

    },
    //生成上家
    startDown() {

    },
    //生成当前玩家
    startPlayer() {
        for (let i = 0; i < 16; i++) {
            let pokerSprite = this.allPokers[i];
            this.playerPokers[i] = pokerSprite;
        }
        this.bubbleSortCards(this.playerPokers);
        this.showPokers(this.playerPokers,PlayerType.player);
    },
    loadAllPoker() {
        for (let i = 0; i < 54; i++) {

            let pokerSprite = cc.instantiate(this.poker);
            var Poker = pokerSprite.getComponent('Poker');
            var pokerName = Poker.creatCard(i + 1)._imageName;
            // console.log("名称" + pokerName);
            pokerSprite.getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrameMap[pokerName];

            this.allPokers[i] = pokerSprite;
        }
        //洗牌
        this.allPokers = this.shuffleArray(this.allPokers);

        this.startPlayer();
    },
    /** 
     * 对牌进行排序，从小到大，使用冒泡排序，此种方法不是很好 
     * 
     * @param cards 
     *            牌 
     */
    bubbleSortCards(cards) {
        if (cards == null) {
            return cards;
        }
        let size = cards.length;
        // 冒泡排序,从左到右，从小到大  
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size - 1 - i; j++) {
                let pokerSpriteOne = cards[j];
                let PokerOne = pokerSpriteOne.getComponent('Poker');
                let pokerSpriteTwo = cards[j + 1];
                let PokerTwo = pokerSpriteTwo.getComponent('Poker');

                var gradeOne = PokerOne._grade;
                var gradeTwo = PokerTwo._grade;

                var isExchange = false;
                if (gradeOne < gradeTwo) {
                    isExchange = true;
                } else if (gradeOne == gradeTwo) {
                    // 2张牌的grade相同  
                    var type1 = PokerOne._bigType;
                    var type2 = PokerTwo._bigType;

                    // 从左到右，方块、梅花、红桃、黑桃  
                    if (type1 == PokerObj.CardBigType.HEI_TAO) {
                        isExchange = true;
                    } else if (type1 == PokerObj.CardBigType.HONG_TAO) {
                        if (type2 == PokerObj.CardBigType.MEI_HUA ||
                            type2 == PokerObj.CardBigType.FANG_KUAI) {
                            isExchange = true;
                        }
                    } else if (type1 == PokerObj.CardBigType.MEI_HUA) {
                        if (type2 == PokerObj.CardBigType.FANG_KUAI) {
                            isExchange = true;
                        }
                    }
                }
                if (isExchange) {
                    cards[j + 1] = pokerSpriteOne;
                    cards[j] = pokerSpriteTwo;
                }
            }
        }
        // console.log("我的牌"+ cards);
        return cards;
    },

    //展示Poker
    showPokers(cards ,type){
        if (type == PlayerType.left) {
            
        } else if (type == PlayerType.right){
            
        }else{
            let startx = cards.length / 2; //开始x坐标
            for (let i = 0; i < cards.length; i++) {
    
                let pokerSprite = cards[i];
                var Poker = pokerSprite.getComponent('Poker');
                // console.log("名称" + Poker._imageName);
    
                let gap = 25; //牌间隙
                pokerSprite.scale = 1;
    
                this.node.addChild(pokerSprite);
                let x = (-startx) * gap + i * gap;
                // console.log(x);
                pokerSprite.setPosition(x, -220);
            }
        }
        
    },
    start() {

    },

    // update (dt) {},
});