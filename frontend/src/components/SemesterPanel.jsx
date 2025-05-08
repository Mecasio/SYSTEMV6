import React, { useEffect, useState } from "react";
import axios from "axios";

const SemesterPanel = () => {
    const [semesterDescription, setSemesterDescription] = useState("");
    const [semesters, setSemesters] = useState([]);

    // Load semesters from backend
    const fetchSemesters = async () => {
        try {
            const res = await axios.get("http://localhost:5000/get_semester");
            setSemesters(res.data);
        } catch (error) {
            console.error("Error fetching semesters:", error);
        }
    };

    useEffect(() => {
        fetchSemesters();
    }, []);

    // Add a new semester
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!semesterDescription.trim()) return;

        try {
            await axios.post("http://localhost:5000/semesters", {
                semester_description: semesterDescription,
            });
            setSemesterDescription("");
            fetchSemesters();
        } catch (error) {
            console.error("Error saving semester:", error);
        }
    };

    return (
        <div style={styles.container}>
            {/* Form Section */}
            <div style={styles.formSection}>
                <h2 style={styles.heading}>Semester Panel</h2>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Semester Description:</label>
                    <input
                        type="text"
                        value={semesterDescription}
                        onChange={(e) => setSemesterDescription(e.target.value)}
                        placeholder="Enter semester (e.g., First Semester)"
                        style={styles.input}
                    />
                </div>
                <button onClick={handleSubmit} style={styles.button}>Save</button>
            </div>

            {/* Display Section */}
            <div style={styles.displaySection}>
                <h2 style={styles.heading}>Saved Semesters</h2>
                <div style={styles.scrollableTableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.tableCell}>Semester ID</th>
                                <th style={styles.tableCell}>Semester Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {semesters.map((semester, index) => (
                                <tr key={index}>
                                    <td style={styles.tableCell}>{semester.semester_id}</td>
                                    <td style={styles.tableCell}>{semester.semester_description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Simplified inline styles (similar to RoomRegistration)
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: '1000px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
  },
  formSection: {
    width: '45%',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: 'white',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  displaySection: {
    width: '50%',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: 'white',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  heading: {
    fontSize: '20px',
    marginBottom: '20px',
    color: '#333',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: 'maroon',
    color: 'white',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  scrollableTableContainer: {
    maxHeight: '400px',
    overflowY: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableCell: {
    border: '1px solid #ddd',
    padding: '10px',
  },
};

export default SemesterPanel;