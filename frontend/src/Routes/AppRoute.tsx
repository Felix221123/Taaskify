import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { LogIn } from '../Auth/LogIn'
import { TaaskifyApp } from '../App/TaaskifyApp'
import { SignUp } from '../Auth/SignUp'



export const AppRoute:React.FC = () => {
  return (
    <>
    <Router>
        <Routes>
          <Route index element={<LogIn />} />
          <Route path="/taaskify/" index element={<TaaskifyApp />} />
          <Route path="/login/" index element={<LogIn />} />
          <Route path="/signup/" index element={<SignUp />} />
        </Routes>
      </Router>
    </>
  )
}


