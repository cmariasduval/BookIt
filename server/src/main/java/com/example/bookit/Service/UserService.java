package com.example.bookit.Service;

import com.example.bookit.Entities.Genre;
import com.example.bookit.Entities.User;
import com.example.bookit.Repository.GenreRepository;
import com.example.bookit.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GenreRepository genreRepository;

    public User registerUser(String username, String password, String email, String fullName, LocalDate birthdate, List<String> interestNames){
        if (userRepository.findByEmail(email).isPresent()){
            throw new RuntimeException("El mail ya esta registrado");
        }
        // Convertimos los nombres de intereses en entidades Genre reales
        List<Genre> interests = interestNames.stream().map(name -> {
            return genreRepository.findByGenreType(name)
                    .orElseThrow(() -> new RuntimeException("Género no encontrado: " + name));
        }).toList();

        User user = new User(username, password, email, fullName, birthdate, interests);
        return userRepository.save(user);
    }

    public User loginUser(String email, String password){
        Optional<User> user = userRepository.findByEmail(email);
        if(user.isPresent() && user.get().getPassword().equals(password)){
            return user.get();
        }
        throw new RuntimeException("Credenciales incorrectas");
    }
}
