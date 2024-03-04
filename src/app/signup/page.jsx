"use client"
import React, { useState } from 'react';
import styles from './Signup.module.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Signup = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loaderText, setLoaderText] = useState('Sign Up');
    const [loader, setLoader] = useState(false);

    const router = useRouter();

    const handleSignup = async () => {
        if (!userName || !email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        setLoader(true);
        setLoaderText('Loading...');

        let res = await axios.post('/api/signup', {
            userName: userName.trim(),
            email: email.trim(),
            password: password.trim()
        })

        if (res.data.success) {
            setError('');
            router.push('/');
        } else {
            setError(res.data.message);
            setLoader(false);
            setLoaderText('Sign Up');
        }
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={styles['signup-container']}>
            <h2>Sign Up</h2>
            <form>
                <label htmlFor="userName">UserName:</label>
                <input
                    type="text"
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />

                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label htmlFor="password">Password:</label>
                <div className={styles['password-container']}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className={styles['password-toggle']}
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>

                <button type="button" onClick={handleSignup} disabled={loader}>
                    {loaderText}
                </button>

                {error && <p className={styles.error}>{error}</p>}
            </form>
        </div>
    );
};

export default Signup;
