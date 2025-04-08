import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login-Signup/Login";
import Signup from "./Components/Login-Signup/Signup";
import Home from "./Components/Home/Home"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
          <Route path= "/home" element = {<Home />} />

      </Routes>
    </Router>
  );
}

export default App;

