import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  Fingerprint,
  Key,
  Loader,
  Shield,
  User,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { finishRegistration, register } from "../services/authService";
import {
  createCredentialSafely,
  encodeRegistrationCredential,
  isWebAuthnSupported,
  prepareRegistrationOptions
} from "../utils/webAuthnUtils";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    displayName: "",
    credName: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!isWebAuthnSupported()) {
      setError("WebAuthn is not supported in this browser");
      setIsLoading(false);
      return;
    }

    try {
      setStep(2);

      const registrationData = await register(
        formData.username,
        formData.displayName
      );
      if (registrationData.status === "success") {
        setStep(3);

        const credentialCreateOptions =
          prepareRegistrationOptions(registrationData);
        // const credential = await navigator.credentials.create(
        //   credentialCreateOptions
        // );

        const credential = await createCredentialSafely(credentialCreateOptions);


        setStep(4);

        const encodedCredential = encodeRegistrationCredential(credential);
        const result = await finishRegistration(
          encodedCredential,
          formData.username,
          formData.credName
        );

        if (result.status === "success") {
          setStep(5);
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setError(result.message || "Registration failed");
          setStep(1);
        }
      } else {
        setError(registrationData.message || "Registration failed");
        setStep(1);
      }
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || "Registration failed"
      );
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  const stepIndicators = [
    { number: 1, title: "Account Info", icon: User },
    { number: 2, title: "Processing", icon: Loader },
    { number: 3, title: "Authenticator", icon: Key },
    { number: 4, title: "Verifying", icon: Shield },
    { number: 5, title: "Complete", icon: CheckCircle },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ maxWidth: "28rem", margin: "0 auto" }}
    >
      <div
        className="glass-card"
        style={{
          background: "rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          padding: "2rem",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "inline-flex",
              padding: "1rem",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              marginBottom: "1rem",
            }}
          >
            <UserPlus style={{ width: "2rem", height: "2rem" }} />
          </motion.div>
          <h1
            style={{
              fontSize: "1.875rem",
              fontWeight: "700",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "0.5rem",
            }}
          >
            Create Account
          </h1>
          <p style={{ color: "#6b7280" }}>
            Set up your secure WebAuthn account
          </p>
        </div>

        {/* Step Indicator */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "2rem",
            padding: "0 1rem",
          }}
        >
          {stepIndicators.map((indicator, index) => {
            const IconComponent = indicator.icon;
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <motion.div
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    transition: "all 0.3s ease",
                    background:
                      step >= indicator.number
                        ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                        : "rgba(156, 163, 175, 0.3)",
                    color: step >= indicator.number ? "white" : "#6b7280",
                  }}
                  animate={{ scale: step === indicator.number ? 1.1 : 1 }}
                >
                  {step === indicator.number && isLoading ? (
                    <Loader
                      style={{ width: "1.25rem", height: "1.25rem" }}
                      className="animate-spin"
                    />
                  ) : (
                    <IconComponent size={16} />
                  )}
                </motion.div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    marginTop: "0.25rem",
                    color: "#6b7280",
                    textAlign: "center",
                  }}
                >
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
              background: "linear-gradient(135deg, #ff6b6b, #ee5a52)",
              color: "white",
              padding: "1rem 1.25rem",
              borderRadius: "12px",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <AlertCircle size={20} />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Success Message */}
        {step === 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              padding: "1rem 1.25rem",
              borderRadius: "12px",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            <CheckCircle
              style={{ width: "2rem", height: "2rem", margin: "0 auto 0.5rem" }}
            />
            <p>Registration successful! Redirecting to login...</p>
          </motion.div>
        )}

        {/* Form */}
        {step === 1 && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                Username
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Choose a unique username"
                  style={{
                    width: "100%",
                    padding: "1rem 1rem 1rem 3rem",
                    paddingLeft: "3rem",
                  }}
                  required
                />
                <User
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    width: "1.25rem",
                    height: "1.25rem",
                  }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                Display Name
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Your full name"
                  style={{
                    width: "100%",
                    padding: "1rem 1rem 1rem 3rem",
                  }}
                  required
                />
                <Eye
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    width: "1.25rem",
                    height: "1.25rem",
                  }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                Credential Name
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  name="credName"
                  value={formData.credName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Name for your authenticator"
                  style={{
                    width: "100%",
                    padding: "1rem 1rem 1rem 3rem",
                  }}
                  required
                />
                <Key
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    width: "1.25rem",
                    height: "1.25rem",
                  }}
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                position: "relative",
              }}
            >
              {isLoading ? (
                <Loader
                  style={{ width: "1.25rem", height: "1.25rem" }}
                  className="animate-spin"
                />
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
            style={{ textAlign: "center", padding: "2rem 0" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{
                width: "4rem",
                height: "4rem",
                border: "4px solid rgba(240, 147, 251, 0.3)",
                borderTop: "4px solid #f093fb",
                borderRadius: "50%",
                margin: "0 auto 1rem",
              }}
            />

            {step === 2 && (
              <p style={{ color: "#6b7280" }}>Setting up your account...</p>
            )}
            {step === 3 && (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Fingerprint style={{ color: "#f093fb" }} />
                  <p style={{ color: "#6b7280", margin: 0 }}>
                    Please use your authenticator
                  </p>
                </div>
                <p
                  style={{ fontSize: "0.875rem", color: "#9ca3af", margin: 0 }}
                >
                  Touch your fingerprint sensor, face ID, or security key
                </p>
              </div>
            )}
            {step === 4 && (
              <p style={{ color: "#6b7280" }}>Verifying your credentials...</p>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default RegisterPage;
