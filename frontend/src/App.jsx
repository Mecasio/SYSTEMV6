import React, {useState, useEffect} from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import EnrolledDashboard from './pages/Erlm_Dashboard';
import StudentPage from './pages/Erlm_Student_Page';
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
import FacultyDashboard from './components/FacultyDashboard';
import StudentProfileForm from './components/StudentProfile';
import YearLevelPanel from './components/YearLevelPanel';
import YearPanel from './components/YearPanel';
import YearUpdateForm from './components/YearUpdateForm';
import SemesterPanel from './components/SemesterPanel';
import SchoolYearPanel from './components/SchoolYearPanel';
import SchoolYearActivatorPanel from './components/SchoolYearActivatorPanel';
import AdmForm from './components/adm_form';
import FamilyBackgroundForm from './components/FamilyBackground';
import EducationalAttainmentForm from './components/EducationalAttainment';
import ApplicantRequirement from './components/applicant_requirement';
import ApplicantForm from './components/Applicant';
import RequirementsForm from './components/RequirementsForm';
import Dashboard from './pages/Dashboard';
import AdmissionDashboardPanel from './pages/AdmissionDashboard';
import SystemDashboardPanel from './pages/SystemDashboard';
import DepartmentManagement from './pages/DepartmentDashboard';
import ApplicantPersonalInfoForm from './components/PersonalInformation';
import StudentNumbering from './components/StudentNumbering';
import CourseTagging from './components/CourseTagging';
import UserRegistrationForm from './components/UserRegistrationForm';
import ChangeGradingPeriod from './components/ChangeYearGradPer';
import AccountDashboard from './pages/AccountDashboard';
import ScheduleChecker from './components/ScheduleChecker';

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

          <div className="app-format">
            {isAuthenticated && (
              <article className='min-w-[19rem]'>
                <SideBar setIsAuthenticated={setIsAuthenticated} />
              </article>
            )}

            <main className='w-full'>
              <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/register_prof" element={<RegisterProf />} />
                <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated}/>}/>
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated}/>}/>
                <Route path="/login_prof" element={<LoginProf setIsAuthenticated={setIsAuthenticated}/>}/>
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
                <Route path="/faculty_dashboard" element={<FacultyDashboard />}/>
                <Route path="/personal_information" element={<ApplicantPersonalInfoForm />} />
                <Route path="/room_registration" element={<ProtectedRoute><DepartmentRoom/></ProtectedRoute>}/> {/* not final */}
                <Route path="/course_management" element={<ProtectedRoute><CourseManagement/></ProtectedRoute>}/>
                <Route path="/program_tagging" element={<ProtectedRoute><ProgramTagging/></ProtectedRoute>}/>
                <Route path="/course_panel" element={<ProtectedRoute><CoursePanel/></ProtectedRoute>}/>
                <Route path="/program_panel" element={<ProtectedRoute><ProgramPanel/></ProtectedRoute>}/>
                <Route path="/department_section_panel" element={<ProtectedRoute><DepartmentSection/></ProtectedRoute>}/>
                <Route path="/curriculum_panel" element={<ProtectedRoute><CurriculumPanel/></ProtectedRoute>}/>
                <Route path="/department_registration" element={<ProtectedRoute><DepartmentRegistration/></ProtectedRoute>}/>
                <Route path="/section_panel" element={<ProtectedRoute><SectionPanel/></ProtectedRoute>}/>
                <Route path="/professor_registration" element={<ProtectedRoute><DepartmentProf/></ProtectedRoute>}/>
                <Route path="/enrollment_dashboard" element={<ProtectedRoute><EnrolledDashboard /></ProtectedRoute>} />
                <Route path="/student_profile_form" element={<ProtectedRoute><StudentProfileForm /></ProtectedRoute>} />
                <Route path="/year_level_panel" element={<ProtectedRoute><YearLevelPanel /></ProtectedRoute>} />
                <Route path="/year_panel" element={<ProtectedRoute><YearPanel /></ProtectedRoute>} />
                <Route path="/year_update_panel" element={<ProtectedRoute><YearUpdateForm /></ProtectedRoute>} />
                <Route path="/semester_panel" element={<ProtectedRoute><SemesterPanel /></ProtectedRoute>} />
                <Route path="/school_year_panel" element={<ProtectedRoute><SchoolYearPanel /></ProtectedRoute>} />
                <Route path="/school_year_activator_panel" element={<ProtectedRoute><SchoolYearActivatorPanel /></ProtectedRoute>} />
                <Route path="/student_page" element={<ProtectedRoute><StudentPage /></ProtectedRoute>} />
                <Route path="/adm_form" element={<ProtectedRoute><AdmForm /></ProtectedRoute>} />
                <Route path="/family_background" element={<ProtectedRoute><FamilyBackgroundForm /></ProtectedRoute>} />
                <Route path="/educational_attainment_form" element={<ProtectedRoute><EducationalAttainmentForm /></ProtectedRoute>} />
                <Route path="/applicant_requirement" element={<ProtectedRoute><ApplicantRequirement /></ProtectedRoute>} />
                <Route path="/application_form" element={<ProtectedRoute><ApplicantForm /></ProtectedRoute>} />
                <Route path="/requirements_form" element={<ProtectedRoute><RequirementsForm /></ProtectedRoute>} />
                <Route path="/admission_dashboard" element={<ProtectedRoute><AdmissionDashboardPanel /></ProtectedRoute>} />
                <Route path="/department_dashboard" element={<ProtectedRoute><DepartmentManagement /></ProtectedRoute>} />
                <Route path="/system_dashboard" element={<ProtectedRoute><SystemDashboardPanel /></ProtectedRoute>} />
                <Route path="/account_dashboard" element={<ProtectedRoute><AccountDashboard /></ProtectedRoute>} />
                <Route path="/student_numbering" element={<ProtectedRoute><StudentNumbering /></ProtectedRoute>} />
                <Route path="/course_tagging" element={<ProtectedRoute><CourseTagging /></ProtectedRoute>} />
                <Route path="/user_register" element={<ProtectedRoute><UserRegistrationForm /></ProtectedRoute>} />
                <Route path="/schedule_checker" element={<ProtectedRoute><ScheduleChecker /></ProtectedRoute>} />
                <Route path="/change_grade_period" element={<ProtectedRoute><ChangeGradingPeriod /></ProtectedRoute>} />
                <Route path="/department_room" element={<ProtectedRoute><DepartmentRoom /></ProtectedRoute>} />
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