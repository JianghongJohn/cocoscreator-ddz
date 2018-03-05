// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        poker: cc.Prefab,    //扑克
        pokerSpriteFrameMap: {
            default: {},
            visible: false,
        },
        allPokers:[],  //所有牌
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
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
    startPoker(){
        // let startx = 54 / 2;//开始x坐标
        // for (let i = 0; i < 54; i++) {

        //     let pokerSprite = cc.instantiate(this.poker);
        //     var Poker = pokerSprite.getComponent('Poker');
        //     var pokerName =  Poker.creatCard(i+1)._imageName;
        //     console.log("名称"+pokerName);
        //     pokerSprite.getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrameMap[pokerName];

        //     let gap = 15;//牌间隙
        //     pokerSprite.scale = 0.7;

        //     this.node.addChild(pokerSprite);
        //     let x = (-startx) * gap + i * gap;
        //     // console.log(x);
        //     pokerSprite.setPosition(x, 0);
        // }
    },
    //生成上家
    startUp(){

    },
    //生成上家
    startDown(){

    },
    //生成当前玩家
    startPlayer(){

    },


    start () {

    },

    // update (dt) {},
});
