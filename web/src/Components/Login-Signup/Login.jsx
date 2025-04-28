import { useState } from "react";
import './Login.css';
import { useNavigate } from "react-router-dom";
import logo from '../Assets/logo.png';
import useAuth from "../../useAuth";
import {jwtDecode} from "jwt-decode";  // Hook para manejar el token


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { saveToken } = useAuth();  // Hook para manejar el token

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
                alert("Inicio de sesión exitoso");
                const decoded = jwtDecode(data.token)
                console.log("Decoded token:", decoded);
                const isAdmin = decoded.sub == "admin"

                const user = {
                    email: data.email,
                    role: isAdmin ? "admin" : "user",
                    token: data.token
                };
                localStorage.setItem("authToken", data.token);
                // localStorage.setItem("user", JSON.stringify(user));
                //saveToken(data.token);

                console.log("Usuario guardado en localStorage:", localStorage.getItem("user"));
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
