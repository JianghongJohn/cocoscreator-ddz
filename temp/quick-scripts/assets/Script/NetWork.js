(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/NetWork.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c86c3HOM2NJ9q9FHrWeZOmk', 'NetWork', __filename);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=NetWork.js.map
        