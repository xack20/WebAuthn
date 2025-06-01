package com.webauthn.app.web;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.webauthn.app.authenticator.Authenticator;
import com.webauthn.app.user.AppUser;
import com.webauthn.app.utility.Utility;
import com.webauthn.app.web.dto.CredentialDTO;
import com.webauthn.app.web.dto.LoginResponseDTO;
import com.webauthn.app.web.dto.RegistrationResponseDTO;
import com.yubico.webauthn.AssertionRequest;
import com.yubico.webauthn.AssertionResult;
import com.yubico.webauthn.FinishAssertionOptions;
import com.yubico.webauthn.FinishRegistrationOptions;
import com.yubico.webauthn.RegistrationResult;
import com.yubico.webauthn.RelyingParty;
import com.yubico.webauthn.StartAssertionOptions;
import com.yubico.webauthn.StartRegistrationOptions;
import com.yubico.webauthn.data.AuthenticatorAssertionResponse;
import com.yubico.webauthn.data.AuthenticatorAttestationResponse;
import com.yubico.webauthn.data.ClientAssertionExtensionOutputs;
import com.yubico.webauthn.data.ClientRegistrationExtensionOutputs;
import com.yubico.webauthn.data.PublicKeyCredential;
import com.yubico.webauthn.data.PublicKeyCredentialCreationOptions;
import com.yubico.webauthn.data.UserIdentity;
import com.yubico.webauthn.exception.AssertionFailedException;
import com.yubico.webauthn.exception.RegistrationFailedException;

@RestController
@RequestMapping("/api/auth")
public class AuthRestController {

    private final RelyingParty relyingParty;
    private final RegistrationService service;

    public AuthRestController(RegistrationService service, RelyingParty relyingParty) {
        this.relyingParty = relyingParty;
        this.service = service;
    }

    @PostMapping("/register")
    public ResponseEntity<RegistrationResponseDTO> registerUser(
            @RequestParam String username,
            @RequestParam String display,
            HttpSession session
    ) {
        RegistrationResponseDTO response = new RegistrationResponseDTO();
        
        AppUser existingUser = service.getUserRepo().findByUsername(username);
        if (existingUser == null) {
            UserIdentity userIdentity = UserIdentity.builder()
                    .name(username)
                    .displayName(display)
                    .id(Utility.generateRandom(32))
                    .build();
            AppUser savedUser = new AppUser(userIdentity);
            service.getUserRepo().save(savedUser);

            // Generate registration options
            StartRegistrationOptions registrationOptions = StartRegistrationOptions.builder()
                    .user(userIdentity)
                    .build();

            PublicKeyCredentialCreationOptions registration = relyingParty.startRegistration(registrationOptions);
            session.setAttribute(userIdentity.getName(), registration);

            response.setStatus("success");
            response.setMessage("Registration initiated");
            response.setPublicKeyCredentialCreationOptions(registration);
            
            return ResponseEntity.ok(response);
        } else {
            response.setStatus("error");
            response.setMessage("Username " + username + " already exists. Choose a new name.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
    }

    @PostMapping("/finishRegistration")
    public ResponseEntity<Map<String, String>> finishRegistration(
            @RequestBody CredentialDTO credentialDTO,
            HttpSession session
    ) {
        Map<String, String> response = new HashMap<>();
        
        try {
            AppUser user = service.getUserRepo().findByUsername(credentialDTO.getUsername());
            if (user == null) {
                response.put("status", "error");
                response.put("message", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            PublicKeyCredentialCreationOptions requestOptions = 
                (PublicKeyCredentialCreationOptions) session.getAttribute(user.getUsername());
                
            if (requestOptions != null) {
                PublicKeyCredential<AuthenticatorAttestationResponse, ClientRegistrationExtensionOutputs> pkc =
                        PublicKeyCredential.parseRegistrationResponseJson(credentialDTO.getCredential());
                        
                FinishRegistrationOptions options = FinishRegistrationOptions.builder()
                        .request(requestOptions)
                        .response(pkc)
                        .build();
                        
                RegistrationResult result = relyingParty.finishRegistration(options);
                Authenticator savedAuth = new Authenticator(result, pkc.getResponse(), user, credentialDTO.getCredname());
                service.getAuthRepository().save(savedAuth);
                
                response.put("status", "success");
                response.put("message", "Registration successful");
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "error");
                response.put("message", "Cached request expired. Try to register again!");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (RegistrationFailedException e) {
            response.put("status", "error");
            response.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (IOException e) {
            response.put("status", "error");
            response.put("message", "Failed to save credential: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> startLogin(
            @RequestParam String username,
            HttpSession session
    ) {
        LoginResponseDTO response = new LoginResponseDTO();
        
        AssertionRequest request = relyingParty.startAssertion(StartAssertionOptions.builder()
                .username(username)
                .build());
                
        session.setAttribute(username, request);
        
        response.setStatus("success");
        response.setMessage("Authentication initiated");
        response.setAssertionRequest(request);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/finishLogin")
    public ResponseEntity<Map<String, Object>> finishLogin(
            @RequestBody CredentialDTO credentialDTO,
            HttpSession session
    ) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String username = credentialDTO.getUsername();
            PublicKeyCredential<AuthenticatorAssertionResponse, ClientAssertionExtensionOutputs> pkc =
                    PublicKeyCredential.parseAssertionResponseJson(credentialDTO.getCredential());
                    
            AssertionRequest request = (AssertionRequest) session.getAttribute(username);
            if (request == null) {
                response.put("status", "error");
                response.put("message", "No authentication request found in session");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            AssertionResult result = relyingParty.finishAssertion(FinishAssertionOptions.builder()
                    .request(request)
                    .response(pkc)
                    .build());
                    
            if (result.isSuccess()) {
                AppUser user = service.getUserRepo().findByUsername(username);
                
                response.put("status", "success");
                response.put("message", "Authentication successful");
                response.put("username", username);
                response.put("displayName", user.getDisplayName());
                
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "error");
                response.put("message", "Authentication failed");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch (IOException | AssertionFailedException e) {
            response.put("status", "error");
            response.put("message", "Authentication failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
