// Login.js
import React from 'react';
import './login.css';

const Login = () => {
  const imgurl1 = process.env.PUBLIC_URL + './img/bg_2.mp4';
  const imgurl2 = process.env.PUBLIC_URL + './img/login.jpg';
  return (
    <div className="Login">
      <video autoPlay loop muted className="background-video" playsInline>
        <source src={imgurl1} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="content">
        <div className="login-container">
          <div className="image-container">
            <img src={imgurl2} alt="Background" />
          </div>
          <div className="form-container">
            <h1>Sign in to HireFlow</h1>
            <p>by FocusR AI</p>
            <form>
              <div className="form-group">
                
                <input type="text" id="username" name="username" placeholder="Enter your username" />
              </div>
              <div className="form-group">
               
                <input type="password" id="password" name="password" placeholder="Enter your password" />
              </div>
              <div className="additional-options">
                <label>
                  <input type="checkbox" name="rememberMe" />
                  Remember Me
                </label>
                <a href="#forgot-password" className="forgot-password">
                  Forgot Password?
                </a>
              </div>
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
