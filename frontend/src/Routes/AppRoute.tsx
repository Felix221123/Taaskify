import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { LogIn } from '../Auth/LogIn'
import { TaaskifyApp } from '../App/TaaskifyApp'
import { SignUp } from '../Auth/SignUp'
import { UpdatePassword } from '../Auth/UpdatePassword'
import { ProtectedRoute } from './ProtectedRoutes'
import { UserLogInData, UserSignUpData } from '../components/Interface/UserApiInterface'
import { ResetPassword } from '../Auth/ResetPassword'



export const AppRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserLogInData | UserSignUpData | null>(null);


  // useEffect(() => {
  //   const checkAuthStatus = async () => {
  //     try {
  //       const response = await fetch('http://localhost:5500/api/user/validate', {
  //         method: 'GET',
  //         credentials: 'include', // Ensure cookies are included
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         setUser(data.user);
  //         setIsAuthenticated(true);
  //       } else {
  //         setIsAuthenticated(false);
  //       }
  //     } catch (error) {
  //       console.error("Failed to check authentication status", error);
  //       setIsAuthenticated(false);
  //     }
  //   };

  //   checkAuthStatus();
  // }, []);

  const handleLoginSuccess = (user: UserLogInData) => {
    setUser(user);
    setIsAuthenticated(true);
  };

  const handleSignUpSuccess = (user: UserSignUpData) => {
    setUser(user);
  }

  console.log(user);

  return (
    <>
      <Router>
        <Routes>
          <Route index element={<LogIn onLogInSuccessful={handleLoginSuccess} />} />
          <Route
            path="/taaskify/"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <TaaskifyApp />
              </ProtectedRoute>
            }
          />
          <Route path="/login/" element={<LogIn onLogInSuccessful={handleLoginSuccess} />} />
          <Route path="/signup/" element={<SignUp onSignUpSuccessful={handleSignUpSuccess} />} />
          <Route
            path="/update-password/"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <UpdatePassword />
              </ProtectedRoute>
            }
          />
          <Route path='/reset-password/' element={<ResetPassword />}/>
        </Routes>
      </Router>
    </>
  )
}


