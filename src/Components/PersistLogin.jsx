
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../services/api";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [accessToken, setAccessToken] = useState(sessionStorage.getItem("accessToken"));
    const navigate = useNavigate();
    const location = useLocation();

    const publicRoutes = ["/login", "/signup","/verify-email"]; // Define public routes

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                const res = await api.auth.refreshToken();
                console.log("res",res);
                if (res.success) {
                    sessionStorage.setItem("accessToken", res.accessToken);
                    setAccessToken(res.accessToken); // Update state
                    setIsLoading(false);
                }
            } catch (err) {
                console.error("Error verifying refresh token:", err);
                navigate("/login");
            } finally {
                setIsLoading(false);
            }
        };

        // Skip refresh token verification for public routes
        if (publicRoutes.includes(location.pathname)) {
            setIsLoading(false);
        } else if (!accessToken) {
            verifyRefreshToken();
        } else {
            setIsLoading(false);
        }
    }, [accessToken, location.pathname, navigate]);

    return (
        <>
            {isLoading ? <p>Loading...</p> : <Outlet />}
        </>
    );
};

export default PersistLogin;
