
import React, { useEffect, useState } from "react";
import axios from "axios";

const YearPanel = () => {
  const [yearDescription, setYearDescription] = useState("");
  const [years, setYears] = useState([]);

  // Load years from backend
  const fetchYears = async () => {
    try {
      const res = await axios.get("http://localhost:5000/year_table");
      setYears(res.data);
    } catch (error) {
      console.error("Error fetching years:", error);
    }
  };

  useEffect(() => {
    fetchYears();
  }, []);

  // Add a new year
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!yearDescription.trim()) return;

    try {
      await axios.post("http://localhost:5000/years", {
        year_description: yearDescription,
      });
      setYearDescription(""); // Clear the input
      fetchYears(); // Refresh the list
    } catch (error) {
      console.error("Error saving year:", error);
    }
  };

  return (
    <div style={styles.container}>
      {/* Form Section */}
      <div style={styles.formSection}>
        <h2 style={styles.heading}>Year Panel</h2>
        <div style={styles.formGroup}>
          <label style={styles.label}>Year Description:</label>
          <input
            type="text"
            placeholder="Enter year (e.g., 2026)"
            value={yearDescription}
            onChange={(e) => setYearDescription(e.target.value)}
            style={styles.input}
          />
        </div>
        <button onClick={handleSubmit} style={styles.button}>Save</button>
      </div>

      {/* Display Section */}
      <div style={styles.displaySection}>
        <h3 style={styles.heading}>Saved Years:</h3>
        <div style={styles.scrollableTableContainer}>
          <ul style={styles.list}>
            {years.map((year) => (
              <li key={year.year_id} style={styles.listItem}>
                {year.year_description}{" "}
                {year.status === 1 ? "(Active)" : ""}
              </li>
            ))}
          </ul>
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
  list: {
    listStyleType: 'disc',
    paddingLeft: '20px',
  },
  listItem: {
    marginBottom: '10px',
  },
};

export default YearPanel;
