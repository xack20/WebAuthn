import { motion } from 'framer-motion';
import {
  Activity,
  Award,
  CheckCircle,
  Clock,
  Key,
  LogOut,
  Settings,
  Shield,
  Star,
  Target,
  Trophy,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const [user, setUser] = useState(null);
  const [loginTime] = useState(new Date());
  const navigate = useNavigate();
  
  useEffect(() => {
    const userInfo = localStorage.getItem('user');
    if (!userInfo) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userInfo));
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };
  
  if (!user) return null;

  const achievements = [
    {
      icon: <Shield style={{ width: '1.5rem', height: '1.5rem' }} />,
      title: "Security Champion",
      description: "Using passwordless authentication",
      color: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      progress: 100
    },
    {
      icon: <Zap style={{ width: '1.5rem', height: '1.5rem' }} />,
      title: "Speed Demon",
      description: "Lightning-fast login completed",
      color: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      progress: 85
    },
    {
      icon: <Trophy style={{ width: '1.5rem', height: '1.5rem' }} />,
      title: "Early Adopter",
      description: "Embracing future technology",
      color: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      progress: 90
    }
  ];

  const stats = [
    {
      label: "Login Time",
      value: loginTime.toLocaleTimeString(),
      icon: <Clock style={{ width: '1.25rem', height: '1.25rem' }} />,
      color: "#667eea"
    },
    {
      label: "Security Level",
      value: "Maximum",
      icon: <Shield style={{ width: '1.25rem', height: '1.25rem' }} />,
      color: "#10b981"
    },
    {
      label: "Auth Method",
      value: "WebAuthn",
      icon: <Key style={{ width: '1.25rem', height: '1.25rem' }} />,
      color: "#8b5cf6"
    }
  ];

  const quickActions = [
    {
      title: "Account Settings",
      description: "Manage your preferences and security settings",
      icon: <Settings style={{ width: '1.25rem', height: '1.25rem' }} />,
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      action: () => console.log("Settings clicked")
    },
    {
      title: "Manage Authenticators",
      description: "Add or remove security keys and biometric devices",
      icon: <Key style={{ width: '1.25rem', height: '1.25rem' }} />,
      color: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      action: () => console.log("Authenticators clicked")
    },
    {
      title: "Security Audit",
      description: "Review your account security and recent activity",
      icon: <Target style={{ width: '1.25rem', height: '1.25rem' }} />,
      color: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      action: () => console.log("Audit clicked")
    },
    {
      title: "Activity Log",
      description: "View your recent authentication history",
      icon: <Activity style={{ width: '1.25rem', height: '1.25rem' }} />,
      color: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      action: () => console.log("Activity clicked")
    }
  ];

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

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ maxWidth: '80rem', margin: '0 auto' }}
    >
      {/* Welcome Header */}
      <motion.div
        variants={itemVariants}
        className="glass-card"
        style={{
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          marginBottom: '2rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Celebration Animation */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            zIndex: 0
          }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              delay: 0.4,
              type: "spring",
              stiffness: 200,
              damping: 10
            }}
            style={{
              display: 'inline-flex',
              padding: '1.5rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              marginBottom: '1.5rem',
              boxShadow: '0 20px 60px rgba(16, 185, 129, 0.3)'
            }}
          >
            <CheckCircle style={{ width: '3rem', height: '3rem' }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '1rem'
            }}
          >
            Welcome back, {user.displayName || user.username}!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              fontSize: '1.25rem',
              color: '#6b7280',
              marginBottom: '1.5rem',
              maxWidth: '32rem',
              margin: '0 auto 1.5rem'
            }}
          >
            You've successfully authenticated with WebAuthn. Your account is secure and ready to use.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              color: '#10b981',
              fontWeight: '500'
            }}
          >
            <Shield style={{ width: '1.25rem', height: '1.25rem' }} />
            <span>Secure Session Active</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: '0.5rem',
                height: '0.5rem',
                borderRadius: '50%',
                background: '#10b981',
                marginLeft: '0.25rem'
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* User Stats */}
      <motion.div
        variants={itemVariants}
        style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth > 768 ? 'repeat(3, minmax(0, 1fr))' : 'repeat(1, minmax(0, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, y: -5 }}
            className="glass-card"
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
              padding: '1.5rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{
              display: 'inline-flex',
              padding: '0.75rem',
              borderRadius: '12px',
              background: stat.color + '20',
              color: stat.color,
              marginBottom: '1rem'
            }}>
              {stat.icon}
            </div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
              {stat.label}
            </p>
            <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Achievements */}
      <motion.div
        variants={itemVariants}
        className="glass-card"
        style={{
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          marginBottom: '2rem'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            padding: '0.5rem',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white'
          }}>
            <Award style={{ width: '1.5rem', height: '1.5rem' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>
            Achievements Unlocked
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth > 768 ? 'repeat(3, minmax(0, 1fr))' : 'repeat(1, minmax(0, 1fr))',
          gap: '1.5rem'
        }}>
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
              style={{
                padding: '1.5rem',
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                display: 'inline-flex',
                padding: '1rem',
                borderRadius: '50%',
                background: achievement.color,
                color: 'white',
                marginBottom: '1rem',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
              }}>
                {achievement.icon}
              </div>
              <h3 style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '1.125rem' }}>
                {achievement.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                {achievement.description}
              </p>
              
              {/* Progress Bar */}
              <div style={{
                width: '100%',
                height: '0.5rem',
                background: 'rgba(156, 163, 175, 0.3)',
                borderRadius: '0.25rem',
                overflow: 'hidden'
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${achievement.progress}%` }}
                  transition={{ delay: 1 + index * 0.2, duration: 1 }}
                  style={{
                    height: '100%',
                    background: achievement.color,
                    borderRadius: '0.25rem'
                  }}
                />
              </div>
              <p style={{ 
                fontSize: '0.75rem', 
                color: '#9ca3af', 
                marginTop: '0.5rem',
                fontWeight: '500'
              }}>
                {achievement.progress}% Complete
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={itemVariants}
        className="glass-card"
        style={{
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          marginBottom: '2rem'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            padding: '0.5rem',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <Star style={{ width: '1.5rem', height: '1.5rem' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>
            Quick Actions
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth > 768 ? 'repeat(2, minmax(0, 1fr))' : 'repeat(1, minmax(0, 1fr))',
          gap: '1rem'
        }}>
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.action}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.25rem',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left',
                width: '100%'
              }}
            >
              <div style={{
                padding: '0.75rem',
                borderRadius: '12px',
                background: action.color,
                color: 'white',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}>
                {action.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#1f2937' }}>
                  {action.title}
                </p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                  {action.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Logout Section */}
      <motion.div
        variants={itemVariants}
        className="glass-card"
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
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
          Session Management
        </h3>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          Your session is secure and will automatically expire for your protection.
        </p>
        
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-secondary"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            margin: '0 auto'
          }}
        >
          <LogOut size={20} />
          <span>Sign Out Securely</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default WelcomePage;
