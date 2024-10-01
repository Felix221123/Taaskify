import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Context/User/useUser';
import { Loading } from '../components/Containers/Loading';
import { AnimatePresence, motion } from 'framer-motion';

interface ChildProps{
  children:ReactNode;
}


const RedirectWithLoading: React.FC<ChildProps> = ({ children }) => {
   // calling the user context here
  const { user } = useUser();
  const navigate = useNavigate();    // For redirection
  const [loading, setLoading] = useState(true);   // Track loading state


  // using the useEffect hook to track the users data upon render
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      if (!user) {
        navigate('/login');
      }
    }, 1500);
  }, [user, navigate]);

  const getMenuAnimationForSpin = () => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  });

  if (loading) {
    return (
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
    );
  }

  return <>{children}</>;
};




export default RedirectWithLoading;
