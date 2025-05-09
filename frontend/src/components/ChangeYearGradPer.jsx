import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChangeGradingPeriod = () => {
  const [gradingPeriod, setGradingPeriod] = useState([]);

  const fetchYearPeriod = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get-grading-period');
      setGradingPeriod(response.data);
    } catch (error) {
      console.error("Error in Fetching Data", error);
    }
  };

  useEffect(() => {
    fetchYearPeriod();
  }, []);

  const handlePeriodActivate = async (id) => {
    try {
      await axios.post(`http://localhost:5000/grade_period_activate/${id}`);
      alert("Grading period activated!");
      fetchYearPeriod();
    } catch (error) {
      console.error("Error activating grading period:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Grading Periods</h1>
      <div style={styles.periodList}>
        {gradingPeriod.map((period) => (
          <div key={period.id} style={styles.periodItem}>
            <div style={styles.periodDescription}>{period.description}</div>
            <div style={styles.buttonContainer}>
              {period.status === 1 ? (
                <span style={styles.activatedStatus}>Activated</span>
              ) : (
                <button
                  style={styles.activateButton}
                  onClick={() => handlePeriodActivate(period.id)}
                >
                  Activate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Styling object for better layout and design consistency
const styles = {
  container: {
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginTop: '30px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  periodList: {
    marginTop: '20px',
  },
  periodItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#fff',
    marginBottom: '10px',
    borderRadius: '6px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
  },
  periodDescription: {
    fontSize: '18px',
    fontWeight: '500',
    color: '#333',
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  activateButton: {
    padding: '8px 15px',
    backgroundColor: '#4CAF50', // Green for the "Activate" button
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  activatedStatus: {
    color: '#757575',
    fontSize: '16px',
  },
};

export default ChangeGradingPeriod;