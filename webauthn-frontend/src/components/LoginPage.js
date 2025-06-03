import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Fingerprint, Loader, LogIn, Shield, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { finishLogin, startLogin } from '../services/authService';
import { encodeLoginCredential, isWebAuthnSupported, prepareLoginOptions } from '../utils/webAuthnUtils';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    if (!isWebAuthnSupported()) {
      setError('WebAuthn is not supported in this browser');
      setIsLoading(false);
      return;
    }
    
    try {
      setStep(2);
      console.log('Starting login for:', username);
      
      // Step 1: Get authentication options from server
      const authenticationOptions = await startLogin(username);
      console.log('Authentication options received:', authenticationOptions);
      
      setStep(3);
      
      // Step 2: Get credential with WebAuthn API
      const credentialGetOptions = prepareLoginOptions(authenticationOptions);
      console.log('Prepared WebAuthn options:', credentialGetOptions);
      
      const credential = await navigator.credentials.get(credentialGetOptions);
      console.log('Credential retrieved:', credential);
      
      setStep(4);
      
      // Step 3: Send credential to server
      const assertionResponse = encodeLoginCredential(credential);
      console.log('Sending assertion response:', assertionResponse);
      
      await finishLogin(username, assertionResponse);
      
      setStep(5);
      setSuccess('Authentication successful! Welcome back!');
      
      // Save user info and redirect
      localStorage.setItem('user', JSON.stringify({
        username: username,
        displayName: username // Backend doesn't return displayName in auth
      }));
      
      setTimeout(() => navigate('/welcome'), 1500);
      
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Authentication failed. ';
      
      if (error.response?.status === 404) {
        errorMessage += 'User not found. Please register first.';
      } else if (error.response?.status === 400) {
        errorMessage += 'Invalid credentials or request.';
      } else if (error.response?.status === 500) {
        errorMessage += 'Server error occurred. Please try again.';
      } else if (error.name === 'NotAllowedError') {
        errorMessage += 'The operation was cancelled or not allowed.';
      } else {
        errorMessage += error.message || 'An unknown error occurred.';
      }
      
      setError(errorMessage);
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ maxWidth: '28rem', margin: '0 auto' }}
    >
      <div className="glass-card" style={{
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        padding: '2rem'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex',
              padding: '1rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              marginBottom: '1rem'
            }}
          >
            <LogIn style={{ width: '2rem', height: '2rem' }} />
          </motion.div>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.5rem'
          }}>
            Welcome Back
          </h1>
          <p style={{ color: '#6b7280' }}>Sign in with your WebAuthn credentials</p>
        </div>

        {/* Authentication Steps Visualization */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {[1, 2, 3, 4, 5].map((stepNum) => (
              <motion.div
                key={stepNum}
                style={{
                  width: '0.75rem',
                  height: '0.75rem',
                  borderRadius: '50%',
                  transition: 'all 0.3s ease',
                  background: step >= stepNum
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'rgba(156, 163, 175, 0.4)'
                }}
                animate={{
                  scale: step === stepNum ? 1.3 : 1,
                  opacity: step >= stepNum ? 1 : 0.5
                }}
              />
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
              color: 'white',
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <AlertCircle size={20} />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}
          >
            <CheckCircle style={{ width: '2rem', height: '2rem', margin: '0 auto 0.5rem' }} />
            <p>{success}</p>
          </motion.div>
        )}

        {/* Login Form */}
        {step === 1 && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '0.5rem' 
              }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field"
                  placeholder="Enter your username"
                  style={{
                    width: '100%',
                    padding: '1rem 1rem 1rem 3rem'
                  }}
                  required
                />
                <User style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  width: '1.25rem',
                  height: '1.25rem'
                }} />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {isLoading ? (
                <Loader style={{ width: '1.25rem', height: '1.25rem' }} className="animate-spin" />
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Sign In</span>
                </>
              )}
            </motion.button>

            {/* Biometric Indicator */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>
                <Fingerprint size={16} />
                <span>Biometric authentication ready</span>
              </div>
            </div>
          </motion.form>
        )}

        {/* Authentication Process */}
        {step > 1 && step < 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '2rem 0' }}
          >
            {/* Animated Fingerprint */}
            <motion.div
              style={{ position: 'relative', marginBottom: '1.5rem' }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div style={{
                width: '6rem',
                height: '6rem',
                margin: '0 auto',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Fingerprint style={{ width: '3rem', height: '3rem', color: 'white' }} />
              </div>
              
              {/* Scanning Animation */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '6rem',
                  height: '6rem',
                  borderRadius: '50%',
                  border: '4px solid rgba(102, 126, 234, 0.3)'
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 0.3, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            
            <motion.p
              style={{ color: '#6b7280', marginBottom: '0.5rem' }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {step === 2 && 'Requesting authentication options...'}
              {step === 3 && 'Please authenticate using your registered method'}
              {step === 4 && 'Verifying credentials...'}
            </motion.p>
            
            {step === 3 && (
              <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                Use your fingerprint, face ID, or security key
              </p>
            )}
          </motion.div>
        )}

        {/* Security Badge */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(156, 163, 175, 0.3)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            <Shield size={16} />
            <span>Secured with WebAuthn4j technology</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
