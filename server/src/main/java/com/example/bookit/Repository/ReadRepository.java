package com.example.bookit.Repository;

import com.example.bookit.Entities.Read;
import com.example.bookit.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReadRepository extends JpaRepository<Read, Long> {
    List<Read> findAllByUser(User user);

}
