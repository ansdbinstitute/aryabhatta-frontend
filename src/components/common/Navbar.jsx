import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, LogIn, Menu, X } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const navLinks = [
    { name: 'Home', path: '/' },
    { 
      name: 'About', 
      path: '/about',
      dropdown: [
        { name: 'About Us', path: '/about' },
        { name: 'Secretary', path: '/secretary' },
      ]
    },
    { name: 'Courses', path: '/courses' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Notice', path: '/notice' },
    { name: 'Career', path: '/career' },
    { name: 'Contact', path: '/contact' },
  ];

  const toggleDropdown = (name) => {
    setDropdownOpen(dropdownOpen === name ? null : name);
  };

  return (
    <>
      {/* Top Info Bar */}
      <div className="bg-slate-950 text-white py-2 px-4 md:px-10 flex flex-wrap justify-between items-center text-xs border-b border-slate-800">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span className="flex items-center gap-1"><span className="opacity-70">📞</span> +91 90464 42337</span>
          <span className="hidden md:flex items-center gap-1"><span className="opacity-70">✉️</span> info@ansdb.org</span>
          <span className="hidden lg:flex items-center gap-1"><span className="opacity-70">📍</span> Bolpur, WB</span>
        </div>
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b-4 border-accent px-4 md:px-10 py-2 md:py-3 shadow-xl" style={{ backgroundColor: '#0A192F' }}>
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 md:gap-3 group">
            <img src="/favicon.png" alt="ANSDB Logo" className="h-[40px] md:h-[60px] w-auto transition-transform group-hover:scale-105" />
            <div className="block">
              <div className="text-white font-bold text-xl md:text-2xl leading-none font-display">ANSDB</div>
              <p className="text-accent uppercase tracking-widest mt-1 text-[8px] md:text-[10px] font-bold leading-tight">
                Aryabhatta National Skill<br />Development Board
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-6 xl:gap-8 text-white font-medium text-sm">
            {navLinks.map((link) => (
              <li key={link.name} className="relative group">
                <div className="flex items-center gap-1 cursor-pointer py-2">
                  {link.dropdown ? (
                    <span 
                      className={`hover:text-accent transition-colors ${
                        currentPath === link.path || (link.dropdown && link.dropdown.some(d => d.path === currentPath))
                          ? 'text-accent underline decoration-accent decoration-2 underline-offset-8' 
                          : ''
                      }`}
                    >
                      {link.name}
                    </span>
                  ) : (
                    <Link 
                      to={link.path}
                      className={`hover:text-accent transition-colors ${
                        currentPath === link.path 
                          ? 'text-accent underline decoration-accent decoration-2 underline-offset-8' 
                          : ''
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}
                  {link.dropdown && (
                    <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-accent transition-transform group-hover:rotate-180" />
                  )}
                </div>

                {/* Dropdown Menu */}
                {link.dropdown && (
                  <div className="absolute top-full left-0 mt-0 w-48 bg-[#0A192F] border-t-2 border-accent shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="py-2">
                      {link.dropdown.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={`block px-6 py-3 text-white hover:bg-slate-900 hover:text-accent transition-colors ${
                            currentPath === subItem.path ? 'bg-slate-900 border-l-4 border-accent text-accent' : 'border-l-4 border-transparent'
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Desktop Login + CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/login"
              className="flex items-center gap-1.5 border border-accent text-accent hover:bg-accent hover:text-primary px-4 py-2 rounded-lg font-bold text-sm transition-all hover:scale-105 active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
            <Link to="/contact" className="bg-danger hover:bg-red-700 text-white px-4 md:px-6 py-2 rounded-lg font-bold text-sm uppercase transition-all shadow-lg hover:scale-105 active:scale-95">
              Apply Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A192F] border-b-4 border-accent px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <div key={link.name}>
              {link.dropdown ? (
                <div>
                  <button 
                    className="flex items-center justify-between w-full text-white py-2"
                    onClick={() => toggleDropdown(link.name)}
                  >
                    <span>{link.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen === link.name ? 'rotate-180' : ''}`} />
                  </button>
                  {dropdownOpen === link.name && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-700">
                      {link.dropdown.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className="block py-2 pl-4 text-slate-300 hover:text-accent"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  to={link.path}
                  className={`block py-2 ${currentPath === link.path ? 'text-accent' : 'text-white'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
          <div className="pt-4 border-t border-slate-700 space-y-3">
            <Link 
              to="/login" 
              className="flex items-center justify-center gap-2 border border-accent text-accent px-4 py-2 rounded-lg font-bold text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
            <Link 
              to="/contact" 
              className="block text-center bg-danger hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm uppercase"
              onClick={() => setMobileMenuOpen(false)}
            >
              Apply Now
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;