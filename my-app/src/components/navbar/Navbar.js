// import React from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import Logo from '../Images/Logo.png'; // Importing the logo as a default export
// import './Navbar.css'; // Importing the CSS file
// import { useDispatch, useSelector } from 'react-redux';
// import { resetState } from '../redux/studentTeacherSlice';
// import { useState } from 'react';

// function Navbar() {
//   let dispatch=useDispatch();
//   let [searchTerm,setSearchTerm]=useState('');
//   let {currentUser,loginUserStatus,errorOccured,errMsg}=useSelector((state)=>state.studentTeacher)
//   let navigate=useNavigate();
//   function signOut(){
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     dispatch(resetState())
//   }
//   const searchHandle=()=>{
//     navigate('/search')
//   }
//   return (
//     <div className="navbar-container">
//       <img src={Logo} alt="Logo" className="navbar-logo" /> {/* Added className for styling */}
//       <div className='d-flex justify-content-end'>
//         {loginUserStatus===false?(
//           <><ul className='nav'>
//           <li className='nav-item'>
//             <NavLink className='nav-link' style={{ color: 'black', fontSize: '1.5rem' }} to='/'>Home</NavLink>
//           </li>
//           <li className='nav-item'>
//             <NavLink className='nav-link' style={{ color: 'black', fontSize: '1.5rem' }} to='/search'>Search</NavLink>
//           </li>  
//           <li className='nav-item d-flex'>
//             <input
//                 className='form-control'
//                 value={searchTerm}
//                 placeholder='Search...'
//                 onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <button className='btn btn-success' onClick={searchHandle}>Serch</button>
//           </li>
//           <li className='nav-item'>
//             <NavLink className='nav-link' style={{ color: 'black', fontSize: '1.5rem' }} to='/signin'>SignIn</NavLink>
//           </li>
//           <li className='nav-item'>
//             <NavLink className='nav-link' style={{ color: 'black', fontSize: '1.5rem' }} to='/signup'>SignUp</NavLink>
//           </li>
//         </ul></>
//         ):(
//           <ul className='nav'>
//             <li className='nav-item'><NavLink className='nav-link' onClick={signOut} to="signin">
//               <p>Welcome, {currentUser.userName}</p>SignOut</NavLink></li>
//           </ul>
//         )}
        
//       </div>
//     </div>
//   );
// }

// export default Navbar;
import React from 'react';
import { IoIosSearch } from "react-icons/io";
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../Images/Logo.png';
import './Navbar.css';
import { FaCircleUser } from "react-icons/fa6";
import { Ripple, initMDB } from 'mdb-ui-kit'; 
import 'mdb-ui-kit/css/mdb.min.css'; 
import { useDispatch, useSelector } from 'react-redux';
import { resetState } from '../../redux/studentTeacherSlice';
import { useState } from 'react';
import { useEffect } from 'react';
// import { IoIosNotifications } from "react-icons/io";

function Navbar() {
  let dispatch = useDispatch();
  let [searchTerm, setSearchTerm] = useState('');
  let { currentUser, loginUserStatus } = useSelector((state) => state.studentTeacher);
  let navigate = useNavigate();
  useEffect(() => {
    initMDB({ Ripple });
}, []);

  function signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(resetState());
  }

  const searchHandle = () => {
    navigate(`/search?query=${searchTerm}`);
  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      searchHandle();
    }
};
  return (
    <div className="navbar-container">
      <div className='nav-left'>
      <img src={Logo} alt="Logo" className="navbar-logo" />
      <span>VNRVJIET</span></div>
<div className='nav-right'>
      <li className='nav-item d-flex'>
              <input
                className='form-control rounded'
                value={searchTerm}
                placeholder='Search...'
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              
              <button className='btn btn-success' data-mdb-ripple-init onClick={searchHandle}>
              <IoIosSearch />
              </button>
            </li>
      <div className='d-flex justify-content-end'>
        {loginUserStatus === false ? (
          <ul className='nav'>
            <li className='nav-item'>
              <NavLink className='nav-link' style={{ color: 'black', fontSize: '1.5rem' }} to='/'>Home</NavLink>
            </li>
            <li className='nav-item'>
              <NavLink className='nav-link' style={{ color: 'black', fontSize: '1.5rem' }} to='/signin'>SignIn</NavLink>
            </li>
            <li className='nav-item'>
              <NavLink className='nav-link' style={{ color: 'black', fontSize: '1.5rem' }} to='/signup'>SignUp</NavLink>
            </li>
          </ul>
        ) : (
      <ul className="nav">
      <li className="nav-item d-flex align-items-center">
        <FaCircleUser size="2.5rem" className="mx-2" />
        <p className="mb-0">{currentUser.userName}</p>
        <NavLink className="nav-link text-black ms-2" onClick={signOut} to="signin">
          SignOut
        </NavLink>
      </li>
    </ul>
        )}
      </div>
      </div>
    </div>
  );
}

export default Navbar;
