// src/components/Payments/PaymentList.js
import React, { useState, useEffect } from "react";
import PaymentMethodCard from "./PaymentMethodCard";
import { Link } from "react-router-dom";
import "./PaymentList.css";
import axios from "axios";
import { useSelector } from 'react-redux';
import { BASE_API_URL } from "../../Setupconstants";

const PaymentList = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const customerId = useSelector(state => state.auth.user?.customer_id);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_API_URL}/api/customers/${customerId}/payment-methods/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setPaymentMethods(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch payment methods. Please try again later.');
        console.error('Error fetching payment methods:', err);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchPaymentMethods();
    }
  }, [customerId]);

  const handleDeletePaymentMethod = async (paymentId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/customers/${customerId}/payment-methods/${paymentId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      // Remove the deleted payment method from state
      setPaymentMethods(methods => methods.filter(method => method.id !== paymentId));
    } catch (err) {
      setError('Failed to delete payment method. Please try again later.');
      console.error('Error deleting payment method:', err);
    }
  };

  const handleSetDefaultPaymentMethod = async (paymentId) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/customers/${customerId}/payment-methods/${paymentId}/set-default/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      // Refresh payment methods to show updated default status
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/customers/${customerId}/payment-methods/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setPaymentMethods(response.data);
    } catch (err) {
      setError('Failed to set default payment method. Please try again later.');
      console.error('Error setting default payment method:', err);
    }
  };

  if (loading) {
    return <div>Loading payment methods...</div>;
  }

  return (
    <div className="payment-list-container">
      <h1>Your Payment Methods</h1>
      {error && <div className="error-message">{error}</div>}
      
      {paymentMethods.length === 0 ? (
        <div className="no-payments">
          <p>No payment methods available. Please add one.</p>
          <Link to="/customer/payments/add">
            <button className="add-payment-button">Add Payment Method</button>
          </Link>
        </div>
      ) : (
        <>
          <ul className="payment-methods-list">
            {paymentMethods.map((method) => (
              <PaymentMethodCard 
                key={method.id} 
                payment={method}
                onDelete={() => handleDeletePaymentMethod(method.id)}
                onSetDefault={() => handleSetDefaultPaymentMethod(method.id)}
              />
            ))}
          </ul>
          <Link to="/customer/payments/add">
            <button className="add-payment-button">Add Another Payment Method</button>
          </Link>
        </>
      )}
    </div>
  );
};

export default PaymentList;
  