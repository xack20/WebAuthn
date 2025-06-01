# WebAuthn Full Stack Implementation

This project demonstrates a complete WebAuthn implementation with a React frontend and Java Spring Boot backend.

WebAuthn (Web Authentication) is an API that allows servers to register and authenticate users using public key cryptography instead of passwords. This project provides a practical example of how to implement passwordless authentication in a web application.

## Project Structure

This repository contains two main components:

- **webauthn-frontend**: React-based user interface
- **webauthn-java-example**: Spring Boot backend implementation

## Prerequisites

- **Node.js 16+** for the frontend
- **Java 17+** for the backend
- **Maven 3.6+** for building and running the backend
- A modern browser with WebAuthn support (Chrome, Firefox, Safari, Edge)

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
```bash
cd webauthn-java-example
```

2. Run the Spring Boot application:
```bash
./mvnw spring-boot:run
```

The backend will start on http://localhost:8080

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd webauthn-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will start on http://localhost:3000

## Features

- **User Registration**: Create new users with WebAuthn credentials
- **Passwordless Authentication**: Login using FIDO2 authenticators
- **Cross-platform Support**: Works with various authenticators including security keys, Touch ID, Face ID, and Windows Hello
- **Secure Communication**: End-to-end encryption between the client and server
- **FIDO2 Compliance**: Follows the latest WebAuthn specifications

## How It Works

### Registration Flow

1. User enters their username
2. Server creates a challenge
3. Browser activates the authenticator (security key, biometric sensor, etc.)
4. Authenticator creates a new public/private key pair and returns the public key
5. Server stores the public key with the user's account

### Authentication Flow

1. User enters their username
2. Server looks up the user's registered authenticators and creates a challenge
3. Browser activates the authenticator
4. Authenticator signs the challenge with the private key
5. Server verifies the signature using the stored public key

## API Endpoints

### Backend REST API

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/register/start`: Start WebAuthn registration process
- `POST /api/auth/register/finish`: Complete WebAuthn registration process
- `POST /api/auth/login`: Login a user
- `POST /api/auth/login/start`: Start WebAuthn authentication process
- `POST /api/auth/login/finish`: Complete WebAuthn authentication process

## Technologies Used

### Frontend

- React 18
- React Router DOM
- Axios for API calls
- Base64-js for binary data handling
- Tachyons CSS for styling

### Backend

- Spring Boot
- Spring Security
- Yubico's WebAuthn Server library
- JPA/Hibernate
- H2 Database (embedded)

## Security Considerations

- WebAuthn credentials never leave the user's device
- Challenge-response mechanism prevents replay attacks
- Origin validation ensures requests only come from trusted domains
- User verification options can require additional authentication factors

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome  | 67+     |
| Firefox | 60+     |
| Safari  | 13+     |
| Edge    | 18+     |

## Development

### Frontend Development

The React frontend is located in the `webauthn-frontend` directory. Key files:

- `src/components/*`: UI components for different pages
- `src/services/authService.js`: Service for communicating with the backend
- `src/utils/webAuthnUtils.js`: Utility functions for working with WebAuthn API

### Backend Development

The Spring Boot backend is in the `webauthn-java-example` directory. Key files:

- `src/main/java/com/webauthn/app/web/AuthRestController.java`: REST API endpoints
- `src/main/java/com/webauthn/app/web/RegistrationService.java`: Registration service
- `src/main/java/com/webauthn/app/authenticator/`: Authenticator model and repository
- `src/main/java/com/webauthn/app/user/`: User model and repository

## Resources

- [WebAuthn Specification](https://www.w3.org/TR/webauthn/)
- [FIDO2 Overview](https://fidoalliance.org/fido2/)
- [Yubico WebAuthn Library](https://developers.yubico.com/java-webauthn-server/)
- [WebAuthn Guide](https://webauthn.guide/)

## License

Apache 2.0
