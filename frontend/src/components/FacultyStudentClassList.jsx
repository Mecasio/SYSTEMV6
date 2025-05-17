import React, { useState, useEffect } from "react";
import '../styles/TempStyles.css';
import { useParams } from "react-router-dom";
import SortingIcon from "../components/SortingIcon";
import { Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";

const FacultyStudentClassList = ({}) => {
    const [profData, setProfData] = useState({
        prof_id: '',
        fname: '',
        mname: '',
        lname: '',
        department_section_id: '',
        subject_id: '',
        mappings: [],
        active_school_year_id: ''
      });
      const { subject_id, department_section_id, school_year_id } = useParams();
      const [students, setStudents] = useState([]);
      
    
      useEffect(() => {
        const prof_id = localStorage.getItem("prof_id");
        const fname = localStorage.getItem("fname");
        const mname = localStorage.getItem("mname");
        const lname = localStorage.getItem("lname");
        const mappings = JSON.parse(localStorage.getItem("subject_section_mappings")) || [];
        const active_school_year_id = localStorage.getItem("school_year_id");
        setProfData({ prof_id, fname, mname, lname, mappings, active_school_year_id});

        if (subject_id && department_section_id && school_year_id) {
            handleFetchStudents(subject_id, department_section_id, school_year_id);
        }
      }, []);

      const handleFetchStudents = async (subject_id, department_section_id, active_school_year_id) => {
        try {
          const response = await fetch(`http://localhost:5000/get_enrolled_students/${subject_id}/${department_section_id}/${active_school_year_id}`);
          const data = await response.json();
          console.log("Fetched students data:", data);
          if (response.ok) {
            const studentsWithSubject = data.students.map((student) => ({
              ...student,
              subject_id,
              department_section_id,
            }));
            setStudents(studentsWithSubject);
          } else {
            alert(data.message || "Failed to fetch students.");
          }
        } catch (error) {
          console.error("Fetch error:", error);
          alert("Server error.");
        }
      };

  return (
    <div>
        <div>
            Section: {students[0]?.program_code || "N/A"} {students[0]?.section_description || "N/A"}
        </div>
        <div>
            Subject: {students[0]?.course_code || "N/A"} ({students[0]?.course_description || "N/A"})
        </div>
        <div>
            Professor: {profData.lname}, {profData.fname} {profData.mname}
        </div>
        <div>
           Schedule: {students[0]?.day_description || "TBA"} | {students[0]?.school_time_start || "N/A"} - {students[0]?.school_time_end || "N/A"} | {students[0]?.room_description || "TBA"}
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
                <p style={{width: '100%'}}>Student Number</p>
                <div><SortingIcon /></div>
              </div>
            </TableCell>

            <TableCell style={{borderColor: 'gray', borderStyle: 'solid', borderWidth: '1px 1px 1px 0px', padding: '0rem 1rem'}}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <p style={{width: '100%'}}>Student Name</p>
                <div><SortingIcon /></div>
              </div>
            </TableCell>

            <TableCell style={{borderColor: 'gray', borderStyle: 'solid', borderWidth: '1px 1px 1px 0px', padding: '0rem 1rem'}}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <p style={{width: '100%'}}>Course</p>
                <div><SortingIcon /></div>
              </div>
            </TableCell>

             <TableCell style={{borderColor: 'gray', borderStyle: 'solid', borderWidth: '1px 1px 1px 0px', padding: '0rem 1rem'}}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <p style={{width: '100%'}}>Year Level</p>
                <div><SortingIcon /></div>
              </div>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {students.map((student, index) => (
            <TableRow key={index}>
                <TableCell style={{padding: '0.5rem', width: '0%', textAlign: 'center', borderColor: 'gray', borderWidth: '1px 0px 1px 1px', borderStyle: 'solid'}}>
                  {index}
                </TableCell> 
                
                <TableCell style={{padding: '0.5rem', width: '10%', textAlign: 'center', borderColor: 'gray', borderWidth: '1px 0px 1px 1px', borderStyle: 'solid'}}>
                {student.student_number} 
                </TableCell>
                
                <TableCell style={{padding: '0.5rem', width: '15%', borderColor: 'gray', borderWidth: '1px 0px 1px 1px', borderStyle: 'solid'}}>
                {student.last_name}, {student.first_name} {student.middle_name} 
                </TableCell>

                <TableCell style={{padding: '0.5rem', width: '10%', textAlign: 'center', borderColor: 'gray', borderWidth: '1px 0px 1px 1px', borderStyle: 'solid'}}>
                {student.program_code} 
                </TableCell>

                <TableCell style={{padding: '0.5rem', width: '10%', textAlign: 'center', borderColor: 'gray', borderWidth: '1px 0px 1px 1px', borderStyle: 'solid'}}>
                {student.year_level_description}
                </TableCell>
            
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FacultyStudentClassList;
