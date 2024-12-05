import React from "react";
import UberHeader from "../../Common/Header/UberHeader/UberHeader";
import { FaArrowRight } from "react-icons/fa";
import "./SignupStyles.css";

const Signup = () => {
  return (
    <div>
      {/* Include UberHeader */}
      <UberHeader />

      {/* Signup Page Content */}
      <div className="signup-container">
        <div className="signup-card">
          <a href="/driver/signup" className="signup-link">
            <span>Sign up to drive & deliver</span>
            <FaArrowRight className="arrow-icon" />
          </a>
          <hr />
        </div>
        <div className="signup-card">
          <a href="/customer/signup" className="signup-link">
            <span>Create a rider account</span>
            <FaArrowRight className="arrow-icon" />
          </a>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default Signup;
