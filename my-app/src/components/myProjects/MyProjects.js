import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { axiosWithToken } from '../../axiosWithToken';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useState } from 'react';
function MyProjects() {
    const [projectList,setProjectList]=useState([]);
    const navigate=useNavigate();
    const {currentUser}=useSelector((state)=>state.studentTeacher);
    const getProjectsOfCurrentUser=async()=>{
            let res=await axios.get(`http://localhost:4000/project-api/search/${currentUser.userId}`);
            setProjectList(res.data.payload);
        
    }
    const readMoreProject=(project)=>{
        navigate(`../projects/${project.projectId}`,{state:project})
    }
    useEffect(()=>{
        getProjectsOfCurrentUser()
    },[])
  return (
    <div>
        <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3' style={{ height: '80vh', overflow: 'auto' }} >
         {projectList.length>0?(projectList.map((project) => (
        <div className='col' key={project.projectId}>
            <div className='card h-300 '>
                <div className='card-body'>
                    <h5 className='card-title'>Title: {project.title}</h5>
                    <h6 className='card-subtitle'>Category: {project.category}</h6>
                    <h6 className='card-subtitle'>Domain: {project.domain}</h6>
                    <p className='card-text'>{project.content.substring(0, 80) + " ..."}</p>
                </div>
                <button onClick={()=>readMoreProject(project)}><span>Read More</span></button>
            </div>
        </div>
    ))):(<p>NO Project yet..</p>)}
        </div>
        </div>
  )
  
}

export default MyProjects
