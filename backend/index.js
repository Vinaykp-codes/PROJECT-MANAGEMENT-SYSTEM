// const exp=require('express');
// const app=exp()
// require('dotenv').config()
// const path=require('path')
// const mongoClient=require('mongodb').MongoClient;
// app.use(exp.json())
// const student=require('./APIs/student-api')
// const teacher=require('./APIs/teacher-api')
// const project1=require('./APIs/project-api')
// app.use('/student-api',student)
// app.use('/teacher-api',teacher)
// app.use('/project-api',project1)
// app.use(exp.static(path.join(__dirname,'../my-app/build')))
// mongoClient.connect(process.env.DB_URL)
// .then(client=>{

//     const project=client.db('project')
//     const studentcollection=project.collection('student')
//     const teachercollection=project.collection('teacher')
//     const projectcollection=project.collection('project1')
//     app.set('student',studentcollection)
//     app.set('teacher',teachercollection)
//     app.set('project1',projectcollection)
//     console.log("connection successful")
// })
// .catch(err=>console.log("Err in database",err));

// app.use((req,res,next)=>{
//     res.sendFile(path.join(__dirname,'../my-app/build/index.html'))
// })
// app.use((err,req,res,next)=>{
//     res.send({message:"error",payload:err.message})
// })



// const port=process.env.PORT||5000;
// app.listen(port,()=>console.log('server running on ',port))
const exp = require('express');
const app = exp();
require('dotenv').config();
const path = require('path');
const mongoClient = require('mongodb').MongoClient;
const cors = require('cors');

// Allow requests from your frontend (http://localhost:3000)
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
}));

// Middleware to parse JSON requests
app.use(exp.json());

// Import API routes
const student = require('./APIs/student-api');
const teacher = require('./APIs/teacher-api');
const project1 = require('./APIs/project-api');

// Mount API routes
app.use('/student-api', student);
app.use('/teacher-api', teacher);
app.use('/project-api', project1);

// Serve static files
app.use(exp.static(path.join(__dirname, '../my-app/build')));

// Connect to MongoDB Atlas
mongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    const project = client.db('your_database_name'); // Replace 'your_database_name' with your actual database name
    const studentcollection = project.collection('student'); // Replace 'student' with your collection name
    const teachercollection = project.collection('teacher'); // Replace 'teacher' with your collection name
    const projectcollection = project.collection('project1'); // Replace 'project1' with your collection name
    
    // Attach collections to app
    app.set('student', studentcollection);
    app.set('teacher', teachercollection);
    app.set('project1', projectcollection);

    console.log("Connected to MongoDB Atlas successfully");
  })
  .catch(err => console.log("Error connecting to the database:", err));

// Fallback route for serving index.html
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, '../my-app/build/index.html'));
});

// Global error handling middleware
app.use((err, req, res, next) => {
  res.send({ message: "Error occurred", payload: err.message });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Server running on port', port));
