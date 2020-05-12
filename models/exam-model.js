const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ExamSchema = new Schema({
    course :{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        trim:true
    },
    name:{
        type:String,
        trim:true,
        required:true
    },
    describtion : {
        type: String,
        trim:true
    },
    date:{
        type:Date,
        trim:true
    },
    status:{
        type: Boolean,
        trim:true
    },
    show_question:{
        type:Number,
        trim:true
    },
    questions: [
        {
            question_title: {
                type:String,
                required:true,
                trim:true
            },
            question_type: {
                type:String,
                required:true,
                trim:true
            },
            question_image: {
                type:String,
                trim:true
            },
            question_choices: [
                {
                    choice_string:{ 
                        type:String,
                        trim:true
                    },
                    choice_image:{
                        type:String,
                        trim:true
                    },
                    correct : {
                        type:Boolean,
                        trim:true
                    }
                }
            ],
            question_true_or_false: [
                {
                    correct : {
                        type:Boolean,
                        trim:true
                    }
                }
            ],
            question_matching: [
                {   
                    first_statement : [
                        {
                            statement: {
                                type:String,
                                trim:true
                            },
                            image: {
                                type:String,
                                trim:true
                            },
                            correct_statment : [
                                {
                                    type:String,
                                    trim:true
                                }
                            ]
                        }
                    ],
                    opposite_statement : [
                        {
                            statement: {
                                type:String,
                                trim:true
                            },
                            image_statement: {
                                type:String,
                                trim:true
                            }
                        }
                    ]
                }
            ],
            degree: {
                type: Number,
                trim:true
            },
            answer_correct_time :{
                type: Boolean,
                trim:true
            }
        }
    ]
},{timestamps:true})

module.exports = mongoose.model('Exam',ExamSchema);