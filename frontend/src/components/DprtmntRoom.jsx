import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Container } from "@mui/material";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

const DepartmentRoom = () => {

  const [room, setRoom] = useState({
    room_id: '',
    dprtmnt_id: ''
  });

  const [departmentList, setDepartmentList] = useState([]);
  const [roomList, setRoomList] = useState([]);
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

  const fetchRoomDescription = async () => {
    try {
      const response = await axios.get('http://localhost:5000/room_list');
      console.log(response.data);
      setRoomList(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchDepartment();
    fetchRoomDescription();
  }, []);

  useEffect(() => {
    if (selectedDepartmentId) {
      fetchRoom(selectedDepartmentId);
    }
  }, [selectedDepartmentId]);

  const handleAddingRoom = async () => {
    try {
      await axios.post('http://localhost:5000/api/assign', room);
      fetchRoom(selectedDepartmentId);
      setRoom({ room_id: '', dprtmnt_id: '' });
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
        <select name="room_id" id="roomSelection" value={room.room_id} onChange={handleChangesForEverything}>
          <option value="">Select a Room</option>
          {roomList.map((room) => (
            <option key={room.room_id} value={room.room_id}>
              {room.room_description}
            </option>
          ))}
        </select>
        <select name="dprtmnt_id" id="departmentSelection" value={room.dprtmnt_id} onChange={handleChangesForEverything}>
          <option value="">Select a Department</option>
          {departmentList.map((department) => (
            <option key={department.dprtmnt_id} value={department.dprtmnt_id}>
              {department.dprtmnt_name}
            </option>
          ))}
        </select>
        <button onClick={handleAddingRoom}>Save</button>
      </div>

      <div>
        {departmentList.map((department) => (
          <div key={department.dprtmnt_id}>
            <div
              className="items"
              onClick={() => {
                setSelectedDepartmentId(department.dprtmnt_id);
                handleDropDownForRooms(department.dprtmnt_id);
              }}
            >
              <span className="name">
                <p>{department.dprtmnt_name}</p>
              </span>
              <i>
                {expandedDepartmentRoom === department.dprtmnt_id ? <ArrowDropUp /> : <ArrowDropDown />}
              </i>
            </div>

            {/* Show rooms for this department when expanded */}
            {expandedDepartmentRoom === department.dprtmnt_id && (
              departmentRoomList.length > 0 ? (
                <div className="roomList" style={{ display: 'flex', gap: '1%' }}>
                  {departmentRoomList.map((room) => (
                    <div className="room" key={room.room_id}>
                      <span style={{ padding: '2px 10px', background: 'maroon', color: 'white' }}>
                        Room {room.room_description}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No rooms available for this department.</p>
              )
            )}
          </div>
        ))}
      </div>
    </Container>
  );
};

export default DepartmentRoom;
