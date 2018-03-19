let instance = null;
let Network = cc.Class({
    properties: {
    },
    initNetwork() {
        let socket = io.connect('192.168.0.56:3000');
        this.socket = socket;
    },

});

window.Network = instance ? instance : new Network();
