package com.example.bookit.Controllers;

import com.example.bookit.Config.JwtUtil;
import com.example.bookit.DTO.AuthResponse;
import com.example.bookit.DTO.LoginResponse;
import com.example.bookit.DTO.UserRequest;
import com.example.bookit.DTO.UserUpdateRequest;
import com.example.bookit.Entities.Genre;
import com.example.bookit.Entities.User;
import com.example.bookit.Repository.GenreRepository;
import com.example.bookit.Repository.UserRepository;
import com.example.bookit.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.example.bookit.Entities.Role;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    private final UserRepository userRepository;
    @Autowired
    private GenreRepository genreRepository;

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
    public ResponseEntity<?> updateUser(@RequestBody UserUpdateRequest updatedUser, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replaceFirst("Bearer ", "");
        String usernameFromToken = jwtUtil.extractUsername(token);
        Optional<User> userOptional = userRepository.findByUsername(usernameFromToken);

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado.");
        }

        User user = userOptional.get();

        // Actualizar campos si no son nulos
        if (updatedUser.getUsername() != null) {
            user.setUsername(updatedUser.getUsername());
        }

        if (updatedUser.getNewPassword() != null && !updatedUser.getNewPassword().isEmpty()) {
            user.setPassword(updatedUser.getNewPassword()); // Considerar usar passwordEncoder.encode()
        }

        if (updatedUser.getBirthDate() != null) {
            user.setBirthDate(updatedUser.getBirthDate());
        }

        if (updatedUser.getInterests() != null) {
            List<Integer> ids = updatedUser.getInterests().stream().map(Genre::getId).collect(Collectors.toList());
            List<Genre> genres = genreRepository.findAllById(ids);
            user.setInterests(genres);
        }

        String role = user.getRoles()
                .stream()
                .map(Role::getRoleName)
                .collect(Collectors.joining(","));  // o sólo .get(0).getName()


        userRepository.save(user);
        return ResponseEntity.ok().body(
                new UserResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getBirthDate(),
                        user.getInterests(),
                        role
                )
        );
    }

    public static class UserResponse {
        public Integer id;
        public String username;
        public String email;
        public java.time.LocalDate birthDate;
        public List<Genre> interests;
        public String role;

        public UserResponse(Integer id, String username, String email, java.time.LocalDate birthDate, List<Genre> interests, String role) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.birthDate = birthDate;
            this.interests = interests;
            this.role = role;
        }
    }
}
