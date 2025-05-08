import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Container, Dialog, DialogTitle, DialogActions, DialogContent, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { ArrowDropDown, ArrowDropUp, MoreVert } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

import '../styles/DprtmntRegistration.css';

const DepartmentRegistration = () => {

  const [department, setDepartment] = useState({
    dep_name: '',
    dep_code: ''
  });

  const [departmentList, setDepartmentList] = useState([]);

  const [openModal, setOpenModal] = useState(false);

  //Fetch Department Data
  const fetchDepartment = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get_department');
      setDepartmentList(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  //Update the page without needing to refresh
  useEffect(() => {
    fetchDepartment();
  }, []);

  //Handle the creation and adding of department
  const handleAddingDepartment = async () => {
    if (!department.dep_name || !department.dep_code) {
      alert('Please fill all field');
    }

    else {
      try {
        await axios.post('http://localhost:5000/department', department);
        fetchDepartment();
        setDepartment({ dep_name: '', dep_code: '' });
        setOpenModal(false);
      } catch (err) {
        console.error(err);
      }
    }
  }
  //Handle the form changes of everything
  const handleChangesForEverything = (e) => {
    const { name, value } = e.target;

    //For Department
    setDepartment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  //Function for opening the department modal
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  //Function that handle the closing of modals
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Container className="container">

      {/* For Displaying Department and its Program*/}
      <div className="departmentList">

        <div className="header">
          <p>Departments</p>
          <button className="plusIcon" onClick={handleOpenModal}>Add Department</button>
        </div>

        <div className="main">
          {/*For Displaying Department Data */}
          {departmentList.map((department) => (
            <div className="mainList" key={department.dprtmnt_id}>
              <div className="department">

                <div className="items" onClick={() => handleDropDown(department.dprtmnt_id)}>
                  <span className="name">
                    <strong>{department.dprtmnt_name}</strong>
                    (<p>{department.dprtmnt_code}</p>)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* For Department */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle className="dialogTitle">Add New Department <CloseIcon fontSize="medium" className="cancelIcon" onClick={handleCloseModal} /></DialogTitle>
        <DialogContent>
          <div className="forDepartment">
            <div className="textField">
              <label htmlFor="dep_name">Name:</label>
              <input type="text" id="dep_name" name="dep_name" value={department.dep_name} onChange={handleChangesForEverything} placeholder="Enter your Department Name" />
            </div>
            <div className="textField">
              <label htmlFor="dep_name">Code:</label>
              <input type="text" id="dep_code" name="dep_code" value={department.dep_code} onChange={handleChangesForEverything} placeholder="Enter your Department Code" />
            </div>
          </div>
        </DialogContent>
        <DialogActions style={{ marginBottom: '1rem' }}>
          <button style={{ background: 'maroon', color: 'white' }} onClick={handleAddingDepartment}>Save</button>
          <button onClick={handleCloseModal}>Cancel</button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default DepartmentRegistration;