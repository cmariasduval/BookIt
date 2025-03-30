import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login-Signup/Login";
import Signup from "./Login-Signup/Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;

