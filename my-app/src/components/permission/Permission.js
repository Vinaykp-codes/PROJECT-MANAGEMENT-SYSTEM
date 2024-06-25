import React from 'react'
import { useState } from 'react';
import { useNavigate, } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../permission/Permission.js';
import { axiosWithToken } from '../../axiosWithToken';
function Permission() {
  const [faculty, setfaculty] = useState({
    userName: '',
    userId: '',
  })
  let { currentUser } = useSelector((state) => state.studentTeacher);
  let navigate = useNavigate();
  const [err, setErr] = useState('');
  const handleFacultyChange = (e) => {
    const { name, value } = e.target;
    setfaculty(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const handlePermission = async () => {
    console.log(faculty)
    let res = await axiosWithToken.get(`http://localhost:4000/teacher-api/${faculty.userId}`)
    console.log(res.data.message)
    if (res.data.message === "validated") {
      console.log(currentUser)
      let upduser = { ...currentUser, teacherId: faculty.userId }
      delete upduser._id;
      let permission = await axiosWithToken.put('http://localhost:4000/teacher-api/permission', upduser)

      navigate('/studentprofile')

    } else {
      setErr(res.data.message)
    }
  }
  return (
    <div>
      <div className="ask-permission-container">
        <h1 className="form-title">Ask Permission</h1>
        <form className="permission-form">
          <div className="form-group">
            <label className="form-label">Faculty Name:</label>
            <input className="form-control" type="text" name="userName" onChange={handleFacultyChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Faculty ID:</label>
            <input className="form-control" type="text" name="userId" onChange={handleFacultyChange} />
          </div>
          <button className="btn btn-success d-flex mx-auto w-50 justify-content-center mt-4" type="button" onClick={handlePermission}>Ask Permission</button>
        </form>
      </div>
    </div>


  )
}

export default Permission