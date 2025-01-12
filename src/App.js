import "./App.css";
import { useState } from "react";
import { ExpenseTracker } from "./Components/ExpenseTracker";
import PrivateRoute from "./Components/PrivateRoute";
import OpenRoute from "./Components/OpenRoute";
import {  Route, Routes } from "react-router-dom";
import { SignIn } from "./Components/Signin";
import { SignUp } from "./Components/Signup";
import PersistLogin from "./Components/PersistLogin";
import Error from "./Components/Error";
import VerifyEmail from "./Components/VerifyEmail";

function App() {

  return (
    <div className="w-screen min-h-screen font-inter bg-richblack-900">
      <Routes>
        <Route element={<PersistLogin />}>
          <Route path="/" element={<PrivateRoute><ExpenseTracker /></PrivateRoute>} />
        </Route>

        <Route path="/login" element={
          <OpenRoute>
            <SignIn />
          </OpenRoute>
        } />

        <Route path="/signup" element={
          <OpenRoute>
            <SignUp />
          </OpenRoute>
        } />

        <Route
          path="/verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />
        {/* <Route
          path="/forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />

        <Route
          path="/update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        /> */}



        <Route path="*" element={<Error />} />
        {/* done */}

      </Routes>
    </div>

  );
}

export default App;