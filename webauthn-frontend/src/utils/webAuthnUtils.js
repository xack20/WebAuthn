// src/utils/webAuthnUtils.js

// Base64 utilities - CORRECTED
function base64urlToUint8array(base64Bytes) {
  // Replace non-url safe chars with base64 standard chars
  const input = base64Bytes.replace(/-/g, "+").replace(/_/g, "/");

  // Add padding if needed
  const padding = "=".repeat((4 - (input.length % 4)) % 4);
  const base64 = input + padding;

  // Convert base64 to binary string
  const binary = atob(base64);

  // Convert binary string to Uint8Array
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return array;
}

function uint8arrayToBase64url(bytes) {
  // Convert Uint8Array to binary string
  let binary = "";
  if (bytes instanceof Uint8Array) {
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
  } else {
    // If it's an ArrayBuffer, convert to Uint8Array first
    const view = new Uint8Array(bytes);
    const len = view.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(view[i]);
    }
  }

  // Convert binary string to base64
  const base64 = btoa(binary);

  // Make base64 URL safe
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

// Check if WebAuthn is supported
export const isWebAuthnSupported = () => {
  return window.PublicKeyCredential !== undefined;
};

// Prepare registration options - CORRECTED FUNCTION
export const prepareRegistrationOptions = (response) => {
  // Extract the actual credential creation options from the response
  const credentialOptions = response.publicKeyCredentialCreationOptions;

  // Create a clean version of the extensions object
  let cleanExtensions = {};

  // Only add extensions that have valid values
  if (credentialOptions.extensions) {
    if (credentialOptions.extensions.credProps === true) {
      cleanExtensions.credProps = true;
    }

    // Only include appidExclude if it's a valid URL string
    if (
      credentialOptions.extensions.appidExclude &&
      typeof credentialOptions.extensions.appidExclude === "string" &&
      credentialOptions.extensions.appidExclude.startsWith("http")
    ) {
      cleanExtensions.appidExclude = credentialOptions.extensions.appidExclude;
    }

    // Handle other extensions as needed
    if (credentialOptions.extensions.uvm) {
      cleanExtensions.uvm = credentialOptions.extensions.uvm;
    }

    if (credentialOptions.extensions.largeBlob) {
      cleanExtensions.largeBlob = credentialOptions.extensions.largeBlob;
    }
  }

  return {
    publicKey: {
      ...credentialOptions,
      challenge: base64urlToUint8array(credentialOptions.challenge),
      user: {
        ...credentialOptions.user,
        id: base64urlToUint8array(credentialOptions.user.id),
      },
      excludeCredentials: credentialOptions.excludeCredentials
        ? credentialOptions.excludeCredentials.map((credential) => ({
            ...credential,
            id: base64urlToUint8array(credential.id),
          }))
        : [],
      // Replace the extensions with our cleaned version
      extensions: cleanExtensions,
    },
  };
};

// Encode registration credential
export const encodeRegistrationCredential = (credential) => {
  return {
    type: credential.type,
    id: credential.id,
    response: {
      attestationObject: uint8arrayToBase64url(
        credential.response.attestationObject
      ),
      clientDataJSON: uint8arrayToBase64url(credential.response.clientDataJSON),
      transports:
        (credential.response.getTransports &&
          credential.response.getTransports()) ||
        [],
    },
    clientExtensionResults: credential.getClientExtensionResults(),
  };
};

// Prepare login options - MORE ROBUST VERSION
export const prepareLoginOptions = (response) => {
  console.log("Login response:", response);

  // Extract the request options from the correct location in the response structure
  const assertionRequest = response.assertionRequest;

  if (
    !assertionRequest ||
    !assertionRequest.publicKeyCredentialRequestOptions
  ) {
    console.error("Invalid assertion request format:", response);
    throw new Error("Invalid response format from server");
  }

  // Access the publicKeyCredentialRequestOptions object
  const requestOptions = assertionRequest.publicKeyCredentialRequestOptions;

  // Build a safe version of the options object
  const safeOptions = {
    challenge: base64urlToUint8array(requestOptions.challenge),
  };

  // Only add properties if they exist and are valid
  if (requestOptions.rpId) {
    safeOptions.rpId = requestOptions.rpId;
  }

  if (requestOptions.timeout !== null && requestOptions.timeout !== undefined) {
    safeOptions.timeout = requestOptions.timeout;
  }

  if (requestOptions.userVerification) {
    safeOptions.userVerification = requestOptions.userVerification;
  }

  // Safely handle allowCredentials
  if (
    requestOptions.allowCredentials &&
    Array.isArray(requestOptions.allowCredentials)
  ) {
    safeOptions.allowCredentials = requestOptions.allowCredentials.map(
      (credential) => {
        const result = {
          type: credential.type,
          id: base64urlToUint8array(credential.id),
        };

        // Only add transports if it's a valid array
        if (credential.transports && Array.isArray(credential.transports)) {
          result.transports = credential.transports;
        }

        return result;
      }
    );
  }

  // Skip extensions entirely to avoid issues
  // If extensions are needed, they can be added carefully one by one

  return {
    publicKey: safeOptions,
  };
};

// Encode login credential
export const encodeLoginCredential = (credential) => {
  return {
    type: credential.type,
    id: credential.id,
    response: {
      authenticatorData: uint8arrayToBase64url(
        credential.response.authenticatorData
      ),
      clientDataJSON: uint8arrayToBase64url(credential.response.clientDataJSON),
      signature: uint8arrayToBase64url(credential.response.signature),
      userHandle:
        credential.response.userHandle &&
        uint8arrayToBase64url(credential.response.userHandle),
    },
    clientExtensionResults: credential.getClientExtensionResults(),
  };
};
