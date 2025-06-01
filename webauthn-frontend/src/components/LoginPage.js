// src/components/LoginPage.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { finishLogin, login } from "../services/authService";
import {
  encodeLoginCredential,
  isWebAuthnSupported,
  prepareLoginOptions,
} from "../utils/webAuthnUtils";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isWebAuthnSupported()) {
      setError("WebAuthn is not supported in this browser");
      return;
    }

    // In LoginPage.js, handleSubmit function
    try {
      console.log("Starting login process");

      // Step 1: Request authentication options from server
      const loginData = await login(username);
      console.log("Login response data:", loginData);

      if (loginData.status === "success") {
        // Step 2: Get credentials with browser WebAuthn API
        const credentialGetOptions = prepareLoginOptions(loginData);
        console.log("Prepared credential options:", credentialGetOptions);

        const credential = await navigator.credentials.get(
          credentialGetOptions
        );
        console.log("Retrieved credential:", credential);

        // Step 3: Encode and send credential to server
        const encodedCredential = encodeLoginCredential(credential);
        const result = await finishLogin(encodedCredential, username);

        if (result.status === "success") {
          // Save user info in localStorage or context
          localStorage.setItem(
            "user",
            JSON.stringify({
              username: result.username,
              displayName: result.displayName,
            })
          );
          navigate("/welcome");
        } else {
          setError(result.message || "Authentication failed");
        }
      } else {
        setError(loginData.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Authentication failed"
      );
    }
  };

  return (
    <div className="db fw6 lh-copy f6 measure center">
      {error && (
        <div className="red mb3" id="error">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <legend className="f2 f1-l fw2 mb0 lh-title">Login</legend>
        <label className="db fw6 lh-copy f6" htmlFor="username">
          Your Username:
        </label>
        <input
          className="pa2 input-reset ba bg-transparent hover-bg-purple hover-white w-100"
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button
          className="ba bw1 mv2 f6 no-underline br-pill ph3 pv2 dib white b--purple bg-purple"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
