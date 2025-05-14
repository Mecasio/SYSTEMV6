import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RequirementUploader() {
  const [requirements, setRequirements] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [selectedRequirement, setSelectedRequirement] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [personId] = useState(1); // Replace with actual user ID

  useEffect(() => {
    fetchRequirements();
    fetchUploads();
  }, []);

  const fetchRequirements = async () => {
    try {
      const res = await axios.get('http://localhost:5000/requirements');
      setRequirements(res.data);
    } catch (err) {
      console.error('Error fetching requirements:', err);
    }
  };

  const fetchUploads = async () => {
    try {
      const res = await axios.get('http://localhost:5000/uploads');
      setUploads(res.data);
    } catch (err) {
      console.error('Error fetching uploads:', err);
    }
  };

  const handleUpload = async () => {
    if (!selectedRequirement || !file) {
      return alert('Please select a requirement and upload a file.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('requirements_id', selectedRequirement);
    formData.append('person_id', personId);

    try {
      setLoading(true);
      await axios.post('http://localhost:5000/upload', formData);
      setSelectedRequirement('');
      setFile(null);
      await fetchUploads();
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this upload?')) {
      try {
        await axios.delete(`http://localhost:5000/upload/${id}`);
        fetchUploads();
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete. Please try again.');
      }
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Upload Requirement Document</h2>

      <div style={formCardStyle}>
        <div style={formGroup}>
          <label style={labelStyle}>Requirement</label>
          <select
            onChange={(e) => setSelectedRequirement(e.target.value)}
            value={selectedRequirement}
            style={selectStyle}
          >
            <option value="">-- Select Requirement --</option>
            {requirements.map((req) => (
              <option key={req.id} value={req.id}>
                {req.description}
              </option>
            ))}
          </select>
        </div>

        <div style={formGroup}>
          <label style={labelStyle}>Upload File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={inputStyle}
            accept=".png,.jpg,.jpeg,.pdf"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          style={uploadButtonStyle(loading)}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      <h3 style={{ marginTop: '40px', textAlign: 'center' }}>Uploaded Documents</h3>

      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#f1f1f1' }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Requirement</th>
            <th style={thStyle}>File</th>
            <th style={thStyle}>Date Uploaded</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {uploads.length === 0 ? (
            <tr>
              <td colSpan="5" style={emptyCellStyle}>No uploads found.</td>
            </tr>
          ) : (
            uploads.map((upload, index) => (
              <tr key={upload.upload_id} style={index % 2 ? rowAltStyle : null}>
                <td style={tdStyle}>{upload.upload_id}</td>
                <td style={tdStyle}>{upload.description}</td>
                <td style={tdStyle}>
                  <a
                    href={`http://localhost:5000${upload.file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={linkStyle}
                  >
                    View
                  </a>
                </td>
                <td style={tdStyle}>
                  {upload.created_at ? new Date(upload.created_at).toLocaleString() : 'N/A'}
                </td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleDelete(upload.upload_id)}
                    style={deleteButtonStyle}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// 🔧 Styles
const containerStyle = {
  maxWidth: '800px',
  margin: '50px auto',
  fontFamily: 'Segoe UI, sans-serif',
  padding: '20px',
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '30px',
  color: '#333',
};

const formCardStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const formGroup = {
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle = {
  marginBottom: '5px',
  fontWeight: 'bold',
};

const selectStyle = {
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const inputStyle = {
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const uploadButtonStyle = (loading) => ({
  padding: '10px 15px',
  backgroundColor: loading ? '#6c757d' : '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: loading ? 'not-allowed' : 'pointer',
  transition: 'background-color 0.2s',
});

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',
};

const thStyle = {
  padding: '12px',
  borderBottom: '2px solid #ccc',
  textAlign: 'left',
};

const tdStyle = {
  padding: '10px',
  borderBottom: '1px solid #e0e0e0',
};

const rowAltStyle = {
  backgroundColor: '#f9f9f9',
};

const emptyCellStyle = {
  textAlign: 'center',
  padding: '20px',
  fontStyle: 'italic',
  color: '#888',
};

const linkStyle = {
  color: '#007bff',
  textDecoration: 'none',
};

const deleteButtonStyle = {
  padding: '6px 12px',
  backgroundColor: '#dc3545',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default RequirementUploader;
