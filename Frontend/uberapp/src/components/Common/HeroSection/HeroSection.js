// HeroSection.js
import React from "react";
import "./HeroSectionStyles.css";

const HeroSection = () => {
    return (
        <section className="hero">
            <h1>Drive and Earn on Your Schedule</h1>
            <p>Be your own boss and get paid weekly.</p>
            <a href="/driver/signup" target="_blank" className="cta-button">Sign Up to Drive</a>
        </section>
    );
};

export default HeroSection;
