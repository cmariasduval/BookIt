package com.example.bookit.Service;

import com.example.bookit.Config.JwtUtil;
import com.example.bookit.DTO.BookDTO;
import com.example.bookit.Entities.*;
import com.example.bookit.Repository.GenreRepository;
import com.example.bookit.Repository.ReservationRepository;
import com.example.bookit.Repository.RoleRepository;
import com.example.bookit.Repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GenreRepository genreRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ReservationRepository reservationRepository;  // Se inyecta el repositorio de Reservas

    @Autowired
    private JwtUtil jwtUtil;

    public User registerUser(
            String username,
            String password,
            String email,
            String fullName,
            LocalDate birthdate,
            List<String> interestNames) {  // quitar List<Role> role de parámetros

        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("El mail ya está registrado");
        }

        // Obtener el rol USER desde la base
        Role userRole = roleRepository.findByRoleName("USER")
                .orElseThrow(() -> new RuntimeException("Role USER no encontrado"));

        // Convertimos los nombres de intereses en entidades Genre reales
        List<Genre> interests = interestNames.stream().map(name -> {
            return genreRepository.findByGenreType(name)
                    .orElseThrow(() -> new RuntimeException("Género no encontrado: " + name));
        }).toList();

        // Creamos el usuario con el rol USER asignado
        User user = new User(username, password, email, birthdate, interests, List.of(userRole),
                new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), new ArrayList<>());

        return userRepository.save(user);
    }


    public String loginUser(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            // Aquí generamos el token después de la autenticación exitosa
            return jwtUtil.generateToken(user.get().getUsername());
        }
        throw new RuntimeException("Credenciales incorrectas");
    }

    public User getUserById(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public User getUserByName(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public void addFavoriteBook(User user, Book book) {
        if (!user.getFavorites().contains(book)) {
            user.getFavorites().add(book);
            userRepository.save(user); // Guardamos los cambios en la base de datos
        }
    }

    public void markBookAsRead(User user, Book book) {
        if (!user.getReadBooks().contains(book)) {
            user.getReadBooks().add(book);
            userRepository.save(user); // Guardamos los cambios en la base de datos
        }
    }

    public void reserveBook(User user, BookCopy copy, LocalDate reservationDate, int period) {
        // Verificar si el usuario ya tiene 3 libros reservados
        if (user.getReservations().size() < 3) {
            LocalDate pickupDate = reservationDate.plusDays(period); // Calcular la fecha de recogida

            // Crear la reserva
            Reservation reservation = new Reservation();
            reservation.setUser(user);
            reservation.setCopy(copy);
            reservation.setPickupDate(reservationDate);
            reservation.setPickupDate(pickupDate);
            reservation.setPeriod(period);
            reservation.setStatus(ReservationStatus.PENDING);  // Estado de la reserva

            // Guardar la reserva en la base de datos utilizando la instancia inyectada
            reservationRepository.save(reservation);  // Corregido: usamos reservationRepository en lugar de llamar estáticamente

            // Agregar la reserva a la lista de reservas del usuario
            user.getReservations().add(reservation);

            // Guardar los cambios en el usuario
            userRepository.save(user);
        } else {
            // Lanzar excepción si el usuario ya tiene 3 reservas activas
            throw new IllegalStateException("No puedes tener más de 3 reservas activas al mismo tiempo.");
        }
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public List<User> findUsersWithInfractions() {
        return userRepository.findUsersWithInfractionsOrBlocked();
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
    }

    public List<BookDTO> getReservedBooksByUserEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return Collections.emptyList();
        }

        User user = userOpt.get();
        // Suponiendo que User tiene un Set<Book> reservedBooks o algo similar
        return user.getReservations()
                .stream()
                .map(reservation -> {
                    Book book = reservation.getCopy().getBook(); // o como accedas al Book desde Reservation
                    return new BookDTO(book);
                })
                .collect(Collectors.toList());

    }

    //traes las reservas activas del usuario
    public List<BookDTO> getActiveReservedBooksByUserEmail(String email) {
        List<Reservation> activeReservations = reservationRepository.findByUserEmailAndStatuses(
                email,
                List.of(ReservationStatus.PENDING, ReservationStatus.ACTIVE)
        );

        return activeReservations.stream()
                .map(reservation -> {
                    Book book = reservation.getCopy().getBook();
                    return new BookDTO(book);
                })
                .collect(Collectors.toList());
    }

    public User registerUserFromGooglePayload(GoogleIdToken.Payload payload) {
        String email = payload.getEmail();
        String name = (String) payload.get("name");

        User newUser = new User();
        newUser.setUsername(email.split("@")[0]);
        newUser.setEmail(email);
        newUser.setPassword(""); // o algún valor por defecto
        newUser.setRoles(List.of(new Role("USER"))); // o lo que uses

        return userRepository.save(newUser);
    }


    public User completeUserProfile(String email, LocalDate birthdate, List<String> interestNames) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con el email: " + email));

        user.setBirthDate(birthdate);

        List<Genre> interests = interestNames.stream()
                .map(name -> genreRepository.findByGenreType(name)
                        .orElseThrow(() -> new RuntimeException("Género no encontrado: " + name)))
                .collect(Collectors.toList());

        user.setInterests(interests);

        return userRepository.save(user);
    }
}
