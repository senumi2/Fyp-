import React from "react";
import "./Login.css";
import { Link,useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

  return (
    <div className="login-page">

      <div className="login-box">
        <h2>Member Login</h2>

        <input 
          type="email" 
          placeholder="Email" 
          className="login-input" 
        />

        <input 
          type="password" 
          placeholder="Password" 
          className="login-input" 
        />

        <button className="login-btn">Sign In</button>

        <div className="remember-row">
          <input type="checkbox" />
          <label>Remember me</label>
        </div>

        <div className="links">
          <p>
            Forget password?{" "}
            <Link to="/reset">Reset</Link>
          </p>
          <p>
            Don't have account?{" "}
            <span
            onClick={() => navigate("/register")}
            style={{color:"#0a2952", cursor: "pointer"}}
            >
                Register
            </span>
            </p>
            
        </div>
      </div>
    </div>
  );
}

export default Login;
