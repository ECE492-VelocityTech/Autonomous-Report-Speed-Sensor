package com.VelocityTech.CarssBackend.Controller;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthorizationController {


    @Value("${google.api.key}")
    private String googleApiKey;

    @GetMapping("/googleApiKey")
    public String getGoogleApiKey(){
        return googleApiKey;
    }
}
