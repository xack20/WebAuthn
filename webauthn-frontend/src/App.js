import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import FloatingShapes from './components/FloatingShapes';
import Header from './components/Header';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import WelcomePage from './components/WelcomePage';

const AnimatedRoutes = () => {
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      y: -20,
      scale: 1.02
    }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/welcome" element={<WelcomePage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  useEffect(() => {
    const hideLoadingScreen = () => {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 500);
      }
    };

    const timer = setTimeout(hideLoadingScreen, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
          <FloatingShapes />
          <Header />
          <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', paddingTop: '2rem', paddingBottom: '2rem', position: 'relative', zIndex: 10 }}>
            <AnimatedRoutes />
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
