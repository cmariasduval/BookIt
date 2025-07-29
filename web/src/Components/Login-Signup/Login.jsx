import { useState, useEffect } from "react";
import './Login.css';
import { useNavigate } from "react-router-dom";
import logo from '../Assets/logo.png';
import useAuth from "../../useAuth";
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { saveToken } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            navigate("/Home");
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:8080/user/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                const isAdmin = data.email.endsWith("@admin.com");

                const user = {
                    email: data.email,
                    role: isAdmin ? "admin" : "user",
                    token: data.token,
                    birthDate: data.birthDate,
                    interests: data.interests,
                    username: data.username,
                };
                localStorage.setItem("authToken", data.token);
                localStorage.setItem("user", JSON.stringify(user));
                
                // Usar saveToken del hook useAuth si está disponible
                if (saveToken) {
                    saveToken(data.token);
                }
                
                navigate("/Home");
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Error en el login'}`);
            }
        } catch (error) {
            console.error("Error en el login:", error);
            alert("Hubo un problema al intentar iniciar sesión.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:8080/user/login/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ idToken: credentialResponse.credential })
            });

            if (response.ok) {
                const data = await response.json();

                localStorage.setItem("authToken", data.token);
                localStorage.setItem("user", JSON.stringify({
                    email: data.email,
                    username: data.username,
                    role: data.role,
                    birthDate: data.birthDate,
                    interests: data.interests
                }));

                // Usar saveToken del hook useAuth si está disponible
                if (saveToken) {
                    saveToken(data.token);
                }

                navigate("/Home");
            } else {
                const errorData = await response.json();
                alert(`Error al iniciar sesión con Google: ${errorData.message || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error("Error al hacer login con Google:", error);
            alert("Error al iniciar sesión con Google.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleError = () => {
        console.error("Google login failed");
        alert("Fallo el login con Google. Intentá de nuevo.");
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
                            disabled={isLoading}
                        />
                    </div>
                    <div className="login-input">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                </div>
                <div className="to-signup">Do not have an account?{" "}
                    <button 
                        type="button" 
                        className="signup-button" 
                        onClick={() => navigate("/SignUp")}
                        disabled={isLoading}
                    >
                        Sign Up
                    </button>
                </div>
                <div className="login-submit-container">
                    <button 
                        type="submit" 
                        className="submit-login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? "Cargando..." : "Log In"}
                    </button>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            disabled={isLoading}
                        />
                </div>
            </form>
            <div className="divider"></div>
        </div>
    );
};

export default Login;