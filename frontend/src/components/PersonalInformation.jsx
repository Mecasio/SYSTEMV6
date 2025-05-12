import React, { useState, useEffect } from "react";
import axios from "axios";
import {Button, Box, TextField, Container, Typography, FormControl, InputLabel, Select, MenuItem, ListSubheader, Avatar, Modal} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox, FormControlLabel } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import SchoolIcon from '@mui/icons-material/School';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import InfoIcon from '@mui/icons-material/Info';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const PersonalInfoForm = () => {
  // State for applicants
  const [applicants, setApplicants] = useState([]);
  const [personId, setPersonId] = useState(null);
  const navigate = useNavigate();
  // State for new applicant entry
  const [newApplicant, setNewApplicant] = useState({
    // Profile Background
    id: "",
    campus: "",
    academicProgram: "",
    classifiedAs: "",
    program: "",
    yearLevel: "",
    lastName: "",
    firstName: "",
    middleName: "",
    extension: "",
    nickname: "",
    height: "",
    weight: "",
    lrnNumber: "",
    gender: "",
    birthOfDate: "",
    age: "",
    birthPlace: "",
    languageDialectSpoken: "",
    citizenship: "",
    religion: "",
    civilStatus: "",
    tribeEthnicGroup: "",
    cellphoneNumber: "",
    emailAddress: "",
    telephoneNumber: "",
    facebookAccount: "",
    presentAddress: "",
    permanentAddress: "",
    street: "",
    barangay: "",
    zipCode: "",
    region: "",
    province: "",
    municipality: "",
    dswdHouseholdNumber: "",

  });

  const steps = [
    { label: 'Personal Information', icon: <PersonIcon />, path: '/person_information' },
    { label: 'Family Background', icon: <FamilyRestroomIcon />, path: '/family_background' },
    { label: 'Educational Attainment', icon: <SchoolIcon />, path: '/educational_attainment' },
    { label: 'Health Medical Records', icon: <HealthAndSafetyIcon />, path: '/health_medical_records' },
    { label: 'Other Information', icon: <InfoIcon />, path: '/other_information' },
  ];

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [filteredProvinces, setFilteredProvinces] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const handleRegionChange = (event) => {
    const regionCode = event.target.value;
    setSelectedRegion(regionCode);
    setSelectedProvince('');

    // Filter provinces by region code
    const provinces = provinceData.filter(province => province.regCode === regionCode);
    setFilteredProvinces(provinces);

    // Filter cities by all province codes in this region
    const cityList = cityMunData.filter(city =>
      provinces.some(province => province.provCode === city.provCode)
    );
    setFilteredCities(cityList);
  };

  const handleProvinceChange = (event) => {
    const provCode = event.target.value;
    setSelectedProvince(provCode);

    const cities = cityMunData.filter(city => city.provCode === provCode);
    setFilteredCities(cities);
  };

  const [activeStep, setActiveStep] = useState(0);
  const [clickedSteps, setClickedSteps] = useState(Array(steps.length).fill(false));
  const [sameAsPresent, setSameAsPresent] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isLrnNA, setIsLrnNA] = useState(false);
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isChecked, setIsChecked] = useState(false); // State for checkbox
  const [pwdType, setPwdType] = useState(''); // State for dropdown
  const [id, setId] = useState(''); // State for ID textfield

  // Handle checkbox change
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  // Handle dropdown change
  const handlePwdChange = (event) => {
    setPwdType(event.target.value);
  };

  // Handle ID textfield change
  const handleIdChange = (event) => {
    setId(event.target.value);
  };


  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
    setPreview(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (validTypes.includes(file.type)) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreview(null);
      alert('Invalid file type. Please select a JPEG or PNG file.');
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    setUploadedImage(preview); // ✅ Set image to show in outer box
    alert('Upload successful!');
    handleClose();
  };

  // Handler for N/A checkbox
  const handleLrnCheck = (event) => {
    const checked = event.target.checked;
    setIsLrnNA(checked);
    if (checked) {
      setNewApplicant({ ...newApplicant, lrnNumber: "" }); // Clear LRN
    }
  };

  const handleStepClick = (index) => {
    setActiveStep(index);
    const newClickedSteps = [...clickedSteps];
    newClickedSteps[index] = true;
    setClickedSteps(newClickedSteps);
  };

  const [editingApplicantId, setEditingApplicantId] = useState(null);

  useEffect(() => {
    fetchApplicants();
  }, []);

  useEffect(() => {
    if (sameAsPresent) {
      setNewApplicant((prev) => ({
        ...prev,
        permanentAddress: prev.presentAddress || "",
        barangay: prev.barangay || "",
        zipCode: prev.zipCode || "",
        region: prev.region || "",
        province: prev.province || "",
        municipality: prev.municipality || "",
        dswdHouseholdNumber: prev.dswdHouseholdNumber || "",
      }));
    }
  }, [sameAsPresent, newApplicant.presentAddress, newApplicant.barangay, newApplicant.zipCode, newApplicant.region, newApplicant.province, newApplicant.municipality, newApplicant.dswdHouseholdNumber]);

  useEffect(() => {
    const storedPersonId = localStorage.getItem('person_id');
    if (storedPersonId) {
        setPersonId(storedPersonId);
    } else {
        console.error('Person ID not found');
        navigate('/register');
    }
  }, []);

  console.log(personId);
  // Fetch applicants from API  
  const fetchApplicants = async () => {
    try {
      const result = await axios.get("http://localhost:5000/applicant_table");
      setApplicants(result.data);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    }
  };

  // Add or update an applicant
  const addOrUpdateApplicant = async () => {
    try {
      if (editingApplicantId) {
        // Update existing applicant
        await axios.put(
          `http://localhost:5000/applicant_table/${editingApplicantId}`,
          newApplicant
        );
      } else {
        // Add new applicant
        if (!newApplicant.firstName) return;
        await axios.post("http://localhost:5000/applicant_table", newApplicant);
      }
      setEditingApplicantId(null);
      fetchApplicants();
      resetNewApplicant();
    } catch (error) {
      console.error("Failed to add or update applicant:", error);
    }
  };

  // Reset form inputs
  const resetNewApplicant = () => {
    setNewApplicant({
      id: "",
      campus: "",
      academicProgram: "",
      classifiedAs: "",
      program: "",
      yearLevel: "",
      lastName: "",
      firstName: "",
      middleName: "",
      extension: "",
      nickname: "",
      height: "",
      weight: "",
      lrnNumber: "",
      gender: "",
      birthOfDate: "",
      age: "",
      birthPlace: "",
      languageDialectSpoken: "",
      citizenship: "",
      religion: "",
      civilStatus: "",
      tribeEthnicGroup: "",
      cellphoneNumber: "",
      emailAddress: "",
      telephoneNumber: "",
      facebookAccount: "",
      presentAddress: "",
      permanentAddress: "",
      street: "",
      barangay: "",
      zipCode: "",
      region: "",
      province: "",
      municipality: "",
      dswdHouseholdNumber: "",

    });
  };

  return (

    <Container>
      <h1 style={{ textAlign: "center", color: "maroon", marginTop: "75px" }}>APPLICANT FORM</h1>
      <div style={{ textAlign: "Center", }}>Complete the applicant form to secure your place for the upcoming academic year at EARIST.</div>
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
      <form>
        <Container maxWidth="100%" sx={{ backgroundColor: "#6D2323", color: "white", borderRadius: 2, boxShadow: 3, padding: "4px", }}>
          <Box sx={{ width: "100%", }}>
            <Typography style={{ fontSize: "20px", padding: "10px", fontFamily: "Arial Black" }}>Step 1: Personal Information</Typography>
          </Box>
        </Container>
        <Container maxWidth="100%" sx={{ backgroundColor: "white", padding: 4, borderRadius: 2, boxShadow: 3 }}>


          <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold" }}>Personal Information</Typography>
          <hr style={{ color: "yellow" }} className="my-4 border-t border-red-300" />




          <Box display="flex" alignItems="center" mb={2}>
            <Typography style={{ fontSize: "13px", marginRight: "10px", minWidth: "150px" }}>
              Campus: <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormControl sx={{ width: "100%" }} size="small">
              <InputLabel id="campus-label">Campus (Manila/Cavite)</InputLabel>
              <Select
                labelId="campus-label"
                id="campus-select"
                value={newApplicant.campus}
                label="Campus (Manila/Cavite)"
                onChange={(e) =>
                  setNewApplicant({ ...newApplicant, campus: e.target.value })
                }
              >
                <MenuItem value="EARIST MANILA">MANILA</MenuItem>
                <MenuItem value="EARIST CAVITE">CAVITE</MenuItem>
              </Select>
            </FormControl>
          </Box>


          <Box display="flex" alignItems="center" mb={2}>
            <Typography style={{ fontSize: "13px", marginRight: "10px", minWidth: "150px" }}>
              Academic Program: <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormControl sx={{ width: "100%" }} size="small" required>
              <InputLabel id="academic-program-label">Select Academic Program</InputLabel>
              <Select
                labelId="academic-program-label"
                id="academic-program-select"
                value={newApplicant.academicProgram || ""}
                label="Select Academic Program"
                onChange={(e) =>
                  setNewApplicant({ ...newApplicant, academicProgram: e.target.value })
                }
              >
                <MenuItem value="Techvoc">Techvoc</MenuItem>
                <MenuItem value="Undergraduate">Undergraduate</MenuItem>
                <MenuItem value="Graduate">Graduate</MenuItem>
              </Select>
            </FormControl>

          </Box>


          <Box display="flex" alignItems="center" mb={2}>
            <Typography style={{ fontSize: "13px", marginRight: "10px", minWidth: "150px" }}>
              Classified As: <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormControl sx={{ width: "100%" }} size="small" required>
              <InputLabel id="classified-as-label">Select Classification</InputLabel>
              <Select
                labelId="classified-as-label"
                id="classified-as-select"
                value={newApplicant.classifiedAs || ""}
                label="Select Classification"
                onChange={(e) => setNewApplicant({ ...newApplicant, classifiedAs: e.target.value })}
              >
                <MenuItem value="Freshman">Freshman (First Year)</MenuItem>
                <MenuItem value="Transferee">Transferee</MenuItem>

                <MenuItem value="Returnee">Returnee</MenuItem>
                <MenuItem value="Shiftee">Shiftee</MenuItem>

                <MenuItem value="Foreign Student">Foreign Student</MenuItem>

              </Select>
            </FormControl>
          </Box>



          <Box display="flex" mb={2}>
            {/* Left Side: Program and Year Level Inputs */}
            <Box flex={1}>
              {/* Program Input */}
              <Box display="flex" alignItems="center" mb={2}>
                <Typography style={{ fontSize: "13px", marginRight: "10px", minWidth: "150px" }}>
                  Program: <span style={{ color: "red" }}>*</span>
                </Typography>
                <FormControl sx={{ width: "85%" }} size="small">
                  <InputLabel id="program-label">Select Program</InputLabel>
                  <Select
                    labelId="program-label"
                    id="program-select"
                    value={newApplicant.program}
                    label="Select Program"
                    onChange={(e) =>
                      setNewApplicant({ ...newApplicant, program: e.target.value })
                    }
                  >
                    <ListSubheader style={{ textAlign: "Center", color: "maroon" }}>COLLEGE OF ARCHITECTURE AND FINE ARTS</ListSubheader>
                    <MenuItem value="BS ARCHI.">Bachelor of Science in Architecture (BS ARCHI.)</MenuItem>
                    <MenuItem value="BSID">Bachelor of Science in Interior Design (BSID)</MenuItem>
                    <MenuItem value="BFA - Painting">Bachelor in Fine Arts (BFA) - Painting</MenuItem>
                    <MenuItem value="BFA - Visual Communication">Bachelor in Fine Arts (BFA) - Visual Communication</MenuItem>

                    <ListSubheader style={{ textAlign: "Center", color: "maroon" }}>COLLEGE OF ARTS AND SCIENCES</ListSubheader>
                    <MenuItem value="BSAP">Bachelor of Science in Applied Physics w/ Comp. Sci. Emphasis (BSAP)</MenuItem>
                    <MenuItem value="BSCS">Bachelor of Science in Computer Science (BSCS)</MenuItem>
                    <MenuItem value="BS INFO. TECH.">Bachelor of Science in Information Technology (BS INFO. TECH.)</MenuItem>
                    <MenuItem value="BSPSYCH">Bachelor of Science in Psychology (BSPSYCH)</MenuItem>
                    <MenuItem value="BSMATH">Bachelor of Science in Mathematics (BSMATH)</MenuItem>

                    <ListSubheader style={{ textAlign: "Center", color: "maroon" }}>COLLEGE OF BUSINESS ADMINISTRATION</ListSubheader>
                    <MenuItem value="BSBA - Marketing">BSBA - Marketing Management</MenuItem>
                    <MenuItem value="BSBA - HRDM">BSBA - Human Resource Dev't Management (HRDM)</MenuItem>
                    <MenuItem value="BSEM">Bachelor of Science in Entrepreneurship (BSEM)</MenuItem>
                    <MenuItem value="BSOA">Bachelor of Science in Office Administration (BSOA)</MenuItem>

                    <ListSubheader style={{ textAlign: "Center", color: "maroon" }}>COLLEGE OF EDUCATIONS</ListSubheader>
                    <MenuItem value="BSE - Science">Bachelor in Secondary Education - Science</MenuItem>
                    <MenuItem value="BSE - Mathematics">Bachelor in Secondary Education - Mathematics</MenuItem>
                    <MenuItem value="BSE - Filipino">Bachelor in Secondary Education - Filipino</MenuItem>
                    <MenuItem value="BSNEd">Bachelor in Special Needs Education (BSNEd)</MenuItem>
                    <MenuItem value="BTLE - Home Economics">BTLE - Home Economics</MenuItem>
                    <MenuItem value="BTLE - Industrial Arts">BTLE - Industrial Arts</MenuItem>
                    <MenuItem value="TCP">Professional Education / Subjects 18 units (TCP)</MenuItem>

                    <ListSubheader style={{ textAlign: "Center", color: "maroon" }}>COLLEGE OF ENGINEERING</ListSubheader>
                    <MenuItem value="BSCHE">Bachelor of Science in Chemical Engineering (BSCHE)</MenuItem>
                    <MenuItem value="BSCE">Bachelor of Science in Civil Engineering (BSCE)</MenuItem>
                    <MenuItem value="BSEE">Bachelor of Science in Electrical Engineering (BSEE)</MenuItem>
                    <MenuItem value="BSECE">Bachelor of Science in Electronics and Communication Eng (BSECE)</MenuItem>
                    <MenuItem value="BSME">Bachelor of Science in Mechanical Engineering (BSME)</MenuItem>
                    <MenuItem value="BSCOE">Bachelor of Science in Computer Engineering (BSCOE)</MenuItem>

                    <ListSubheader style={{ textAlign: "Center", color: "maroon" }}>COLLEGE OF HOSPITALITY MANAGEMENT (CHTM)</ListSubheader>
                    <MenuItem value="BST">Bachelor of Science in Tourism Management (BST)</MenuItem>
                    <MenuItem value="BSHM">Bachelor of Science in Hospitality Management (BSHM)</MenuItem>

                    <ListSubheader style={{ textAlign: "Center", color: "maroon" }}>COLLEGE OF INDUSTRIAL TECHNOLOGY</ListSubheader>
                    <MenuItem value="BSIT - Automotive Technology">BSIT - Automotive Technology</MenuItem>
                    <MenuItem value="BSIT - Electrical Technology">BSIT - Electrical Technology</MenuItem>
                    <MenuItem value="BSIT - Electronics Technology">BSIT - Electronics Technology</MenuItem>
                    <MenuItem value="BSIT - Food Technology">BSIT - Food Technology</MenuItem>
                    <MenuItem value="BSIT - Fashion and Apparel">BSIT - Fashion and Apparel Technology</MenuItem>
                    <MenuItem value="BSIT - Industrial Chemistry">BSIT - Industrial Chemistry</MenuItem>
                    <MenuItem value="BSIT - Drafting Technology">BSIT - Drafting Technology</MenuItem>
                    <MenuItem value="BSIT - Machine Shop">BSIT - Machine Shop Technology</MenuItem>
                    <MenuItem value="BSIT - Refrigeration and Air Conditioning">BSIT - Refrigeration and Air Conditioning</MenuItem>

                    <ListSubheader style={{ textAlign: "Center", color: "maroon" }}>COLLEGE OF PUBLIC ADMINISTRATION AND CRIMINOLOGY</ListSubheader>
                    <MenuItem value="BPA">Bachelor in Public Administration (BPA)</MenuItem>
                    <MenuItem value="BSCRIM">Bachelor of Science in Criminology (BSCRIM)</MenuItem>


                  </Select>
                </FormControl>
              </Box>
              < br />
              < br />
              < br />



              {/* Year Level Dropdown */}
              <Box display="flex" alignItems="center" mb={2}>
                <Typography style={{ fontSize: "15px", marginRight: "10px", minWidth: "150px" }}>
                  Year Level: <span style={{ color: "red" }}>*</span>
                </Typography>
                <FormControl sx={{ width: "85%" }} size="small">
                  <InputLabel id="year-level-label">Select Year Level</InputLabel>
                  <Select
                    labelId="year-level-label"
                    id="year-level-select"
                    value={newApplicant.yearLevel}
                    label="Select Year Level"
                    onChange={(e) =>
                      setNewApplicant({ ...newApplicant, yearLevel: e.target.value })
                    }
                  >
                    <MenuItem value="First Year">First Year</MenuItem>
                    <MenuItem value="Second Year">Second Year</MenuItem>
                    <MenuItem value="Third Year">Third Year</MenuItem>
                    <MenuItem value="Fourth Year">Fourth Year</MenuItem>
                    <MenuItem value="Fifth Year">Fifth Year</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Right Side: Image Upload */}
            <Box
              sx={{
                textAlign: "center",
                border: "1px solid black",
                width: "5.08cm", // Set width to 2 inches
                height: "5.08cm", // Set height to 2 inches
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                ml: 2,
                position: "relative",
              }}
            >
              <Box
                sx={{
                  width: "100%", // Use full width of the parent container
                  height: "100%", // Use full height of the parent container
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover", // Ensures the image covers the box without distortion
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "white", // Optional: Background color
                    }}
                  />
                )}
              </Box>
            </Box>

          </Box>


          <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold" }}>Person Details:</Typography>
          <hr style={{ border: "1px solid #ccc", width: "100%" }} />


          <Box display="flex" gap={2} width="100%" >
            <Typography style={{ fontSize: "15px", marginRight: "10px", minWidth: "150px", textAlign: "Center", marginTop: "10px" }}>
              Name: <span style={{ color: "red" }}>*</span>
            </Typography>

            {/* Last Name */}
            <Box width="19%">

              <TextField
                label="Enter Last Name"
                required
                sx={{ width: "85%" }}
                size="small"
                value={newApplicant.lastName || ""}
                onChange={(e) =>
                  setNewApplicant({ ...newApplicant, lastName: e.target.value })
                }
              />
              Family Name
            </Box>

            {/* First Name */}
            <Box width="19%">

              <TextField
                label="Enter First Name"
                required
                sx={{ width: "85%" }}
                size="small"
                value={newApplicant.firstName || ""}
                onChange={(e) =>
                  setNewApplicant({ ...newApplicant, firstName: e.target.value })
                }
              />
              GIVEN NAME
            </Box>

            {/* Middle Name */}
            <Box width="19%">

              <TextField
                label="Enter Middle Name"
                required
                sx={{ width: "85%" }}
                size="small"
                value={newApplicant.middleName || ""}
                onChange={(e) =>
                  setNewApplicant({ ...newApplicant, middleName: e.target.value })
                }
              />
              MIDDLE NAME
            </Box>

            {/* Extension */}
            <Box width="10%">
              <FormControl sx={{ width: "85%" }} size="small">
                <InputLabel id="extension-label">EXT.</InputLabel>
                <Select
                  labelId="extension-label"
                  id="extension-select"
                  value={newApplicant.extension || ""}
                  label="EXT."
                  onChange={(e) =>
                    setNewApplicant({ ...newApplicant, extension: e.target.value })
                  }
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
            <Box width="19%">

              <TextField
                label="Enter Nickname"
                sx={{ width: "85%" }}
                size="small"
                value={newApplicant.nickname || ""}
                onChange={(e) =>
                  setNewApplicant({ ...newApplicant, nickname: e.target.value })
                }
              />
              NICK NAME
            </Box>
          </Box>
          < br />


          <Box display="flex" alignItems="center" mb={2}>
            <Typography style={{ fontSize: "12px", marginRight: "20px" }}>
              Height:
            </Typography>
            <TextField

              required
              value={newApplicant.height || ""}
              onChange={(e) => setNewApplicant({ ...newApplicant, height: e.target.value })}
              sx={{ width: "6%", marginRight: "10px" }}
              size="small"
            />
            cm.
            <span style={{ marginRight: "20px" }}>
            </span>
            <Typography style={{ fontSize: "12px", marginRight: "20px" }}>
              Weight:
            </Typography>
            <TextField

              required
              value={newApplicant.weight || ""}
              onChange={(e) => setNewApplicant({ ...newApplicant, weight: e.target.value })}
              sx={{ width: "6%", marginRight: "10px" }}
              size="small"
            />
            kg
          </Box>







          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Typography style={{ fontSize: "13px", marginRight: "10px" }}>
              Learning Reference Number:
            </Typography>

            <TextField
              label="Enter your LRN"
              required
              value={newApplicant.lrnNumber || ""}
              onChange={(e) =>
                setNewApplicant({ ...newApplicant, lrnNumber: e.target.value })
              }
              sx={{ width: "15%" }}  // Adjusted width to fit on one line
              size="small"
              disabled={isLrnNA} // Disable when checkbox is checked
            />

            <FormControlLabel
              control={<Checkbox checked={isLrnNA} onChange={handleLrnCheck} />}
              label="N/A"
            />

            {/* Gender */}
            <Typography style={{ fontSize: "13px", marginRight: "10px" }}>
              Gender: <span style={{ color: "red" }}>*</span>
            </Typography>

            <FormControl sx={{ width: "15%" }} size="small">
              <InputLabel id="gender-label">Select Gender</InputLabel>
              <Select
                labelId="gender-label"
                id="gender-select"
                value={newApplicant.gender || ""}
                label="Select Gender"
                onChange={(e) =>
                  setNewApplicant({ ...newApplicant, gender: e.target.value })
                }
              >
                <MenuItem value="--">--</MenuItem>
                <MenuItem value="MALE">MALE</MenuItem>
                <MenuItem value="FEMALE">FEMALE</MenuItem>
              </Select>
            </FormControl>

            {/* PWD */}
            <FormControlLabel
              control={<Checkbox checked={isChecked} onChange={handleCheckboxChange} />}
              label="PWD"
            />

            {isChecked && (
              <Box display="flex" gap={2}>
                {/* Dropdown for PWD Type */}
                <FormControl variant="outlined" sx={{ width: "50%" }} size="small">
                  <InputLabel>Choose PWD Type</InputLabel>
                  <Select
                    value={pwdType}
                    onChange={handlePwdChange}
                    label="Choose PWD Type"
                  >
                    <MenuItem value="">--</MenuItem>
                    <MenuItem value="blindness">Blindness</MenuItem>
                    <MenuItem value="low_vision">Low-vision</MenuItem>
                    <MenuItem value="leprosy_cured">Leprosy Cured persons</MenuItem>
                    <MenuItem value="hearing_impairment">Hearing Impairment</MenuItem>
                    <MenuItem value="locomotor_disability">Locomotor Disability</MenuItem>
                    <MenuItem value="dwarfism">Dwarfism</MenuItem>
                    <MenuItem value="intellectual_disability">Intellectual Disability</MenuItem>
                    <MenuItem value="mental_illness">Mental Illness</MenuItem>
                    <MenuItem value="autism_spectrum">Autism Spectrum Disorder</MenuItem>
                    <MenuItem value="cerebral_palsy">Cerebral Palsy</MenuItem>
                    <MenuItem value="muscular_dystrophy">Muscular Dystrophy</MenuItem>
                    <MenuItem value="chronic_neuro">Chronic Neurological conditions</MenuItem>
                    <MenuItem value="specific_learning">Specific Learning Disabilities</MenuItem>
                    <MenuItem value="multiple_sclerosis">Multiple Sclerosis</MenuItem>
                    <MenuItem value="speech_language">Speech and Language disability</MenuItem>
                    <MenuItem value="thalassemia">Thalassemia</MenuItem>
                    <MenuItem value="hemophilia">Hemophilia</MenuItem>
                    <MenuItem value="sickle_cell">Sickle cell disease</MenuItem>
                    <MenuItem value="multiple_disabilities">Multiple Disabilities including</MenuItem>
                  </Select>
                </FormControl>

                {/* ID Textfield */}
                <TextField
                  label="PWD ID"
                  variant="outlined"
                  size="small"
                  value={id}
                  onChange={handleIdChange}
                  sx={{ width: "50%" }}
                />
              </Box>
            )}
          </Box>



          <Box display="flex" gap={2} mb={2}>
            {/* Birthdate Field */}

            <Typography style={{ fontSize: "12px", marginBottom: "5px" }}>
              Birth of Date:
            </Typography>
            <TextField
              label="Select Birthdate"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              required
              style={{ width: "35%", marginRight: "50px" }}
              value={newApplicant.birthOfDate || ""}
              onChange={(e) =>
                setNewApplicant({ ...newApplicant, birthOfDate: e.target.value })
              }
            />

            <Typography style={{ fontSize: "12px", marginRight: "120px" }}>
              Age:
            </Typography>
            <TextField
              label="Enter your Age"
              required
              style={{ width: "37%" }}
              size="small"
              value={newApplicant.age || ""}
              onChange={(e) =>
                setNewApplicant({ ...newApplicant, age: e.target.value })
              }
            />

          </Box>


          <Box display="flex" alignItems="center" mb={2}>
            <Typography style={{ fontSize: "12px", marginRight: "20px" }}>
              Birth Place:
            </Typography>
            <TextField
              label="Enter your Birth Place"
              required
              value={newApplicant.birthPlace || ""}
              onChange={(e) => setNewApplicant({ ...newApplicant, birthPlace: e.target.value })}
              sx={{ width: "36%", marginRight: "50px" }}
              size="small"
            />

            <Typography style={{ fontSize: "12px", marginRight: "20px" }}>
              Language Dialect Spoken:
            </Typography>
            <TextField
              label="Enter your Language Dialect Spoken"
              required
              value={newApplicant.languageDialectSpoken || ""}
              onChange={(e) => setNewApplicant({ ...newApplicant, languageDialectSpoken: e.target.value })}
              sx={{ width: "37%" }}
              size="small"
            />
          </Box>


          <Box display="flex" alignItems="center" mb={2}>
            <Typography style={{ fontSize: "12px", marginRight: "15px" }}>
              Citizenship:
            </Typography>
            <FormControl sx={{ width: "36%", marginRight: "50px" }} size="small" required>
              <InputLabel id="citizenship-label">Citizenship</InputLabel>
              <Select
                labelId="citizenship-label"
                value={newApplicant.citizenship || ""}
                label="Citizenship"
                sx={{ width: "102%", marginRight: "50px" }}
                onChange={(e) =>
                  setNewApplicant({ ...newApplicant, citizenship: e.target.value })
                }
              >
                <MenuItem value="">- Select Citizenship -</MenuItem>
                <MenuItem value="AFGHAN">AFGHAN</MenuItem>
                <MenuItem value="ALBANIAN">ALBANIAN</MenuItem>
                <MenuItem value="ARAB">ARAB</MenuItem>
                <MenuItem value="ARGENTINIAN">ARGENTINIAN</MenuItem>
                <MenuItem value="AUSTRALIAN">AUSTRALIAN</MenuItem>
                <MenuItem value="AUSTRIAN">AUSTRIAN</MenuItem>
                <MenuItem value="BELGIAN">BELGIAN</MenuItem>
                <MenuItem value="BANGLADESHI">BANGLADESHI</MenuItem>
                <MenuItem value="BAHAMIAN">BAHAMIAN</MenuItem>
                <MenuItem value="BHUTANESE">BHUTANESE</MenuItem>
                <MenuItem value="BERMUDAN">BERMUDAN</MenuItem>
                <MenuItem value="BOLIVIAN">BOLIVIAN</MenuItem>
                <MenuItem value="BRAZILIAN">BRAZILIAN</MenuItem>
                <MenuItem value="BRUNEI">BRUNEI</MenuItem>
                <MenuItem value="BOTSWANIAN">BOTSWANIAN</MenuItem>
                <MenuItem value="CANADIAN">CANADIAN</MenuItem>
                <MenuItem value="CHILE">CHILE</MenuItem>
                <MenuItem value="CHINESE">CHINESE</MenuItem>
                <MenuItem value="COLOMBIAN">COLOMBIAN</MenuItem>
                <MenuItem value="COSTA RICAN">COSTA RICAN</MenuItem>
                <MenuItem value="CUBAN">CUBAN</MenuItem>
                <MenuItem value="CYPRIOT">CYPRIOT</MenuItem>
                <MenuItem value="CZECH">CZECH</MenuItem>
                <MenuItem value="DANISH">DANISH</MenuItem>
                <MenuItem value="DOMINICAN">DOMINICAN</MenuItem>
                <MenuItem value="ALGERIAN">ALGERIAN</MenuItem>
                <MenuItem value="EGYPTIAN">EGYPTIAN</MenuItem>
                <MenuItem value="SPANISH">SPANISH</MenuItem>
                <MenuItem value="ESTONIAN">ESTONIAN</MenuItem>
                <MenuItem value="ETHIOPIAN">ETHIOPIAN</MenuItem>
                <MenuItem value="FIJI">FIJI</MenuItem>
                <MenuItem value="FILIPINO">FILIPINO</MenuItem>
                <MenuItem value="FINISH">FINISH</MenuItem>
                <MenuItem value="FRENCH">FRENCH</MenuItem>
                <MenuItem value="BRITISH">BRITISH</MenuItem>
                <MenuItem value="GERMAN">GERMAN</MenuItem>
                <MenuItem value="GHANAIAN">GHANAIAN</MenuItem>
                <MenuItem value="GREEK">GREEK</MenuItem>
                <MenuItem value="GUAMANIAN">GUAMANIAN</MenuItem>
                <MenuItem value="GUATEMALAN">GUATEMALAN</MenuItem>
                <MenuItem value="HONG KONG">HONG KONG</MenuItem>
                <MenuItem value="CROATIAN">CROATIAN</MenuItem>
                <MenuItem value="HAITIAN">HAITIAN</MenuItem>
                <MenuItem value="HUNGARIAN">HUNGARIAN</MenuItem>
                <MenuItem value="INDONESIAN">INDONESIAN</MenuItem>
                <MenuItem value="INDIAN">INDIAN</MenuItem>
                <MenuItem value="IRANIAN">IRANIAN</MenuItem>
                <MenuItem value="IRAQI">IRAQI</MenuItem>
                <MenuItem value="IRISH">IRISH</MenuItem>
                <MenuItem value="ICELANDER">ICELANDER</MenuItem>
                <MenuItem value="ISRAELI">ISRAELI</MenuItem>
                <MenuItem value="ITALIAN">ITALIAN</MenuItem>
                <MenuItem value="JAMAICAN">JAMAICAN</MenuItem>
                <MenuItem value="JORDANIAN">JORDANIAN</MenuItem>
                <MenuItem value="JAPANESE">JAPANESE</MenuItem>
                <MenuItem value="CAMBODIAN">CAMBODIAN</MenuItem>
                <MenuItem value="KOREAN">KOREAN</MenuItem>
                <MenuItem value="KUWAITI">KUWAITI</MenuItem>
                <MenuItem value="KENYAN">KENYAN</MenuItem>
                <MenuItem value="LAOTIAN">LAOTIAN</MenuItem>
                <MenuItem value="LEBANESE">LEBANESE</MenuItem>
                <MenuItem value="LIBYAN">LIBYAN</MenuItem>
                <MenuItem value="LUXEMBURGER">LUXEMBURGER</MenuItem>
                <MenuItem value="MALAYSIAN">MALAYSIAN</MenuItem>
                <MenuItem value="MOROCCAN">MOROCCAN</MenuItem>
                <MenuItem value="MEXICAN">MEXICAN</MenuItem>
                <MenuItem value="BURMESE">BURMESE</MenuItem>
                <MenuItem value="MYANMAR">MYANMAR</MenuItem>
                <MenuItem value="NIGERIAN">NIGERIAN</MenuItem>
                <MenuItem value="NOT INDICATED">NOT INDICATED</MenuItem>
                <MenuItem value="DUTCH">DUTCH</MenuItem>
                <MenuItem value="NORWEGIAN">NORWEGIAN</MenuItem>
                <MenuItem value="NEPALI">NEPALI</MenuItem>
                <MenuItem value="NEW ZEALANDER">NEW ZEALANDER</MenuItem>
                <MenuItem value="OMANI">OMANI</MenuItem>
                <MenuItem value="PAKISTANI">PAKISTANI</MenuItem>
                <MenuItem value="PANAMANIAN">PANAMANIAN</MenuItem>
                <MenuItem value="PERUVIAN">PERUVIAN</MenuItem>
                <MenuItem value="PAPUAN">PAPUAN</MenuItem>
                <MenuItem value="POLISH">POLISH</MenuItem>
                <MenuItem value="PUERTO RICAN">PUERTO RICAN</MenuItem>
                <MenuItem value="PORTUGUESE">PORTUGUESE</MenuItem>
                <MenuItem value="PARAGUAYAN">PARAGUAYAN</MenuItem>
                <MenuItem value="PALESTINIAN">PALESTINIAN</MenuItem>
                <MenuItem value="QATARI">QATARI</MenuItem>
                <MenuItem value="ROMANIAN">ROMANIAN</MenuItem>
                <MenuItem value="RUSSIAN">RUSSIAN</MenuItem>
                <MenuItem value="RWANDAN">RWANDAN</MenuItem>
                <MenuItem value="SAUDI ARABIAN">SAUDI ARABIAN</MenuItem>
                <MenuItem value="SUDANESE">SUDANESE</MenuItem>
                <MenuItem value="SINGAPOREAN">SINGAPOREAN</MenuItem>
                <MenuItem value="SRI LANKAN">SRI LANKAN</MenuItem>
                <MenuItem value="EL SALVADORIAN">EL SALVADORIAN</MenuItem>
                <MenuItem value="SOMALIAN">SOMALIAN</MenuItem>
                <MenuItem value="SLOVAK">SLOVAK</MenuItem>
                <MenuItem value="SWEDISH">SWEDISH</MenuItem>
                <MenuItem value="SWISS">SWISS</MenuItem>
                <MenuItem value="SYRIAN">SYRIAN</MenuItem>
                <MenuItem value="THAI">THAI</MenuItem>
                <MenuItem value="TRINIDAD AND TOBAGO">TRINIDAD AND TOBAGO</MenuItem>
                <MenuItem value="TUNISIAN">TUNISIAN</MenuItem>
                <MenuItem value="TURKISH">TURKISH</MenuItem>
                <MenuItem value="TAIWANESE">TAIWANESE</MenuItem>
                <MenuItem value="UKRAINIAN">UKRAINIAN</MenuItem>
                <MenuItem value="URUGUAYAN">URUGUAYAN</MenuItem>
                <MenuItem value="UNITED STATES">UNITED STATES</MenuItem>
                <MenuItem value="VENEZUELAN">VENEZUELAN</MenuItem>
                <MenuItem value="VIRGIN ISLANDS">VIRGIN ISLANDS</MenuItem>
                <MenuItem value="VIETNAMESE">VIETNAMESE</MenuItem>
                <MenuItem value="YEMENI">YEMENI</MenuItem>
                <MenuItem value="YUGOSLAVIAN">YUGOSLAVIAN</MenuItem>
                <MenuItem value="SOUTH AFRICAN">SOUTH AFRICAN</MenuItem>
                <MenuItem value="ZAIREAN">ZAIREAN</MenuItem>
                <MenuItem value="ZIMBABWEAN">ZIMBABWEAN</MenuItem>
                <MenuItem value="Others">Others</MenuItem>
              </Select>
            </FormControl>




            <Typography style={{ fontSize: "12px", marginRight: "120px", textAlign: "Center" }}>
              Religion:
            </Typography>
            <FormControl sx={{ width: "38%" }} size="small">
              <InputLabel id="religion-label">Select Religion</InputLabel>
              <Select
                labelId="religion-label"
                id="religion-select"
                value={newApplicant.religion || ""}
                label="Select Religion"
                onChange={(e) =>
                  setNewApplicant({ ...newApplicant, religion: e.target.value })
                }
              >
                <MenuItem value="Religion">- religion -</MenuItem>
                <MenuItem value="Jehovah's Witness">Jehovah's Witness</MenuItem>
                <MenuItem value="Buddist">Buddist</MenuItem>
                <MenuItem value="Catholic">Catholic</MenuItem>
                <MenuItem value="Dating Daan">Dating Daan</MenuItem>
                <MenuItem value="Pagano">Pagano</MenuItem>
                <MenuItem value="Atheist">Atheist</MenuItem>
                <MenuItem value="Born Again">Born Again</MenuItem>
                <MenuItem value="Adventis">Adventis</MenuItem>
                <MenuItem value="Baptist">Baptist</MenuItem>
                <MenuItem value="Mormons">Mormons</MenuItem>
                <MenuItem value="Free Methodist">Free Methodist</MenuItem>
                <MenuItem value="Christian">Christian</MenuItem>
                <MenuItem value="Protestant">Protestant</MenuItem>
                <MenuItem value="Aglipay">Aglipay</MenuItem>
                <MenuItem value="Islam">Islam</MenuItem>
                <MenuItem value="LDS">LDS</MenuItem>
                <MenuItem value="Seventh Day Adventist">Seventh Day Adventist</MenuItem>
                <MenuItem value="Iglesia Ni Cristo">Iglesia Ni Cristo</MenuItem>
                <MenuItem value="UCCP">UCCP</MenuItem>
                <MenuItem value="PMCC">PMCC</MenuItem>
                <MenuItem value="Baha'i Faith">Baha'i Faith</MenuItem>
                <MenuItem value="None">None / No Religion</MenuItem>
                <MenuItem value="Others">Others</MenuItem>
              </Select>
            </FormControl>


          </Box>

          <Box display="flex" alignItems="center" mb={2}>
            <Typography style={{ fontSize: "12px", marginRight: "36px" }}>
              Civil Status:
            </Typography>
            <FormControl sx={{ width: "40%" }} size="small">
              <InputLabel id="civil-status-label">Civil Status</InputLabel>
              <Select
                labelId="civil-status-label"
                id="civil-status-select"
                value={newApplicant.civilStatus || ""}
                label="Civil Status"

                onChange={(e) =>
                  setNewApplicant({ ...newApplicant, civilStatus: e.target.value })
                }
              >
                <MenuItem value="-civil status-">-civil status-</MenuItem>
                <MenuItem value="Single">Single</MenuItem>
                <MenuItem value="Married">Married</MenuItem>
                <MenuItem value="Legally Seperated">Legally Seperated</MenuItem>
                <MenuItem value="Widowed">Widowed</MenuItem>
                <MenuItem value="Solo Parent">Solo Parent</MenuItem>

              </Select>
            </FormControl>


            <Typography style={{ marginLeft: "150px", fontSize: "12px", marginRight: "100px", textAlign: "Center" }}>
              Tribe/Ethnic Group:
            </Typography>
            <FormControl sx={{ width: "20%" }} size="small">
              <InputLabel id="ethnic-group-label">Select Tribe / Ethnic Group</InputLabel>
              <Select
                labelId="ethnic-group-label"
                id="ethnic-group-select"
                value={newApplicant.tribeEthnicGroup || ""}
                label="Select Tribe / Ethnic Group"
                onChange={(e) =>
                  setNewApplicant({ ...newApplicant, tribeEthnicGroup: e.target.value })
                }
              >
                <MenuItem value="Agta">Agta</MenuItem>
                <MenuItem value="Agutaynen">Agutaynen</MenuItem>
                <MenuItem value="Aklanon">Aklanon</MenuItem>
                <MenuItem value="Alangan">Alangan</MenuItem>
                <MenuItem value="Alta">Alta</MenuItem>
                <MenuItem value="Amersian">Amersian</MenuItem>
                <MenuItem value="Ati">Ati</MenuItem>
                <MenuItem value="Atta">Atta</MenuItem>
                <MenuItem value="Ayta">Ayta</MenuItem>
                <MenuItem value="B'laan">B'laan</MenuItem>
                <MenuItem value="Badjao">Badjao</MenuItem>
                <MenuItem value="Bagobo">Bagobo</MenuItem>
                <MenuItem value="Balangao">Balangao</MenuItem>
                <MenuItem value="Balangingi">Balangingi</MenuItem>
                <MenuItem value="Bangon">Bangon</MenuItem>
                <MenuItem value="Bantoanon">Bantoanon</MenuItem>
                <MenuItem value="Banwaon">Banwaon</MenuItem>
                <MenuItem value="Batak">Batak</MenuItem>
                <MenuItem value="Bicolano">Bicolano</MenuItem>
                <MenuItem value="Binukid">Binukid</MenuItem>
                <MenuItem value="Bohalano">Bohalano</MenuItem>
                <MenuItem value="Bolinao">Bolinao</MenuItem>
                <MenuItem value="Bontoc">Bontoc</MenuItem>
                <MenuItem value="Buhid">Buhid</MenuItem>
                <MenuItem value="Butuanon">Butuanon</MenuItem>
                <MenuItem value="Cagyanen">Cagyanen</MenuItem>
                <MenuItem value="Caray-a">Caray-a</MenuItem>
                <MenuItem value="Cebuano">Cebuano</MenuItem>
                <MenuItem value="Cuyunon">Cuyunon</MenuItem>
                <MenuItem value="Dasen">Dasen</MenuItem>
                <MenuItem value="Ilocano">Ilocano</MenuItem>
                <MenuItem value="Ilonggo">Ilonggo</MenuItem>
                <MenuItem value="Jamah Mapun">Jamah Mapun</MenuItem>
                <MenuItem value="Malay">Malay</MenuItem>
                <MenuItem value="Mangyan">Mangyan</MenuItem>
                <MenuItem value="Maranao">Maranao</MenuItem>
                <MenuItem value="Molbogs">Molbogs</MenuItem>
                <MenuItem value="Palawano">Palawano</MenuItem>
                <MenuItem value="Panimusan">Panimusan</MenuItem>
                <MenuItem value="Tagbanua">Tagbanua</MenuItem>
                <MenuItem value="Tao't">Tao't</MenuItem>
                <MenuItem value="Bato">Bato</MenuItem>
                <MenuItem value="Tausug">Tausug</MenuItem>
                <MenuItem value="Waray">Waray</MenuItem>
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="Others">Others</MenuItem>
              </Select>
            </FormControl>

            <div style={{ marginRight: "17px" }}></div>
            <TextField
              label=""
              required
              style={{ width: "34%", }}
              size="small"

            />
          </Box>

          <br />

          <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold" }}>
            Contact Information:
          </Typography>
          <hr style={{ border: "1px solid #ccc", width: "100%" }} />
          <Box display="flex" gap={2}>
            <Box width="50%">
              <div>Cellphone Number: <span style={{ color: "red" }}>*</span></div><TextField
                label="Enter Cellphone Number"
                required
                fullWidth
                size="small"
                value={newApplicant.cellphoneNumber || ""}
                onChange={(e) =>
                  setNewApplicant({ ...newApplicant, cellphoneNumber: e.target.value })
                }
              />
            </Box>

            <Box width="50%">
              <div>Email Address: <span style={{ color: "red" }}>*</span></div><TextField
                label="Enter Email Address"
                required
                fullWidth
                size="small"
                value={newApplicant.emailAddress || ""}
                onChange={(e) =>
                  setNewApplicant({ ...newApplicant, emailAddress: e.target.value })
                }
              />
            </Box>
          </Box>


          <Box display="flex" gap={2} mt={1}>
            <Box width="50%">
              <div>Telephone Number: <span style={{ color: "red", }}>*</span></div>
              <TextField
                label="Enter Telephone Number"
                required
                sx={{ width: "100%", marginRight: "20px" }}
                size="small"
                value={newApplicant.telephoneNumber || ""}
                onChange={(e) =>
                  setNewApplicant({ ...newApplicant, telephoneNumber: e.target.value })
                }
              />
            </Box>

            <Box width="50%">
              <div>Facebook Account: <span style={{ color: "red", }}>*</span></div>
              <TextField
                label="Enter Facebook Account"
                required
                sx={{ width: "100%", marginRight: "20px" }}
                size="small"
                value={newApplicant.facebookAccount || ""}
                onChange={(e) =>
                  setNewApplicant({ ...newApplicant, facebookAccount: e.target.value })
                }
              />
            </Box>
          </Box>
          < br />


          <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold" }}>Present Address:</Typography>
          <hr style={{ border: "1px solid #ccc", width: "100%", }} />


          {/* Present Address Fields (3 in a row) */}
          <Box display="flex" gap={2} mt={1}>
            <Box width="32%">
              <div>Present Address Street: <span style={{ color: "red" }}>*</span></div>
              <TextField
                label="Enter Street"
                required
                sx={{ width: "100%", marginRight: "20px" }}
                size="small"
                value={newApplicant.presentAddress || ""}
                onChange={(e) =>
                  setNewApplicant({ ...newApplicant, presentAddress: e.target.value })
                }
              />
            </Box>

            <Box width="32%">
              <div>Barangay: <span style={{ color: "red" }}>*</span></div>
              <TextField
                label="Enter Barangay"
                required
                sx={{ width: "100%", marginRight: "20px" }}
                size="small"
                value={newApplicant.barangay || ""}
                onChange={(e) =>
                  setNewApplicant({ ...newApplicant, barangay: e.target.value })
                }
              />
            </Box>

            <Box width="33%">
              <div>ZIP Code: <span style={{ color: "red" }}>*</span></div>
              <TextField
                label="Enter ZIP Code"
                required
                sx={{ width: "100%", marginRight: "20px" }}
                size="small"
                value={newApplicant.zipCode || ""}
                onChange={(e) =>
                  setNewApplicant({ ...newApplicant, zipCode: e.target.value })
                }
              />
            </Box>
          </Box>

          {/* Region */}
          <Box width="100%" mt={1}>
            <div>Region: <span style={{ color: "red" }}>*</span></div>
            <FormControl sx={{ width: "100%" }} size="small">
              <InputLabel>Select Region</InputLabel>
              <Select

                id="region-select"
                value={newApplicant.present_region || ""}
                label="Select Region"
                sx={{ width: "100%", marginRight: "50px" }}
                onChange={(e) =>
                  setNewApplicant({ ...newApplicant, present_region: e.target.value })
                }
              >
                <MenuItem value="Region I - Ilocos Region">Region I - Ilocos Region</MenuItem>
                <MenuItem value="Region II - Cagayan Valley">Region II - Cagayan Valley</MenuItem>
                <MenuItem value="Region III - Central Luzon">Region III - Central Luzon</MenuItem>
                <MenuItem value="Region IV-A - CALABARZON">Region IV-A - CALABARZON</MenuItem>
                <MenuItem value="Region IV-B (MIMAROPA)">Region IV-B (MIMAROPA)</MenuItem>
                <MenuItem value="Region V - Bicol Region">Region V - Bicol Region</MenuItem>
                <MenuItem value="Region VI - Western Visayas">Region VI - Western Visayas</MenuItem>
                <MenuItem value="Region VII - Central Visayas">Region VII - Central Visayas</MenuItem>
                <MenuItem value="Region VIII - Eastern Visayas">Region VIII - Eastern Visayas</MenuItem>
                <MenuItem value="Region IX - Zamboanga Peninsula">Region IX - Zamboanga Peninsula</MenuItem>
                <MenuItem value="Region X - Northern Mindanao">Region X - Northern Mindanao</MenuItem>
                <MenuItem value="Region XI - Davao Region">Region XI - Davao Region</MenuItem>
                <MenuItem value="Region XII - SOCCSKSARGEN">Region XII - SOCCSKSARGEN</MenuItem>
                <MenuItem value="Region XIII - Caraga">Region XIII - Caraga</MenuItem>
                <MenuItem value="NCR - National Capital Region">NCR - National Capital Region</MenuItem>
                <MenuItem value="CAR - Cordillera Administrative Region">CAR - Cordillera Administrative Region</MenuItem>
                <MenuItem value="ARMM - Autonomous Region in Muslim Mindanao">ARMM - Autonomous Region in Muslim Mindanao</MenuItem>
              </Select>
            </FormControl>

          </Box>

          {/* Province */}
          <Box width="100%" mt={1}>
            <div>Province: <span style={{ color: "red" }}>*</span></div>
            <TextField
              label="Enter Province"
              required
              sx={{ width: "100%", marginRight: "20px" }}
              size="small"
              value={newApplicant.province || ""}
              onChange={(e) =>
                setNewApplicant({ ...newApplicant, province: e.target.value })
              }
            />
          </Box>

          {/* Municipality */}
          <Box width="100%" mt={1}>
            <div>Municipality: <span style={{ color: "red" }}>*</span></div>
            <TextField
              label="Enter Municipality"
              required
              sx={{ width: "100%", marginRight: "20px" }}
              size="small"
              value={newApplicant.municipality || ""}
              onChange={(e) =>
                setNewApplicant({ ...newApplicant, municipality: e.target.value })
              }
            />
          </Box>

          {/* DSWD Household Number */}
          <Box width="100%" mt={1}>
            <div>DSWD Household Number: <span style={{ color: "red" }}>*</span></div>
            <TextField
              label="Enter Household Number"
              required
              sx={{ width: "100%", marginRight: "20px" }}
              size="small"
              value={newApplicant.dswdHouseholdNumber || ""}
              onChange={(e) =>
                setNewApplicant({ ...newApplicant, dswdHouseholdNumber: e.target.value })
              }
            />
          </Box>


          <br />

          {/* Same as Present Checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                checked={sameAsPresent}
                onChange={(e) => setSameAsPresent(e.target.checked)}
              />
            }
            label="Same as Present Address"
          />

          {/* Permanent Address Title */}
          <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold" }}>
            Permanent Address:
          </Typography>
          <hr style={{ border: "1px solid #ccc", width: "100%" }} />


          {/* Permanent Address Row Fields */}
          <Box display="flex" gap={2} mt={1}>
            <Box width="32%">
              <div>Permanent Address Street: <span style={{ color: "red" }}>*</span></div>
              <TextField
                label="Enter Street"
                required
                sx={{ width: "100%", marginRight: "20px" }}
                size="small"
                value={newApplicant.permanentAddress || ""}
                onChange={(e) =>
                  setNewApplicant({ ...newApplicant, permanentAddress: e.target.value })
                }
              />
            </Box>

            <Box width="32%">
              <div>Barangay: <span style={{ color: "red" }}>*</span></div>
              <TextField
                label="Enter Barangay"
                required
                sx={{ width: "100%", marginRight: "20px" }}
                size="small"
                value={newApplicant.barangay || ""}
                onChange={(e) =>
                  setNewApplicant({ ...newApplicant, barangay: e.target.value })
                }
              />
            </Box>

            <Box width="33%">
              <div>ZIP Code: <span style={{ color: "red" }}>*</span></div>
              <TextField
                label="Enter ZIP Code"
                required
                sx={{ width: "100%", marginRight: "20px" }}
                size="small"
                value={newApplicant.zipCode || ""}
                onChange={(e) =>
                  setNewApplicant({ ...newApplicant, zipCode: e.target.value })
                }
              />
            </Box>
          </Box>

          <Box width="100%" mt={1}>
            <div>Region: <span style={{ color: "red" }}>*</span></div>
            <FormControl sx={{ width: "100%" }} size="small">
              <InputLabel id="region-label">Select Region</InputLabel>
              <Select
                labelId="region-label"
                id="region-select"
                value={newApplicant.permanent_region || ""}
                label="Select Region"
                onChange={(e) =>
                  setNewApplicant({ ...newApplicant, permanent_region: e.target.value })
                }
              >
                <MenuItem value="Region I - Ilocos Region">Region I - Ilocos Region</MenuItem>
                <MenuItem value="Region II - Cagayan Valley">Region II - Cagayan Valley</MenuItem>
                <MenuItem value="Region III - Central Luzon">Region III - Central Luzon</MenuItem>
                <MenuItem value="Region IV-A - CALABARZON">Region IV-A - CALABARZON</MenuItem>
                <MenuItem value="Region IV-B (MIMAROPA)">Region IV-B (MIMAROPA)</MenuItem>
                <MenuItem value="Region V - Bicol Region">Region V - Bicol Region</MenuItem>
                <MenuItem value="Region VI - Western Visayas">Region VI - Western Visayas</MenuItem>
                <MenuItem value="Region VII - Central Visayas">Region VII - Central Visayas</MenuItem>
                <MenuItem value="Region VIII - Eastern Visayas">Region VIII - Eastern Visayas</MenuItem>
                <MenuItem value="Region IX - Zamboanga Peninsula">Region IX - Zamboanga Peninsula</MenuItem>
                <MenuItem value="Region X - Northern Mindanao">Region X - Northern Mindanao</MenuItem>
                <MenuItem value="Region XI - Davao Region">Region XI - Davao Region</MenuItem>
                <MenuItem value="Region XII - SOCCSKSARGEN">Region XII - SOCCSKSARGEN</MenuItem>
                <MenuItem value="Region XIII - Caraga">Region XIII - Caraga</MenuItem>
                <MenuItem value="NCR - National Capital Region">NCR - National Capital Region</MenuItem>
                <MenuItem value="CAR - Cordillera Administrative Region">CAR - Cordillera Administrative Region</MenuItem>
                <MenuItem value="ARMM - Autonomous Region in Muslim Mindanao">ARMM - Autonomous Region in Muslim Mindanao</MenuItem>
              </Select>
            </FormControl>

          </Box>

          <Box width="100%" mt={1}>
            <div>Province: <span style={{ color: "red" }}>*</span></div>
            <TextField
              label="Enter Province"
              required
              sx={{ width: "100%", marginRight: "20px" }}
              size="small"
              value={newApplicant.province || ""}
              onChange={(e) =>
                setNewApplicant({ ...newApplicant, province: e.target.value })
              }
            />
          </Box>

          <Box width="100%" mt={1}>
            <div>Municipality: <span style={{ color: "red" }}>*</span></div>
            <TextField
              label="Enter Municipality"
              required
              sx={{ width: "100%", marginRight: "20px" }}
              size="small"
              value={newApplicant.municipality || ""}
              onChange={(e) =>
                setNewApplicant({ ...newApplicant, municipality: e.target.value })
              }
            />
          </Box>

          <Box width="100%" mt={1}>
            <div>DSWD Household Number: <span style={{ color: "red" }}>*</span></div>
            <TextField
              label="Enter Household Number"
              required
              sx={{ width: "100%", marginRight: "20px" }}
              size="small"
              value={newApplicant.dswdHouseholdNumber || ""}
              onChange={(e) =>
                setNewApplicant({ ...newApplicant, dswdHouseholdNumber: e.target.value })
              }
            />
          </Box>

          <Modal open={open} onClose={handleClose}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 600,
                  bgcolor: 'white',
                  borderRadius: 2,
                  boxShadow: 24,
                  p: 4,
                }}
              >
                {/* Header */}
                <Box sx={{ bgcolor: '#6D2323', color: 'white', p: 2, borderRadius: 1 }}>
                  <Typography style={{ textAlign: 'center', fontWeight: "bold" }} variant="h6" gutterBottom>
                    Upload Your Photo
                  </Typography>
                </Box>

                <Box
                  sx={{
                    border: '3px solid black',
                    p: 2,
                    borderRadius: 1,
                    mb: 2,
                  }}
                >
                  {/* Preview Image - between header and guidelines */}
                  {preview && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2, position: 'relative' }}>
                      <Box
                        component="img"
                        src={preview}
                        alt="Preview"
                        sx={{
                          width: '192px',
                          height: '192px',
                          objectFit: 'cover',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                        }}
                      />
                      {/* X Button */}
                      <Button
                        size="small"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreview(null);
                        }}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 'calc(50% - 96px)',
                          minWidth: 0,
                          width: 24,
                          height: 24,
                          fontSize: '14px',
                          p: 0,
                          color: 'white',
                          bgcolor: '#d32f2f',
                          '&:hover': { bgcolor: '#b71c1c' },
                        }}
                      >
                        ×
                      </Button>
                    </Box>
                  )}
                  <Typography variant="body2" sx={{ mb: 2, fontSize: '15px' }}>
                    <strong style={{ fontSize: "15px" }}>Guidelines:</strong>
                    <Box sx={{ ml: 2, textAlign: "justify", fontFamily: "Arial", fontSize: "15px" }}>
                      - Size 2" x 2"<br />
                      - Color: Your photo must be in color.<br />
                      - Background: White.<br />
                      - Head size and position: Look directly into the camera at a straight angle, face centered.<br />
                      - File must be jpeg, jpg or png<br />
                      - Attire must be formal.
                    </Box>



                    <strong style={{ fontSize: "15px" }}>How to Change the Photo?</strong>
                    <Box sx={{ ml: 2, textAlign: "justify", fontFamily: "Arial", fontSize: "15px" }}>
                      - Click X Button<br />
                      - Then click choose file button, select photo<br />
                      - Click upload Button
                    </Box>
                  </Typography>

                </Box>

                {/* File Input */}
                <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold", marginBottom: "8px" }}>
                  Select Your Image:
                </Typography>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onClick={(e) => (e.target.value = null)} // allow re-selecting same file
                  onChange={handleFileChange}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    marginBottom: '16px',
                    fontFamily: 'Arial',
                  }}
                />

                {/* Upload Button */}
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleUpload}
                  sx={{
                    backgroundColor: '#6D2323',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#5a1f1f',
                    },
                  }}
                >
                  Upload
                </Button>
              </Box>
            </Box>
          </Modal>







          <Box display="flex" justifyContent="right" mt={4}>
            {/* Previous Page Button */}
            <Button
              variant="contained"
              onClick={handleOpen}
              sx={{
                backgroundColor: '#6D2323', // Set background color to match the next button
                color: '#fff', // Set text color to white
                marginRight: '5px', // Add margin between buttons
                '&:hover': {
                  backgroundColor: '#5a1f1f', // Adjust hover color to match
                },
                display: 'flex', // Ensure icon and text are aligned
                alignItems: 'center', // Center the content vertically
              }}
            >
              <PhotoCameraIcon sx={{ marginRight: '8px' }} /> {/* Photo Icon */}
              Upload Photo <br /> Student Picture
            </Button>

            {/* Next Step Button */}
            <Button
              variant="contained"
              component={Link}
              to="/family_background" // The path where the button will link to
              endIcon={<ArrowForwardIcon sx={{ color: '#fff' }} />}
              sx={{
                backgroundColor: '#6D2323', // Set background color to match the previous button
                color: '#fff', // Set text color to white
                '&:hover': {
                  backgroundColor: '#5a1f1f', // Adjust hover color to match
                },
              }}
            >
              Next Step
            </Button>
          </Box>
        </Container>
      </form>




    </Container>
  );
};

export default PersonalInfoForm;
