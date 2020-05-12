
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ChatRoomSchema = new Schema({
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
    lesson :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CourseLesson',
        trim:true
    }
},{timestamps:true})

module.exports = mongoose.model('LessonRoom',ChatRoomSchema);