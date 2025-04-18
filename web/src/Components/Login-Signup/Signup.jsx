import { useState } from "react";
import './Signup.css';
import { useNavigate } from "react-router-dom";
import logo from '../Assets/logo.png';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [interests, setInterests] = useState([]);
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const navigate = useNavigate();

  const allInterests = [
    "Psychology", "Historical", "Romance", 
    "Sci-Fi", "Non-Fiction", "Horror", 
    "Thriller", "Fantasy", "Mystery"
  ];

  const toggleInterest = (interest) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword || interests.length === 0) {
      alert("Todos los campos deben estar completos.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username, interests, fullName, birthDate }),
      });

      if (response.ok) {
        alert("Registro exitoso");
        navigate("/");
      } else {
        const errorMsg = await response.text();
        alert(`Error: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Hubo un problema con el registro.");
    }
  };

  return (
    <div className='signup-container'>
      <div className="signup-header">
        <img src={logo} alt="Logo" className="logo" />
        <div className="signup-text">Sign Up</div>
        <div className="signup-underline"></div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="signup-inputs">
          <div className="signup-input">
            <FaUser className="signup-input-icon" style={{marginRight: "6px", cursor: "pointer"}} />
            <input
              type="text"
              placeholder="Create Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="signup-input">
            <FaLock className="signup-input-icon" style={{marginRight: "6px", cursor: "pointer"}} />
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="signup-input">
            <FaLock className="signup-input-icon" style={{marginRight: "6px", cursor: "pointer"}} />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="input-title">E-mail</div>
          <div className="signup-input">
            <FaEnvelope className="signup-input-icon" style={{marginRight: "6px", cursor: "pointer"}} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-title">Birth Date</div>
          <div className="signup-input">
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>
          <div className="input-title">Main Interests</div>
          <div className="interests-buttons">
            {allInterests.map((interest) => (
              <button
                key={interest}
                className={interests.includes(interest) ? "selected" : ""}
                onClick={(e) => {
                  e.preventDefault(); // prevenir el submit al tocar un botón
                  toggleInterest(interest);
                }}
                type="button"
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div className="signup-submit-container">
          <button type="submit">Create Account</button>
        </div>
        <div className="to-login">Already have an account?{" "}
          <button type="button" onClick={() => navigate("/")}>Log in</button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
