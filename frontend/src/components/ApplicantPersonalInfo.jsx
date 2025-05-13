import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button, Box, TextField, Container, Typography, FormControl, InputLabel, Select, MenuItem, ListSubheader, Modal } from "@mui/material";
import { Link } from "react-router-dom";
import { Checkbox, FormControlLabel } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import SchoolIcon from '@mui/icons-material/School';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import InfoIcon from '@mui/icons-material/Info';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { jwtDecode } from "jwt-decode";
import { regions, provinces, cities, barangays } from 'select-philippines-address';

const ApplicantPersonalInfoForm = () => {
  const getPersonIdFromToken = () => {
  };

  const [data, setData] = useState([]);
  const personIDFromToken = getPersonIdFromToken();


  const [personID, setPersonID] = useState(null);
  const [formData, setFormData] = useState({ profile_picture: null, person_id: null });
  const fileInputRef = useRef(null);



  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const response = await axios.get('http://localhost:5000/person_table');
      setApplicants(response.data);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    }
  };

  const [students, setStudents] = useState([]);

  // Fetch all students
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


  const [profilePicture, setProfilePicture] = useState(null);


  const fetchProfilePicture = async (person_id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/${person_id}`);
      console.log("Response data:", res.data);
      if (res.data && res.data.profile_picture) {
        console.log("Setting profile picture to:", res.data.profile_picture);
        setProfilePicture(`http://localhost:5000/uploads/${res.data.profile_picture}`);
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      setProfilePicture(null);
    }
  };


  useEffect(() => {
    if (personID) {
      fetchProfilePicture(personID);
    }
  }, [personID]);

  // State for applicants
  const [applicants, setApplicants] = useState([]);

  const steps = [
    { label: 'Personal Information', icon: <PersonIcon />, path: '/applicant_personal_information' },
    { label: 'Family Background', icon: <FamilyRestroomIcon />, path: '/applicant_family_background' },
    { label: 'Educational Attainment', icon: <SchoolIcon />, path: '/applicant_educational_attainment' },
    { label: 'Health Medical Records', icon: <HealthAndSafetyIcon />, path: '/applicant_health_medical_records' },
    { label: 'Other Information', icon: <InfoIcon />, path: '/applicant_other_information' },
  ];






  const [activeStep, setActiveStep] = useState(0);
  const [clickedSteps, setClickedSteps] = useState(Array(steps.length).fill(false));

  const [isLrnNA, setIsLrnNA] = useState(false);
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);

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

  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    setUploadedImage(preview); // ✅ Store preview image
    alert('Upload successful!');
    handleClose();
  };



  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
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

  useEffect(() => {
    fetchApplicants();
  }, []);


  const [sameAsPresent, setSameAsPresent] = useState({});

  useEffect(() => {
    students.forEach((student) => {
      const isChecked = sameAsPresent[student.person_id];
      if (isChecked) {
        const updatedStudent = {
          ...student,
          permanentRegion: student.presentRegion || "",
          permanentProvince: student.presentProvince || "",
          permanentMunicipality: student.presentMunicipality || "",
          permanentBarangay: student.presentBarangay || "",
          permanentZipCode: student.presentZipCode || "",
        };
        setStudents((prev) =>
          prev.map((s) =>
            s.person_id === student.person_id ? updatedStudent : s
          )
        );
        updateItem(updatedStudent);
      }
    });
  }, [sameAsPresent, students]);


  const [regionList, setRegionList] = useState([]);



  const [loading, setLoading] = useState(false);



  useEffect(() => {
    setLoading(true);
    regions().then((data) => {
      setRegionList(data);
      setLoading(false);
    });
  }, []);


  // 1. Load regions once
  useEffect(() => {
    setLoading(true);
    regions().then((data) => {
      setRegionList(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    students.forEach((student) => {
      const regionMap = regionList.reduce((map, r) => {
        map[r.region_name] = r.region_code;
        return map;
      }, {});

      // Present Address

      if (student.presentRegion && !student.presentProvinceList?.length) {
        const regionCode = regionMap[student.presentRegion];
        if (regionCode) {
          provinces(regionCode).then((provList) => {
            setStudents((prev) =>
              prev.map((s) =>
                s.person_id === student.person_id
                  ? { ...s, presentProvinceList: provList }
                  : s
              )
            );
          });
        }
      }

      if (student.presentProvince && !student.presentCityList?.length) {
        const regionCode = regionMap[student.presentRegion];
        if (regionCode) {
          provinces(regionCode).then((provList) => {
            const province = provList.find((p) => p.province_name === student.presentProvince);
            if (province) {
              cities(province.province_code).then((cityList) => {
                setStudents((prev) =>
                  prev.map((s) =>
                    s.person_id === student.person_id
                      ? { ...s, presentCityList: cityList }
                      : s
                  )
                );
              });
            }
          });
        }
      }

      if (student.presentMunicipality && !student.presentBarangayList?.length) {
        const regionCode = regionMap[student.presentRegion];
        if (regionCode) {
          provinces(regionCode).then((provList) => {
            const province = provList.find((p) => p.province_name === student.presentProvince);
            if (province) {
              cities(province.province_code).then((cityList) => {
                const city = cityList.find((c) => c.city_name === student.presentMunicipality);
                if (city) {
                  barangays(city.city_code).then((brgyList) => {
                    setStudents((prev) =>
                      prev.map((s) =>
                        s.person_id === student.person_id
                          ? { ...s, presentBarangayList: brgyList }
                          : s
                      )
                    );
                  });
                }
              });
            }
          });
        }
      }

      // Permanent Address

      if (student.permanentRegion && !student.permanentProvinceList?.length) {
        const regionCode = regionMap[student.permanentRegion];
        if (regionCode) {
          provinces(regionCode).then((provList) => {
            setStudents((prev) =>
              prev.map((s) =>
                s.person_id === student.person_id
                  ? { ...s, permanentProvinceList: provList }
                  : s
              )
            );
          });
        }
      }

      if (student.permanentProvince && !student.permanentCityList?.length) {
        const regionCode = regionMap[student.permanentRegion];
        if (regionCode) {
          provinces(regionCode).then((provList) => {
            const province = provList.find((p) => p.province_name === student.permanentProvince);
            if (province) {
              cities(province.province_code).then((cityList) => {
                setStudents((prev) =>
                  prev.map((s) =>
                    s.person_id === student.person_id
                      ? { ...s, permanentCityList: cityList }
                      : s
                  )
                );
              });
            }
          });
        }
      }

      if (student.permanentMunicipality && !student.permanentBarangayList?.length) {
        const regionCode = regionMap[student.permanentRegion];
        if (regionCode) {
          provinces(regionCode).then((provList) => {
            const province = provList.find((p) => p.province_name === student.permanentProvince);
            if (province) {
              cities(province.province_code).then((cityList) => {
                const city = cityList.find((c) => c.city_name === student.permanentMunicipality);
                if (city) {
                  barangays(city.city_code).then((brgyList) => {
                    setStudents((prev) =>
                      prev.map((s) =>
                        s.person_id === student.person_id
                          ? { ...s, permanentBarangayList: brgyList }
                          : s
                      )
                    );
                  });
                }
              });
            }
          });
        }
      }
    });
  }, [students, regionList]);



  useEffect(() => {
    const fetchWithAreaNames = async () => {
      const updatedStudents = await Promise.all(students.map(async (student) => {
        const regionData = await regions().then(data =>
          data.find(r => r.region_code === student.region)
        );
        const provinceData = await provinces(student.region).then(data =>
          data.find(p => p.province_code === student.province)
        );
        const cityData = await cities(student.province).then(data =>
          data.find(c => c.city_code === student.city)
        );
        const barangayData = await barangays(student.city).then(data =>
          data.find(b => b.brgy_code === student.barangay)
        );

        return {
          ...student,
          regionName: regionData?.region_name || '',
          provinceName: provinceData?.province_name || '',
          cityName: cityData?.city_name || '',
          barangayName: barangayData?.brgy_name || '',
        };
      }));

      setStudents(updatedStudents);
    };

    fetchWithAreaNames();
  }, [students.length]);



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

          <Container maxWidth="100%" sx={{
            backgroundColor: "#6D2323", border: "2px solid black", maxHeight: '500px',
            overflowY: 'auto', color: "white", borderRadius: 2, boxShadow: 3, padding: "4px",
          }}>

            <Box sx={{ width: "100%", }}>
              <Typography style={{ fontSize: "20px", padding: "10px", fontFamily: "Arial Black" }}>Step 1: Personal Information</Typography>
            </Box>
          </Container>


          <Container maxWidth="100%" sx={{ backgroundColor: "white", border: "2px solid black", padding: 4, borderRadius: 2, boxShadow: 3 }}>


            <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold" }}>Personal Information:</Typography>
            <hr style={{ border: "1px solid #ccc", width: "100%" }} />
            <br />



            <Box display="flex" alignItems="center" mb={2}>
              <Typography style={{ fontSize: "13px", marginRight: "10px", minWidth: "150px" }}>
                Campus: <span style={{ color: "red" }}>*</span>
              </Typography>

              {students.map((student) => (
                <FormControl sx={{ width: "100%" }} size="small" key={student.person_id}>
                  <InputLabel id={`campus-label-${student.person_id}`}>
                    Campus (Manila/Cavite)
                  </InputLabel>
                  <Select
                    labelId={`campus-label-${student.person_id}`}
                    id={`campus-select-${student.person_id}`}
                    value={student.campus ?? ""} // fallback if null or undefined
                    label="Campus (Manila/Cavite)"
                    onChange={(e) => {
                      const updatedCampus = e.target.value;
                      const updatedStudent = { ...student, campus: updatedCampus };

                      // Update local state
                      setStudents((prevStudents) =>
                        prevStudents.map((s) =>
                          s.person_id === student.person_id ? updatedStudent : s
                        )
                      );

                      // Immediately update the backend
                      updateItem(updatedStudent);
                    }}
                    required
                  >
                    <MenuItem value={0}>MANILA</MenuItem>
                    <MenuItem value={1}>CAVITE</MenuItem>
                  </Select>
                </FormControl>
              ))}

            </Box>


            <Box display="flex" alignItems="center" mb={2}>
              <Typography style={{ fontSize: "13px", marginRight: "10px", minWidth: "150px" }}>
                Academic Program: <span style={{ color: "red" }}>*</span>
              </Typography>
              {students.map((student) => (
                <FormControl sx={{ width: "100%" }} size="small" required key={student.person_id}>
                  <InputLabel id={`academic-program-label-${student.person_id}`}>
                    Select Academic Program
                  </InputLabel>
                  <Select
                    labelId={`academic-program-label-${student.person_id}`}
                    id={`academic-program-select-${student.person_id}`}
                    value={student.academicProgram || ""}
                    label="Select Academic Program"
                    onChange={(e) => {
                      const updatedProgram = e.target.value;
                      const updatedStudent = { ...student, academicProgram: updatedProgram };

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
                    <MenuItem value="Techvoc">Techvoc</MenuItem>
                    <MenuItem value="Undergraduate">Undergraduate</MenuItem>
                    <MenuItem value="Graduate">Graduate</MenuItem>
                  </Select>
                </FormControl>
              ))}


            </Box>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography style={{ fontSize: "13px", marginRight: "10px", minWidth: "150px" }}>
                Classified As: <span style={{ color: "red" }}>*</span>
              </Typography>
              {students.map((student) => (
                <FormControl sx={{ width: "100%" }} size="small" required key={student.person_id}>
                  <InputLabel id={`classified-as-label-${student.person_id}`}>
                    Select Classification
                  </InputLabel>
                  <Select
                    labelId={`classified-as-label-${student.person_id}`}
                    id={`classified-as-select-${student.person_id}`}
                    value={student.classifiedAs || ""}
                    label="Select Classification"
                    onChange={(e) => {
                      const updatedClassification = e.target.value;
                      const updatedStudent = { ...student, classifiedAs: updatedClassification };

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
                    <MenuItem value="Freshman (First Year)">Freshman (First Year)</MenuItem>
                    <MenuItem value="Transferee">Transferee</MenuItem>
                    <MenuItem value="Returnee">Returnee</MenuItem>
                    <MenuItem value="Shiftee">Shiftee</MenuItem>
                    <MenuItem value="Foreign Student">Foreign Student</MenuItem>
                  </Select>
                </FormControl>
              ))}

            </Box>

            <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold" }}>Course Program:</Typography>
            <hr style={{ border: "1px solid #ccc", width: "100%" }} />
            <br />

            <Box display="flex" mb={2}>
              {/* Left Side: Program and Year Level Inputs */}
              <Box flex={1}>
                {/* Program Input */}
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography
                    style={{
                      fontSize: "13px",
                      marginRight: "10px",
                      minWidth: "150px",
                    }}
                  >
                    1st Program Choice:  <span style={{ color: "red" }}>*</span>
                  </Typography>
                  {students.map((student) => (
                    <FormControl sx={{ width: "80%" }} size="small" key={student.person_id}>
                      <InputLabel id={`program-label-${student.person_id}`}>
                        Select Program
                      </InputLabel>
                      <Select
                        labelId={`program-label-${student.person_id}`}
                        id={`program-select-${student.person_id}`}
                        value={student.program || ""}
                        label="Select Program"
                        onChange={(e) => {
                          const updatedProgram = e.target.value;
                          const updatedStudent = { ...student, program: updatedProgram };

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
                        <ListSubheader style={{ textAlign: "center", color: "maroon" }}>
                          COLLEGE OF ARCHITECTURE AND FINE ARTS
                        </ListSubheader>
                        <MenuItem value="Bachelor of Science in Architecture (BS ARCHI.)">
                          Bachelor of Science in Architecture (BS ARCHI.)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Interior Design (BSID)">
                          Bachelor of Science in Interior Design (BSID)
                        </MenuItem>
                        <MenuItem value="Bachelor in Fine Arts (BFA) - Painting">
                          Bachelor in Fine Arts (BFA) - Painting
                        </MenuItem>
                        <MenuItem value="Bachelor in Fine Arts (BFA) - Visual Communication">
                          Bachelor in Fine Arts (BFA) - Visual Communication
                        </MenuItem>

                        <ListSubheader style={{ textAlign: "center", color: "maroon" }}>
                          COLLEGE OF ARTS AND SCIENCES
                        </ListSubheader>
                        <MenuItem value="Bachelor of Science in Applied Physics w/ Comp. Sci. Emphasis (BSAP)">
                          Bachelor of Science in Applied Physics w/ Comp. Sci. Emphasis (BSAP)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Psychology (BSPSYCH)">
                          Bachelor of Science in Psychology (BSPSYCH)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Mathematics (BSMATH)">
                          Bachelor of Science in Mathematics (BSMATH)
                        </MenuItem>

                        <ListSubheader style={{ textAlign: "center", color: "maroon" }}>
                          COLLEGE OF COMPUTING STUDIES
                        </ListSubheader>
                        <MenuItem value="Bachelor of Science in Computer Science (BSCS)">
                          Bachelor of Science in Computer Science (BSCS)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Information Technology (BS INFO. TECH.)">
                          Bachelor of Science in Information Technology (BS INFO. TECH.)
                        </MenuItem>

                        <ListSubheader style={{ textAlign: "center", color: "maroon" }}>
                          COLLEGE OF BUSINESS ADMINISTRATION
                        </ListSubheader>
                        <MenuItem value="BSBA - Marketing Management">
                          BSBA - Marketing Management
                        </MenuItem>
                        <MenuItem value="BSBA - Human Resource Dev't Management (HRDM)">
                          BSBA - Human Resource Dev't Management (HRDM)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Entrepreneurship (BSEM)">
                          Bachelor of Science in Entrepreneurship (BSEM)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Office Administration (BSOA)">
                          Bachelor of Science in Office Administration (BSOA)
                        </MenuItem>

                        <ListSubheader style={{ textAlign: "center", color: "maroon" }}>
                          COLLEGE OF EDUCATIONS
                        </ListSubheader>
                        <MenuItem value="Bachelor in Secondary Education - Science">
                          Bachelor in Secondary Education - Science
                        </MenuItem>
                        <MenuItem value="Bachelor in Secondary Education - Mathematics">
                          Bachelor in Secondary Education - Mathematics
                        </MenuItem>
                        <MenuItem value="Bachelor in Secondary Education - Filipino">
                          Bachelor in Secondary Education - Filipino
                        </MenuItem>
                        <MenuItem value="Bachelor in Special Needs Education (BSNEd)">
                          Bachelor in Special Needs Education (BSNEd)
                        </MenuItem>
                        <MenuItem value="BTLE - Home Economics">BTLE - Home Economics</MenuItem>
                        <MenuItem value="BTLE - Industrial Arts">BTLE - Industrial Arts</MenuItem>
                        <MenuItem value="Professional Education / Subjects 18 units (TCP)">
                          Professional Education / Subjects 18 units (TCP)
                        </MenuItem>

                        <ListSubheader style={{ textAlign: "center", color: "maroon" }}>
                          COLLEGE OF ENGINEERING
                        </ListSubheader>
                        <MenuItem value="Bachelor of Science in Chemical Engineering (BSCHE)">
                          Bachelor of Science in Chemical Engineering (BSCHE)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Civil Engineering (BSCE)">
                          Bachelor of Science in Civil Engineering (BSCE)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Electrical Engineering (BSEE)">
                          Bachelor of Science in Electrical Engineering (BSEE)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Electronics and Communication Eng (BSECE)">
                          Bachelor of Science in Electronics and Communication Eng (BSECE)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Mechanical Engineering (BSME)">
                          Bachelor of Science in Mechanical Engineering (BSME)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Computer Engineering (BSCOE)">
                          Bachelor of Science in Computer Engineering (BSCOE)
                        </MenuItem>

                        <ListSubheader style={{ textAlign: "center", color: "maroon" }}>
                          COLLEGE OF HOSPITALITY MANAGEMENT (CHTM)
                        </ListSubheader>
                        <MenuItem value="Bachelor of Science in Tourism Management (BST)">
                          Bachelor of Science in Tourism Management (BST)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Hospitality Management (BSHM)">
                          Bachelor of Science in Hospitality Management (BSHM)
                        </MenuItem>

                        <ListSubheader style={{ textAlign: "center", color: "maroon" }}>
                          COLLEGE OF INDUSTRIAL TECHNOLOGY
                        </ListSubheader>
                        <MenuItem value="BSIT - Automotive Technology">
                          BSIT - Automotive Technology
                        </MenuItem>
                        <MenuItem value="BSIT - Electrical Technology">
                          BSIT - Electrical Technology
                        </MenuItem>
                        <MenuItem value="BSIT - Electronics Technology">
                          BSIT - Electronics Technology
                        </MenuItem>
                        <MenuItem value="BSIT - Food Technology">
                          BSIT - Food Technology
                        </MenuItem>
                        <MenuItem value="BSIT - Fashion and Apparel Technology">
                          BSIT - Fashion and Apparel Technology
                        </MenuItem>
                        <MenuItem value="BSIT - Industrial Chemistry">
                          BSIT - Industrial Chemistry
                        </MenuItem>
                        <MenuItem value="BSIT - Drafting Technology">
                          BSIT - Drafting Technology
                        </MenuItem>
                        <MenuItem value="BSIT - Machine Shop Technology">
                          BSIT - Machine Shop Technology
                        </MenuItem>
                        <MenuItem value="BSIT - Refrigeration and Air Conditioning">
                          BSIT - Refrigeration and Air Conditioning
                        </MenuItem>

                        <ListSubheader style={{ textAlign: "center", color: "maroon" }}>
                          COLLEGE OF PUBLIC ADMINISTRATION AND CRIMINOLOGY
                        </ListSubheader>
                        <MenuItem value="Bachelor in Public Administration (BPA)">
                          Bachelor in Public Administration (BPA)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Criminology (BSCRIM)">
                          Bachelor of Science in Criminology (BSCRIM)
                        </MenuItem>
                      </Select>
                    </FormControl>
                  ))}

                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                  <Typography
                    style={{
                      fontSize: "13px",
                      marginRight: "10px",
                      minWidth: "150px",
                    }}
                  >
                    2nd Program Choice:  <span style={{ color: "red" }}>*</span>
                  </Typography>
                  {students.map((student) => (
                    <FormControl sx={{ width: "80%" }} size="small" key={student.person_id}>
                      <InputLabel id={`program-label-${student.person_id}`}>
                        Select Program
                      </InputLabel>
                      <Select
                        labelId={`program-label-${student.person_id}`}
                        id={`program-select-${student.person_id}`}
                        value={student.program2 || ""}
                        label="Select Program"
                        onChange={(e) => {
                          const updatedProgram = e.target.value;
                          const updatedStudent = { ...student, program2: updatedProgram };

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
                        <ListSubheader style={{ textAlign: "center", color: "maroon" }}>
                          COLLEGE OF ARCHITECTURE AND FINE ARTS
                        </ListSubheader>
                        <MenuItem value="Bachelor of Science in Architecture (BS ARCHI.)">
                          Bachelor of Science in Architecture (BS ARCHI.)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Interior Design (BSID)">
                          Bachelor of Science in Interior Design (BSID)
                        </MenuItem>
                        <MenuItem value="Bachelor in Fine Arts (BFA) - Painting">
                          Bachelor in Fine Arts (BFA) - Painting
                        </MenuItem>
                        <MenuItem value="Bachelor in Fine Arts (BFA) - Visual Communication">
                          Bachelor in Fine Arts (BFA) - Visual Communication
                        </MenuItem>

                        <ListSubheader style={{ textAlign: "center", color: "maroon" }}>
                          COLLEGE OF ARTS AND SCIENCES
                        </ListSubheader>
                        <MenuItem value="Bachelor of Science in Applied Physics w/ Comp. Sci. Emphasis (BSAP)">
                          Bachelor of Science in Applied Physics w/ Comp. Sci. Emphasis (BSAP)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Psychology (BSPSYCH)">
                          Bachelor of Science in Psychology (BSPSYCH)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Mathematics (BSMATH)">
                          Bachelor of Science in Mathematics (BSMATH)
                        </MenuItem>

                        <ListSubheader style={{ textAlign: "center", color: "maroon" }}>
                          COLLEGE OF COMPUTING STUDIES
                        </ListSubheader>
                        <MenuItem value="Bachelor of Science in Computer Science (BSCS)">
                          Bachelor of Science in Computer Science (BSCS)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Information Technology (BS INFO. TECH.)">
                          Bachelor of Science in Information Technology (BS INFO. TECH.)
                        </MenuItem>

                        <ListSubheader style={{ textAlign: "center", color: "maroon" }}>
                          COLLEGE OF BUSINESS ADMINISTRATION
                        </ListSubheader>
                        <MenuItem value="BSBA - Marketing Management">
                          BSBA - Marketing Management
                        </MenuItem>
                        <MenuItem value="BSBA - Human Resource Dev't Management (HRDM)">
                          BSBA - Human Resource Dev't Management (HRDM)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Entrepreneurship (BSEM)">
                          Bachelor of Science in Entrepreneurship (BSEM)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Office Administration (BSOA)">
                          Bachelor of Science in Office Administration (BSOA)
                        </MenuItem>

                        <ListSubheader style={{ textAlign: "center", color: "maroon" }}>
                          COLLEGE OF EDUCATIONS
                        </ListSubheader>
                        <MenuItem value="Bachelor in Secondary Education - Science">
                          Bachelor in Secondary Education - Science
                        </MenuItem>
                        <MenuItem value="Bachelor in Secondary Education - Mathematics">
                          Bachelor in Secondary Education - Mathematics
                        </MenuItem>
                        <MenuItem value="Bachelor in Secondary Education - Filipino">
                          Bachelor in Secondary Education - Filipino
                        </MenuItem>
                        <MenuItem value="Bachelor in Special Needs Education (BSNEd)">
                          Bachelor in Special Needs Education (BSNEd)
                        </MenuItem>
                        <MenuItem value="BTLE - Home Economics">BTLE - Home Economics</MenuItem>
                        <MenuItem value="BTLE - Industrial Arts">BTLE - Industrial Arts</MenuItem>
                        <MenuItem value="Professional Education / Subjects 18 units (TCP)">
                          Professional Education / Subjects 18 units (TCP)
                        </MenuItem>

                        <ListSubheader style={{ textAlign: "center", color: "maroon" }}>
                          COLLEGE OF ENGINEERING
                        </ListSubheader>
                        <MenuItem value="Bachelor of Science in Chemical Engineering (BSCHE)">
                          Bachelor of Science in Chemical Engineering (BSCHE)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Civil Engineering (BSCE)">
                          Bachelor of Science in Civil Engineering (BSCE)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Electrical Engineering (BSEE)">
                          Bachelor of Science in Electrical Engineering (BSEE)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Electronics and Communication Eng (BSECE)">
                          Bachelor of Science in Electronics and Communication Eng (BSECE)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Mechanical Engineering (BSME)">
                          Bachelor of Science in Mechanical Engineering (BSME)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Computer Engineering (BSCOE)">
                          Bachelor of Science in Computer Engineering (BSCOE)
                        </MenuItem>

                        <ListSubheader style={{ textAlign: "center", color: "maroon" }}>
                          COLLEGE OF HOSPITALITY MANAGEMENT (CHTM)
                        </ListSubheader>
                        <MenuItem value="Bachelor of Science in Tourism Management (BST)">
                          Bachelor of Science in Tourism Management (BST)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Hospitality Management (BSHM)">
                          Bachelor of Science in Hospitality Management (BSHM)
                        </MenuItem>

                        <ListSubheader style={{ textAlign: "center", color: "maroon" }}>
                          COLLEGE OF INDUSTRIAL TECHNOLOGY
                        </ListSubheader>
                        <MenuItem value="BSIT - Automotive Technology">
                          BSIT - Automotive Technology
                        </MenuItem>
                        <MenuItem value="BSIT - Electrical Technology">
                          BSIT - Electrical Technology
                        </MenuItem>
                        <MenuItem value="BSIT - Electronics Technology">
                          BSIT - Electronics Technology
                        </MenuItem>
                        <MenuItem value="BSIT - Food Technology">
                          BSIT - Food Technology
                        </MenuItem>
                        <MenuItem value="BSIT - Fashion and Apparel Technology">
                          BSIT - Fashion and Apparel Technology
                        </MenuItem>
                        <MenuItem value="BSIT - Industrial Chemistry">
                          BSIT - Industrial Chemistry
                        </MenuItem>
                        <MenuItem value="BSIT - Drafting Technology">
                          BSIT - Drafting Technology
                        </MenuItem>
                        <MenuItem value="BSIT - Machine Shop Technology">
                          BSIT - Machine Shop Technology
                        </MenuItem>
                        <MenuItem value="BSIT - Refrigeration and Air Conditioning">
                          BSIT - Refrigeration and Air Conditioning
                        </MenuItem>

                        <ListSubheader style={{ textAlign: "center", color: "maroon" }}>
                          COLLEGE OF PUBLIC ADMINISTRATION AND CRIMINOLOGY
                        </ListSubheader>
                        <MenuItem value="Bachelor in Public Administration (BPA)">
                          Bachelor in Public Administration (BPA)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Criminology (BSCRIM)">
                          Bachelor of Science in Criminology (BSCRIM)
                        </MenuItem>
                      </Select>
                    </FormControl>
                  ))}

                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography
                    style={{
                      fontSize: "13px",
                      marginRight: "10px",
                      minWidth: "150px",
                    }}
                  >
                    3rd Program Choice:  <span style={{ color: "red" }}>*</span>
                  </Typography>
                  {students.map((student) => (
                    <FormControl sx={{ width: "80%" }} size="small" key={student.person_id}>
                      <InputLabel id={`program-label-${student.person_id}`}>
                        Select Program
                      </InputLabel>
                      <Select
                        labelId={`program-label-${student.person_id}`}
                        id={`program-select-${student.person_id}`}
                        value={student.program3 || ""}
                        label="Select Program"
                        onChange={(e) => {
                          const updatedProgram = e.target.value;
                          const updatedStudent = { ...student, program3: updatedProgram };

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
                        <ListSubheader style={{ textAlign: "center", color: "maroon" }}>
                          COLLEGE OF ARCHITECTURE AND FINE ARTS
                        </ListSubheader>
                        <MenuItem value="Bachelor of Science in Architecture (BS ARCHI.)">
                          Bachelor of Science in Architecture (BS ARCHI.)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Interior Design (BSID)">
                          Bachelor of Science in Interior Design (BSID)
                        </MenuItem>
                        <MenuItem value="Bachelor in Fine Arts (BFA) - Painting">
                          Bachelor in Fine Arts (BFA) - Painting
                        </MenuItem>
                        <MenuItem value="Bachelor in Fine Arts (BFA) - Visual Communication">
                          Bachelor in Fine Arts (BFA) - Visual Communication
                        </MenuItem>

                        <ListSubheader style={{ textAlign: "center", color: "maroon" }}>
                          COLLEGE OF ARTS AND SCIENCES
                        </ListSubheader>
                        <MenuItem value="Bachelor of Science in Applied Physics w/ Comp. Sci. Emphasis (BSAP)">
                          Bachelor of Science in Applied Physics w/ Comp. Sci. Emphasis (BSAP)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Psychology (BSPSYCH)">
                          Bachelor of Science in Psychology (BSPSYCH)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Mathematics (BSMATH)">
                          Bachelor of Science in Mathematics (BSMATH)
                        </MenuItem>

                        <ListSubheader style={{ textAlign: "center", color: "maroon" }}>
                          COLLEGE OF COMPUTING STUDIES
                        </ListSubheader>
                        <MenuItem value="Bachelor of Science in Computer Science (BSCS)">
                          Bachelor of Science in Computer Science (BSCS)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Information Technology (BS INFO. TECH.)">
                          Bachelor of Science in Information Technology (BS INFO. TECH.)
                        </MenuItem>

                        <ListSubheader style={{ textAlign: "center", color: "maroon" }}>
                          COLLEGE OF BUSINESS ADMINISTRATION
                        </ListSubheader>
                        <MenuItem value="BSBA - Marketing Management">
                          BSBA - Marketing Management
                        </MenuItem>
                        <MenuItem value="BSBA - Human Resource Dev't Management (HRDM)">
                          BSBA - Human Resource Dev't Management (HRDM)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Entrepreneurship (BSEM)">
                          Bachelor of Science in Entrepreneurship (BSEM)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Office Administration (BSOA)">
                          Bachelor of Science in Office Administration (BSOA)
                        </MenuItem>

                        <ListSubheader style={{ textAlign: "center", color: "maroon" }}>
                          COLLEGE OF EDUCATIONS
                        </ListSubheader>
                        <MenuItem value="Bachelor in Secondary Education - Science">
                          Bachelor in Secondary Education - Science
                        </MenuItem>
                        <MenuItem value="Bachelor in Secondary Education - Mathematics">
                          Bachelor in Secondary Education - Mathematics
                        </MenuItem>
                        <MenuItem value="Bachelor in Secondary Education - Filipino">
                          Bachelor in Secondary Education - Filipino
                        </MenuItem>
                        <MenuItem value="Bachelor in Special Needs Education (BSNEd)">
                          Bachelor in Special Needs Education (BSNEd)
                        </MenuItem>
                        <MenuItem value="BTLE - Home Economics">BTLE - Home Economics</MenuItem>
                        <MenuItem value="BTLE - Industrial Arts">BTLE - Industrial Arts</MenuItem>
                        <MenuItem value="Professional Education / Subjects 18 units (TCP)">
                          Professional Education / Subjects 18 units (TCP)
                        </MenuItem>

                        <ListSubheader style={{ textAlign: "center", color: "maroon" }}>
                          COLLEGE OF ENGINEERING
                        </ListSubheader>
                        <MenuItem value="Bachelor of Science in Chemical Engineering (BSCHE)">
                          Bachelor of Science in Chemical Engineering (BSCHE)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Civil Engineering (BSCE)">
                          Bachelor of Science in Civil Engineering (BSCE)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Electrical Engineering (BSEE)">
                          Bachelor of Science in Electrical Engineering (BSEE)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Electronics and Communication Eng (BSECE)">
                          Bachelor of Science in Electronics and Communication Eng (BSECE)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Mechanical Engineering (BSME)">
                          Bachelor of Science in Mechanical Engineering (BSME)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Computer Engineering (BSCOE)">
                          Bachelor of Science in Computer Engineering (BSCOE)
                        </MenuItem>

                        <ListSubheader style={{ textAlign: "center", color: "maroon" }}>
                          COLLEGE OF HOSPITALITY MANAGEMENT (CHTM)
                        </ListSubheader>
                        <MenuItem value="Bachelor of Science in Tourism Management (BST)">
                          Bachelor of Science in Tourism Management (BST)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Hospitality Management (BSHM)">
                          Bachelor of Science in Hospitality Management (BSHM)
                        </MenuItem>

                        <ListSubheader style={{ textAlign: "center", color: "maroon" }}>
                          COLLEGE OF INDUSTRIAL TECHNOLOGY
                        </ListSubheader>
                        <MenuItem value="BSIT - Automotive Technology">
                          BSIT - Automotive Technology
                        </MenuItem>
                        <MenuItem value="BSIT - Electrical Technology">
                          BSIT - Electrical Technology
                        </MenuItem>
                        <MenuItem value="BSIT - Electronics Technology">
                          BSIT - Electronics Technology
                        </MenuItem>
                        <MenuItem value="BSIT - Food Technology">
                          BSIT - Food Technology
                        </MenuItem>
                        <MenuItem value="BSIT - Fashion and Apparel Technology">
                          BSIT - Fashion and Apparel Technology
                        </MenuItem>
                        <MenuItem value="BSIT - Industrial Chemistry">
                          BSIT - Industrial Chemistry
                        </MenuItem>
                        <MenuItem value="BSIT - Drafting Technology">
                          BSIT - Drafting Technology
                        </MenuItem>
                        <MenuItem value="BSIT - Machine Shop Technology">
                          BSIT - Machine Shop Technology
                        </MenuItem>
                        <MenuItem value="BSIT - Refrigeration and Air Conditioning">
                          BSIT - Refrigeration and Air Conditioning
                        </MenuItem>

                        <ListSubheader style={{ textAlign: "center", color: "maroon" }}>
                          COLLEGE OF PUBLIC ADMINISTRATION AND CRIMINOLOGY
                        </ListSubheader>
                        <MenuItem value="Bachelor in Public Administration (BPA)">
                          Bachelor in Public Administration (BPA)
                        </MenuItem>
                        <MenuItem value="Bachelor of Science in Criminology (BSCRIM)">
                          Bachelor of Science in Criminology (BSCRIM)
                        </MenuItem>
                      </Select>
                    </FormControl>
                  ))}

                </Box>




                < br />


                {/* Year Level Dropdown */}
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography
                    style={{
                      fontSize: "13px",
                      marginRight: "10px",
                      minWidth: "150px",
                    }}
                  >
                    Year Level:  <span style={{ color: "red" }}>*</span>
                  </Typography>
                  {students.map((student) => (
                    <FormControl sx={{ width: "80%" }} size="small" key={student.person_id}>
                      <InputLabel id={`year-level-label-${student.person_id}`}>
                        Select Year Level
                      </InputLabel>
                      <Select
                        labelId={`year-level-label-${student.person_id}`}
                        id={`year-level-select-${student.person_id}`}
                        value={student.yearLevel || ""}
                        label="Select Year Level"
                        onChange={(e) => {
                          const updatedYearLevel = e.target.value;
                          const updatedStudent = { ...student, yearLevel: updatedYearLevel };

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
                        <MenuItem value="First Year">First Year</MenuItem>
                        <MenuItem value="Second Year">Second Year</MenuItem>
                        <MenuItem value="Third Year">Third Year</MenuItem>
                        <MenuItem value="Fourth Year">Fourth Year</MenuItem>
                        <MenuItem value="Fifth Year">Fifth Year</MenuItem>
                      </Select>
                    </FormControl>
                  ))}

                </Box>

              </Box>
              {applicants.map((applicant) => (
                <div

                  style={{
                    border: personID === applicant.person_id ? '2px solid blue' : '1px solid gray',
                    textAlign: 'center',
                    border: '1px solid black',
                    width: '5.08cm',
                    height: '5.08cm',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    ml: 2,
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                >
                  {uploadedImage && applicant.person_id === selectedApplicantId ? (
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : applicant.profile_picture ? (
                    <img
                      src={`http://localhost:5000/uploads/${applicant.profile_picture}`}
                      alt="Profile"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <p>No profile picture available.</p>
                  )}
                </div>
              ))}

            </Box>




            <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold" }}>Person Details:</Typography>
            <hr style={{ border: "1px solid #ccc", width: "100%" }} />
            <br />
            <Box display="flex" width="100%" alignItems="flex-start" gap={1} mb={2}>
              {/* Label beside Last Name */}
              <Box minWidth="100px" mt={1.5}>
                <Typography fontSize="15px">
                  <strong>
                    Name: <span style={{ color: "red" }}>*</span>
                  </strong>
                </Typography>
              </Box>

              {/* Student Input Fields */}
              <Box width="100%">
                {students.map((student) => (
                  <Box
                    key={student.person_id}
                    display="flex"

                    flexWrap="wrap"
                    mb={2}
                    width="100%"
                  >
                    {/* Last Name */}
                    <Box width="20%">
                      <TextField
                        label="Enter Last Name"
                        required
                        sx={{ width: "85%" }}
                        size="small"
                        value={student.last_name || ""}
                        onChange={(e) => {
                          const updatedStudent = { ...student, last_name: e.target.value };
                          setStudents((prev) =>
                            prev.map((s) =>
                              s.person_id === student.person_id ? updatedStudent : s
                            )
                          );
                        }}
                        onBlur={(e) => {
                          const updatedStudent = { ...student, last_name: e.target.value };
                          updateItem(updatedStudent); // ✅ Triggers on click, tab, or blur
                        }}
                      />
                      <Typography variant="caption">FAMILY NAME</Typography>
                    </Box>


                    {/* First Name */}
                    <Box width="20%">
                      <TextField
                        label="Enter First Name"
                        required
                        sx={{ width: "85%" }}
                        size="small"
                        value={student.first_name || ""}
                        onChange={(e) => {
                          const updatedStudent = { ...student, first_name: e.target.value };
                          setStudents((prev) =>
                            prev.map((s) =>
                              s.person_id === student.person_id ? updatedStudent : s
                            )
                          );
                        }}
                        onBlur={(e) => {
                          const updatedStudent = { ...student, first_name: e.target.value };
                          updateItem(updatedStudent); // ✅ Triggers on click, tab, or blur
                        }}
                      />
                      <Typography variant="caption">GIVEN NAME</Typography>
                    </Box>

                    {/* Middle Name */}
                    {/* Middle Name */}
                    <Box width="20%">
                      <TextField
                        label="Enter Middle Name"
                        required
                        sx={{ width: "85%" }}
                        size="small"
                        value={student.middle_name || ""}
                        onChange={(e) => {
                          const updatedStudent = { ...student, middle_name: e.target.value };
                          setStudents((prev) =>
                            prev.map((s) =>
                              s.person_id === student.person_id ? updatedStudent : s
                            )
                          );
                        }}
                        onBlur={(e) => {
                          const updatedStudent = { ...student, middle_name: e.target.value };
                          updateItem(updatedStudent); // ✅ Triggers on click, tab, or blur
                        }}
                      />
                      <Typography variant="caption">MIDDLE NAME</Typography>
                    </Box>

                    {/* Extension */}
                    <Box width="20%">
                      <FormControl sx={{ width: "85%" }} size="small">
                        <InputLabel id={`extension-label-${student.person_id}`}>EXT.</InputLabel>
                        <Select
                          labelId={`extension-label-${student.person_id}`}
                          id={`extension-select-${student.person_id}`}
                          value={student.extension || ""}
                          label="EXT."
                          onChange={(e) => {
                            const updatedStudent = { ...student, extension: e.target.value };
                            setStudents((prev) =>
                              prev.map((s) =>
                                s.person_id === student.person_id ? updatedStudent : s
                              )
                            );
                          }}
                          onBlur={(e) => {
                            const updatedStudent = { ...student, extension: e.target.value };
                            updateItem(updatedStudent); // ✅ Triggers on click, tab, or blur
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
                      <Typography variant="caption">EXTENSION</Typography>
                    </Box>

                    {/* Nickname */}
                    <Box width="20%">
                      <TextField
                        label="Enter Nickname"
                        sx={{ width: "85%" }}
                        size="small"
                        value={student.nickname || ""}
                        onChange={(e) => {
                          const updatedStudent = { ...student, nickname: e.target.value };
                          setStudents((prev) =>
                            prev.map((s) =>
                              s.person_id === student.person_id ? updatedStudent : s
                            )
                          );
                        }}
                        onBlur={(e) => {
                          const updatedStudent = { ...student, nickname: e.target.value };
                          updateItem(updatedStudent); // ✅ Triggers on click, tab, or blur
                        }}
                      />
                      <Typography variant="caption">NICKNAME</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
            {students.map((student) => (
              <Box key={student.person_id} display="flex" alignItems="center" mb={2}>
                <Typography style={{ fontSize: "12px", marginRight: "20px" }}>
                  Height:
                </Typography>
                <TextField
                  required
                  value={student.height || ""}
                  onChange={(e) => {
                    const updatedStudent = { ...student, height: e.target.value };
                    setStudents((prev) =>
                      prev.map((s) =>
                        s.person_id === student.person_id ? updatedStudent : s
                      )
                    );
                  }}
                  onBlur={(e) => {
                    const updatedStudent = { ...student, height: e.target.value };
                    updateItem(updatedStudent); // ✅ Triggers on click, tab, or blur
                  }}
                  sx={{ width: "10%", marginRight: "10px" }}
                  size="small"
                />
                cm.
                <span style={{ marginRight: "20px" }}></span>

                <Typography style={{ fontSize: "12px", marginRight: "20px" }}>
                  Weight:
                </Typography>
                <TextField
                  required
                  value={student.weight || ""}
                  onChange={(e) => {
                    const updatedStudent = { ...student, weight: e.target.value };
                    setStudents((prev) =>
                      prev.map((s) =>
                        s.person_id === student.person_id ? updatedStudent : s
                      )
                    );
                  }}
                  onBlur={(e) => {
                    const updatedStudent = { ...student, weight: e.target.value };
                    updateItem(updatedStudent); // ✅ Triggers on click, tab, or blur
                  }}
                  sx={{ width: "10%", marginRight: "10px" }}
                  size="small"
                />
                kg
              </Box>
            ))}



            {students.map((student) => (
              <Box key={student.person_id} display="flex" flexDirection="row" alignItems="center" >
                {/* Learning Reference Number */}
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography style={{ fontSize: "13px", marginRight: "10px" }}>
                    Learning Reference Number:
                  </Typography>
                  <TextField
                    label="Enter your LRN"
                    required
                    value={student.lrnNumber || ""}
                    onChange={(e) => {
                      const updatedStudent = { ...student, lrnNumber: e.target.value };
                      setStudents((prev) =>
                        prev.map((s) =>
                          s.person_id === student.person_id ? updatedStudent : s
                        )
                      );
                    }}
                    onBlur={(e) => {
                      const updatedStudent = { ...student, lrnNumber: e.target.value };
                      updateItem(updatedStudent); // ✅ Triggers on click, tab, or blur
                    }}
                    sx={{ width: "50%" }} // Adjusted width to fit on one line
                    size="small"
                    disabled={isLrnNA} // Disable when checkbox is checked
                  />
                </Box>

                {/* N/A Checkbox */}
                <FormControlLabel
                  control={<Checkbox checked={isLrnNA} onChange={handleLrnCheck} />}
                  label="N/A"
                />

                {/* Gender */}
                <Box display="flex" alignItems="center">
                  <Typography style={{ fontSize: "13px", marginRight: "10px", marginLeft: "10px" }}>
                    Gender: <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <FormControl sx={{ width: "90%" }} size="small">
                    <InputLabel id={`gender-label-${student.person_id}`}>Select Gender</InputLabel>
                    <Select
                      labelId={`gender-label-${student.person_id}`}
                      id={`gender-select-${student.person_id}`}
                      value={student.gender ?? ""}
                      style={{ marginRight: "20px" }}
                      label="Select Gender"
                      onChange={(e) => {
                        const updatedGender = e.target.value;
                        const updatedStudent = { ...student, gender: updatedGender };

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
                      <MenuItem value={0}>MALE</MenuItem>
                      <MenuItem value={1}>FEMALE</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* PWD Checkbox */}
                <FormControlLabel
                  control={<Checkbox checked={isChecked} onChange={handleCheckboxChange} />}
                  label="PWD"
                />

                {/* PWD Type and ID */}
                {isChecked && (
                  <Box display="flex" alignItems="center" gap={2}>
                    {/* Dropdown for PWD Type */}
                    <FormControl
                      variant="outlined"
                      sx={{ width: "50%", marginBottom: "16px" }}
                      size="small"
                    >
                      <InputLabel>Choose PWD Type</InputLabel>
                      <Select
                        value={student.pwdType || ""}
                        style={{ marginBottom: "-15px" }}
                        onChange={(e) => {
                          const updatedStudent = { ...student, pwdType: e.target.value };
                          setStudents((prev) =>
                            prev.map((s) =>
                              s.person_id === student.person_id ? updatedStudent : s
                            )
                          );
                          updateItem(updatedStudent); // Optional: if syncing to backend
                        }}
                        label="Choose PWD Type"
                      >
                        <MenuItem value="Blindness">Blindness</MenuItem>
                        <MenuItem value="Low-vision">Low-vision</MenuItem>
                        <MenuItem value="Leprosy Cured persons">Leprosy Cured persons</MenuItem>
                        <MenuItem value="Hearing Impairment">Hearing Impairment</MenuItem>
                        <MenuItem value="Locomotor Disability">Locomotor Disability</MenuItem>
                        <MenuItem value="Dwarfism">Dwarfism</MenuItem>
                        <MenuItem value="Intellectual Disability">Intellectual Disability</MenuItem>
                        <MenuItem value="Mental Illness">Mental Illness</MenuItem>
                        <MenuItem value="Autism Spectrum Disorder">Autism Spectrum Disorder</MenuItem>
                        <MenuItem value="Cerebral Palsy">Cerebral Palsy</MenuItem>
                        <MenuItem value="Muscular Dystrophy">Muscular Dystrophy</MenuItem>
                        <MenuItem value="Chronic Neurological conditions">Chronic Neurological conditions</MenuItem>
                        <MenuItem value="Specific Learning Disabilities">Specific Learning Disabilities</MenuItem>
                        <MenuItem value="Multiple Sclerosis">Multiple Sclerosis</MenuItem>
                        <MenuItem value="Speech and Language disability">Speech and Language disability</MenuItem>
                        <MenuItem value="Thalassemia">Thalassemia</MenuItem>
                        <MenuItem value="Hemophilia">Hemophilia</MenuItem>
                        <MenuItem value="Sickle cell disease">Sickle cell disease</MenuItem>
                        <MenuItem value="Multiple Disabilities including">Multiple Disabilities including</MenuItem>
                      </Select>
                    </FormControl>

                    {/* PWD ID Textfield */}
                    <TextField
                      label="PWD ID"
                      variant="outlined"
                      size="small"
                      value={student.pwdId || ""}
                      onChange={(e) => {
                        const updatedStudent = { ...student, pwdId: e.target.value };
                        setStudents((prev) =>
                          prev.map((s) =>
                            s.person_id === student.person_id ? updatedStudent : s
                          )
                        );
                      }}
                      onBlur={(e) => {
                        const updatedStudent = { ...student, pwdId: e.target.value };
                        updateItem(updatedStudent); // ✅ Triggers on click, tab, or blur
                      }}
                      sx={{ width: "50%" }}
                    />
                  </Box>
                )}
              </Box>
            ))}

            {students.map((student) => (
              <Box key={student.person_id} display="flex" gap={2} mb={2}>
                {/* Birthdate Field */}
                <Box width="50%">
                  <Typography style={{ fontSize: "12px", marginBottom: "5px" }}>
                    Birth of Date:
                  </Typography>
                  <TextField
                    label="Select Birthdate"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    required
                    fullWidth
                    value={student.birthOfDate || ""}
                    onChange={(e) => {
                      const updatedStudent = { ...student, birthOfDate: e.target.value };
                      setStudents((prev) =>
                        prev.map((s) =>
                          s.person_id === student.person_id ? updatedStudent : s
                        )
                      );
                    }}
                    onBlur={(e) => {
                      const updatedStudent = { ...student, birthOfDate: e.target.value };
                      updateItem(updatedStudent);
                    }}
                  />

                </Box>

                {/* Age Field */}
                <Box width="50%">
                  <Typography style={{ fontSize: "12px", marginBottom: "5px" }}>
                    Age:
                  </Typography>
                  <TextField
                    label="Enter your Age"
                    required
                    size="small"
                    fullWidth
                    value={student.age || ""}
                    onChange={(e) => {
                      const updatedStudent = { ...student, age: e.target.value };
                      setStudents((prev) =>
                        prev.map((s) =>
                          s.person_id === student.person_id ? updatedStudent : s
                        )
                      );
                    }}
                    onBlur={(e) => {
                      const updatedStudent = { ...student, age: e.target.value };
                      updateItem(updatedStudent);
                    }}
                  />

                </Box>
              </Box>
            ))}

            {students.map((student) => (
              <Box key={student.person_id} display="flex" flexDirection="column" gap={2} mb={2}>

                {/* Row 1: Birth Place & Language Dialect Spoken */}
                <Box display="flex" alignItems="center" gap={2}>
                  {/* Birth Place Field */}
                  <Box width="50%">
                    <Typography style={{ fontSize: "12px", marginBottom: "5px" }}>
                      Birth Place:
                    </Typography>
                    <TextField
                      label="Enter your Birth Place"
                      required
                      size="small"
                      fullWidth
                      value={student.birthPlace || ""}
                      onChange={(e) => {
                        const updatedStudent = { ...student, birthPlace: e.target.value };
                        setStudents((prev) =>
                          prev.map((s) =>
                            s.person_id === student.person_id ? updatedStudent : s
                          )
                        );
                      }}
                      onBlur={(e) => {
                        const updatedStudent = { ...student, birthPlace: e.target.value };
                        updateItem(updatedStudent);
                      }}
                    />
                  </Box>

                  {/* Language Dialect Spoken Field */}
                  <Box width="50%">
                    <Typography style={{ fontSize: "12px", marginBottom: "5px" }}>
                      Language Dialect Spoken:
                    </Typography>
                    <TextField
                      label="Enter your Language Dialect Spoken"
                      required
                      size="small"
                      fullWidth
                      value={student.languageDialectSpoken || ""}
                      onChange={(e) => {
                        const updatedStudent = { ...student, languageDialectSpoken: e.target.value };
                        setStudents((prev) =>
                          prev.map((s) =>
                            s.person_id === student.person_id ? updatedStudent : s
                          )
                        );
                      }}
                      onBlur={(e) => {
                        const updatedStudent = { ...student, languageDialectSpoken: e.target.value };
                        updateItem(updatedStudent);
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            ))}



            {students.map((student) => (
              <Box key={student.person_id} display="flex" alignItems="center" gap={2} mb={2}>
                {/* Citizenship Field */}
                <FormControl sx={{ width: "50%" }} size="small" required>
                  <Typography style={{ fontSize: "12px", marginBottom: "5px" }}>
                    Citizenship:
                  </Typography>
                  <Select
                    value={student.citizenship || ""}
                    onChange={(e) => {
                      const updatedStudent = { ...student, citizenship: e.target.value };
                      setStudents((prev) =>
                        prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                      );
                      updateItem(updatedStudent);
                    }}
                  >
                    <MenuItem value="">- Select Citizenship -</MenuItem>
                    {[
                      "AFGHAN", "ALBANIAN", "ARAB", "ARGENTINIAN", "AUSTRALIAN", "AUSTRIAN", "BELGIAN", "BANGLADESHI", "BAHAMIAN",
                      "BHUTANESE", "BERMUDAN", "BOLIVIAN", "BRAZILIAN", "BRUNEI", "BOTSWANIAN", "CANADIAN", "CHILE", "CHINESE",
                      "COLOMBIAN", "COSTA RICAN", "CUBAN", "CYPRIOT", "CZECH", "DANISH", "DOMINICAN", "ALGERIAN", "EGYPTIAN",
                      "SPANISH", "ESTONIAN", "ETHIOPIAN", "FIJI", "FILIPINO", "FINISH", "FRENCH", "BRITISH", "GERMAN", "GHANAIAN",
                      "GREEK", "GUAMANIAN", "GUATEMALAN", "HONG KONG", "CROATIAN", "HAITIAN", "HUNGARIAN", "INDONESIAN", "INDIAN",
                      "IRANIAN", "IRAQI", "IRISH", "ICELANDER", "ISRAELI", "ITALIAN", "JAMAICAN", "JORDANIAN", "JAPANESE", "CAMBODIAN",
                      "KOREAN", "KUWAITI", "KENYAN", "LAOTIAN", "LEBANESE", "LIBYAN", "LUXEMBURGER", "MALAYSIAN", "MOROCCAN", "MEXICAN",
                      "BURMESE", "MYANMAR", "NIGERIAN", "NOT INDICATED", "DUTCH", "NORWEGIAN", "NEPALI", "NEW ZEALANDER", "OMANI",
                      "PAKISTANI", "PANAMANIAN", "PERUVIAN", "PAPUAN", "POLISH", "PUERTO RICAN", "PORTUGUESE", "PARAGUAYAN",
                      "PALESTINIAN", "QATARI", "ROMANIAN", "RUSSIAN", "RWANDAN", "SAUDI ARABIAN", "SUDANESE", "SINGAPOREAN",
                      "SRI LANKAN", "EL SALVADORIAN", "SOMALIAN", "SLOVAK", "SWEDISH", "SWISS", "SYRIAN", "THAI", "TRINIDAD AND TOBAGO",
                      "TUNISIAN", "TURKISH", "TAIWANESE", "UKRAINIAN", "URUGUAYAN", "UNITED STATES", "VENEZUELAN", "VIRGIN ISLANDS",
                      "VIETNAMESE", "YEMENI", "YUGOSLAVIAN", "SOUTH AFRICAN", "ZAIREAN", "ZIMBABWEAN", "Others"
                    ].map((nation) => (
                      <MenuItem key={nation} value={nation}>{nation}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Religion Field */}
                <FormControl sx={{ width: "50%" }} size="small" required>
                  <Typography style={{ fontSize: "12px", marginBottom: "5px" }}>
                    Religion:
                  </Typography>
                  <Select
                    value={student.religion || ""}
                    onChange={(e) => {
                      const updatedStudent = { ...student, religion: e.target.value };
                      setStudents((prev) =>
                        prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                      );
                      updateItem(updatedStudent);
                    }}
                  >
                    <MenuItem value="">- Select Religion -</MenuItem>
                    {[
                      "Jehovah's Witness", "Buddist", "Catholic", "Dating Daan", "Pagano", "Atheist", "Born Again",
                      "Adventis", "Baptist", "Mormons", "Free Methodist", "Christian", "Protestant", "Aglipay", "Islam",
                      "LDS", "Seventh Day Adventist", "Iglesia Ni Cristo", "UCCP", "PMCC", "Baha'i Faith", "None", "Others"
                    ].map((religion) => (
                      <MenuItem key={religion} value={religion}>{religion}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            ))}





            <Box display="flex" alignItems="center" gap={2} mb={2}>
              {/* Civil Status */}

              {students.map((student) => (
                <FormControl sx={{ width: "33%" }} size="small" key={`civil-${student.person_id}`}>
                  <InputLabel id={`civil-status-label-${student.person_id}`}>Civil Status</InputLabel>
                  <Select
                    labelId={`civil-status-label-${student.person_id}`}
                    id={`civil-status-select-${student.person_id}`}
                    value={student.civilStatus || ""}
                    label="Civil Status"
                    onChange={(e) => {
                      const updatedCivilStatus = e.target.value;
                      const updatedStudents = [...students];
                      const studentIndex = updatedStudents.findIndex((s) => s.person_id === student.person_id);
                      if (studentIndex !== -1) {
                        updatedStudents[studentIndex] = { ...updatedStudents[studentIndex], civilStatus: updatedCivilStatus };
                      }
                      setStudents(updatedStudents);
                      updateItem(updatedStudents[studentIndex]);
                    }}
                  >
                    <MenuItem value="-civil status-">- civil status -</MenuItem>
                    <MenuItem value="Single">Single</MenuItem>
                    <MenuItem value="Married">Married</MenuItem>
                    <MenuItem value="Legally Seperated">Legally Seperated</MenuItem>
                    <MenuItem value="Widowed">Widowed</MenuItem>
                    <MenuItem value="Solo Parent">Solo Parent</MenuItem>
                  </Select>
                </FormControl>
              ))}




              {students.map((student) => (
                <FormControl sx={{ width: "33%" }} size="small" key={student.person_id}>
                  <InputLabel id={`ethnic-group-label-${student.person_id}`}>Select Tribe / Ethnic Group</InputLabel>
                  <Select
                    labelId={`ethnic-group-label-${student.person_id}`}
                    id={`ethnic-group-select-${student.person_id}`}
                    value={student.tribeEthnicGroup || ""}
                    label="Select Tribe / Ethnic Group"
                    onChange={(e) => {
                      const updatedTribeEthnicGroup = e.target.value;
                      const updatedStudents = [...students]; // Create a copy of the students array
                      const studentIndex = updatedStudents.findIndex((s) => s.person_id === student.person_id);

                      if (studentIndex !== -1) {
                        updatedStudents[studentIndex] = { ...updatedStudents[studentIndex], tribeEthnicGroup: updatedTribeEthnicGroup };
                      }

                      // Update local state
                      setStudents(updatedStudents);

                      // Immediately update backend
                      updateItem(updatedStudents[studentIndex]);
                    }}
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
              ))}

              {students.map((student) => (
                <TextField
                  key={`other-ethnic-${student.person_id}`}
                  label="Other Ethnic Group"
                  value={student.otherEthnicGroup || ""}
                  style={{ width: "33%" }}
                  size="small"
                  onChange={(e) => {
                    const updatedStudent = { ...student, otherEthnicGroup: e.target.value };
                    setStudents((prev) =>
                      prev.map((s) =>
                        s.person_id === student.person_id ? updatedStudent : s
                      )
                    );
                  }}
                  onBlur={(e) => {
                    const updatedStudent = { ...student, otherEthnicGroup: e.target.value };
                    updateItem(updatedStudent);
                  }}
                />
              ))}


            </Box>

            <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold" }}>
              Contact Information:
            </Typography>
            <hr style={{ border: "1px solid #ccc", width: "100%" }} />
            {students.map((student) => (
              <Box key={student.person_id} display="flex" gap={2} mb={2}>
                {/* Cellphone Number Field */}
                <Box width="50%">
                  <Typography
                    style={{
                      fontSize: "13px",
                      marginRight: "10px",
                      minWidth: "150px",
                    }}
                  >
                    Cellphone Number: <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    label="Enter Cellphone Number"
                    required
                    fullWidth
                    size="small"
                    value={student.cellphoneNumber || ""}
                    onChange={(e) => {
                      const updatedStudent = { ...student, cellphoneNumber: e.target.value };
                      setStudents((prev) =>
                        prev.map((s) =>
                          s.person_id === student.person_id ? updatedStudent : s
                        )
                      );
                    }}
                    onBlur={(e) => {
                      const updatedStudent = { ...student, cellphoneNumber: e.target.value };
                      updateItem(updatedStudent);
                    }}
                  />
                </Box>

                {/* Email Address Field */}
                <Box width="50%">
                  <Typography
                    style={{
                      fontSize: "13px",
                      marginRight: "10px",
                      minWidth: "150px",
                    }}
                  >
                    Email Address: <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    label="Enter Email Address"
                    required
                    fullWidth
                    size="small"
                    value={student.emailAddress || ""}
                    onChange={(e) => {
                      const updatedStudent = { ...student, emailAddress: e.target.value };
                      setStudents((prev) =>
                        prev.map((s) =>
                          s.person_id === student.person_id ? updatedStudent : s
                        )
                      );
                    }}
                    onBlur={(e) => {
                      const updatedStudent = { ...student, emailAddress: e.target.value };
                      updateItem(updatedStudent);
                    }}
                  />
                </Box>
              </Box>
            ))}



            {students.map((student) => (
              <Box key={student.person_id} display="flex" gap={2} mt={1}>
                {/* Telephone Number Field */}
                <Box width="50%">
                  <Typography
                    style={{
                      fontSize: "13px",
                      marginRight: "10px",
                      minWidth: "150px",
                    }}
                  >
                    Telephone Number: <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    label="Enter Telephone Number"
                    required
                    fullWidth
                    size="small"
                    value={student.telephoneNumber || ""}
                    onChange={(e) => {
                      const updatedStudent = { ...student, telephoneNumber: e.target.value };
                      setStudents((prev) =>
                        prev.map((s) =>
                          s.person_id === student.person_id ? updatedStudent : s
                        )
                      );
                    }}
                    onBlur={(e) => {
                      const updatedStudent = { ...student, telephoneNumber: e.target.value };
                      updateItem(updatedStudent);
                    }}
                  />
                </Box>

                {/* Facebook Account Field */}
                <Box width="50%">
                  <Typography
                    style={{
                      fontSize: "13px",
                      marginRight: "10px",
                      minWidth: "150px",
                    }}
                  >
                    Facebook Account: <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    label="Enter Facebook Account"
                    required
                    fullWidth
                    size="small"
                    value={student.facebookAccount || ""}
                    onChange={(e) => {
                      const updatedStudent = { ...student, facebookAccount: e.target.value };
                      setStudents((prev) =>
                        prev.map((s) =>
                          s.person_id === student.person_id ? updatedStudent : s
                        )
                      );
                    }}
                    onBlur={(e) => {
                      const updatedStudent = { ...student, facebookAccount: e.target.value };
                      updateItem(updatedStudent);
                    }}
                  />
                </Box>
              </Box>
            ))}

            < br />


            <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold" }}>Present Address:</Typography>
            <hr style={{ border: "1px solid #ccc", width: "100%", }} />


            {/* Present Address Fields (3 in a row) */}
            {students.map((student) => (
              <Box key={student.person_id} display="flex" gap={2} mt={1}>
                {/* Present Address Street */}
                <Box width="50%">
                  <Typography
                    style={{
                      fontSize: "13px",
                      marginRight: "10px",
                      minWidth: "150px",
                    }}
                  >
                    Present Address: <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    label="Enter Street"
                    required
                    fullWidth
                    size="small"
                    value={student.presentStreet || ""}
                    onChange={(e) => {
                      const updatedStudent = { ...student, presentStreet: e.target.value };
                      setStudents((prev) =>
                        prev.map((s) =>
                          s.person_id === student.person_id ? updatedStudent : s
                        )
                      );
                    }}
                    onBlur={(e) => {
                      const updatedStudent = { ...student, presentStreet: e.target.value };
                      updateItem(updatedStudent);
                    }}
                  />
                </Box>

                {/* ZIP Code */}
                <Box width="50%">
                  <Typography
                    style={{
                      fontSize: "13px",
                      marginRight: "10px",
                      minWidth: "150px",
                    }}
                  >
                    Zip Code: <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    label="Enter ZIP Code"
                    required
                    fullWidth
                    size="small"
                    value={student.presentZipCode || ""}
                    onChange={(e) => {
                      const updatedStudent = { ...student, presentZipCode: e.target.value };
                      setStudents((prev) =>
                        prev.map((s) =>
                          s.person_id === student.person_id ? updatedStudent : s
                        )
                      );
                    }}
                    onBlur={(e) => {
                      const updatedStudent = { ...student, presentZipCode: e.target.value };
                      updateItem(updatedStudent);
                    }}
                  />
                </Box>
              </Box>
            ))}


            {students.map((student) => (
              <React.Fragment key={student.person_id}>
                {/* Present Region & Province in one row */}
                <Box width="100%" mt={1} display="flex" gap={2}>
                  {/* Present Region */}
                  <Box width="50%">
                    <Typography style={{ fontSize: "13px", marginBottom: "5px" }}>
                      Region: <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <FormControl sx={{ width: "100%" }} size="small">
                      <InputLabel>Select Region</InputLabel>
                      <Select
                        id={`region-select-${student.person_id}`}
                        value={student.presentRegion || ""}
                        label="Select Region"
                        onChange={(e) => {
                          const regionName = e.target.value;
                          const selectedRegion = regionList.find((r) => r.region_name === regionName);

                          setLoading(true);
                          provinces(selectedRegion.region_code).then((prov) => {
                            const updatedStudent = {
                              ...student,
                              presentRegion: regionName,
                              presentProvince: "",
                              presentMunicipality: "",
                              presentBarangay: "",
                              presentProvinceList: prov,
                              presentCityList: [],
                              presentBarangayList: [],
                            };
                            setStudents((prev) =>
                              prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                            );
                            setLoading(false);
                            updateItem(updatedStudent); // ✅ Saving presentRegion
                          });
                        }}
                      >
                        {regionList.map((region) => (
                          <MenuItem key={region.region_code} value={region.region_name}>
                            {region.region_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Present Province */}
                  <Box width="50%">
                    <Typography style={{ fontSize: "13px", marginBottom: "5px" }}>
                      Province: <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <FormControl sx={{ width: "100%" }} size="small" disabled={!student.presentProvinceList?.length}>
                      <InputLabel>Select Province</InputLabel>
                      <Select
                        id={`province-select-${student.person_id}`}
                        value={student.presentProvince || ""}
                        label="Select Province"
                        onChange={(e) => {
                          const provinceName = e.target.value;
                          const selectedProvince = student.presentProvinceList.find(
                            (p) => p.province_name === provinceName
                          );

                          setLoading(true);
                          cities(selectedProvince.province_code).then((cityList) => {
                            const updatedStudent = {
                              ...student,
                              presentProvince: provinceName,
                              presentMunicipality: "",
                              presentBarangay: "",
                              presentCityList: cityList,
                              presentBarangayList: [],
                            };
                            setStudents((prev) =>
                              prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                            );
                            setLoading(false);
                            updateItem(updatedStudent); // ✅ Saving presentProvince
                          });
                        }}
                      >
                        {student.presentProvinceList?.map((province) => (
                          <MenuItem key={province.province_code} value={province.province_name}>
                            {province.province_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                {/* Municipality and Barangay */}
                <Box width="100%" mt={1} display="flex" gap={2}>
                  {/* Municipality/City */}
                  <Box width="50%">
                    <Typography style={{ fontSize: "13px", marginBottom: "5px" }}>
                      Municipality/City: <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <FormControl sx={{ width: "100%" }} size="small" disabled={!student.presentCityList?.length}>
                      <InputLabel>Select Municipality</InputLabel>
                      <Select
                        id={`municipality-select-${student.person_id}`}
                        value={student.presentMunicipality || ""}
                        label="Select Municipality"
                        onChange={(e) => {
                          const cityName = e.target.value;
                          const selectedCity = student.presentCityList.find(
                            (c) => c.city_name === cityName
                          );

                          setLoading(true);
                          barangays(selectedCity.city_code).then((brgyList) => {
                            const updatedStudent = {
                              ...student,
                              presentMunicipality: cityName,
                              presentBarangay: "",
                              presentBarangayList: brgyList,
                            };
                            setStudents((prev) =>
                              prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                            );
                            setLoading(false);
                            updateItem(updatedStudent); // ✅ Saving presentMunicipality
                          });
                        }}
                      >
                        {student.presentCityList?.map((city) => (
                          <MenuItem key={city.city_code} value={city.city_name}>
                            {city.city_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Barangay */}
                  <Box width="50%">
                    <Typography style={{ fontSize: "13px", marginBottom: "5px" }}>
                      Barangay: <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <FormControl sx={{ width: "100%" }} size="small" disabled={!student.presentBarangayList?.length}>
                      <InputLabel>Select Barangay</InputLabel>
                      <Select
                        id={`barangay-select-${student.person_id}`}
                        value={student.presentBarangay || ""}
                        label="Select Barangay"
                        onChange={(e) => {
                          const barangayName = e.target.value;
                          const updatedStudent = {
                            ...student,
                            presentBarangay: barangayName,
                          };
                          setStudents((prev) =>
                            prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                          );
                          updateItem(updatedStudent); // ✅ Saving presentBarangay
                        }}
                      >
                        {student.presentBarangayList?.map((brgy) => (
                          <MenuItem key={brgy.brgy_code} value={brgy.brgy_name}>
                            {brgy.brgy_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </React.Fragment>
            ))}



            {/* DSWD Household Number */}
            {students.map((student) => (
              <Box key={student.person_id} width="100%" mt={1}>
                <Typography
                  style={{
                    fontSize: "13px",
                    marginRight: "10px",
                    minWidth: "150px",
                  }}
                >
                  DSWD Household: <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  label="Enter Household Number"
                  required
                  fullWidth
                  size="small"
                  value={student.presentDswdHouseholdNumber || ""}
                  onChange={(e) => {
                    const updatedStudent = {
                      ...student,
                      presentDswdHouseholdNumber: e.target.value,
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
                      presentDswdHouseholdNumber: e.target.value,
                    };
                    updateItem(updatedStudent);
                  }}
                />
              </Box>
            ))}



            {students.map((student) => (
              <React.Fragment key={student.person_id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sameAsPresent[student.person_id] || false}
                      onChange={(e) => {
                        const isChecked = e.target.checked;

                        // First update the sameAsPresent state
                        setSameAsPresent((prev) => ({
                          ...prev,
                          [student.person_id]: isChecked,
                        }));

                        // Then update student fields if checked
                        if (isChecked) {
                          const updatedStudent = {
                            ...student,
                            permanentStreet: student.presentStreet || "",
                            permanentRegion: student.presentRegion || "",
                            permanentProvince: student.presentProvince || "",
                            permanentMunicipality: student.presentMunicipality || "",
                            permanentBarangay: student.presentBarangay || "",
                            permanentZipCode: student.presentZipCode || "",
                          };

                          setStudents((prev) =>
                            prev.map((s) =>
                              s.person_id === student.person_id ? updatedStudent : s
                            )
                          );

                          updateItem(updatedStudent);
                        }
                      }}
                    />
                  }
                  label="Same as Present Address"
                />

                {/* Other permanent address fields */}
              </React.Fragment>
            ))}


            {/* Permanent Address Title */}
            <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold" }}>
              Permanent Address:
            </Typography>
            <hr style={{ border: "1px solid #ccc", width: "100%" }} />


            {/* Permanent Address Row Fields */}
            {students.map((student) => (
              <Box key={student.person_id} display="flex" gap={2} mt={1}>
                <Box width="50%">
                  <Typography
                    style={{
                      fontSize: "13px",
                      marginRight: "10px",
                      minWidth: "150px",
                    }}
                  >
                    Permanent Address Street: <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    label="Enter Street"
                    required
                    sx={{ width: "100%", marginRight: "20px" }}
                    size="small"
                    value={student.permanentStreet || ""}
                    onChange={(e) => {
                      const updatedStudent = {
                        ...student,
                        permanentStreet: e.target.value,
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
                        permanentStreet: e.target.value,
                      };
                      updateItem(updatedStudent);
                    }}
                  />
                </Box>

                <Box width="50%">
                  <Typography
                    style={{
                      fontSize: "13px",
                      marginRight: "10px",
                      minWidth: "150px",
                    }}
                  >
                    Zip Code: <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    label="Enter ZIP Code"
                    required
                    sx={{ width: "100%", marginRight: "20px" }}
                    size="small"
                    value={student.permanentZipCode || ""}
                    onChange={(e) => {
                      const updatedStudent = {
                        ...student,
                        permanentZipCode: e.target.value,
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
                        permanentZipCode: e.target.value,
                      };
                      updateItem(updatedStudent);
                    }}
                  />
                </Box>
              </Box>
            ))}

            {students.map((student) => (
              <React.Fragment key={student.person_id}>
                {/* Permanent Region and Province */}
                <Box display="flex" gap={2} width="100%" mt={1}>
                  {/* Permanent Region */}
                  <Box width="50%">
                    <Typography style={{ fontSize: "13px", marginBottom: "5px" }}>
                      Permanent Region: <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <FormControl sx={{ width: "100%" }} size="small">
                      <InputLabel>Select Region</InputLabel>
                      <Select
                        id={`permanent-region-select-${student.person_id}`}
                        value={student.permanentRegion || ""}
                        label="Select Region"
                        onChange={(e) => {
                          const regionName = e.target.value;
                          const selectedRegion = regionList.find(r => r.region_name === regionName);

                          setLoading(true);
                          provinces(selectedRegion.region_code).then((prov) => {
                            const updatedStudent = {
                              ...student,
                              permanentRegion: regionName,
                              permanentProvince: "",
                              permanentMunicipality: "",
                              permanentBarangay: "",
                              permanentProvinceList: prov,
                              permanentCityList: [],
                              permanentBarangayList: [],
                            };
                            setStudents((prev) =>
                              prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                            );
                            setLoading(false);
                            updateItem(updatedStudent);
                          });
                        }}
                      >
                        {regionList.map((region) => (
                          <MenuItem key={region.region_code} value={region.region_name}>
                            {region.region_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Permanent Province */}
                  <Box width="50%">
                    <Typography style={{ fontSize: "13px", marginBottom: "5px" }}>
                      Permanent Province: <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <FormControl
                      sx={{ width: "100%" }}
                      size="small"
                      disabled={!student.permanentProvinceList?.length}
                    >
                      <InputLabel>Select Province</InputLabel>
                      <Select
                        id={`permanent-province-select-${student.person_id}`}
                        value={student.permanentProvince || ""}
                        label="Select Province"
                        onChange={(e) => {
                          const provinceName = e.target.value;
                          const selectedProvince = student.permanentProvinceList.find(
                            (p) => p.province_name === provinceName
                          );

                          setLoading(true);
                          cities(selectedProvince.province_code).then((cityList) => {
                            const updatedStudent = {
                              ...student,
                              permanentProvince: provinceName,
                              permanentMunicipality: "",
                              permanentBarangay: "",
                              permanentCityList: cityList,
                              permanentBarangayList: [],
                            };
                            setStudents((prev) =>
                              prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                            );
                            setLoading(false);
                            updateItem(updatedStudent);
                          });
                        }}
                      >
                        {student.permanentProvinceList?.map((province) => (
                          <MenuItem key={province.province_code} value={province.province_name}>
                            {province.province_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                {/* Permanent Municipality and Barangay */}
                <Box display="flex" gap={2} width="100%" mt={1}>
                  {/* Permanent Municipality */}
                  <Box width="50%">
                    <Typography style={{ fontSize: "13px", marginBottom: "5px" }}>
                      Permanent Municipality: <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <FormControl
                      sx={{ width: "100%" }}
                      size="small"
                      disabled={!student.permanentCityList?.length}
                    >
                      <InputLabel>Select Municipality</InputLabel>
                      <Select
                        id={`permanent-municipality-select-${student.person_id}`}
                        value={student.permanentMunicipality || ""}
                        label="Select Municipality"
                        onChange={(e) => {
                          const municipalityName = e.target.value;
                          const selectedCity = student.permanentCityList.find(
                            (c) => c.city_name === municipalityName
                          );

                          setLoading(true);
                          barangays(selectedCity.city_code).then((brgyList) => {
                            const updatedStudent = {
                              ...student,
                              permanentMunicipality: municipalityName,
                              permanentBarangay: "",
                              permanentBarangayList: brgyList,
                            };
                            setStudents((prev) =>
                              prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                            );
                            setLoading(false);
                            updateItem(updatedStudent);
                          });
                        }}
                      >
                        {student.permanentCityList?.map((city) => (
                          <MenuItem key={city.city_code} value={city.city_name}>
                            {city.city_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Permanent Barangay */}
                  <Box width="50%">
                    <Typography style={{ fontSize: "13px", marginBottom: "5px" }}>
                      Permanent Barangay: <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <FormControl
                      sx={{ width: "100%" }}
                      size="small"
                      disabled={!student.permanentBarangayList?.length}
                    >
                      <InputLabel>Select Barangay</InputLabel>
                      <Select
                        id={`permanent-barangay-select-${student.person_id}`}
                        value={student.permanentBarangay || ""}
                        label="Select Barangay"
                        onChange={(e) => {
                          const barangayName = e.target.value;
                          const selectedBrgy = student.permanentBarangayList.find(
                            (b) => b.brgy_name === barangayName
                          );

                          const updatedStudent = {
                            ...student,
                            permanentBarangay: barangayName,
                          };
                          setStudents((prev) =>
                            prev.map((s) => (s.person_id === student.person_id ? updatedStudent : s))
                          );
                          updateItem(updatedStudent);
                        }}
                      >
                        {student.permanentBarangayList?.map((brgy) => (
                          <MenuItem key={brgy.brgy_code} value={brgy.brgy_name}>
                            {brgy.brgy_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </React.Fragment>
            ))}


            {students.map((student) => (
              <Box key={student.person_id} width="100%" mt={1}>
                <Typography
                  style={{
                    fontSize: "13px",
                    marginRight: "10px",
                    minWidth: "150px",
                  }}
                >
                  DSWD Household: <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  label="Enter Household Number"
                  required
                  sx={{ width: "100%", marginRight: "20px" }}
                  size="small"
                  value={student.permanentDswdHouseholdNumber || ""}
                  onChange={(e) => {
                    const updatedStudent = {
                      ...student,
                      permanentDswdHouseholdNumber: e.target.value,
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
                      permanentDswdHouseholdNumber: e.target.value,
                    };
                    updateItem(updatedStudent);
                  }}
                />
              </Box>
            ))}


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
                  {/* Close Button */}
                  <Button
                    onClick={handleClose}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      minWidth: 0,
                      width: 32,
                      height: 32,
                      padding: 0,
                      borderRadius: '10%',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      lineHeight: 1,
                      color: 'white',
                      backgroundColor: '#6D2323',
                      '&:hover': {
                        backgroundColor: '#b71c1c',
                      },
                    }}
                  >
                    X
                  </Button>

                  {/* Header */}
                  <Box sx={{ bgcolor: '#6D2323', color: 'white', p: 2, borderRadius: 1 }}>
                    <Typography style={{ textAlign: 'center', fontWeight: "bold" }} variant="h6" gutterBottom>
                      Upload Your Photo
                    </Typography>
                  </Box>

                  {/* Preview Area */}
                  <Box
                    sx={{
                      border: '3px solid black',
                      p: 2,
                      borderRadius: 1,
                      mb: 2,
                    }}
                  >
                    {preview && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2, position: 'relative' }}>
                        <Box
                          component="img"
                          src={preview}
                          alt="Preview"
                          sx={{
                            width: '210px',
                            height: '210px',
                            objectFit: 'cover',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                          }}
                        />
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
                    onClick={(e) => (e.target.value = null)}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setSelectedFile(file);
                        setPreview(URL.createObjectURL(file));
                      }
                    }}
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
                    onClick={async () => {
                      if (!selectedFile || !selectedApplicantId) return;

                      const pictureData = new FormData();
                      pictureData.append('profile_picture', selectedFile);
                      pictureData.append('person_id', selectedApplicantId);

                      try {
                        await axios.post('http://localhost:5000/api/upload-profile-picture', pictureData, {
                          headers: { 'Content-Type': 'multipart/form-data' },
                        });

                        alert('Profile picture uploaded successfully!');
                        setUploadedImage(URL.createObjectURL(selectedFile));
                        setOpen(false); // Close modal
                      } catch (error) {
                        console.error(error);
                        alert('Profile picture upload failed.');
                      }
                    }}
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
              {applicants.map((applicant) => (
                <Button
                  key={applicant.id}
                  onClick={() => {
                    setPersonID(applicant.person_id);
                    setSelectedApplicantId(applicant.person_id);
                    setOpen(true); // Open modal
                  }}
                  variant="contained"
                  sx={{
                    backgroundColor: '#6D2323',
                    color: '#fff',
                    marginRight: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': {
                      backgroundColor: '#E8C999',
                      color: '#000',
                      '& .MuiSvgIcon-root': {
                        color: '#000',
                      },
                    },
                  }}
                >
                  <PhotoCameraIcon
                    sx={{
                      marginRight: '8px',
                      color: '#fff',
                      transition: 'color 0.3s',
                    }}
                  />
                  Upload Photo <br /> Student Picture
                </Button>
              ))}

              {/* Next Step Button */}
              <Button
                variant="contained"
                component={Link}
                to="/applicant_family_background"
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

export default ApplicantPersonalInfoForm;