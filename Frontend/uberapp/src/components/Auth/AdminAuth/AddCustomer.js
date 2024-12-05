import React, { useState, useEffect } from 'react';
import '../Signup/SignUp.css'; 
import { useNavigate } from 'react-router-dom';
import { messageService } from '../../Common/Message/MessageService';
import { BASE_API_URL } from '../../../Setupconstants';
import axios from 'axios';

function AddCustomer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    phone_number: '',
    email: '',
    credit_card: '',
    password: ''
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchStates = () => {
      axios
        .post('https://countriesnow.space/api/v0.1/countries/states', { country: "United States" })
        .then((response) => setStates(response.data.data.states))
        .catch((error) => console.error('Error fetching states:', error));
    };
    

    fetchStates();
  }, []);

  const fetchCities = (stateName) => {
    axios
      .post('https://countriesnow.space/api/v0.1/countries/state/cities', { country: "United States", state: stateName })
      .then((response) => setCities(response.data.data))
      .catch((error) => console.error('Error fetching cities:', error));
  };

  // Validate email format
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // Validate password strength
  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+=[\]{};':"\\|,.<>?/-]{8,}$/;
    return passwordPattern.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'email') {
      if (!validateEmail(value)) {
        setEmailError('Please enter a valid email address.');
      } else {
        setEmailError('');
      }
    } else if (name === 'password') {
      if (!validatePassword(value)) {
        setPasswordError('Password must be at least 8 characters long, contain at least one uppercase letter and one number.');
      } else {
        setPasswordError('');
      }
    } else if (name === 'state') {
      fetchCities(value);
      setFormData((prevData) => ({
        ...prevData,
        city: ''
      }));
    }
  
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate email and password before submission
    if (!validateEmail(formData.email)) {
      messageService.showMessage('error', 'Please enter a valid email address.');
      return;
    }

    if (!validatePassword(formData.password)) {
      messageService.showMessage('error', 'Password must be at least 8 characters long, contain at least one uppercase letter, and one number.');
      return;
    }

    // Send the API request using fetch
    fetch(`${BASE_API_URL}/api/customers/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
      .then((response) => {
        if (!response.ok) {
          messageService.showMessage('error', 'Failed. Please try again.');
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
        messageService.showMessage('success', 'Successfully added.');
        navigate('/admin/home');
      })
      .catch((error) => {
        console.error('Error:', error);
        messageService.showMessage('error', 'Failed. Please try again.');
      });
  };

  return (
    <div className="signup-form-container">
      <h2 className="signup-form-title">Add Customer</h2>
      <form onSubmit={handleSubmit}>
        <div className='input-item'>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            className='input-field'
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className='input-item'>
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            className='input-field'
            placeholder="Enter your first name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className='input-item'>
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            className='input-field'
            placeholder="Enter your last name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className='input-item'>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            className='input-field'
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className='input-item'>
        <label>State:</label>
        <select
            name="state"
            className='input-field'
            value={formData.state}
            onChange={handleChange}
            required
        >
            <option value="">Select your state</option>
            {states.map((state, index) => (
            <option key={index} value={state.name}>
                {state.name}
            </option>
            ))}
        </select>
        </div>

        <div className='input-item'>
        <label>City:</label>
        <select
            name="city"
            className='input-field'
            value={formData.city}
            onChange={handleChange}
            required
        >
            <option value="">Select your city</option>
            {cities.map((city, index) => (
            <option key={index} value={city}>
                {city}
            </option>
            ))}
        </select>
        </div>
        <div className='input-item'>
          <label>ZIP Code:</label>
          <input
            type="text"
            name="zip_code"
            className='input-field'
            placeholder="Enter your ZIP code"
            value={formData.zip_code}
            onChange={handleChange}
            required
          />
        </div>
        <div className='input-item'>
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phone_number"
            className='input-field'
            placeholder="Enter your phone number"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />
        </div>
        <div className='input-item'>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            className='input-field'
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {emailError && <span className="error-message">{emailError}</span>}
        </div>
        <div className='input-item'>
          <label>Credit Card:</label>
          <input
            type="text"
            name="credit_card"
            className='input-field'
            placeholder="Enter your credit card number"
            value={formData.credit_card}
            onChange={handleChange}
            required
          />
        </div>
        <div className='input-item'>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            className='input-field'
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {passwordError && <span className="error-message">{passwordError}</span>}
        </div>
        <button type="submit" className="continue-button">Add User</button>
      </form>
    </div>
  );
}

export default AddCustomer;
