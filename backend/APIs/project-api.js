const exp=require('express')
projectapp=exp.Router()
const expressAsyncHandler=require('express-async-handler');
let projectcollection;
projectapp.use((req,res,next)=>{
    projectcollection=req.app.get('project1');
    next();
})
projectapp.get('/search', expressAsyncHandler(async (req, res) => {
    const { query } = req.query; 
    
    try {
       
        const results = await projectcollection.find({
            $or: [
                { faculty: { $regex: query, $options: 'i' } },
                { designation: { $regex: query, $options: 'i' } },
                { title: { $regex: query, $options: 'i' } },
                { domain: { $regex: query, $options: 'i' } },
                { leadsto: { $regex: query, $options: 'i' } },
                { partof: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
                { projectId: { $regex: query, $options: 'i' } },
                { 'team.name': { $regex: query, $options: 'i' } },
                { 'team.rollNo': { $regex: query, $options: 'i' } }
            ]
        }).toArray();
        
        
        res.send({ message: "result", payload: results });
    } catch (err) {
        console.error(err); 
        res.status(500).send({ message: "error", payload: err });
    }
}));
projectapp.get('/search/:userId', expressAsyncHandler(async (req, res) => {
    // console.log(req.params.userId);
    const result = await projectcollection.find({ "author.userId": req.params.userId }).toArray();
    // console.log(result);
    res.send({ message: "project by user", payload: result });
}));
projectapp.get('/projects', expressAsyncHandler(async (req, res) => {
    const projects = await projectcollection.find().toArray();
    console.log(projects)
    res.send({ message: "Projects fetched", payload: projects });
  }));
projectapp.put('/project/:projectId',expressAsyncHandler(async(req,res)=>{
    const obj=req.body;
    const id=parseInt(req.params.projectId);
    console.log(obj)
    if(obj.status===true){
        let modpro=await projectcollection.findOneAndUpdate({projectId:id},{$set:{...obj,status:false}},{returnDocument:"after"})
        res.send({Message:"project deleted",payload:modpro})
    }
    if(obj.status===false){
        let modpro=await projectcollection.findOneAndUpdate({projectId:id},{$set:{...obj,status:true}},{returnDocument:"after"})
        res.send({Message:"project deleted",payload:modpro})
    }
}))

module.exports=projectapp;