import React, { useState, useEffect } from "react";
import '../styles/TempStyles.css';
import SortingIcon from "./SortingIcon";
import { Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";

const FacultyDashboard = () => {
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
      const [students, setStudents] = useState([]);
      
    
      useEffect(() => {
        const prof_id = localStorage.getItem("prof_id");
        const fname = localStorage.getItem("fname");
        const mname = localStorage.getItem("mname");
        const lname = localStorage.getItem("lname");
        const mappings = JSON.parse(localStorage.getItem("subject_section_mappings")) || [];
        const active_school_year_id = localStorage.getItem("school_year_id");
        setProfData({ prof_id, fname, mname, lname, mappings, active_school_year_id});
      }, []);

      const handleFetchStudents = async (subject_id, department_section_id, active_school_year_id) => {
        try {
          const response = await fetch(`http://localhost:5000/get_enrolled_students/${subject_id}/${department_section_id}/${active_school_year_id}`);
          const data = await response.json();
      
          if (response.ok) {
            setStudents(data);
          } else {
            alert(data.message || "Failed to fetch students.");
          }
        } catch (error) {
          console.error("Fetch error:", error);
          alert("Server error.");
        }
      };

      const handleChanges = (index, field, value) => {
        const updatedStudents = [...students];
        updatedStudents[index][field] = value;

        if (field === "midterm" || field === "finals") {
            const finalGrade = finalGradeCalc(updatedStudents[index].midterm, updatedStudents[index].finals);
            updatedStudents[index].final_grade = finalGrade;
            if (finalGrade == 0) {
              updatedStudents[index].en_remarks = 0;
            } else if (finalGrade >= 75) {
              updatedStudents[index].en_remarks = 1;
            } else if (finalGrade >= 60) {
              updatedStudents[index].en_remarks = 2;
            } else {
              updatedStudents[index].en_remarks = 3;
            }
        }

        setStudents(updatedStudents);
      }

      const addStudentInfo = async (student) => {
        try {
          const response = await fetch('http://localhost:5000/add_grades', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              midterm: student.midterm,
              finals: student.finals,
              final_grade: student.final_grade,
              en_remarks: student.en_remarks,
              student_number: student.student_number,
              subject_id: student.subject_id
            })
          });
      
          const result = await response.json();
      
          if (response.ok) {
            alert("Grades saved successfully!");
          } else {
            alert(result.message || "Failed to save grades.");
          }
        } catch (error) {
          console.error("Save error:", error);
          alert("Error saving grades.");
        }
      }
      
      const editStudentInfo = () => { 

      }

      const remarkConversion = (student) => {
        if (student.en_remarks == 1) {
          return "PASSED";
        } else if (student.en_remarks == 2) {
          return "FAILED";
        } else if (student.en_remarks == 3) {
          return "INCOMPLETE";
        } else {
          return "DROP";
        }
      };

      const finalGradeCalc = (midterm, finals) => {
        const midtermScore = parseFloat(midterm);
        const finalScore = parseFloat(finals);
      
        if (isNaN(midtermScore) || isNaN(finalScore)) {
          return "Invalid input";
        }

        const finalGrade = (midtermScore * 0.5) + (finalScore * 0.5);

        return finalGrade.toFixed(0);
      };
      

  return (
    <div>
      <h1>Welcome Mr. {profData.lname}, {profData.fname} {profData.mname} || {profData.prof_id} || {profData.active_school_year_id}</h1>

      <div className="temp-container">
        {profData.mappings.map((map, index) => (
          <button
              key={`${map.subject_id}-${map.department_section_id}`} 
              onClick={() =>
              handleFetchStudents(
                  map.subject_id,
                  map.department_section_id,
                  profData.active_school_year_id
              )
              }
          >
              Section - {map.department_section_id} | Subject - {map.subject_id} | SY: {profData.active_school_year_id}
          </button>
        ))}
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
                <p style={{width: '100%'}}>Midterm</p>
                <div><SortingIcon /></div>
              </div>
            </TableCell>

            <TableCell style={{borderColor: 'gray', borderStyle: 'solid', borderWidth: '1px 1px 1px 0px', padding: '0rem 1rem'}}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <p style={{width: '100%'}}>Finals</p>
                <div><SortingIcon /></div>
              </div>
            </TableCell>

            <TableCell style={{borderColor: 'gray', borderStyle: 'solid', borderWidth: '1px 1px 1px 0px', padding: '0rem 1rem'}}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <p style={{width: '100%'}}>Final Grade</p>
                <div><SortingIcon /></div>
              </div>
            </TableCell>

            <TableCell style={{borderColor: 'gray', borderStyle: 'solid', borderWidth: '1px 1px 1px 0px', padding: '0rem 1rem'}}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <p style={{width: '100%'}}>Remarks</p>
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

                <TableCell style={{padding: '0.5rem', width: '1%', borderColor: 'gray', borderWidth: '1px 0px 1px 1px', borderStyle: 'solid'}}>
                  <input type="text" value={student.midterm} onChange={(e) => handleChanges(index, 'midterm', e.target.value)} style={{border: 'none', textAlign: 'center', background: 'none', outline: 'none', height: '100%', fontFamily: 'Poppins'}}/>
                </TableCell>

                <TableCell style={{padding: '0.5rem', maxWidth: '1%', width: '100%', borderColor: 'gray', borderWidth: '1px 0px 1px 1px', borderStyle: 'solid'}}>
                <input type="text" value={student.finals} onChange={(e) => handleChanges(index, 'finals', e.target.value)} style={{border: 'none',textAlign: 'center', background: 'none', outline: 'none', height: '100%', fontFamily: 'Poppins'}}/>
                </TableCell>

                <TableCell style={{padding: '0.5rem', width: '5%', borderColor: 'gray', borderWidth: '1px 0px 1px 1px', borderStyle: 'solid'}}>
                <input type="text" value={finalGradeCalc(student.midterm, student.finals)} readOnly style={{border: 'none', textAlign: 'center', background: 'none', outline: 'none', height: '100%', fontFamily: 'Poppins'}}/>
                </TableCell>
                
                <TableCell style={{padding: '0.5rem', width: '10%', borderColor: 'gray', borderWidth: '1px 0px 1px 1px', borderStyle: 'solid'}}>
                  {remarkConversion(student)}
                </TableCell>
               
                <TableCell style={{padding: '0.5rem', width: '10%', borderColor: 'gray', borderWidth: '1px 1px 1px 1px', borderStyle: 'solid'}}>
                  <button onClick={() => addStudentInfo(student)}>Save</button>
                  <button onClick={editStudentInfo}>Edit</button>
                </TableCell>
            
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FacultyDashboard;
