const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    status: {
        type:Boolean,
        trim:true
    },
    username: {
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    password : {
        type: String,
        trim:true,
        required:true
    },
    image :{
        type:String,
        trim:true
    },
    courses : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Courses',
            trim:true
        }
    ]
},{timestamps:true})

module.exports = mongoose.model('Student',StudentSchema);