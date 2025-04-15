import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login-Signup/Login";
import Signup from "./Components/Login-Signup/Signup";
import Home from "./Components/Home/Home"
import Layout from "./Components/Layout/Layout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Paginas sin navbar */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Paginas con navbar */}
        <Route element={<Layout/>}>
          <Route path="/home" element = {<Home />} />
        </Route>
          


      </Routes>
    </Router>
  );
}

export default App;

