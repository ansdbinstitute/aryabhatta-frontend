import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import WhatsAppButton from '../components/common/WhatsAppButton';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen font-sans w-full overflow-x-hidden">
      <Navbar />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default MainLayout;
