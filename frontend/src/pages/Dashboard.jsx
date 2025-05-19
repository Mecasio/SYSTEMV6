import React, {useState, useEffect} from "react";
import '../styles/TempStyles.css';

const Dashboard = () => {
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
    
          if (storedRole !== "registrar") {
            window.location.href = "/applicant_dashboard";
          } 
          else {
            // fetchPersonData(storedID);
            console.log('hello');
          }
        } else {
          window.location.href = "/login";
        }
      }, []);


    return (
        <h1>
            <div>Name: {user}</div>
            <div>Student ID: {userID}</div>
            <div>Email: {user}</div>
            <div>Role: {userRole}</div>
            Welcome to the Dashboard
        </h1>
    )
}
export default Dashboard;