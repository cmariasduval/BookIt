package com.example.bookit.Entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    // Lo hacés opcional, porque podés pedir que el usuario lo complete luego
    @Column(name = "full_name", nullable = true)
    private String fullName;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    // Username opcional para Google login, podés generarlo o pedirlo luego
    @Column(name = "username", nullable = true, unique = true)
    private String username;

    // Password opcional para login Google (si usás OAuth no necesitás password)
    @Column(name = "password", nullable = true)
    private String password;

    // Fecha de nacimiento opcional
    @Column(name = "birthDate", nullable = true)
    private LocalDate birthDate;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private List<Role> roles = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_genre",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    private List<Genre> interests = new ArrayList<>();

    @Column(name = "blocked", nullable = false)
    private boolean blocked;

    @Column(name = "blocked_until", nullable = true)
    private LocalDate blockedUntil;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_favorites",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "book_id")
    )
    private List<Book> favorites = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_read_books",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "book_id")
    )
    private List<Book> readBooks = new ArrayList<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Infraction> infractions = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Reservation> reservations = new ArrayList<>();

    public User() {}

    public User(String username, String password, String email, LocalDate birthDate,
                List<Genre> interests, List<Role> roles, List<Book> favorites,
                List<Book> readBooks, List<Reservation> reservations,
                List<Infraction> infractions) {
        this.username = username;
        this.fullName = username;
        this.password = password;
        this.email = email;
        this.birthDate = birthDate;
        this.interests = interests;
        this.roles = roles;
        this.favorites = favorites;
        this.readBooks = readBooks;
        this.reservations = reservations;
        this.blocked = false;
        this.blockedUntil = null;
        this.infractions = infractions;
    }

    // Getters y setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }

    public List<Genre> getInterests() {
        return interests;
    }

    public void setInterests(List<Genre> interests) {
        this.interests = interests;
    }

    public List<Book> getFavorites() {
        return favorites;
    }

    public void setFavorites(List<Book> favorites) {
        this.favorites = favorites;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public List<Book> getReadBooks() {
        return readBooks;
    }

    public void setReadBooks(List<Book> readBooks) {
        this.readBooks = readBooks;
    }

    public List<Reservation> getReservations() {
        return reservations;
    }

    public void setReservations(List<Reservation> reservations) {
        this.reservations = reservations;
    }

    // Métodos para manejar favoritos y libros leídos
    public void addFavorite(Book book) {
        this.favorites.add(book);
    }

    public void removeFavorite(Book book) {
        this.favorites.remove(book);
    }

    public void addReadBook(Book book) {
        this.readBooks.add(book);
    }

    public void removeReadBook(Book book) {
        this.readBooks.remove(book);
    }

    public boolean isBlocked() {
        return blocked;
    }

    public void setBlocked(boolean blocked) {
        this.blocked = blocked;
    }

    public LocalDate getBlockedUntil() {
        return blockedUntil;
    }

    public void setBlockedUntil(LocalDate blockedUntil) {
        this.blockedUntil = blockedUntil;
    }

    public int getInfractionCount() {
        return infractions.size();
    }


    public double getDebt() {
        return infractions.stream()
                .filter(inf -> !inf.isPaid())
                .mapToDouble(Infraction::getAmount)
                .sum();
    }

    public List<Infraction> getInfractions() {
        return infractions;
    }

    public void setDebt(int i) {
    }

    public int getInfractionsCount() {
        return infractions.size();
    }

}
