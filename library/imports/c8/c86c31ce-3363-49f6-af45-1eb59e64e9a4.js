"use strict";
cc._RF.push(module, 'c86c3HOM2NJ9q9FHrWeZOmk', 'NetWork');
// Script/NetWork.js

'use strict';

var instance = null;
var Network = cc.Class({
    properties: {},
    initNetwork: function initNetwork() {
        var socket = io.connect('192.168.0.56:3000');
        this.socket = socket;
    }
});

window.Network = instance ? instance : new Network();

cc._RF.pop();