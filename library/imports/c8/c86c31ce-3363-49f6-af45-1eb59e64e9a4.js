"use strict";
cc._RF.push(module, 'c86c3HOM2NJ9q9FHrWeZOmk', 'NetWork');
// Script/NetWork.js

'use strict';

var instance = null;
var Network = cc.Class({
    properties: {
        socket: null
    },
    initNetwork: function initNetwork() {
        var socketIo = io.connect('192.168.0.56:3000');
        this.socket = socketIo;
    }
});

window.Network = instance ? instance : new Network();

cc._RF.pop();