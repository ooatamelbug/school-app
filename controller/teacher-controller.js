const fs = require('fs');
const path = require('path');
const socket = require('socket.io');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const Courses = require('../models/course-model');
const Student = require('../models/student-model');
const Exercises = require('../models/exercises-model');
const CourseLesson = require('../models/lesson-model');
const Teacher = require('../models/teacher-model');
const { validationResult } = require('express-validator');
const { TeacherScrete } = require('../secure/secure');


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
    const { username,password } = req.body;
    let teacher;
    Teacher.findOne({$and:[{username:username},{status:true}]})
    .then( teacherData =>{
        if(!teacherData){
            const error = new Error('not regester');
            error.statusCode = 402;
            throw error;
        }
        teacher = teacherData;
        return bcrypt.compare(password,teacherData.password)
    })
    .then(isEqual=>{
        if(!isEqual){
            const error = new Error('password not rigth');
            error.statusCode = 402;
            throw error;
        }
        const token = jwt.sign({
            username: username,
            userId: teacher._id 
        },TeacherScrete,{expiresIn:'12h'})
        res.status(200).json({
            token: token,
            id: teacher._id,
            data: {name:teacher.name,image:teacher.image || null ,specialist: teacher.specialists} 
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
    Teacher.findOne({$and:[{_id:id}]})
    .then( teacherData =>{
        if(!teacherData){
            const error = new Error('not regester');
            error.statusCode = 402;
            throw error;
        }
        return SocketData.findOne({teacher:id})
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


exports.regesterToNewUserTeacher = (req,res,next)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('validation input');
        error.statusCode = 402;
        throw error;
    }
    const { name,username,password,speicalist } = req.body;
    // specialist = specialist.split(',');
    bcrypt.hash(password,12)
    .then(hashedPassword=>{
        if(!hashedPassword){
            const error = new Error('validation input');
            error.statusCode = 402;
            throw error;
        }
        const newTeacher = new Teacher();
        newTeacher.name = name;
        newTeacher.username = username;
        newTeacher.password = hashedPassword;
        newTeacher.status = true;
        newTeacher.specialists.push(speicalist);
        return newTeacher.save();
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


exports.editTeacherData = (req,res,next)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('validation input');
        error.statusCode = 402;
        throw error;
    }
    const { id,name,username,password,speicalist,describtion } = req.body;
    bcrypt.hash(password,12)
    .then(hashedPassword=>{
        if(!hashedPassword){
            const error = new Error('validation input');
            error.statusCode = 402;
            throw error;
        }
        return Teacher.findOne({_id:id})
            .then(teacherData=>{
                if(!teacherData){
                    const error = new Error('validation input');
                    error.statusCode = 402;
                    throw error;
                }
                teacherData.name = name;
                teacherData.username = username;
                teacherData.password = hashedPassword;
                teacherData.describtion = describtion;
                teacherData.specialists.push(...speicalist);
                return teacherData.save();
            })
    })
    .then( savedData =>{
        if(!savedData){
            const error = new Error('validation input');
            error.statusCode = 402;
            throw error;
        }
        res.status(201).json({
            msg: 'editing'
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

exports.addNewCourseTeacher = (req,res,next)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('validation input');
        error.statusCode = 402;
        throw error;
    }
    const { title,describtion,id,speicalist,paied } = req.body;
    const newTeacherCourse = new Courses();
    newTeacherCourse.title = title;
    newTeacherCourse.describtion = describtion;
    newTeacherCourse.teacher.push(id);
    newTeacherCourse.status = false;
    newTeacherCourse.paied = paied;
    // newTeacherCourse.image = req.files.courseimage[0].path || 'course.png';
    newTeacherCourse.image = 'course.png';
    newTeacherCourse.specialists.push(speicalist);
    newTeacherCourse.save()
    .then( savedData =>{
        if(!savedData){
            const error = new Error('validation input');
            error.statusCode = 402;
            throw error;
        }
        res.status(201).json({
            msg: 'added course'
        })
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}


exports.addContentCourseTeacher = (req,res,next)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('validation input');
        error.statusCode = 402;
        throw error;
    }
    const { content,id,courseid } = req.body;
    Courses.aggregate([
        {
            "$match":{
                    _id:mongoose.Types.ObjectId(courseid)
            }
        },        
        {
            "$project":{
                teacher:{
                    "$filter":{
                        input:"$teacher",
                        as: "teacher",
                        cond:{
                            "teacher":id
                        }
                    }
                },
                title:1,
                describtion:1
            }
        },   
    ])
    .then(teacherData=>{
        if(!teacherData){
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
        return Courses.findOne({_id:courseid}) 
            .then(courseData=>{
                if(!courseData){
                    const error = new Error('not found');
                    error.statusCode = 404;
                    throw error;
                }
            
                let contentItem = content.split(',');
                if(courseData.content.length != 0 ){
                    const contentArray = courseData.content;
                    contentArray = [...contentArray,...contentItem];
                    courseData.content = contentArray;
                    return courseData.save();
                }else{
                    courseData.content = [...contentItem];
                    return courseData.save();
                }
            })
    })
    .then( savedData =>{
        if(!savedData){
            const error = new Error('error save');
            error.statusCode = 402;
            throw error;
        }
        res.status(201).json({
            msg: 'added content'
        })
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}


exports.addLessonDataCourseTeacher = (req,res,next)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('validation input');
        error.statusCode = 402;
        throw error;
    }
    const { title,describtion,id,courseid,image,pdf } = req.body;
    Courses.aggregate([
        {
            "$match":{
                    _id:mongoose.Types.ObjectId(courseid)
            }
        },        
        {
            "$project":{
                teacherhave:{
                    "$filter":{
                        input:"$teacher",
                        as: "teacher",
                        cond:{
                            "teacher": mongoose.Types.ObjectId(id)
                        }
                    }
                },
                title:1,
                describtion:1
            }
        },
        {
            "$project":{
                maketeacher : {
                    "$in" : [mongoose.Types.ObjectId(id), "$teacherhave"]
                }
            }
        }
    ])
    .then(teacherData=>{
        if(!teacherData[0].maketeacher){
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
    
        const newLessonCourse = new CourseLesson();
        newLessonCourse.title = title;
        newLessonCourse.describtion = describtion;
        newLessonCourse.teacher = id;
        newLessonCourse.course = courseid;
        newLessonCourse.pdf = pdf;
        newLessonCourse.status = false;
        newLessonCourse.image = image;
        return newLessonCourse.save()
    })
    .then( savedData =>{
        if(!savedData){
            const error = new Error('validation input');
            error.statusCode = 402;
            throw error;
        }
        res.status(201).json({
            msg: 'added course lesson'
        })
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}


exports.addVideoDataCourseTeacher = (req,res,next)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('validation input');
        error.statusCode = 402;
        throw error;
    }
    const { name,describtion,id,courseid,lessonid } = req.body;
    Courses.aggregate([
        {
            "$match":{
                    _id:mongoose.Types.ObjectId(courseid)
            }
        },        
        {
            "$project":{
                teacherhave:{
                    "$filter":{
                        input:"$teacher",
                        as: "teacher",
                        cond:{
                            "teacher": mongoose.Types.ObjectId(id)
                        }
                    }
                },
                title:1,
                describtion:1
            }
        },
        {
            "$project":{
                maketeacher : {
                    "$in" : [mongoose.Types.ObjectId(id), "$teacherhave"]
                }
            }
        }
    ])
    .then(teacherData=>{
        if(!teacherData[0].maketeacher){
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
    
        return CourseLesson.findOne({$and:[
                {_id:lessonid},{teacher:id}
            ]})
            .then(lessonData=>{
                if(!lessonData){
                    const error = new Error('not found');
                    error.statusCode = 404;
                    throw error;
                }
                lessonData.videos.push({
                    name : name,
                    describtion : describtion,
                    status : false,
                    date : new Date()
                });
                return lessonData.save();
            })
    })
    .then( savedData =>{
        if(!savedData){
            const error = new Error('validation input');
            error.statusCode = 402;
            throw error;
        }
        res.status(201).json({
            msg: 'added course lesson video'
        })
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.changeStatusLessonCourseTeacher = (req,res,next)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('validation input');
        error.statusCode = 402;
        throw error;
    }
    const { id,courseid,lessonid } = req.body;
    Courses.aggregate([
        {
            "$match":{
                    _id:mongoose.Types.ObjectId(courseid)
            }
        },        
        {
            "$project":{
                teacherhave:{
                    "$filter":{
                        input:"$teacher",
                        as: "teacher",
                        cond:{
                            "teacher": mongoose.Types.ObjectId(id)
                        }
                    }
                },
                title:1,
                describtion:1
            }
        },
        {
            "$project":{
                maketeacher : {
                    "$in" : [mongoose.Types.ObjectId(id), "$teacherhave"]
                }
            }
        }
    ])
    .then(teacherData=>{
        if(!teacherData[0].maketeacher){
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
    
        return CourseLesson.findOne({$and:[
                {_id:lessonid},{teacher:id}
            ]})
            .then(lessonData=>{
                if(!lessonData){
                    const error = new Error('not found');
                    error.statusCode = 404;
                    throw error;
                }
                lessonData.status = !lessonData.status;
                return lessonData.save();
            })
    })
    .then( savedData =>{
        if(!savedData){
            const error = new Error('validation input');
            error.statusCode = 402;
            throw error;
        }
        Student.aggregate([
            {
                "$project":{
                    "course" : {
                        $filter:{
                            input:"$courses",
                            as: "course",
                            cond: {
                                $in: [mongoose.Types.ObjectId(courseid),"$courses"]
                            }
                        }
                    },
                    "_id":1
                }
            },
            {
                "$match":{
                    $and:[
                        {course: true}
                    ]
                }
            },
            {
                "$project":{
                    _id:1
                }
            }
        ]).then( coursedata=>{
            if(!coursedata){
                res.status(200).json({
                    data: 'go'
                })
            }
            let studentId = [];
            coursedata.forEach(student=>{
                return studentId.push(student);
            })
            return SocketData.find({$and:[
                {
                    student:{
                        $in: studentId
                    }
                },
                {status:true}
            ]})
            .then(socketData=>{
                if(socketData){
                    socketData.forEach(socket=>{
                        return socketfunction.to(socket.socketid).emit('newstdcourse',{id:id});
                    })
                    res.status(200).json({
                        data: 'go'
                    })
                }
                res.status(200).json({
                    data: 'go'
                })
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

/********************************/

exports.addLessonExerciseCourseTeacher = (req,res,next)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('validation input');
        error.statusCode = 402;
        throw error;
    }
    const { name,describtion,id,courseid } = req.body;
    Courses.aggregate([
        {
            "$match":{
                    _id:mongoose.Types.ObjectId(courseid)
            }
        },        
        {
            "$project":{
                teacherhave:{
                    "$filter":{
                        input:"$teacher",
                        as: "teacher",
                        cond:{
                            "teacher": mongoose.Types.ObjectId(id)
                        }
                    }
                },
                title:1,
                describtion:1
            }
        },
        {
            "$project":{
                maketeacher : {
                    "$in" : [mongoose.Types.ObjectId(id), "$teacherhave"]
                }
            }
        }
    ])
    .then(teacherData=>{
        if(!teacherData[0].maketeacher){
            const error = new Error('not found aggregate');
            error.statusCode = 404;
            throw error;
        }
        return {
            ok:teacherData[0].maketeacher,
        }
    })
    .then(({ok})=>{
        if(!ok){
            const error = new Error('not found');
            error.statusCode = 404;
            throw error;
        }
    
        const newExerciseCourse = new Exercises();
        newExerciseCourse.name = name;
        newExerciseCourse.describtion = describtion;
        newLessonCourse.teacher = id;
        newExerciseCourse.course = courseid;
        newExerciseCourse.status = false;
        return newExerciseCourse.save()
    })
    .then( savedData =>{
        if(!savedData){
            const error = new Error('validation input');
            error.statusCode = 402;
            throw error;
        }
        res.status(201).json({
            msg: 'added course Exercises'
        })
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}


exports.addExercisesDataCourseTeacher = (req,res,next)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('validation input');
        error.statusCode = 402;
        throw error;
    }
    const { title,typeexercise,id,courseid,exerciseid,choice } = req.body;
    Courses.aggregate([
        {
            "$match":{
                    _id:mongoose.Types.ObjectId(courseid)
            }
        },        
        {
            "$project":{
                teacherhave:{
                    "$filter":{
                        input:"$teacher",
                        as: "teacher",
                        cond:{
                            "teacher": mongoose.Types.ObjectId(id)
                        }
                    }
                },
                title:1,
                describtion:1
            }
        },
        {
            "$project":{
                maketeacher : {
                    "$in" : [mongoose.Types.ObjectId(id), "$teacherhave"]
                }
            }
        }
    ])
    .then(teacherData=>{
        if(!teacherData[0].maketeacher){
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
    
        return Exercises.findOne({$and:[
                {_id:exerciseid},{teacher:id}
            ]})
            .then(exerciseData=>{
                if(!exerciseData){
                    const error = new Error('not found');
                    error.statusCode = 404;
                    throw error;
                }
                exerciseData.exerice_content.push({
                    title : title,
                    type_Exercise : typeexercise,
                    status : true,
                    choises : choice
                });
                return exerciseData.save();
            })
    })
    .then( savedData =>{
        if(!savedData){
            const error = new Error('validation input');
            error.statusCode = 402;
            throw error;
        }
        res.status(201).json({
            msg: 'added course lesson video'
        })
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}
