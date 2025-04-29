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

//    @PutMapping("/api/users/{email}")
//    public ResponseEntity<?> updateUser(@PathVariable String email, @RequestBody User updatedUser, @RequestHeader("Authorization") String token) {
//        // Verificar si el token es válido y obtener el usuario desde el token
//        String userEmailFromToken = jwtUtil.extractEmailFromToken(token);  // Suponiendo que tienes un servicio JWT
//
//        if (!userEmailFromToken.equals(email)) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No puedes modificar los datos de otro usuario.");
//        }
//
//        // Buscar el usuario en la base de datos por su email
//        Optional<User> userOptional = userRepository.findByEmail(email);
//        if (userOptional.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado.");
//        }
//
//        User user = userOptional.get();
//        // Actualizar los campos del usuario
//        if (updatedUser.getUsername() != null) {
//            user.setUsername(updatedUser.getUsername());
//        }
//        if (updatedUser.getBirthDate() != null) {
//            user.setBirthDate(updatedUser.getBirthDate());
//        }
//        if (updatedUser.getNewPassword() != null && !updatedUser.getNewPassword().isEmpty()) {
//            user.setPassword(passwordEncoder.encode(updatedUser.getNewPassword()));  // Suponiendo que usas passwordEncoder
//        }
//
//        // Guardar el usuario actualizado
//        userRepository.save(user);
//
//        return ResponseEntity.ok("Datos actualizados correctamente.");
//    }

}
