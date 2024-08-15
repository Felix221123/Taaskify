import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { LogIn } from '../Auth/LogIn'
import { TaaskifyApp } from '../App/TaaskifyApp'
import { SignUp } from '../Auth/SignUp'
import { UpdatePassword } from '../Auth/UpdatePassword'
import { ProtectedRoute } from './ProtectedRoutes'
import { UserLogInData, UserSignUpData } from '../components/Interface/UserApiInterface'



export const AppRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserLogInData | UserSignUpData | null>(null);

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
          <Route path="/login/" index element={<LogIn onLogInSuccessful={handleLoginSuccess} />} />
          <Route path="/signup/" index element={<SignUp onSignUpSuccessful={handleSignUpSuccess} />} />
          <Route
            path="/update-password/"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <UpdatePassword />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  )
}


