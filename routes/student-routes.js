const express = require('express');
const router = express.Router();
const StudentController = require('../controller/student-controller');

router.get('/',(req,res,next)=>{
    res.status(200).json({
        data:'go'
    })
})


router.post('/reg',[],StudentController.regesterToNewUserStudent);
router.post('/log',[],StudentController.loginToProfile);
router.post('/course',[],StudentController.getAllCourses);
router.post('/course/inter',[],StudentController.enterInNewCourse);
router.post('/content/self',[],StudentController.getAllHaveCourses);


module.exports = router;