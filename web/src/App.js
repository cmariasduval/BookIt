import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google'; 

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
import SetGoal from "./Components/Home/SetGoal";
import BookGenres from "./Components/Home/BookGenres";
import AllBooks from "./Components/Home/AllBooks";

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
                    <Route path="/set-goal" element={<SetGoal />} />
                    <Route path="/genres/:genreName" element={<BookGenres />} />
                    <Route path="/all-books" element={<AllBooks />} />
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
    const clientId = "953778916856-hjh2cjl084s8578rpu0lmhcm5dp3jv6n.apps.googleusercontent.com"; // 🔁 Reemplazá esto con tu Client ID real

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <Router>
                <AppRoutes />
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;
