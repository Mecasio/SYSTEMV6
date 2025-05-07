import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Container } from "@mui/material";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

const RoomRegistration = () => {

  const [room, setRoom] = useState({
    room_name: '',
    department_id: ''
  });

  const [departmentList, setDepartmentList] = useState([]);
  const [departmentRoomList, setDepartmentRoomList] = useState([]);
  const [expandedDepartmentRoom, setExpandedDepartmentRoom] = useState(null);  
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);  

  const fetchDepartment = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get_department');
      setDepartmentList(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRoom = async (departmentId) => {
    try {
      const response = await axios.get(`http://localhost:5000/get_room?department_id=${departmentId}`);
      console.log("Rooms for department:", response.data);
      setDepartmentRoomList(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDepartment();
  }, []);

  useEffect(() => {
    if (selectedDepartmentId) {
      fetchRoom(selectedDepartmentId);
    }
  }, [selectedDepartmentId]);

  const handleAddingRoom = async () => {
    try {
      await axios.post('http://localhost:5000/room', room);
      fetchRoom(selectedDepartmentId);
      setRoom({ room_name: '', department_id: '' });
      console.log(room);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangesForEverything = (e) => {
    const { name, value } = e.target;
    setRoom(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDropDownForRooms = (departmentId) => {
    setExpandedDepartmentRoom(expandedDepartmentRoom === departmentId ? null : departmentId);
  };

  return (
    <Container className="container">
      <div>
        <input
          type="text"
          placeholder="Enter the Room Name"
          name="room_name"
          value={room.room_name}
          onChange={handleChangesForEverything}
        />
        <button onClick={handleAddingRoom}>Save</button>
      </div>
    </Container>
  );
};

export default RoomRegistration;
