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
      console.log("Section List Response:", response.data);
      setSectionList(response.data)
    }catch(error){
      console.log(error);
    }
  }

  const formatTimeTo12Hour = (time24) => {
    const [hours, minutes] = time24.split(":");
    const h = parseInt(hours);
    const suffix = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${suffix}`;
  };

  useEffect(() => {
    fetchRoom();
    fetchCourseList();
    fetchSchoolYearList();
    fetchProfList();
    fetchDayList();
    fetchSectionList();
  }, []);

  useEffect(() => {
    if (schoolYearList.length > 0){
      setSelectedSchoolYear(schoolYearList[0].id);
    }
  }, [schoolYearList]);

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
      const formattedStartTime = formatTimeTo12Hour(selectedStartTime);
      const formattedEndTime = formatTimeTo12Hour(selectedEndTime);

      const response = await axios.post("http://localhost:5000/api/insert-schedule", {
        day: selectedDay,
        start_time: formattedStartTime,
        end_time: formattedEndTime,
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
      <h2 className="p-2 px-0 font-[700] text-[40px] w-[40rem] text-center">Schedule Checker</h2>
      <form onSubmit={handleInsert} className="mt-[2rem]">
        <div className="flex">
          <div className="p-2 w-[12rem]">Day:</div>
          <select className="border border-gray-500 outline-none rounded w-[29rem]" value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} required>
            <option value="">Select Day</option>
            {dayList.map((day) => (
              <option key={day.id} value={day.id}>
                {day.description}
              </option>
            ))}
          </select>
        </div>
        <div className="flex mt-2">
          <div className="p-2 w-[12rem]">Section:</div>
          <select className="border border-gray-500  outline-none rounded w-[29rem]" value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} required>
            <option value="">Select Section</option>
            {sectionList.map((section) => (
              <option key={section.id} value={section.section_id}>
                {section.description} {section.program_code}
              </option>
            ))}
          </select>
        </div>
        <div className="flex mt-2">
          <div className="p-2 w-[12rem]">Room:</div>
          <select className="border border-gray-500 outline-none rounded w-[29rem]" value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} required>
            <option value="">Select Room</option>
            {roomList.map((room) => (
              <option key={room.room_id} value={room.room_id}>
                {room.room_description}
              </option>
            ))}
          </select>
        </div>
        <div className="flex mt-2">
          <div className="p-2 w-[12rem]">Subject:</div>
          <select className="border border-gray-500 outline-none rounded w-[29rem]"  value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} required>
            <option value="">Select Subject</option>
            {courseList.map((subject) => (
              <option key={subject.course_id} value={subject.course_id}>
                {subject.course_code} - {subject.course_description}
              </option>
            ))}
          </select>
        </div>
        <div className="flex mt-2">
          <div className="p-2 w-[12rem]">Professor:</div>
          <select className="border border-gray-500 outline-none rounded w-[29rem]" value={selectedProf} onChange={(e) => setSelectedProf(e.target.value)} required>
            <option value="">Select Professor</option>
            {profList.map((prof) => (
              <option key={prof.prof_id} value={prof.prof_id}>
                {prof.lname}, {prof.fname} {prof.mname}
              </option>
            ))}
          </select>
        </div>
        <div className="flex mt-2">
          <div className="p-2 w-[12rem]">School Year:</div>
          <div className="border border-gray-500 rounded w-[29rem] p-2 bg-gray-100">
            {
              schoolYearList.find(sy => sy.id === selectedSchoolYear)?.year_description
            } - {
              schoolYearList.find(sy => sy.id === selectedSchoolYear)?.semester_description
            }
          </div>
        </div>
        <div className="flex mt-2">
          <div className="p-2 w-[12rem]">Start Time:</div>
          <input type="time" value={selectedStartTime} onChange={(e) => setSelectedStartTime(e.target.value)} required />
        </div>
        <div className="flex mt-2">
          <div className="p-2 w-[12rem]">Start Time:</div>
          <input type="time" value={selectedEndTime} onChange={(e) => setSelectedEndTime(e.target.value)} required />
        </div>
        <br /><br />
        <button className="w-[20rem] bg-maroon-500 p-4 text-white rounded" onClick={handleSubmit}>Check Schedule</button>
        <button className="w-[20rem] ml-[1rem] bg-maroon-500 p-4 text-white rounded" type="submit">Insert Schedule</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default ScheduleChecker;