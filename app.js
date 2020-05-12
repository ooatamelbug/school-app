const express = require('express');
const fs = require('fs');
const LessonRoom = require('./models/chatroom-model');
const SocketData = require('./models/socket-user-model');
const path = require('path');
const multer = require('multer');
// const socketIo = require('socket.io');
const socketIo = require('./socketio');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const graphqlSchema = require('./graphql/schema');
const {MONGO_URI} = require('./config/database');
const studentController = require('./controller/student-controller');
const adminRouter = require('./routes/admin-routes');
const teacherRouter = require('./routes/teacher-routes');
const studentRouter = require('./routes/student-routes');

const app = express();
const server = require('http').createServer(app);
const io = socketIo.init(server);

const fileStorage = multer.diskStorage({
    destination : (req,file,cb)=>{
        return cb(null,'uploads/'+file.filename);
    },
    "rename" : function(fieldname,filename,req,res){
        return path.join(fieldname);
    },
    filename : (req,file,cb)=>{
        cb(null,new Date().getTime()+ '_' + file.originalname);
    }
})

const fileAllow = ['jpg','jpeg','png','mp4'];
const fileFilter = (req,file,cb)=>{
    let inArray = fileAllow.filter( fileType =>{
        return fileType === file.mimetype;
    })
    if(inArray){
        cb(null,true);
    }else{
        cb(null,false);
    }
}

app.use(multer({
    storage : fileStorage,
    limits : {
        fileSize : 100*1024*1024
    },
    fileFilter : fileFilter
}).fields([
    {name: 'commentimage',maxCount :10},
    {name: 'coursecover',maxCount :5},
    {name:'courseimage',maxCount:1},
    {name: 'instructorimage',maxCount :2},
    {name: 'studentimage',maxCount :2},
    {name: 'courselessonimage',maxCount :10},
    {name: 'courselessonvideo',maxCount :10}
]))

app.use(bodyParser.json());

app.use('/uploads',express.static(path.join(__dirname,'uploads')))

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Method','OPTIONS,PUT,GET,POST,DELETE,PATCH');
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    if(req.method == 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
})

app.use((error,req,res,next)=>{
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message,
        data
    })
})

app.use('/api/admin',adminRouter);
app.use('/api/student',studentRouter);
app.use('/api/teacher',teacherRouter);

let userInSocket = [];
let count = 0;

io.on("connection",socket=>{
    socket.on('data',data=>{
        let dataPush = {
            socketId : socket.id,
            userId: data.uid
        };
        let found = userInSocket.filter(user=>{
            return user.userId == data.uid;
        });
        if(found.length > 0){
            found[0].socketId = socket.id;
            found[0].userId = found[0].userId;
            let userInSocketNew = userInSocket.filter(users=>{
                return users.userId != data.uid;
            });
            userInSocket = [...userInSocketNew,found];
        }else{
            userInSocket.push(dataPush);
        }

        SocketData.findOne({$or:[
            {teacher:data.uid},{student:data.uid}
        ]})
        .then(socketData=>{
            if(!socketData){
                const newSocket = new SocketData();
                newSocket.socketid = socket.id == data.socketid ? socket.id : data.socketid; 
                if(data.teacher){
                    newSocket.teacher = data.uid; 
                }else{
                    newSocket.student = data.uid; 
                }
                newSocket.status = true;
                newSocket.date = new Date();
                return newSocket.save();
            }
            socketData.socketid =  socket.id;
            socketData.date = new Date();
            return socketData.save();
        }).catch(err=>{
            if(!err.statusCode){
                err.statusCode = 500;
            }
            throw err;
        })
    })
    // SocketData.findOne({$or:[
    //     {status:true}
    // ]}).countDocuments()
    // .then(socketData=>{
    //     socket.emit('userconection', socketData);
    // })
    // count += io.sockets.clients.length
    // io.sockets.on('connect',(data)=> {
        // count++ ;
        // console.log(data)
        // socket.emit('userconection', count);
    // });
    // console.log(count);
    // io.sockets.on('disconnect',()=> {
    //     if(count == 0){
    //         count;
    //     }else{
    //         count-- ;   
    //     }
    //     socket.emit('userconection', count);
    // });
    studentController.socketConnect(socket);
})

mongoose.connect(MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
.then( ()=>{
    server.listen(3500,()=>{
        console.log('connect');
        console.log('server run');
    })
})
.catch(err =>{
    console.log(err);
})
