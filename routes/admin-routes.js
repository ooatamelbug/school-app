const express = require('express');
const router = express.Router();
const AdminController = require('../controller/admin-controller');

router.get('/',(req,res,next)=>{
    res.status(200).json({
        data:'go'
    })
})


router.post('/special',[],AdminController.addNewSpecialistTeacher);

module.exports = router;