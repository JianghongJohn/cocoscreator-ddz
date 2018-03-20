let instance = null;
let Network = cc.Class({
    properties: {
        socket:null
    },
    initNetwork() {
        let socketIo = io.connect('192.168.0.56:3000');
        this.socket = socketIo;
    },

});

window.Network = instance ? instance : new Network();
