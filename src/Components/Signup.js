import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword,updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // Import the necessary Firestore functions
import { auth, db } from './Config/Config';

const Signup = () => {
    const history = useNavigate();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: fullName
            });
    

            // Store user data in Firestore
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, {
                fullName: fullName,
                email: email,
                password:password
            });

            setSuccessMsg('Signup Successful. You will now automatically get redirected to Login.');
            setFullName('');
            setEmail('');
            setPassword('');
            setErrorMsg('');

            setTimeout(() => {
                setSuccessMsg('');
                history('/login');
            }, 3000);
        } catch (error) {
            setErrorMsg('The email address is already in use by another account');
        }
    };

    return (
        <div className='container'>
            <br />
            <br />
            <h1>Sign Up</h1>
            <hr />
            {successMsg && (
                <>
                    <div className='success-msg'>{successMsg}</div>
                    <br />
                </>
            )}
            <form className='form-group' autoComplete="off" onSubmit={handleSignup}>
                <label>Full Name</label>
                <input
                    type="text"
                    className='form-control'
                    required
                    onChange={(e) => setFullName(e.target.value)}
                    value={fullName}
                />
                <br />
                <label>Email</label>
                <input
                    type="email"
                    className='form-control'
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <br />
                <label>Password</label>
                <input
                    type="password"
                    className='form-control'
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <br />
                <div className='btn-box'>
                    <span>
                        Already have an account? Login
                        <Link to="/login" className='link'> Here</Link>
                    </span>
                    <button type="submit" className='btn btn-success btn-md'>
                        SIGN UP
                    </button>
                </div>
            </form>
            <br></br>
            {errorMsg && <div className='error-msg'>{errorMsg}</div>}
        </div>
    );
};

export default Signup;
