import React, { useState } from "react";
import axios from "axios";

const ScheduleChecker = () => {
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedProf, setSelectedProf] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const subjectResponse = await axios.post("http://localhost:5000/api/check-subject", {
        section_id: selectedSection,
        school_year_id: selectedSchoolYear,
        prof_id: selectedProf,
        subject_id: selectedSubject,
      });

      if (subjectResponse.data.exists) {
        setMessage("This professor is already assigned to this subject in this section and school year.");
        return;
      }

      const timeResponse = await axios.post("http://localhost:5000/api/check-conflict", {
        day: selectedDay,
        start_time: selectedStartTime,
        end_time: selectedEndTime,
        section_id: selectedSection,
        school_year_id: selectedSchoolYear,
        prof_id: selectedProf,
        room_id: selectedRoom,
        subject_id: selectedSubject,
      });

      if (timeResponse.data.conflict) {
        setMessage("Schedule conflict detected! Please choose a different time.");
      } else {
        setMessage("Schedule is available. You can proceed with adding it.");
      }
    } catch (error) {
      console.error("Error checking schedule:", error);
      setMessage("Schedule conflict detected! Please choose a different time.");
    }
  };

  const handleInsert = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/insert-schedule", {
        day: selectedDay,
        start_time: selectedStartTime,
        end_time: selectedEndTime,
        section_id: selectedSection,
        school_year_id: selectedSchoolYear,
        prof_id: selectedProf,
        room_id: selectedRoom,
        subject_id: selectedSubject,
      });

      if (response.status === 200) {
        setMessage("Schedule inserted successfully.");
      }
    } catch (error) {
      console.error("Error inserting schedule:", error);
      setMessage("Failed to insert schedule.");
    }
  };

  return (
    <div className="container">
      <h2>Schedule Checker</h2>
      <form onSubmit={handleSubmit}>
        <label>Day:</label>
        <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} required>
          <option value="">Select Day</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>
        <br />
        <label>Section ID:</label>
        <input type="text" value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} required />
        <br />
        <label>Start Time:</label>
        <input type="time" value={selectedStartTime} onChange={(e) => setSelectedStartTime(e.target.value)} required />
        <br />
        <label>End Time:</label>
        <input type="time" value={selectedEndTime} onChange={(e) => setSelectedEndTime(e.target.value)} required />
        <br />
        <label>Room ID:</label>
        <input type="text" value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} required />
        <br />
        <label>Subject ID:</label>
        <input type="text" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} required />
        <br />
        <label>School Year ID:</label>
        <input type="text" value={selectedSchoolYear} onChange={(e) => setSelectedSchoolYear(e.target.value)} required />
        <br />
        <label>Professor ID:</label>
        <input type="text" value={selectedProf} onChange={(e) => setSelectedProf(e.target.value)} required />
        <br /><br />
        <button type="submit">Check Schedule</button>
        <button type="button" onClick={handleInsert}>Insert Schedule</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default ScheduleCheck