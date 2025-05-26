import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import PrivateRoute from "./PrivateRoute.js";
import Login from "./Components/Login-Signup/Login";
import Signup from "./Components/Login-Signup/Signup";
import Home from "./Components/Home/Home";
import Layout from "./Components/Layout/Layout";
import Library from "./Components/Home/Library";
import Favorites from "./Components/Home/Favorites";
import Profile from "./Components/Home/Profile";
import BookDetails from "./Components/Home/BookDetails";
import AddBook from "./Components/Home/AddBook";
import EditProfile from "./Components/Home/EditProfile";
import ManageReservation from "./Components/Home/ManageReservation";
import EditBook from "./Components/Home/EditBook";
import ManageInfractions from "./Components/Home/ManageInfractions";


function AppRoutes() {
    const location = useLocation();
    const background = location.state && location.state.background;

    return (
        <>
            <Routes location={background || location}>
                {/* Rutas públicas */}
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Rutas privadas dentro del layout */}
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <Layout />
                        </PrivateRoute>
                    }
                >
                    <Route path="/home" element={<Home />} />
                    <Route path="/library" element={<Library />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/editProfile" element={<EditProfile />} />
                    <Route path="/bookDetails/:id" element={<BookDetails />} />
                    <Route path="/manage" element={<ManageReservation />} />
                    <Route path="/bookDetails/:bookId/editbook" element={<EditBook />} />
                    <Route path="/manage-infractions" element={<ManageInfractions />} />

                </Route>
            </Routes>

            {/* Modal AddBook con fondo */}
            {background && (
                <Routes>
                    <Route
                        path="/addbook"
                        element={
                            <PrivateRoute>
                                <AddBook />
                            </PrivateRoute>
                        }
                    />
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
