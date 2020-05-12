const fs = require('fs');
const path = require('path');
const socket = require('socket.io');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Courses = require('../models/course-model');
const Specialist = require('../models/specialist-model');
const Student = require('../models/student-model');
const Teacher = require('../models/teacher-model');
const { validationResult } = require('express-validator');
const { TeacherScrete } = require('../secure/secure');



exports.addNewSpecialistTeacher = (req,res,next)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('validation input');
        error.statusCode = 402;
        throw error;
    }
    const { title,describtion } = req.body;
    const newSpecialistCourse = new Specialist();
    newSpecialistCourse.title = title;
    newSpecialistCourse.describtion = describtion;
    newSpecialistCourse.status = true;
    newSpecialistCourse.save()
    .then( savedData =>{
        if(!savedData){
            const error = new Error('validation input');
            error.statusCode = 402;
            throw error;
        }
        res.status(201).json({
            msg: 'added Specialist course'
        })
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}

