import React, { useState, useEffect } from "react";
import '../styles/TempStyles.css';
import SortingIcon from "../components/SortingIcon";
import {Link} from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import axios from 'axios';
const FacultyMasterList = () => {
  const [userID, setUserID] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");
    const [profData, setPerson] = useState({
      prof_id: "",
      fname: "",
      mname: "",
      lname: "",
      department_section_id: "",
      subject_id: "",
      active_school_year_id: ""
    });
    
    const [sectionData, setSectionData] = useState([]);
      
      useEffect(() => {
        const storedUser = localStorage.getItem("email");
        const storedRole = localStorage.getItem("role");
        const storedID = localStorage.getItem("person_id");

        if (storedUser && storedRole && storedID) {
          setUser(storedUser);
          setUserRole(storedRole);
          setUserID(storedID);

          if (storedRole !== "faculty") {
            window.location.href = "/dashboard";
          } else {
            fetchPersonData(storedID);
          }
        } else {
          window.location.href = "/login";
        }

        if (profData && profData.subject_id && profData.department_section_id && profData.active_school_year_id) {
          fetchSectionDetails(profData.subject_id, profData.department_section_id, profData.active_school_year_id);
        }
      }, []);

      const fetchPersonData = async (id) => {
        try{
          const res = await axios.get(`http://localhost:5000/get_prof_data/${id}`)
          if (res.data.length > 0) {
            setPerson(res.data[0]);
          }
        } catch (err) {
          console.log(err);
        }
      }

      const fetchSectionDetails = async (subject_id, department_section_id, active_school_year_id) => {
        try {
          if(!subject_id || !department_section_id || !active_school_year_id){
            console.log("There's no credentials detected")
          }

          const response = await fetch(`http://localhost:5000/get_subject_info/${subject_id}/${department_section_id}/${active_school_year_id}`);
          const data = await response.json();
          if (response.ok) {
            const newEntry = {
              ...data.sectionInfo,
              subject_id,
              department_section_id,
            };
            setSectionData(prev => {
              const alreadyExists = prev.some(entry =>
                entry.subject_id === newEntry.subject_id &&
                entry.department_section_id === newEntry.department_section_id
              );
              return alreadyExists ? prev : [...prev, newEntry];
            });
          } else {
            console.warn("No data:", data.message);
          }
        } catch (error) {
          console.error("Fetch error:", error);
        }
      };



  return (
    <div>
      {user} {userID} {userRole}
      <h1>Welcome Mr. {profData.lname}, {profData.fname} {profData.mname} || {profData.prof_id} || {profData.active_school_year_id}</h1>

      <Table style={{maxWidth: '100%', marginLeft: '-1rem', transform: 'scale(0.9)'}}>
        <TableHead style={{height: '50px'}}>
          <TableRow style={{height: '50px'}}>
            <TableCell style={{borderColor: 'gray', borderStyle: 'solid', borderWidth: '1px 1px 1px 1px', padding: '0rem 1rem'}}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <p style={{width: '100%'}}>#</p>
                <div><SortingIcon /></div>
              </div>
            </TableCell>

            <TableCell style={{borderColor: 'gray', borderStyle: 'solid', borderWidth: '1px 1px 1px 0px', padding: '0rem 1rem'}}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <p style={{width: '100%'}}>Section</p>
                <div><SortingIcon /></div>
              </div>
            </TableCell>

            <TableCell style={{borderColor: 'gray', borderStyle: 'solid', borderWidth: '1px 1px 1px 0px', padding: '0rem 1rem'}}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <p style={{width: '100%'}}>Course Code</p>
                <div><SortingIcon /></div>
              </div>
            </TableCell>

            <TableCell style={{borderColor: 'gray', borderStyle: 'solid', borderWidth: '1px 1px 1px 0px', padding: '0rem 1rem'}}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <p style={{width: '100%'}}>Description</p>
                <div><SortingIcon /></div>
              </div>
            </TableCell>
            <TableCell style={{borderColor: 'gray', borderStyle: 'solid', borderWidth: '1px 1px 1px 0px', padding: '0rem 1rem'}}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <p style={{width: '100%'}}>Schedule</p>
                <div><SortingIcon /></div>
              </div>
            </TableCell>

            <TableCell style={{borderColor: 'gray', borderStyle: 'solid', borderWidth: '1px 1px 1px 0px', padding: '0rem 1rem'}}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <p style={{width: '100%'}}>Action</p>
                <div><SortingIcon /></div>
              </div>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sectionData.map((section, index) => (
            <TableRow key={index}>
              <TableCell style={{ padding: '0.5rem', textAlign: 'center' }}>
                {index + 1}
              </TableCell>

              <TableCell style={{ padding: '0.5rem', textAlign: 'center' }}>
                {section.program_code}{section.year_level_id}-{section.program_code}{section.section_description}
              </TableCell>

              <TableCell style={{ padding: '0.5rem' }}>
                <Link to={`/subject_masterlist/${section.subject_id}/${section.department_section_id}/${profData.active_school_year_id}`} style={{ textDecoration: 'none', color: 'blue' }}>
                  {section.course_code}
                </Link>
              </TableCell>

              <TableCell style={{ padding: '0.5rem' }}>
                {section.course_description}
              </TableCell>
              
               <TableCell style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="w-[2.5rem] text-center">{section.day_description}</div> |  
                <div className="w-[10rem] text-center">{section.school_time_start} - {section.school_time_end}</div> |
                <div className="w-[10rem] text-center">{section.room_description}</div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

      </Table>
    </div>
  );
};

export default FacultyMasterList;
