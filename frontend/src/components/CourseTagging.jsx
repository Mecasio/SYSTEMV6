import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Grid, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, TextField, MenuItem, Container } from "@mui/material";
import LinearWithValueLabel from './LinearWithValueLabel';
import { jwtDecode } from "jwt-decode";
import FreeTuitionImage from "../assets/FreeTuition.png";
import EaristLogo from "../assets/EaristLogo.png";

const CourseTagging = () => {

  const getEmployeeNumFromToken = () => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (token) {
      const decoded = jwtDecode(token);
      return decoded.employeeNumber; // Get the employeeNumber
    }
    return null;
  };
  // Store the employeeNumber in a new variable
  const [data, setdata] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  // Now filter after initializing the states
  const employeeNum = getEmployeeNumFromToken();
  const filteredData = data.filter((item) => String(item.employeeID) === String(employeeNum));

  const [profilePicture, setProfilePicture] = useState(null);
  const [personID, setPersonID] = useState('');

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const [certificateofregistration,] = await Promise.all([
//           axios.get("http://localhost:5000/certificate_of_registration"),

//         ]);

//         // Set original data
//         setdata(certificateofregistration.data);

//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchItems();
//   }, []);

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

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();
      const hours = String(now.getHours() % 12 || 12).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";

      const formattedDate = `${month} ${day}, ${year} ${hours}:${minutes}:${seconds} ${ampm}`;
      setCurrentDate(formattedDate);
    };

    updateDate();
    const interval = setInterval(updateDate, 1000);
    return () => clearInterval(interval);
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

  const handleSectionChange = (e) => {
    const sectionId = e.target.value;
    setSelectedSection(sectionId);

    // Find the selected section object from the array
    const selectedSectionObj = sections.find((section) => section.department_section_id.toString() === sectionId);

    // Do something with the selected section if needed
    console.log("Selected section:", selectedSectionObj);
  };

  const isEnrolled = (subject_id) => enrolled.some((item) => item.subject_id === subject_id);

  const addToCart = async (course) => {
    if (!selectedSection) {
      alert("Please select a department section before adding the course.");
      return;
    }

    if (!isEnrolled(course.subject_id)) {
      const payload = { subject_id: course.subject_id, department_section_id: selectedSection };
      try {
        await axios.post(`http://localhost:5000/add-to-enrolled-courses/${userId}/${currId}/`, payload);

        // Refresh enrolled courses list after adding
        const { data } = await axios.get(`http://localhost:5000/enrolled_courses/${userId}/${currId}`);
        setEnrolled(data);
      } catch (err) {
        console.error("Error adding course or refreshing enrolled list:", err);
      }
    }
  };

  const addAllToCart = async () => {
    const newCourses = courses.filter((c) => !isEnrolled(c.subject_id));
    if (!selectedSection) {
      alert("Please select a department section before adding the course.");
      return;
    }

    if (newCourses.length === 0) return;

    try {
      await Promise.all(
        newCourses.map(async (course) => {
          try {
            const res = await axios.post("http://localhost:5000/add-all-to-enrolled-courses", {
              subject_id: course.subject_id,
              user_id: userId,
              curriculumID: currId, // Include curriculum_id
              departmentSectionID: selectedSection, // Include selected section
            });

            console.log(`Response for subject ${course.subject_id}:`, res.data.message);
          } catch (err) {
            console.error(`Error enrolling subject ${course.subject_id}:`, err.response?.data?.message || err.message);
          }
        })
      );

      // Refresh enrolled courses list
      const { data } = await axios.get(`http://localhost:5000/enrolled_courses/${userId}/${currId}`);
      setEnrolled(data);
    } catch (err) {
      console.error("Unexpected error during enrollment:", err);
    }
  };

  const deleteFromCart = async (id) => {
    try {
      // Delete the specific course
      await axios.delete(`http://localhost:5000/courses/delete/${id}`);

      // Refresh enrolled courses list
      const { data } = await axios.get(`http://localhost:5000/enrolled_courses/${userId}/${currId}`);
      setEnrolled(data);

      console.log(`Course with ID ${id} deleted and enrolled list updated`);
    } catch (err) {
      console.error("Error deleting course or refreshing enrolled list:", err);
    }
  };

  const deleteAllCart = async () => {
    try {
      // Delete all user courses
      await axios.delete(`http://localhost:5000/courses/user/${userId}`);

      // Refresh enrolled courses list
      const { data } = await axios.get(`http://localhost:5000/enrolled_courses/${userId}/${currId}`);
      setEnrolled(data);

      console.log("Cart cleared and enrolled courses refreshed");
    } catch (err) {
      console.error("Error deleting cart or refreshing enrolled list:", err);
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

  const containerStyle = {
    width: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",

    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "20px",
    boxSizing: "border-box",
    marginTop: "50px",
    color: "Black",
    overflowY: "scroll",
  };

  const contentStyle = {
    color: "black",
    width: "100%",
    maxWidth: "800px",
    paddingBottom: "90px",
  };

  return (
    <Container className="mt-8">
      <Grid container spacing={2} justifyContent="center" textAlign="center">
        {departments.map((dept, index) => (
          <Grid key={dept.department_id}>
            <Button
              fullWidth
              variant={selectedDepartment === dept.department_id ? "contained" : "outlined"}
              color={selectedDepartment === dept.department_id ? "primary" : "inherit"}
              value={dept.department_id}
              onClick={() => handleSelect(dept.department_id)}
            >
              {dept.department_code}
            </Button>
          </Grid>
        ))}
      </Grid>
      <Box p={4} display="grid" gridTemplateColumns="1fr 1fr" gap={4}>
        {/* Available Courses */}
        <Box component={Paper} p={2}>
          {/* Search Student */}
          <Box>
            <Typography variant="h6">
              {first_name} {middle_name} {last_name}
              <br />
              {courseCode} - {courseDescription}
            </Typography>
            <TextField
              label="Student Number"
              fullWidth
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
          <Box display="flex" gap={2} mt={2}>
            <Button variant="contained" color="success" onClick={addAllToCart} disabled={!userId}>
              Enroll All
            </Button>
            <Button variant="contained" color="warning" onClick={deleteAllCart}>
              Unenroll All
            </Button>
          </Box>

          <Typography variant="h6" mt={2} gutterBottom>
            Available Courses
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Code</TableCell>
                <TableCell>Subject ID</TableCell>
                <TableCell>Enrolled Students</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((c) => (
                <TableRow key={c.course_tagging_table_id}>
                  <TableCell>{c.subject_code}</TableCell>
                  <TableCell>{c.subject_description}</TableCell>
                  <TableCell>
                    {subjectCounts[c.subject_id] || 0}
                  </TableCell>
                  <TableCell>
                    {!isEnrolled(c.subject_id) ? (
                      <Button variant="contained" size="small" onClick={() => addToCart(c)} disabled={!userId}>
                        Enroll
                      </Button>
                    ) : (
                      <Typography color="textSecondary">Enrolled</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        {/* Enrolled Courses */}
        <Box component={Paper} p={2}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Department Section
            </Typography>

            {/* Department Sections Dropdown */}
            {loading ? (
              <Box sx={{ width: '100%', mt: 2 }}>
                <LinearWithValueLabel />
              </Box>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <TextField
                select
                fullWidth
                value={selectedSection}
                onChange={handleSectionChange}
                variant="outlined"
                margin="normal"
                label="Select a department section"
              >
                <MenuItem value="">
                  <em>Select a department section</em>
                </MenuItem>
                {sections.map((section) => (
                  <MenuItem key={section.department_section_id} value={section.department_section_id}>
                    {section.course_code} - {section.section_description}
                  </MenuItem>
                ))}
              </TextField>
            )}

          </Box>

          <Typography variant="h6" gutterBottom>
            Enrolled Courses
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ display: "none" }}>Enrolled Subject ID</TableCell>
                <TableCell style={{ display: "none" }}>Subject ID</TableCell>
                <TableCell style={{ textAlign: "center" }}>SUBJECT CODE</TableCell>
                <TableCell style={{ textAlign: "center" }}>SECTION</TableCell>
                <TableCell style={{ textAlign: "center" }}>DAY</TableCell>
                <TableCell style={{ textAlign: "center" }}>TIME</TableCell>
                <TableCell style={{ textAlign: "center" }}>ROOM</TableCell>
                <TableCell style={{ textAlign: "center" }}>FACULTY</TableCell>
                <TableCell style={{ textAlign: "center" }}>ENROLLED STUDENTS</TableCell>
                <TableCell style={{ textAlign: "center" }}>Action</TableCell>
              </TableRow>
            </TableHead>




            <TableBody >
              {enrolled.map((e, idx) => (
                <TableRow key={idx} >
                  <TableCell style={{ display: "none" }}>{e.id}</TableCell>
                  <TableCell style={{ display: "none" }}>{e.subject_id}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {e.course_code}-{e.section_description}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {e.subject_code}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>{e.day_description}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>{e.school_time_start}-{e.school_time_end}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>{e.room_description}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>Prof. {e.lname}</TableCell>
                  <TableCell style={{ textAlign: "center" }}> ({e.number_of_enrolled})</TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <Button style={{ textAlign: "center" }} variant="contained" color="error" size="small" onClick={() => deleteFromCart(e.id)}>
                      Unenroll
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>

        </Box>

      </Box>
      <form
        style={{
          border: "1px solid black",
          padding: "0.25in",
          width: "8.5in",
          marginBottom: "7%",
          textAlign: "center",
          height: "fit-content",
          backgroundColor: "white",

        }}
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
        >
          <tbody>
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
                        <img src={EaristLogo} alt="Earist Logo" style={{ marginLeft: "25px", width: "150px", height: "110px" }} />
                      </td>

                      {/* Center Column - School Information */}
                      <td style={{ width: "60%", textAlign: "center", lineHeight: "1" }}>
                        <div>Republic of the Philippines</div>
                        <b>Eulogio "Amang" Rodriguez</b><br />
                        <b>Institute of Science and Technology</b><br />
                        Nagtahan St. Sampaloc, Manila<br />
                        <br />
                        <br />
                        <b style={{ fontSize: "16px", }}>CERTIFICATE OF REGISTRATION</b>
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
                            border: "1px solid #ccc",
                          }}
                        >
                          {profilePicture ? (
                            <img
                              src={profilePicture}
                              alt="Profile"
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <span style={{ fontSize: "12px", color: "#666" }}>
                              No Profile Picture Found
                            </span>
                          )}

                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>

            </tr>
            <tr>
              <td colSpan={15} style={{ height: "0.3in", fontSize: "62.5%" }}>


              </td>
            </tr>
            <tr>
              <td colSpan={10} style={{ height: "0.1in", fontSize: "55%" }}>
                <i>
                  <b style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: "black" }}>
                    Registration No:&nbsp;
                    <span style={{ color: "red" }}>

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
                  Academic Year/Term : <span style={{ color: "red" }}>Second Semester AY 2024-2025</span>
                </b>

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
                  <i style={{
                    border: "1px solid black",
                    color: "black", fontFamily: 'Arial, sans-serif',
                    fontSize: '12px', textAlign: "center", display: "block"
                  }}>
                    STUDENT GENERAL INFORMATION
                  </i>
                </b>
              </td>
            </tr>


            <td
              colSpan={4}
              style={{
                border: "1px solid black"


              }}
            >

              <input
                type="text"
                value={"Student No:"}
                style={{
                  fontWeight: "bold",
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '12px',
                  color: "black",

                  width: "98%",
                  border: "none",
                  outline: "none",
                  background: "none"
                }}
              />
            </td>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td
                  colSpan={12}
                  style={{
                    border: "1px solid black",
                    fontSize: "62.5%",
                  }}
                >
                  <input
                    type="text"
                    value={item.student_number}
                    readOnly
                    style={{
                      fontFamily: "Arial, sans-serif",
                      color: "black",
                      width: "98%",
                      fontSize: "12px",  // Adjusted to a relative font size
                      border: "none",
                      outline: "none",
                      background: "none",

                    }}
                  />
                </td>
              </tr>
            ))}

            <td
              colSpan={4}
              style={{

                fontSize: "62.5%",
                border: "1px solid black",

              }}
            >
              <input
                type="text"
                value={"College :"}
                style={{
                  fontWeight: "Bold",
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

            {filteredData.map((item, index) => (
              <tr key={index}>
                <td
                  colSpan={12}
                  style={{
                    fontSize: "62.5%",
                  }}
                >
                  <input
                    type="text"
                    value={item.department}
                    readOnly
                    style={{
                      fontFamily: "Arial, sans-serif",
                      color: "black",
                      width: "98%",
                      fontSize: "12px",  // Adjusted to a relative font size
                      border: "none",
                      outline: "none",
                      background: "none",

                    }}
                  />
                </td>
              </tr>
            ))}

            <tr>
              <td
                colSpan={4}
                style={{
                  border: "1px solid black",
                  fontSize: "62.5%",

                }}
              >
                <input
                  type="text"
                  value={"Name:"}
                  style={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    color: "black",
                    fontWeight: "bold",
                    width: "98%",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              {enrolled.map((item, index) => (
             
                <tr key={index}>
                  <td
                    colSpan={12}
                    style={{
                      fontSize: "62.5%",
                      border: "1px solid black",
                    }}
                  >
                    <input
                      type="text"
                      value={`${item.last_name} ${item.first_name} ${item.middle_name}`} // Concatenated values

                      style={{
                        fontFamily: "Arial, sans-serif",
                        color: "black",
                        width: "98%",
                        fontSize: "12px",  // Adjusted to a relative font size
                        border: "none",
                        outline: "none",
                        background: "none",
                      }}
                    />
                  </td>
                </tr>
              ))}

              <td
                colSpan={4}
                style={{
                  border: "1px solid black",
                  fontSize: "62.5%",

                }}
              >
                <input
                  type="text"
                  value={"Program :"}
                  style={{
                    color: "black",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    width: "98%",
                    border: "none",
                    outline: "none",
                    fontWeight: "Bold",
                    background: "none"
                  }}
                />
              </td>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td
                    colSpan={17}
                    style={{
                      border: "1px solid black",
                      fontSize: "62.5%",
                    }}
                  >
                    <input
                      type="text"
                      value={item.program}
                      readOnly
                      style={{
                        fontFamily: "Arial, sans-serif",
                        color: "black",
                        width: "98%",
                        fontSize: "12px",  // Adjusted to a relative font size
                        border: "none",
                        outline: "none",
                        background: "none",
                      }}
                    />
                  </td>
                </tr>
              ))}

            </tr>
            <tr>
              <td
                colSpan={4}
                style={{

                  fontSize: "50%",
                  border: "1px solid black"
                }}
              >
                <input
                  type="text"
                  value={"Gender :"}
                  style={{
                    fontWeight: "bold",
                    color: "black",
                    width: "98%",
                    border: "none",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td
                    colSpan={13}
                    style={{
                      border: "1px solid black",
                      fontSize: "62.5%",
                    }}
                  >
                    <input
                      type="text"
                      value={item.student_number}
                      readOnly
                      style={{
                        fontFamily: "Arial, sans-serif",
                        color: "black",
                        width: "98%",
                        fontSize: "12px",  // Adjusted to a relative font size
                        border: "none",
                        outline: "none",
                        background: "none",
                      }}
                    />
                  </td>
                </tr>
              ))}

              <td
                colSpan={4}
                style={{

                  fontSize: "50%",
                  border: "1px solid black"
                }}
              >
                <input
                  type="text"
                  value={"Major:"}
                  style={{
                    fontWeight: "bold",
                    color: "black",
                    width: "98%",
                    border: "none",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>

              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td
                    colSpan={6}
                    style={{
                      border: "1px solid black",
                      fontSize: "62.5%",
                    }}
                  >
                    <input
                      type="text"
                      value={item.student_number}
                      readOnly
                      style={{
                        fontFamily: "Arial, sans-serif",
                        color: "black",
                        width: "98%",
                        fontSize: "12px",  // Adjusted to a relative font size
                        border: "none",
                        outline: "none",
                        background: "none",
                      }}
                    />
                  </td>
                </tr>
              ))}


              <td
                colSpan={5}
                style={{

                  fontSize: "62.5%",
                  border: "1px solid black",
                }}
              >
                <input
                  type="text"
                  value={"Curriculum:"}
                  style={{
                    color: "black",
                    width: "98%",
                    fontWeight: "Bold",
                    border: "none",
                    textAlign: "left",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td
                    colSpan={8}
                    style={{
                      border: "1px solid black",
                      fontSize: "62.5%",
                    }}
                  >
                    <input
                      type="text"
                      value={item.student_number}
                      readOnly
                      style={{
                        fontFamily: "Arial, sans-serif",
                        color: "black",
                        width: "98%",
                        fontSize: "12px",  // Adjusted to a relative font size
                        border: "none",
                        outline: "none",
                        background: "none",
                      }}
                    />
                  </td>
                </tr>
              ))}


            </tr>
            <tr>
              <td
                colSpan={4}
                style={{

                  fontSize: "50%",
                  border: "1px solid black"
                }}
              >
                <input
                  type="text"
                  value={"Age :"}
                  style={{
                    fontWeight: "bold",
                    color: "black",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    width: "98%",
                    border: "none",
                    outline: "none",
                    background: "none"
                  }}
                />
              </td>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td
                    colSpan={13}
                    style={{
                      border: "1px solid black",
                      fontSize: "62.5%",
                    }}
                  >
                    <input
                      type="text"
                      value={item.age}
                      readOnly
                      style={{
                        fontFamily: "Arial, sans-serif",
                        color: "black",
                        width: "98%",
                        fontSize: "12px",  // Adjusted to a relative font size
                        border: "none",
                        outline: "none",
                        background: "none",
                      }}
                    />
                  </td>
                </tr>
              ))}

              <td
                colSpan={4}
                style={{

                  fontSize: "50%",
                  border: "1px solid black"
                }}
              >
                <input
                  type="text"
                  value={"Year Level:"}
                  style={{
                    fontWeight: "bold",
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
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td
                    colSpan={6}
                    style={{
                      border: "1px solid black",
                      fontSize: "62.5%",
                    }}
                  >
                    <input
                      type="text"
                      value={item.student_number}
                      readOnly
                      style={{
                        fontFamily: "Arial, sans-serif",
                        color: "black",
                        width: "98%",
                        fontSize: "12px",  // Adjusted to a relative font size
                        border: "none",
                        outline: "none",
                        background: "none",
                      }}
                    />
                  </td>
                </tr>
              ))}

              <td
                colSpan={8}

                style={{
                  border: "1px solid black",
                  fontSize: "50%",

                }}
              >
                <input
                  type="text"
                  value={"Scholarship/Discount : "}
                  style={{
                    fontWeight: "bold",
                    color: "black",
                    width: "98%",
                    border: "none",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    outline: "none",
                    background: "none"
                  }}
                />

              </td>
              <td
                colSpan={5}

                style={{
                  border: "1px solid black",
                  fontSize: "50%",

                }}
              >
                <input
                  type="text"
                  value={"UNIFAST-FHE"}
                  style={{
                    fontWeight: "bold",
                    color: "black",
                    width: "98%",
                    border: "none",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    outline: "none",
                    background: "none"
                  }}
                />

              </td>



            </tr>
            <tr>
              <td
                colSpan={5}
                style={{
                  border: "1px solid black",
                  fontSize: "50%",

                }}
              >
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
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td
                    colSpan={12}
                    style={{
                      border: "1px solid black",
                      fontSize: "62.5%",
                    }}
                  >
                    <input
                      type="text"
                      value={item.email}
                      readOnly
                      style={{
                        fontFamily: "Arial, sans-serif",
                        color: "black",
                        width: "98%",
                        fontSize: "12px",  // Adjusted to a relative font size
                        border: "none",
                        outline: "none",
                        background: "none",
                      }}
                    />
                  </td>
                </tr>
              ))}




              {/*----------------------------------------------------------------------------------------------------------------------------------*/}

            </tr>


            <tr>

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
                  value={"2100.00"}
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
                  value={"50.00"}
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
                  value={"1. Full refund of tuition fee - Before the start of classes"}
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
                  value={"50.00"}
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
                  value={"2. 80% refund of tuition fee - within 1 week from the start of classes"}
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
                  value={"30.00"}
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
                  value={"30.00"}
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
                  value={"100.00"}
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
                  value={"130.00"}
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
                  value={"50.00"}
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
                  value={"500.00"}
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
                  value={"3090.00"}
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
                  value={"3090.00"}
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
                  value={"0.00"}
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
                  value={"0.00"}
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
                  value={"Medical and Dental Fee : "}
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
                  value={"0.00"}
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
                  value={"Registration Fee : "}
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
                  value={"0.00"}
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
                  value={"Computer Fee : "}
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
                  value={"0.00"}
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
                  value={"_______________________________"}
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
                  value={"0.0"}
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
                  value={"0.0"}
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
                  value={"0.0"}
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
                colSpan={7}
                style={{
                  height: "0.3in",
                  fontSize: "62.5%",


                }}
              >
                <input
                  type="text"
                  value={"February 24, 2025"}
                  style={{
                    textDecoration: "underline",
                    color: "black",
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    fontWeight: "bold",
                    textAlign: "center",
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
                colSpan={12}
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
                colSpan={7}
                style={{

                  fontSize: "62.5%",


                }}
              >
                <input
                  type="text"
                  value={"Scholar  _____"}
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
            </tr>



            <tr>
              <td style={{ width: "20%", textAlign: "center" }}>
                <img src={FreeTuitionImage} alt="EARIST MIS FEE" style={{ marginTop: "10px", width: "200px", height: "150px", marginLeft: "150px" }} />
              </td>
            </tr>

            <tr>
              <td
                colSpan={40}
                style={{
                  height: "0.25in",
                  fontSize: "62.5%",
                  textAlign: "right",
                  textAlign: "right",
                  verticalAlign: "middle", // Centers vertically
                }}
              >
                <input
                  type="text"
                  value={currentDate}
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

export default CourseTagging;
