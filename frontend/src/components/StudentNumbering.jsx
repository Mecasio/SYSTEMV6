import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentNumbering = () => {
    const [persons, setPersons] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [assignedNumber, setAssignedNumber] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPersons();
    }, []);

    const fetchPersons = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/persons');
            setPersons(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handlePersonClick = (person) => {
        setSelectedPerson(person);
        setAssignedNumber('');
        setError('');
    };

    const handleAssignNumber = async () => {
        if (!selectedPerson) return;
        try {
            const res = await axios.post('http://localhost:5000/api/assign-student-number', {
                person_id: selectedPerson.person_id
            });
            setAssignedNumber(res.data.student_number);
            setError('');
            await fetchPersons(); // Reload the person list
            setSelectedPerson(null); // Clear selection
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                setError('An error occurred.');
            }
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Assign Student Number</h1>
            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <h2 className=''>Person List</h2>
                    {persons.length === 0 && <p>No available persons.</p>}
                    <ul className=''>
                        {persons.map((person, index) => (
                            <li key={person.person_id} className='p-2 border-[2px] mt-2 w-[20rem] cursor-pointer text-maroon-500 rounded border-maroon-500'>
                                <button onClick={() => handlePersonClick(person)}>
                                    {index + 1}.  {person.first_name} {person.middle_name} {person.last_name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div style={{ flex: 1 }}>
                    <h2>Selected Person</h2>
                    {selectedPerson ? (
                        <div>
                            <p><strong>Name:</strong> {selectedPerson.first_name} {selectedPerson.middle_name} {selectedPerson.last_name}</p>
                            <button onClick={handleAssignNumber} className='p-2 px-4 border-[2px] mt-2 rounded border-maroon-500 text-maroon-500'>Assign Student Number</button>
                        </div>
                    ) : (
                        <p>No person selected.</p>
                    )}
                    {assignedNumber && (
                        <p><strong>Assigned Student Number:</strong> {assignedNumber}</p>
                    )}
                    {error && (
                        <p style={{ color: 'red' }}>{error}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StudentNumbering;