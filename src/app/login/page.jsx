"use client"

import React, { useState } from 'react';
import styles from './Login.module.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loaderText, setLoaderText] = useState('Login');
    const [loader, setLoader] = useState(false);

    const router = useRouter();

    const handleLogin = async () => {
        if (!username || !password) {
            setError('Please fill in all fields.');
            return;
        }

        setLoader(true);
        setLoaderText('Loading...');

        let res = await axios.post('/api/login', {
            userName: username.trim(),
            password: password.trim()
        })

        if (res.data.success) {
            setError('');
            router.push('/');
        } else {
            setError(res.data.message);
            setLoader(false);
            setLoaderText('Login');
        }

    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={styles['login-container']}>
            <h2>Login</h2>
            <form>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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

                <button type="button" onClick={handleLogin} disabled={loader}>
                    {loaderText}
                </button>

                {error && <p className={styles.error}>{error}</p>}
            </form>
        </div>
    );
};

export default Login;
