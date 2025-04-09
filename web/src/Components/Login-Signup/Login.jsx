import { useState } from "react";
import './Login.css';
import { useNavigate } from "react-router-dom";
import logo from '../Assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        // ✅ Login exitoso
        alert("Inicio de sesión exitoso");
        navigate("/Home");
      } else {
        const errorMsg = await response.text();
        alert(`Error: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Error en el login:", error);
      alert("Hubo un problema al intentar iniciar sesión.");
    }
  };

  return (
    <div className='container'>
      <div className="header">
        <img src={logo} alt="Logo" className="logo" />
        <div className="text">Log In</div>
        <div className="underline"></div>
      </div>
      <form onSubmit={handleLogin}>
        <div className="inputs">
          <div className="input">
            <input 
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input">
            <input 
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="login-submit-container">
          <button type="submit">Log In</button>
        </div>
      </form>
      <div className="to-signup">
        Do not have an account?{" "}
        <button type="button" onClick={() => navigate("/SignUp")}>Sign Up</button>
      </div>
    </div>
  );
};

export default Login;
