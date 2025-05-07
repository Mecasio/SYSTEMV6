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

  const fetchProfessorsByDepartment = async (dprtmnt_id) => {
    try {
      const res = await axios.get(`http://localhost:5000/prof_list/${dprtmnt_id}`);
      setSelectedProfessors(res.data);
    } catch (err) {
      console.error("Error fetching professors:", err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleFilterID = (id) => {
    setFilterDepId(id);
    fetchProfessorsByDepartment(id);
    navigate(`/schedule_checker/${id}`)
  };

  return (
    <div>
      <h2>Select a Department</h2>
      {departmentList.map((department) => (
        <button 
          key={department.dprtmnt_id} 
          onClick={() => handleFilterID(department.dprtmnt_id)}
        >
          {department.dprtmnt_name} - {department.dprtmnt_code}
        </button>
      ))}
    </div>
  );
};

export default ScheduleFilterer;
