var pokerTypes = require('pokerTypes');
cc.Class({
    extends: cc.Component,

    properties: {
        buchuBtn: cc.Button, 
        tishiBtn: cc.Button, 
        chupaiBtn: cc.Button, 
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    buchuAction(){
        let mes = {playerIndex:Global.roomIndex,roomNum: Global.roomNum};

        Network.socket.emit('buchu',  Network.stringifyJson(mes));

        this.node.active = false;
    },
    chupaiAction(){
       let pokers = Global.selectPokers;
       pokerTypes.bubbleSortCards(pokers);
       if (pokers.length == 0) {
           //牌型不符合
           console.log("未选择牌");
           return;
       }
       var thisType = pokerTypes.sortByLength(pokers);
       if (thisType == 14) {
           //牌型不符合
           console.log("牌型错误");
           return;
       }
             //判断当前牌是否大于上一手
    //    Global.isFirst = isFirst;
    //    Global.lastPokerType = data.lastPokerType;
    if (Global.isFirst == false) {
        let lastType=  Global.lastPokerType;
        if (pokerTypes.comparePokers(lastType,thisType) == false) {
            console.log("牌型错误或者小于");
            alert("牌型错误或者小于");
           return;
        }
    }
       var pokerData = new Array();
       for (const card of pokers) {
        var poker = card.getComponent('Poker');
        let cardId = poker._cardId;
        pokerData.push(cardId);
       }

       let mes = {pokers:pokerData,cardsType:thisType,roomNum: Global.roomNum,playerIndex:Global.roomIndex};

       Network.socket.emit('chupai',  Network.stringifyJson(mes));

    },

    // update (dt) {},
});
