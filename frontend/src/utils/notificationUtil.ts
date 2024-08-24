import React from 'react';
import { notification } from 'antd';


// notification api from the ant design component
export const openCustomNotification = (message: React.ReactNode, description: React.ReactNode, pauseOnHover: boolean = true, zIndex: number = 99999) => {
  notification.open({
    message,
    description,
    pauseOnHover,
    placement: "top",
    showProgress: true,
    style: { zIndex },
  });
};






