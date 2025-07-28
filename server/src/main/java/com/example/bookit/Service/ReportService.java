package com.example.bookit.Service;

import com.example.bookit.Entities.Report;
import com.example.bookit.Entities.Reservation;
import com.example.bookit.Entities.Infraction;
import com.example.bookit.Repository.ReportRepository;
import com.example.bookit.Repository.ReservationRepository;
import com.example.bookit.Repository.InfractionRepository;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.FileOutputStream;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private InfractionRepository infractionRepository;

    private final Path pdfDirectory = Paths.get("generated-reports");

    @PostConstruct
    public void init() throws Exception {
        if (!Files.exists(pdfDirectory)) {
            Files.createDirectories(pdfDirectory);
        }
    }

    public Report generateWeeklyReport(LocalDate weekStart, LocalDate weekEnd) throws Exception {
        String fileName = "reporte-" + weekStart + "-al-" + weekEnd + ".pdf";
        Path pdfPath = pdfDirectory.resolve(fileName);

        // Consultar datos reales entre fechas
        List<Reservation> reservations = reservationRepository.findReservationsBetweenDates(weekStart, weekEnd);
        List<Reservation> returns = reservationRepository.findReturnsBetweenDates(weekStart, weekEnd);
        List<Infraction> infractions = infractionRepository.findInfractionsBetweenDates(weekStart, weekEnd);

        // Calcular libros más reservados
        Map<String, Long> bookReservationCounts = reservations.stream()
                .collect(Collectors.groupingBy(r -> r.getBook().getTitle(), Collectors.counting()));

        List<Map.Entry<String, Long>> topBooks = bookReservationCounts.entrySet().stream()
                .sorted((e1, e2) -> Long.compare(e2.getValue(), e1.getValue()))
                .limit(3)
                .collect(Collectors.toList());

        // Crear PDF con datos reales
        Document document = new Document();
        PdfWriter.getInstance(document, new FileOutputStream(pdfPath.toFile()));
        document.open();

        document.add(new Paragraph("📅 Reporte semanal"));
        document.add(new Paragraph("Desde: " + weekStart));
        document.add(new Paragraph("Hasta: " + weekEnd));
        document.add(new Paragraph(" "));

        document.add(new Paragraph("🔹 Reservas realizadas: " + reservations.size()));
        document.add(new Paragraph("🔹 Libros entregados: " + returns.size()));
        document.add(new Paragraph("🔹 Libros devueltos: " + returns.size())); // Asumiendo que devueltos = entregados, o usar otro criterio si hay otro campo
        document.add(new Paragraph("🔹 Infracciones generadas: " + infractions.size()));
        document.add(new Paragraph(" "));

        document.add(new Paragraph("📘 Libros más reservados:"));
        for (Map.Entry<String, Long> entry : topBooks) {
            document.add(new Paragraph("- " + entry.getKey() + " (" + entry.getValue() + " reservas)"));
        }

        document.close();

        // Guardar reporte en BD
        Report report = new Report();
        report.setWeekStart(weekStart);
        report.setWeekEnd(weekEnd);
        report.setPdfUrl("/files/" + fileName);

        return reportRepository.save(report);
    }

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }
}
