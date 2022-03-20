import React from 'react';
import axios from 'axios';
import cogoToast from 'cogo-toast';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();

    const handleRegister = async (event) => {
        event.preventDefault();

        const username = event.target.username.value;
        const email = event.target.email.value;
        const password = event.target.password.value;
        const confirmPassword = event.target.confirmPassword.value;

        // if password and confirm password are not the same exit function
        if (password !== confirmPassword) {
            return cogoToast.error("Password and confirm password should be the same");
        }

        // otherwise POST to signup endpoint with user's username, email and password
        try {
            const response = await axios.post(process.env.REACT_APP_SERVER_URL + '/api/auth/public/signup', {
                username: username,
                email: email,
                password: password
            });

            // if register succeded, redirect user to login screen
            if (response.status === 200) {
                cogoToast.success("Account created successfully");
                navigate('/');
            }
        } catch (err) {
            console.log(err);
            if (err.response.status) {
                return cogoToast.error(err.response.data.message);
            }
        }
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form onSubmit={handleRegister}>
                    <h3>Register</h3>
                    <div className="form-group">
                        <label>Username</label>
                        <input autoComplete="off" required type="text" name="username" className="form-control" placeholder="Enter username" />
                    </div>
                    <div className="form-group">
                        <label>Email address</label>
                        <input autoComplete="off" required type="email" name="email" className="form-control" placeholder="Enter email" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input autoComplete="off" required type="password" name="password" className="form-control" placeholder="Enter password" pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$" title="Please enter minimum eight characters, at least one letter, one number and one special character" />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input autoComplete="off" required type="password" name="confirmPassword" className="form-control" placeholder="Confirm password" pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$" title="Please enter minimum eight characters, at least one letter, one number and one special character" />
                    </div>
                    <div className="form-group">
                    </div>
                    <button type="submit" className="btn btn-dark btn-block w-100">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default Register;