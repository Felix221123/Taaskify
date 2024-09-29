import React from 'react'
import HeroImage from "/src/assets/frontpageImg.png"
import RealTimeSvg from "/src/assets/realtimeIcon.svg"
import CustomisableColumnSvg from "/src/assets/Monitor.svg"
import HighPerformanceSvg from "/src/assets/performanceIcon.svg"
import AutomateUpdatesImg from "/src/assets/real-time.png"
import CustomisableImg from "/src/assets/customisable.png"
import DashboardImg from "/src/assets/dashboard.png"
import { useNavigate } from "react-router-dom"
import "./LandingPageStyles.css";

export const LandingPage: React.FC = () => {

  // calling the useNavigate component
  const navigate = useNavigate();

  // handles the navigation controller
  const handleNavigation = (route: string) => {
    const routeFormat = route.replace(/\s+/g, '-').toLowerCase()
    navigate(`/${routeFormat}/`)
  }



  return (
    <>
      <div className="landingPage">
        {/* header section */}
        <header>
          <div className="logo uppercase font-bold" data-testid='appName'>taaskify</div>
          <button className="logInBtn font-normal" data-testid="logInLink" onClick={() => handleNavigation("login")}>Log In</button>
        </header>
        {/* hero section */}
        <div className="heroSection">
          <div className="textSection">
            <h1 className='font-bold'>Manage Tasks Effortlessly with Real-Time Efficiency</h1>
            <p className="description font-normal text-left">
              Taaskify offers a robust, real-time task management solution designed for individuals who value efficiency and flexibility.
              With customisable Kanban boards, real-time notifications, and secure authentication, stay on top of every project no matter where you are.
            </p>
            <button className="signUpBtn font-normal" data-testid="signupLink" onClick={() => handleNavigation("signup")}>Try for free</button>
          </div>
          <div className="appImageSection">
            <img src={HeroImage} alt="hero section image" />
          </div>
        </div>
        {/* main features section */}
        <div className="mainFeatures" data-testid='mainFeatures'>
          <h2 className='font-bold'>Main Features</h2>
          <p className="featureDescription font-normal">
            Taaskify empowers individuals with a fully customisable task management solution.
            Whether you're tracking daily activities or managing complex projects, our platform delivers
            real-time monitoring, tailored dashboards, and high performance. Stay organised, boost productivity,
            and keep your workflows running smoothly—all within a highly intuitive and secure environment.
          </p>
          <div className="features">
            <div className="eachFeature">
              <img src={RealTimeSvg} alt="real time icon" />
              <div className="textContainer">
                <article>Real-Time Monitoring</article>
                <p className="description">Track and manage tasks 24/7 with real-time updates and notifications. Keep yourself and projects in sync at all times.</p>
              </div>
            </div>
            <div className="eachFeature">
              <img src={CustomisableColumnSvg} alt="customisable icon" />
              <div className="textContainer">
                <article>Customisable Columns</article>
                <p className="description">Easily personalise your dashboard with a variety of columns tailored to suit your specific project needs</p>
              </div>
            </div>
            <div className="eachFeature">
              <img src={HighPerformanceSvg} alt="high performance icon" />
              <div className="textContainer">
                <article>High Performance</article>
                <p className="description">Built for speed and reliability, Taaskify delivers top-notch performance, ensuring seamless task management even with large workloads.</p>
              </div>
            </div>
          </div>
        </div>
        {/* feature explanation */}
        <div className="featureExplanationContainer" data-testid='features'>
          <div className="featureContainer">
            <div className="textSection">
              <article className='font-bold'>
                Automated Updates
                & Column Tracking
              </article>
              <p className="description">
                Stay informed and on top of your projects with Taaskify's automated system. Get real-time insights delivered straight to your dashboard. Customise your Kanban board’s column according to your needs.
              </p>
            </div>
            <div className="imgContainer">
              <img src={AutomateUpdatesImg} alt="feature image" />
            </div>
          </div>
          <div className="featureContainer column-reverse">
            <div className="textSection">
              <article className='font-bold'>Fully customizable to address your needs</article>
              <p className="description">
                Taaskify adapts to your workflow, allowing you to tailor every aspect of task management to suit your specific requirements. Whether you need to customise columns, adjust notifications,Taaskify gives you full control to create a seamless project management experience
              </p>
            </div>
            <div className="imgContainer">
              <img src={CustomisableImg} alt="feature image" />
            </div>
          </div>
          <div className="featureContainer">
            <div className="textSection">
              <article className='font-bold'>Dashboard </article>
              <p className="description">
                Kickstart your projects with our ready-to-use dashboards, designed to help you visualise and manage tasks efficiently using boards.
              </p>
            </div>
            <div className="imgContainer">
              <img src={DashboardImg} alt="feature image" />
            </div>
          </div>
        </div>
        {/* footer */}
        <footer data-testid='footer'>
          <hr />
          <div className="footerText">
            <article className='logo uppercase font-bold'>taaskify</article>
            <article className='link'>© Copyright 2024 Powered by <a href="https://felixbaah.com/" target="_blank" rel="noopener noreferrer" className='portfolio-link'>Felix Baah</a> </article>
            <a href="mailto:contact@taaskify.com">contact@taaskify.com</a>
          </div>
        </footer>
      </div>
    </>
  )
}


