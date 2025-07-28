package com.example.bookit.Controllers;

import com.example.bookit.Entities.Report;
import com.example.bookit.Service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;


@RestController
    @RequestMapping("/api/reports")
    public class ReportController {

        private final ReportService reportService;

        public ReportController(ReportService reportService) {
            this.reportService = reportService;
        }

        @PostMapping("/generate")
        public ResponseEntity<Report> generateReport() {
            LocalDate today = LocalDate.now();
            LocalDate lastMonday = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).minusWeeks(1);
            LocalDate lastSunday = lastMonday.plusDays(6);

            try {
                Report report = reportService.generateWeeklyReport(lastMonday, lastSunday);
                return ResponseEntity.ok(report);
            } catch (Exception e) {
                return ResponseEntity.status(500).build();
            }
        }

        @GetMapping
        public List<Report> getAllReports() {
            return reportService.getAllReports();
        }
    }
