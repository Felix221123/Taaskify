import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { LogIn } from '../Auth/LogIn'
import { TaaskifyApp } from '../App/TaaskifyApp'
import { SignUp } from '../Auth/SignUp'
import { UpdatePassword } from '../Auth/UpdatePassword'
import { ProtectedRoute } from './ProtectedRoutes'
import { UserLogInData, UserSignUpData } from '../components/Interface/UserApiInterface'
import { ResetPassword } from '../Auth/ResetPassword'
import { useUser } from '../Context/User/useUser'
import { AnimatePresence, motion } from 'framer-motion'
import { Loading } from '../components/Containers/Loading'
import "../components/Containers/ContainersStyles.css"


export const AppRoute: React.FC = () => {
  // calling the user context here
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true); // Track loading state


  // using the useEffect hook to track the users data
  useEffect(() => {
    if (user !== null) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [user]);

  // handles the data when a user logs in
  const handleLoginSuccess = (user: UserLogInData) => {
    setUser(user);
  };

  // handles the data when a user signs
  const handleSignUpSuccess = (user: UserSignUpData) => {
    setUser(user);
  }


  // animations for loading state
  const getMenuAnimationForSpin = () => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  });



  return (
    <>
      <Router>
        <Routes>
          {/* route for login page  */}
          <Route index element={<LogIn onLogInSuccessful={handleLoginSuccess} />} />
          {/* route for login page */}
          <Route path="/login/" element={<LogIn onLogInSuccessful={handleLoginSuccess} />} />
          {/* route for signup page */}
          <Route path="/signup/" element={<SignUp onSignUpSuccessful={handleSignUpSuccess} />} />

          {/* Conditionally render routes or loading spinner */}
          {loading ? (
            <Route
              path="*"
              element={
                <AnimatePresence>
                  <motion.div
                    className="spinAnimation"
                    initial={getMenuAnimationForSpin().hidden}
                    animate={getMenuAnimationForSpin().visible}
                    exit={getMenuAnimationForSpin().exit}
                    transition={{ duration: 0.5 }}
                    data-testid="loadingSpin"
                  >
                    <Loading />
                  </motion.div>
                </AnimatePresence>
              }
            />
          ) : (
            <>
              <Route
                path="/taaskify/"
                element={
                  <ProtectedRoute isAuthenticated={!!user}>
                    <TaaskifyApp />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/update-password/"
                element={
                  <ProtectedRoute isAuthenticated={!!user}>
                    <UpdatePassword />
                  </ProtectedRoute>
                }
              />
            </>
          )}

          {/* route for reset password */}
          <Route path='/reset-password/' element={<ResetPassword />} />
        </Routes>
      </Router>
    </>
  )
}


