// src/components/RegisterPage.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { finishRegistration, register } from "../services/authService";
import {
  encodeRegistrationCredential,
  isWebAuthnSupported,
  prepareRegistrationOptions,
} from "../utils/webAuthnUtils";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [credName, setCredName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isWebAuthnSupported()) {
      setError("WebAuthn is not supported in this browser");
      return;
    }

    // Inside your RegisterPage.js component
    // Within the handleSubmit function:

    try {
      console.log("Starting registration process");

      // Step 1: Request registration options from server
      const registrationData = await register(username, displayName);
      console.log("Registration response:", registrationData);

      if (registrationData.status === "success") {
        // Step 2: Create credentials with browser WebAuthn API
        // Pass the entire response data
        const credentialCreateOptions =
          prepareRegistrationOptions(registrationData);
        console.log("Prepared WebAuthn options:", credentialCreateOptions);

        const credential = await navigator.credentials.create(
          credentialCreateOptions
        );
        console.log("Created credential:", credential);

        // Step 3: Encode and send credential to server
        const encodedCredential = encodeRegistrationCredential(credential);
        const result = await finishRegistration(
          encodedCredential,
          username,
          credName
        );

        if (result.status === "success") {
          navigate("/login");
        } else {
          setError(result.message || "Registration failed");
        }
      } else {
        setError(registrationData.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(
        error.response?.data?.message || error.message || "Registration failed"
      );
    }
  };

  return (
    <div className="pa4 black-80">
      {error && <div className="red mb3">{error}</div>}
      <form className="measure center" onSubmit={handleSubmit}>
        <legend className="f2 f1-l fw2 mb0 lh-title">
          Register Authentication
        </legend>
        <div className="mt3">
          <label className="db fw6 lh-copy" htmlFor="username">
            Username:
          </label>
          <input
            className="pa2 input-reset ba bg-transparent hover-bg-hot-pink hover-white w-100"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mt3">
          <label className="db fw6 lh-copy" htmlFor="display">
            Display Name:
          </label>
          <input
            className="pa2 input-reset ba bg-transparent hover-bg-hot-pink hover-white w-100"
            type="text"
            id="display"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </div>
        <div className="mt3">
          <label className="db fw6 lh-copy" htmlFor="credname">
            Credential Name:
          </label>
          <input
            className="pa2 input-reset ba bg-transparent hover-bg-hot-pink hover-white w-100"
            type="text"
            id="credname"
            value={credName}
            onChange={(e) => setCredName(e.target.value)}
            required
          />
        </div>
        <button
          className="ba bw1 mt2 no-underline br-pill ph3 pv2 mb2 dib white b--hot-pink bg-hot-pink"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
