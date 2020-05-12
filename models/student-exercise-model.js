const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StudentExamSchema = new Schema({
    course :{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        trim:true
    },
    student :{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        trim:true
    },
    lesson :{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'CourseLesson',
        trim:true
    },
    exercise :{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Exercises',
        trim:true
    },
    anwser:[
        {
            exerice_content_id : {
                type:mongoose.Schema.Types.ObjectId,
                ref: 'Exercises.exerice_content',
                trim:true
            },
            anwsered:{
                type:Boolean,
                trim:true
            },
            anwser_text:{
                type:String,
                trim:true
            },
            anwser_choice:{
                type: mongoose.Schema.Types.ObjectId ,
                ref: 'Exam.exerice_content.choises',
                trim:true
            }
        }
    ],
    count_degree:{
        type: Number,
        default:0,
        trim:true
    },
    date : Date,
    status: {
        type:Boolean,
        trim:true
    },
    time: {
        type:Number,
        trim:true
    }
},{timestamps:true})

module.exports = mongoose.model('StudentExam',StudentExamSchema);