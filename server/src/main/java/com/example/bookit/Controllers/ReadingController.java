package com.example.bookit.Controllers;

import com.example.bookit.DTO.ReadingDTO;
import com.example.bookit.Entities.Reading;
import com.example.bookit.Entities.User;
import com.example.bookit.Service.ReadingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/readings")
public class ReadingController {

    private final ReadingService readingService;

    public ReadingController(ReadingService readingService) {
        this.readingService = readingService;
    }

    // Obtener libros que el usuario está leyendo actualmente
    @GetMapping("/user/{userId}")
    public List<ReadingDTO> getCurrentReadings(@PathVariable Long userId) {
        List<Reading> readings = readingService.getCurrentReadingsByUser(userId);
        return readings.stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Obtener usuarios en infracción
    @GetMapping("/infractions")
    public List<User> getUsersInInfraction() {
        return readingService.getUsersInInfraction();
    }

    // DTO de lectura simplificado para frontend
    private ReadingDTO toDTO(Reading reading) {
        long daysRemaining = ChronoUnit.DAYS.between(LocalDate.now(), reading.getEndDate());

        return new ReadingDTO(
                reading.getCopy().getBook().getTitle(),
                daysRemaining,
                daysRemaining < 0 ? "RED" : daysRemaining <= 2 ? "YELLOW" : "NORMAL"
        );
    }



}
