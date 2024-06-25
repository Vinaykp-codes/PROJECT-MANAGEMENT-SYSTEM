import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink, Outlet } from 'react-router-dom'

function StudentProfile() {
  let {currentUser}=useSelector((state)=>state.studentTeacher);

  return (
    <div>
      <ul className='nav justify-content-around'>
        <li className='nav-item'>
          <NavLink className='nav-link' to={'my-projects'}>My Projects</NavLink>
        </li>
    
      {!currentUser.permission&&(<ul className='nav'>
        <li className='nav-item'><NavLink className='nav-link' to='permission'>Ask Permission</NavLink></li>
      </ul>)}
      {currentUser.permission&&(<ul className='nav'>
        <li className='nav-item'><NavLink className='nav-link' to='ProjectForm'>Add Project</NavLink></li>
      </ul>)}
      </ul>
      <Outlet/>
    </div>
  )
}

export default StudentProfile