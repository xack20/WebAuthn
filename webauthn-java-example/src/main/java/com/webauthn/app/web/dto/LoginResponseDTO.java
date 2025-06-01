package com.webauthn.app.web.dto;

import lombok.Data;

@Data
public class LoginResponseDTO {
    private String status;
    private String message;
    private Object assertionRequest;
}