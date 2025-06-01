package com.webauthn.app.web.dto;

import lombok.Data;

@Data
public class RegistrationResponseDTO {
    private String status;
    private String message;
    private Object publicKeyCredentialCreationOptions;
}