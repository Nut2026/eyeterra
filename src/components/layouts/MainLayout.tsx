import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-background">
    <Header />
    <main className="flex-1 w-full">
      {children}
    </main>
    <Footer />
  </div>
);

export default MainLayout;
