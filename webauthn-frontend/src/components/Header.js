import { AnimatePresence, motion } from 'framer-motion';
import { Home, LogIn, Menu, Shield, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    ...(user 
      ? [{ path: '/welcome', label: 'Dashboard', icon: User }]
      : [
          { path: '/register', label: 'Register', icon: User },
          { path: '/login', label: 'Login', icon: LogIn }
        ]
    )
  ];

  const getNavItemColor = (path) => {
    if (location.pathname === path) {
      if (path === '/register') return '#f093fb';
      if (path === '/welcome') return '#10b981';
      return '#667eea';
    }
    return '#6b7280';
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        margin: '1rem',
        marginBottom: '2rem',
        position: 'relative',
        zIndex: 50
      }}
    >
      <div className="glass-card" style={{
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        padding: '1rem 1.5rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Logo */}
          <Link 
            to="/" 
            style={{ 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              style={{
                padding: '0.5rem',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Shield style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
            </motion.div>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              WebAuthn Secure
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav style={{ 
            display: window.innerWidth > 768 ? 'flex' : 'none',
            alignItems: 'center', 
            gap: '0.5rem' 
          }}>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={item.path}
                  to={item.path} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    color: getNavItemColor(item.path),
                    background: location.pathname === item.path ? 'rgba(255, 255, 255, 0.6)' : 'transparent',
                    transition: 'all 0.3s ease',
                    fontWeight: '500',
                    fontSize: '0.875rem'
                  }}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              display: window.innerWidth <= 768 ? 'flex' : 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '12px',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.path}
                    to={item.path} 
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      color: getNavItemColor(item.path),
                      background: location.pathname === item.path ? 'rgba(255, 255, 255, 0.6)' : 'transparent',
                      transition: 'all 0.3s ease',
                      fontWeight: '500'
                    }}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
