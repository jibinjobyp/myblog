import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Layout.css';

const Layout = ({ children }) => {
    return (
        <div className="app-container">
            <Navbar />
            <main className="layout">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;