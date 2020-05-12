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
    exam :{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        trim:true
    },
    anwser:[
        {
            question_id : {
                type:mongoose.Schema.Types.ObjectId,
                ref: 'Exam.questions',
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
                ref: 'Exam.questions.question_choices',
                trim:true
            },
            anwser_true_false:{
                type: mongoose.Schema.Types.ObjectId ,
                ref: 'Exam.questions.question_true_or_false',
                trim:true
            },
            anwser_bool:{
                type: Boolean,
                trim:true
            },
            anwser_matching: [
                {
                    statement: {
                        type: mongoose.Schema.Types.ObjectId ,
                        ref: 'Exam.questions.question_matching.first_statement',
                        trim:true
                    },
                    anwser:{
                        type:String,
                        trim:true
                    }
                }
            ]
        }
    ],
    correct_question: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Exam.questions',
            trim:true
        }
    ],
    wrong_question: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Exam.questions',
            trim:true
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