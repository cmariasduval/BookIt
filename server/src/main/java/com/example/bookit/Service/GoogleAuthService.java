package com.example.bookit.Service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class GoogleAuthService {

    @Value("${google.clientId}")
    private String googleClientId;

    public GoogleIdToken.Payload verifyToken(String idTokenString) throws Exception {
        var transport = GoogleNetHttpTransport.newTrustedTransport();
        var jsonFactory = JacksonFactory.getDefaultInstance();

        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                .setAudience(Collections.singletonList(googleClientId))
                .build();

        System.out.println("Verificando token...");
        System.out.println("Audience esperada: " + googleClientId);

        GoogleIdToken idToken = verifier.verify(idTokenString);
        if (idToken != null) {
            var payload = idToken.getPayload();
            System.out.println("Payload audience: " + payload.getAudience());
            System.out.println("Payload email: " + payload.getEmail());
            return payload;
        } else {
            System.out.println("Token inválido.");
            return null;
        }
    }
}
