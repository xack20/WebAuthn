// Base64 utilities
function base64urlToUint8array(base64Data) {
  // Handle both string and object with value property
  let base64Bytes;
  if (typeof base64Data === "object" && base64Data.value) {
    base64Bytes = base64Data.value;
  } else if (typeof base64Data === "string") {
    base64Bytes = base64Data;
  } else {
    throw new Error("Invalid base64 data format");
  }

  const input = base64Bytes.replace(/-/g, "+").replace(/_/g, "/");

  const padding = "=".repeat((4 - (input.length % 4)) % 4);
  const base64 = input + padding;

  const binary = atob(base64);
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

// Prepare registration options for WebAuthn4j backend
export const prepareRegistrationOptions = (options) => {
  console.log("Original options from backend:", options);

  try {
    const preparedOptions = {
      publicKey: {
        challenge: base64urlToUint8array(options.challenge),
        rp: {
          id: options.rp.id,
          name: options.rp.name,
        },
        user: {
          id: base64urlToUint8array(options.user.id),
          name: options.user.name,
          displayName: options.user.displayName,
        },
        pubKeyCredParams: options.pubKeyCredParams || [
          { alg: -7, type: "public-key" },
          { alg: -257, type: "public-key" },
        ],
        timeout: options.timeout || 60000,
        excludeCredentials: options.excludeCredentials || [],
        authenticatorSelection: {
          authenticatorAttachment:
            options.authenticatorSelection?.authenticatorAttachment ||
            undefined,
          requireResidentKey:
            options.authenticatorSelection?.requireResidentKey || false,
          residentKey:
            options.authenticatorSelection?.residentKey || "preferred",
          userVerification:
            options.authenticatorSelection?.userVerification || "preferred",
        },
        attestation: options.attestation || "none",
        extensions: options.extensions || {},
      },
    };

    console.log("Prepared WebAuthn options:", preparedOptions);
    return preparedOptions;
  } catch (error) {
    console.error("Error preparing registration options:", error);
    throw new Error(`Failed to prepare WebAuthn options: ${error.message}`);
  }
};

// Encode registration credential for WebAuthn4j backend
export const encodeRegistrationCredential = (credential) => {
  try {
    const encoded = {
      clientDataJSON: JSON.stringify({
        type: credential.type,
        id: credential.id,
        response: {
          attestationObject: uint8arrayToBase64url(
            credential.response.attestationObject
          ),
          clientDataJSON: uint8arrayToBase64url(
            credential.response.clientDataJSON
          ),
          transports:
            (credential.response.getTransports &&
              credential.response.getTransports()) ||
            [],
        },
        clientExtensionResults: credential.getClientExtensionResults(),
      }),
      attestationObject: JSON.stringify({
        type: credential.type,
        id: credential.id,
        response: {
          attestationObject: uint8arrayToBase64url(
            credential.response.attestationObject
          ),
          clientDataJSON: uint8arrayToBase64url(
            credential.response.clientDataJSON
          ),
          transports:
            (credential.response.getTransports &&
              credential.response.getTransports()) ||
            [],
        },
        clientExtensionResults: credential.getClientExtensionResults(),
      }),
    };

    console.log("Encoded registration credential:", encoded);
    return encoded;

  } catch (error) {
    console.error("Error encoding registration credential:", error);
    throw new Error(`Failed to encode credential: ${error.message}`);
  }
};

// Prepare login options for WebAuthn4j backend
export const prepareLoginOptions = (options) => {
  console.log("Original login options from backend:", options);

  try {
    const preparedOptions = {
      publicKey: {
        challenge: base64urlToUint8array(options.challenge),
        timeout: options.timeout || 60000,
        rpId: options.rpId,
        allowCredentials: options.allowCredentials
          ? options.allowCredentials.map((credential) => ({
              type: credential.type,
              id: base64urlToUint8array(credential.id),
              transports: credential.transports || [],
            }))
          : [],
        userVerification: options.userVerification || "preferred",
        extensions: options.extensions || {},
      },
    };

    console.log("Prepared login options:", preparedOptions);
    return preparedOptions;
  } catch (error) {
    console.error("Error preparing login options:", error);
    throw new Error(
      `Failed to prepare WebAuthn login options: ${error.message}`
    );
  }
};

// Encode login credential for WebAuthn4j backend
export const encodeLoginCredential = (credential) => {
  try {
    const encoded = {
      id: credential.id,
      clientDataJSON: JSON.stringify({
        type: credential.type,
        credentialId: credential.id,
        id: credential.id,
        response: {
          authenticatorData: uint8arrayToBase64url(
            credential.response.authenticatorData
          ),
          clientDataJSON: uint8arrayToBase64url(
            credential.response.clientDataJSON
          ),
          signature: uint8arrayToBase64url(credential.response.signature),
          userHandle:
            credential.response.userHandle &&
            uint8arrayToBase64url(credential.response.userHandle),
        },
        clientExtensionResults: credential.getClientExtensionResults(),
      }),
      authenticatorData: uint8arrayToBase64url(
        credential.response.authenticatorData
      ),
      signature: uint8arrayToBase64url(credential.response.signature),
      userHandle: credential.response.userHandle
        ? uint8arrayToBase64url(credential.response.userHandle)
        : null,
    };

    console.log("Encoded login credential:", encoded);
    return encoded;
  } catch (error) {
    console.error("Error encoding login credential:", error);
    throw new Error(`Failed to encode login credential: ${error.message}`);
  }
};
