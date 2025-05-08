import React, { useState, useEffect } from "react";
import axios from "axios";

const YearLevelPanel = () => {
  const [yearLevelDescription, setYearLevelDescription] = useState("");
  const [yearLevelList, setYearLevelList] = useState([]);

  useEffect(() => {
    fetchYearLevelList();
  }, []);

  const fetchYearLevelList = async () => {
    try {
      const res = await axios.get("http://localhost:5000/get_year_level");
      setYearLevelList(res.data);
    } catch (err) {
      console.error("Failed to fetch year levels:", err);
    }
  };

  const handleAddYearLevel = async () => {
    if (!yearLevelDescription.trim()) return alert("Year level description is required");

    try {
      await axios.post("http://localhost:5000/years_level", { year_level_description: yearLevelDescription });
      setYearLevelDescription("");
      fetchYearLevelList();
    } catch (err) {
      console.error("Error adding year level:", err);
    }
  };

  return (
    <div style={styles.container}>
      {/* Form Section */}
      <div style={styles.formSection}>
        <h2 style={styles.heading}>Year Level Registration</h2>
        <div style={styles.formGroup}>
          <label style={styles.label}>Year Level Description:</label>
          <input
            type="text"
            placeholder="Enter year level description"
            value={yearLevelDescription}
            onChange={(e) => setYearLevelDescription(e.target.value)}
            style={styles.input}
          />
        </div>
        <button onClick={handleAddYearLevel} style={styles.button}>Save</button>
      </div>

      {/* Display Section */}
      <div style={styles.displaySection}>
        <h2 style={styles.heading}>Registered Year Levels</h2>
        <div style={styles.scrollableTableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableCell}>Year Level ID</th>
                <th style={styles.tableCell}>Year Level Description</th>
              </tr>
            </thead>
            <tbody>
              {yearLevelList.map((level, index) => (
                <tr key={index}>
                  <td style={styles.tableCell}>{level.year_level_id}</td>
                  <td style={styles.tableCell}>{level.year_level_description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Simplified inline styles
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

export default YearLevelPanel;