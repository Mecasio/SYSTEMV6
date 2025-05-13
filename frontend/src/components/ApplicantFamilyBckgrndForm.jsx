import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, TextField, Container, Typography, Box, Checkbox, FormControlLabel, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import { Link } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import SchoolIcon from "@mui/icons-material/School";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import InfoIcon from "@mui/icons-material/Info";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { jwtDecode } from "jwt-decode";

const ApplicantFamilyBackground = () => {
  const getPersonIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      console.log("Decoded Token: ", decoded);
      return decoded.person_id; // Ensure your token includes this field
    }
    return null;
  };

  const [students, setStudents] = useState([]);

  const [personID, setPersonID] = useState('');
  const personIDFromToken = getPersonIdFromToken();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchFamilyBackground = async () => {
      try {
        const response = await axios.get('http://localhost:5000/person_table');
        console.log('Fetched Family Background Data:', response.data);
        const filtered = response.data.filter(item => String(item.person_id) === String(personIDFromToken));
        setData(filtered);
      } catch (error) {
        console.error("Error fetching family background:", error);
      }
    };

    fetchFamilyBackground();
  }, [personID]);

  useEffect(() => {
    fetch("http://localhost:5000/person_table")
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error("Error in fallback fetch:", err));
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


  const [step, setStep] = useState(2); // Initialize step at 1

  const handlePreviousPage = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleNextStep = () => {
    if (step < 5) setStep(step + 1); // Change '5' to total number of steps you have
  };

  const [isFatherDeceased, setIsFatherDeceased] = useState(false);
  const [isMotherDeceased, setIsMotherDeceased] = useState(false);
  const [isSoloParent, setIsSoloParent] = useState(false);
  const [parentType, setParentType] = useState("");

  // When Solo Parent checkbox is toggled
  const handleSoloParentChange = (e) => {
    const checked = e.target.checked;
    setIsSoloParent(checked);

    if (!checked) {
      // Reset if unchecked
      setParentType("");
    }
  };

  // When Mother or Father is selected under Solo Parent
  const handleParentTypeChange = (event) => {
    const selected = event.target.value;
    setParentType(selected);

    // Logic for handling the solo parent selection (no disabling of checkboxes anymore)
    if (selected === "Mother") {
      setIsFatherDeceased(true);
      setIsMotherDeceased(false);
    } else if (selected === "Father") {
      setIsMotherDeceased(true);
      setIsFatherDeceased(false);
    }
  };



  const steps = [
    { label: 'Personal Information', icon: <PersonIcon />, path: '/applicant_personal_information' },
    { label: 'Family Background', icon: <FamilyRestroomIcon />, path: '/applicant_family_background' },
    { label: 'Educational Attainment', icon: <SchoolIcon />, path: '/applicant_educational_attainment' },
    { label: 'Health Medical Records', icon: <HealthAndSafetyIcon />, path: '/applicant_health_medical_records' },
    { label: 'Other Information', icon: <InfoIcon />, path: '/applicant_other_information' },
  ];



  const [activeStep, setActiveStep] = useState(1);
  const [clickedSteps, setClickedSteps] = useState(Array(steps.length).fill(false));

  const handleStepClick = (index) => {
    setActiveStep(index);
    const newClickedSteps = [...clickedSteps];
    newClickedSteps[index] = true;
    setClickedSteps(newClickedSteps);
  };

  const [fatherEduNotApplicable, setFatherEduNotApplicable] = useState(false);
  const [motherEduNotApplicable, setMotherEduNotApplicable] = useState(false);




  return (
    <Box sx={{ height: 'calc(100vh - 120px)', overflowY: 'auto', paddingRight: 1, backgroundColor: 'transparent' }}>

      <Container>
        <Container>
          <h1 style={{ fontSize: "50px", fontWeight: "bold", overflowY: "auto", textAlign: "center", color: "maroon", marginTop: "25px" }}>
            APPLICANT FORM
          </h1>
          <div style={{ textAlign: "center" }}>
            Complete the applicant form to secure your place for the upcoming academic year at EARIST.
          </div>
        </Container>
        <br />
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

        <br />
        <form>
          <Container maxWidth="100%" sx={{ backgroundColor: "#6D2323", border: "2px solid black", color: "white", borderRadius: 2, boxShadow: 3, padding: "4px" }}>
            <Box sx={{ width: "100%" }}>
              <Typography style={{ fontSize: "20px", padding: "10px", fontFamily: "Arial Black" }}>Step 2: Family Background</Typography>
            </Box>
          </Container>


          <Container maxWidth="100%" sx={{ backgroundColor: "white", border: "2px solid black", padding: 4, borderRadius: 2, boxShadow: 3 }}>
            <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold", textAlign: "Left" }}>
              Family Background:
            </Typography>
            <hr style={{ border: "1px solid #ccc", width: "100%" }} />

            <Box display="flex" gap={3} width="100%" alignItems="center">
              <Box marginTop="10px" display="flex" alignItems="center">
                <div style={{ marginRight: "8px" }}>Solo Parent:</div>
                <Checkbox

                  checked={isSoloParent}
                  value={data[0]?.solo_parent || ""}
                  onChange={handleSoloParentChange}
                  inputProps={{ "aria-label": "Solo Parent checkbox" }}
                />
              </Box>

              {isSoloParent && (
                <Box marginTop="10px" display="flex" alignItems="center">
                  <FormControl fullWidth size="small" style={{ width: "200px", marginRight: "16px" }}>
                    <InputLabel id="parent-type-label">Mother/Father</InputLabel>
                    <Select
                      labelId="parent-type-label"
                      value={parentType}
                      label="Mother/Father"
                      onChange={handleParentTypeChange}
                    >
                      <MenuItem value="Mother">Mother</MenuItem>
                      <MenuItem value="Father">Father</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              )}

            </Box>


            <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold", textAlign: "Center" }}>
              Father's Information:
            </Typography>
            <hr style={{ border: "1px solid #ccc", width: "100%" }} />
            <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold" }}>
              Father:
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isFatherDeceased}
                  onChange={(e) => setIsFatherDeceased(e.target.checked)}
                />
              }
              label="Father Deceased"
            />
            <hr style={{ border: "1px solid #ccc", width: "100%" }} />

            {!isFatherDeceased && (
              <Box mt={2}>
                {/* Name Fields Row */}
                {students.map((student) => (
                  <Box key={student.person_id} mt={2}>
                    <div><strong>Father's Name:</strong></div>
                    <Box display="flex" gap={2} flexWrap="wrap">
                      {/* Family Name */}
                      <TextField
                        label="Family Name *"
                        required
                        fullWidth
                        size="small"
                        value={student.father_family_name || ""}
                        onChange={(e) => {
                          const updatedStudent = { ...student, father_family_name: e.target.value };
                          setStudents((prev) =>
                            prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                          );
                        }}
                        onBlur={(e) => {
                          const updatedStudent = { ...student, father_family_name: e.target.value };
                          updateItem(updatedStudent);
                        }}
                        sx={{ flex: 1 }}
                      />

                      {/* Given Name */}
                      <TextField
                        label="Given Name *"
                        required
                        fullWidth
                        size="small"
                        value={student.father_given_name || ""}
                        onChange={(e) => {
                          const updatedStudent = { ...student, father_given_name: e.target.value };
                          setStudents((prev) =>
                            prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                          );
                        }}
                        onBlur={(e) => {
                          const updatedStudent = { ...student, father_given_name: e.target.value };
                          updateItem(updatedStudent);
                        }}
                        sx={{ flex: 1 }}
                      />

                      {/* Middle Name */}
                      <TextField
                        label="Middle Name *"
                        required
                        fullWidth
                        size="small"
                        value={student.father_middle_name || ""}
                        onChange={(e) => {
                          const updatedStudent = { ...student, father_middle_name: e.target.value };
                          setStudents((prev) =>
                            prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                          );
                        }}
                        onBlur={(e) => {
                          const updatedStudent = { ...student, father_middle_name: e.target.value };
                          updateItem(updatedStudent);
                        }}
                        sx={{ flex: 1 }}
                      />

                      {/* EXT */}
                      <FormControl fullWidth size="small" sx={{ flex: 1 }}>
                        <InputLabel id={`ext-label-${student.person_id}`}>EXT *</InputLabel>
                        <Select
                          labelId={`ext-label-${student.person_id}`}
                          value={student.father_ext || ""}
                          label="EXT *"
                          onChange={(e) => {
                            const updatedStudent = { ...student, father_ext: e.target.value };
                            setStudents((prev) =>
                              prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                            );
                          }}
                          onClose={() => {
                            updateItem(student); // Save changes when dropdown is closed
                          }}
                        >
                          <MenuItem value="">None</MenuItem>
                          <MenuItem value="Jr.">Jr.</MenuItem>
                          <MenuItem value="Sr.">Sr.</MenuItem>
                          <MenuItem value="I">I</MenuItem>
                          <MenuItem value="II">II</MenuItem>
                          <MenuItem value="III">III</MenuItem>
                          <MenuItem value="IV">IV</MenuItem>
                          <MenuItem value="V">V</MenuItem>
                        </Select>
                      </FormControl>

                      {/* Nick Name */}
                      <TextField
                        label="Nick Name"
                        fullWidth
                        size="small"
                        value={student.father_nickname || ""}
                        onChange={(e) => {
                          const updatedStudent = { ...student, father_nickname: e.target.value };
                          setStudents((prev) =>
                            prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                          );
                        }}
                        onBlur={(e) => {
                          const updatedStudent = { ...student, father_nickname: e.target.value };
                          updateItem(updatedStudent);
                        }}
                        sx={{ flex: 1 }}
                      />
                    </Box>
                  </Box>
                ))}



                < br />
                <hr style={{ border: "1px solid #ccc", width: "100%" }} />
                {/* Contact Info Header */}
                <Typography
                  style={{
                    fontSize: "20px",
                    color: "#6D2323",
                    fontWeight: "bold",
                    marginTop: "20px",
                    marginBottom: "10px"
                  }}
                >
                  Educational Background of Father:
                </Typography>

                <Box sx={{ p: 2 }}>
                  {/* Father Section */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={fatherEduNotApplicable}
                        onChange={(e) => {
                          setFatherEduNotApplicable(e.target.checked);
                          if (e.target.checked) {
                            // Clear all father education fields for all students
                            const cleared = students.map((s) => ({
                              ...s,
                              father_education_level: "",
                              father_last_school: "",
                              father_course: "",
                              father_year_graduated: "",
                              father_school_address: "",
                            }));
                            setStudents(cleared);
                          }
                        }}
                      />
                    }
                    label="Father's education not applicable"
                  />

                  {/* Father Educational Details */}
                  {!fatherEduNotApplicable &&
                    students.map((student) => (
                      <Box
                        key={student.person_id}
                        display="flex"
                        gap={2}
                        mt={2}
                        flexWrap="nowrap"
                        sx={{
                          '& > *': {
                            flex: 1,
                            minWidth: 150,
                          },
                        }}
                      >
                        {/* Father's Education Level */}
                        <TextField
                          label="Father's Education Level"
                          size="small"
                          value={student.father_education_level || ""}
                          onChange={(e) => {
                            const updatedStudent = {
                              ...student,
                              father_education_level: e.target.value,
                            };
                            setStudents((prev) =>
                              prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                            );
                          }}
                          onBlur={(e) => {
                            const updatedStudent = {
                              ...student,
                              father_education_level: e.target.value,
                            };
                            updateItem(updatedStudent);
                          }}
                        />

                        {/* Father's Last School Attended */}
                        <TextField
                          label="Father's Last School Attended"
                          size="small"
                          value={student.father_last_school || ""}
                          onChange={(e) => {
                            const updatedStudent = {
                              ...student,
                              father_last_school: e.target.value,
                            };
                            setStudents((prev) =>
                              prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                            );
                          }}
                          onBlur={(e) => {
                            const updatedStudent = {
                              ...student,
                              father_last_school: e.target.value,
                            };
                            updateItem(updatedStudent);
                          }}
                        />

                        {/* Father's Course/Program */}
                        <TextField
                          label="Father's Course/Program"
                          size="small"
                          value={student.father_course || ""}
                          onChange={(e) => {
                            const updatedStudent = {
                              ...student,
                              father_course: e.target.value,
                            };
                            setStudents((prev) =>
                              prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                            );
                          }}
                          onBlur={(e) => {
                            const updatedStudent = {
                              ...student,
                              father_course: e.target.value,
                            };
                            updateItem(updatedStudent);
                          }}
                        />

                        {/* Father's Year Graduated */}
                        <TextField
                          label="Father's Year Graduated"
                          size="small"
                          value={student.father_year_graduated || ""}
                          onChange={(e) => {
                            const updatedStudent = {
                              ...student,
                              father_year_graduated: e.target.value,
                            };
                            setStudents((prev) =>
                              prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                            );
                          }}
                          onBlur={(e) => {
                            const updatedStudent = {
                              ...student,
                              father_year_graduated: e.target.value,
                            };
                            updateItem(updatedStudent);
                          }}
                        />

                        {/* Father's School Address */}
                        <TextField
                          label="Father's School Address"
                          size="small"
                          value={student.father_school_address || ""}
                          onChange={(e) => {
                            const updatedStudent = {
                              ...student,
                              father_school_address: e.target.value,
                            };
                            setStudents((prev) =>
                              prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                            );
                          }}
                          onBlur={(e) => {
                            const updatedStudent = {
                              ...student,
                              father_school_address: e.target.value,
                            };
                            updateItem(updatedStudent);
                          }}
                        />
                      </Box>
                    ))}
                </Box>

                <Typography
                  style={{
                    fontSize: "20px",
                    color: "#6D2323",
                    fontWeight: "bold",
                    marginTop: "20px",
                    marginBottom: "10px"
                  }}
                >
                  Contact Information:
                </Typography>
                {/* Contact Info Fields Row */}
                {students.map((student) => (
                  <Box key={student.person_id} display="flex" gap={2} mt={2}>
                    {/* Contact Number */}
                    <Box sx={{ width: "25%" }}>
                      <div style={{ fontSize: "12px", marginBottom: "6px", fontFamily: "Arial" }}>
                        Contact Number:
                      </div>
                      <TextField
                        label="Enter Contact Number"
                        required
                        fullWidth
                        size="small"
                        value={student.father_contact || ""}
                        onChange={(e) => {
                          const updatedStudent = { ...student, father_contact: e.target.value };
                          setStudents((prev) =>
                            prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                          );
                        }}
                        onBlur={(e) => {
                          const updatedStudent = { ...student, father_contact: e.target.value };
                          updateItem(updatedStudent);
                        }}
                      />
                    </Box>

                    {/* Occupation */}
                    <Box sx={{ width: "25%" }}>
                      <div style={{ fontSize: "12px", marginBottom: "6px", fontFamily: "Arial" }}>
                        Occupation:
                      </div>
                      <TextField
                        label="Enter Occupation"
                        required
                        fullWidth
                        size="small"
                        value={student.father_occupation || ""}
                        onChange={(e) => {
                          const updatedStudent = { ...student, father_occupation: e.target.value };
                          setStudents((prev) =>
                            prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                          );
                        }}
                        onBlur={(e) => {
                          const updatedStudent = { ...student, father_occupation: e.target.value };
                          updateItem(updatedStudent);
                        }}
                      />
                    </Box>

                    {/* Employer / Company */}
                    <Box sx={{ width: "25%" }}>
                      <div style={{ fontSize: "12px", marginBottom: "6px", fontFamily: "Arial" }}>
                        Employer/Name of Company:
                      </div>
                      <TextField
                        label="Enter Employer/Company"
                        fullWidth
                        size="small"
                        value={student.father_employer || ""}
                        onChange={(e) => {
                          const updatedStudent = { ...student, father_employer: e.target.value };
                          setStudents((prev) =>
                            prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                          );
                        }}
                        onBlur={(e) => {
                          const updatedStudent = { ...student, father_employer: e.target.value };
                          updateItem(updatedStudent);
                        }}
                      />
                    </Box>

                    {/* Monthly Income */}
                    <Box sx={{ width: "25%" }}>
                      <div style={{ fontSize: "12px", marginBottom: "6px", fontFamily: "Arial" }}>
                        Monthly Income:
                      </div>
                      <TextField
                        label="Enter Monthly Income"
                        fullWidth
                        size="small"
                        value={student.father_income || ""}
                        onChange={(e) => {
                          const updatedStudent = { ...student, father_income: e.target.value };
                          setStudents((prev) =>
                            prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                          );
                        }}
                        onBlur={(e) => {
                          const updatedStudent = { ...student, father_income: e.target.value };
                          updateItem(updatedStudent);
                        }}
                      />
                    </Box>
                  </Box>
                ))}

                {/* Email Field Full Width */}
                {students.map((student) => (
                  <Box key={student.person_id} mt={2}>
                    <div>Email Address:</div>
                    <TextField
                      label="Enter Email"
                      style={{ width: "49.5%" }}
                      size="small"
                      value={student.father_email || ""}
                      onChange={(e) => {
                        const updatedStudent = { ...student, father_email: e.target.value };
                        setStudents((prev) =>
                          prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                        );
                      }}
                      onBlur={(e) => {
                        const updatedStudent = { ...student, father_email: e.target.value };
                        updateItem(updatedStudent);
                      }}
                    />
                  </Box>
                ))}


              </Box>
            )}






            < br />
            <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold", textAlign: "Center" }}>
              Mother's Information:
            </Typography>
            <hr style={{ border: "1px solid #ccc", width: "100%" }} />

            <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold" }}>
              Mother:
            </Typography>

            <FormControlLabel
              control={
                <Checkbox
                  checked={isMotherDeceased}
                  onChange={(e) => setIsMotherDeceased(e.target.checked)}
                />
              }
              label="Mother Deceased"
            />
            <hr style={{ border: "1px solid #ccc", width: "100%" }} />

            {!isMotherDeceased && (
              <Box mt={2}>
                {/* Full Name Row */}
                {/* Full Name Row */}
                {students.map((student) => (
                  <Box key={student.person_id} mt={2}>
                    {/* Full Name Row */}
                    <Box display="flex" gap={2} marginTop="10px">
                      <div style={{ marginRight: "-40px" }}>
                        <strong>Mother's <br />Maiden Name:</strong>
                      </div>

                      {/* Family Name */}
                      <Box width="25%">
                        <div>Family Name: <span style={{ color: "red" }}>*</span></div>
                        <TextField
                          label="Enter Family Name"
                          required
                          fullWidth
                          size="small"
                          value={student.mother_family_name || ""}
                          onChange={(e) => {
                            const updatedStudent = { ...student, mother_family_name: e.target.value };
                            setStudents((prev) =>
                              prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                            );
                          }}
                          onBlur={(e) => {
                            const updatedStudent = { ...student, mother_family_name: e.target.value };
                            updateItem(updatedStudent);
                          }}
                        />
                      </Box>

                      {/* Given Name */}
                      <Box width="25%">
                        <div>Given Name: <span style={{ color: "red" }}>*</span></div>
                        <TextField
                          label="Enter Given Name"
                          required
                          fullWidth
                          size="small"
                          value={student.mother_given_name || ""}
                          onChange={(e) => {
                            const updatedStudent = { ...student, mother_given_name: e.target.value };
                            setStudents((prev) =>
                              prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                            );
                          }}
                          onBlur={(e) => {
                            const updatedStudent = { ...student, mother_given_name: e.target.value };
                            updateItem(updatedStudent);
                          }}
                        />
                      </Box>

                      {/* Middle Name */}
                      <Box width="25%">
                        <div>Middle Name: <span style={{ color: "red" }}>*</span></div>
                        <TextField
                          label="Enter Middle Name"
                          required
                          fullWidth
                          size="small"
                          value={student.mother_middle_name || ""}
                          onChange={(e) => {
                            const updatedStudent = { ...student, mother_middle_name: e.target.value };
                            setStudents((prev) =>
                              prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                            );
                          }}
                          onBlur={(e) => {
                            const updatedStudent = { ...student, mother_middle_name: e.target.value };
                            updateItem(updatedStudent);
                          }}
                        />
                      </Box>

                      {/* Nick Name */}
                      <Box width="25%">
                        <div>Nick Name:</div>
                        <TextField
                          label="Enter Nickname"
                          fullWidth
                          size="small"
                          value={student.mother_nickname || ""}
                          onChange={(e) => {
                            const updatedStudent = { ...student, mother_nickname: e.target.value };
                            setStudents((prev) =>
                              prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                            );
                          }}
                          onBlur={(e) => {
                            const updatedStudent = { ...student, mother_nickname: e.target.value };
                            updateItem(updatedStudent);
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                ))}


                < br />
                <hr style={{ border: "1px solid #ccc", width: "100%" }} />

                {/* Contact Info Title */}
                <Typography
                  style={{
                    fontSize: "20px",
                    color: "#6D2323",
                    fontWeight: "bold",
                    marginTop: "20px",
                  }}
                >
                  Educational Background of Mother:
                </Typography>
                {/* Mother Section */}

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={motherEduNotApplicable}
                      onChange={(e) => {
                        setMotherEduNotApplicable(e.target.checked);
                        if (e.target.checked) {
                          setNewFamilyBackground({
                            ...newFamilyBackground,
                            mother_education_level: "",
                            mother_last_school: "",
                            mother_course: "",
                            mother_year_graduated: "",
                            mother_school_address: "", // Clear all fields when checkbox is checked
                          });
                        }
                      }}
                    />
                  }
                  label="Mother's education not applicable"
                />


                {/* Mother Educational Details */}
                {!motherEduNotApplicable && students.map((student) => (
                  <Box key={student.person_id} sx={{ p: 2 }}>
                    <Box
                      display="flex"
                      gap={2}
                      mt={2}
                      flexWrap="nowrap"
                      sx={{
                        '& > *': {
                          flex: 1,
                          minWidth: 150,
                        },
                      }}
                    >
                      <TextField
                        label="Mother's Education Level"
                        size="small"
                        value={student.mother_education_level || ""}
                        onChange={(e) => {
                          const updatedStudent = {
                            ...student,
                            mother_education_level: e.target.value,
                          };
                          setStudents((prev) =>
                            prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                          );
                        }}
                        onBlur={(e) => {
                          const updatedStudent = {
                            ...student,
                            mother_education_level: e.target.value,
                          };
                          updateItem(updatedStudent);
                        }}
                        sx={{ flex: 1 }}
                      />
                      <TextField
                        label="Mother's Last School Attended"
                        size="small"
                        value={student.mother_last_school || ""}
                        onChange={(e) => {
                          const updatedStudent = {
                            ...student,
                            mother_last_school: e.target.value,
                          };
                          setStudents((prev) =>
                            prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                          );
                        }}
                        onBlur={(e) => {
                          const updatedStudent = {
                            ...student,
                            mother_last_school: e.target.value,
                          };
                          updateItem(updatedStudent);
                        }}
                        sx={{ flex: 1 }}
                      />
                      <TextField
                        label="Mother's Course/Program"
                        size="small"
                        value={student.mother_course || ""}
                        onChange={(e) => {
                          const updatedStudent = {
                            ...student,
                            mother_course: e.target.value,
                          };
                          setStudents((prev) =>
                            prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                          );
                        }}
                        onBlur={(e) => {
                          const updatedStudent = {
                            ...student,
                            mother_course: e.target.value,
                          };
                          updateItem(updatedStudent);
                        }}
                        sx={{ flex: 1 }}
                      />
                      <TextField
                        label="Mother's Year Graduated"
                        size="small"
                        value={student.mother_year_graduated || ""}
                        onChange={(e) => {
                          const updatedStudent = {
                            ...student,
                            mother_year_graduated: e.target.value,
                          };
                          setStudents((prev) =>
                            prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                          );
                        }}
                        onBlur={(e) => {
                          const updatedStudent = {
                            ...student,
                            mother_year_graduated: e.target.value,
                          };
                          updateItem(updatedStudent);
                        }}
                        sx={{ flex: 1 }}
                      />
                      <TextField
                        label="Mother's School Address"
                        size="small"
                        value={student.mother_school_address || ""}
                        onChange={(e) => {
                          const updatedStudent = {
                            ...student,
                            mother_school_address: e.target.value,
                          };
                          setStudents((prev) =>
                            prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                          );
                        }}
                        onBlur={(e) => {
                          const updatedStudent = {
                            ...student,
                            mother_school_address: e.target.value,
                          };
                          updateItem(updatedStudent);
                        }}
                        sx={{ flex: 1 }}
                      />
                    </Box>
                  </Box>
                ))}


                <Typography
                  style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold", marginTop: "20px" }}
                >
                  Contact Information:
                </Typography>



                {/* Contact Information Row */}
                {students.map((student) => (
                  <Box key={student.person_id} display="flex" gap={2} marginTop="10px">
                    <Box width="25%">
                      <div style={{ fontSize: "12px", marginBottom: "6px", fontFamily: "Arial" }}>Contact Number:</div>
                      <TextField
                        label="Enter Contact Number"
                        required
                        style={{ width: "100%" }}
                        size="small"
                        value={student.mother_contact || ""}
                        onChange={(e) => {
                          const updatedStudent = {
                            ...student,
                            mother_contact: e.target.value,
                          };
                          setStudents((prev) =>
                            prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                          );
                        }}
                        onBlur={(e) => {
                          const updatedStudent = {
                            ...student,
                            mother_contact: e.target.value,
                          };
                          updateItem(updatedStudent);
                        }}
                      />
                    </Box>

                    <Box width="25%">
                      <div style={{ fontSize: "12px", marginBottom: "6px", fontFamily: "Arial" }}>Occupation:</div>
                      <TextField
                        label="Enter Occupation"
                        required
                        style={{ width: "100%" }}
                        size="small"
                        value={student.mother_occupation || ""}
                        onChange={(e) => {
                          const updatedStudent = {
                            ...student,
                            mother_occupation: e.target.value,
                          };
                          setStudents((prev) =>
                            prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                          );
                        }}
                        onBlur={(e) => {
                          const updatedStudent = {
                            ...student,
                            mother_occupation: e.target.value,
                          };
                          updateItem(updatedStudent);
                        }}
                      />
                    </Box>

                    <Box width="25%">
                      <div style={{ fontSize: "12px", marginBottom: "6px", fontFamily: "Arial" }}>Employer/Name of Company:</div>
                      <TextField
                        label="Enter Employer/Company"
                        style={{ width: "100%" }}
                        size="small"
                        value={student.mother_employer || ""}
                        onChange={(e) => {
                          const updatedStudent = {
                            ...student,
                            mother_employer: e.target.value,
                          };
                          setStudents((prev) =>
                            prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                          );
                        }}
                        onBlur={(e) => {
                          const updatedStudent = {
                            ...student,
                            mother_employer: e.target.value,
                          };
                          updateItem(updatedStudent);
                        }}
                      />
                    </Box>

                    <Box width="25%">
                      <div style={{ fontSize: "12px", marginBottom: "6px", fontFamily: "Arial" }}>Monthly Income:</div>
                      <TextField
                        label="Enter Monthly Income"
                        style={{ width: "100%" }}
                        size="small"
                        value={student.mother_income || ""}
                        onChange={(e) => {
                          const updatedStudent = {
                            ...student,
                            mother_income: e.target.value,
                          };
                          setStudents((prev) =>
                            prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                          );
                        }}
                        onBlur={(e) => {
                          const updatedStudent = {
                            ...student,
                            mother_income: e.target.value,
                          };
                          updateItem(updatedStudent);
                        }}
                      />
                    </Box>
                  </Box>
                ))}

                {/* Email Field */}
                {students.map((student) => (
                  <Box key={student.person_id} width="100%" marginTop="10px">
                    <div>Email Address:</div>
                    <TextField
                      label="Enter Email"
                      style={{ width: "49.5%" }}  // This makes the TextField 100% of the parent width
                      size="small"
                      value={student.mother_email || ""}
                      onChange={(e) => {
                        const updatedStudent = {
                          ...student,
                          mother_email: e.target.value,
                        };
                        setStudents((prev) =>
                          prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                        );
                      }}
                      onBlur={(e) => {
                        const updatedStudent = {
                          ...student,
                          mother_email: e.target.value,
                        };
                        updateItem(updatedStudent);
                      }}
                    />
                  </Box>
                ))}


              </Box>
            )}



            < br />
            <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold", textAlign: "Center" }}>
              In Case Of Emergency:
            </Typography>
            <hr style={{ border: "1px solid #ccc", width: "100%" }} />

            <Box mt={2}>
              <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold", }}>
                Guardian:
              </Typography>
              <br />
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', }}>
                <div ><strong>Guardian:</strong></div>

                {students.map((student) => (
                  <FormControl fullWidth style={{ marginTop: '10px' }} size="small" required key={student.person_id}>
                    <InputLabel id={`guardian-label-${student.person_id}`}>Guardian</InputLabel>
                    <Select
                      labelId={`guardian-label-${student.person_id}`}
                      id={`guardian-select-${student.person_id}`}
                      value={student.guardian || ""}
                      label="Guardian"
                      style={{ width: "20%", marginTop: "5px" }}
                      onChange={(e) => {
                        const updatedGuardian = e.target.value;
                        const updatedStudent = { ...student, guardian: updatedGuardian };

                        // Update local state
                        setStudents((prevStudents) =>
                          prevStudents.map((s) =>
                            s.person_id === student.person_id ? updatedStudent : s
                          )
                        );

                        // Immediately update backend
                        updateItem(updatedStudent);
                      }}
                    >
                      <MenuItem value="Father">Father</MenuItem>
                      <MenuItem value="Mother">Mother</MenuItem>
                      <MenuItem value="Brother/Sister">Brother/Sister</MenuItem>
                      <MenuItem value="Uncle">Uncle</MenuItem>
                      <MenuItem value="StepFather">Stepfather</MenuItem>
                      <MenuItem value="StepMother">Stepmother</MenuItem>
                      <MenuItem value="Cousin">Cousin</MenuItem>
                      <MenuItem value="Father in Law">Father-in-law</MenuItem>
                      <MenuItem value="Mother in Law">Mother-in-law</MenuItem>
                      <MenuItem value="Sister in Law">Sister-in-law</MenuItem>
                      <MenuItem value="Spouse">Spouse</MenuItem>
                      <MenuItem value="Others">Others</MenuItem>
                    </Select>
                  </FormControl>
                ))}

              </div>



              <br />

              <Box display="flex" gap={2}>
                <div style={{ marginRight: "-40px" }}><strong>Guardian Name's:</strong></div>
                {students.map((student) => (
                  <Box key={student.person_id} display="flex" gap={2} width="100%" marginTop="10px">
                    {/* Family Name */}
                    <Box width="20%">
                      <div>Family Name: <span style={{ color: "red" }}>*</span></div>
                      <TextField
                        label="Enter Family Name"
                        required
                        fullWidth  // Ensures the input takes 100% width of its container
                        size="small"
                        value={student.guardian_family_name || ""}
                        onChange={(e) =>
                          setStudents((prevStudents) =>
                            prevStudents.map((s) =>
                              s.person_id === student.person_id
                                ? { ...s, guardian_family_name: e.target.value }
                                : s
                            )
                          )
                        }
                        onBlur={(e) => {
                          const updatedStudent = {
                            ...student,
                            guardian_family_name: e.target.value,
                          };
                          updateItem(updatedStudent); // Update the backend
                        }}
                      />
                    </Box>

                    {/* Given Name */}
                    <Box width="20%">
                      <div>Given Name: <span style={{ color: "red" }}>*</span></div>
                      <TextField
                        label="Enter Given Name"
                        required
                        fullWidth  // Ensures the input takes 100% width of its container
                        size="small"
                        value={student.guardian_given_name || ""}
                        onChange={(e) =>
                          setStudents((prevStudents) =>
                            prevStudents.map((s) =>
                              s.person_id === student.person_id
                                ? { ...s, guardian_given_name: e.target.value }
                                : s
                            )
                          )
                        }
                        onBlur={(e) => {
                          const updatedStudent = {
                            ...student,
                            guardian_given_name: e.target.value,
                          };
                          updateItem(updatedStudent); // Update the backend
                        }}
                      />
                    </Box>

                    {/* Middle Name */}
                    <Box width="20%">
                      <div>Middle Name: <span style={{ color: "red" }}>*</span></div>
                      <TextField
                        label="Enter Middle Name"
                        required
                        fullWidth  // Ensures the input takes 100% width of its container
                        size="small"
                        value={student.guardian_middle_name || ""}
                        onChange={(e) =>
                          setStudents((prevStudents) =>
                            prevStudents.map((s) =>
                              s.person_id === student.person_id
                                ? { ...s, guardian_middle_name: e.target.value }
                                : s
                            )
                          )
                        }
                        onBlur={(e) => {
                          const updatedStudent = {
                            ...student,
                            guardian_middle_name: e.target.value,
                          };
                          updateItem(updatedStudent); // Update the backend
                        }}
                      />
                    </Box>

                    {/* EXT */}
                    <Box width="20%">
                      <div>
                        EXT: <span style={{ color: "red" }}>*</span>
                      </div>
                      <FormControl sx={{ width: "100%" }} size="small">
                        <InputLabel id={`extension-label-${student.person_id}`}>EXT.</InputLabel>
                        <Select
                          labelId={`extension-label-${student.person_id}`}
                          id={`extension-select-${student.person_id}`}
                          value={student.guardian_ext || ""}
                          label="EXT."
                          onChange={(e) => {
                            const updatedExt = e.target.value;
                            const updatedStudent = { ...student, guardian_ext: updatedExt };

                            // Update local state
                            setStudents((prevStudents) =>
                              prevStudents.map((s) =>
                                s.person_id === student.person_id ? updatedStudent : s
                              )
                            );

                            // Immediately update backend
                            updateItem(updatedStudent);
                          }}
                        >
                          <MenuItem value="">None</MenuItem>
                          <MenuItem value="Jr.">Jr.</MenuItem>
                          <MenuItem value="Sr.">Sr.</MenuItem>
                          <MenuItem value="I">I</MenuItem>
                          <MenuItem value="II">II</MenuItem>
                          <MenuItem value="III">III</MenuItem>
                          <MenuItem value="IV">IV</MenuItem>
                          <MenuItem value="V">V</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>

                    {/* Nickname */}
                    <Box width="20%">
                      <div>Nick Name:</div>
                      <TextField
                        label="Enter Nickname"
                        fullWidth  // Ensures the input takes 100% width of its container
                        size="small"
                        value={student.guardian_nickname || ""}
                        onChange={(e) =>
                          setStudents((prevStudents) =>
                            prevStudents.map((s) =>
                              s.person_id === student.person_id
                                ? { ...s, guardian_nickname: e.target.value }
                                : s
                            )
                          )
                        }
                        onBlur={(e) => {
                          const updatedStudent = {
                            ...student,
                            guardian_nickname: e.target.value,
                          };
                          updateItem(updatedStudent); // Update the backend
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>



              {/* Contact Info Header */}
              <Typography
                style={{
                  fontSize: "20px",
                  color: "#6D2323",
                  fontWeight: "bold",
                  marginTop: "20px",
                  marginBottom: "10px"
                }}
              >
                Contact Information:
              </Typography>

              {/* Guardian's Address Row */}
              {students.map((student) => (
                <Box key={student.person_id} width="100%" marginTop="10px" display="flex" alignItems="center" gap={2}>
                  <div style={{ whiteSpace: "nowrap" }}>Guardian's Address:</div>
                  <TextField
                    label="Enter Guardian Address"
                    fullWidth
                    size="small"
                    value={student.guardian_address || ""}
                    onChange={(e) => {
                      const updatedStudent = {
                        ...student,
                        guardian_address: e.target.value,
                      };
                      setStudents((prev) =>
                        prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                      );
                    }}
                    onBlur={(e) => {
                      const updatedStudent = {
                        ...student,
                        guardian_address: e.target.value,
                      };
                      updateItem(updatedStudent); // Update the backend when the user finishes editing
                    }}
                  />
                </Box>
              ))}



              {/* Contact Number and Email Address */}
              {students.map((student) => (
                <Box key={student.person_id} display="flex" gap={2} width="100%" marginTop="10px">
                  <Box width="48%" display="flex" alignItems="center" gap={1} style={{ marginRight: "50px" }}>
                    <div style={{ whiteSpace: "nowrap", marginRight: "30px" }}>Contact Number:</div>+63
                    <TextField
                      label="9xxxxxxxxx"
                      fullWidth
                      size="small"
                      value={student.guardian_contact || ""}
                      onChange={(e) => {
                        const updatedStudent = {
                          ...student,
                          guardian_contact: e.target.value,
                        };
                        setStudents((prev) =>
                          prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                        );
                        updateItem(updatedStudent);
                      }}
                    />
                  </Box>

                  <Box width="48%" display="flex" alignItems="center" gap={1}>
                    <div style={{ whiteSpace: "nowrap" }}>Email Address:</div>
                    <TextField
                      label="Enter Email Address"
                      fullWidth
                      size="small"
                      value={student.guardian_email || ""}
                      onChange={(e) => {
                        const updatedStudent = {
                          ...student,
                          guardian_email: e.target.value,
                        };
                        setStudents((prev) =>
                          prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                        );
                        updateItem(updatedStudent);
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
            < br />
            <hr style={{ border: "1px solid #ccc", width: "100%" }} />
            <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold", }}>
              Family Annual Income:
            </Typography>

            {students.map((student) => (
              <FormControl fullWidth style={{ marginTop: '10px' }} size="small" required key={student.person_id}>
                <InputLabel id={`family-income-label-${student.person_id}`}>Family Annual Income</InputLabel>
                <Select
                  labelId={`family-income-label-${student.person_id}`}
                  id={`family-income-select-${student.person_id}`}
                  value={student.annual_income || ""}
                  label="Family Annual Income"
                  style={{ width: "100%", marginTop: "5px" }}
                  onChange={(e) => {
                    const updatedIncome = e.target.value;
                    const updatedStudent = { ...student, annual_income: updatedIncome };

                    // Update local state
                    setStudents((prevStudents) =>
                      prevStudents.map((s) =>
                        s.person_id === student.person_id ? updatedStudent : s
                      )
                    );

                    // Immediately update backend
                    updateItem(updatedStudent);
                  }}
                >
                  <MenuItem value="">--</MenuItem>
                  <MenuItem value="80,000 and below">80,000 and below</MenuItem>
                  <MenuItem value="80,000 to 135,000">80,000 above but not more than 135,000</MenuItem>
                  <MenuItem value="135,000 to 250,000">135,000 above but not more than 250,000</MenuItem>
                  <MenuItem value="250,000 to 500,000">250,000 above but not more than 500,000</MenuItem>
                  <MenuItem value="500,000 to 1,000,000">500,000 above but not more than 1,000,000</MenuItem>
                  <MenuItem value="1,000,000 and above">1,000,000 and above</MenuItem>
                </Select>
              </FormControl>
            ))}



            <Box display="flex" justifyContent="space-between" mt={4}>
              {/* Previous Page Button */}
              <Button
                variant="contained"
                component={Link}
                to="/applicant_personal_information"
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
                to="/applicant_educational_attainment"
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
          </Container>


        </form>

      </Container>
    </Box>
  );
};

export default ApplicantFamilyBackground;