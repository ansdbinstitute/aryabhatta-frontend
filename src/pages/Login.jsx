import React, { useEffect } from 'react';
import PortalCards from '../components/login/PortalCards';
import LoginCTA from '../components/login/LoginCTA';

const Login = () => {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#F8FAFF] min-h-screen">
      <PortalCards />
      <LoginCTA />
    </div>
  );
};

export default Login;
