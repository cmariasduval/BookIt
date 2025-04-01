package com.example.bookit.Controllers;

import com.example.bookit.Entities.User;
import com.example.bookit.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public User signup(@RequestBody User user){
        return userService.registerUser(user.getUsername(), user.getPassword(), user.getEmail(), user.getFullName(), user.getBirthdate(), user.getInterests());
    }

    @PostMapping("/login")
    public User login(@RequestBody User user){
        return userService.loginUser(user.getEmail(), user.getPassword());
    }
}
