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
        
    },

    // onLoad () {},

    start () {

    },
    //展示Poker
    showPokers(cards, type) {
        let startx = cards.length / 2; //开始x坐标
        for (let i = 0; i < cards.length; i++) {

            let pokerSprite = cards[i];
            var Poker = pokerSprite.getComponent('Poker');
            this.node.addChild(pokerSprite);
            if (type == 0) {
                let gap = 18; //牌间隙
                pokerSprite.scale = 0.8;
                let x = (-startx) * gap + i * gap + gap/2;
                // console.log(x);
                pokerSprite.setPosition( -150 +x, 0);
            } else if (type == 1) {
                let gap = 18; //牌间隙
                pokerSprite.scale = 0.8;
                let x = (-startx) * gap + i * gap + gap/2;
                // console.log(x);
                pokerSprite.setPosition(150 + x, 0);
            } else if (type == 3) {
                let gap = 80; //牌间隙
                pokerSprite.scale = 0.5;
                let x = (-startx) * gap + gap/2 + i * gap;
                // console.log(x);
                pokerSprite.setPosition(x, 0);
            }  else if (type == 4) {
                let gap = 12; //牌间隙
                pokerSprite.scale = 0.6;
                let x = (-startx) * gap + gap/2 + i * gap;
                // console.log(x);
                pokerSprite.setPosition(x, 0);
            } else {
                let gap = 25; //牌间隙
                pokerSprite.scale = 1;
                let x = (-startx) * gap + i * gap + gap/2;
                // console.log(x);
                pokerSprite.setPosition(x, 0);
            }

        }

    },
    // update (dt) {},
});
