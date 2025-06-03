import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Eye, Fingerprint, Key, Loader, Shield, User, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { finishRegistration, startRegistration } from '../services/authService';
import { encodeRegistrationCredential, isWebAuthnSupported, prepareRegistrationOptions } from '../utils/webAuthnUtils';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    displayName: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
      console.log('Starting registration for:', formData.username);
      
      // Step 1: Get registration options from server
      const registrationOptions = await startRegistration(formData.username, formData.displayName);
      console.log('Registration options received:', registrationOptions);
      
      setStep(3);
      
      // Step 2: Create credential with WebAuthn API
      const credentialCreateOptions = prepareRegistrationOptions(registrationOptions);
      console.log('Prepared WebAuthn options:', credentialCreateOptions);
      
      const credential = await navigator.credentials.create(credentialCreateOptions);
      console.log('Credential created:', credential);
      
      setStep(4);
      
      // Step 3: Send credential to server
      const attestationResponse = encodeRegistrationCredential(credential);
      console.log('Sending attestation response:', attestationResponse);
      
      await finishRegistration(formData.username, attestationResponse);
      
      setStep(5);
      setSuccess('Registration successful! You can now login.');
      
      setTimeout(() => navigate('/login'), 2000);
      
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. ';
      
      if (error.response?.status === 400) {
        errorMessage += 'User might already exist or invalid data provided.';
      } else if (error.response?.status === 500) {
        errorMessage += 'Server error occurred. Please try again.';
      } else if (error.name === 'NotAllowedError') {
        errorMessage += 'The operation was cancelled or not allowed.';
      } else if (error.name === 'InvalidStateError') {
        errorMessage += 'The authenticator is already registered.';
      } else {
        errorMessage += error.message || 'An unknown error occurred.';
      }
      
      setError(errorMessage);
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  const stepIndicators = [
    { number: 1, title: 'User Info', icon: User },
    { number: 2, title: 'Processing', icon: Loader },
    { number: 3, title: 'Authenticator', icon: Key },
    { number: 4, title: 'Verifying', icon: Shield },
    { number: 5, title: 'Complete', icon: CheckCircle }
  ];

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
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              marginBottom: '1rem'
            }}
          >
            <UserPlus style={{ width: '2rem', height: '2rem' }} />
          </motion.div>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.5rem'
          }}>
            Create Account
          </h1>
          <p style={{ color: '#6b7280' }}>Set up your secure WebAuthn account</p>
        </div>

        {/* Step Indicator */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '2rem',
          padding: '0 1rem'
        }}>
          {stepIndicators.map((indicator, index) => {
            const IconComponent = indicator.icon;
            return (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <motion.div
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    background: step >= indicator.number
                      ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                      : 'rgba(156, 163, 175, 0.3)',
                    color: step >= indicator.number ? 'white' : '#6b7280'
                  }}
                  animate={{ scale: step === indicator.number ? 1.1 : 1 }}
                >
                  {step === indicator.number && isLoading ? (
                    <Loader style={{ width: '1.25rem', height: '1.25rem' }} className="animate-spin" />
                  ) : (
                    <IconComponent size={16} />
                  )}
                </motion.div>
                <span style={{ 
                  fontSize: '0.75rem', 
                  marginTop: '0.25rem', 
                  color: '#6b7280',
                  textAlign: 'center'
                }}>
                  {indicator.title}
                </span>
              </div>
            );
          })}
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

        {/* Form */}
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
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Choose a unique username"
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

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '0.5rem' 
              }}>
                Display Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Your full name"
                  style={{
                    width: '100%',
                    padding: '1rem 1rem 1rem 3rem'
                  }}
                  required
                />
                <Eye style={{
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
                  <UserPlus size={20} />
                  <span>Create Account</span>
                </>
              )}
            </motion.button>
          </motion.form>
        )}

        {/* Loading Steps */}
        {step > 1 && step < 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '2rem 0' }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{
                width: '4rem',
                height: '4rem',
                border: '4px solid rgba(240, 147, 251, 0.3)',
                borderTop: '4px solid #f093fb',
                borderRadius: '50%',
                margin: '0 auto 1rem'
              }}
            />
            
            {step === 2 && <p style={{ color: '#6b7280' }}>Preparing registration...</p>}
            {step === 3 && (
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <Fingerprint style={{ color: '#f093fb' }} />
                  <p style={{ color: '#6b7280', margin: 0 }}>Please use your authenticator</p>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af', margin: 0 }}>
                  Touch your fingerprint sensor, face ID, or security key
                </p>
              </div>
            )}
            {step === 4 && <p style={{ color: '#6b7280' }}>Verifying your credentials...</p>}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default RegisterPage;
