import React, {useState, useEffect} from "react";
import '../styles/TempStyles.css';
import axios from 'axios';

const FacultyDashboard = () => {
  const [userID, setUserID] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [person, setPerson] = useState({
    lname: "",
    fname: "",
    mname: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");
    const storedID = localStorage.getItem("person_id");

    if (storedUser && storedRole && storedID) {
      setUser(storedUser);
      setUserRole(storedRole);
      setUserID(storedID);

      if (storedRole !== "faculty") {
        window.location.href = "/dashboard";
      } else {
        fetchPersonData(storedID);
      }
    } else {
      window.location.href = "/login";
    }
  }, []);
  
  const fetchPersonData = async (id) => {
    try{
      const res = await axios.get(`http://localhost:5000/get_prof_data/${id}`)
      if (res.data.length > 0) {
        setPerson(res.data[0]);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      {user} {userID} {userRole} {person.fname} {person.lname}
      <h1>Hello This is the Faculty Dashboard</h1>
    </div>
  );
};

export default FacultyDashboard;
