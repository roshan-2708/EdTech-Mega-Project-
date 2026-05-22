// import React, { useEffect } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';

// const OAuthSuccess = () => {
//     const [searchParams] = useSearchParams();
//     const navigate = useNavigate();

//     useEffect(() => {
//         // 1. URL se token nikalo (?token=xxxx)
//         const token = searchParams.get('token');

//         if (token) {
//             // 2. Token ko localStorage mein save karo
//             localStorage.setItem('token', token);

//             // 3. User ko dashboard ya home par bhej do
//             // Replace: true se user 'back' karke wapis auth page pe nahi ja payega
//             navigate('/', { replace: true });
//         } else {
//             // Agar token nahi mila toh login page pe wapis bhej do
//             navigate('/');
//         }
//     }, [searchParams, navigate]);

//     return (
//         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//             <h2>Authenticating... Please wait.</h2>
//         </div>
//     );
// };

// export default OAuthSuccess;


import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '../slice/AuthSlice'; // 💡 Apne slice ka sahi file path check kar lena

const OAuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch(); // 💡 Redux action chalane ke liye dispatch initialization

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // 1. LocalStorage mein raw string save karo
            localStorage.setItem('token', token);

            // 2. 🔥 FIX: Redux state ko notify karo taaki Navbar/App update ho jaye
            dispatch(setToken(token));

            // 3. Home page ya dashboard par redirect karo
            navigate('/', { replace: true });
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate, dispatch]);

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            backgroundColor: '#000814', // StudyNotion dark theme color
            color: 'white' 
        }}>
            <div style={{ textAlign: 'center' }}>
                <h2>Authenticating... Please wait.</h2>
                <div className="spinner" style={{ marginTop: '20px' }}></div>
            </div>
        </div>
    );
};

export default OAuthSuccess;