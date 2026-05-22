import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        // 1. URL se token nikalo (?token=xxxx)
        const token = searchParams.get('token');

        if (token) {
            // 2. Token ko localStorage mein save karo
            localStorage.setItem('token', token);

            // 3. User ko dashboard ya home par bhej do
            // Replace: true se user 'back' karke wapis auth page pe nahi ja payega
            navigate('/', { replace: true });
        } else {
            // Agar token nahi mila toh login page pe wapis bhej do
            navigate('/');
        }
    }, [searchParams, navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <h2>Authenticating... Please wait.</h2>
        </div>
    );
};

export default OAuthSuccess;