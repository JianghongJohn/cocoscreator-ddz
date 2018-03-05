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
        // 使用给定的模板在场景中生成一个新节点
        // var newPoker = cc.instantiate(this.poker);
        // // 将新增的节点添加到 Canvas 节点下面
        // this.node.addChild(newPoker);
        // // 为星星设置一个随机位置
        // newPoker.setPosition(cc.p(0, 0));
        // var Poker = newPoker.getComponent('Poker');
        // var card =  Poker.creatCard(15);
        // console.log("名称"+card._imageName);
        // let self = this;
        // cc.loader.loadRes("poker", cc.SpriteAtlas, function (err, atlas) {
            
        //     var frame = atlas.getSpriteFrame(card._imageName);
        //     console.log(frame);
        //     self.poker.spriteFrame = frame;
        // });
        let self = this;
        cc.loader.loadRes('poker', cc.SpriteAtlas, function (err, assets) {
            console.log('====' + assets);

            let sflist = assets.getSpriteFrames();
            for (let i = 0; i < sflist.length; i++) {
                let sf = sflist[i];
                self.pokerSpriteFrameMap[sf._name] = sf;
            }
            console.log("获取完")
        });

        
        
    },
    startPoker(){
        let startx = 54 / 2;//开始x坐标
        for (let i = 0; i < 54; i++) {

            let pokerSprite = cc.instantiate(this.poker);
            var Poker = pokerSprite.getComponent('Poker');
            var pokerName =  Poker.creatCard(i+1)._imageName;
            console.log("名称"+pokerName);
            pokerSprite.getComponent(cc.Sprite).spriteFrame = this.pokerSpriteFrameMap[pokerName];

            let gap = 10;//牌间隙
            pokerSprite.scale = 0.4;

            this.node.addChild(pokerSprite);
            let x = (-startx) * gap + i * gap;
            // console.log(x);
            pokerSprite.setPosition(x, 0);
        }
    },
    start () {

    },

    // update (dt) {},
});
