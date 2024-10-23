import React, { useState } from 'react';
import axios from 'axios';

const RiskAssessment = () => {
    const [formData, setFormData] = useState({
        age: '',
        symptoms: '',
        treatment: '',
    });
    const [riskScore, setRiskScore] = useState(null);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/risk-assessment', formData);
            setRiskScore(res.data.riskScore);  // Assuming the response contains a risk score
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Risk Assessment</h2>
            <form onSubmit={onSubmit}>
                <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={formData.age}
                    onChange={onChange}
                    required
                />
                <input
                    type="text"
                    name="symptoms"
                    placeholder="Symptoms"
                    value={formData.symptoms}
                    onChange={onChange}
                    required
                />
                <input
                    type="text"
                    name="treatment"
                    placeholder="Treatment"
                    value={formData.treatment}
                    onChange={onChange}
                    required
                />
                <button type="submit">Assess Risk</button>
            </form>
            {riskScore !== null && (
                <div>
                    <h3>Risk Score: {riskScore}</h3>
                </div>
            )}
        </div>
    );
};

export default RiskAssessment;
