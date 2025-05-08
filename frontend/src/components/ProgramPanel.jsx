
import React, { useState, useEffect } from "react";
import axios from "axios";

const ProgramPanel = () => {
  const [program, setProgram] = useState({ name: "", code: "" });
  const [programs, setPrograms] = useState([]);

  // Fetch all programs
  const fetchPrograms = async () => {
    try {
      const res = await axios.get("http://localhost:5000/get_program");
      setPrograms(res.data);
    } catch (err) {
      console.error("Error fetching programs:", err);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleChangesForEverything = (e) => {
    const { name, value } = e.target;
    setProgram((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddingProgram = async () => {
    if (!program.name || !program.code) {
      alert("Please fill all fields");
    } else {
      try {
        await axios.post("http://localhost:5000/program", program);
        setProgram({ name: "", code: "" });
        fetchPrograms(); // Refresh list
      } catch (err) {
        console.error("Error adding program:", err);
      }
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Left: Form */}
      <div style={styles.container}>
        <h2 style={styles.heading}>Program Panel Form</h2>
        <div style={styles.formGroup}>
          <label htmlFor="program_name" style={styles.label}>
            Program Description:
          </label>
          <input
            type="text"
            id="program_name"
            name="name"
            value={program.name}
            onChange={handleChangesForEverything}
            placeholder="Enter Program Description"
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="program_code" style={styles.label}>
            Program Code:
          </label>
          <input
            type="text"
            id="program_code"
            name="code"
            value={program.code}
            onChange={handleChangesForEverything}
            placeholder="Enter Program Code"
            style={styles.input}
          />
        </div>
        <button style={styles.button} onClick={handleAddingProgram}>
          Insert
        </button>
      </div>

      {/* Right: Program List */}
      <div style={styles.tableContainer}>
        <h2 style={styles.heading}>Program List</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Code</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((prog) => (
              <tr key={prog.id}>
                <td style={styles.td}>{prog.program_id}</td>
                <td style={styles.td}>{prog.program_description}</td>
                <td style={styles.td}>{prog.program_code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Styles
const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
    gap: "20px",
  },
  container: {
    flex: 1,
    background: "#f9f9f9",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  tableContainer: {
    flex: 2,
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    overflowY: "auto",  // Makes the content scrollable
    maxHeight: "500px", // Set max height to enable scrolling
  },
  heading: {
    marginBottom: "20px",
    textAlign: "center",
    color: "#333",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "maroon",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    background: "#eee",
    padding: "10px",
    border: "1px solid #ccc",
  },
  td: {
    padding: "10px",
    border: "1px solid #ccc",
    textAlign: "center",
  },
};


export default ProgramPanel;
