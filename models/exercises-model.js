const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ExercisesSchema = new Schema({
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
    name: {
        type:String,
        trim:true,
        required:true
    },
    describtion: {
        type:String,
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
    exerice_content: [
        {
            title:{
                type:String,
                trim:true
            },
            type_Exercise :{
                type: String,
                trim:true
            },
            choises:[
                {
                    text_choices:{
                        type:String,
                        trim:true
                    },
                    correct:{
                        type :Boolean,
                        trim:true
                    }
                }
            ],
            status: {
                type:Boolean,
                trim:true
            }
        }
    ]
},{timestamps:true})

module.exports = mongoose.model('Exercises',ExercisesSchema);