const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LessonChatRoomSchema = new Schema({
    course :{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        trim:true
    },
    lesson :{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'CourseLesson',
        trim:true
    },
    teacher :{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        trim:true
    },
    student :{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        trim:true
    },
    text_chat:{
        type:String,
        trim:true,
    },
    image_chat:{
        type:String,
        trim:true,
    },
    date : Date,
    status: {
        type:Number,
        trim:true
    },
    room:{
        name: {
            type:String,
            trim:true
        },
        room_id: {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'LessonRoom',
            trim:true
        }
    }
},{timestamps:true})

module.exports = mongoose.model('LessonChatRoom',LessonChatRoomSchema);