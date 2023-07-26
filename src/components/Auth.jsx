import React, { useEffect, useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import styles from '../styles/Auth.module.css';
import image1 from '../assets/auth1.jpg';
import image2 from '../assets/auth2.jpg';
import image3 from '../assets/auth3.jpg';
import errorIcon from '../assets/error-icon.svg';

const Auth = () => {
    // Sign up page authentication
    const [username_su, setUsername_su] = useState('');
    const [email_su, setEmail_su] = useState('');
    const [password_su, setPassword_su] = useState('');
    const [errorUsername_su, setErrorUsername_su] = useState('');
    const [errorEmail_su, setErrorEmail_su] = useState('');
    const [errorPassword_su, setErrorPassword_su] = useState('');
    const [state_su, setState_su] = useState(true);
    const [successGeneral_su, setSuccessGeneral_su] = useState('');
    const [errorGeneral_su, setErrorGeneral_su] = useState('');
    const [showErrorUsername_su, setShowErrorUsername_su] = useState(false);
    const [showErrorEmail_su, setShowErrorEmail_su] = useState(false);
    const [showErrorPassword_su, setShowErrorPassword_su] = useState(false);

    const handleUsername_su = (event) => {
        const validation = /^[a-zA-Z0-9]{8,20}$/.test(event.target.value);
        (() => !validation || errorEmail_su || errorPassword_su || !email_su || !password_su ? setState_su(true) : setState_su(false))();
        setErrorUsername_su(!validation ? 'Between 8-20 numbers or letters' : '');
        setUsername_su(event.target.value);
    };

    const handleEmail_su = (event) => {
        const validation = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(event.target.value);
        (() => !validation || errorUsername_su || errorPassword_su || !username_su || !password_su ? setState_su(true) : setState_su(false))();
        setErrorEmail_su(!validation ? 'This email is not valid' : '');
        setEmail_su(event.target.value);
    };

    const handlePassword_su = (event) => {
        const validation = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(event.target.value);
        (() => !validation || errorUsername_su || errorEmail_su || !username_su || !email_su ? setState_su(true) : setState_su(false))();
        setErrorPassword_su(!validation ? 'Lowercase, uppercase and numbers' : '');
        setPassword_su(event.target.value);
    };

    const handleShow_su = (type) => {
        setShowErrorUsername_su(type === 'username');
        setShowErrorEmail_su(type === 'email');
        setShowErrorPassword_su(type === 'password');
    };

    const handleSubmit_su = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/auth/signup', { username: username_su, email: email_su, password: password_su });
            setErrorGeneral_su('')
            setSuccessGeneral_su(response.data.message);
        } catch (error) {
            setSuccessGeneral_su('')
            setErrorGeneral_su(error.response.data.message);
        }
    };

    // Sign in page authentication
    const [email_si, setEmail_si] = useState('');
    const [password_si, setPassword_si] = useState('');
    const [errorEmail_si, setErrorEmail_si] = useState('');
    const [errorPassword_si, setErrorPassword_si] = useState('');
    const [state_si, setState_si] = useState(true);
    const [errorGeneral_si, setErrorGeneral_si] = useState('');
    const [showErrorEmail_si, setShowErrorEmail_si] = useState(false);
    const [showErrorPassword_si, setShowErrorPassword_si] = useState(false);

    const handleEmail_si = (event) => {
        const validation = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(event.target.value);
        (() => !validation || errorPassword_si || !password_si ? setState_si(true) : setState_si(false))();
        setErrorEmail_si(!validation ? 'This email is not valid' : '');
        setEmail_si(event.target.value);
    };

    const handlePassword_si = (event) => {
        const validation = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(event.target.value);
        (() => !validation || errorEmail_si || !email_si ? setState_si(true) : setState_si(false))();
        setErrorPassword_si(!validation ? 'Lowercase, uppercase and numbers' : '');
        setPassword_si(event.target.value);
    };

    const handleShow_si = (type) => {
        setShowErrorEmail_si(type === 'email');
        setShowErrorPassword_si(type === 'password');
    };

    const handleSubmit_si = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/auth/signin', { email: email_si, password: password_si });
            console.log(response.data.message)
            window.location.href = '/dashboard';
        } catch (error) {
            setErrorGeneral_si(error.response.data.message);
        }
    };

    // Google authentication
    const handleSuccessGoogle = async (event) => {
        try {
            const { credential } = event;
            await axios.post('/auth/google', { credential });
            window.location.href = '/wallet';
        } catch (error) {
            setErrorGeneral_si(error.response.data.message);
            setErrorGeneral_su(error.response.data.message);
        }
    };

    const handleErrorGoogle = async (event) => {
        console.error('Google authentication is not available:', event);
    };

    // Dynamic page
    const [currentImage, setCurrentImage] = useState(0);
    const [showSignupForm, setShowSignupForm] = useState(true);
    const images = [image1, image2, image3];

    const toggleForm = (type) => {
        setShowSignupForm(type === 'signup');
    };

    const changeImage = () => {
        setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    };

    useEffect(() => {
        const interval = setInterval(changeImage, 6000);
        return () => clearInterval(interval);
    });

    return (
        <div className={styles.containerAuth}>
            <div className={styles.contentLeft}>
                <div className={styles.slider}>
                    {images.map((image, index) => (
                        <img key={index} className={currentImage === index ? styles.showImage : styles.hideImage} src={image} alt='' />
                    ))}
                </div>
            </div>
            <div className={styles.contentRight}>
                <div className={showSignupForm ? styles.contentForm : styles.hideForm}>
                    <div><h1>Getting started!</h1></div>
                    <form onSubmit={handleSubmit_su}>
                        <div className={styles.controller}>
                            <input className={errorUsername_su ? styles.errorInput : ''} onChange={handleUsername_su} type='text' placeholder='Create a new username' value={username_su}/>
                            {errorUsername_su && <img onMouseEnter={() => handleShow_su('username')} onMouseLeave={handleShow_su} className={styles.errorIcon} src={errorIcon} alt='' />}
                            {showErrorUsername_su && <div className={styles.errorMessage}><label>{errorUsername_su}</label></div>}
                        </div>
                        <div className={styles.controller}>
                            <input className={errorEmail_su ? styles.errorInput : ''} onChange={handleEmail_su} type='email' placeholder='you@example.com' value={email_su}/>
                            {errorEmail_su && <img onMouseEnter={() => handleShow_su('email')} onMouseLeave={handleShow_su} className={styles.errorIcon} src={errorIcon} alt='' />}
                            {showErrorEmail_su && <div className={styles.errorMessage}><label>{errorEmail_su}</label></div>}
                        </div>
                        <div className={styles.controller}>
                            <input className={errorPassword_su ? styles.errorInput : ''} onChange={handlePassword_su} type='password' placeholder='Choose a strong password' value={password_su}/>
                            {errorPassword_su && <img onMouseEnter={() => handleShow_su('password')} onMouseLeave={handleShow_su} className={styles.errorIconPass} src={errorIcon} alt='' />}
                            {showErrorPassword_su && <div className={styles.errorMessage}><label>{errorPassword_su}</label></div>}
                        </div>
                        <button disabled={state_su} type='submit'>Sign up</button>
                        {errorGeneral_su && <div className={styles.errorMessage2}><label>{errorGeneral_su}</label></div>}
                        {successGeneral_su && <div className={styles.successMessage}><label>{successGeneral_su}</label></div>}
                    </form>
                    <div className={styles.divider}><label>or</label></div>
                    <div className={styles.alternatives}>
                        <GoogleOAuthProvider clientId="351591539699-803aglb7vb3mo8r7cqn6pvqnk2r1p29j.apps.googleusercontent.com">
                            <GoogleLogin onSuccess={(event) => handleSuccessGoogle('signup', event)} onError={handleErrorGoogle} />
                        </GoogleOAuthProvider>
                    </div>
                    <div className={styles.change}>
                        <label>Already have an account?</label>
                        <label className={styles.changeLabel} onClick={() => toggleForm('signin')}> Sign in</label>
                    </div>
                </div>
                <div className={showSignupForm ? styles.hideForm : styles.contentForm}>
                    <div><h1>Welcome back!</h1></div>
                    <form onSubmit={handleSubmit_si}>
                        <div className={styles.controller}>
                            <input className={errorEmail_si ? styles.errorInput : ''} onChange={handleEmail_si} type='email' placeholder='you@example.com' value={email_si}/>
                            {errorEmail_si && <img onMouseEnter={() => handleShow_si('email')} onMouseLeave={handleShow_si} className={styles.errorIcon} src={errorIcon} alt='' />}
                            {showErrorEmail_si && <div className={styles.errorMessage}><label>{errorEmail_si}</label></div>}
                        </div>
                        <div className={styles.controller}>
                            <input className={errorPassword_si ? styles.errorInput : ''} onChange={handlePassword_si} type='password' placeholder='Put your password' value={password_si}/>
                            {errorPassword_si && <img onMouseEnter={() => handleShow_si('password')} onMouseLeave={handleShow_si} className={styles.errorIconPass} src={errorIcon} alt='' />}
                            {showErrorPassword_si && <div className={styles.errorMessage}><label>{errorPassword_si}</label></div>}
                        </div>
                        <button disabled={state_si} type='submit'>Sign in</button>
                        {errorGeneral_si && <div className={styles.errorMessage2}><label>{errorGeneral_si}</label></div>}
                    </form>
                    <div className={styles.divider}><label>or</label></div>
                    <div className={styles.alternatives}>
                        <GoogleOAuthProvider clientId="351591539699-803aglb7vb3mo8r7cqn6pvqnk2r1p29j.apps.googleusercontent.com">
                            <GoogleLogin onSuccess={(event) => handleSuccessGoogle('signup', event)} onError={handleErrorGoogle} />
                        </GoogleOAuthProvider>
                    </div>
                    <div className={styles.change}>
                        <label>Don't have an account yet?</label>
                        <label className={styles.changeLabel} onClick={() => toggleForm('signup')}> Sign up</label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;