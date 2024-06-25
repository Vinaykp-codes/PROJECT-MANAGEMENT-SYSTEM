const express=require('express')
const teacherapp=express.Router()
const expressAsyncHandler=require('express-async-handler')
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
let teachercollection;
let studentcollection;
let projectcollection;
teacherapp.use((req,res,next)=>{
    teachercollection=req.app.get('teacher')
    studentcollection=req.app.get('student')
    projectcollection=req.app.get('project1')
    next();
});
//teacher signin
teacherapp.post('/signin',expressAsyncHandler(async(req,res)=>{
    const user=req.body;
    const result=await teachercollection.findOne({userId:user.userId});
    if(result!==null){
        const output=await bcryptjs.compare(user.password,result.password);
        if(output===false){
            res.send({message:"Invalid Password"})
        }else{
            const stoken=jwt.sign({userId:result.userId},process.env.SECRET_KEY,{expiresIn:'1d'})
            res.send({message:"signin success",token:stoken,user:result})
        }
    }else{
        res.send({message:"Invalid Teacher"})
    }
}))
//teacher signup
teacherapp.post('/signup',expressAsyncHandler(async(req,res)=>{
    const user=req.body;
    const result=await teachercollection.findOne({userId:user.userId});
    const re=await studentcollection.findOne({userId:user.userId});
    if(re!==null){
        res.send({message:"Not Teacher"})
    }else{
    if(result!==null){
        res.send({message:"User Existed"})
    }else{
        const hashpass=await bcryptjs.hash(user.password,10)
        user.password=hashpass
        await teachercollection.insertOne(user)
        res.send({message:"User created"})
    }
}
}))
//add project
teacherapp.post('/project',expressAsyncHandler(async(req,res)=>{
    const project=req.body;
    const result=await projectcollection.insertOne(project);
    res.send({message:"new project added"})
}))
//modify project
teacherapp.put('/project',expressAsyncHandler(async(req,res)=>{
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
//delete restore project
teacherapp.put('/project/:projectId',expressAsyncHandler(async(req,res)=>{
    const modifiedpro=req.body;
    const id=parseInt(req.params.projectId)
    if(modifiedpro.status===true){
        let newpro=await projectcollection.findOneAndUpdate({projectId:id},{$set:{...modifiedpro,status:false}},{returnDocument:"after"})
        res.send({message:"project deleted",payload:newpro})
    }
    if(modifiedpro.status===false){
        let newpro=await projectcollection.findOneAndUpdate({projectId:id},{$set:{...modifiedpro,status:true}},{returnDocument:"after"})
        res.send({message:"project restored",payload:newpro})
    }
}))
//teacher givng student permission
teacherapp.put('/permission',expressAsyncHandler(async(req,res)=>{
    const student=req.body;
    const newRequest = {
        studentId: student.userId,
        studentName: student.userName,
    };
    const result = await teachercollection.findOneAndUpdate(
        { userId: student.teacherId },
        { $push: { requests: newRequest } },
        { returnDocument: "after" }
    );
    // console.log(result)
    if (result) {
        res.send({ message: "Request added successfully", payload: result });
    } else {
        res.status(404).send({ message: "Teacher not found" });
    }

    // if(student.permission===false){

    // const result=await studentcollection.findOneAndUpdate({userId:student.userId},{$set:{...student,permission:true}},{returnDocument:"after"})
    // res.send({message:"permission granted",payload:result})}
    // if(student.permission===true){
    //     const result=await studentcollection.findOneAndUpdate({userId:student.userId},{$set:{...student,permission:false}},{returnDocument:"after"})
    // res.send({message:"permission denied",payload:result})
    // }
}))
//teacher with requests
// teacherapp.get('/requests/:teacherId', expressAsyncHandler(async (req, res) => {
    
//     const teacherId = req.params.teacherId;
// console.log(teacherId)
//     try {
//         const requests = await teachercollection.find({ userId: teacherId }).toArray();
//         // console.log(requests.requests)
//         const requestValues = [];

// // Iterate through each request object in the array
// requests.forEach(request => {
//     console.log(request.requests)
//     // Access the properties of each request object
//     const studentId = request.requests.studentId;
//     // console.log(request.requests.studentId)
//     const studentName = request.requests.studentName;

//     // Push the values to the array
//     requestValues.push({ studentId, studentName });
    
// });
// // console.log(requestValues)
// res.send(requests)
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).send({ message: "Internal Server Error" });
//     }
// }));
teacherapp.get('/requests/:teacherId', expressAsyncHandler(async (req, res) => {
    const teacherId = req.params.teacherId;

    try {
        // Assuming 'studentcollection' is your MongoDB collection
        const teacher = await teachercollection.findOne({ userId: teacherId });

        if (teacher) {
            const requests = [];
            
            // Iterate through each request object in the 'requests' array
            teacher.requests.forEach(request => {
                // Access the properties of each request object
                const studentId = request.studentId;
                const studentName = request.studentName;
                
                // Push the values to the array
                requests.push({ studentId, studentName });
            });

            res.send({ requests });
        } else {
            res.status(404).send({ message: "Teacher not found" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
}));

// Assuming you're using Express.js for your backend
// teacherapp.put('/request',expressAsyncHandler(async(req,res)=>{
//     const obj=req.body;
//     const student=await studentcollection.findOne({userId:obj.studentId});
//     if(obj.response==='accept'){
//         const result=await studentcollection.findOneAndUpdate({userId:obj.studentId},{$set:{...student,permission:true}},{returnDocument:"after"})
//     }else{
//         const result=await studentcollection.findOneAndUpdate({userId:obj.studentId},{$set:{...student,permission:false}},{returnDocument:"after"})
//     }
// }));
teacherapp.put('/request', expressAsyncHandler(async (req, res) => {
    const obj = req.body;
    
    try {
        // Update the student's permission
        const permission = (obj.response === 'accept') ? true : false;
        const updatedStudent = await studentcollection.findOneAndUpdate(
            { userId: obj.studentId },
            { $set: { permission } },
            { returnDocument: "after" }
        );

        // Remove the studentId from the teacher's requests
        const updatedTeacher = await teachercollection.findOneAndUpdate(
            { userId: obj.teacherId },
            { $pull: { requests: { studentId: obj.studentId } } },
            { returnDocument: "after" }
        );

        res.send({ message: "Permission updated and studentId removed successfully", updatedStudent, updatedTeacher });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
}));
//ading projectid
teacherapp.put('/add/:teacherId',expressAsyncHandler(async(req,res)=>{
    const user=req.body;
    const newRequest = {
        projectId: user.projectId,
        title: user.title,
    };
    const result = await teachercollection.findOneAndUpdate(
        { userId: req.params.teacherId },
        { $push: { projects: newRequest } },
        { returnDocument: "after" }
    );
    // console.log(result)
    if (result) {
        res.send({ message: "Request added successfully", payload: result });
    } else {
        res.status(404).send({ message: "Teacher not found" });
    }

}))




//teacher view all projects
teacherapp.get('/projects',expressAsyncHandler(async(req,res)=>{
    let response=await projectcollection.find({status:true}).toArray();
    res.send({message:"Projects",payload:response})
}))
//teacher viewing own projects
teacherapp.get('/projects/:teacherId',expressAsyncHandler(async(req,res)=>{

    let respo=await projectcollection.find().toArray();
    res.send({message:"Projects",payload:respo})
}))
//teacher validation from id
teacherapp.get('/:teacherId',expressAsyncHandler(async(req,res)=>{
    let id=req.params.teacherId;
    let respo=await teachercollection.findOne({userId:id})
    if(respo){
        res.send({message:"validated"})
    }else{
        res.send({message:"not validated"})
    }
}))
module.exports=teacherapp;