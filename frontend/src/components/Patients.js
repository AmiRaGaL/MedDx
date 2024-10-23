import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // To handle navigation if needed

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // We could use this to redirect users if needed

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/patients', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPatients(res.data); // Set patients data after fetch
            } catch (err) {
                setError('Failed to load patients. Please try again.');
                console.error(err);
            }
        };

        fetchPatients(); // Fetch the patients list when the component mounts
    }, []);

    return (
        <div>
            <h2>Patients List</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <ul>
                {patients.map((patient) => (
                    <li key={patient._id}>
                        {patient.name} (Age: {patient.age}, Symptoms: {patient.symptoms})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Patients;
