import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DepartmentSection = () => {
  const [dprtmntSection, setDprtmntSection] = useState({
    curriculum_id: '',
    section_id: '',
  });

  const [curriculumList, setCurriculumList] = useState([]);
  const [sectionsList, setSectionsList] = useState([]);
  const [departmentSections, setDepartmentSections] = useState([]);

  // Fetch curriculum data
  const fetchCurriculum = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get_curriculum');
      setCurriculumList(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch section data
  const fetchSections = async () => {
    try {
      const response = await axios.get('http://localhost:5000/section_table');
      setSectionsList(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch department sections
  const fetchDepartmentSections = async () => {
    try {
      const response = await axios.get('http://localhost:5000/department_section');
      setDepartmentSections(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCurriculum();
    fetchSections();
    fetchDepartmentSections();
  }, []);

  // Handle changes in the form fields
  const handleChangesForEverything = (e) => {
    const { name, value } = e.target;
    setDprtmntSection((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add department section to the database
  const handleAddingDprtmntrSection = async () => {
    try {
      await axios.post('http://localhost:5000/department_section', dprtmntSection);
      setDprtmntSection({ curriculum_id: '', section_id: '' });
      fetchDepartmentSections(); // Re-fetch the data to update the display
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formSection}>
        <h2 style={styles.heading}>Department Section Assignment</h2>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="curriculum_id">
            Curriculum:
          </label>
          <select
            name="curriculum_id"
            id="curriculum_id"
            value={dprtmntSection.curriculum_id}
            onChange={handleChangesForEverything}
            style={styles.select}
          >
            <option value="">Select Curriculum</option>
            {curriculumList.map((curriculum) => (
              <option key={curriculum.curriculum_id} value={curriculum.curriculum_id}>
                {curriculum.year_description} - {curriculum.program_description} | {curriculum.curriculum_id}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="section_id">
            Section:
          </label>
          <select
            name="section_id"
            id="section_id"
            value={dprtmntSection.section_id}
            onChange={handleChangesForEverything}
            style={styles.select}
          >
            <option value="">Select Section</option>
            {sectionsList.map((section) => (
              <option key={section.id} value={section.id}>
                {section.description}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleAddingDprtmntrSection} style={styles.button}>
          Insert
        </button>
      </div>

      <div style={styles.displaySection}>
        <h2 style={styles.heading}>Department Sections</h2>
        <div style={styles.scrollableTableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableCell}>Curriculum Name</th>
                 <th style={styles.tableCell}>Section Description</th>
                <th style={styles.tableCell}>Status</th>
              </tr>
            </thead>
            <tbody>
              {departmentSections.map((section) => (
                <tr key={section.id}>
                  <td style={styles.tableCell}>{section.program_code}-{section.year_description}</td>
                  <td style={styles.tableCell}>{section.section_description}</td>
                  <td style={styles.tableCell}>{section.dsstat === 0 ? 'Inactive' : 'Active'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#f8f8f8',
    borderRadius: '10px',
  },
  formSection: {
    width: '45%',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'transparent', // Removed background
  },
  displaySection: {
    width: '50%',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    overflowX: 'auto',
    textAlign: 'center', // Centering text in the display section
  },
  scrollableTableContainer: {
    maxHeight: '400px', // Make the table scrollable if there are many rows
    overflowY: 'auto', // Enable vertical scrolling
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
    textAlign: 'center', // Centering heading text
  },
  formGroup: {
    width: '100%',
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#444',
  },
  select: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: 'maroon',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    textAlign: 'center', // Centering text in the table
  },
  tableCell: {
    border: '1px solid #ccc',
    padding: '10px',
    textAlign: 'center', // Centering text in table cells
  },
};

export default DepartmentSection;