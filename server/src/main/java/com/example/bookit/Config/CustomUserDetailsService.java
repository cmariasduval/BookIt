package com.example.bookit.Config;

import com.example.bookit.Entities.Book;
import com.example.bookit.Entities.User;
import com.example.bookit.Repository.BookRepository;
import com.example.bookit.Repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public CustomUserDetailsService(UserRepository userRepository, BookRepository bookRepository) {
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));

        List<GrantedAuthority> authorities = new ArrayList<>();

        if (user.getEmail().equalsIgnoreCase("admin@bookit.com")) {
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        } else {
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),  // ⚠️ Importante: debe estar encriptada si usás BCrypt
                authorities
        );
    }



    @PostMapping("/upload")
    public ResponseEntity<?> uploadBook(@RequestBody Book book) {
        String username = getAuthenticatedUser();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAmin = user.getRoles().stream().anyMatch(role -> role.getRoleName().equals("Amin"));

        // Verificar si el usuario tiene el rol "ADMIN"
        if (!isAmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied. Only admin can upload books.");
        }

        book.setUploadedBy(user);
        bookRepository.save(book);

        return ResponseEntity.ok("Book uploaded by " + user.getUsername());
    }

        private String getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        }
        else{
            return principal.toString();
        }
    }
}

