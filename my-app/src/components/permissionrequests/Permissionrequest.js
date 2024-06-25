

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { axiosWithToken } from '../../axiosWithToken';

const Permissionrequest = () => {
  const [requests, setRequests] = useState([]);
  const { currentUser } = useSelector(state => state.studentTeacher);

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await axiosWithToken.get(`http://localhost:4000/teacher-api/requests/${currentUser.userId}`);
      setRequests(res.data.requests);
    };

    fetchRequests();
  }, [currentUser.userId]);

  const respondToRequest = async (studentId, response) => {
    const requestData = {
      teacherId: currentUser.userId,
      studentId,
      response
    };
    try {
      const res = await axiosWithToken.put('http://localhost:4000/teacher-api/request', requestData);
      console.log(res)

      setRequests(requests.filter(req => req.studentId !== studentId));


      localStorage.setItem('user', JSON.stringify(res.data.updatedTeacher));
    } catch (error) {

    }
  };

  return (
    <div>
      <h1>Permission Requests</h1>
      <ul>
        {requests.map(req => (
          <li key={req.studentId}>
            {req.studentName} ({req.studentId})
            <div>
            <button className='btn btn-success mt-4 w-100 d-flex mx-auto justify-content-center'  onClick={() => respondToRequest(req.studentId, 'accept')}>Accept</button>
            <button className='btn btn-danger mt-2 w-100 d-flex mx-auto justify-content-center' onClick={() => respondToRequest(req.studentId, 'deny')}>Deny</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Permissionrequest;
