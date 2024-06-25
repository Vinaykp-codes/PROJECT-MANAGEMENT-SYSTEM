import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { studentTeacherThunk } from '../../redux/studentTeacherSlice';
import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './SignIn.css';
function SignIn() {
  let { register, handleSubmit,errors } = useForm();
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let { loginUserStatus, currentUser, errOccurred, errMsg } = useSelector((state) => state.studentTeacher)
  function onSignInFormSubmit(userobj) {
    dispatch(studentTeacherThunk(userobj))
  }
  useEffect(() => {
    if (loginUserStatus === true) {
      if (currentUser.userType === 'student') {
        navigate('/studentprofile')
      }
      if (currentUser.userType === 'teacher') {
        navigate('/teacherprofile')
      }
    }
    
  })

  return (
    <div>
      <form onSubmit={handleSubmit(onSignInFormSubmit)}>
        <div className="signin-container">
          <div className="login">
            <h1>Login to your account</h1>
            <h4>Don't have an account? <NavLink to="/signup">Sign Up Free!</NavLink></h4>
            <div className="mb-4 mt-4">
              <label
                htmlFor="user"
                className="form-check-label me-3"
                style={{
                  fontSize: "1.2rem",
                  color: "var(--light-dark-grey)",
                }}
              >
                Login as
              </label>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  className="form-check-input"
                  id="student"
                  value="student"
                  {...register("userType")}
                />
                <label htmlFor="student" className="form-check-label">
                  Student
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  className="form-check-input"
                  id="teacher"
                  value="teacher"
                  {...register("userType")}
                />
                <label htmlFor="teacher" className="form-check-label" >
                  Teacher
                </label>
              </div>
            </div>
            <div>
              <input className="email mb-2 p-2" type="text" name="userid" id="userid" placeholder="User Id" size="50" {...register("userId", { required: true })} />
            </div>
            <div>
              <input className="password mb-4 p-2" type="password" name="password" id="password" placeholder="Password" size="50" {...register("password", { required: true })} />
            </div>
            {errMsg.length>0 && <p className="text-danger">{errMsg}</p>}
            <div className="mt-4">
              <button className="btn btn-primary" type="submit">Login </button>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
