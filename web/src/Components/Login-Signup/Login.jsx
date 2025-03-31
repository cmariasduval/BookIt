import { useState } from "react";
import'./Login.css'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [action, setAction] = useState("Log In");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", { email, password });
  };
  
  return (
    <div className='container'>
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <img/>
          <form onSubmit={handleSubmit}>
            <input 
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </form>
        </div>
        <div className="input">
          <img/>
          <form onSubmit={handleSubmit}>
            <input 
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </form>
        </div>
      </div>
      <div className="submit-container">
        <button type="submit">Log In</button>
      </div>
      <div className="to-signup">Do not have an account? <button type="submit">Sign Up</button></div>
      
    </div>
  );
};

export default Login;
