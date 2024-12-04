import React, { useState } from 'react';
import './Login.css'; 
import axios from 'axios'; 
import Cookies from 'js-cookie'; 
import { useNavigate  } from 'react-router-dom';
import { messageService } from '../../Common/Message/MessageService';
import { BASE_API_URL } from '../../../Setupconstants';
// import { useAuth } from '../../AuthContext';
// import { useDispatch } from 'react-redux';
// import { setAuthToken } from '../../actions';


function Login() {
  const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { login } = useAuth();
  const [inputusername, setInputUsernameValue] = useState('');
  const [inputPassword, setInputPasswordValue] = useState('');
  const [error, setError] = useState('');

  
  const handleUsernameChange = (event) => setInputUsernameValue(event.target.value);
  const handlePasswordChange = (event) => setInputPasswordValue(event.target.value);

  
  const handleLogin = (e) => {
    e.preventDefault(); 
    axios
      .post(`${BASE_API_URL}/api/accounts/login/`, {
        username: inputusername,
        password: inputPassword,
      })
      .then((response) => {
        const {message, access, user } = response.data;
        // Store tokens and user info in cookies
        Cookies.set('access_token', access, { expires: 1 });
        Cookies.set('user_name', user.username);
        Cookies.set('user_id', user.user_id);
        Cookies.set('user_email', user.email);
        Cookies.set('is_customer', user.is_customer);
        Cookies.set('is_driver', user.is_driver);
        Cookies.set('is_admin', !user.is_customer && !user.is_driver);
        Cookies.set('name', user.first_name);
        // Store user data in Redux store
        console.log('user:', user);

        messageService.showMessage('success', 'Logged in successfully');
        // login(token, user.is_customer ? 'Customer' : 'Restaurant');
        // dispatch(setAuthToken(token));
        if(user.is_customer) 
        {
           navigate('/customer/home')
        }
        else if(user.is_driver){
           navigate('/driver/home')
          }
        else
        {
          navigate('/admin/home')
        }
      })
      .catch((error) => {
        console.error('Login failed:', error);
        setError('Invalid email or password'); // Show error message
        messageService.showMessage('error', 'Invalid email or password');
      });
  };

  return (
    <div className="login-form-container">
      <h2 className="login-form-title">Sign In</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          className="input-field"
          placeholder="Enter your username"
          value={inputusername}
          onChange={handleUsernameChange}
        />
        <input
          type="password"
          className="input-field"
          placeholder="Enter your password"
          value={inputPassword}
          onChange={handlePasswordChange}
        />
        {error && <p className="error-message">{error}</p>} {/* Show error if any */}
        <button type="submit" className="continue-button">
          Continue
        </button>
      </form>
    </div>
  );
}

export default Login;
