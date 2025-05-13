import React, { useState, useEffect } from "react";
import axios from "axios";
import {Button, Box, TextField, Container, Typography, Checkbox,FormControlLabel, FormGroup, Grid} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import SchoolIcon from "@mui/icons-material/School";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import InfoIcon from "@mui/icons-material/Info";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ApplicantHealthMedicalRecords = () => {
  const getPersonIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      console.log("Decoded Token: ", decoded);
      return decoded.person_id; // Ensure your token includes this
    }
    return null;
  };

  const [data, setData] = useState([]);
  const personIDFromToken = getPersonIdFromToken();

  const [personID, setPersonID] = useState('');

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const response = await axios.get('http://localhost:5000/person_table');
        console.log('Fetched Data:', response.data);  // Log to see the raw data
        const filtered = response.data.filter(item => String(item.person_id) === String(personIDFromToken));
        setData(filtered);
      } catch (error) {
        console.error("Error fetching Health Medical Records:", error);
      }
    };

    fetchMedicalRecords();
  }, [personID]);

  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/person_table")
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error(err));
  }, []);


  useEffect(() => {
    axios
      .get("http://localhost:5000/person_table")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);



   const updateItem = (student) => {
    axios.put(`http://localhost:5000/person_table/${student.person_id}`, student)
      .then(response => {
        console.log("Saved:", response.data);
      })
      .catch(error => {
        console.error("Auto-save error:", error);
      });
  };


  useEffect(() => {
    const handleBeforeUnload = (e) => {
      students.forEach((student) => {
        updateItem(student); // ✅ Save latest changes before reload
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [students]);

  useEffect(() => {
    fetch("http://localhost:5000/person_table")
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error(err));
  }, []);
  
  const steps = [
    { label: 'Personal Information', icon: <PersonIcon />, path: '/applicant_personal_information' },
    { label: 'Family Background', icon: <FamilyRestroomIcon />, path: '/applicant_family_background' },
    { label: 'Educational Attainment', icon: <SchoolIcon />, path: '/applicant_educational_attainment' },
    { label: 'Health Medical Records', icon: <HealthAndSafetyIcon />, path: '/applicant_health_medical_records' },
    { label: 'Other Information', icon: <InfoIcon />, path: '/applicant_other_information' },
  ];


  const [activeStep, setActiveStep] = useState(3);
  const handleStepClick = (index) => setActiveStep(index);

  const cellStyle = {
    height: "0.25in",
    fontSize: "100%",
    border: "1px solid black",
    padding: "8px",
    verticalAlign: "middle"
  };

  const inputStyle = {
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "6px",
    boxSizing: "border-box",
    backgroundColor: "white",
    color: "black",
  };



  return (
<Box sx={{ height: 'calc(100vh - 120px)', overflowY: 'auto', paddingRight: 1, backgroundColor: 'transparent' }}>

    <Container maxWidth="lg">
        <Container>
      <h1 style={{ fontSize: "50px", fontWeight:"bold",textAlign: "center", color: "maroon", marginTop: "25px" }}>
        APPLICANT FORM
      </h1>
      <div style={{ textAlign: "center" }}>
        Complete the applicant form to secure your place for the upcoming academic year at EARIST.
      </div>
    </Container>
      < br />
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', px: 4 }}>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Wrap the step with Link for routing */}
            <Link to={step.path} style={{ textDecoration: 'none' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => handleStepClick(index)}
              >
                {/* Step Icon */}
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    backgroundColor: activeStep === index ? '#6D2323' : '#E8C999',
                    color: activeStep === index ? '#fff' : '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {step.icon}
                </Box>

                {/* Step Label */}
                <Typography
                  sx={{
                    mt: 1,
                    color: activeStep === index ? '#6D2323' : '#000',
                    fontWeight: activeStep === index ? 'bold' : 'normal',
                    fontSize: 14,
                  }}
                >
                  {step.label}
                </Typography>
              </Box>
            </Link>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <Box
                sx={{
                  height: '2px',
                  backgroundColor: '#6D2323',
                  flex: 1,
                  alignSelf: 'center',
                  mx: 2,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </Box>
      < br />

      <Container maxWidth="100%" sx={{ backgroundColor: "#6D2323", color: "white",  border: "2px solid black", borderRadius: 2, boxShadow: 3, padding: "4px" }}>
        <Box sx={{ width: "100%" }}>
          <Typography style={{ fontSize: "20px", padding: "10px",  fontFamily: "Arial Black"  }}>Step 4: Health and Medical Records</Typography>
        </Box>
      </Container>




      <Box sx={{ backgroundColor: "#fff", p: 3,  border: "2px solid black", borderRadius: 2, boxShadow: 2 }}>
        <style>
          {`
            .custom-radio {
              appearance: none;
              -webkit-appearance: none;
              background-color: rgb(165, 165, 165); 
              border: 1px solid #000;
              width: 16px;
              height: 16px;
              cursor: pointer;
              position: relative;
              border-radius: 2px;
              display: inline-block;
              margin: 0 4px;
              transition: background-color 0.2s ease;
            }

            .custom-radio:checked {
              background-color: rgb(65, 63, 63);
            }

            .custom-radio:checked::after {
              content: '✔';
              position: absolute;
              top: -1px;
              left: 2px;
              font-size: 14px;
              color: white;
            }

            textarea, input[type="text"], input[type="date"] {
              width: 100%;
              padding: 8px;
              font-size: 14px;
              border: 1px solid #ccc;
              border-radius: 8px;
              background-color: white;
              color: black;
              box-sizing: border-box;
            }
          `}
        </style>

        <div style={{ paddingRight: '10px' }}>

          <form style={{ maxWidth: "1500px", margin: "0 auto", fontSize: "14px" }}>
            <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold", textAlign: "Left" }}>
              HEALTH AND MEDICAL RECORD:
            </Typography>
            <hr style={{ border: "1px solid #ccc", width: "100%" }} />

            {/* Section I */}
            {students.map((student) => (
              <div key={student.person_id} style={{ marginBottom: "16px" }}>
                <p style={{ marginBottom: "8px" }}>
                  I. Do you have any of the following symptoms today?
                  <FormGroup row sx={{ ml: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={student.cough === 1}
                          onChange={(e) => {
                            const updatedStudent = {
                              ...student,
                              cough: e.target.checked ? 1 : 0,
                            };
                            setStudents((prev) =>
                              prev.map((s) =>
                                s.person_id === student.person_id ? updatedStudent : s
                              )
                            );
                            updateItem(updatedStudent);
                          }}
                        />
                      }
                      label="Cough"
                      sx={{ ml: 5 }}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={student.colds === 1}
                          onChange={(e) => {
                            const updatedStudent = {
                              ...student,
                              colds: e.target.checked ? 1 : 0,
                            };
                            setStudents((prev) =>
                              prev.map((s) =>
                                s.person_id === student.person_id ? updatedStudent : s
                              )
                            );
                            updateItem(updatedStudent);
                          }}
                        />
                      }
                      label="Colds"
                      sx={{ ml: 5 }}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={student.fever === 1}
                          onChange={(e) => {
                            const updatedStudent = {
                              ...student,
                              fever: e.target.checked ? 1 : 0,
                            };
                            setStudents((prev) =>
                              prev.map((s) =>
                                s.person_id === student.person_id ? updatedStudent : s
                              )
                            );
                            updateItem(updatedStudent);
                          }}
                        />
                      }
                      label="Fever"
                      sx={{ ml: 5 }}
                    />
                  </FormGroup>
                </p>
              </div>
            ))}



            {/* Section II */}
            {students.map((student) => (
              <div key={student.person_id} style={{ marginBottom: "16px" }}>
                <p style={{ marginBottom: "8px" }}>
                  II. MEDICAL HISTORY: Have you suffered from, or been told you had, any of the following conditions:
                </p>

                <table
                  style={{
                    width: "100%",
                    border: "1px solid black",
                    borderCollapse: "collapse",
                    fontFamily: "Arial, Helvetica, sans-serif",
                    tableLayout: "fixed",
                  }}
                >
                  <tbody>
                    {/* Headers */}
                    <tr>
                      <td colSpan={15} style={{ border: "1px solid black", height: "0.25in" }}></td>
                      <td colSpan={12} style={{ border: "1px solid black", textAlign: "center" }}>Yes or No</td>

                      <td colSpan={15} style={{ border: "1px solid black", height: "0.25in" }}></td>
                      <td colSpan={12} style={{ border: "1px solid black", textAlign: "center" }}>Yes or No</td>

                      <td colSpan={15} style={{ border: "1px solid black", height: "0.25in" }}></td>
                      <td colSpan={12} style={{ border: "1px solid black", textAlign: "center" }}>Yes or No</td>
                    </tr>

                    {/* Rows (repeat pattern) */}
                    {[
                      { label: "Asthma", key: "asthma" },
                      { label: "Fainting Spells and seizures", key: "faintingSpells" },
                      { label: "Heart Disease", key: "heartDisease" },
                      { label: "Tuberculosis", key: "tuberculosis" },
                      { label: "Frequent Headaches", key: "frequentHeadaches" },
                      { label: "Hernia", key: "hernia" },
                      { label: "Chronic cough", key: "chronicCough" },
                      { label: "Head or neck injury", key: "headNeckInjury" },
                      { label: "H.I.V", key: "hiv" },
                      { label: "High blood pressure", key: "highBloodPressure" },
                      { label: "Diabetes Mellitus", key: "diabetesMellitus" },
                      { label: "Allergies", key: "allergies" },
                      { label: "Cancer", key: "cancer" },
                      { label: "Smoking of cigarette/day", key: "smokingCigarette" },
                      { label: "Alcohol Drinking", key: "alcoholDrinking" },
                    ].reduce((rows, item, idx, arr) => {
                      if (idx % 3 === 0) rows.push(arr.slice(idx, idx + 3));
                      return rows;
                    }, []).map((rowGroup, rowIndex) => (
                      <tr key={rowIndex}>
                        {rowGroup.map(({ label, key }) => (
                          <React.Fragment key={key}>
                            <td colSpan={15} style={cellStyle}>{label}</td>
                            <td colSpan={12} style={cellStyle}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={student[key] === 1}
                                      onChange={(e) => {
                                        const updatedStudent = {
                                          ...student,
                                          [key]: e.target.checked ? 1 : 0,
                                        };
                                        setStudents((prev) =>
                                          prev.map((s) =>
                                            s.person_id === student.person_id ? updatedStudent : s
                                          )
                                        );
                                        updateItem(updatedStudent);
                                      }}
                                    />
                                  }
                                  label="Yes"
                                />
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={student[key] === 0}
                                      onChange={(e) => {
                                        const updatedStudent = {
                                          ...student,
                                          [key]: e.target.checked ? 0 : 1,
                                        };
                                        setStudents((prev) =>
                                          prev.map((s) =>
                                            s.person_id === student.person_id ? updatedStudent : s
                                          )
                                        );
                                        updateItem(updatedStudent);
                                      }}
                                    />
                                  }
                                  label="No"
                                />
                              </div>
                            </td>
                          </React.Fragment>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}





            {/* Hospitalization History */}
            {students.map((student) => (
              <Box key={student.person_id} mt={2} display="flex" alignItems="center" flexWrap="wrap">
                <span style={{ marginRight: '16px' }}>
                  Do you have any previous history of hospitalization or operation?
                </span>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={student.hospitalized === 1}
                        onChange={(e) => {
                          const updatedStudent = {
                            ...student,
                            hospitalized: e.target.checked ? 1 : 0,
                          };
                          setStudents((prev) =>
                            prev.map((s) =>
                              s.person_id === student.person_id ? updatedStudent : s
                            )
                          );
                          updateItem(updatedStudent);
                        }}
                      />
                    }
                    label="Yes"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={student.hospitalized === 0}
                        onChange={(e) => {
                          const updatedStudent = {
                            ...student,
                            hospitalized: e.target.checked ? 0 : 1,
                          };
                          setStudents((prev) =>
                            prev.map((s) =>
                              s.person_id === student.person_id ? updatedStudent : s
                            )
                          );
                          updateItem(updatedStudent);
                        }}
                      />
                    }
                    label="No"
                  />
                </div>
              </Box>
            ))}



      {/* Input Field for Specific Condition if Yes */}
{students.map((student) => (
  <div key={student.person_id} style={{ marginTop: "8px", display: "flex", alignItems: "center" }}>
    <label style={{ marginRight: "8px" }}>IF YES, PLEASE SPECIFY:</label>
    <input
      type="text"
      style={{
        width: "50%",
        padding: "8px",
        fontSize: "1rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "white",
        color: "black",
        outline: "none",
        boxSizing: "border-box",
      }}
      placeholder=""
      value={student.hospitalizationDetails || ""}
      onChange={(e) => {
        const updatedStudent = {
          ...student,
          hospitalizationDetails: e.target.value,
        };
        setStudents((prev) =>
          prev.map((s) =>
            s.person_id === student.person_id ? updatedStudent : s
          )
        );
      }}
      onBlur={(e) => {
        const updatedStudent = {
          ...student,
          hospitalizationDetails: e.target.value,
        };
        updateItem(updatedStudent); // Update the backend when the user finishes editing
      }}
      name="specificCondition" // This will map to the database column 'hospitalizationDetails'
    />
  </div>
))}

{/* Medications Input */}
{students.map((student) => (
  <div key={student.person_id} style={{ marginTop: "16px" }}>
    <p>III. MEDICATIONS:</p>
    <textarea
      style={{
        width: "100%",
        padding: "8px",
        fontSize: "1rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "white",
        color: "black",
        outline: "none",
        resize: "vertical",
        boxSizing: "border-box",
      }}
      value={student.medications || ""}  // Bind value to the student's medications
      rows="2"
      placeholder=""
      name="medications"  // This will map to the database column 'medications'
      onChange={(e) => {
        const updatedStudent = {
          ...student,
          medications: e.target.value,  // Update the medications for this student
        };
        setStudents((prev) =>
          prev.map((s) =>
            s.person_id === student.person_id ? updatedStudent : s
          )
        );
      }}
      onBlur={(e) => {
        const updatedStudent = {
          ...student,
          medications: e.target.value,
        };
        updateItem(updatedStudent);  // Optionally call this function to persist changes
      }}
    />
  </div>
))}



            {/* IV. COVID PROFILE */}
            <div>
              <p style={{ fontWeight: "600" }}>IV. COVID PROFILE:</p>
              <table
                style={{
                  border: "1px solid black",
                  borderCollapse: "collapse",
                  fontFamily: "Arial, Helvetica, sans-serif",
                  width: "100%",
                  tableLayout: "fixed",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        height: "90px",
                        fontSize: "100%",
                        border: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      {students.map((student) => (
                        <Box key={student.person_id} display="flex" alignItems="center" gap={2} flexWrap="nowrap">
                          <span>A. Do you have history of COVID-19?</span>

                          <FormControlLabel
                            control={
                              <Checkbox
                                name="covidHistoryYes"
                                checked={student.hadCovid === 1}  // Bind to student's hadCovid value
                                onChange={(e) => {
                                  const updatedStudent = {
                                    ...student,
                                    hadCovid: e.target.checked ? 1 : 0,  // Update hadCovid status based on checkbox state
                                  };
                                  setStudents((prev) =>
                                    prev.map((s) =>
                                      s.person_id === student.person_id ? updatedStudent : s
                                    )
                                  );
                                  updateItem(updatedStudent);  // Optionally call this to persist changes
                                }}
                              />
                            }
                            label="YES"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="covidHistoryNo"
                                checked={student.hadCovid === 0}  // Bind to student's hadCovid value
                                onChange={(e) => {
                                  const updatedStudent = {
                                    ...student,
                                    hadCovid: e.target.checked ? 0 : 1,  // Update hadCovid status based on checkbox state
                                  };
                                  setStudents((prev) =>
                                    prev.map((s) =>
                                      s.person_id === student.person_id ? updatedStudent : s
                                    )
                                  );
                                  updateItem(updatedStudent);  // Optionally call this to persist changes
                                }}
                              />
                            }
                            label="NO"
                          />

                          <span>IF YES, WHEN:</span>
                          <input
                            type="date"
                            value={student.covidDate || ""}  // Bind to student's covidDate value
                            onChange={(e) => {
                              const updatedStudent = {
                                ...student,
                                covidDate: e.target.value,  // Update covidDate field based on input value
                              };
                              setStudents((prev) =>
                                prev.map((s) =>
                                  s.person_id === student.person_id ? updatedStudent : s
                                )
                              );
                              updateItem(updatedStudent);  // Optionally call this to persist changes
                            }}
                            style={{
                              width: "200px",
                              height: "50px",
                              fontSize: "16px",
                              padding: "10px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                            }}
                          />
                        </Box>
                      ))}

                    </td>
                  </tr>



                  {/* B. COVID Vaccinations */}
                  <tr>
                    <td
                      style={{
                        fontSize: "100%",
                        border: "1px solid black",
                        padding: "8px",
                      }}
                    >
                      <div style={{ fontWeight: "600", marginBottom: "8px" }}>
                        B. COVID Vaccinations:
                      </div>
                      <table
                        style={{
                          borderCollapse: "collapse",
                          width: "100%",
                          fontFamily: "Arial, Helvetica, sans-serif",
                          tableLayout: "fixed",
                        }}
                      >
                        <thead>
                          <tr>
                            <th style={{ textAlign: "left", width: "20%" }}></th>
                            <th style={{ textAlign: "center" }}>1st Dose</th>
                            <th style={{ textAlign: "center" }}>2nd Dose</th>
                            <th style={{ textAlign: "center" }}>Booster 1</th>
                            <th style={{ textAlign: "center" }}>Booster 2</th>
                          </tr>
                        </thead>
                     
                        <tbody>
  {students.map((student) => (
    <React.Fragment key={student.person_id}>
      {/* Vaccine Brand Row */}
      <tr>
        <td style={{ padding: "4px 0" }}>Brand</td>

        <td style={{ padding: "4px" }}>
          <input
            type="text"
            name="vaccine1Brand"
            value={student.vaccine1Brand || ""}
            onChange={(e) => {
              const updatedStudent = {
                ...student,
                vaccine1Brand: e.target.value,
              };
              setStudents((prev) =>
                prev.map((s) =>
                  s.person_id === student.person_id ? updatedStudent : s
                )
              );
              updateItem(updatedStudent);
            }}
            style={inputStyle}
          />
        </td>

        <td style={{ padding: "4px" }}>
          <input
            type="text"
            name="vaccine2Brand"
            value={student.vaccine2Brand || ""}
            onChange={(e) => {
              const updatedStudent = {
                ...student,
                vaccine2Brand: e.target.value,
              };
              setStudents((prev) =>
                prev.map((s) =>
                  s.person_id === student.person_id ? updatedStudent : s
                )
              );
              updateItem(updatedStudent);
            }}
            style={inputStyle}
          />
        </td>

        <td style={{ padding: "4px" }}>
          <input
            type="text"
            name="booster1Brand"
            value={student.booster1Brand || ""}
            onChange={(e) => {
              const updatedStudent = {
                ...student,
                booster1Brand: e.target.value,
              };
              setStudents((prev) =>
                prev.map((s) =>
                  s.person_id === student.person_id ? updatedStudent : s
                )
              );
              updateItem(updatedStudent);
            }}
            style={inputStyle}
          />
        </td>

        <td style={{ padding: "4px" }}>
          <input
            type="text"
            name="booster2Brand"
            value={student.booster2Brand || ""}
            onChange={(e) => {
              const updatedStudent = {
                ...student,
                booster2Brand: e.target.value,
              };
              setStudents((prev) =>
                prev.map((s) =>
                  s.person_id === student.person_id ? updatedStudent : s
                )
              );
              updateItem(updatedStudent);
            }}
            style={inputStyle}
          />
        </td>
      </tr>
  

                              {/* Vaccine Date Row */}
                              <tr>
                                <td style={{ padding: "4px 0" }}>Date</td>
                                <td style={{ padding: "4px" }}>
                                  <input
                                    type="date"
                                    name="vaccine1Date"
                                    value={student.vaccine1Date || ""}
                                    onChange={(e) => {
                                      const updatedStudent = {
                                        ...student,
                                        vaccine1Date: e.target.value,  // Update vaccine1Date
                                      };
                                      setStudents((prev) =>
                                        prev.map((s) =>
                                          s.person_id === student.person_id ? updatedStudent : s
                                        )
                                      );
                                      updateItem(updatedStudent);  // Optionally persist changes
                                    }}
                                    style={inputStyle}
                                  />
                                </td>
                                <td style={{ padding: "4px" }}>
                                  <input
                                    type="date"
                                    name="vaccine2Date"
                                    value={student.vaccine2Date || ""}
                                    onChange={(e) => {
                                      const updatedStudent = {
                                        ...student,
                                        vaccine2Date: e.target.value,  // Update vaccine2Date
                                      };
                                      setStudents((prev) =>
                                        prev.map((s) =>
                                          s.person_id === student.person_id ? updatedStudent : s
                                        )
                                      );
                                      updateItem(updatedStudent);  // Optionally persist changes
                                    }}
                                    style={inputStyle}
                                  />
                                </td>
                                <td style={{ padding: "4px" }}>
                                  <input
                                    type="date"
                                    name="booster1Date"
                                    value={student.booster1Date || ""}
                                    onChange={(e) => {
                                      const updatedStudent = {
                                        ...student,
                                        booster1Date: e.target.value,  // Update booster1Date
                                      };
                                      setStudents((prev) =>
                                        prev.map((s) =>
                                          s.person_id === student.person_id ? updatedStudent : s
                                        )
                                      );
                                      updateItem(updatedStudent);  // Optionally persist changes
                                    }}
                                    style={inputStyle}
                                  />
                                </td>
                                <td style={{ padding: "4px" }}>
                                  <input
                                    type="date"
                                    name="booster2Date"
                                    value={student.booster2Date || ""}
                                    onChange={(e) => {
                                      const updatedStudent = {
                                        ...student,
                                        booster2Date: e.target.value,  // Update booster2Date
                                      };
                                      setStudents((prev) =>
                                        prev.map((s) =>
                                          s.person_id === student.person_id ? updatedStudent : s
                                        )
                                      );
                                      updateItem(updatedStudent);  // Optionally persist changes
                                    }}
                                    style={inputStyle}
                                  />
                                </td>
                              </tr>
                            </React.Fragment>
                          ))}

                        </tbody>
                      </table>
                    </td>
                  </tr>



                </tbody>
              </table>
            </div>


       {/* V. Test Results */}
<div>
  <p style={{ fontWeight: "600" }}>V. Please Indicate Result of the Following:</p>
  <table
    style={{
      border: "1px solid black",
      borderCollapse: "collapse",
      fontFamily: "Arial, Helvetica, sans-serif",
      width: "100%",
      tableLayout: "fixed",
    }}
  >
    <tbody>
      {students.map((student) => (
        <React.Fragment key={student.person_id}>
          {/* Chest X-ray Row */}
          <tr>
            <td
              style={{
                border: "1px solid black",
                padding: "8px",
                width: "30%",
                fontSize: "100%",
              }}
            >
              Chest X-ray:
            </td>
            <td
              style={{
                border: "1px solid black",
                padding: "8px",
                width: "70%",
              }}
            >
              <input
                type="text"
                value={student.chestXray || ""}
                onChange={(e) => {
                  const updatedStudent = {
                    ...student,
                    chestXray: e.target.value, // Update chestXray value
                  };
                  setStudents((prev) =>
                    prev.map((s) =>
                      s.person_id === student.person_id ? updatedStudent : s
                    )
                  );
                }}
                onBlur={(e) => {
                  const updatedStudent = {
                    ...student,
                    chestXray: e.target.value,
                  };
                  updateItem(updatedStudent); // Persist changes on blur
                }}
                style={{
                  width: "100%",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "6px",
                  boxSizing: "border-box",
                  backgroundColor: "white",
                  color: "black",
                }}
              />
            </td>
          </tr>

          {/* CBC Row */}
          <tr>
            <td
              style={{
                border: "1px solid black",
                padding: "8px",
                width: "30%",
                fontSize: "100%",
              }}
            >
              Complete Blood Count (CBC):
            </td>
            <td
              style={{
                border: "1px solid black",
                padding: "8px",
                width: "70%",
              }}
            >
              <input
                type="text"
                value={student.cbc || ""}
                onChange={(e) => {
                  const updatedStudent = {
                    ...student,
                    cbc: e.target.value, // Update CBC value
                  };
                  setStudents((prev) =>
                    prev.map((s) =>
                      s.person_id === student.person_id ? updatedStudent : s
                    )
                  );
                }}
                onBlur={(e) => {
                  const updatedStudent = {
                    ...student,
                    cbc: e.target.value,
                  };
                  updateItem(updatedStudent); // Persist changes on blur
                }}
                style={{
                  width: "100%",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "6px",
                  boxSizing: "border-box",
                  backgroundColor: "white",
                  color: "black",
                }}
              />
            </td>
          </tr>

          {/* Urinalysis Row */}
          <tr>
            <td
              style={{
                border: "1px solid black",
                padding: "8px",
                width: "30%",
                fontSize: "100%",
              }}
            >
              Urinalysis:
            </td>
            <td
              style={{
                border: "1px solid black",
                padding: "8px",
                width: "70%",
              }}
            >
              <input
                type="text"
                value={student.urinalysis || ""}
                onChange={(e) => {
                  const updatedStudent = {
                    ...student,
                    urinalysis: e.target.value, // Update urinalysis value
                  };
                  setStudents((prev) =>
                    prev.map((s) =>
                      s.person_id === student.person_id ? updatedStudent : s
                    )
                  );
                }}
                onBlur={(e) => {
                  const updatedStudent = {
                    ...student,
                    urinalysis: e.target.value,
                  };
                  updateItem(updatedStudent); // Persist changes on blur
                }}
                style={{
                  width: "100%",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "6px",
                  boxSizing: "border-box",
                  backgroundColor: "white",
                  color: "black",
                }}
              />
            </td>
          </tr>

          {/* Other Work-ups Row */}
          <tr>
            <td
              style={{
                border: "1px solid black",
                padding: "8px",
                width: "30%",
                fontSize: "100%",
              }}
            >
              Others (Please specify work-ups and results):
            </td>
            <td
              style={{
                border: "1px solid black",
                padding: "8px",
                width: "70%",
              }}
            >
              <input
                type="text"
                value={student.otherworkups || ""}
                onChange={(e) => {
                  const updatedStudent = {
                    ...student,
                    otherworkups: e.target.value, // Update other work-ups value
                  };
                  setStudents((prev) =>
                    prev.map((s) =>
                      s.person_id === student.person_id ? updatedStudent : s
                    )
                  );
                }}
                onBlur={(e) => {
                  const updatedStudent = {
                    ...student,
                    otherworkups: e.target.value,
                  };
                  updateItem(updatedStudent); // Persist changes on blur
                }}
                style={{
                  width: "100%",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "6px",
                  boxSizing: "border-box",
                  backgroundColor: "white",
                  color: "black",
                }}
              />
            </td>
          </tr>
        </React.Fragment>
      ))}
    </tbody>
  </table>
</div>







            <div>
              <p style={{ fontWeight: "600" }}>VI. Diagnosis:</p>
              <table
                style={{
                  border: "1px solid black",
                  borderCollapse: "collapse",
                  fontFamily: "Arial, Helvetica, sans-serif",
                  width: "100%",
                  tableLayout: "fixed",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "8px",
                        fontSize: "100%",
                      }}
                    >
                      Do you have any of the following symptoms today?
                      <div style={{ marginTop: "8px" }}>
                        {students.map((student) => (
                          <React.Fragment key={student.person_id}>
                            <FormGroup row sx={{ ml: 2 }}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    name="symptomsToday"
                                    checked={student.symptomsToday === 1} // If symptomsToday is 1, check the box
                                    onChange={(e) => {
                                      const updatedStudent = {
                                        ...student,
                                        symptomsToday: e.target.checked ? 1 : 0, // Update based on checkbox
                                      };
                                      setStudents((prev) =>
                                        prev.map((s) =>
                                          s.person_id === student.person_id ? updatedStudent : s
                                        )
                                      );
                                      updateItem(updatedStudent); // Optionally persist changes
                                    }}
                                  />
                                }
                                label="Physically Fit"
                                sx={{ mr: 3 }}
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    name="symptomsToday"
                                    checked={student.symptomsToday === 0} // If symptomsToday is 0, check the box for Compliance
                                    onChange={(e) => {
                                      const updatedStudent = {
                                        ...student,
                                        symptomsToday: e.target.checked ? 0 : 1, // Update based on checkbox
                                      };
                                      setStudents((prev) =>
                                        prev.map((s) =>
                                          s.person_id === student.person_id ? updatedStudent : s
                                        )
                                      );
                                      updateItem(updatedStudent); // Optionally persist changes
                                    }}
                                  />
                                }
                                label="For Compliance"
                              />
                            </FormGroup>
                          </React.Fragment>
                        ))}

                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>


{/* VII. Remarks */}
<div style={{ marginTop: "16px" }}>
  <p style={{ fontWeight: "600" }}>VII. Remarks:</p>
  <table
    style={{
      border: "1px solid black",
      borderCollapse: "collapse",
      fontFamily: "Arial, Helvetica, sans-serif",
      width: "100%",
      tableLayout: "fixed",
    }}
  >
    <tbody>
      {students.map((student) => (
        <React.Fragment key={student.person_id}>
          <tr>
            <td
              style={{
                border: "1px solid black",
                padding: "8px",
              }}
            >
              <textarea
                rows="2"
                style={{
                  width: "100%",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "8px",
                  boxSizing: "border-box",
                  backgroundColor: "white",
                  color: "black",
                  resize: "none",
                }}
                value={student.remarks || ""}  // Dynamically set value per student
                onChange={(e) => {
                  const updatedStudent = {
                    ...student,
                    remarks: e.target.value,  // Update the remarks field
                  };
                  setStudents((prev) =>
                    prev.map((s) =>
                      s.person_id === student.person_id ? updatedStudent : s
                    )
                  );
                }}
                onBlur={(e) => {
                  const updatedStudent = {
                    ...student,
                    remarks: e.target.value,
                  };
                  updateItem(updatedStudent); // Persist changes when user finishes editing
                }}
              />
            </td>
          </tr>
        </React.Fragment>
      ))}
    </tbody>
  </table>
</div>


          </form>
        </div>

        <Box display="flex" justifyContent="space-between" mt={4}>
          {/* Previous Page Button */}
          <Button
            variant="contained"
            component={Link}
            to="/applicant_educational_attainment"
            startIcon={
              <ArrowBackIcon
                sx={{
                  color: '#000',
                  transition: 'color 0.3s',
                }}
              />
            }
            sx={{
              backgroundColor: '#E8C999',
              color: '#000',
              '&:hover': {
                backgroundColor: '#6D2323',
                color: '#fff',
                '& .MuiSvgIcon-root': {
                  color: '#fff',
                },
              },
            }}
          >
            Previous Step
          </Button>

          {/* Next Step Button */}
          <Button
            variant="contained"
            component={Link}
            to="/applicant_other_information"
            endIcon={
              <ArrowForwardIcon
                sx={{
                  color: '#fff',
                  transition: 'color 0.3s',
                }}
              />
            }
            sx={{
              backgroundColor: '#6D2323',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#E8C999',
                color: '#000',
                '& .MuiSvgIcon-root': {
                  color: '#000',
                },
              },
            }}
          >
            Next Step
          </Button>
        </Box>
      </Box>

    </Container>
    </Box>
  );
};

export default ApplicantHealthMedicalRecords;