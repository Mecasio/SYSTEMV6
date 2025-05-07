import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Grid, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, TextField, MenuItem, Container } from "@mui/material";
import LinearWithValueLabel from './LinearWithValueLabel';
import { jwtDecode } from "jwt-decode";
import FreeTuitionImage from "../assets/FREETUITION.png";
import EaristLogo from "../assets/EaristLogo.png";
import TempPicture from "../assets/TempPicture.jpg";
import '../styles/Print.css';
const SearchStudentCOR = () => {

  const getPersonIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      console.log("Decoded Token: ", decoded);
      return decoded.person_id; // Make sure your token contains this field
    }
    return null;
  };

  const [data, setData] = useState([]);
  const personIDFromToken = getPersonIdFromToken();

  const filteredData = data.filter((item) => String(item.person_id) === String(personIDFromToken));


  const [profilePicture, setProfilePicture] = useState(null);
  const [personID, setPersonID] = useState('');


  useEffect(() => {
    const fetchCORData = async () => {
      if (!personID) return;

      try {
        const response = await axios.get(`http://localhost:5000/certificate_of_registration/${personID}`);
        setData(response.data);
      } catch (err) {
        console.error("Failed to fetch COR data:", err);
      }
    };

    fetchCORData();
  }, [personID]);


  useEffect(() => {
    fetch("http://localhost:5000/certificate_of_registration/")
      .then(res => res.json())
      .then(data => setFilteredData(data))
      .catch(err => console.error(err));
  }, []);




  const fetchProfilePicture = async (person_id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/${person_id}`);
      if (res.data && res.data.profile_picture) {
        console.log(res.data.profile_picture);
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


  const [shortDate, setShortDate] = useState("");
  const [longDate, setLongDate] = useState("");

  useEffect(() => {
    const updateDates = () => {
      const now = new Date();

      // Format 1: MM/DD/YYYY
      const formattedShort = `${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}/${now.getFullYear()}`;
      setShortDate(formattedShort);

      // Format 2: MM DD, YYYY hh:mm:ss AM/PM
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();
      const hours = String(now.getHours() % 12 || 12).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";

      const formattedLong = `${month} ${day}, ${year} ${hours}:${minutes}:${seconds} ${ampm}`;
      setLongDate(formattedLong);
    };

    updateDates(); // Set initial values
    const interval = setInterval(updateDates, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [studentNumber, setStudentNumber] = useState("");
  const [userId, setUserId] = useState(null); // Dynamic userId
  const [first_name, setUserFirstName] = useState(null); // Dynamic userId
  const [middle_name, setUserMiddleName] = useState(null); // Dynamic userId
  const [last_name, setUserLastName] = useState(null); // Dynamic userId
  const [currId, setCurr] = useState(null); // Dynamic userId
  const [courseCode, setCourseCode] = useState("");
  const [courseDescription, setCourseDescription] = useState("");

  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const [subjectCounts, setSubjectCounts] = useState({});

  useEffect(() => {
    if (selectedSection) {
      fetchSubjectCounts(selectedSection);
    }
  }, [selectedSection]);

  const fetchSubjectCounts = async (sectionId) => {
    try {
      const response = await axios.get("http://localhost:5000/subject-enrollment-count", {
        params: { sectionId },
      });

      // Transform into object for easy lookup: { subject_id: enrolled_count }
      const counts = {};
      response.data.forEach((item) => {
        counts[item.subject_id] = item.enrolled_count;
      });

      setSubjectCounts(counts);
    } catch (err) {
      console.error("Failed to fetch subject counts", err);
    }
  };

  useEffect(() => {
    if (currId) {
      axios
        .get(`http://localhost:5000/courses/${currId}`)
        .then((res) => setCourses(res.data))
        .catch((err) => console.error(err));
    }
  }, [currId]);

  useEffect(() => {
    if (userId && currId) {
      axios
        .get(`http://localhost:5000/enrolled_courses/${userId}/${currId}`)
        .then((res) => setEnrolled(res.data))
        .catch((err) => console.error(err));
    }
  }, [userId, currId]);

  // Fetch department sections when component mounts
  useEffect(() => {
    fetchDepartmentSections();
  }, []);

  // Fetch sections whenever selectedDepartment changes
  useEffect(() => {
    if (selectedDepartment) {
      fetchDepartmentSections();
    }
  }, [selectedDepartment]);

  // Fetch department sections based on selected department
  const fetchDepartmentSections = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/department-sections", {
        params: { departmentId: selectedDepartment },
      });
      // Artificial delay
      setTimeout(() => {
        setSections(response.data);
        setLoading(false);
      }, 700); // 3 seconds delay
    } catch (err) {
      console.error("Error fetching department sections:", err);
      setError("Failed to load department sections");
      setLoading(false);
    }
  };



  const handleSearchStudent = async () => {
    if (!studentNumber.trim()) {
      alert("Please fill in the student number");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/student-tagging", { studentNumber }, { headers: { "Content-Type": "application/json" } });

      const { token, person_id, studentNumber: studentNum, activeCurriculum: active_curriculum, yearLevel, courseCode: course_code, courseDescription: course_desc, firstName: first_name,
        middleName: middle_name, lastName: last_name, } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("person_id", person_id);
      localStorage.setItem("studentNumber", studentNum);
      localStorage.setItem("activeCurriculum", active_curriculum);
      localStorage.setItem("yearLevel", yearLevel);
      localStorage.setItem("courseCode", course_code);
      localStorage.setItem("courseDescription", course_desc);
      localStorage.setItem("firstName", first_name);
      localStorage.setItem("middleName", middle_name);
      localStorage.setItem("lastName", last_name);

      setUserId(studentNum); // Set dynamic userId
      setUserFirstName(first_name); // Set dynamic userId
      setUserMiddleName(middle_name); // Set dynamic userId
      setUserLastName(last_name); // Set dynamic userId
      setCurr(active_curriculum); // Set Program Code based on curriculum
      setCourseCode(course_code); // Set Program Code
      setCourseDescription(course_desc); // Set Program Description
      setPersonID(person_id);
      alert("Student found and authenticated!");
    } catch (error) {
      alert(error.response?.data?.message || "Student not found");
    }
  };

  // Fetch all departments when component mounts
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/departments");
        setDepartments(res.data);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };

    fetchDepartments();
  }, []);

  const handleSelect = (departmentId) => {
    setSelectedDepartment(departmentId);
  };

  const [isPrinting, setIsPrinting] = useState(false);
  

  const handlePrint = () => {
    setIsPrinting(true); // Hide the button

    setTimeout(() => {
      window.print();
      setIsPrinting(false); // Show the button again after printing
    }, 100); // Delay slightly to allow hiding before print dialog
  };


  return (
    <Container className="mt-8">
      <button className={`bg-maroon-500 p-2 px-5 rounded text-white mb-4 hidden-print`} onClick={handlePrint}> Print</button>
   
      <Box p={4} display="grid" gridTemplateColumns="1fr 1fr" gap={4}>
        {/* Available Courses */}
        <Box component={Paper} p={2} className="hidden-print">
          {/* Search Student */}
          <Box >
            <h1 style={{textAlign: "Center", color: "red"}}>Search Student:</h1>
            <TextField
              label="Student Number"
              style={{width: "675px"}}
              margin="normal"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchStudent();
                }
              }}
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSearchStudent}
            >
              Search
            </Button>
          </Box>
     
        </Box>

      </Box>
      <form style={{
          border: "1px solid black",
          padding: "0.25in",
          width: "8.5in",
          marginBottom: "7%",
          textAlign: "center",
          height: "fit-content",
          backgroundColor: "white",

        }}

        className="form"
      >
        <table
          style={{
            border: "1px solid black",
            borderCollapse: "collapse",
            fontFamily: "Arial, Helvetica, sans-serif",
            width: "8in",
            margin: "0 auto", // Center the table inside the form
            textAlign: "center",
            tableLayout: "fixed",
          }}

          className="table"
        >
          <thead>
            <tr>
              <td colSpan={2} style={{ height: "0.1in", fontSize: "72.5%" }}>
                <b>

                </b>
              </td>
              <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
              <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
              <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
              <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
              <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
              <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
              <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
              <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
              <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
              <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
              <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
              <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
              <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
            </tr>
            <tr>
              <td colSpan={2} style={{ height: "0.1in", fontSize: "62.5%" }}>
                <b>

                </b>
              </td>
            </tr>
            <tr>
              <td colSpan={40} style={{ height: "0.5in", textAlign: "center" }}>
                <table width="100%" style={{ borderCollapse: "collapse" }}>
                  <tbody>
                    <tr>


                      <td style={{ width: "20%", textAlign: "center" }}>
                        <img src={EaristLogo} alt="Earist Logo" className="imageLogo" style={{ marginLeft: "25px", width: "150px", height: "110px" }} />
                      </td>

                      {/* Center Column - School Information */}
                      <td className="main-header-cor" style={{ width: "60%", textAlign: "center", lineHeight: "1" }}>
                        <div  className="header-cor" style={{fontSize: '0.9rem'}}>Republic of the Philippines</div>
                        <p className="header-cor-2" style={{fontWeight: 'bold'}}>Eulogio "Amang" Rodriguez</p>
                        <p className="header-cor-2" style={{fontWeight: 'bold'}}>Institute of Science and Technology</p>
                        <p className="header-cor-3">Nagtahan St. Sampaloc, Manila</p><br />
                        <br />
                        <br />
                        <p className="header-cor-4" style={{ fontSize: "16px", fontWeight: 'bold' }}>CERTIFICATE OF REGISTRATION</p>
                      </td>

                      <td
                        colSpan={4}
                        rowSpan={6}
                        style={{
                          textAlign: "center",
                          position: "relative",
                          width: "4.5cm",
                          height: "4.5cm",
                        }}
                      >
                        <div
                          style={{
                            width: "4.7cm",
                            height: "5.08cm",
                            marginRight: "30px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                            border: 'solid 1px black' 
                          }}
                        >
                          {profilePicture ? (
                            <img
                              src={profilePicture}
                              alt="Profile"
                              style={{ width: "100%", height: "100%", objectFit: "cover", border: 'solid 1px black' }}
                            />
                          ) : (
                            <span style={{ fontSize: "12px", color: "#666" }}>
                              No profile picture
                            </span>
                          )}

                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr className="row-1">
              <td className="row-1" colSpan={15} style={{ height: "0.3in", fontSize: "62.5%" }}>


              </td>
            </tr>
            <tr>
              <td className="register-num" colSpan={10} style={{ height: "0.1in", fontSize: "55%"}}>
                <i> 
                  <b style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: "black" }}>
                    Registration No:&nbsp;
                    <span style={{ color: "red" }}>
                      {data[0]?.registration_no || ""}
                    </span>
                  </b>
                </i>
              </td>



              <td
                colSpan={29}
                style={{
                  height: "0.1in",
                  fontSize: "50%",
                  textAlign: "right",

                }}
              >
                <b style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: "black" }}>
                  Academic Year/Term : <span style={{ color: "red" }}>{data[0]?.academic_year_term || ""}</span>
                </b>

              </td>
            </tr>
          </thead>
          <tbody className="tbody">
            <tr>
              <td
                className="table-data"
                colSpan={40}
                style={{
                  height: "0.2in",
                  fontSize: "72.5%",
                  backgroundColor: "gray",
                  color: "white",
                }}
              >
                <b>
                  <i className="head-border" style={{
                    border: "1px solid black",
                    color: "black", fontFamily: 'Arial, sans-serif',
                    fontSize: '12px', textAlign: "center", display: "block"
                  }}>
                    STUDENT GENERAL INFORMATION
                  </i>
                </b>
              </td>
            </tr>


            <tr>
              <td colSpan={4} style={{ border: "1px solid black", fontSize: "62.5%" }}>
                <input
                  type="text"
                  value="Student No:"
                  readOnly
                  style={{
                    fontWeight: "bold",
                    color: "black",
                    width: "98%",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "12px",
                    border: "none",
                    outline: "none",
                    background: "none",
                  }}
                />
              </td>

              <td colSpan={16} style={{ border: "1px solid black", fontSize: "62.5%" }}>
                <input
                  type="text"
                  value={data[0]?.student_no || ""}
                  readOnly
                  style={{
                    fontFamily: "Arial, sans-serif",
                    color: "black",
                    width: "98%",
                    fontSize: "12px",
                    border: "none",
                    outline: "none",
                    background: "none",
                  }}
                />
              </td>

              <td colSpan={4} style={{ border: "1px solid black", fontSize: "62.5%" }}>
                <input
                  type="text"
                  value="College:"
                  readOnly
                  style={{
                    fontWeight: "bold",
                    color: "black",
                    width: "98%",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "12px",
                    border: "none",
                    outline: "none",
                    background: "none",
                  }}
                />
              </td>
              <td colSpan={16} style={{ border: "1px solid black", fontSize: "62.5%" }}>
                <input
                  type="text"
                  value={data[0]?.college || ""}
                  readOnly
                  style={{
                    fontFamily: "Arial, sans-serif",
                    color: "black",
                    width: "98%",
                    fontSize: "12px",
                    border: "none",
                    outline: "none",
                    background: "none",
                  }}
                />
              </td>

            </tr>

            <tr>
              {/* Name Label */}
              <td colSpan={4} style={{ border: "1px solid black", fontSize: "62.5%" }}>
                <input
                  type="text"
                  value="Name:"
                  readOnly
                  style={{
                    fontWeight: "bold",
                    color: "black",
                    width: "98%",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "12px",
                    border: "none",
                    outline: "none",
                    background: "none",
                  }}
                />
              </td>

              {/* Name Value */}
              <td colSpan={16} style={{ border: "1px solid black", fontSize: "62.5%" }}>
                <input
                  type="text"
                  value={data[0]?.name || ""}
                  readOnly
                  style={{
                    fontFamily: "Arial, sans-serif",
                    color: "black",
                    width: "98%",
                    fontSize: "12px",
                    border: "none",
                    outline: "none",
                    background: "none",
                  }}
                />
              </td>

              {/* Program Label */}
              <td colSpan={4} style={{ border: "1px solid black", fontSize: "62.5%" }}>
                <input
                  type="text"
                  value="Program:"
                  readOnly
                  style={{
                    fontWeight: "bold",
                    color: "black",
                    width: "98%",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "12px",
                    border: "none",
                    outline: "none",
                    background: "none",
                  }}
                />
              </td>

              {/* Program Value */}
              <td colSpan={16} style={{ border: "1px solid black", fontSize: "62.5%" }}>
                <input
                  type="text"
                  value={data[0]?.program || ""}
                  readOnly
                  style={{
                    fontFamily: "Arial, sans-serif",
                    color: "black",
                    width: "98%",
                    fontSize: "12px",
                    border: "none",
                    outline: "none",
                    background: "none",
                  }}
                />
              </td>
            </tr>

            <tr>
              {/* Gender Label */}
              <td colSpan={4} style={{ border: "1px solid black", fontSize: "62.5%" }}>
                <input
                  type="text"
                  value="Gender:"
                  readOnly
                  style={{
                    fontWeight: "bold",
                    color: "black",
                    width: "98%",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "12px",
                    border: "none",
                    outline: "none",
                    background: "none",
                  }}
                />
              </td>

              {/* Gender Value */}
              <td colSpan={9} style={{ border: "1px solid black", fontSize: "62.5%" }}>
                <input
                  type="text"
                  value={data[0]?.gender || ""}
                  readOnly
                  style={{
                    fontFamily: "Arial, sans-serif",
                    color: "black",
                    width: "98%",
                    fontSize: "12px",
                    border: "none",
                    outline: "none",
                    background: "none",
                  }}
                />
              </td>

              {/* Major Label */}
              <td colSpan={4} style={{ border: "1px solid black", fontSize: "62.5%" }}>
                <input
                  type="text"
                  value="Major:"
                  readOnly
                  style={{
                    fontWeight: "bold",
                    color: "black",
                    width: "98%",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "12px",
                    border: "none",
                    outline: "none",
                    background: "none",
                  }}
                />
              </td>

              {/* Major Value */}
              <td colSpan={9} style={{ border: "1px solid black", fontSize: "62.5%" }}>
                <input
                  type="text"
                  value={data[0]?.major || ""}
                  readOnly
                  style={{
                    fontFamily: "Arial, sans-serif",
                    color: "black",
                    width: "98%",
                    fontSize: "12px",
                    border: "none",
                    outline: "none",
                    background: "none",
                  }}
                />
              </td>

              {/* Curriculum Label */}
              <td colSpan={5} style={{ border: "1px solid black", fontSize: "62.5%" }}>
                <input
                  type="text"
                  value="Curriculum:"
                  readOnly
                  style={{
                    fontWeight: "bold",
                    color: "black",
                    width: "98%",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "12px",
                    border: "none",
                    outline: "none",
                    background: "none",
                  }}
                />
              </td>

              {/* Curriculum Value */}
              <td colSpan={9} style={{ border: "1px solid black", fontSize: "62.5%" }}>
                <input
                  type="text"
                  value={data[0]?.curriculum || ""}
                  readOnly
                  style={{
                    fontFamily: "Arial, sans-serif",
                    color: "black",
                    width: "98%",
                    fontSize: "12px",
                    border: "none",
                    outline: "none",
                    background: "none",
                  }}
                />
              </td>
            </tr>

            <tr>
              <td colSpan={4} style={{ fontSize: "50%", border: "1px solid black" }}>
                <input type="text" value={"Age:"} style={{ fontWeight: "bold", color: "black", fontFamily: 'Arial, sans-serif', fontSize: '12px', width: "98%", border: "none", outline: "none", background: "none" }} />
              </td>
              <td colSpan={9} style={{ fontSize: "62.5%", border: "1px solid black" }}>
                <input type="text" value={data[0]?.age || ""} readOnly style={{ fontFamily: "Arial, sans-serif", color: "black", width: "98%", fontSize: "12px", border: "none", outline: "none", background: "none" }} />
              </td>
              <td colSpan={4} style={{ fontSize: "50%", border: "1px solid black" }}>
                <input type="text" value={"Year Level:"} style={{ fontWeight: "bold", color: "black", fontFamily: 'Arial, sans-serif', fontSize: '12px', width: "98%", border: "none", outline: "none", background: "none" }} />
              </td>
              <td colSpan={9} style={{ fontSize: "62.5%", border: "1px solid black" }}>
                <input type="text" value={data[0]?.year_level || ""} readOnly style={{ fontFamily: "Arial, sans-serif", color: "black", width: "98%", fontSize: "12px", border: "none", outline: "none", background: "none" }} />
              </td>
              <td colSpan={8} style={{ fontSize: "50%", border: "1px solid black" }}>
                <input type="text" value={"Scholarship/Discount:"} style={{ fontWeight: "bold", color: "black", fontFamily: 'Arial, sans-serif', fontSize: '12px', width: "98%", border: "none", outline: "none", background: "none" }} />
              </td>
              <td colSpan={6} style={{ fontSize: "62.5%", border: "1px solid black" }}>
                <input type="text" value={data[0]?.scholarship_discount || ""} readOnly style={{ fontFamily: "Arial, sans-serif", color: "black", width: "98%", fontSize: "12px", border: "none", outline: "none", background: "none" }} />
              </td>
            </tr>

            <tr>
              <td colSpan={5} style={{ border: "1px solid black", fontSize: "50%" }}>
                <input
                  type="text"
                  value={"Email Address:"}
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    width: "98%",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td colSpan={12} style={{ border: "1px solid black", fontSize: "62.5%" }}>
                <input
                  type="text"
                  value={data[0]?.email_address || ""}
                  readOnly
                  style={{
                    fontFamily: "Arial, sans-serif",
                    color: "black",
                    width: "98%",
                    fontSize: "12px",
                    border: "none",
                    outline: "none",
                    background: "none",
                  }}
                />
              </td>
            </tr>




            {/*----------------------------------------------------------------------------------------------------------------------------------*/}




            <tr>

              <td
                className="code-header"
                colSpan={8}
                rowSpan={2}
                style={{
                  color: "black",
                  height: "0.3in",
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '12px',
                  fontWeight: "bold",
                  backgroundColor: "gray",
                  border: "1px solid black",
                  textAlign: "center",
                }}
              >
                CODE
              </td>
              <td
                colSpan={8}
                rowSpan={2}
                style={{
                  color: "black",
                  height: "0.3in",
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '12px',
                  fontWeight: "bold",

                  backgroundColor: "gray",
                  border: "1px solid black",
                  textAlign: "center",
                }}
              >
                SUBJECT TITLE
              </td>

              <td
                colSpan={4}
                style={{
                  color: "black",
                  height: "0.3in",
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '12px',
                  fontWeight: "bold",

                  backgroundColor: "gray",
                  border: "1px solid black",
                  textAlign: "center",
                }}
              >
                UNIT
              </td>

              <td
                colSpan={4}
                rowSpan={2}
                style={{
                  color: "black",
                  height: "0.3in",
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '12px',
                  fontWeight: "bold",

                  backgroundColor: "gray",
                  border: "1px solid black",
                  textAlign: "center",
                }}
              >
                SECTION
              </td>
              <td
                colSpan={8}
                rowSpan={2}
                style={{
                  color: "black",
                  height: "0.3in",
                  fontSize: "12px",
                  fontWeight: "bold",
                  backgroundColor: "gray",
                  border: "1px solid black",
                  textAlign: "center",
                }}
              >
                SCHEDULE/ROOM

              </td>
              <td
                colSpan={8}
                rowSpan={2}
                style={{
                  color: "black",
                  height: "0.3in",
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '12px',
                  fontWeight: "bold",

                  backgroundColor: "gray",
                  border: "1px solid black",
                  textAlign: "center",
                }}
              >
                FACULTY
              </td>
            </tr>
            <tr>
              <td
                colSpan={1}
                style={{
                  color: "black",
                  height: "0.1in",
                  fontSize: "50%",
                  backgroundColor: "gray",
                  border: "1px solid black",
                  textAlign: "center",
                }}
              >
                Lec
              </td>

              <td
                colSpan={1}
                style={{
                  color: "black",
                  height: "0.1in",
                  fontSize: "50%",
                  backgroundColor: "gray",
                  border: "1px solid black",
                  textAlign: "center",
                }}
              >
                Lab
              </td>
              <td
                colSpan={1}
                style={{
                  color: "black",
                  height: "0.1in",
                  fontSize: "50%",
                  backgroundColor: "gray",
                  border: "1px solid black",
                  textAlign: "center",
                }}
              >
                Credit
              </td>
              <td
                colSpan={1}
                style={{
                  color: "black",
                  height: "0.1in",
                  fontSize: "50%",
                  backgroundColor: "gray",
                  border: "1px solid black",
                  textAlign: "center",
                }}
              >
                Tuition
              </td>
            </tr>

            <tr>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={4} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
              </tr>
              <tr>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={4} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
              </tr>
              <tr>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={4} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
              </tr>
              <tr>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={4} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
              </tr>
              <tr>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={4} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
              </tr>
              <tr>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={4} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
              </tr>
              <tr>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={4} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
              </tr>
              <tr>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={4} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
              </tr>
              <tr>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={4} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
              </tr>
                
              <tr>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={4} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
              </tr>
            {enrolled.map((item, index) => (
              <tr key={index}>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={item.subject_code || ""} style={{ width: "98%", border: "none", background: "none" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={item.subject_title || ""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={item.lec_unit || ""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={item.lab_unit || ""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={item.credit_unit || ""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={1} style={{ border: "1px solid black" }}>
                  <input type="text" value={item.tuition_unit || ""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={4} style={{ border: "1px solid black" }}>
                  <input type="text" value={item.section_description || ""} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={`${item.day_description} ${item.school_time_start}-${item.school_time_end} / ${item.room_description}`} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
                <td colSpan={8} style={{ border: "1px solid black" }}>
                  <input type="text" value={`Prof. ${item.lname}`} style={{ width: "98%", border: "none", background: "none", textAlign: "center" }} />
                </td>
              </tr>
            ))}



            {/*----------------------------------------------------------------------------------------------------------------------------------*/}

            <tr>
              <td
                colSpan={10}
                style={{
                  height: "0.1in",
                  fontSize: "55%",

                  color: "black",

                  textAlign: "center",
                }}
              >
                <b>
                  <i>Note: Subject marked with
                    "*" is Special Subject.</i>
                </b>
              </td>
              <td
                colSpan={8}
                style={{

                  fontSize: "55%",

                  color: "black",

                  textAlign: "center",
                }}
              >
                <b>
                  Total Unit(s)</b>
              </td>

              <td
                colSpan={1}
                style={{

                  fontSize: "55%",

                  color: "black",

                  textAlign: "center",
                }}
              >

              </td>
              <td
                colSpan={1}
                style={{

                  fontSize: "55%",

                  color: "black",

                  textAlign: "center",
                }}
              >
              </td>
              <td
                colSpan={1}
                style={{
                  height: "0.1in",
                  fontSize: "55%",

                  color: "black",

                  textAlign: "center",
                }}
              >
              </td>
              <td
                colSpan={1}
                style={{
                  height: "0.1in",
                  fontSize: "55%",

                  color: "black",

                  textAlign: "center",
                }}
              >
              </td>
              <td
                colSpan={2}
                style={{
                  height: "0.1in",
                  fontSize: "55%",

                  color: "black",

                  textAlign: "center",
                }}
              >
              </td>
              <td
                colSpan={2}
                style={{
                  height: "0.1in",
                  fontSize: "55%",

                  color: "black",

                  textAlign: "center",
                }}
              >
              </td>
              <td
                colSpan={3}
                style={{
                  height: "0.1in",
                  fontSize: "55%",

                  color: "black",

                  textAlign: "center",
                }}
              >
              </td>
            </tr>
            <tr
              colSpan={12}

              style={{
                color: "white",

                height: "0.1in",
                fontSize: "62.5%",
                backgroundColor: "gray",
                textAlign: "center",
              }}
            >


            </tr>
            <tr>
              <td
                colSpan={20}
                style={{

                  fontSize: "62.5%",
                  border: "1px solid black",
                  backgroundColor: "gray",
                }}
              >
                <input
                  type="text"
                  value={"A S S E S S E D  F E E S"}
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    textAlign: "center",
                    width: "98%",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={8}

                style={{
                  color: "white",


                  fontSize: "62.5%",
                  color: "black",
                  border: "1px 0px 1px 1px solid black",
                  textAlign: "center",
                }}
              >

              </td>
            </tr>



            <tr>
              <td
                colSpan={15}
                style={{

                  fontSize: "62.5%",

                }}
              >
                <input
                  type="text"
                  value={"Tuition (21 unit(s)) "}
                  style={{
                    color: "black",
                    width: "98%",
                    border: "none",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={5}
                style={{

                  fontSize: "62.5%",

                  borderRight: "1px solid black",

                }}
              >
                <input
                  type="text"
                  value={filteredData[0]?.tuition || ''}
                  style={{
                    textAlign: "left",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    color: "black",
                    width: "98%",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>



              <td
                colSpan={15}
                style={{

                  fontSize: "62.5%",

                }}
              >

                <input
                  type="text"
                  value={"RULES OF REFUND"}
                  style={{
                    textAlign: "center",
                    color: "black",
                    marginLeft: "40px",
                    width: "98%",
                    border: "none",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '10px',
                    fontWeight: "bold",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
            </tr>
            <tr>

            </tr>
            <tr>
              <td
                colSpan={15}
                style={{

                  fontSize: "62.5%",

                }}
              >
                <input
                  type="text"
                  value={"Athletic Fee"}
                  style={{
                    color: "black",
                    width: "98%",
                    border: "none",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={5}
                style={{

                  fontSize: "62.5%",

                  borderRight: "1px solid black",

                }}
              >
                <input
                  type="text"
                  value={filteredData[0]?.athletic_fee || ''}
                  style={{
                    textAlign: "left",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    color: "black",
                    width: "98%",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={15}
                style={{

                  fontSize: "62.5%",

                }}
              >

                <input
                  type="text"
                  value={"1. Full refund of tuition fee - Before the start of classes."}
                  style={{
                    textAlign: "left",
                    color: "black",
                    marginLeft: "40px",
                    width: "98%",
                    border: "none",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '10px',
                    fontWeight: "bold",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
            </tr>
            <tr>
              <td
                colSpan={15}
                style={{

                  fontSize: "62.5%",

                }}
              >
                <input
                  type="text"
                  value={"Cultural Fee"}
                  style={{
                    color: "black",
                    width: "98%",
                    border: "none",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={5}
                style={{

                  fontSize: "62.5%",

                  borderRight: "1px solid black",

                }}
              >
                <input
                  type="text"
                  value={filteredData[0]?.cultural_fee || ''}
                  style={{
                    textAlign: "left",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    color: "black",
                    width: "98%",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={20}
                style={{

                  fontSize: "62.5%",

                }}
              >

                <input
                  type="text"
                  value={"2. 80% refund of tuition fee - within 1 week from the start of classes."}
                  style={{
                    textAlign: "left",
                    color: "black",
                    marginLeft: "40px",
                    width: "98%",
                    border: "none",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '10px',
                    fontWeight: "bold",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
            </tr>
            <tr>
              <td
                colSpan={15}
                style={{

                  fontSize: "62.5%",

                }}
              >
                <input
                  type="text"
                  value={"Developmental Fee"}
                  style={{
                    color: "black",
                    width: "98%",
                    border: "none",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={5}
                style={{

                  fontSize: "62.5%",

                  borderRight: "1px solid black",

                }}
              >
                <input
                  type="text"
                  value={filteredData[0]?.development_fee || ''}
                  style={{
                    textAlign: "left",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    color: "black",
                    width: "98%",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={15}
                style={{

                  fontSize: "62.5%",

                }}
              >

                <input
                  type="text"
                  value={"3. 50% refund - within 2 weeks from the start of classes."}
                  style={{
                    textAlign: "left",
                    color: "black",
                    marginLeft: "40px",
                    width: "98%",
                    border: "none",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '10px',
                    fontWeight: "bold",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
            </tr>
            <tr>
              <td
                colSpan={15}
                style={{

                  fontSize: "62.5%",

                }}
              >
                <input
                  type="text"
                  value={"Guidance Fee"}
                  style={{
                    color: "black",
                    width: "98%",
                    border: "none",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={5}
                style={{

                  fontSize: "62.5%",

                  borderRight: "1px solid black",

                }}
              >
                <input
                  type="text"
                  value={filteredData[0]?.guidance_fee || ''}
                  style={{
                    textAlign: "left",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    color: "black",
                    width: "98%",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={15}
                style={{

                  fontSize: "62.5%",

                }}
              >

                <input
                  type="text"
                  value={"4. No refund - after the 2nd week of classes."}
                  style={{
                    textAlign: "left",
                    color: "black",
                    marginLeft: "40px",
                    width: "98%",
                    border: "none",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '10px',
                    fontWeight: "bold",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
            </tr>
            <tr>
              <td
                colSpan={15}
                style={{

                  fontSize: "62.5%",

                }}
              >
                <input
                  type="text"
                  value={"Library Fee"}
                  style={{
                    color: "black",
                    width: "98%",
                    border: "none",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={5}
                style={{

                  fontSize: "62.5%",

                  borderRight: "1px solid black",

                }}
              >
                <input
                  type="text"
                  value={filteredData[0]?.library_fee || ''}
                  style={{
                    textAlign: "left",
                    color: "black",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    width: "98%",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>

            </tr>
            <tr>
              <td
                colSpan={15}
                style={{

                  fontSize: "62.5%",

                }}
              >
                <input
                  type="text"
                  value={"Medical and Dental Fee"}
                  style={{
                    color: "black",
                    width: "98%",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={5}
                style={{

                  fontSize: "62.5%",

                  borderRight: "1px solid black",

                }}
              >
                <input
                  type="text"
                  value={filteredData[0]?.medical_dental_fee || ''}
                  style={{
                    textAlign: "left",
                    color: "black",
                    width: "98%",
                    border: "none",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={20}
                style={{

                  fontSize: "62.5%",

                }}
              >

                <input
                  type="text"
                  value={"PLEDGE UPON ADMISSION"}
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "black",
                    width: "98%",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
            </tr>
            <tr>
              <td
                colSpan={15}
                style={{

                  fontSize: "62.5%",

                }}
              >
                <input
                  type="text"
                  value={"Registration Fee"}
                  style={{
                    color: "black",
                    width: "98%",
                    border: "none",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={5}
                style={{

                  fontSize: "62.5%",

                  borderRight: "1px solid black",

                }}
              >
                <input
                  type="text"
                  value={filteredData[0]?.registration_fee || ''}
                  style={{
                    textAlign: "left",
                    color: "black",
                    width: "98%",
                    border: "none",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={20}
                style={{

                  textAlign: "center",
                  fontWeight: "bold",
                  color: "black",
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '10px',
                }}
              >
                "As a student of EARIST, I do solemnly promise that I will
              </td>


            </tr>
            <tr>
              <td
                colSpan={15}
                style={{

                  fontSize: "62.5%",

                }}
              >
                <input
                  type="text"
                  value={"Computer Fee"}
                  style={{
                    color: "black",
                    width: "98%",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={5}
                style={{

                  fontSize: "62.5%",

                  borderRight: "1px solid black",

                }}
              >
                <input
                  type="text"
                  value={filteredData[0]?.computer_fee || ''}
                  style={{
                    textAlign: "left",
                    color: "black",
                    width: "98%",
                    border: "none",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={20}
                style={{

                  textAlign: "center",
                  fontWeight: "bold",
                  color: "black",
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '10px',
                }}
              >
                comply with the rules and regulations of the Institution."
              </td>

            </tr>
            <tr>
              <td
                colSpan={2}
                style={{

                  fontSize: "62.5%",
                  marginRight: "20px",

                }}
              >
                <input
                  type="text"
                  value={""}
                  style={{

                    color: "black",
                    width: "98%",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={13}
                style={{

                  fontSize: "62.5%",
                  marginRight: "20px",


                }}
              >
                <input
                  type="text"
                  value={""}
                  style={{

                    color: "black",
                    width: "98%",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={5}
                style={{

                  fontSize: "62.5%",
                  marginRight: "20px",

                  borderRight: "1px solid black",
                }}
              >
                <input
                  type="text"
                  value={""}
                  style={{
                    textAlign: "left",
                    color: "black",
                    width: "98%",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>

            </tr>
            <tr>
              <td
                colSpan={2}
                style={{


                  marginRight: "20px",

                }}
              >

              </td>
              <td
                colSpan={13}
                style={{

                  fontSize: "62.5%",

                }}
              >
                <input
                  type="text"
                  value={"Total Assessment : "}
                  style={{
                    color: "black",
                    width: "98%",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={5}
                style={{

                  fontSize: "62.5%",
                  marginRight: "20px",

                  borderRight: "1px solid black",
                }}
              >
                <input
                  type="text"
                  value={filteredData[0]?.total_assessment || ''}
                  style={{
                    textAlign: "left",
                    color: "black",
                    width: "98%",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>

            </tr>

            <tr>
              <td
                colSpan={2}
                style={{


                  marginRight: "20px",

                }}
              >

              </td>
              <td
                colSpan={13}
                style={{

                  fontSize: "62.5%",

                }}
              >
                <input
                  type="text"
                  value={"Less Financial Aid : "}
                  style={{
                    color: "black",
                    width: "98%",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={5}
                style={{

                  fontSize: "62.5%",
                  marginRight: "20px",

                  borderRight: "1px solid black",
                }}
              >
                <input
                  type="text"
                  value={filteredData[0]?.less_financial_aid || ''}
                  style={{
                    textAlign: "left",
                    color: "black",
                    width: "98%",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>


            </tr>
            <tr>
              <td
                colSpan={2}
                style={{


                  marginRight: "20px",

                }}
              >

              </td>
              <td
                colSpan={13}
                style={{

                  fontSize: "62.5%",

                }}
              >
                <input
                  type="text"
                  value={"Net Assessed : "}
                  style={{
                    color: "black",
                    width: "98%",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={5}
                style={{

                  fontSize: "62.5%",
                  marginRight: "20px",

                  borderRight: "1px solid black",
                }}
              >
                <input
                  type="text"
                  value={filteredData[0]?.net_assessed || ''}
                  style={{
                    textAlign: "left",
                    color: "black",
                    width: "98%",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>


              <td
                colSpan={20}

              >
                <input
                  type="text"
                  value={"_________________________________"}
                  style={{
                    color: "black",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    textDecoration: "underline",
                    width: "98%",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
            </tr>
            <tr>
              <td
                colSpan={2}
                style={{


                  marginRight: "20px",

                }}
              >

              </td>
              <td
                colSpan={13}
                style={{

                  fontSize: "62.5%",

                }}
              >
                <input
                  type="text"
                  value={"Credit Memo : "}
                  style={{
                    color: "black",
                    width: "98%",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={5}
                style={{

                  fontSize: "62.5%",
                  marginRight: "20px",

                  borderRight: "1px solid black",
                }}
              >
                <input
                  type="text"
                  value={filteredData[0]?.credit_memo || ''}
                  style={{
                    textAlign: "left",
                    color: "black",
                    width: "98%",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>




              <td
                colSpan={20}

              >
                <input
                  type="text"
                  value={"Student's Signature"}
                  style={{
                    color: "black",
                    textAlign: "center",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    width: "98%",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
            </tr>
            <tr>
              <td
                colSpan={2}
                style={{


                  marginRight: "20px",

                }}
              >

              </td>
              <td
                colSpan={13}
                style={{

                  fontSize: "62.5%",

                }}
              >
                <input
                  type="text"
                  value={"Total Discount : "}
                  style={{
                    color: "black",
                    width: "98%",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={5}
                style={{

                  fontSize: "62.5%",
                  marginRight: "20px",

                  borderRight: "1px solid black",
                }}
              >
                <input
                  type="text"
                  value={filteredData[0]?.total_discount || ''}
                  style={{
                    textAlign: "left",
                    color: "black",
                    width: "98%",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>

            </tr>
            <tr>
              <td
                colSpan={2}
                style={{


                  marginRight: "20px",

                }}
              >

              </td>
              <td
                colSpan={13}
                style={{

                  fontSize: "62.5%",

                }}
              >
                <input
                  type="text"
                  value={"Total Payment : "}
                  style={{
                    color: "black",
                    width: "98%",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={5}
                style={{

                  fontSize: "62.5%",
                  marginRight: "20px",

                  borderRight: "1px solid black",
                }}
              >
                <input
                  type="text"
                  value={filteredData[0]?.total_payment || ''}
                  style={{
                    textAlign: "left",
                    color: "black",
                    width: "98%",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>

            </tr>
            <tr>
              <td
                colSpan={2}
                style={{


                  marginRight: "20px",

                }}
              >

              </td>
              <td
                colSpan={13}
                style={{

                  fontSize: "62.5%",

                }}
              >
                <input
                  type="text"
                  value={"Outstanding Balance : "}
                  style={{
                    color: "black",
                    width: "98%",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={5}
                style={{

                  fontSize: "62.5%",
                  marginRight: "20px",

                  borderRight: "1px solid black",
                }}
              >
                <input
                  type="text"
                  value={filteredData[0]?.outstanding_balance || ''}
                  style={{
                    textAlign: "left",
                    color: "black",
                    width: "98%",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>

            </tr>
            <tr>
              <td
                colSpan={20}
                style={{

                  fontSize: "62.5%",
                  border: "1px solid black",
                  backgroundColor: "gray",
                }}
              >
                <input
                  type="text"
                  value={"A S S E S S E D  F E E S"}
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    textAlign: "center",
                    width: "98%",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>


              <td
                colSpan={7}
                style={{

                  fontSize: "62.5%",


                }}
              >
                <input
                  type="text"
                  value={"APPROVED BY : "}
                  style={{
                    color: "black",
                    textAlign: "left",
                    marginLeft: "20px",
                    fontWeight: "bold",
                    width: "98%",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>


            </tr>

            <tr>
              <td
                colSpan={7}
                style={{

                  fontSize: "62.5%",
                  border: "1px solid black",

                }}
              >
                <input
                  type="text"
                  value={"1st Payment/Due"}
                  style={{
                    color: "black",
                    textAlign: "center",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    width: "98%",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={6}
                style={{


                  border: "1px solid black",

                }}
              >
                <input
                  type="text"
                  value={"2nd Payment/Due"}
                  style={{
                    color: "black",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    width: "98%",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={7}
                style={{


                  border: "1px solid black",

                }}
              >
                <input
                  type="text"
                  value={"3rd Payment/Due"}
                  style={{
                    color: "black",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    width: "98%",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={20}
                style={{

                  fontSize: "62.5%",


                }}
              >
                <input
                  type="text"
                  value={"_________________________________"}
                  style={{
                    color: "black",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    textDecoration: "underline",
                    width: "98%",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
            </tr>


            <tr>
              <td
                colSpan={7}
                style={{

                  fontSize: "62.5%",
                  border: "1px solid black",

                }}
              >
                <input
                  type="text"
                  value={filteredData[0]?.first_payment_due || ''}
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    textAlign: "center",
                    width: "98%",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={6}
                style={{

                  fontSize: "62.5%",
                  border: "1px solid black",

                }}
              >
                <input
                  type="text"
                  value={filteredData[0]?.second_payment_due || ''}
                  style={{
                    color: "black",
                    textAlign: "center",
                    fontWeight: "bold",
                    width: "98%",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={7}
                style={{

                  fontSize: "62.5%",
                  border: "1px solid black",

                }}
              >
                <input
                  type="text"
                  value={filteredData[0]?.third_payment_due || ''}
                  style={{
                    color: "black",
                    textAlign: "center",
                    width: "98%",
                    fontWeight: "bold",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={20}
                style={{

                  fontSize: "12px",


                }}
              >
                <input
                  type="text"
                  value={"Registrar"}
                  style={{
                    color: "black",
                    textAlign: "center",
                    width: "98%",
                    fontWeight: "bold",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    border: "none",
                    fontWeight: "bold",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>

            </tr>
            <br />
            <tr>
              <td
                colSpan={12}
                style={{

                  fontSize: "62.5%",


                }}
              >
                <input
                  type="text"
                  value={"Payment/Validation Date : "}
                  style={{
                    color: "black",
                    textAlign: "center",
                    width: "98%",
                    fontWeight: "bold",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={8}
                style={{
                  height: "0.25in",
                  fontSize: "16px",
                  fontFamily: "Arial",
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
              >
                <input
                  type="text"
                  value={shortDate}
                  style={{
                    color: "black",
                    textAlign: "center",
                    width: "100%", // ensures full-width underline
                    border: "none",
                    outline: "none",
                    fontWeight: "bold",
                    background: "none",
                    borderBottom: "3px solid black", // thicker, longer underline
                  }}
                />
              </td>
            </tr>
            <tr>
              <td
                colSpan={9}
                style={{

                  fontSize: "62.5%",


                }}
              >
                <input
                  type="text"
                  value={"Official Receipt :"}
                  style={{
                    color: "black",
                    textAlign: "center",
                    width: "98%",
                    fontWeight: "bold",
                    border: "none",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              <td
                colSpan={10}
                style={{


                  textDecoration: "Underline",
                  fontWeight: "bold",
                }}
              >

                <input
                  type="text"
                  value={"_______Scholar_______"}
                  style={{
                    color: "black",
                    textAlign: "center",
                    textDecoration: "Underline",
                    textDecorationThickness: '3px',
                    width: "98%",
                    fontWeight: "bold",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '16px',
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />

              </td>
            </tr>


            <br />
            <Container style={{width: "250px",}}>
              <td style={{ width: "30%", textAlign: "center" }}>
                <img src={FreeTuitionImage} alt="EARIST MIS FEE" style={{ marginTop: "10px", marginLeft: "100px" }} />
              </td>
            </Container>

            <tr>
              <td
                colSpan={40}
                style={{
                  height: "0.25in",
                  fontSize: "15px",
                  textAlign: "right",
                  textAlign: "right",
                  verticalAlign: "middle", // Centers vertically
                }}
              >
                <input
                  type="text"
                  value={longDate}
                  readOnly
                  style={{
                    color: "black",
                    textAlign: "right", // Centers text inside the input
                    width: "98%",
                    border: "none",
                    outline: "none",
                    background: "none",
                  }}
                />
              </td>
            </tr>







            <tr>
              <td
                colSpan={40}
                style={{
                  height: "0.2in",
                  fontSize: "72.5%",
                  backgroundColor: "gray",
                  color: "white",
                }}
              >
                <b>
                  <i style={{ color: "black", textAlign: "center", display: "block" }}>
                    KEEP THIS CERTIFICATE. YOU WILL BE REQUIRED TO PRESENT THIS IN ALL YOUR DEALINGS WITH THE COLLEGE.
                  </i>
                </b>
              </td>
            </tr>

          </tbody>

        </table>


      </form>
    </Container>
  );
};

export default SearchStudentCOR;
