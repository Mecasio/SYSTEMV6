import React, {useState, useEffect} from "react";
import '../styles/TempStyles.css';


const ApplicantDashboard = () => {
    const [userID, setUserID] = useState("");
    const [user, setUser] = useState("");
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("email");
        const storedRole = localStorage.getItem("role");
        const storedID = localStorage.getItem("person_id");
    
        if (storedUser && storedRole && storedID) {
          setUser(storedUser);
          setUserRole(storedRole);
          setUserID(storedID);
    
          if (storedRole !== "applicant") {
            window.location.href = "/faculty_dashboard";
          } else {
            // fetchPersonData(storedID);
            console.log("you are an applicant");
          }
        } else {
          window.location.href = "/login";
        }
      }, []);

  return (
    <div>
        <div>Name: {user}</div>
        <div>Employee ID: {userID}</div>
        <div>Email: {user}</div>
        <div>Role: {userRole}</div>
      <h1>Hello This is the Applicant Dashboard</h1>
    </div>
  );
};

export default ApplicantDashboard;

