import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { Container, Checkbox } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import '../styles/Container.css';
import Logo from '../assets/Logo.png';

const Login = ({ setIsAuthenticated }) => {
    const [usersData, setUserData] = useState({
        email: '',
        password: '',
        role: '',
    });

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); 

    const handleChanges = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        
        if (!usersData.email || !usersData.password) {
            setErrorMessage("Please fill all required credentials");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usersData),
            });

            console.log('Login response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Login response data:', data);

                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem("prof_id", data.prof_id);
                    localStorage.setItem("email", data.email);
                    localStorage.setItem("fname", data.fname);
                    localStorage.setItem("mname", data.mname);
                    localStorage.setItem("lname", data.lname);
                    localStorage.setItem("email", data.email);
                    localStorage.setItem("profile_img", data.profile_img);
                    localStorage.setItem("subject_section_mappings", JSON.stringify(data.subject_section_mappings));
                    localStorage.setItem("school_year_id", data.school_year_id);
                    const decoded = JSON.parse(atob(data.token.split('.')[1]));
                    console.log('Decoded JWT:', decoded);
                    console.log("profile_image:", data.profile_img);

                    if (decoded.role === 'superadmin' || decoded.role === 'administrator') {
                        setIsAuthenticated(true);
                        navigate('/dashboard');
                    } else if (decoded.role === 'applicant') {
                        setIsAuthenticated(true);
                        navigate('/applicant_personal_information');
                    } else if (decoded.role === 'faculty') {
                        setIsAuthenticated(true);
                        navigate('/faculty_dashboard');
                    } else {
                        setErrorMessage('Unauthorized role');
                    }
                } else {
                    setErrorMessage('No token received from the server.');
                }
            } else {
                const data = await response.json();
                setErrorMessage(data.error || 'Invalid credentials');
                console.error('Login failed:', data.error);
            }
        } catch (error) {
            console.error('Login failed:', error);
            setErrorMessage('Invalid Credentials');
        }
    };

    return (
        <>  
            <Container style={{display: "flex", alignItems: "center", marginTop: '1.5%', justifyContent: 'center', height: '100%'}}>
                <div className="Container">
                    <div className="Header">
                        <div className="HeaderTitle">
                            <div className="CircleCon">
                                <img src={Logo} alt="" />
                            </div>
                        </div>
                        <div className="HeaderBody">
                            <strong>EARIST</strong>
                            <p>Information System</p>
                        </div>
                    </div>
                    <div className="Body">
                        <div className="TextField">
                            <label htmlFor="role">Select Role</label>
                            <select
                                id="role"
                                name="role"
                                className="border"
                                value={usersData.role}
                                onChange={handleChanges}
                            >
                                <option value="">-- Select Role --</option>
                                <option value="applicant">Applicant</option>
                                <option value="faculty">Faculty</option>
                                <option value="superadmin">Superadmin</option>
                            </select>
                        </div>
                        <div className="TextField">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                placeholder="Enter your email address"
                                className="border"
                                value={usersData.email}
                                onChange={handleChanges}
                            />
                        </div>
                        <div className="TextField" style={{ position: 'relative' }}>
                            <label htmlFor="password">Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                value={usersData.password}
                                onChange={handleChanges}
                                className="border"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    color: "rgba(0,0,0,0.3)",
                                    outline: "none",
                                    position: "absolute",
                                    top: "2.5rem",
                                    right: "1rem",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer"
                                }}
                            >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </button>
                        </div>
                        <div className="Checkbox">
                            <Checkbox id="checkbox" sx={{ color: '#A31D1D', '&.Mui-checked': { color: '#A31D1D' } }} />
                            <label htmlFor="checkbox">Remember Me</label>
                        </div>
                        <div className="Button" onClick={handleLogin}>
                            <span>Log In</span>
                        </div>
                        {errorMessage && (
                            <div style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
                                {errorMessage}
                            </div>
                        )}
                        <div className="LinkContainer">
                            <span>Forget password?</span>
                        </div>
                        <div className="LinkContainer RegistrationLink" style={{margin: '0.1rem 0rem'}}>
                            <p>Doesn't Have an Account?</p>
                            <span><Link to={'/register'}>Register Here</Link></span>
                        </div>
                    </div>
                    <div className="Footer">
                        <div className="FooterText">
                            &copy; 2025 EARIST Information System. All rights reserved.
                        </div>
                    </div>
                </div>
            </Container>
        </>        
    );
}

export default Login;
