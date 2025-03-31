import { useState } from "react";
import'./Signup.css'
import { useNavigate } from "react-router-dom";


const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", { email, password });
  };
  
  return (
    <div className='container'>
      <div className="inputs">
        <div className="input">
          <img/>
          <form onSubmit={handleSubmit}>
            <input 
              type="username"
              placeholder="Create Username"
              value={username}
              onChange={(e) => setEmail(e.target.value)}
            />
          </form>
        </div>
        <div className="input">
          <img/>
          <form onSubmit={handleSubmit}>
            <input 
              type="new-password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </form>
        </div>
        <div className="input">
          <img/>
          <form onSubmit={handleSubmit}>
            <input 
              type="confirm-password"
              placeholder="Confirm Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </form>
        </div>
        <div className="input-title">Name</div>
        <div className="input">
          <img/>
          <form onSubmit={handleSubmit}>
            <input 
              type="name-input"
              placeholder="Name"
            />
          </form>
        </div>
        <div className="input-title">E-mail</div>
        <div className="input">
          <img/>
          <form onSubmit={handleSubmit}>
            <input 
              type="email-input"
              placeholder="Email"
            />
          </form>
        </div>
        <div className="input-title">Birth Date</div>
        <div className="input">
          <img/>
          <form onSubmit={handleSubmit}>
            <input 
              type="birth-input"
              placeholder="mm/dd/yyyy"
            />
          </form>
        </div>
        <div className="input-title">Main Interests</div>
        <div className="interests-buttons">

        </div>
      </div>
      <div className="submit-container">
        <button type="submit" onClick={() => navigate("/")}>Back</button>
        <button type="submit">Sign Up</button>
      </div>
      <div className="to-signup">Do not have an account? <button type="submit">Sign Up</button></div>
      
    </div>
  );
};

export default SignUp;
