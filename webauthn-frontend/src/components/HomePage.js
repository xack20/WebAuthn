import { motion } from 'framer-motion';
import { Fingerprint, Lock, LogIn, Shield, UserPlus, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Military-Grade Security",
      description: "Advanced cryptographic protection for your digital identity"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Instant authentication without compromising security"
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Passwordless Future",
      description: "No more passwords to remember or worry about"
    }
  ];

  return (
    <motion.div 
      className="max-w-6xl mx-auto"
      style={{ maxWidth: '72rem', margin: '0 auto' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="text-center mb-8" style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ marginBottom: '2rem' }}
        >
          <div style={{
            display: 'inline-flex',
            padding: '1rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            marginBottom: '1.5rem'
          }}>
            <Fingerprint style={{ width: '4rem', height: '4rem', color: 'white' }} />
          </div>
        </motion.div>

        <h1 style={{
          fontSize: '3.75rem',
          fontWeight: '700',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          WebAuthn Secure
        </h1>
        
        <p style={{
          fontSize: '1.25rem',
          color: '#6b7280',
          marginBottom: '3rem',
          maxWidth: '32rem',
          margin: '0 auto 3rem',
          lineHeight: '1.75'
        }}>
          Experience the future of authentication with biometric security, hardware keys, 
          and passwordless login technology.
        </p>

        {/* Action Buttons */}
        <motion.div 
          variants={itemVariants}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '4rem'
          }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
        >
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '1.125rem',
                padding: '1rem 2rem'
              }}
            >
              <UserPlus style={{ width: '1.5rem', height: '1.5rem' }} />
              <span>Create Account</span>
            </motion.button>
          </Link>

          <Link to="/login" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '1.125rem',
                padding: '1rem 2rem'
              }}
            >
              <LogIn style={{ width: '1.5rem', height: '1.5rem' }} />
              <span>Sign In</span>
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        variants={itemVariants} 
        className="grid grid-cols-3 gap-8 mb-8"
        style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth > 768 ? 'repeat(3, minmax(0, 1fr))' : 'repeat(1, minmax(0, 1fr))',
          gap: '2rem',
          marginBottom: '4rem'
        }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="glass-card p-8 text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
              padding: '2rem',
              textAlign: 'center'
            }}
          >
            <div style={{
              display: 'inline-flex',
              padding: '1rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              marginBottom: '1.5rem'
            }}>
              {feature.icon}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
              {feature.title}
            </h3>
            <p style={{ color: '#6b7280', lineHeight: '1.75' }}>
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* WebAuthn Demo Section */}
      <motion.div 
        variants={itemVariants} 
        className="glass-card p-8 text-center"
        style={{
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          padding: '3rem',
          textAlign: 'center'
        }}
      >
        <h2 style={{
          fontSize: '1.875rem',
          fontWeight: '700',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Try WebAuthn Authentication
        </h2>
        <p style={{
          fontSize: '1.125rem',
          color: '#6b7280',
          marginBottom: '2rem',
          maxWidth: '48rem',
          margin: '0 auto 2rem',
          lineHeight: '1.75'
        }}>
          Use your fingerprint, face recognition, or security key to experience 
          the most secure and convenient way to authenticate.
        </p>
        
        <div style={{
          display: 'flex',
          flexDirection: window.innerWidth > 640 ? 'row' : 'column',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
            <Shield style={{ width: '1.25rem', height: '1.25rem' }} />
            <span>FIDO2 Certified</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6' }}>
            <Lock style={{ width: '1.25rem', height: '1.25rem' }} />
            <span>Zero Knowledge</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b5cf6' }}>
            <Zap style={{ width: '1.25rem', height: '1.25rem' }} />
            <span>Instant Access</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
