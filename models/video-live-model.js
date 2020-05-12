const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VideoLiveTableSchema = new Schema({
    course :{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        trim:true
    },
    title:{
        type:String,
        trim:true,
        required:true
    },
    date : Date,
    describtion: {
        type:String,
        trim:true,
    },
    status: {
        type:Boolean,
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

module.exports = mongoose.model('VideoLiveTable',VideoLiveTableSchema);