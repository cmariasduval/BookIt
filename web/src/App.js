import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./Components/Login-Signup/Login";
import Signup from "./Components/Login-Signup/Signup";
import Home from "./Components/Home/Home";
import Layout from "./Components/Layout/Layout";
import Library from "./Components/Home/Library";
import Favorites from "./Components/Home/Favorites";
import Profile from "./Components/Home/Profile";
import BookDetails from "./Components/Home/BookDetails";
import AddBook from "./Components/Home/AddBook";

function AppRoutes() {
    const location = useLocation();
    const background = location.state && location.state.background;

    return (
        <>
            <Routes location={background || location}>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route element={<Layout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/library" element={<Library />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/bookDetails" element={<BookDetails />} />
                </Route>
            </Routes>

            {/* Renderiza el modal de AddBook solo si hay un estado de fondo */}
            {background && (
                <Routes>
                    <Route path="/addbook" element={<AddBook />} />
                </Routes>
            )}
        </>
    );
}

function App() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}

export default App;
