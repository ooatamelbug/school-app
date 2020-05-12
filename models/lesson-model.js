const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LessonSchema = new Schema({
    title:{
        type: String,
        trim:true,
        required:true
    },
    describtion:{
        type: String,
        trim:true
    },
    image:{
        type: String,
        trim:true
    },
    pdf:{
        type: String,
        trim:true
    },
    course :{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        trim:true
    },
    teacher :{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        trim:true
    },
    date: {
        type:Date,
        trim:true
    },
    status: {
        type:Boolean,
        trim:true
    },
    exercise : [
        {
            exercise_id:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Exercises',
                trim:true
            },
            describtion : {
                type: String,
                trim:true
            },
            status:{
                type:Boolean,
                trim:true
            }
        }
    ],
    exams : [
        {
            exam_id:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Exercises',
                trim:true
            },
            describtion : {
                type: String,
                trim:true
            },
            status:{
                type:Boolean,
                trim:true
            }
        }
    ],
    videos: [
        {
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
            date: {
                type:Date,
                trim:true
            }
        }
    ]
},{timestamps:true})

module.exports = mongoose.model('CourseLesson',LessonSchema);