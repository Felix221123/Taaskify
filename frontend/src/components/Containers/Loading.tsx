import React from "react"
import "./ContainersStyles.css"

export const Loading: React.FC = () => {
  return (
    <>
      <div className="preloader-container">
        <div className="wrap">
          <div className="ball"></div>
          <div className="ball"></div>
          <div className="ball"></div>
        </div>
      </div>
    </>
  )
}

