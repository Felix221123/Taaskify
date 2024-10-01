import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { LogIn } from '../Auth/LogIn'
import { TaaskifyApp } from '../App/TaaskifyApp'
import { SignUp } from '../Auth/SignUp'
import { UpdatePassword } from '../Auth/UpdatePassword'
import { ProtectedRoute } from './ProtectedRoutes'
import { UserLogInData, UserSignUpData } from '../components/Interface/UserApiInterface'
import { ResetPassword } from '../Auth/ResetPassword'
import { useUser } from '../Context/User/useUser'
import "../components/Containers/ContainersStyles.css"
import { LandingPage } from '../Page/LandingPage'
import RedirectWithLoading from './RedirectWithLoading'


export const AppRoute: React.FC = () => {
  // calling the user context here
  const { user, setUser } = useUser();


  // handles the data when a user logs in
  const handleLoginSuccess = (user: UserLogInData) => {
    setUser(user);
  };

  // handles the data when a user signs
  const handleSignUpSuccess = (user: UserSignUpData) => {
    setUser(user);
  }



  return (
    <>
      <Router>
        <Routes>
          {/* route for landing page */}
          <Route index element={<LandingPage />} />
          <Route path="/" element={<LandingPage />} />
          {/* route for login page  */}
          <Route element={<LogIn onLogInSuccessful={handleLoginSuccess} />} />
          {/* route for login page */}
          <Route path="/login/" element={<LogIn onLogInSuccessful={handleLoginSuccess} />} />
          {/* route for signup page */}
          <Route path="/signup/" element={<SignUp onSignUpSuccessful={handleSignUpSuccess} />} />

          {/* Conditionally render routes or loading spinner if user is logged into the application */}
          <Route
            path="/taaskify"
            element={
              <RedirectWithLoading>
                <ProtectedRoute isAuthenticated={!!user}>
                  <TaaskifyApp />
                </ProtectedRoute>
              </RedirectWithLoading>
            }
          />

          <Route
            path="/update-password"
            element={
              <RedirectWithLoading>
                <ProtectedRoute isAuthenticated={!!user}>
                  <UpdatePassword />
                </ProtectedRoute>
              </RedirectWithLoading>
            }
          />

          {/* route for reset password */}
          <Route path='/reset-password/' element={<ResetPassword />} />
        </Routes>
      </Router>
    </>
  )
}


