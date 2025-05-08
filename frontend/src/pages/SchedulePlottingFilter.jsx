import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

const ScheduleFilterer = () => {
  const [departmentList, setDepartmentsList] = useState([]);
  const [filterDepId, setFilterDepId] = useState(null);
  const navigate = useNavigate();

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/departments");
      setDepartmentsList(res.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleFilterID = (id) => {
    setFilterDepId(id);
    navigate(`/schedule_checker/${id}`)
  };

  return (
    <div>
      <h2>Select a Department</h2>
      <div className='flex gap-[1rem]'>
        {departmentList.map((department) => (
          <button 
            key={department.dprtmnt_id} 
            className='rounded border border-maroon-500 p-2 px-5'
            onClick={() => handleFilterID(department.dprtmnt_id)}
          >
           {department.dprtmnt_code}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ScheduleFilterer;
