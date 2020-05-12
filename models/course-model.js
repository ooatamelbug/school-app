const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    title:{
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
    teacher: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'Teacher',
            require:true,
            trim:true
        }
    ],
    image :{
        type:String,
        trim:true
    },
    specialists : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Specialist',
            trim:true
        }
    ],
    date: {
        type:Date,
        trim:true
    },
    paied : {
        type:Number,
        trim:true
    },
    content : [
        {
            type : String,
            trim:true
        }
    ],
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
},{timestamps:true})

module.exports = mongoose.model('Courses',CourseSchema);