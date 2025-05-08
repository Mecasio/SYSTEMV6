import React, { useState, useEffect } from "react";
import axios from 'axios';
import {
  Container, Box, Button, Select, MenuItem, Typography, Paper, Grid
} from "@mui/material";

const DepartmentRoom = () => {

  const [room, setRoom] = useState({
    room_id: '',
    dprtmnt_id: ''
  });

  const [assignedRoomIds, setAssignedRoomIds] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [assignedRooms, setAssignedRooms] = useState({});

  // Fetch departments
  const fetchDepartment = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get_department');
      setDepartmentList(response.data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  // Fetch room descriptions (list of rooms)
  const fetchRoomList = async () => {
    try {
      const response = await axios.get('http://localhost:5000/room_list');
      setRoomList(response.data);
    } catch (err) {
      console.log('Error fetching room list:', err);
    }
  };

  // Fetch room assignments grouped by department
  const fetchRoomAssignments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/assignments');
      const assignments = response.data;

      // Group rooms by department id
      const groupedAssignments = assignments.reduce((acc, assignment) => {
        const deptId = assignment.dprtmnt_id;
        if (!acc[deptId]) acc[deptId] = [];
        acc[deptId].push({
          room_id: assignment.dprtmnt_room_id,
          room_description: assignment.room_description,
        });
        return acc;
      }, {});

      // Extract assigned room IDs
      const assignedIds = assignments.map((a) => a.room_id || a.dprtmnt_room_id);
      setAssignedRoomIds(assignedIds);
      setAssignedRooms(groupedAssignments);
    } catch (err) {
      console.error('Error fetching assignments:', err);
    }
  };

  useEffect(() => {
    fetchDepartment();
    fetchRoomList();
    fetchRoomAssignments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoom(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAssignRoom = async () => {
    try {
      await axios.post('http://localhost:5000/api/assign', room);
      fetchRoomAssignments();  // Re-fetch assignments after posting
      setRoom({ room_id: '', dprtmnt_id: '' });
    } catch (err) {
      console.log('Error assigning room:', err);
    }
  };

  // Handle unassigning a room from a department
  const handleUnassignRoom = async (room_id) => {
    try {
      await axios.delete(`http://localhost:5000/api/unassign/${room_id}`);
      fetchRoomAssignments();  // Re-fetch assignments after unassigning
    } catch (err) {
      console.log('Error unassigning room:', err);
    }
  };

  return (
    <Container maxWidth="lg" style={{ paddingTop: '20px' }}>
      <Typography variant="h5" gutterBottom>
        Assign Room to Department
      </Typography>

      <Box display="flex" gap={2} mb={4}>
        <Select
          name="room_id"
          value={room.room_id}
          onChange={handleChange}
          displayEmpty
          fullWidth
        >
          <MenuItem value="">Select Available Room</MenuItem>
          {roomList
            .filter(room => !assignedRoomIds.includes(room.room_id))
            .map((room) => (
              <MenuItem key={room.room_id} value={room.room_id}>
                {room.room_description}
              </MenuItem>
          ))}
        </Select>

        <Select
          name="dprtmnt_id"
          value={room.dprtmnt_id}
          onChange={handleChange}
          displayEmpty
          fullWidth
        >
          <MenuItem value="">Select Department</MenuItem>
          {departmentList.map((dept) => (
            <MenuItem key={dept.dprtmnt_id} value={dept.dprtmnt_id}>
              {dept.dprtmnt_name}
            </MenuItem>
          ))}
        </Select>

        <Button
          variant="contained"
          color="primary"
          onClick={handleAssignRoom}
          disabled={!room.room_id || !room.dprtmnt_id}
        >
          Save
        </Button>
      </Box>

      <Typography variant="h6" gutterBottom>
        Department Room Assignments
      </Typography>

      <Grid container spacing={1}>
        {departmentList.map((dept) => (
          <Grid item xs={12} md={4} key={dept.dprtmnt_id}>
            <Paper elevation={2} style={{ padding: '10px' }}>
              <Typography variant="subtitle2" style={{ fontSize: '14px', marginBottom: '8px' }}>
                {dept.dprtmnt_name}
              </Typography>

              <Box display="flex" flexWrap="wrap" gap={0.5}>
                {assignedRooms[dept.dprtmnt_id] && assignedRooms[dept.dprtmnt_id].length > 0 ? (
                  assignedRooms[dept.dprtmnt_id].map((room) => (
                    <Box
                      key={room.room_id}
                      position="relative"
                      sx={{
                        backgroundColor: '#800000',
                        color: 'white',
                        borderRadius: '4px',
                        padding: '6px 8px',
                        fontSize: '12px',
                        marginBottom: '4px',
                        marginRight: '4px',
                        minWidth: '80px',
                      }}
                    >
                      Room {room.room_description}
                      <Button
                        onClick={() => handleUnassignRoom(room.room_id)}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: '-6px',
                          right: '-6px',
                          minWidth: '22px',
                          height: '22px',
                          padding: '0',
                          color: 'white',
                          backgroundColor: 'rgba(0,0,0,0.4)',
                          borderRadius: '50%',
                          fontSize: '14px',
                          lineHeight: '1',
                          '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.6)',
                          }
                        }}
                      >
                        ×
                      </Button>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" style={{ fontSize: '12px' }}>
                    No rooms assigned.
                  </Typography>
                )}
              </Box>

            </Paper>
          </Grid>
        ))}
      </Grid>

    </Container>
  );
};

export default DepartmentRoom;