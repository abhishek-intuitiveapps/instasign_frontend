import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full bg-base-100 fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <a  className="text-2xl font-bold op-text-primary cursor-pointer">
            <span className="text-primary">Insta</span><span style={{ color: '#002864' }}>sign</span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <a href="/" style={{ textDecoration: 'none', color: '#002864' }} className="font-medium transition-colors cursor-pointer" onMouseOver={(e) => e.currentTarget.style.color = '#2563EB'} onMouseOut={(e) => e.currentTarget.style.color = '#002864'}>
            Home
          </a>
          <a href="/#how-it-works" style={{ textDecoration: 'none', color: '#002864' }} className="font-medium transition-colors cursor-pointer" onMouseOver={(e) => e.currentTarget.style.color = '#2563EB'} onMouseOut={(e) => e.currentTarget.style.color = '#002864'}>
            How It Works
          </a>
          <a href="#features" style={{ textDecoration: 'none', color: '#002864' }} className="font-medium transition-colors cursor-pointer" onMouseOver={(e) => e.currentTarget.style.color = '#2563EB'} onMouseOut={(e) => e.currentTarget.style.color = '#002864'}>
            Features
          </a>
          <a href="#benefits" style={{ textDecoration: 'none', color: '#002864' }} className="font-medium transition-colors cursor-pointer" onMouseOver={(e) => e.currentTarget.style.color = '#2563EB'} onMouseOut={(e) => e.currentTarget.style.color = '#002864'}>
            Benefits
          </a>
          <a href="#about" style={{ textDecoration: 'none', color: '#002864' }} className="font-medium transition-colors cursor-pointer" onMouseOver={(e) => e.currentTarget.style.color = '#2563EB'} onMouseOut={(e) => e.currentTarget.style.color = '#002864'}>
            About
          </a>
          <a href="/faq" style={{ textDecoration: 'none', color: '#002864' }} className="font-medium transition-colors cursor-pointer" onMouseOver={(e) => e.currentTarget.style.color = '#2563EB'} onMouseOut={(e) => e.currentTarget.style.color = '#002864'}>
            FAQ
          </a>
          <a href="/sign-pdf" style={{ textDecoration: 'none', color: '#002864' }} className="font-medium transition-colors cursor-pointer" onMouseOver={(e) => e.currentTarget.style.color = '#2563EB'} onMouseOut={(e) => e.currentTarget.style.color = '#002864'}>
            Sign PDF
          </a>
        </div>

        <div className="hidden md:flex space-x-4">
          <button
            style={{ borderColor: '#002864', color: '#002864', borderWidth: '1px', borderStyle: 'solid' }}
            className="hover:bg-primary px-4 py-2 rounded"
            onMouseOver={(e) => e.currentTarget.style.color = '#ffffff'} onMouseOut={(e) => e.currentTarget.style.color = '#002864'}
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </button>
          <button 
            className="bg-[#2563EB] text-white hover:bg-[#2563EB]/90 px-4 py-2 rounded"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-primary"
          onClick={toggleMenu}
        >
          {isMenuOpen ? '✖' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-base-100 shadow-lg">
          <div className="flex flex-col px-4 py-2 space-y-2">
            <a href="#" style={{ textDecoration: 'none', color: '#002864' }} className="py-2 text-primary no-underline" onClick={toggleMenu}>
              Home
            </a>
            <a href="#how-it-works" style={{ textDecoration: 'none', color: '#002864' }} className="py-2 text-primary no-underline" onClick={toggleMenu}>
              How It Works
            </a>
            <a href="#features" style={{ textDecoration: 'none', color: '#002864' }} className="py-2 text-primary no-underline" onClick={toggleMenu}>
              Features
            </a>
            <a href="#benefits" style={{ textDecoration: 'none', color: '#002864' }} className="py-2 text-primary no-underline" onClick={toggleMenu}>
              Benefits
            </a>
            <a href="#about" style={{ textDecoration: 'none', color: '#002864' }} className="py-2 text-primary no-underline" onClick={toggleMenu}>
              About
            </a>
            <a href="/faq" style={{ textDecoration: 'none', color: '#002864' }} className="py-2 text-primary no-underline" onClick={toggleMenu}>
              FAQ
            </a>
            <a href="/sign-pdf" style={{ textDecoration: 'none', color: '#002864' }} className="py-2 text-primary no-underline" onClick={toggleMenu}>
              Sign PDF
            </a>
            <div className="flex flex-col space-y-2 pt-2 pb-4">
              <button
              style={{ borderColor: '#002864', color: '#002864', borderWidth: '1px', borderStyle: 'solid' }}
              className="hover:bg-primary px-4 py-2 rounded"
              onMouseOver={(e) => e.currentTarget.style.color = '#ffffff'} onMouseOut={(e) => e.currentTarget.style.color = '#002864'}
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
            <button 
              className="bg-[#2563EB] text-white hover:bg-[#2563EB]/90 px-4 py-2 rounded"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
