import React, { useEffect,useState } from 'react'
import { axiosWithToken } from '../../axiosWithToken'
import { useNavigate } from 'react-router-dom';
import './Projects.css';
function Projects() {
    const [projectlist,setprojectlist]=useState([]);
    let navigate=useNavigate();
    const getProjects=async()=>{
        try {
            const res = await axiosWithToken.get('http://localhost:4000/student-api/projects');
            if (res.data && res.data.payload) {
                setprojectlist(res.data.payload);
            } else {
                console.error('No data found in the response');
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            
        }
    }
    const readMoreProject=(project)=>{
        console.log(project)
        console.log("reading more")
        navigate(`../projects/${project.projectId}`,{state:project})
    }
    useEffect(()=>{
        getProjects()
    },[])
  return (
    <div>
        <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3' style={{ height: '80vh', overflow: 'auto' }} >
        {projectlist.map((project) => (
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
    ))}
        </div>
    </div>
  
    
  )
}

export default Projects
