const fs = require('fs');
const path = require('path');
const socket = require('../socketio');
const SocketData = require('../models/socket-user-model');
const Courses = require('../models/course-model');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const CourseLesson = require('../models/lesson-model');
const Student = require('../models/student-model');
const { validationResult } = require('express-validator');
const { StudentScrete } = require('../secure/secure');

let socketfunction;

exports.socketConnect = socketParam => {
    socketfunction = socketParam;
}
/********************************/
// login & regester
/********************************/



exports.loginToProfile = (req,res,next)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('validation input');
        error.statusCode = 402;
        throw error;
    }
    let { username,password} = req.body;
    let student;
    Student.findOne({$and:[{username:username},{status:true}]})
    .then( studentData =>{
        if(!studentData){
            const error = new Error('not regester');
            error.statusCode = 402;
            throw error;
        }
        student = studentData;
        return bcrypt.compare(password,studentData.password)
    })
    .then(isEqual=>{
        if(!isEqual){
            const error = new Error('password not rigth');
            error.statusCode = 402;
            throw error;
        }
        const token = jwt.sign({
            username: username,
            userId: student._id 
        },StudentScrete,{expiresIn:'12h'})
        res.status(200).json({
            token: token,
            id: student._id,
            data: {name:student.name,image:student.image || null } 
        })
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })   
}


exports.logOutProfile = (req,res,next)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('validation input');
        error.statusCode = 402;
        throw error;
    }

    let { id } = req.body;
    Student.findOne({$and:[{_id:id}]})
    .then( studentData =>{
        if(!studentData){
            const error = new Error('not regester');
            error.statusCode = 402;
            throw error;
        }
        return SocketData.findOne({student:id})
    })
    .then(socketData=>{
        if(!socketData){
            const error = new Error('not user');
            error.statusCode = 402;
            throw error;
        }
        socketData.socketid = null;
        socketData.status = false;
        return socketData.save()
            .then(data=>{
                if(!data){
                    const error = new Error('not user');
                    error.statusCode = 402;
                    throw error;
                }
                res.status(200).json({
                    status: true,
                    msg : 'go'
                })
            })
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })   
}

exports.regesterToNewUserStudent = (req,res,next)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('validation input');
        error.statusCode = 402;
        throw error;
    }
    const { name,username,password } = req.body;
    bcrypt.hash(password,12)
    .then(hashedPassword=>{
        if(!hashedPassword){
            const error = new Error('validation input');
            error.statusCode = 402;
            throw error;
        }
        const newStudent = new Student();
        newStudent.name = name;
        newStudent.username = username;
        newStudent.password = hashedPassword;
        newStudent.status = true;
        return newStudent.save();
    })
    .then( savedData =>{
        if(!savedData){
            const error = new Error('validation input');
            error.statusCode = 402;
            throw error;
        }
        res.status(201).json({
            msg: 'created please login'
        })
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}




/********************************/
// course
/********************************/

exports.getAllCourses = (req,res,next)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('validation input');
        error.statusCode = 402;
        throw error;
    }
    Courses.find({})
    .then(courseData=>{
        if(!courseData){
            res.status(404).json({
                data: []
            });
        }
        res.status(200).json({
            data: courseData
        });
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}


exports.getAllHaveCourses = (req,res,next)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('validation input');
        error.statusCode = 402;
        throw error;
    }
    const { id } =req.body;
    Student.findOne({$and:[
        {_id:username}
    ]},{courses:1}).populate("Courses").exec()
    .then( studentData =>{
        if(!studentData){
            const error = new Error('not regester');
            error.statusCode = 402;
            throw error;
        }
        if(studentData.courses.length < 0){
            res.status(404).json({
                data: []
            })
        }
        res.status(200).json({
            data : studentData.courses
        })
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.enterInNewCourse = (req,res,next)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('validation input');
        error.statusCode = 402;
        throw error;
    }
    const { id,courseid } =req.body;
    let coursech;
    Courses.findOne({_id:courseid})
    .then(courseData=>{
        if(!courseData){
            const error = new Error('not found');
            error.statusCode = 402;
            throw error;
        }
        coursech = courseData.teacher;
        return Student.findOne({_id:id})
            .then( studentData =>{
                if(!studentData){
                    const error = new Error('not regester');
                    error.statusCode = 402;
                    throw error;
                }
                console.log(studentData.courses)
                let incourse = studentData.courses.filter(course=>{
                    console.log(course)
                    return course == courseid;
                })
                console.log(incourse)

                if(incourse.length > 0){
                    const error = new Error('already in this');
                    error.statusCode = 402;
                    throw error;
                }

                studentData.courses.push(courseid);
                return studentData.save();
            })
    })
    .then(savedCourse=>{
        if(!savedCourse){
            const error = new Error('not found');
            error.statusCode = 402;
            throw error;
        }
        return SocketData.find({$and:[
            {teacher:{
                $in: coursech
            }},
            {status:true}
        ]})
        .then(socketData=>{
            if(socketData){
                socketData.forEach(socketOne=>{
                    return socket.getIoSocket().to(socketOne.socketid).emit('newstdcourse',{id:id});
                })
            }

            res.status(200).json({
                    data: 'go and sent'
            })
        })
        
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}


exports.getAllLessonCourses = (req,res,next)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('validation input');
        error.statusCode = 402;
        throw error;
    }
    const {id,courseid} = req.body;
    Student.aggregate([
        {
            "$match":{
                    _id:mongoose.Types.ObjectId(id)
            }
        },        
        {
            "$project":{
                coursehave:{
                    "$filter":{
                        input:"$courses",
                        as: "courses",
                        cond:{
                            "courses": mongoose.Types.ObjectId(courseid)
                        }
                    }
                }
            }
        },
        {
            "$project":{
                in_this_course : {
                    "$in" : [mongoose.Types.ObjectId(courseid), "$coursehave"]
                }
            }
        }
    ])
    .then(courseData=>{
        if(!courseData[0].in_this_course){
            const error = new Error('not found aggregate');
            error.statusCode = 404;
            throw error;
        }
        return {
            ok:'ok',
        }
    })
    .then(({ok})=>{
        if(!ok){
            const error = new Error('not found');
            error.statusCode = 404;
            throw error;
        }
    
        return CoursesLesson.find({course:courseid}).populate('Exam','Exercises').exec() ;
    })
    .then(courseData=>{
        if(!courseData){
            res.status(404).json({
                data: []
            });
        }
        res.status(200).json({
            data: courseData
        });
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}
