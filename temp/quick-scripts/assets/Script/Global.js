(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Global.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '58ef9gFQphEqZHrTKIXEjjt', 'Global', __filename);
// Script/Global.js

'use strict';

window.Global = {
    playerName: '', //玩家名称
    roomWaitType: 'create',
    roomNum: 0, //房间号
    allPokers: [], //所有牌
    selectPokers: [], //选择的牌
    isPass: false, //是否点了不出
    roomIndex: -1 //当前玩家座位号 (0,1,2);
};

// /**
//  * Custom
//  */
// cc.Component.prototype.$ = cc.Component.prototype.getComponent;
// cc.Node.prototype.$ = cc.Node.prototype.getComponent;
// cc.Node.prototype.gn = cc.Node.prototype.getChildByName;
// cc.Component.prototype.$$ = cc.Node.prototype.$$ = function(component,value){
//     let com = this.$(component);
//     if(component == cc.Label){
//         com.string = value;
//     }else if(component == cc.Sprite){
//         com.spriteFrame = value;
//     }
//     return com;
// };
// cc.Node.prototype.gns = function(...value){
//     let node = this;
//     for(let i = 0;i<value.length;i++){
//         node = node.gn(value[i]);
//     }
//     return node;
// };

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
        //# sourceMappingURL=Global.js.map
        