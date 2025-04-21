import { useState } from "react";
import './Login.css';
import { useNavigate } from "react-router-dom";
import logo from '../Assets/logo.png';
import useAuth from "../../useAuth";  // Usamos el hook para manejar el token

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { saveToken } = useAuth();  // Usamos el hook para manejar el token

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
        const data = await response.json();
        // ✅ Login exitoso
        alert("Inicio de sesión exitoso");
        console.log("Token recibido:", data.token);
        saveToken(data.token); // Guardamos el token usando el hook
        navigate("/Home");  // Navegamos a la página de inicio
        console.log("Respuesta del login:", data);
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
    <div className='login-container'>
      <div className="header">
        <img src={logo} alt="Logo" className="logo" />
        <div className="text">Log In</div>
        <div className="underline"></div>
      </div>
      <form onSubmit={handleLogin}>
        <div className="login-inputs">
          <div className="login-input">
            <input 
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="login-input">
            <input 
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="to-signup">Do not have an account?{" "}
          <button type="button" onClick={() => navigate("/SignUp")}>Sign Up</button>
        </div>
        <div className="login-submit-container">
          <button type="submit">Log In</button>
        </div>
      </form>
      <div className="divider"></div>
    </div>
  );
};

export default Login;
