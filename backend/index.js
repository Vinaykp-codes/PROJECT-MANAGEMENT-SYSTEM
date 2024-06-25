const exp=require('express');
const app=exp()
require('dotenv').config()
const path=require('path')
const mongoClient=require('mongodb').MongoClient;
app.use(exp.json())
const student=require('./APIs/student-api')
const teacher=require('./APIs/teacher-api')
const project1=require('./APIs/project-api')
app.use('/student-api',student)
app.use('/teacher-api',teacher)
app.use('/project-api',project1)
app.use(exp.static(path.join(__dirname,'../my-app/build')))
mongoClient.connect(process.env.DB_URL)
.then(client=>{

    const project=client.db('project')
    const studentcollection=project.collection('student')
    const teachercollection=project.collection('teacher')
    const projectcollection=project.collection('project1')
    app.set('student',studentcollection)
    app.set('teacher',teachercollection)
    app.set('project1',projectcollection)
    console.log("connection successful")
})
.catch(err=>console.log("Err in database",err));

app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'../my-app/build/index.html'))
})
app.use((err,req,res,next)=>{
    res.send({message:"error",payload:err.message})
})



const port=process.env.PORT||5000;
app.listen(port,()=>console.log('server running on ',port))