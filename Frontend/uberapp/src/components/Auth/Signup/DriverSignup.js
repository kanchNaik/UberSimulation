import React, { useState, useEffect } from 'react';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';
import { messageService } from '../../Common/Message/MessageService';
import { BASE_API_URL } from '../../../Setupconstants';
import axios from 'axios';

function DriverSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    license_number: '',
    vehicle: {
      make: '',
      model: '',
      year: '',
      license_plate: ''
    }
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

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

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
        setPasswordError('Password must be at least 8 characters long, contain at least one uppercase letter, and one number.');
      } else {
        setPasswordError('');
      }
    }else if (name === 'state') {
        fetchCities(value);
        setFormData((prevData) => ({
          ...prevData,
          city: ''
        }));
      }

    setFormData((prevData) => {
      if (name.startsWith('vehicle.')) {
        const key = name.split('.')[1];
        return {
          ...prevData,
          vehicle: {
            ...prevData.vehicle,
            [key]: value
          }
        };
      }

      return {
        ...prevData,
        [name]: value
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      messageService.showMessage('error', 'Please enter a valid email address.');
      return;
    }

    if (!validatePassword(formData.password)) {
      messageService.showMessage('error', 'Password must be at least 8 characters long, contain at least one uppercase letter, and one number.');
      return;
    }

    fetch(`${BASE_API_URL}/api/drivers/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
      .then((response) => {
        if (!response.ok) {
          messageService.showMessage('error', 'Signup failed. Please try again.');
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
        messageService.showMessage('success', 'You are successfully signed up');
        navigate('/login');
      })
      .catch((error) => {
        console.error('Error:', error);
        messageService.showMessage('error', 'Signup failed. Please try again.');
      });
  };

  return (
    <div className="signup-form-container">
      <h2 className="signup-form-title">Driver Signup</h2>
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
          <label>License Number:</label>
          <input
            type="text"
            name="license_number"
            className='input-field'
            placeholder="Enter your license number"
            value={formData.license_number}
            onChange={handleChange}
            required
          />
        </div>
        <div className='input-item'>
          <label>Vehicle Make:</label>
          <input
            type="text"
            name="vehicle.make"
            className='input-field'
            placeholder="Enter your vehicle make"
            value={formData.vehicle.make}
            onChange={handleChange}
            required
          />
        </div>
        <div className='input-item'>
          <label>Vehicle Model:</label>
          <input
           
           type="text"
           name="vehicle.model"
           className='input-field'
           placeholder="Enter your vehicle model"
           value={formData.vehicle.model}
           onChange={handleChange}
           required
         />
       </div>
       <div className='input-item'>
         <label>Vehicle Year:</label>
         <input
           type="number"
           name="vehicle.year"
           className='input-field'
           placeholder="Enter your vehicle year"
           value={formData.vehicle.year}
           onChange={handleChange}
           required
         />
       </div>
       <div className='input-item'>
         <label>License Plate:</label>
         <input
           type="text"
           name="vehicle.license_plate"
           className='input-field'
           placeholder="Enter your license plate"
           value={formData.vehicle.license_plate}
           onChange={handleChange}
           required
         />
       </div>
       <button type="submit" className="signup-button">Sign Up</button>
     </form>
   </div>
 );
}

export default DriverSignup;