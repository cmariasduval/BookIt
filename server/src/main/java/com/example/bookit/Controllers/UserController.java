package com.example.bookit.Controllers;

import com.example.bookit.Entities.User;
import com.example.bookit.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")  // Permite que el frontend acceda al backend
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            User newUser = userService.registerUser(
                    user.getUsername(),
                    user.getPassword(),
                    user.getEmail(),
                    user.getFullName(),
                    user.getBirthdate(),
                    user.getInterests()
            );
            return ResponseEntity.ok(newUser);  // Devuelve el usuario registrado
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());  // Devuelve el error si algo falla
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            User loggedInUser = userService.loginUser(user.getEmail(), user.getPassword());
            return ResponseEntity.ok(loggedInUser);  // Devuelve el usuario si el login es exitoso
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());  // Devuelve error si el login falla
        }
    }
}
