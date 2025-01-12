import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";

function OpenRoute({ children }) {
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken === null) {

        return children;
    }
    else {
        return <Navigate to="/" />
    }
}

export default OpenRoute;