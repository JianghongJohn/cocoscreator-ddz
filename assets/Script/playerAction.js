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
       debugger
       var type = pokerTypes.sortByLength(pokers);
       var pokerData = new Array();
       for (const card of pokers) {
        var poker = card.getComponent('Poker');
        // let cardId = poker._cardId;
        // pokerData.push(cardId);
       }

       debugger;
    },

    // update (dt) {},
});
