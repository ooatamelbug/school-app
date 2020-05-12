const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StudentLessonSchema = new Schema({
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
    lesson_course_Student:[
        {
            lesson :{
                type:mongoose.Schema.Types.ObjectId,
                ref: 'CourseLesson',
                trim:true
            },
            exercise:[
                {
                    type:mongoose.Schema.Types.ObjectId,
                    ref: 'Exercises',
                    trim:true
                }
            ],
            video:[
                {
                    type:mongoose.Schema.Types.ObjectId,
                    ref: 'CourseLesson.videos',
                    trim:true
                }
            ],
            status:{
                type:Boolean,
                trim:true
            }
        }  
    ],
    date : Date,
    status: {
        type:Boolean,
        trim:true
    }
},{timestamps:true})

module.exports = mongoose.model('StudentLesson',StudentLessonSchema);