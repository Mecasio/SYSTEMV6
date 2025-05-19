import React, {useState, useEffect} from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DepartmentRegistration from './components/DprtmntRegistration';
import DepartmentRoom from './components/DprtmntRoom';
import DepartmentProf from './components/DprtmntProf';
import SideBar from './components/Sidebar';
import ProgramTagging from './components/ProgramTagging';
import CourseManagement from './pages/CourseManagement';
import CoursePanel from './components/CoursePanel';
import ProgramPanel from './components/ProgramPanel';
import CurriculumPanel from './components/CurriculumPanel';
import SectionPanel from './components/SectionPanel';
import DepartmentSection from './components/DepartmentSection';
import ProtectedRoute from './components/ProtectedRoute';
import LoginProf from './components/LoginProf';
import RegisterProf from './components/RegisterProf';
import StudentProfileForm from './components/StudentProfile';
import YearLevelPanel from './components/YearLevelPanel';
import YearPanel from './components/YearPanel';
import YearUpdateForm from './components/YearUpdateForm';
import SemesterPanel from './components/SemesterPanel';
import SchoolYearPanel from './components/SchoolYearPanel';
import SchoolYearActivatorPanel from './components/SchoolYearActivatorPanel';
import FamilyBackgroundForm from './components/FamilyBackground';
import EducationalAttainmentForm from './components/EducationalAttainment';
import RequirementsForm from './components/RequirementsForm';
import AdmissionDashboardPanel from './pages/AdmissionDashboard';
import SystemDashboardPanel from './pages/SystemDashboard';
import DepartmentManagement from './pages/DepartmentDashboard';
import PersonalInfoForm from './components/PersonalInformation';
import StudentNumbering from './components/StudentNumbering';
import CourseTagging from './components/CourseTagging';
import UserRegistrationForm from './components/UserRegistrationForm';
import ChangeGradingPeriod from './components/ChangeYearGradPer';
import AccountDashboard from './pages/AccountDashboard';
import ScheduleChecker from './components/ScheduleChecker';
import SearchStudentCOR from './components/SearchCertificateOfGrades';
import RoomRegistration from './components/RoomRegistration';
import ScheduleFilterer from './pages/SchedulePlottingFilter';

import ApplicantPersonalInfoForm from './components/ApplicantPersonalInfo';
import ApplicantFamilyBackground from './components/ApplicantFamilyBckgrndForm';
import ApplicantEducationalAttainment from './components/ApplicantEducAttainmnt';
import ApplicantHealthMedicalRecords from './components/ApplicantHeatlthRecords';
import ApplicantOtherInformation from './components/ApplicantOtherInfo';

import FacultyDashboard from './pages/FacultyDashboard'; //For Professors & Faculty Members
import Dashboard from './pages/Dashboard'; // For SuperAdmin & Admin
import ApplicantDashboard from './pages/ApplicantDashboard';

