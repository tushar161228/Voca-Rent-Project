"use client";
import "./style.css";

const Spinner = ({ color = "#fff" }) => {
    return (
        <div className="lds-spinner" style={{ "--spinner-color": color }}>
            {[...Array(12)].map((_, i) => (
                <div key={i}></div>
            ))}
        </div>
    );
};


export default Spinner;

