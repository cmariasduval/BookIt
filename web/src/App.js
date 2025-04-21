import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login-Signup/Login";
import Signup from "./Components/Login-Signup/Signup";
import Home from "./Components/Home/Home";
import Layout from "./Components/Layout/Layout";
import Library from "./Components/Home/Library";
import Favorites from "./Components/Home/Favorites";
import Profile from "./Components/Home/Profile";

function App() {
  return (
    <Router>
      <Routes>
        {/* Paginas sin sidebar */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Paginas con sidebar (Acceso libre sin token) */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
