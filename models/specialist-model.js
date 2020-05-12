
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SpecialistSchema = new Schema({
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
    image :{
        type:String,
        trim:true
    }
},{timestamps:true})

module.exports = mongoose.model('Specialist',SpecialistSchema);