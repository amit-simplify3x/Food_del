import React, { useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';

const LoginPopup = ({ setShowLogin }) => {
  const [currState, setcurrState] = useState("Login");
  return (
    <div className="login-popup">
      <form className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" ? (
            <></>
          ) : (
            <input type="text" placeholder="enter your name" required />
          )}
          <input type="email" placeholder="enter your email" required />
          <input type="password" placeholder="enter your password" required />
        </div>
        <button>{currState === "Sign Up" ? "Create account" : "Login"}</button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>
            By continuning, i agree to the terms of use and & privacy policy
          </p>
        </div>
        {currState === "Login" ? (
          <p>
            Create a new account <span onClick={()=>setcurrState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account <span onClick={()=>setcurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup
