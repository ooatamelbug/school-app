let io;

module.exports = {
    init : serverSetUp =>{
        io = require('socket.io')(serverSetUp);
        return io;
    },
    getIoSocket :()=>{
        if(!io){
            const error = new Error('io not init');
            throw error;
        }
        return io;
    }
}