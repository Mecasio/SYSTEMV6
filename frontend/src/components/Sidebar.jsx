  import React from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import { Dashboard, Apartment, Business, LibraryBooks, People, LogoutOutlined, Settings, AccountCircle, AccountCircleOutlined } from '@mui/icons-material';
  import UserProfile from '../assets/UserProfile.png'
  import '../styles/SideBar.css'
  import { Avatar } from '@mui/material';

  const SideBar = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const Logout = () => {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      navigate('/');
    }
    return (
      <div className='h-full w-enough hidden-print'>
        <ul className='bg-white h-full border-r-[3px] border-maroon-500 p-3 px-5 text-maroon-500 w-full gap-2 '>
          <div className='flex items-center flex-col mt-8'>
              <Avatar sx={{
                width: 106,
                height: 106,
                border: '3px solid maroon', // thin border
                color: 'maroon',
                bgcolor: 'transparent'
              }}/>
              <span className='mt-4'>Administrator</span>
          </div>
          <br />
          <hr className='bg-maroon-500'/>
          <br />
          <Link to="/dashboard">
          <li className={`w-full flex items-center border border-maroon-500 px-2 rounded button-hover ${location.pathname === "/dashboard" ? "bg-maroon-500 text-white" : ""}`} >
            <Dashboard/>
            <span className='pl-4 p-2 px-0 pointer-events-none'>Dashboard</span>
          </li>
          </Link>

          <Link to="/admission_dashboard">
          <li className={`w-full flex items-center border border-maroon-500 px-2 rounded m-2 mx-0 button-hover ${location.pathname === "/admission_dashboard" ? "bg-maroon-500 text-white" : ""}`}>
            <Business />
            <span className='pl-4 p-2 px-0 pointer-events-none'>Admission Management</span>
          </li>
          </Link>

          <Link to="/course_management">
          <li className={`w-full flex items-center border border-maroon-500 px-2 rounded m-2 mx-0 button-hover ${location.pathname === "/course_management" ? "bg-maroon-500 text-white" : ""}`}>
            <LibraryBooks />
            <span className='pl-4 p-2 px-0 pointer-events-none'>Courses Management</span>
          </li>
          </Link>

          <Link to="/department_dashboard">
          <li className={`w-full flex items-center border border-maroon-500 px-2 rounded m-2 mx-0 button-hover ${location.pathname === "/department_dashboard" ? "bg-maroon-500 text-white" : ""}`}>
            <Apartment />
            <span className='pl-4 p-2 px-0 mr-2 pointer-events-none'>Department Management</span>
          </li>
          </Link>

          <Link to="/system_dashboard">
          <li className={`w-full flex items-center border border-maroon-500 px-2 rounded m-2 mx-0 button-hover ${location.pathname === "/system_dashboard" ? "bg-maroon-500 text-white" : ""}`}>
            <Settings />
            <span className='pl-4 p-2 px-0 pointer-events-none'>System Management</span>
          </li>
          </Link>

          <Link to="/account_dashboard">
          <li className={`w-full flex items-center border border-maroon-500 px-2 rounded m-2 mx-0 button-hover ${location.pathname === "/account_dashboard" ? "bg-maroon-500 text-white" : ""}`}>
            <People />
            <span className='pl-4 p-2 px-0 pointer-events-none'>Accounts</span>
          </li>
          </Link>
          <li className='w-full flex items-center border border-maroon-500 px-2 rounded m-2 mx-0 cursor-pointer button-hover'>
            <LogoutOutlined />
            <button className='pl-4 p-2 px-0 pointer-events-none' onClick={Logout}>Logout</button>
          </li>
        </ul>

      </div>
    );
  };

  export default SideBar;
