
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SocketDataSchema = new Schema({
    teacher:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        trim:true,
    },
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        trim:true,
    },
    socketid : {
        type: String,
        trim:true
    },
    status: {
        type:Boolean,
        trim:true
    },
    date: {
        type:Date,
        trim:true
    }
},{timestamps:true})

module.exports = mongoose.model('SocketData',SocketDataSchema);