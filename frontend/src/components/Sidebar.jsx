import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dashboard, Apartment, Business, LibraryBooks, People, PersonAdd, FactCheck, LogoutOutlined } from '@mui/icons-material';
import UserProfile from '../assets/UserProfile.png'
import '../styles/SideBar.css'

const SideBar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const Logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  }
  return (
    <div className='h-full w-enough'>
      <ul className='bg-maroon-500 h-full p-3 px-5 text-white w-full'>
        <div className='flex items-center flex-col mt-8'>
            <img src={UserProfile} className='h-24' />
            <span className='mt-2'>Administrator</span>
        </div>
        <br />
        <br />
        <hr className='bg-white'/>
        <br />
        <li className='w-full flex items-center' >
          <Dashboard/>
          <span className='pl-4 p-2 px-0'><Link to="/dashboard">Dashboard</Link></span>
        </li>
        <li className='w-full flex items-center'>
          <Business />
          <span className='pl-4 p-2 px-0'><Link to="/admission_dashboard">Admission Management</Link></span>
        </li>
        <li className='w-full flex items-center'>
          <LibraryBooks />
          <span className='pl-4 p-2 px-0'><Link to="/course_management">Courses Management</Link></span>
        </li>
        <li className='w-full flex items-center'>
          <Apartment />
          <span className='pl-4 p-2 px-0'><Link to="/department_dashboard">Department Management</Link></span>
        </li>
        <li className='w-full flex items-center'>
          <People />
          <span className='pl-4 p-2 px-0'><Link to="/system_dashboard">System Management</Link></span>
        </li>
        <li className='w-full flex items-center'>
          <LogoutOutlined />
          <button className='pl-4 p-2 px-0' onClick={Logout}>Logout</button>
        </li>
      </ul>

    </div>
  );
};

export default SideBar;
