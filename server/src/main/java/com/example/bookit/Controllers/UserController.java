package com.example.bookit.Controllers;

import com.example.bookit.Config.JwtUtil;
import com.example.bookit.DTO.AuthResponse;
import com.example.bookit.DTO.LoginResponse;
import com.example.bookit.DTO.UserRequest;
import com.example.bookit.Entities.User;
import com.example.bookit.Repository.UserRepository;
import com.example.bookit.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserRequest userRequest) {
        try {
            User newUser = userService.registerUser(
                    userRequest.getUsername(),
                    userRequest.getPassword(),
                    userRequest.getEmail(),
                    userRequest.getFullName(),
                    userRequest.getBirthDate(),
                    userRequest.getInterests(),
                    userRequest.getRole()
            );
            return ResponseEntity.ok(newUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            String token = userService.loginUser(user.getEmail(), user.getPassword());
            User loggedUser = userService.getUserByEmail(user.getEmail());

            return ResponseEntity.ok(new LoginResponse(token, loggedUser));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }


    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        String username = getAuthenticatedUser();
        return ResponseEntity.ok("Usuario autenticado: " + username);
    }

    private String getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody User updatedUser, @RequestHeader("Authorization") String token) {
        String emailFromToken = jwtUtil.extractEmailFromToken(token);
        Optional<User> userOptional = userRepository.findByEmail(emailFromToken);

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado.");
        }

        User user = userOptional.get();

        if (updatedUser.getUsername() != null) user.setUsername(updatedUser.getUsername());
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            user.setPassword(updatedUser.getPassword()); // Codificá si usás encoder
        }
        if (updatedUser.getBirthDate() != null) user.setBirthDate(updatedUser.getBirthDate());
        if (updatedUser.getFullName() != null) user.setFullName(updatedUser.getFullName());
        if (updatedUser.getInterests() != null) user.setInterests(updatedUser.getInterests());

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }



}
