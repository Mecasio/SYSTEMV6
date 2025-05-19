import React, { useState, useEffect } from "react";
import '../styles/TempStyles.css';
import SortingIcon from "../components/SortingIcon";
import {Link} from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import axios from "axios";

const FacultyMasterList = () => {
  const [userID, setUserID] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sectionData, setSectionData] = useState([]);
  const [profData, setPerson] = useState({
    prof_id: '',
    fname: '',
    mname: '',
    lname: '',
    department_section_id: '',
    subject_id: '',
    active_school_year_id: '',
    year_description: '',
    mappings: [] 
  });
    
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
  }, []);

  const fetchPersonData = async (id) => {
    try{
      const res = await axios.get(`http://localhost:5000/get_prof_data/${id}`)
      if (res.data.length > 0) {
        const first = res.data[0];
  
        const profInfo = {
          prof_id: first.prof_id,
          fname: first.fname,
          mname: first.mname,
          lname: first.lname,
          department_section_id: first.department_section_id,
          subject_id: first.subject_id,
          active_school_year_id: first.school_year_id,
          year_description: first.year_description,
          mappings: res.data.map(row => ({
            subject_id: row.course_id,
            department_section_id: row.department_section_id
          }))
        };
        setPerson(profInfo);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setMessage("Failed to get the information");
    }
  }

  const fetchSectionDetails = async (subject_id, department_section_id, active_school_year_id) => {
    try {
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
        setMessage("Fetch Error");
        setMessage("No data");
      }

    } catch (error) {
      setLoading(false)
      setMessage("Fetch error");
    }
  };

  useEffect(() => {
    if (profData?.mappings?.length > 0) {
      profData.mappings.forEach(mapping => {
        fetchSectionDetails(
          mapping.subject_id,
          mapping.department_section_id,
          profData.active_school_year_id
        );
      });
    }
  }, [profData]);

  return (
    <div>
      <div>
        <div>Name: {profData.lname}, {profData.fname} {profData.mname}</div>
        <div>Employee ID: {profData.prof_id}</div>
        <div>School Year: {profData.year_description}</div>
      </div>

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
          </TableRow>
        </TableHead>

        <TableBody>
          {sectionData.map((section, index) => (
            <TableRow key={index}>
              <TableCell style={{ padding: '0.5rem', textAlign: 'center' }}>
                {index + 1}
              </TableCell>

              <TableCell style={{ padding: '0.5rem', textAlign: 'center' }}>
                <Link to={`/subject_masterlist/${section.subject_id}/${section.department_section_id}/${profData.active_school_year_id}`} style={{ textDecoration: 'none', color: 'blue' }}>
                  {section.program_code}{section.year_level_id}-{section.program_code}{section.section_description}
                </Link>
              </TableCell>

              <TableCell style={{ padding: '0.5rem' }}>
                  {section.course_code}
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
