const express = require('express');
const router = express.Router();
const TeacherController = require('../controller/teacher-controller');

router.get('/',(req,res,next)=>{
    res.status(200).json({
        data:'go'
    })
})


router.post('/reg',[],TeacherController.regesterToNewUserTeacher);
router.post('/log',[],TeacherController.loginToProfile);
router.post('/edit',[],TeacherController.editTeacherData);
router.post('/course',[],TeacherController.addNewCourseTeacher);
router.post('/content',[],TeacherController.addContentCourseTeacher);
router.post('/lesson',[],TeacherController.addLessonDataCourseTeacher);
router.post('/exercise',[],TeacherController.addLessonDataCourseTeacher);
router.post('/exam',[],TeacherController.addLessonDataCourseTeacher);
router.post('/video/lesson',[],TeacherController.addVideoDataCourseTeacher);

module.exports = router;