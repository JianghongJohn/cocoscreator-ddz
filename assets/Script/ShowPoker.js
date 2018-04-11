const POSITION_UP = 1;
const POSITION_DOWN = 2;

var pokerTypes = require('pokerTypes');
cc.Class({
    extends: cc.Component,

    properties: {
        canTouch: false,
        _pokerSpriteList: null,
        _touchStart: null,
        _touchMove: null,
    },

    // use this for initialization
    onLoad() {
        console.log('mynode on load.');
        //只有用户手牌允许点击
        if (this.canTouch) {
            this.node.on('touchstart', this.startCallback, this);
            this.node.on('touchend', this.endCallback, this);
            this.node.on('touchmove', this.moveCallback, this);
        }
        this._pokerSpriteList = [];
    },

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.startCallback, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.endCallback, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.moveCallback, this);
    },
    //销毁Poker
    desTroyPokers(cards) {
        if (cards.length == 0) {
            cards = this._pokerSpriteList;
        }
        for (const pokerSprite of cards) {
            pokerSprite.destroy();
        }
    },
    start() {

    },
    /* 展示poker */
    showPokers(cards, type) {
        this.desTroyPokers(this._pokerSpriteList);
        if (type == 0||type == 1||type == 4) {
            cards = pokerTypes.secondSortWithCards(cards);
            debugger
        }
 
        this._pokerSpriteList = [];

        let startx = cards.length / 2; //开始x坐标

        for (let i = 0; i < cards.length; i++) {

            let pokerSprite = cards[i];
            pokerSprite.removeFromParent(false);
            //存储Poker节点
            this._pokerSpriteList.push(pokerSprite);

            // var Poker = pokerSprite.getComponent('Poker');
            this.node.addChild(pokerSprite);
            if (type == 0) {
                let gap = 18; //牌间隙
                pokerSprite.scale = 0.8;
                let x = (-startx) * gap + i * gap + gap / 2;
                // console.log(x);
                pokerSprite.setPosition(-150 + x, 0);
            } else if (type == 1) {
                let gap = 18; //牌间隙
                pokerSprite.scale = 0.8;
                let x = (-startx) * gap + i * gap + gap / 2;
                // console.log(x);
                pokerSprite.setPosition(150 + x, 0);
            } else if (type == 3) {
                let gap = 80; //牌间隙
                pokerSprite.scale = 0.5;
                let x = (-startx) * gap + gap / 2 + i * gap;
                // console.log(x);
                pokerSprite.setPosition(x, 0);
            } else if (type == 4) {
                let gap = 12; //牌间隙
                pokerSprite.scale = 0.6;
                let x = (-startx) * gap + gap / 2 + i * gap;
                // console.log(x);
                pokerSprite.setPosition(x, 0);
            } else {
                let gap = 25; //牌间隙
                pokerSprite.scale = 1;
                let x = (-startx) * gap + i * gap + gap / 2;
                // console.log(x);
                pokerSprite.setPosition(x, 0);
            }

        }

    },
    //点击事件

    /**
     * 收起所有牌
     */
    pokerAllDown() {
        for (let i in this._pokerSpriteList) {
            let pokerSprite = this._pokerSpriteList[i];
            if (pokerSprite.status === POSITION_UP)
                pokerSprite.y -= 20;

            pokerSprite.status = POSITION_DOWN;
            pokerSprite.isChiose = false;
            // pokerSprite.opacity = 255;
            pokerSprite.color = new cc.color(255, 255, 255);

            Global.selectPokers = [];
        }
    },

    //点击到牌
    _getCardForTouch(touch) {
        for (let i = this._pokerSpriteList.length - 1; i >= 0; i--) { // 需要倒序
            let pokerSprite = this._pokerSpriteList[i];
            //全屏坐标系
            let box = pokerSprite.getBoundingBoxToWorld();
            if (cc.rectContainsPoint(box, touch)) {
                // console.log('in');
                pokerSprite.isChiose = true;
                pokerSprite.color = new cc.color(200, 200, 200);

                // pokerSprite.opacity = 185;
                return; //关键， 找到一个就返回
            } else {
                //this.pokerAllDown();
            }

        }
    },

    //检测牌复原
    _checkSelectCardReserve(touchBegan, touchMoved) {
        // console.log('_checkSelectCardReserve');
        let p1 = touchBegan.x < touchMoved.x ? touchBegan : touchMoved;

        if (p1 === touchMoved) {
            // for (let i = this._pokerSpriteList.length - 1; i >= 0; i--) {
            for (let i in this._pokerSpriteList) {
                let sprite = this._pokerSpriteList[i];
                if (p1.x - sprite.x > -25) { //
                    pokerSprite.color = new cc.color(255, 255, 255);
                    // sprite.opacity = 255;
                    sprite.isChiose = false;
                }
            }
        } else {
            let width = Math.abs(touchBegan.x - touchMoved.x);
            let height = Math.abs(touchBegan.y - touchMoved.y) > 5 ? Math.abs(touchBegan.y - touchMoved.y) : 5;
            let rect = cc.rect(p1.x, p1.y, width, height);

            for (let i = 0; i < this._pokerSpriteList.length; i++) {
                if (!cc.rectIntersectsRect(this._pokerSpriteList[i].getBoundingBoxToWorld(), rect)) {
                    this._pokerSpriteList[i].isChiose = false;
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
    startCallback(event) {
        // console.log(touchLoc.x + "," + touchLoc.y)
        let touches = event.getTouches();
        let touchLoc = touches[0].getLocation();
        // console.log("start:" + touchLoc.x + "," + touchLoc.y)
        this._touchStart = this.node.convertToNodeSpace(touchLoc); //将坐标转换为当前节点坐标
        // console.log(this._touchStart.x + "," + this._touchStart.y)
        this._getCardForTouch(this._touchStart);
    },


    moveCallback(event) {
        let touches = event.getTouches();
        let touchLoc = touches[0].getLocation();
        // console.log("move:" + touchLoc.x + "," + touchLoc.y)
        this._touchMove = this.node.convertToNodeSpace(touchLoc); //将坐标转换为当前节点坐标
        this._getCardForTouch(this._touchMove);
        //当选过头了，往回拖的时候取消选择
        // this._checkSelectCardReserve(this._touchStart, this._touchMove);
    },


    endCallback(event) {
        // console.log("end")

        for (let i = 0; i < this._pokerSpriteList.length; i++) {
            let pokerSprite = this._pokerSpriteList[i];

            if (pokerSprite.isChiose) {
                pokerSprite.isChiose = false;
                // pokerSprite.opacity = 255;
                pokerSprite.color = new cc.color(255, 255, 255);
                if (pokerSprite.status === POSITION_UP) {
                    pokerSprite.status = POSITION_DOWN;
                    pokerSprite.y -= 20;

                    //移除所选牌
                    let index = -1;
                    for (let k in Global.selectPokers) {
                        let selectPoker = Global.selectPokers[k];
                        //选中的卡牌
                        var selectCard = selectPoker.getComponent('Poker');
                        //数组里的卡牌
                        var card = pokerSprite.getComponent('Poker');
                        if (selectCard._imageName == card._imageName)
                            index = k;
                    }
                    if (index != -1)
                        Global.selectPokers.splice(index, 1);
                } else {
                    pokerSprite.status = POSITION_UP;
                    pokerSprite.y += 20;

                    //添加选择的牌
                    Global.selectPokers.push(pokerSprite);
                }
            } else {

            }
        }
    },

    // update (dt) {},
});