import Unauthorized from './components/Unauthorized';
import RequirementUploader from './components/RequirementUploader';
import GradingSheet from './components/GradingSheet';
import FacultyWorkload from './components/FacultyWorkload';
import FacultyMasterList from './components/FacultyMasterlist';
import FacultyStudentClassList from './components/FacultyStudentClassList';
import FacultySchedule from './components/FacultySchedule';
import Dashboard1 from './components/Dashboard1';
import StudentDashboard from './pages/StudentDashboard';

  function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const fetchAuthentication = () => {
      const token = localStorage.getItem('token');
      if(token !== null){
        setIsAuthenticated(true);
      }
    }

    useEffect(() => {
      fetchAuthentication();
    }, []);

    const theme = createTheme({
      typography: {
          fontFamily: "Poppins, sans-serif",
      },
    });

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Router>
          <header>
            <Navbar isAuthenticated={isAuthenticated}/>
          </header>

          <div className="flex">
            {isAuthenticated && (
              <article className='min-w-[21rem] min-h-screen flex'>
                <SideBar setIsAuthenticated={setIsAuthenticated} style={{height: '100%'}}/>
              </article>
            )}

            <main className='w-full'>
              <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/register_prof" element={<RegisterProf />} />
                <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated}/>}/>
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated}/>}/>
                <Route path="/login_prof" element={<LoginProf setIsAuthenticated={setIsAuthenticated}/>}/>
                
                <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['registrar']}><Dashboard /></ProtectedRoute>}/>
                <Route path="/faculty_dashboard" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyDashboard /></ProtectedRoute>}/>
                <Route path="/applicant_dashboard" element={<ProtectedRoute><ApplicantDashboard/></ProtectedRoute>} />

                <Route path="/personal_information" element={<PersonalInfoForm />} />
                <Route path="/room_registration" element={<ProtectedRoute><RoomRegistration/></ProtectedRoute>}/> 
                <Route path="/course_management" element={<ProtectedRoute><CourseManagement/></ProtectedRoute>}/>
                <Route path="/program_tagging" element={<ProtectedRoute><ProgramTagging/></ProtectedRoute>}/>
                <Route path="/course_panel" element={<ProtectedRoute><CoursePanel/></ProtectedRoute>}/>
                <Route path="/program_panel" element={<ProtectedRoute><ProgramPanel/></ProtectedRoute>}/>
                <Route path="/department_section_panel" element={<ProtectedRoute><DepartmentSection/></ProtectedRoute>}/>
                <Route path="/curriculum_panel" element={<ProtectedRoute><CurriculumPanel/></ProtectedRoute>}/>
                <Route path="/department_registration" element={<ProtectedRoute><DepartmentRegistration/></ProtectedRoute>}/>
                <Route path="/section_panel" element={<ProtectedRoute><SectionPanel/></ProtectedRoute>}/>
                <Route path="/professor_registration" element={<ProtectedRoute><DepartmentProf/></ProtectedRoute>}/>
                <Route path="/student_profile_form" element={<ProtectedRoute><StudentProfileForm /></ProtectedRoute>} />
                <Route path="/year_level_panel" element={<ProtectedRoute><YearLevelPanel /></ProtectedRoute>} />
                <Route path="/year_panel" element={<ProtectedRoute><YearPanel /></ProtectedRoute>} />
                <Route path="/year_update_panel" element={<ProtectedRoute><YearUpdateForm /></ProtectedRoute>} />
                <Route path="/semester_panel" element={<ProtectedRoute><SemesterPanel /></ProtectedRoute>} />
                <Route path="/school_year_panel" element={<ProtectedRoute><SchoolYearPanel /></ProtectedRoute>} />
                <Route path="/school_year_activator_panel" element={<ProtectedRoute><SchoolYearActivatorPanel /></ProtectedRoute>} />
                <Route path="/family_background" element={<ProtectedRoute><FamilyBackgroundForm /></ProtectedRoute>} />
                <Route path="/educational_attainment_form" element={<ProtectedRoute><EducationalAttainmentForm /></ProtectedRoute>} />
                <Route path="/requirements_form" element={<ProtectedRoute><RequirementsForm /></ProtectedRoute>} />
                <Route path="/requirements_uploader" element={<ProtectedRoute allowedRoles={['applicant']}><RequirementUploader /></ProtectedRoute>} />
                <Route path="/admission_dashboard" element={<ProtectedRoute><AdmissionDashboardPanel /></ProtectedRoute>} />
                <Route path="/department_dashboard" element={<ProtectedRoute><DepartmentManagement /></ProtectedRoute>} />
                <Route path="/system_dashboard" element={<ProtectedRoute><SystemDashboardPanel /></ProtectedRoute>} />
                <Route path="/account_dashboard" element={<ProtectedRoute><AccountDashboard /></ProtectedRoute>} />
                <Route path="/student_numbering" element={<ProtectedRoute><StudentNumbering /></ProtectedRoute>} />
                <Route path="/course_tagging" element={<ProtectedRoute><CourseTagging /></ProtectedRoute>} />
                <Route path="/user_register" element={<ProtectedRoute><UserRegistrationForm /></ProtectedRoute>} />
                <Route path="/schedule_checker/:dprtmnt_id" element={<ProtectedRoute><ScheduleChecker /></ProtectedRoute>} />
                <Route path="/change_grade_period" element={<ProtectedRoute><ChangeGradingPeriod /></ProtectedRoute>} />
                <Route path="/department_room" element={<ProtectedRoute><DepartmentRoom /></ProtectedRoute>} />
                <Route path="/search_cor" element={<ProtectedRoute><SearchStudentCOR /></ProtectedRoute>} />
                <Route path="/select_college" element={<ProtectedRoute><ScheduleFilterer /></ProtectedRoute>} />

                <Route path="/applicant_personal_information" element={<ProtectedRoute allowedRoles={['applicant']}><ApplicantPersonalInfoForm /></ProtectedRoute>} />
                <Route path="/applicant_family_background" element={<ProtectedRoute allowedRoles={['applicant']}><ApplicantFamilyBackground/></ProtectedRoute>} />
                <Route path="/applicant_educational_attainment" element={<ProtectedRoute allowedRoles={['applicant']}><ApplicantEducationalAttainment /></ProtectedRoute>} />
                <Route path="/applicant_health_medical_records" element={<ProtectedRoute allowedRoles={['applicant']}><ApplicantHealthMedicalRecords/></ProtectedRoute>} />
                <Route path="/applicant_other_information" element={<ProtectedRoute allowedRoles={['applicant']}><ApplicantOtherInformation/></ProtectedRoute>} />

                <Route path="/grading_sheet" element={<ProtectedRoute><GradingSheet /></ProtectedRoute>} />
                <Route path="/faculty_workload" element={<ProtectedRoute><FacultyWorkload /></ProtectedRoute>} />
                <Route path="/faculty_masterlist" element={<ProtectedRoute><FacultyMasterList /></ProtectedRoute>} />
                <Route path="/subject_masterlist/:subject_id/:department_section_id/:school_year_id" element={<ProtectedRoute><FacultyStudentClassList /></ProtectedRoute>} />
                <Route path="/faculty_schedule" element={<ProtectedRoute><FacultySchedule /></ProtectedRoute>} />
                <Route path="/dashboard1" element={<ProtectedRoute allowedRoles={'applicant'}><Dashboard1 /></ProtectedRoute>} />
                <Route path="/student_dashboard" element={<ProtectedRoute allowedRoles={'student'}><StudentDashboard /></ProtectedRoute>} />
                <Route path="/unauthorized" element={<Unauthorized />} />
              </Routes>
            </main>
          </div>

            <footer>
              <Footer />
            </footer>
          
        </Router>
      </ThemeProvider>
    )
  }

  export default App