import React, { ReactNode } from 'react'

interface ChildProps {
  children: ReactNode;
  message: string
}

// container to style the success message
export const NotificationContainerStyle: React.FC<ChildProps> = ({ children, message }) => {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "row", gap: ".5rem", alignItems: "center" }} className='text-lg font-bold'>
        {children}
        <span>
          {message}
        </span>
      </div>
    </>
  )
}

