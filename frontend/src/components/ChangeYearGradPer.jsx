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
    <div>
      <h1>Grading Periods</h1>
      {gradingPeriod.map((period) => (
        <div key={period.id} className="flex items-center mt-4">
          <div className="w-64">{period.description}</div>
          <div>
            {period.status === 1 ? (
              <span className="text-gray-400">Activated</span>
            ) : (
              <button
                className="bg-green-900 p-2 text-white rounded"
                onClick={() => handlePeriodActivate(period.id)}
              >
                Activate
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChangeGradingPeriod;
