package com.example.bookit.Controllers;

import com.example.bookit.Config.JwtUtil;
import com.example.bookit.DTO.*;
import com.example.bookit.Entities.Genre;
import com.example.bookit.Entities.User;
import com.example.bookit.Repository.GenreRepository;
import com.example.bookit.Repository.UserRepository;
import com.example.bookit.Service.UserService;
import com.example.bookit.Service.GoogleAuthService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.example.bookit.Entities.Role;
import com.example.bookit.DTO.UserProfileData;
import com.example.bookit.Entities.Infraction;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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

    @Autowired
    private GoogleAuthService googleAuthService;


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
                    userRequest.getInterests()
            );
            return ResponseEntity.ok(newUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest user) {
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

    @GetMapping("/{email}/reserved-books")
    public ResponseEntity<List<BookDTO>> getReservedBooksByUser(@PathVariable String email) {
        List<BookDTO> reservedBooks = userService.getReservedBooksByUserEmail(email);
        return ResponseEntity.ok(reservedBooks != null ? reservedBooks : new ArrayList<>());
    }

    @GetMapping("/{email}/active-reservations")
    public ResponseEntity<List<BookDTO>> getActiveReservations(@PathVariable String email) {
        List<BookDTO> activeBooks = userService.getActiveReservedBooksByUserEmail(email);
        return ResponseEntity.ok(activeBooks);
    }

    @GetMapping("/profile-data")
    public ResponseEntity<?> getUserProfileData(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replaceFirst("Bearer ", "");
            String usernameFromToken = jwtUtil.extractUsername(token);
            Optional<User> userOptional = userRepository.findByUsername(usernameFromToken);

            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado.");
            }

            User user = userOptional.get();

            // Contar infracciones no pagadas
            long unpaidInfractions = user.getInfractions() != null ?
                    user.getInfractions().stream()
                            .filter(inf -> !inf.isPaid())
                            .count() : 0;

            // Calcular deuda total
            double totalDebt = user.getInfractions() != null ?
                    user.getInfractions().stream()
                            .filter(inf -> !inf.isPaid())
                            .mapToDouble(Infraction::getAmount)
                            .sum() : 0.0;

            // Crear respuesta con los datos necesarios
            UserProfileData profileData = new UserProfileData(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    totalDebt,
                    (int) unpaidInfractions,
                    user.isBlocked(),
                    user.getBlockedUntil()
            );

            return ResponseEntity.ok(profileData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al obtener datos del perfil: " + e.getMessage());
        }
    }

    @PostMapping("/login/google")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request) {
        try {
            System.out.println("ID Token recibido: " + request.getIdToken());

            GoogleIdToken.Payload payload = googleAuthService.verifyToken(request.getIdToken());

            if (payload == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Token de Google inválido."));
            }

            String email = payload.getEmail();

            // Intentar buscar el usuario por email
            Optional<User> optionalUser = userRepository.findByEmail(email);
            User user = optionalUser.orElse(null);


            // Si no existe, crear uno nuevo con datos mínimos
            if (user == null) {
                user = new User();
                user.setEmail(email);
                user.setUsername(email.split("@")[0]); // podés mejorar esto
                user.setPassword(""); // dejar vacío si no vas a usarlo
                user.setInterests(List.of()); // o null si preferís
                user.setBirthDate(LocalDate.of(1999, 5, 19));
                user.setFullName(email.split("@")[0]);
                userRepository.save(user);
            }

            String token = jwtUtil.generateToken(user.getUsername());

            return ResponseEntity.ok(new LoginResponse(token, user));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error al procesar login con Google: " + e.getMessage()));
        }
    }




    @PostMapping("/complete-profile")
    public ResponseEntity<?> completeProfile(@RequestBody CompleteProfileRequest request) {
        try {
            User updatedUser = userService.completeUserProfile(request.getEmail(), request.getBirthdate(), request.getInterests());
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


}
