import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function PrivateRoute({children}){
    const accessToken = sessionStorage.getItem("accessToken");

    if(!accessToken){
        return <Navigate to={"/login"} />
    }
    else{
        return children;
    }
}

export default PrivateRoute;