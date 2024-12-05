// Features.js
import React from "react";
import "./FeaturesStyles.css";

const features = [
    { icon: "🚗", title: "Earn More", description: "Keep more of what you earn." },
    { icon: "📅", title: "Drive When You Want", description: "You’re in control of your schedule." },
    { icon: "📈", title: "Track Earnings", description: "Get a clear view of your earnings." },
];

const Features = () => {
    return (
        <section className="features">
            <h2>Why Drive with Uber?</h2>
            <div className="features-list">
                {features.map((feature, index) => (
                    <div className="feature" key={index}>
                        <div className="icon">{feature.icon}</div>
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;
