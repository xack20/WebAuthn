// RegistrationResponseDTO.java
package com.webauthn.app.web.dto;

import lombok.Data;

@Data
public class CredentialDTO {
    private String credential;
    private String username;
    private String credname;
}
