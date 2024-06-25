import React from 'react'
import { NavLink, Outlet } from 'react-router-dom';

import { useSelector } from 'react-redux';

function TeacherProfile() {
  return (
    <div className='container'>
      <ul className='nav justify-content-around'>
        <li className='nav-item'><NavLink className="nav-link" to={'my-projects'}>My Projects</NavLink></li>
        <li className='nav-item'><NavLink className="nav-link" to={'projects'}>Projects</NavLink></li>
        <li className='nav-item'><NavLink className="nav-link" to={'ProjectForm'}>Add Project</NavLink></li>
        <li className='nav-item'><NavLink className="nav-link" to={'permission-requests'}>Permission Request</NavLink></li>
      </ul>
      <Outlet />
    </div>
  )
}

export default TeacherProfile;