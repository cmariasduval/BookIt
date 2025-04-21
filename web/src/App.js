import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login-Signup/Login";
import Signup from "./Components/Login-Signup/Signup";
import Home from "./Components/Home/Home";
import Layout from "./Components/Layout/Layout";
import Library from "./Components/Home/Library";
import Favorites from "./Components/Home/Favorites";
import Profile from "./Components/Home/Profile";
import PrivateRoute from "./PrivateRoute";  // Importamos PrivateRoute

function App() {
  return (
    <Router>
      <Routes>
        {/* Paginas sin sidebar */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Paginas con sidebar */}
        <Route element={<Layout />}>
          <Route
            path="/home"
            element={
              <PrivateRoute element={<Home />} />
            }
          />
          <Route
            path="/library"
            element={
              <PrivateRoute element={<Library />} />
            }
          />
          <Route
            path="/favorites"
            element={
              <PrivateRoute element={<Favorites />} />
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute element={<Profile />} />
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
