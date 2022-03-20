import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import cogoToast from 'cogo-toast';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;

        // POST to signin endpoint with user's email and password

        try {
            const response = await axios.post(process.env.REACT_APP_SERVER_URL + '/api/auth/public/signin', {
                email: email,
                password: password,
            });

            // if login succeded, redirect user to chat screen and save jwt and user details in localStorage
            if (response.status === 200) {
                cogoToast.success(response.data.message);
                localStorage.setItem('jwt', response.data.token);
                localStorage.setItem('username', response.data.username);
                localStorage.setItem('id', response.data.id);
                navigate('/realtime-chat');
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
                <form onSubmit={handleLogin}>
                    <h3>Sign In</h3>
                    <div className="form-group">
                        <label>Email address</label>
                        <input autoFocus autoComplete="off" type="email" name="email" required className="form-control" placeholder="Enter email" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input autoComplete="off" type="password" name="password" required className="form-control" placeholder="Enter password" pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$" title="Please enter minimum eight characters, at least one letter, one number and one special character" />
                    </div>
                    <div className="form-group">
                    </div>
                    <button type="submit" className="btn btn-dark btn-block w-100">Submit</button>
                    <p className="mb-0 mt-1 font-size-14">Don't you have an account? {" "}
                        <Link to="/sign-up"><span className="mb-0">Sign up.</span></Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;