import React, {useState, useEffect} from 'react';
import axios from 'axios';
import EaristLogo from '../assets/EaristLogo.png';

const FacultyWorkload = () => {
    const [userID, setUserID] = useState("");
    const [user, setUser] = useState("");
    const [userRole, setUserRole] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [schedule, setSchedule] = useState([]);
    const [profData, setPerson] = useState({
        prof_id: '',
        fname: '',
        mname: '',
        lname: '',
        profile_img: '',
        department_section_id: '',
        subject_id: '',
        active_school_year_id: '',
        mappings: [] 
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
            const first = res.data[0];
                
            const profInfo = {
                prof_id: first.prof_id,
                fname: first.fname,
                mname: first.mname,
                lname: first.lname,
                profile_img: first.profile_image,
                department_section_id: first.department_section_id, 
                subject_id: first.subject_id, 
                active_school_year_id: first.school_year_id,
                mappings: res.data.map(row => ({
                    subject_id: row.course_id,
                    department_section_id: row.department_section_id
                }))
            };
      
            setPerson(profInfo);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (!profData.prof_id) return; 
        
        const fetchSchedule = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/professor-schedule/${profData.prof_id}`);
                console.log(response.data);
                setSchedule(response.data);
            } catch (err) {
                console.error('Error fetching professor schedule:', err);
            }
        };

        fetchSchedule();
    }, [profData.prof_id]);

    const isTimeInSchedule = (start, end, day) => {
        const parseTime = (timeStr) => {
            const time = new Date(`1970-01-01T${new Date('1970-01-01 ' + timeStr).toTimeString().slice(0,8)}`);
            return time;
        };
      
        return schedule.some(entry => {
            if (entry.day !== day) return false;
                const slotStart = parseTime(start);
                const slotEnd = parseTime(end);
                const profStart = parseTime(entry.start_time);
                const profEnd = parseTime(entry.end_time);
                return slotStart >= profStart && slotEnd <= profEnd;
        });
    };

    const hasAdjacentSchedule = (start, end, day, direction = "top") => {
        const parseTime = (timeStr) => new Date(`1970-01-01T${new Date('1970-01-01 ' + timeStr).toTimeString().slice(0,8)}`);
      
        const minutesOffset = direction === "top" ? -60 : 60;
      
        const newStart = new Date(parseTime(start).getTime() + minutesOffset * 60000);
        const newEnd = new Date(parseTime(end).getTime() + minutesOffset * 60000);
      
        return schedule.some(entry => {
            if (entry.day !== day) return false;
            
            const profStart = parseTime(entry.start_time);
            const profEnd = parseTime(entry.end_time);
            
            return newStart >= profStart && newEnd <= profEnd;
        });
    };
          
    return (
        <div className='overflow-y-scroll h-screen relative'>
            <div className='min-h-[10rem] mb-[16rem]'>
                <table className='mt-[2rem]'>
                    <thead>
                        <tr>
                            <td className='w-[8rem] '>
                                <img src={EaristLogo} alt="" srcset="" className='w-[5rem] '/>
                            </td>
                            <td className='w-[48rem] '>
                                <p className='text-[11px]'>Employee No: 2013-4507</p> {/* EmployeeNumber */}
                                <p className='text-[18px] bold'>{profData.fname} {profData.mname} {profData.lname}</p>
                                <p className='text-[11px]'>Status Rank: Instructor I</p>
                            </td>
                            <td>
                                <img src={`http://localhost:5000/uploads/${profData.profile_img}`} className='w-[5rem] '/>
                            </td>
                        </tr>
                    </thead>
                </table>
                <table className='mt-[1rem]'>
                    <thead>
                        <tr className='flex'>
                            <td className='bg-gray-300 border border-black w-[13rem] border-r-0 h-[3rem] flex items-center justify-center' >
                                <p className='text-[14px] font-bold tracking-[-1px]'>DESIGNATION</p>
                            </td>
                            <td className='w-[48rem] border border-black flex items-center justify-center'>
                                <p className='text-[11px]'>Chief, INFORMATION SYSTEM</p>   
                            </td>
                        </tr>
                    </thead>
                </table>
                <table className='mt-[1rem]'>
                    <thead className='flex'>
                        <tr>
                            <td className='bg-gray-300 border border-black w-[13rem] h-full flex items-center justify-center'>
                                <p className='text-[14px] font-bold tracking-[-1px]'>EDUCATIONAL BACKGROUND</p>
                            </td>
                        </tr>
                        <tr className='flex flex-col'>
                            <td className='border border-black border-b-0 border-l-0 w-[48rem] h-[2rem] p-0 flex'>
                                <div className='text-[12px] tracking-[-1px] border border-black m-0 px-1 border-b-0 border-l-0 border-t-0 min-w-[7.5rem] h-full flex items-center'>BACHELOR'S DEGREE</div>
                                <p className='text-[12px] h-full flex items-center ml-1' >BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY</p>
                            </td>
                            <td className='border border-black border-b-0 border-l-0 w-[48rem] h-[2rem] p-0 flex'>
                                <div className='text-[12px] tracking-[-1px] border border-black m-0 px-1 border-b-0 border-l-0 border-t-0 min-w-[7.5rem] h-full flex items-center'>MASTER'S DEGREE</div>
                                <p className='text-[12px] h-full flex items-center ml-1' >MASTER OF INFORMATION TECHNOLOGY (CITY OF MALABON)</p>
                            </td>
                            <td className='border border-black border-b-0 border-l-0 w-[48rem] h-[2rem] p-0 flex'>
                                <div className='text-[12px] tracking-[-1px] border border-black m-0 px-1 border-b-0 border-l-0 border-t-0 min-w-[7.5rem] h-full flex items-center'>DOCTORAL'S DEGREE</div>
                                <p className='text-[12px]  h-full flex items-center ml-1 MIN-' >DOCTOR OF INFORMATION TECHNOLOGY (AMA, ongoing)</p>
                            </td>
                            <td className='border border-black border-l-0 w-[48rem] h-[2rem] p-0 flex'>
                                <div className='text-[12px] tracking-[-1px] border border-black m-0 px-1 border-b-0 border-l-0 border-t-0 min-w-[7.5rem] h-full flex items-center'>SPECIAL TRAINING</div>
                                <p className='text-[12px] h-full flex items-center ml-1' ></p>
                            </td>
                        </tr>
                    </thead>
                </table>
                <table className='mt-[0.7rem]'>
                    <thead>
                        <tr className=''>
                            <td className='flex justify-center w-[63rem] text-[38px] font-bold'>FACULTY ASSIGNMENT</td>
                            <td className='flex justify-center w-[63rem] text-[18px] tracking-[-0.5px] mt-[-0.5rem]'>Second Semester: <p className='ml-2'>SY, 2024-2025</p></td>
                        </tr>
                    </thead>
                </table>
                <table className='mt-[0.7rem]'>
                    <thead>
                        <tr>
                            <td className='w-[6.5rem] h-[2.4rem] flex items-center justify-center border border-black text-[14px]'>TIME</td>
                            <td className='p-0 m-0'>
                                <div className='w-[6.6rem] text-center border border-black border-l-0 border-b-0 text-[14px]'>DAY</div>
                                <p className='w-[6.6rem] text-center border border-black border-l-0 text-[11.5px] font-bold mt-[-3px]'>Official Time</p>
                            </td>
                            <td className='p-0 m-0'>
                                <div className='w-[6.8rem] text-center border border-black border-l-0 border-b-0 text-[14px]'>MONDAY</div>
                                <p className='w-[6.8rem] text-center border border-black border-l-0 text-[11.5px] mt-[-3px]'>7:00AM - 9:00AM</p>
                            </td>
                            <td className='p-0 m-0'>
                                <div className='w-[6.8rem] text-center border border-black border-l-0 border-b-0 text-[14px]'>TUESDAY</div>
                                <p className='w-[6.8rem] text-center border border-black border-l-0 text-[11.5px] mt-[-3px]'>9:00AM - 10:00AM</p>
                            </td>
                            <td className='p-0 m-0'>
                                <div className='w-[7rem] text-center border border-black border-l-0 border-b-0 text-[14px]'>WEDNESDAY</div>
                                <p className='w-[7rem] text-center border border-black border-l-0 text-[11.5px] mt-[-3px]'>7:00AM - 9:00AM</p>
                            </td>
                            <td className='p-0 m-0'>
                                <div className='w-[6.9rem] text-center border border-black border-l-0 border-b-0 text-[14px]'>THURSDAY</div>
                                <p className='w-[6.9rem] text-center border border-black border-l-0 text-[11.5px] mt-[-3px]'>9:00AM - 10:00AM</p>
                            </td>
                            <td className='p-0 m-0'>
                                <div className='w-[6.8rem] text-center border border-black border-l-0 border-b-0 text-[14px]'>FRIDAY</div>
                                <p className='w-[6.8rem] text-center border border-black border-l-0 text-[11.5px] mt-[-3px]'>9:00AM - 10:00AM</p>
                            </td>
                            <td className='p-0 m-0'>
                                <div className='w-[6.8rem] text-center border border-black border-l-0 border-b-0 text-[14px]'>SATUDAY</div>
                                <p className='w-[6.8rem] text-center border border-black border-l-0 text-[11.5px] mt-[-3px]'>9:00AM - 10:00AM</p>
                            </td>
                            <td className='p-0 m-0'>
                                <div className='w-[6.8rem] text-center border border-black border-l-0 border-b-0 text-[14px]'>SUNDAY</div>
                                <p className='w-[6.8rem] text-center border border-black border-l-0 text-[11.5px] mt-[-3px]'>9:00AM - 10:00AM</p>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={2} className='m-0 p-0'>
                                <div className='h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center'>7:00 AM - 8:00 AM</div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("7:00 AM", "8:00 AM", "MON") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("7:00 AM", "8:00 AM", "MON") && hasAdjacentSchedule("7:00 AM", "8:00 AM", "MON", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("7:00 AM", "8:00 AM", "MON") && hasAdjacentSchedule("7:00 AM", "8:00 AM", "MON", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("7:00 AM", "8:00 AM", "TUE") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("7:00 AM", "8:00 AM", "TUE") && hasAdjacentSchedule("7:00 AM", "8:00 AM", "TUE", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("7:00 AM", "8:00 AM", "TUE") && hasAdjacentSchedule("7:00 AM", "8:00 AM", "TUE", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("7:00 AM", "8:00 AM", "WED") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("7:00 AM", "8:00 AM", "WED") && hasAdjacentSchedule("7:00 AM", "8:00 AM", "WED", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("7:00 AM", "8:00 AM", "WED") && hasAdjacentSchedule("7:00 AM", "8:00 AM", "WED", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("7:00 AM", "8:00 AM", "THU") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("7:00 AM", "8:00 AM", "THU") && hasAdjacentSchedule("7:00 AM", "8:00 AM", "THU", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("7:00 AM", "8:00 AM", "THU") && hasAdjacentSchedule("7:00 AM", "8:00 AM", "THU", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("7:00 AM", "8:00 AM", "FRI") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("7:00 AM", "8:00 AM", "FRI") && hasAdjacentSchedule("7:00 AM", "8:00 AM", "FRI", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("7:00 AM", "8:00 AM", "FRI") && hasAdjacentSchedule("7:00 AM", "8:00 AM", "FRI", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("7:00 AM", "8:00 AM", "SAT") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("7:00 AM", "8:00 AM", "SAT") && hasAdjacentSchedule("7:00 AM", "8:00 AM", "SAT", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("7:00 AM", "8:00 AM", "SAT") && hasAdjacentSchedule("7:00 AM", "8:00 AM", "SAT", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("7:00 AM", "8:00 AM", "SUN") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("7:00 AM", "8:00 AM", "SUN") && hasAdjacentSchedule("7:00 AM", "8:00 AM", "SUN", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("7:00 AM", "8:00 AM", "SUN") && hasAdjacentSchedule("7:00 AM", "8:00 AM", "SUN", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                        </tr>
                        
                        <tr>
                            <td colSpan={2} className='m-0 p-0'>
                                <div className='h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center'>8:00 AM - 9:00 AM</div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("9:00 AM", "10:00 AM", "MON") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("8:00 AM", "9:00 AM", "MON") && hasAdjacentSchedule("8:00 AM", "9:00 AM", "MON", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("8:00 AM", "9:00 AM", "MON") && hasAdjacentSchedule("8:00 AM", "9:00 AM", "MON", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("9:00 AM", "10:00 AM", "TUE") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("8:00 AM", "9:00 AM", "TUE") && hasAdjacentSchedule("8:00 AM", "9:00 AM", "TUE", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("8:00 AM", "9:00 AM", "TUE") && hasAdjacentSchedule("8:00 AM", "9:00 AM", "TUE", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("9:00 AM", "10:00 AM", "WED") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("8:00 AM", "9:00 AM", "WED") && hasAdjacentSchedule("8:00 AM", "9:00 AM", "WED", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("8:00 AM", "9:00 AM", "WED") && hasAdjacentSchedule("8:00 AM", "9:00 AM", "WED", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("9:00 AM", "10:00 AM", "THU") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("8:00 AM", "9:00 AM", "THU") && hasAdjacentSchedule("8:00 AM", "9:00 AM", "THU", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("8:00 AM", "9:00 AM", "THU") && hasAdjacentSchedule("8:00 AM", "9:00 AM", "THU", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("9:00 AM", "10:00 AM", "FRI") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("8:00 AM", "9:00 AM", "FRI") && hasAdjacentSchedule("8:00 AM", "9:00 AM", "FRI", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("8:00 AM", "9:00 AM", "FRI") && hasAdjacentSchedule("8:00 AM", "9:00 AM", "FRI", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("9:00 AM", "10:00 AM", "SAT") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("8:00 AM", "9:00 AM", "SAT") && hasAdjacentSchedule("8:00 AM", "9:00 AM", "SAT", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("8:00 AM", "9:00 AM", "SAT") && hasAdjacentSchedule("8:00 AM", "9:00 AM", "SAT", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("9:00 AM", "10:00 AM", "SUN") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("8:00 AM", "9:00 AM", "SUN") && hasAdjacentSchedule("8:00 AM", "9:00 AM", "SUN", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("8:00 AM", "9:00 AM", "SUN") && hasAdjacentSchedule("8:00 AM", "9:00 AM", "SUN", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                        </tr>

                        <tr>
                            <td colSpan={2} className='m-0 p-0'>
                                <div className='h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center'>9:00 AM - 10:00 AM</div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("9:00 AM", "10:00 AM", "MON") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("9:00 AM", "10:00 AM", "MON") && hasAdjacentSchedule("9:00 AM", "10:00 AM", "MON", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("9:00 AM", "10:00 AM", "MON") && hasAdjacentSchedule("9:00 AM", "10:00 AM", "MON", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("9:00 AM", "10:00 AM", "TUE") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("9:00 AM", "10:00 AM", "TUE") && hasAdjacentSchedule("9:00 AM", "10:00 AM", "TUE", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("9:00 AM", "10:00 AM", "TUE") && hasAdjacentSchedule("9:00 AM", "10:00 AM", "TUE", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("9:00 AM", "10:00 AM", "WED") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("9:00 AM", "10:00 AM", "WED") && hasAdjacentSchedule("9:00 AM", "10:00 AM", "WED", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("9:00 AM", "10:00 AM", "WED") && hasAdjacentSchedule("9:00 AM", "10:00 AM", "WED", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("9:00 AM", "10:00 AM", "THU") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("9:00 AM", "10:00 AM", "THU") && hasAdjacentSchedule("9:00 AM", "10:00 AM", "THU", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("9:00 AM", "10:00 AM", "THU") && hasAdjacentSchedule("9:00 AM", "10:00 AM", "THU", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("9:00 AM", "10:00 AM", "FRI") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("9:00 AM", "10:00 AM", "FRI") && hasAdjacentSchedule("9:00 AM", "10:00 AM", "FRI", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("9:00 AM", "10:00 AM", "FRI") && hasAdjacentSchedule("9:00 AM", "10:00 AM", "FRI", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("9:00 AM", "10:00 AM", "SAT") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("9:00 AM", "10:00 AM", "SAT") && hasAdjacentSchedule("9:00 AM", "10:00 AM", "SAT", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("9:00 AM", "10:00 AM", "SAT") && hasAdjacentSchedule("9:00 AM", "10:00 AM", "SAT", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("9:00 AM", "10:00 AM", "SUN") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("9:00 AM", "10:00 AM", "SUN") && hasAdjacentSchedule("9:00 AM", "10:00 AM", "SUN", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("9:00 AM", "10:00 AM", "SUN") && hasAdjacentSchedule("9:00 AM", "10:00 AM", "SUN", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                        </tr>

                        <tr>
                            <td colSpan={2} className='m-0 p-0'>
                                <div className='h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center'>10:00 AM - 11:00 AM</div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("10:00 AM", "11:00 AM", "MON") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("10:00 AM", "11:00 AM", "MON") && hasAdjacentSchedule("10:00 AM", "11:00 AM", "MON", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("10:00 AM", "11:00 AM", "MON") && hasAdjacentSchedule("10:00 AM", "11:00 AM", "MON", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("10:00 AM", "11:00 AM", "TUE") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("10:00 AM", "11:00 AM", "TUE") && hasAdjacentSchedule("10:00 AM", "11:00 AM", "TUE", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("10:00 AM", "11:00 AM", "TUE") && hasAdjacentSchedule("10:00 AM", "11:00 AM", "TUE", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("10:00 AM", "11:00 AM", "WED") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("10:00 AM", "11:00 AM", "WED") && hasAdjacentSchedule("10:00 AM", "11:00 AM", "WED", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("10:00 AM", "11:00 AM", "WED") && hasAdjacentSchedule("10:00 AM", "11:00 AM", "WED", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("10:00 AM", "11:00 AM", "THU") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("10:00 AM", "11:00 AM", "THU") && hasAdjacentSchedule("10:00 AM", "11:00 AM", "THU", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("10:00 AM", "11:00 AM", "THU") && hasAdjacentSchedule("10:00 AM", "11:00 AM", "THU", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("10:00 AM", "11:00 AM", "FRI") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("10:00 AM", "11:00 AM", "FRI") && hasAdjacentSchedule("10:00 AM", "11:00 AM", "FRI", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("10:00 AM", "11:00 AM", "FRI") && hasAdjacentSchedule("10:00 AM", "11:00 AM", "FRI", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("10:00 AM", "11:00 AM", "SAT") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("10:00 AM", "11:00 AM", "SAT") && hasAdjacentSchedule("10:00 AM", "11:00 AM", "SAT", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("10:00 AM", "11:00 AM", "SAT") && hasAdjacentSchedule("10:00 AM", "11:00 AM", "SAT", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("10:00 AM", "11:00 AM", "SUN") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("10:00 AM", "11:00 AM", "SUN") && hasAdjacentSchedule("10:00 AM", "11:00 AM", "SUN", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("10:00 AM", "11:00 AM", "SUN") && hasAdjacentSchedule("10:00 AM", "11:00 AM", "SUN", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                        </tr>

                        <tr>
                            <td colSpan={2} className='m-0 p-0'>
                                <div className='h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center'>11:00 AM - 12:00 PM</div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("11:00 AM", "12:00 PM", "MON") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("11:00 AM", "12:00 PM", "MON") && hasAdjacentSchedule("11:00 AM", "12:00 PM", "MON", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("11:00 AM", "12:00 PM", "MON") && hasAdjacentSchedule("11:00 AM", "12:00 PM", "MON", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("11:00 AM", "12:00 PM", "TUE") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("11:00 AM", "12:00 PM", "TUE") && hasAdjacentSchedule("11:00 AM", "12:00 PM", "TUE", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("11:00 AM", "12:00 PM", "TUE") && hasAdjacentSchedule("11:00 AM", "12:00 PM", "TUE", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("11:00 AM", "12:00 PM", "WED") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("11:00 AM", "12:00 PM", "WED") && hasAdjacentSchedule("11:00 AM", "12:00 PM", "WED", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("11:00 AM", "12:00 PM", "WED") && hasAdjacentSchedule("11:00 AM", "12:00 PM", "WED", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("11:00 AM", "12:00 PM", "THU") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("11:00 AM", "12:00 PM", "THU") && hasAdjacentSchedule("11:00 AM", "12:00 PM", "THU", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("11:00 AM", "12:00 PM", "THU") && hasAdjacentSchedule("11:00 AM", "12:00 PM", "THU", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("11:00 AM", "12:00 PM", "FRI") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("11:00 AM", "12:00 PM", "FRI") && hasAdjacentSchedule("11:00 AM", "12:00 PM", "FRI", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("11:00 AM", "12:00 PM", "FRI") && hasAdjacentSchedule("11:00 AM", "12:00 PM", "FRI", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("11:00 AM", "12:00 PM", "SAT") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("11:00 AM", "12:00 PM", "SAT") && hasAdjacentSchedule("11:00 AM", "12:00 PM", "SAT", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("11:00 AM", "12:00 PM", "SAT") && hasAdjacentSchedule("11:00 AM", "12:00 PM", "SAT", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("11:00 AM", "12:00 PM", "SUN") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("11:00 AM", "12:00 PM", "SUN") && hasAdjacentSchedule("11:00 AM", "12:00 PM", "SUN", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("11:00 AM", "12:00 PM", "SUN") && hasAdjacentSchedule("11:00 AM", "12:00 PM", "SUN", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                        </tr>

                        <tr>
                            <td colSpan={2} className='m-0 p-0'>
                                <div className='h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center'>12:00 PM - 1:00 PM</div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("12:00 PM", "1:00 PM", "MON") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("12:00 PM", "1:00 PM", "MON") && hasAdjacentSchedule("12:00 PM", "1:00 PM", "MON", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("12:00 PM", "1:00 PM", "MON") && hasAdjacentSchedule("12:00 PM", "1:00 PM", "MON", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("12:00 PM", "1:00 PM", "TUE") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("12:00 PM", "1:00 PM", "TUE") && hasAdjacentSchedule("12:00 PM", "1:00 PM", "TUE", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("12:00 PM", "1:00 PM", "TUE") && hasAdjacentSchedule("12:00 PM", "1:00 PM", "TUE", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("12:00 PM", "1:00 PM", "WED") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("12:00 PM", "1:00 PM", "WED") && hasAdjacentSchedule("12:00 PM", "1:00 PM", "WED", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("12:00 PM", "1:00 PM", "WED") && hasAdjacentSchedule("12:00 PM", "1:00 PM", "WED", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("12:00 PM", "1:00 PM", "THU") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("12:00 PM", "1:00 PM", "THU") && hasAdjacentSchedule("12:00 PM", "1:00 PM", "THU", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("12:00 PM", "1:00 PM", "THU") && hasAdjacentSchedule("12:00 PM", "1:00 PM", "THU", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("12:00 PM", "1:00 PM", "FRI") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("12:00 PM", "1:00 PM", "FRI") && hasAdjacentSchedule("12:00 PM", "1:00 PM", "FRI", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("12:00 PM", "1:00 PM", "FRI") && hasAdjacentSchedule("12:00 PM", "1:00 PM", "FRI", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("12:00 PM", "1:00 PM", "SAT") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("12:00 PM", "1:00 PM", "SAT") && hasAdjacentSchedule("12:00 PM", "1:00 PM", "SAT", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("12:00 PM", "1:00 PM", "SAT") && hasAdjacentSchedule("12:00 PM", "1:00 PM", "SAT", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("12:00 PM", "1:00 PM", "SUN") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("12:00 PM", "1:00 PM", "SUN") && hasAdjacentSchedule("12:00 PM", "1:00 PM", "SUN", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("12:00 PM", "1:00 PM", "SUN") && hasAdjacentSchedule("12:00 PM", "1:00 PM", "SUN", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                        </tr>

                        <tr>
                            <td colSpan={2} className='m-0 p-0'>
                                <div className='h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center'>1:00 PM - 2:00 PM</div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("1:00 PM", "2:00 PM", "MON") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("1:00 PM", "2:00 PM", "MON") && hasAdjacentSchedule("1:00 PM", "2:00 PM", "MON", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("1:00 PM", "2:00 PM", "MON") && hasAdjacentSchedule("1:00 PM", "2:00 PM", "MON", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("1:00 PM", "2:00 PM", "TUE") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("1:00 PM", "2:00 PM", "TUE") && hasAdjacentSchedule("1:00 PM", "2:00 PM", "TUE", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("1:00 PM", "2:00 PM", "TUE") && hasAdjacentSchedule("1:00 PM", "2:00 PM", "TUE", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("1:00 PM", "2:00 PM", "WED") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("1:00 PM", "2:00 PM", "WED") && hasAdjacentSchedule("1:00 PM", "2:00 PM", "WED", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("1:00 PM", "2:00 PM", "WED") && hasAdjacentSchedule("1:00 PM", "2:00 PM", "WED", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("1:00 PM", "2:00 PM", "THU") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("1:00 PM", "2:00 PM", "THU") && hasAdjacentSchedule("1:00 PM", "2:00 PM", "THU", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("1:00 PM", "2:00 PM", "THU") && hasAdjacentSchedule("1:00 PM", "2:00 PM", "THU", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("1:00 PM", "2:00 PM", "FRI") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("1:00 PM", "2:00 PM", "FRI") && hasAdjacentSchedule("1:00 PM", "2:00 PM", "FRI", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("1:00 PM", "2:00 PM", "FRI") && hasAdjacentSchedule("1:00 PM", "2:00 PM", "FRI", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("1:00 PM", "2:00 PM", "SAT") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("1:00 PM", "2:00 PM", "SAT") && hasAdjacentSchedule("1:00 PM", "2:00 PM", "SAT", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("1:00 PM", "2:00 PM", "SAT") && hasAdjacentSchedule("1:00 PM", "2:00 PM", "SAT", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("1:00 PM", "2:00 PM", "SUN") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("1:00 PM", "2:00 PM", "SUN") && hasAdjacentSchedule("1:00 PM", "2:00 PM", "SUN", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("1:00 PM", "2:00 PM", "SUN") && hasAdjacentSchedule("1:00 PM", "2:00 PM", "SUN", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                        </tr>

                        <tr>
                            <td colSpan={2} className='m-0 p-0'>
                                <div className='h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center'>2:00 PM - 3:00 PM</div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("2:00 PM", "3:00 PM", "MON") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("2:00 PM", "3:00 PM", "MON") && hasAdjacentSchedule("2:00 PM", "3:00 PM", "MON", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("2:00 PM", "3:00 PM", "MON") && hasAdjacentSchedule("2:00 PM", "3:00 PM", "MON", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("2:00 PM", "3:00 PM", "TUE") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("2:00 PM", "3:00 PM", "TUE") && hasAdjacentSchedule("2:00 PM", "3:00 PM", "TUE", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("2:00 PM", "3:00 PM", "TUE") && hasAdjacentSchedule("2:00 PM", "3:00 PM", "TUE", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("2:00 PM", "3:00 PM", "WED") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("2:00 PM", "3:00 PM", "WED") && hasAdjacentSchedule("2:00 PM", "3:00 PM", "WED", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("2:00 PM", "3:00 PM", "WED") && hasAdjacentSchedule("2:00 PM", "3:00 PM", "WED", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("2:00 PM", "3:00 PM", "THU") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("2:00 PM", "3:00 PM", "THU") && hasAdjacentSchedule("2:00 PM", "3:00 PM", "THU", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("2:00 PM", "3:00 PM", "THU") && hasAdjacentSchedule("2:00 PM", "3:00 PM", "THU", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("2:00 PM", "3:00 PM", "FRI") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("2:00 PM", "3:00 PM", "FRI") && hasAdjacentSchedule("2:00 PM", "3:00 PM", "FRI", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("2:00 PM", "3:00 PM", "FRI") && hasAdjacentSchedule("2:00 PM", "3:00 PM", "FRI", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("2:00 PM", "3:00 PM", "SAT") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("2:00 PM", "3:00 PM", "SAT") && hasAdjacentSchedule("2:00 PM", "3:00 PM", "SAT", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("2:00 PM", "3:00 PM", "SAT") && hasAdjacentSchedule("2:00 PM", "3:00 PM", "SAT", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("2:00 PM", "3:00 PM", "SUN") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("2:00 PM", "3:00 PM", "SUN") && hasAdjacentSchedule("2:00 PM", "3:00 PM", "SUN", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("2:00 PM", "3:00 PM", "SUN") && hasAdjacentSchedule("2:00 PM", "3:00 PM", "SUN", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                        </tr>

                       <tr>
                            <td colSpan={2} className='m-0 p-0'>
                                <div className='h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center'>3:00 PM - 4:00 PM</div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("3:00 PM", "4:00 PM", "MON") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("3:00 PM", "4:00 PM", "MON") && hasAdjacentSchedule("3:00 PM", "4:00 PM", "MON", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("3:00 PM", "4:00 PM", "MON") && hasAdjacentSchedule("3:00 PM", "4:00 PM", "MON", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("3:00 PM", "4:00 PM", "TUE") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("3:00 PM", "4:00 PM", "TUE") && hasAdjacentSchedule("3:00 PM", "4:00 PM", "TUE", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("3:00 PM", "4:00 PM", "TUE") && hasAdjacentSchedule("3:00 PM", "4:00 PM", "TUE", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("3:00 PM", "4:00 PM", "WED") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("3:00 PM", "4:00 PM", "WED") && hasAdjacentSchedule("3:00 PM", "4:00 PM", "WED", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("3:00 PM", "4:00 PM", "WED") && hasAdjacentSchedule("3:00 PM", "4:00 PM", "WED", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("3:00 PM", "4:00 PM", "THU") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("3:00 PM", "4:00 PM", "THU") && hasAdjacentSchedule("3:00 PM", "4:00 PM", "THU", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("3:00 PM", "4:00 PM", "THU") && hasAdjacentSchedule("3:00 PM", "4:00 PM", "THU", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("3:00 PM", "4:00 PM", "FRI") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("3:00 PM", "4:00 PM", "FRI") && hasAdjacentSchedule("3:00 PM", "4:00 PM", "FRI", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("3:00 PM", "4:00 PM", "FRI") && hasAdjacentSchedule("3:00 PM", "4:00 PM", "FRI", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("3:00 PM", "4:00 PM", "SAT") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("3:00 PM", "4:00 PM", "SAT") && hasAdjacentSchedule("3:00 PM", "4:00 PM", "SAT", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("3:00 PM", "4:00 PM", "SAT") && hasAdjacentSchedule("3:00 PM", "4:00 PM", "SAT", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("3:00 PM", "4:00 PM", "SUN") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("3:00 PM", "4:00 PM", "SUN") && hasAdjacentSchedule("3:00 PM", "4:00 PM", "SUN", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("3:00 PM", "4:00 PM", "SUN") && hasAdjacentSchedule("3:00 PM", "4:00 PM", "SUN", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                        </tr>
                        
                        <tr>
                            <td colSpan={2} className='m-0 p-0'>
                                <div className='h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center'>4:00 PM - 5:00 PM</div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("4:00 PM", "5:00 PM", "MON") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("4:00 PM", "5:00 PM", "MON") && hasAdjacentSchedule("4:00 PM", "5:00 PM", "MON", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("4:00 PM", "5:00 PM", "MON") && hasAdjacentSchedule("4:00 PM", "5:00 PM", "MON", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("4:00 PM", "5:00 PM", "TUE") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("4:00 PM", "5:00 PM", "TUE") && hasAdjacentSchedule("4:00 PM", "5:00 PM", "TUE", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("4:00 PM", "5:00 PM", "TUE") && hasAdjacentSchedule("4:00 PM", "5:00 PM", "TUE", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("4:00 PM", "5:00 PM", "WED") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("4:00 PM", "5:00 PM", "WED") && hasAdjacentSchedule("4:00 PM", "5:00 PM", "WED", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("4:00 PM", "5:00 PM", "WED") && hasAdjacentSchedule("4:00 PM", "5:00 PM", "WED", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("4:00 PM", "5:00 PM", "THU") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("4:00 PM", "5:00 PM", "THU") && hasAdjacentSchedule("4:00 PM", "5:00 PM", "THU", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("4:00 PM", "5:00 PM", "THU") && hasAdjacentSchedule("4:00 PM", "5:00 PM", "THU", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("4:00 PM", "5:00 PM", "FRI") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("4:00 PM", "5:00 PM", "FRI") && hasAdjacentSchedule("4:00 PM", "5:00 PM", "FRI", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("4:00 PM", "5:00 PM", "FRI") && hasAdjacentSchedule("4:00 PM", "5:00 PM", "FRI", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("4:00 PM", "5:00 PM", "SAT") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("4:00 PM", "5:00 PM", "SAT") && hasAdjacentSchedule("4:00 PM", "5:00 PM", "SAT", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("4:00 PM", "5:00 PM", "SAT") && hasAdjacentSchedule("4:00 PM", "5:00 PM", "SAT", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("4:00 PM", "5:00 PM", "SUN") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("4:00 PM", "5:00 PM", "SUN") && hasAdjacentSchedule("4:00 PM", "5:00 PM", "SUN", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("4:00 PM", "5:00 PM", "SUN") && hasAdjacentSchedule("4:00 PM", "5:00 PM", "SUN", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                        </tr>

                       <tr>
                            <td colSpan={2} className='m-0 p-0'>
                                <div className='h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center'>5:00 PM - 6:00 PM</div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("5:00 PM", "6:00 PM", "MON") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("5:00 PM", "6:00 PM", "MON") && hasAdjacentSchedule("5:00 PM", "6:00 PM", "MON", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("5:00 PM", "6:00 PM", "MON") && hasAdjacentSchedule("5:00 PM", "6:00 PM", "MON", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("5:00 PM", "6:00 PM", "TUE") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("5:00 PM", "6:00 PM", "TUE") && hasAdjacentSchedule("5:00 PM", "6:00 PM", "TUE", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("5:00 PM", "6:00 PM", "TUE") && hasAdjacentSchedule("5:00 PM", "6:00 PM", "TUE", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("5:00 PM", "6:00 PM", "WED") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("5:00 PM", "6:00 PM", "WED") && hasAdjacentSchedule("5:00 PM", "6:00 PM", "WED", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("5:00 PM", "6:00 PM", "WED") && hasAdjacentSchedule("5:00 PM", "6:00 PM", "WED", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("5:00 PM", "6:00 PM", "THU") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("5:00 PM", "6:00 PM", "THU") && hasAdjacentSchedule("5:00 PM", "6:00 PM", "THU", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("5:00 PM", "6:00 PM", "THU") && hasAdjacentSchedule("5:00 PM", "6:00 PM", "THU", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("5:00 PM", "6:00 PM", "FRI") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("5:00 PM", "6:00 PM", "FRI") && hasAdjacentSchedule("5:00 PM", "6:00 PM", "FRI", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("5:00 PM", "6:00 PM", "FRI") && hasAdjacentSchedule("5:00 PM", "6:00 PM", "FRI", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("5:00 PM", "6:00 PM", "SAT") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("5:00 PM", "6:00 PM", "SAT") && hasAdjacentSchedule("5:00 PM", "6:00 PM", "SAT", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("5:00 PM", "6:00 PM", "SAT") && hasAdjacentSchedule("5:00 PM", "6:00 PM", "SAT", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("5:00 PM", "6:00 PM", "SUN") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("5:00 PM", "6:00 PM", "SUN") && hasAdjacentSchedule("5:00 PM", "6:00 PM", "SUN", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("5:00 PM", "6:00 PM", "SUN") && hasAdjacentSchedule("5:00 PM", "6:00 PM", "SUN", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                        </tr>

                        <tr>
                            <td colSpan={2} className='m-0 p-0'>
                                <div className='h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center'>6:00 PM - 7:00 PM</div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("6:00 PM", "7:00 PM", "MON") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("6:00 PM", "7:00 PM", "MON") && hasAdjacentSchedule("6:00 PM", "7:00 PM", "MON", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("6:00 PM", "7:00 PM", "MON") && hasAdjacentSchedule("6:00 PM", "7:00 PM", "MON", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("6:00 PM", "7:00 PM", "TUE") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("6:00 PM", "7:00 PM", "TUE") && hasAdjacentSchedule("6:00 PM", "7:00 PM", "TUE", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("6:00 PM", "7:00 PM", "TUE") && hasAdjacentSchedule("6:00 PM", "7:00 PM", "TUE", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("6:00 PM", "7:00 PM", "WED") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("6:00 PM", "7:00 PM", "WED") && hasAdjacentSchedule("6:00 PM", "7:00 PM", "WED", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("6:00 PM", "7:00 PM", "WED") && hasAdjacentSchedule("6:00 PM", "7:00 PM", "WED", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("6:00 PM", "7:00 PM", "THU") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("6:00 PM", "7:00 PM", "THU") && hasAdjacentSchedule("6:00 PM", "7:00 PM", "THU", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("6:00 PM", "7:00 PM", "THU") && hasAdjacentSchedule("6:00 PM", "7:00 PM", "THU", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("6:00 PM", "7:00 PM", "FRI") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("6:00 PM", "7:00 PM", "FRI") && hasAdjacentSchedule("6:00 PM", "7:00 PM", "FRI", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("6:00 PM", "7:00 PM", "FRI") && hasAdjacentSchedule("6:00 PM", "7:00 PM", "FRI", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("6:00 PM", "7:00 PM", "SAT") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("6:00 PM", "7:00 PM", "SAT") && hasAdjacentSchedule("6:00 PM", "7:00 PM", "SAT", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("6:00 PM", "7:00 PM", "SAT") && hasAdjacentSchedule("6:00 PM", "7:00 PM", "SAT", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("6:00 PM", "7:00 PM", "SUN") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("6:00 PM", "7:00 PM", "SUN") && hasAdjacentSchedule("6:00 PM", "7:00 PM", "SUN", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("6:00 PM", "7:00 PM", "SUN") && hasAdjacentSchedule("6:00 PM", "7:00 PM", "SUN", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                        </tr>

                        <tr>
                            <td colSpan={2} className='m-0 p-0'>
                                <div className='h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center'>7:00 PM - 8:00 PM</div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("7:00 PM", "8:00 PM", "MON") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("7:00 PM", "8:00 PM", "MON") && hasAdjacentSchedule("7:00 PM", "8:00 PM", "MON", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("7:00 PM", "8:00 PM", "MON") && hasAdjacentSchedule("7:00 PM", "8:00 PM", "MON", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("7:00 PM", "8:00 PM", "TUE") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("7:00 PM", "8:00 PM", "TUE") && hasAdjacentSchedule("7:00 PM", "8:00 PM", "TUE", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("7:00 PM", "8:00 PM", "TUE") && hasAdjacentSchedule("7:00 PM", "8:00 PM", "TUE", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("7:00 PM", "8:00 PM", "WED") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("7:00 PM", "8:00 PM", "WED") && hasAdjacentSchedule("7:00 PM", "8:00 PM", "WED", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("7:00 PM", "8:00 PM", "WED") && hasAdjacentSchedule("7:00 PM", "8:00 PM", "WED", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("7:00 PM", "8:00 PM", "THU") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("7:00 PM", "8:00 PM", "THU") && hasAdjacentSchedule("7:00 PM", "8:00 PM", "THU", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("7:00 PM", "8:00 PM", "THU") && hasAdjacentSchedule("7:00 PM", "8:00 PM", "THU", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("7:00 PM", "8:00 PM", "FRI") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("7:00 PM", "8:00 PM", "FRI") && hasAdjacentSchedule("7:00 PM", "8:00 PM", "FRI", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("7:00 PM", "8:00 PM", "FRI") && hasAdjacentSchedule("7:00 PM", "8:00 PM", "FRI", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("7:00 PM", "8:00 PM", "SAT") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("7:00 PM", "8:00 PM", "SAT") && hasAdjacentSchedule("7:00 PM", "8:00 PM", "SAT", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("7:00 PM", "8:00 PM", "SAT") && hasAdjacentSchedule("7:00 PM", "8:00 PM", "SAT", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("7:00 PM", "8:00 PM", "SUN") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("7:00 PM", "8:00 PM", "SUN") && hasAdjacentSchedule("7:00 PM", "8:00 PM", "SUN", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("7:00 PM", "8:00 PM", "SUN") && hasAdjacentSchedule("7:00 PM", "8:00 PM", "SUN", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                        </tr>

                        <tr>
                            <td colSpan={2} className='m-0 p-0'>
                                <div className='h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center'>8:00 PM - 9:00 PM</div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("8:00 PM", "9:00 PM", "MON") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("8:00 PM", "9:00 PM", "MON") && hasAdjacentSchedule("8:00 PM", "9:00 PM", "MON", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("8:00 PM", "9:00 PM", "MON") && hasAdjacentSchedule("8:00 PM", "9:00 PM", "MON", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("8:00 PM", "9:00 PM", "TUE") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("8:00 PM", "9:00 PM", "TUE") && hasAdjacentSchedule("8:00 PM", "9:00 PM", "TUE", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("8:00 PM", "9:00 PM", "TUE") && hasAdjacentSchedule("8:00 PM", "9:00 PM", "TUE", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("8:00 PM", "9:00 PM", "WED") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("8:00 PM", "9:00 PM", "WED") && hasAdjacentSchedule("8:00 PM", "9:00 PM", "WED", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("8:00 PM", "9:00 PM", "WED") && hasAdjacentSchedule("8:00 PM", "9:00 PM", "WED", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("8:00 PM", "9:00 PM", "THU") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("8:00 PM", "9:00 PM", "THU") && hasAdjacentSchedule("8:00 PM", "9:00 PM", "THU", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("8:00 PM", "9:00 PM", "THU") && hasAdjacentSchedule("8:00 PM", "9:00 PM", "THU", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("8:00 PM", "9:00 PM", "FRI") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("8:00 PM", "9:00 PM", "FRI") && hasAdjacentSchedule("8:00 PM", "9:00 PM", "FRI", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("8:00 PM", "9:00 PM", "FRI") && hasAdjacentSchedule("8:00 PM", "9:00 PM", "FRI", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("8:00 PM", "9:00 PM", "SAT") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("8:00 PM", "9:00 PM", "SAT") && hasAdjacentSchedule("8:00 PM", "9:00 PM", "SAT", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("8:00 PM", "9:00 PM", "SAT") && hasAdjacentSchedule("8:00 PM", "9:00 PM", "SAT", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                            <td className='m-0 p-0'>
                                <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  ${isTimeInSchedule("8:00 PM", "9:00 PM", "SUN") ? 'bg-yellow-300' : ''} ${isTimeInSchedule("8:00 PM", "9:00 PM", "SUN") && hasAdjacentSchedule("8:00 PM", "9:00 PM", "SUN", "top") ? 'border-t-0' : ''} ${isTimeInSchedule("8:00 PM", "9:00 PM", "SUN") && hasAdjacentSchedule("8:00 PM", "9:00 PM", "SUN", "bottom") ? 'border-b-0' : ''}`}></div>
                            </td>
                        </tr>

                    </tbody>
                </table>

                <table className='mt-[1rem]'>
                    <thead>
                        <tr>
                            <td className='bg-black text-white text-[12px] font-[500] tracking-[0.5px] h-[1.8rem] w-[53.1rem] text-center'>SUMMARY</td>
                        </tr>
                    </thead>
                    <thead className='flex'>
                        <tbody className='border border-black'>
                            <tr className='flex flex-col'>
                                <td className='w-[37rem] text-center text-[11px] font-[500]'>DAILY WORKLOAD DISTRIBUTION</td>
                                <div>
                                <td className='border border border-black border-l-0 border-b-0 w-[26rem] text-[11px] text-center'>DAY</td>
                                <td className='border border border-black border-l-0 border-b-0  text-[11px] px-[1rem]'>MON</td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem]'>TUE</td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem]'>WED</td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem]'>THU</td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem]'>FRI</td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem]'>SAT</td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem]'>SUN</td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] border-r-0 px-[1rem]'>TOTAL</td>
                                </div>
                            </tr>
                            <tr className='flex flex-col'>
                                
                                <div>
                                <td className='border border border-black border-l-0 border-b-0 w-[26rem] text-[10px]'>REGULAR TEACHING LOAD</td>
                                <td className='border border border-black border-l-0 border-b-0  text-[11px] px-[1rem] min-w-[3.64rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.25rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.6rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.38rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.0rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.29rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.37rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] border-r-0 px-[1rem] min-w-[4.1rem]'></td>
                                </div>
                            </tr>
                            <tr className='flex flex-col'>
                                
                                <div>
                                <td className='border border border-black border-l-0 border-b-0 w-[26rem] text-[10px]'>OVERLOAD (OL)</td>
                                <td className='border border border-black border-l-0 border-b-0  text-[11px] px-[1rem] min-w-[3.64rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.25rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.6rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.38rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.0rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.29rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.37rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] border-r-0 px-[1rem] min-w-[4.1rem]'></td>
                                </div>
                            </tr>
                            <tr className='flex flex-col'>
                                
                                <div>
                                <td className='border border border-black border-l-0 border-b-0 w-[26rem] text-[10px]'>EMERGENCY LOAD (EL)</td>
                                <td className='border border border-black border-l-0 border-b-0  text-[11px] px-[1rem] min-w-[3.64rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.25rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.6rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.38rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.0rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.29rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.37rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] border-r-0 px-[1rem] min-w-[4.1rem]'></td>
                                </div>
                            </tr>
                            <tr className='flex flex-col'>
                                
                                <div>
                                <td className='border border border-black border-l-0 border-b-0 w-[26rem] text-[9.5px]'>TEMPORARY SUBSTITUTION (TS)</td>
                                <td className='border border border-black border-l-0 border-b-0  text-[11px] px-[1rem] min-w-[3.64rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.25rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.6rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.38rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.0rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.29rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.37rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] border-r-0 px-[1rem] min-w-[4.1rem]'></td>
                                </div>
                            </tr>
                            <tr className='flex flex-col'>
                                
                                <div>
                                <td className='border border border-black border-l-0 border-b-0 w-[26rem] text-[10px]'>DESIGNATION</td>
                                <td className='border border border-black border-l-0 border-b-0  text-[11px] px-[1rem] min-w-[3.64rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.25rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.6rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.38rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.0rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.29rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.37rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] border-r-0 px-[1rem] min-w-[4.1rem]'></td>
                                </div>
                            </tr>
                            <tr className='flex'>
                                <tr>
                                    <td className='border border-black border-l-0 border-b-0 text-[10px] text-center flex items-center h-full px-[0.4rem]'>OTHER <br /> FUNCTIONS</td>
                                </tr>
                                <div>
                                    <div>
                                    <td className='border border border-black border-l-0 border-b-0 w-[26rem] text-[9px] text-center font-[600]'><i>Research</i></td>
                                    <td className='border border border-black border-l-0 border-b-0  text-[11px] px-[1rem] min-w-[3.64rem]'></td>
                                    <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.25rem]'></td>
                                    <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.59rem]'></td>
                                    <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.38rem]'></td>
                                    <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.0rem]'></td>
                                    <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.27rem]'></td>
                                    <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.4rem]'></td>
                                    <td className='border border border-black border-l-0 border-b-0 text-[11px] border-r-0 px-[1rem] min-w-[4.1rem]'></td>
                                    </div>
                                    <div>
                                <td className='border border border-black border-l-0 border-b-0 w-[26rem] text-[9px] text-center font-[600]'><i>Extension</i></td>
                                <td className='border border border-black border-l-0 border-b-0  text-[11px] px-[1rem] min-w-[3.64rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.25rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.59rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.38rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.0rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.27rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.4rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] border-r-0 px-[1rem] min-w-[4.1rem]'></td>
                                </div>
                                <div>
                                <td className='border border border-black border-l-0 border-b-0 w-[26rem] text-[9px] text-center font-[600]'><i>Production</i></td>
                                <td className='border border border-black border-l-0 border-b-0  text-[11px] px-[1rem] min-w-[3.64rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.25rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.59rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.38rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.0rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.27rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.4rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] border-r-0 px-[1rem] min-w-[4.1rem]'></td>
                                </div>
                                <div>
                                <td className='border border border-black border-l-0 border-b-0 w-[26rem] text-[9px] text-center font-[600]'><i>Accreditation</i></td>
                                <td className='border border border-black border-l-0 border-b-0  text-[11px] px-[1rem] min-w-[3.64rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.25rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.59rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.38rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.0rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.27rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.4rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] border-r-0 px-[1rem] min-w-[4.1rem]'></td>
                                </div>
                                </div>

                            </tr>
                            
                            <tr className='flex flex-col'>
                                
                                <div>
                                <td className='border border border-black border-l-0 border-b-0 w-[26rem] text-[9px] text-center'>Consultation</td>
                                <td className='border border border-black border-l-0 border-b-0  text-[11px] px-[1rem] min-w-[3.64rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.25rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.59rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.38rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.0rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.27rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.4rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] border-r-0 px-[1rem] min-w-[4.1rem]'></td>
                                </div>
                            </tr>
                            <tr className='flex flex-col'>
                                
                                <div>
                                <td className='border border border-black border-l-0 border-b-0 w-[26rem] text-[8px] text-center'>Lesson Preparation (off-campus)</td>
                                <td className='border border border-black border-l-0 border-b-0  text-[11px] px-[1rem] min-w-[3.64rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.25rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.59rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.38rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.0rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.27rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.4rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] border-r-0 px-[1rem] min-w-[4.1rem]'></td>
                                </div>
                            </tr>
                            <tr className='flex flex-col'>
                                
                                <div>
                                <td className='border border border-black border-l-0 border-b-0 w-[26rem] text-[10px] text-center'>TOTAL</td>
                                <td className='border border border-black border-l-0 border-b-0  text-[11px] px-[1rem] min-w-[3.64rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.25rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.59rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px]  px-[1rem] min-w-[3.38rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.0rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.27rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] px-[1rem] min-w-[3.4rem]'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[11px] border-r-0 px-[1rem] min-w-[4.1rem]'></td>
                                </div>
                            </tr>
                        </tbody>
                        <tbody className='border border-black'>
                            <tr>
                                <td className='w-[27rem] text-center text-[11px] font-[500]'>EXTRA TEACHING LOADS FOR HONORARIUM</td>
                            </tr> 
                            <tr className='flex'> 
                                <div className='border border-black border-l-0 min-h-[2.45rem] flex items-center justify-center w-[9rem]'>
                                    <span className='text-[10px] tracking-[-1px]'>Teaching Assignment</span>
                                </div>
                                <div className='border border-black border-l-0 min-h-[2.45rem] flex items-center justify-center w-[2rem]'>
                                    <span className='text-[10px] tracking-[-1px]'>Units</span>
                                </div>
                                <div className='border border-black border-l-0 min-h-[2.45rem] flex items-center justify-center w-[3.5rem]'>
                                    <span className='text-[10px] tracking-[-1px]'>Load Type</span>
                                </div>
                                <div className='border border-black border-l-0 min-h-[2.45rem] flex items-center justify-center w-[6rem]'>
                                    <span className='text-[10px] tracking-[-1px]'>Class</span>
                                </div>
                                <div className='border border-black border-l-0 min-h-[2.45rem] flex items-center border-r-0 justify-center w-[3.5rem]'>
                                    <span className='text-[10px] tracking-[-1px]'>Class Type</span>
                                </div>
                            </tr>
                            <tr className='flex'> 
                                <div className='border border-black border-t-0 border-l-0 h-[2.25rem] flex items-center justify-center w-[9rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.25rem] flex items-center justify-center w-[2rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.25rem] flex items-center justify-center w-[3.5rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.25rem] flex items-center justify-center w-[6rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.25rem] flex items-center border-r-0 justify-center w-[3.5rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                            </tr>  
                            <tr className='flex'> 
                                <div className='border border-black border-t-0 border-l-0 h-[2.19rem] flex items-center justify-center w-[9rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.19rem] flex items-center justify-center w-[2rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.19rem] flex items-center justify-center w-[3.5rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.19rem] flex items-center justify-center w-[6rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.19rem] flex items-center border-r-0 justify-center w-[3.5rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                            </tr> 
                            <tr className='flex'> 
                                <div className='border border-black border-t-0 border-l-0 h-[2.05rem] flex items-center justify-center w-[9rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.05rem] flex items-center justify-center w-[2rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.05rem] flex items-center justify-center w-[3.5rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.05rem] flex items-center justify-center w-[6rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.05rem] flex items-center border-r-0 justify-center w-[3.5rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                            </tr> 
                            <tr className='flex'> 
                                <div className='border border-black border-t-0 border-l-0 h-[2.05rem] flex items-center justify-center w-[9rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.05rem] flex items-center justify-center w-[2rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.05rem] flex items-center justify-center w-[3.5rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.05rem] flex items-center justify-center w-[6rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.05rem] flex items-center border-r-0 justify-center w-[3.5rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                            </tr> 
                            <tr className='flex'> 
                                <div className='border border-black border-t-0 border-l-0 h-[1.95rem] flex items-center justify-center w-[9rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[1.95rem] flex items-center justify-center w-[2rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[1.95rem] flex items-center justify-center w-[3.5rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[1.95rem] flex items-center justify-center w-[6rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[1.95rem] flex items-center border-r-0 justify-center w-[3.5rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                            </tr> 
                            <tr>
                                <div>
                                <td className='border border border-black border-l-0 border-t-0  border-b-0 w-[8.95rem] text-[10px] text-center'>TOTAL</td>
                                <td className='border border border-black border-l-0 border-b-0  border-t-0 text-[10px] min-w-[2rem] text-center'></td>
                                </div>
                            </tr>
                        </tbody>
                    </thead>
                    <thead>
                        <tr>
                            <td className='bg-black h-[1.2rem]'></td>
                        </tr>
                    </thead>
                    <thead className='flex'>
                        <tbody className='border border-black'>
                            <tr className='flex flex-col'>
                                <td className='w-[37rem] text-center text-[11px] font-[500]'>FTE CALCULATOR</td>
                                <div>
                                <td className='border border border-black border-l-0 border-b-0 w-[19.5rem] text-[10px] text-center'>Regular Teaching Assignments</td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] text-center'>Units</td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] text-center'>Class</td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] text-center'>Class Type</td>
                                <td className='border border border-black border-l-0 border-b-0 text-[8px] tracking-[-1px] text-center'>No. of Students</td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] border-r-0 text-center w-[3.1rem]'>FTE</td>
                                </div>
                            </tr>
                            <tr className='flex flex-col'>
                                
                                <div>
                                <td className='border border border-black border-l-0 border-b-0 w-[19.5rem] text-[10px] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[8px] tracking-[-1px] h-[1rem] w-[3.0rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] border-r-0 text-center h-[1rem] w-[3.1rem]'></td>
                                </div>
                            </tr>
                            <tr className='flex flex-col'>
                                
                                <div>
                                <td className='border border border-black border-l-0 border-b-0 w-[19.5rem] text-[10px] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[8px] tracking-[-1px] h-[1rem] w-[3rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] border-r-0 text-center h-[1rem] w-[3.1rem]'></td>
                                </div>
                            </tr>
                            <tr className='flex flex-col'>
                                
                                <div>
                                <td className='border border border-black border-l-0 border-b-0 w-[19.5rem] text-[10px] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[8px] tracking-[-1px] h-[1rem] w-[3rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] border-r-0 text-center h-[1rem] w-[3.1rem]'></td>
                                </div>
                            </tr>
                            <tr className='flex flex-col'>
                                
                                <div>
                                <td className='border border border-black border-l-0 border-b-0 w-[19.5rem] text-[10px] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[8px] tracking-[-1px] h-[1rem] w-[3rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] border-r-0 text-center h-[1rem] w-[3.1rem]'></td>
                                </div>
                            </tr>
                            <tr className='flex flex-col'>
                                
                                <div>
                                    <td className='border border border-black border-l-0 border-b-0 w-[19.5rem] text-[10px] h-[1rem] text-center'></td>
                                    <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                    <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                    <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                    <td className='border border border-black border-l-0 border-b-0 text-[8px] tracking-[-1px] h-[1rem] w-[3rem] text-center'></td>
                                    <td className='border border border-black border-l-0 border-b-0 text-[10px] border-r-0 text-center h-[1rem] w-[3.1rem]'></td>
                                </div>
                            </tr>
                            
                            <tr className='flex flex-col'>
                                
                                <div>
                                <td className='border border border-black border-l-0 border-b-0 w-[19.5rem] text-[10px] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[8px] tracking-[-1px] h-[1rem] w-[3rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] border-r-0 text-center h-[1rem] w-[3.1rem]'></td>
                                </div>
                            </tr>
                            <tr className='flex flex-col'>
                                
                                <div>
                                <td className='border border border-black border-l-0 border-b-0 w-[19.5rem] text-[10px] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[8px] tracking-[-1px] h-[1rem] w-[3rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] border-r-0 text-center h-[1rem] w-[3.1rem]'></td>
                                </div>
                            </tr>
                            <tr className='flex flex-col'>
                                
                                <div>
                                <td className='border border border-black border-l-0 border-b-0 w-[19.5rem] text-[10px] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[8px] tracking-[-1px] h-[1rem] w-[3rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] border-r-0 text-center h-[1rem] w-[3.1rem]'></td>
                                </div>
                            </tr>
                            <tr className='flex flex-col'>
                                
                                <div>
                                <td className='border border border-black border-l-0 border-b-0 w-[19.5rem] text-[10px] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[8px] tracking-[-1px] h-[1rem] w-[3rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] border-r-0 text-center h-[1rem] w-[3.1rem]'></td>
                                </div>
                            </tr>
                            <tr className='flex flex-col'>
                                
                                <div>
                                <td className='border border border-black border-l-0 border-b-0 w-[19.5rem] text-[10px] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[8px] tracking-[-1px] h-[1rem] w-[3rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] border-r-0 text-center h-[1rem] w-[3.1rem]'></td>
                                </div>
                            </tr>
                            <tr className='flex flex-col'>
                                
                                <div>
                                <td className='border border border-black border-l-0 border-b-0 w-[19.5rem] text-[10px] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[8px] tracking-[-1px] h-[1rem] w-[3rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] border-r-0 text-center h-[1rem] w-[3.1rem]'></td>
                                </div>
                            </tr>
                            <tr className='flex flex-col'>
                                
                                <div>
                                <td className='border border border-black border-l-0 border-b-0 w-[19.8rem] text-[10px] h-[1rem] text-center'></td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] w-[14.5rem] h-[1rem] text-center'>Total FTE</td>
                                <td className='border border border-black border-l-0 border-b-0 text-[10px] border-r-0 text-center h-[1rem] w-[3.1rem]'></td>
                                </div>
                            </tr>
                        </tbody>
                        <tbody className='border border-black'>
                            <tr>
                                <td className='w-[27rem] text-center text-[11px] font-[500]'>EXTRA TEACHING LOADS FOR SERVICE CREDIT</td>
                            </tr> 
                            <tr className='flex'> 
                                <div className='border border-black border-l-0 h-[2.25rem] flex items-center justify-center w-[9rem]'>
                                    <span className='text-[10px] tracking-[-1px]'>Teaching Assignment</span>
                                </div>
                                <div className='border border-black border-l-0 h-[2.25rem] flex items-center justify-center w-[2rem]'>
                                    <span className='text-[10px] tracking-[-1px]'>Units</span>
                                </div>
                                <div className='border border-black border-l-0 h-[2.25rem] flex items-center justify-center w-[3.5rem]'>
                                    <span className='text-[10px] tracking-[-1px]'>Load Type</span>
                                </div>
                                <div className='border border-black border-l-0 h-[2.25rem] flex items-center justify-center w-[6rem]'>
                                    <span className='text-[10px] tracking-[-1px]'>Class</span>
                                </div>
                                <div className='border border-black border-l-0 h-[2.25rem] flex items-center border-r-0 justify-center w-[3.5rem]'>
                                    <span className='text-[10px] tracking-[-1px]'>Class Type</span>
                                </div>
                            </tr>
                            <tr className='flex'> 
                                <div className='border border-black border-t-0 border-l-0 h-[2.05rem] flex items-center justify-center w-[9rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.05rem] flex items-center justify-center w-[2rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.05rem] flex items-center justify-center w-[3.5rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.05rem] flex items-center justify-center w-[6rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.05rem] flex items-center border-r-0 justify-center w-[3.5rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                            </tr>  
                            <tr className='flex'> 
                                <div className='border border-black border-t-0 border-l-0 h-[2.09rem] flex items-center justify-center w-[9rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.09rem] flex items-center justify-center w-[2rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.09rem] flex items-center justify-center w-[3.5rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.09rem] flex items-center justify-center w-[6rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.09rem] flex items-center border-r-0 justify-center w-[3.5rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                            </tr> 
                            <tr className='flex'> 
                                <div className='border border-black border-t-0 border-l-0 h-[2.05rem] flex items-center justify-center w-[9rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.05rem] flex items-center justify-center w-[2rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.05rem] flex items-center justify-center w-[3.5rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.05rem] flex items-center justify-center w-[6rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.05rem] flex items-center border-r-0 justify-center w-[3.5rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                            </tr> 
                            <tr className='flex'> 
                                <div className='border border-black border-t-0 border-l-0 h-[2.05rem] flex items-center justify-center w-[9rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.05rem] flex items-center justify-center w-[2rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.05rem] flex items-center justify-center w-[3.5rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.05rem] flex items-center justify-center w-[6rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.05rem] flex items-center border-r-0 justify-center w-[3.5rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                            </tr> 
                            <tr className='flex'> 
                                <div className='border border-black border-t-0 border-l-0 h-[2.1rem] flex items-center justify-center w-[9rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0  h-[2.1rem] flex items-center justify-center w-[2rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.1rem] flex items-center justify-center w-[3.5rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0 h-[2.1rem] flex items-center justify-center w-[6rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                                <div className='border border-black border-t-0 border-l-0  h-[2.1rem]  flex items-center border-r-0 justify-center w-[3.5rem]'>
                                    <span className='text-[10px] tracking-[-1px]'></span>
                                </div>
                            </tr> 
                            <tr>
                                <div>
                                <td className='border border border-black border-l-0 border-t-0  border-b-0 w-[8.95rem] text-[10px] text-center'>TOTAL</td>
                                <td className='border border border-black border-l-0 border-b-0  border-t-0 text-[10px] min-w-[2rem] text-center'></td>
                                </div>
                            </tr>
                        </tbody>
                    </thead>
                    <thead>
                        <tr>
                            <td className='bg-black h-[1.2rem]'></td>
                        </tr>
                    </thead>
                </table>

                <table className='mt-[1rem]'>
                    <thead className='flex'>
                        <tr className='border border-black flex flex-col'>
                            <td className='w-[27rem] text-[11px] p-[0.2rem] font-[600]'>CONFORME:</td>
                            <td className='mt-[0.6rem]'></td>
                            <td className='text-[10.5px] tracking-[-1px] font-[600]'>
                                I fully understand the extent of my roles and responsibilities in relationto my assignment as a <br/>
                                faculty member and therefore COMMIT myself to:
                            </td>
                            <td  className='text-[10.5px] tracking-[-1px] font-[600]'>
                                (A) be punctual and be available in the institute during official working hours; <br />
                                (B) conduct assigned classes and other functions at the scheduled times; <br />
                                (C) evaluate and record students performance in an objective and fair manner; and, <br />
                                (D) submit all required reports on time.
                            </td>
                            <td className='mt-[0.6rem]'></td>
                            <td className='flex p-0 m-0'>
                                <div className='bg-black text-white p-[0.2rem] flex items-center justify-center w-[13.5rem]'>
                                    <span className='text-[14px] font-[500]'>EARIST-QSF-INST-015</span>
                                </div>
                                <div className='flex flex-col items-center w-[13.5rem]'>
                                    <span className='text-[11px] font-[500] underline'>Mr. DHANI SAN JOSE</span>
                                    <span className='mt-[-2px]  text-[10px]'>Faculty Member</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <tr className='flex'>
                                <div className='w-[13.5rem] h-[6rem] '>
                                    <div><i className='text-[11.5px] font-[500] ml-[3px]'>Prepared By:</i></div>
                                    <div className='flex flex-col mt-[2rem] w-full items-center'>
                                        <span className='text-[12px] '>Prof. HAZEL F. ANUNCIO</span><br />
                                        <span className='text-[11px] mt-[-1.7rem] font-[500] tracking-[-1px]'>Information Technology Department Head</span>
                                    </div>
                                </div>
                                <div className='w-[19.5rem] h-[6rem]' >
                                    <div><i className='text-[11.5px] font-[500] ml-[3px]'>Certified Corrected By:</i></div>
                                    <div className='flex flex-col mt-[2rem] w-full items-center'>
                                        <span className='text-[12px] '>DR. JESUS PANGUIGAN</span><br />
                                        <span className='text-[11px] mt-[-1.7rem] font-[500] tracking-[-1px]'>Dean, CCS</span>
                                    </div>
                                </div>
                            </tr>
                            <tr className='flex'>
                                <div className='w-[13.5rem] h-[6rem] '>
                                    <div><i className='text-[11.5px] font-[500] ml-[3px]'>Recommending Approval:</i></div>
                                    <div className='flex flex-col mt-[2rem] w-full items-center'>
                                        <span className='text-[12px] '>DR. ERIC C. MENDOZA</span><br />
                                        <span className='text-[11px] mt-[-1.7rem] font-[500] tracking-[-1px]'>VPAA</span>
                                    </div>
                                </div>
                                <div className='w-[19.5rem] h-[6rem] '>
                                    <div><i className='text-[11.5px] font-[500] ml-[3px]'>Approved:</i></div>
                                    <div className='flex flex-col mt-[2rem] w-full items-center'>
                                        <span className='text-[12px] '>Engr. ROGELIO T. MAMARADLO, Edb</span><br />
                                        <span className='text-[11px] mt-[-1.7rem] font-[500] tracking-[-1px]'>President</span>
                                    </div>
                                </div>
                            </tr>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    )
}

export default FacultyWorkload;
