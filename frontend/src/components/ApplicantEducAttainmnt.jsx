import React, { useState, useEffect } from "react";
import axios from "axios";
import {Button, Box, TextField, Container, Typography} from "@mui/material";
import { Link } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import SchoolIcon from "@mui/icons-material/School";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import InfoIcon from "@mui/icons-material/Info";
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { jwtDecode } from "jwt-decode";

const ApplicantEducationalAttainment = () => {
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
    axios
      .get("http://localhost:5000/person_table")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);




  useEffect(() => {
    const fetchPersonalInformation = async () => {
      if (!personID) return;

      try {
        const response = await axios.get(`http://localhost:5000/person_table`);
        const filtered = response.data.filter(item => String(item.person_id) === String(personID));
        setData(filtered);
      } catch (err) {
        console.error("Failed to fetch personal information:", err);
      }
    };

    fetchPersonalInformation();
  }, [personID]);

  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/person_table")
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error(err));
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

  const steps = [
    { label: 'Personal Information', icon: <PersonIcon />, path: '/applicant_personal_information' },
    { label: 'Family Background', icon: <FamilyRestroomIcon />, path: '/applicant_family_background' },
    { label: 'Educational Attainment', icon: <SchoolIcon />, path: '/applicant_educational_attainment' },
    { label: 'Health Medical Records', icon: <HealthAndSafetyIcon />, path: '/applicant_health_medical_records' },
    { label: 'Other Information', icon: <InfoIcon />, path: '/applicant_other_information' },
  ];


  const [activeStep, setActiveStep] = useState(2);
  const [clickedSteps, setClickedSteps] = useState(Array(steps.length).fill(false));

  const handleStepClick = (index) => {
    setActiveStep(index);
    const newClickedSteps = [...clickedSteps];
    newClickedSteps[index] = true;
    setClickedSteps(newClickedSteps);
  };

  useEffect(() => {
    fetchEducationalAttainment();
  }, []);

  const fetchEducationalAttainment = async () => {
    try {
      const result = await axios.get("http://localhost:5000/person_table");

    } catch (error) {
      console.error("Error fetching Educational Attainment:", error);
    }
  };



  return (
    <Box sx={{ height: 'calc(100vh - 120px)', overflowY: 'auto', paddingRight: 1, backgroundColor: 'transparent' }}>
    <Container>
      <Container>
        <h1 style={{ fontSize: "50px", fontWeight: "bold", textAlign: "center", color: "maroon", marginTop: "25px" }}>
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
        <Container maxWidth="100%" sx={{ backgroundColor: "#6D2323", color: "white", borderRadius: 2, border: "2px solid black", boxShadow: 3, padding: "4px" }}>
          <Box sx={{ width: "100%" }}>
            <Typography style={{ fontSize: "20px", padding: "10px", fontFamily: "Arial Black" }}>Step 3: Educational Attainment</Typography>
          </Box>
        </Container>
        <Container maxWidth="100%" sx={{ backgroundColor: "white", border: "2px solid black", padding: 4, borderRadius: 2, boxShadow: 3 }}>
          <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold" }}>
            Educational Attainment:
          </Typography>
          <hr style={{ border: "1px solid #ccc", width: "100%" }} />
          {students.map((student) => (
            <Box
              key={student.person_id}
              display="flex"
              gap={2}
              mt={2}
              flexWrap="nowrap" // Prevent wrapping
              justifyContent="space-between"
            >
              {/* School Level */}
              <Box flex={1}>
                <div>
                  School Level: <span style={{ color: "red" }}>*</span>
                </div>
                <FormControl fullWidth required size="small" sx={{ mt: 1 }}>
                  <InputLabel id={`schoolLevel-${student.person_id}`}>Select School Level</InputLabel>
                  <Select
                    labelId={`schoolLevel-${student.person_id}`}
                    id={`schoolLevel-select-${student.person_id}`}
                    value={student.schoolLevel || ""}
                    label="School Level"
                    onChange={(e) => {
                      const updatedStudent = { ...student, schoolLevel: e.target.value };
                      setStudents((prevStudents) =>
                        prevStudents.map((s) =>
                          s.person_id === student.person_id ? updatedStudent : s
                        )
                      );
                      updateItem(updatedStudent);
                    }}
                  >
                    <MenuItem value="">--</MenuItem>
                    <MenuItem value="High School/Junior High School">High School/Junior High School</MenuItem>
                    <MenuItem value="Senior High School">Senior High School</MenuItem>
                    <MenuItem value="Undergraduate">Undergraduate</MenuItem>
                    <MenuItem value="Graduate">Graduate</MenuItem>
                    <MenuItem value="ALS">ALS</MenuItem>
                    <MenuItem value="Vocational/Trade Course">Vocational/Trade Course</MenuItem>
                  </Select>
                </FormControl>
              </Box>

            {/* School Last Attended */}
<Box flex={1}>
  <div>
    School Last Attended: <span style={{ color: "red" }}>*</span>
  </div>
  <TextField
    label="Enter School Last Attended"
    required
    fullWidth
    size="small"
    sx={{ mt: 1 }}
    value={student.schoolLastAttended || ""}
    onChange={(e) => {
      const updatedStudent = { ...student, schoolLastAttended: e.target.value };
      setStudents((prev) =>
        prev.map((s) =>
          s.person_id === student.person_id ? updatedStudent : s
        )
      );
    }}
    onBlur={(e) => {
      const updatedStudent = { ...student, schoolLastAttended: e.target.value };
      updateItem(updatedStudent); // Update the backend when the user finishes editing
    }}
  />
</Box>

{/* School Address */}
<Box flex={1}>
  <div>
    School Address: <span style={{ color: "red" }}>*</span>
  </div>
  <TextField
    label="Enter School Address"
    required
    fullWidth
    size="small"
    sx={{ mt: 1 }}
    value={student.schoolAddress || ""}
    onChange={(e) => {
      const updatedStudent = { ...student, schoolAddress: e.target.value };
      setStudents((prev) =>
        prev.map((s) =>
          s.person_id === student.person_id ? updatedStudent : s
        )
      );
    }}
    onBlur={(e) => {
      const updatedStudent = { ...student, schoolAddress: e.target.value };
      updateItem(updatedStudent); // Update the backend when the user finishes editing
    }}
  />
</Box>

{/* Course/Program */}
<Box flex={1}>
  <div>Course/Program:</div>
  <TextField
    label="Enter Course/Program"
    fullWidth
    size="small"
    sx={{ mt: 1 }}
    value={student.courseProgram || ""}
    onChange={(e) => {
      const updatedStudent = { ...student, courseProgram: e.target.value };
      setStudents((prev) =>
        prev.map((s) =>
          s.person_id === student.person_id ? updatedStudent : s
        )
      );
    }}
    onBlur={(e) => {
      const updatedStudent = { ...student, courseProgram: e.target.value };
      updateItem(updatedStudent); // Update the backend when the user finishes editing
    }}
  />
</Box>
</Box>
          ))}

        {students.map((student) => (
  <Box key={student.person_id} display="flex" gap={3} width="100%" mt={2} flexWrap="wrap">
    {/* Honor */}
    <Box flex={1} minWidth={200}>
      <div>Honor:</div>
      <TextField
        label="Enter Honor"
        fullWidth
        size="small"
        sx={{ mt: 1 }}
        value={student.honor || ""}
        onChange={(e) => {
          const updatedStudent = { ...student, honor: e.target.value };
          setStudents((prev) =>
            prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
          );
        }}
        onBlur={(e) => {
          const updatedStudent = { ...student, honor: e.target.value };
          updateItem(updatedStudent); // Update the backend when the user finishes editing
        }}
      />
    </Box>

    {/* General Average */}
    <Box flex={1} minWidth={200}>
      <div>Gen Ave. <span style={{ color: "red" }}>*</span></div>
      <TextField
        label="Enter General Average"
        required
        fullWidth
        size="small"
        sx={{ mt: 1 }}
        value={student.generalAverage || ""}
        onChange={(e) => {
          const updatedStudent = { ...student, generalAverage: e.target.value };
          setStudents((prev) =>
            prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
          );
        }}
        onBlur={(e) => {
          const updatedStudent = { ...student, generalAverage: e.target.value };
          updateItem(updatedStudent); // Update the backend when the user finishes editing
        }}
      />
    </Box>

    {/* Year Graduated */}
    <Box flex={1} minWidth={200}>
      <div>Year Graduated: <span style={{ color: "red" }}>*</span></div>
      <TextField
        label="Enter Year Graduated"
        required
        fullWidth
        size="small"
        sx={{ mt: 1 }}
        value={student.yearGraduated || ""}
        onChange={(e) => {
          const updatedStudent = { ...student, yearGraduated: e.target.value };
          setStudents((prev) =>
            prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
          );
        }}
        onBlur={(e) => {
          const updatedStudent = { ...student, yearGraduated: e.target.value };
          updateItem(updatedStudent); // Update the backend when the user finishes editing
        }}
      />
    </Box>
  </Box>
))}




          < br />
          <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold" }}>
            Strand (For Senior High School)
          </Typography>
          <hr style={{ border: "1px solid #ccc", width: "100%" }} />
          {students.map((student) => (
            <FormControl
              key={student.person_id}
              fullWidth
              style={{ marginTop: '10px' }}
              size="small"
              required
            >
              <InputLabel id={`strand-label-${student.person_id}`}>Strand</InputLabel>
              <Select
                labelId={`strand-label-${student.person_id}`}
                id={`strand-select-${student.person_id}`}
                value={student.strand || ""}
                label="Strand"
                style={{ width: "100%", marginTop: "5px" }}
                onChange={(e) => {
                  const updatedStudent = {
                    ...student,
                    strand: e.target.value,
                  };
                  setStudents((prevStudents) =>
                    prevStudents.map((s) =>
                      s.person_id === student.person_id ? updatedStudent : s
                    )
                  );
                  updateItem(updatedStudent);
                }}
              >
                <MenuItem value="">--</MenuItem>
                <MenuItem value="Accountancy, Business and Management (ABM)">
                  Accountancy, Business and Management (ABM)
                </MenuItem>
                <MenuItem value="Humanities and Social Sciences (HUMSS)">
                  Humanities and Social Sciences (HUMSS)
                </MenuItem>
                <MenuItem value="Science, Technology, Engineering, and Mathematics (STEM)">
                  Science, Technology, Engineering, and Mathematics (STEM)
                </MenuItem>
                <MenuItem value="General Academic (GAS)">General Academic (GAS)</MenuItem>
                <MenuItem value="Home Economics (HE)">Home Economics (HE)</MenuItem>
                <MenuItem value="Information and Communications Technology (ICT)">
                  Information and Communications Technology (ICT)
                </MenuItem>
                <MenuItem value="Agri-Fishery Arts (AFA)">Agri-Fishery Arts (AFA)</MenuItem>
                <MenuItem value="Industrial Arts (IA)">Industrial Arts (IA)</MenuItem>
                <MenuItem value="Sports Track">Sports Track</MenuItem>
                <MenuItem value="Design and Arts Track">Design and Arts Track</MenuItem>
              </Select>
            </FormControl>
          ))}

          <Box display="flex" justifyContent="space-between" mt={4}>
            {/* Previous Page Button */}
            <Button
              variant="contained"
              component={Link}
              to="/applicant_family_background"
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
              to="/applicant_health_medical_records"
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

export default ApplicantEducationalAttainment;