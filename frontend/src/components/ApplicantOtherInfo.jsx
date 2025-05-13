import React, { useState, useEffect } from "react";
import axios from "axios";
import {Button, Box, Container, Typography, Checkbox, FormGroup, FormControlLabel} from "@mui/material";
import { Link } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import SchoolIcon from "@mui/icons-material/School";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import InfoIcon from "@mui/icons-material/Info";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FolderIcon from '@mui/icons-material/Folder';
import { jwtDecode } from "jwt-decode";

const ApplicantOtherInformation = () => {
    const getPersonIdFromToken = () => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            console.log("Decoded Token: ", decoded);
            return decoded.person_id;
        }
        return null;
    };

    const [data, setData] = useState([]);
    const [students, setStudents] = useState([]);
    const personIDFromToken = getPersonIdFromToken();
    const [personID, setPersonID] = useState('');

    useEffect(() => {
        axios
            .get("http://localhost:5000/person_table")
            .then((res) => setStudents(res.data))
            .catch((err) => console.error("Fetch error:", err));
    }, []);

    useEffect(() => {
        const fetchOtherInformation = async () => {
            if (!personID) return;

            try {
                const response = await axios.get("http://localhost:5000/person_table");
                const filtered = response.data.filter(item => String(item.person_id) === String(personID));
                setData(filtered);
            } catch (err) {
                console.error("Failed to fetch other information:", err);
            }
        };

        fetchOtherInformation();
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

    useEffect(() => {
        fetchOtherInformationData();
    }, []);

    const fetchOtherInformationData = async () => {
        try {
            const result = await axios.get("http://localhost:5000/person_table");
            // Process result if needed
        } catch (error) {
            console.error("Error fetching Other Information:", error);
        }
    };

    const [step, setStep] = useState(4);
    const steps = [
        { label: 'Personal Information', icon: <PersonIcon />, path: '/applicant_personal_information' },
        { label: 'Family Background', icon: <FamilyRestroomIcon />, path: '/applicant_family_background' },
        { label: 'Educational Attainment', icon: <SchoolIcon />, path: '/applicant_educational_attainment' },
        { label: 'Health Medical Records', icon: <HealthAndSafetyIcon />, path: '/applicant_health_medical_records' },
        { label: 'Other Information', icon: <InfoIcon />, path: '/applicant_other_information' },
      ];
    


    const [activeStep, setActiveStep] = useState(4);
    const [clickedSteps, setClickedSteps] = useState(Array(steps.length).fill(false));




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
                            <Typography style={{ fontSize: "20px", padding: "10px", fontFamily: "Arial Black" }}>Step 5: Other Information</Typography>
                        </Box>
                    </Container>
                    <Container maxWidth="100%" sx={{ backgroundColor: "white", border: "2px solid black", padding: 4, borderRadius: 2, boxShadow: 3 }}>
                        <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold" }}>
                            Other Information:
                        </Typography>
                        <hr style={{ border: "1px solid #ccc", width: "100%" }} />
                        <Typography style={{ fontWeight: "bold", textAlign: "Center" }}>
                            Data Subject Consent Form
                        </Typography>
                        < br />
                        <Typography style={{ fontSize: "12px", fontFamily: "Arial", textAlign: "Left" }}>
                            In accordance with RA 10173 or Data Privacy Act of 2012, I give my consent to the following terms and conditions on the collection, use, processing, and disclosure of my personal data:
                        </Typography>
                        < br />
                        <Typography style={{ fontSize: "12px", fontFamily: "Arial", textAlign: "Left" }}>
                            1. I am aware that the Eulogio "Amang" Rodriguez Institute of Science and Technology (EARIST) has collected and stored my personal data during my admission/enrollment at EARIST. This data includes my demographic profile, contact details like home address, email address, landline numbers, and mobile numbers.
                        </Typography>
                        <Typography style={{ fontSize: "12px", fontFamily: "Arial", textAlign: "Left" }}>
                            2. I agree to personally update these data through personal request from the Office of the registrar.
                        </Typography>
                        <Typography style={{ fontSize: "12px", fontFamily: "Arial", textAlign: "Left" }}>
                            3. In consonance with the above stated Act, I am aware that the University will protect my school records related to my being a student/graduated of EARIST. However, I have the right to authorize a representative to claim the same subject to the policy of the University.
                        </Typography>

                        <Typography style={{ fontSize: "12px", fontFamily: "Arial", textAlign: "Left" }}>
                            4. In order to promote efficient management of the organization’s records, I authorize the University to manage my data for data sharing with industry partners, government agencies/embassies, other educational institutions, and other offices for the university for employment, statistics, immigration, transfer credentials, and other legal purposes that may serve me best.
                        </Typography>
                        < br />
                        <Typography style={{ fontSize: "12px", fontFamily: "Arial", textAlign: "Left" }}>
                            By clicking the submit button, I warrant that I have read, understood all of the above provisions, and agreed to its full implementation.
                        </Typography>
                        <hr style={{ border: "1px solid #ccc", width: "100%" }} />
                        < br />
                        <Typography style={{ fontSize: "12px", fontFamily: "Arial", textAlign: "Left" }}>
                            I certify that the information given above are true, complete, and accurate to the best of my knowledge and belief. I promise to abide by the rules and regulations of Eulogio "Amang" Rodriguez Institute of Science and Technology regarding the ECAT and my possible admission. I am aware that any false or misleading information and/or statement may result in the refusal or disqualification of my admission to the institution.
                        </Typography>
                        <div className="App">
                            {students.map((student) => (
                                <React.Fragment key={student.person_id}>
                                    <FormGroup row sx={{ ml: 2 }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="agreedToTerms"
                                                    checked={student.termsOfAgreement === 1}
                                                    onChange={(e) => {
                                                        const updatedStudent = {
                                                            ...student,
                                                            termsOfAgreement: e.target.checked ? 1 : 0,
                                                        };
                                                        setStudents([updatedStudent]); // Only 1 student
                                                        updateItem(updatedStudent);
                                                    }}
                                                />
                                            }
                                            label="I agree with Terms and References"
                                            sx={{
                                                fontSize: '12px',
                                                fontFamily: 'Arial',
                                                textAlign: 'left',
                                            }}
                                        />
                                    </FormGroup>
                                </React.Fragment>
                            ))}
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

                            {/* Next Step (Submit) Button */}
                            <Button
                                variant="contained"
                                component={Link}
                                to="/applicant_personal_information"
                                endIcon={
                                    <FolderIcon
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
                                Submit (Save Information)
                            </Button>
                        </Box>
                    </Container>

                </form>
            </Container>
        </Box>
    );
};

export default ApplicantOtherInformation;