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
    left: 0,
    right: -1,
    player: -1,
    dipai: -1,
    shoupai: -1
})
cc.Class({
    extends: cc.Component,

    properties: {
        poker: cc.Prefab, //扑克
        allPokers: [], //所有牌
        leftPokers: [], //左边牌
        rightPokers: [], //右边牌
        playerPokers: [], //玩家牌
        dipaiPokers: [], //底牌
        leftPokersOut: [], //左边打出牌
        rightPokersOut: [], //右边打出牌
        playerPokersOut: [], //玩家打出牌
        pokerSpriteFrameMap: {
            default: {},
            visible: false,
        },

        //控制的东西
        maskBackground: cc.Node, //开始前的遮罩
        startBtn: cc.Button, //开始按钮
        leftCount: cc.Label, //左边数量
        leftbuchu: cc.Label, //左边不出
        leftShowPoker: cc.Node, //左边展示Poker
        rightCount: cc.Label, //右边数量
        rightShowPoker: cc.Node, //右边展示Poker
        rightbuchu: cc.Label, //右边不出

        playerHandCards: cc.Node, //玩家手牌
        playerOutCards: cc.Node, //玩家出牌
        playerAction: cc.Node, //玩家按钮

        dipaiShowPoker: cc.Node, //右边展示Poker
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.socketAction();
        this.loadRes();
    },
    /**
     * socket处理
     */
    socketAction() {
        let socket = io.connect('192.168.0.56:3000');
        this.socket = socket;
        let self = this;
        socket.on('hello', function (msg) {
            console.log(msg);
        });
        //获取所有Poker
        socket.on('loadCards', function (cards) {
            self.loadAllPoker(cards);
            self.refreshCount();
            self.showCards(PlayerType.player);
        });

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
        //隐藏控件
        this.maskBackground.active = false;
        this.leftbuchu.enabled = false;
        this.rightbuchu.enabled = false
        this.playerAction.active = false;
        //请求服务器生成Poker
        this.socket.emit('getAllCards', "");
        // this.loadAllPoker();
        // // let pokerSprite = cc.instantiate(this.poker);
        // // var pokerTypes = pokerSprite.getComponent('pokerTypes');
        // // pokerTypes.getCarAnalyseInfo(this.playerPokers);
        // this.refreshCount();
        // this.showCards(PlayerType.player);

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
        for (let i = 0; i < 16; i++) {
            let pokerSprite = this.allPokers[i + 16 + 3];
            this.leftPokers[i] = pokerSprite;
        }
        this.bubbleSortCards(this.leftPokers);
        // this.showPokers(this.leftPokers, PlayerType.left);

    },
    //生成下家
    startDown() {
        for (let i = 0; i < 16; i++) {
            let pokerSprite = this.allPokers[i + 32 + 3];
            this.rightPokers[i] = pokerSprite;
        }
        this.bubbleSortCards(this.rightPokers);
        // this.showPokers(this.rightPokers, PlayerType.right);

    },
    //生成当前玩家
    startPlayer() {
        for (let i = 0; i < 16; i++) {
            let pokerSprite = this.allPokers[i + 3];
            this.playerPokers[i] = pokerSprite;
        }
        this.bubbleSortCards(this.playerPokers);
        // this.showPokers(this.playerPokers, PlayerType.player);


    },
    //生成三张底牌
    startDipai() {
        for (let i = 0; i < 3; i++) {
            let pokerSprite = this.allPokers[i];
            this.dipaiPokers[i] = pokerSprite;
        }
        this.bubbleSortCards(this.dipaiPokers);
        // this.showPokers(this.dipaiPokers, PlayerType.dipai);

    },
    showCards(type) {
        if (type == PlayerType.left) {
            var showPoker = this.leftShowPoker.getComponent('ShowPoker');
            showPoker.showPokers(this.leftPokers, PlayerType.left);
        } else if (type == PlayerType.right) {
            var showPoker = this.rightShowPoker.getComponent('ShowPoker');
            showPoker.showPokers(this.rightPokers, PlayerType.right);
        } else if (type == PlayerType.player) {
            var showPoker = this.playerHandCards.getComponent('ShowPoker');
            showPoker.showPokers(this.playerPokers, PlayerType.player);
        } else if (type == PlayerType.shoupai) {
            var showPoker = this.playerOutCards.getComponent('ShowPoker');
            showPoker.showPokers(cards, PlayerType.shoupai);
        } else {
            var showPoker = this.dipaiShowPoker.getComponent('ShowPoker');
            showPoker.showPokers(this.dipaiPokers, PlayerType.dipai);
        }
    },

    loadAllPoker(originCards) {
        for (let i = 0; i < originCards.length; i++) {

            let pokerSprite = cc.instantiate(this.poker);
            var Poker = pokerSprite.getComponent('Poker');
            var pokerName = Poker.creatCard(originCards[i])._imageName;
            // console.log("名称" + pokerName);
            pokerSprite.getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrameMap[pokerName];

            this.allPokers[i] = pokerSprite;
        }
        //洗牌
        this.allPokers = this.shuffleArray(this.allPokers);
        //发牌
        this.startDipai();
        this.startUp();
        this.startPlayer();
        this.startDown();

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
    //刷新显示数量
    refreshCount() {
        this.leftCount.string = "" + this.leftPokers.length;
        this.rightCount.string = "" + this.rightPokers.length;
    },

    start() {

    },

    // update (dt) {

    // },
});