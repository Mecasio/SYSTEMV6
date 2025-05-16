import { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box
} from "@mui/material";

const RegisterProf = () => {
  const [profForm, setProfForm] = useState({
    fname: '',
    mname: '',
    lname: '',
    email: '',
    password: '',
  });
  const [file, setFile] = useState(null);

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setProfForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    if (
      !profForm.fname ||
      !profForm.mname ||
      !profForm.lname ||
      !profForm.email ||
      !profForm.password ||
      !file
    ) {
      alert("Please fill in all fields and upload a profile image");
      return;
    }

    const formData = new FormData();
    formData.append("fname", profForm.fname);
    formData.append("mname", profForm.mname);
    formData.append("lname", profForm.lname);
    formData.append("email", profForm.email);
    formData.append("password", profForm.password);
    formData.append("profileImage", file); // Field name must match Multer setup

    try {
      const response = await axios.post("http://localhost:5000/register_prof", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.error || "Registration Failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Professor Registration
        </Typography>
        <TextField
          label="First Name"
          fullWidth
          margin="normal"
          name="fname"
          value={profForm.fname}
          onChange={handleChanges}
        />
        <TextField
          label="Middle Name"
          fullWidth
          margin="normal"
          name="mname"
          value={profForm.mname}
          onChange={handleChanges}
        />
        <TextField
          label="Last Name"
          fullWidth
          margin="normal"
          name="lname"
          value={profForm.lname}
          onChange={handleChanges}
        />
        <TextField
          label="Email Address"
          fullWidth
          margin="normal"
          name="email"
          type="email"
          value={profForm.email}
          onChange={handleChanges}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          name="password"
          value={profForm.password}
          onChange={handleChanges}
        />

        <Typography variant="body1" sx={{ mt: 2 }}>
          Upload Profile Picture
        </Typography>
        <input
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginTop: "10px", marginBottom: "20px" }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleRegister}
        >
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default RegisterProf;
