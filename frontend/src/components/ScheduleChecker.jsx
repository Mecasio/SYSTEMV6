import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  const [roomList, setRoomList] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [schoolYearList, setSchoolYearList] = useState([]);
  const [profList, setProfList] = useState([]);
  const [dayList, setDayList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const { dprtmnt_id } = useParams(); 

  const fetchRoom = async () => {
    try{
      const response = await axios.get(`http://localhost:5000/room_list/${dprtmnt_id}`);
      setRoomList(response.data);
    }catch(error){
      console.log(error);
    }
  }

  const fetchCourseList = async () => {
    try{
      const response = await axios.get(`http://localhost:5000/course_list`);
      setCourseList(response.data)
    }catch(error){
      console.log(error);
    }
  }

  const fetchSchoolYearList = async () => {
    try{
      const response = await axios.get('http://localhost:5000/school_years');
      setSchoolYearList(response.data)
    }catch(error){
      console.log(error);
    }
  }

  const fetchProfList = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/prof_list/${dprtmnt_id}`);
      setProfList(res.data);
    } catch (err) {
      console.error("Error fetching professors:", err);
    }
  }

  const fetchDayList = async () => {
    try{
      const response = await axios.get('http://localhost:5000/day_list');
      setDayList(response.data)
    }catch(error){
      console.log(error);
    }
  }

  const fetchSectionList = async () => {
    try{
      const response = await axios.get(`http://localhost:5000/section_table/${dprtmnt_id}`);
      setSectionList(response.data)
    }catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    fetchRoom();
    fetchCourseList();
    fetchSchoolYearList();
    fetchProfList();
    fetchDayList();
    fetchSectionList();
  }, []);

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
          {dayList.map((day) => (
            <option key={day.id} value={day.day}>
              {day.description}
            </option>
          ))}
        </select>
        <br />
        <label>Section ID:</label>
        <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} required>
          <option value="">Select Section</option>
          {sectionList.map((section) => (
            <option key={section.id} value={section.section_id}>
              {section.description}
            </option>
          ))}
        </select>
        <br />
        <label>Start Time:</label>
        <input type="time" value={selectedStartTime} onChange={(e) => setSelectedStartTime(e.target.value)} required />
        <br />
        <label>End Time:</label>
        <input type="time" value={selectedEndTime} onChange={(e) => setSelectedEndTime(e.target.value)} required />
        <br />
        <label>Room ID:</label>
        <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} required>
          <option value="">Select Room</option>
          {roomList.map((room) => (
            <option key={room.room_id} value={room.room_id}>
              {room.room_description}
            </option>
          ))}
        </select>
        <br />
        <label>Subject ID:</label>
        <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} required>
          <option value="">Select Subject</option>
          {courseList.map((subject) => (
            <option key={subject.course_id} value={subject.course_id}>
              {subject.course_code} - {subject.course_description}
            </option>
          ))}
        </select>
        <br />
        <label>School Year ID:</label>
        <select value={selectedSchoolYear} onChange={(e) => setSelectedSchoolYear(e.target.value)} required>
          <option value="">Select School Year</option>
          {schoolYearList.map((sy) => (
            <option key={sy.id} value={sy.id}>
              {sy.year_description} - {sy.semester_description}
            </option>
          ))}
        </select>
        <br />
        <label>Professor ID:</label>
        <select value={selectedProf} onChange={(e) => setSelectedProf(e.target.value)} required>
          <option value="">Select Professor</option>
          {profList.map((prof) => (
            <option key={prof.prof_id} value={prof.prof_id}>
              {prof.lname}, {prof.fname} {prof.mname}
            </option>
          ))}
        </select>
        <br /><br />
        <button type="submit">Check Schedule</button>
        <button type="button" onClick={handleInsert}>Insert Schedule</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default ScheduleChecker;