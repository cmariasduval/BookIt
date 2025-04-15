import { useState } from "react";
import './Signup.css';
import { useNavigate } from "react-router-dom";

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
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <div className="inputs">
          <div className="input">
            <img />
            <input
              type="text"
              placeholder="Create Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input">
            <img />
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input">
            <img />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="input-title">Name</div>
          <div className="input">
            <img />
            <input
              type="text"
              placeholder="Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="input-title">E-mail</div>
          <div className="input">
            <img />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-title">Birth Date</div>
          <div className="input">
            <img />
            <input
              type="date"
              placeholder="yyyy-mm-dd"
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
          <button type="button" onClick={() => navigate("/")}>Back</button>
          <button type="submit">Sign Up</button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
