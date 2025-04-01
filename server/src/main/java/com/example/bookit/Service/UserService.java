package com.example.bookit.Service;

import com.example.bookit.Model.User.User;
import com.example.bookit.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User registerUser(String email, String password, String fullName, LocalDate birthDate, String interests, String username){
        if (userRepository.findByEmail(email).isPresent()){
            throw new RuntimeException("El mail ya esta registrado");
        }
        User user = new User(email, password, fullName, birthDate, interests, username);
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
