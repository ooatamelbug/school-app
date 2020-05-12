const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    describtion : {
        type: String,
        trim:true
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
    rate : {
        count: Number,
        student : [
            {
                student_id : {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Student',
                    trim:true
                },
                rate: Number
            }
        ]
    },
    specialists : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Specialist',
            trim:true
        }
    ]
},{timestamps:true})

module.exports = mongoose.model('Teacher',TeacherSchema);