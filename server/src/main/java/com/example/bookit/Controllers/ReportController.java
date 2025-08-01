package com.example.bookit.Controllers;

import com.example.bookit.Entities.Report;
import com.example.bookit.Service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;


@RestController
    @RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:3000")
    public class ReportController {

        private final ReportService reportService;

        public ReportController(ReportService reportService) {
            this.reportService = reportService;
        }

//        @PostMapping("/generate")
//        public ResponseEntity<Report> generateReport() {
//            LocalDate today = LocalDate.now();
//            LocalDate lastMonday = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).minusWeeks(1);
//            LocalDate lastSunday = lastMonday.plusDays(6);
//
//            try {
//                Report report = reportService.generateWeeklyReport(lastMonday, lastSunday);
//                return ResponseEntity.ok(report);
//            } catch (Exception e) {
//                return ResponseEntity.status(500).build();
//            }
//        }

    @PostMapping("/generate")
    public ResponseEntity<Report> generateReport() {
        try {
            Report report = reportService.generateLastWeekReport();
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }


//    @PostMapping("/generate")
//    public ResponseEntity<Report> generateReport() {
//        LocalDate weekStart = LocalDate.of(2025, 7, 20);
//        LocalDate weekEnd = LocalDate.of(2025, 7, 27);
//
//        try {
//            Report report = reportService.generateWeeklyRep
//            ort(weekStart, weekEnd);
//            return ResponseEntity.ok(report);
//        } catch (Exception e) {
//            return ResponseEntity.status(500).build();
//        }
//    }


    @GetMapping
        public List<Report> getAllReports() {
            return reportService.getAllReports();
        }
    }
