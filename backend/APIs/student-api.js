const express=require('express')
const studentapp=express.Router();
const expressAsyncHandler=require('express-async-handler')
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')

let studentcollection;
let projectcollection;

studentapp.use((req, res, next) => {
    studentcollection = req.app.get('student');
    projectcollection=req.app.get('project1');
    next();
  });
  studentapp.post('/request-permission', expressAsyncHandler(async (req, res) => {
    const { studentId, teacherId } = req.body;
  
    // Find student
    const student = await studentcollection.findOne({ userId: studentId });
    if (!student) {
      return res.status(404).send({ message: "Student not found" });
    }
  
    // Find teacher
    const teacher = await teachercollection.findOne({ userId: teacherId });
    if (!teacher) {
      return res.status(404).send({ message: "Teacher not found" });
    }
  
    // Add request to teacher's requests
    const request = {
      studentId: student.userId,
      studentName: student.userName,
      requestedAt: new Date()
    };
    await teachercollection.updateOne(
      { userId: teacherId },
      { $push: { requests: request } }
    );
  
    // Update student's requestedTeacherId
    await studentcollection.updateOne(
      { userId: studentId },
      { $set: { requestedTeacherId: teacherId } }
    );
  
    res.send({ message: "Request sent" });
  }));
  
//student signin
studentapp.post('/signin',expressAsyncHandler(async(req,res)=>{
    const user=req.body;
    const result=await studentcollection.findOne({userId:user.userId});
    if(result!==null){
        const output=await bcryptjs.compare(user.password,result.password);
        if(output===false){
            res.send({message:"Invalid Password"})
        }else{
            const stoken=jwt.sign({userId:result.userId},process.env.SECRET_KEY,{expiresIn:'1d'})
            res.send({message:"signin success",token:stoken,user:result})
        }
        

    }else{
        res.send({message:"Invalid Student"})
    }
}))
//student signup
studentapp.post('/signup',expressAsyncHandler(async(req,res)=>{
    const user=req.body;
    const result=await studentcollection.findOne({userId:user.userId});
    if(result!==null){
        res.send({message:"User Existed"})
    }else{
        const hashpass=await bcryptjs.hash(user.password,10)
        user.password=hashpass
        await studentcollection.insertOne(user)
        res.send({message:"User created"})
    }


}))
//student taking permission and add project
studentapp.post('/addproject',expressAsyncHandler(async(req,res)=>{
    const resp=req.body;
    projectcollection.addOne(req.body);
    res.send({message:"project added"});
    
}))
//disable
studentapp.put('/disable',expressAsyncHandler(async(req,res)=>{
  console.log(req.body)
  const resp=req.body;
  const result=await studentcollection.findOneAndUpdate({userId:resp.userId},{$set:{...resp,permission:false}},{returnDocument:"after"})
  res.send({message:"permission denied",payload:result})
}))
//add project
studentapp.post('/project',expressAsyncHandler(async(req,res)=>{
    const project=req.body;
    const result=await projectcollection.insertOne(project);
    res.send({message:"new project added"})
}))
//get all projects
studentapp.get('/projects',expressAsyncHandler(async(req,res)=>{
    let response=await projectcollection.find({status:true}).toArray();
    res.send({message:"Projects",payload:response})
}))
studentapp.get('/projects/:studentId',expressAsyncHandler(async(req,res)=>{
  let respo=await studentcollection.find({userId:req.params.userId},{}).toArray();
  res.send({message:"Projects",payload:respo})
}))
//add projectid in database
studentapp.put('/add/:studentId',expressAsyncHandler(async(req,res)=>{
  const user=req.body;
  const newRequest = {
      projectId: user.projectId,
      title: user.title,
  };
  const result = await studentcollection.findOneAndUpdate(
      { userId: req.params.studentId },
      { $push: { projects: newRequest } },
      { returnDocument: "after" }
  );
  console.log(result)
  if (result) {
      res.send({ message: "Request added successfully", payload: result });
  } else {
      res.status(404).send({ message: "Teacher not found" });
  }

}))
studentapp.put('/project',expressAsyncHandler(async(req,res)=>{
  const modifiedpro=req.body;
  const result=await projectcollection.updateOne({
      projectId:modifiedpro.projectId},
  {$set:modifiedpro})
  let latestpro=await projectcollection.findOne({projectId:modifiedpro.projectId}
  )
  console.log(result)
  console.log(latestpro)
  res.send({message:"project modified",payload:latestpro})
}))
module.exports=studentapp;