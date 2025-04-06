package com.example.bookit.Controllers;

import com.example.bookit.DTO.UserRequest;
import com.example.bookit.Entities.User;
import com.example.bookit.Repository.UserRepository;
import com.example.bookit.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")  // Permite que el frontend acceda al backend
public class UserController {

    @Autowired
    private UserService userService;

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserRequest userRequest) {
        try {
            User newUser = userService.registerUser(
                    userRequest.getUsername(), // Esto es el username
                    userRequest.getPassword(),
                    userRequest.getEmail(),
                    userRequest.getFullName(),
                    userRequest.getBirthDate(),
                    userRequest.getInterests()
            );
            return ResponseEntity.ok(newUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
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

    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

}
