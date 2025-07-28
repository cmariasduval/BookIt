package com.example.bookit.Service;

import com.example.bookit.Entities.Report;
import com.example.bookit.Entities.Reservation;
import com.example.bookit.Entities.Infraction;
import com.example.bookit.Repository.ReportRepository;
import com.example.bookit.Repository.ReservationRepository;
import com.example.bookit.Repository.InfractionRepository;
import com.lowagie.text.DocumentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

import org.xhtmlrenderer.pdf.ITextRenderer;

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

        // Armar HTML
        String html = buildFullWeeklyReportHtml(weekStart, weekEnd, reservations, returns, infractions, topBooks);

        // Generar PDF desde HTML
        generatePdfFromHtml(html, pdfPath.toString());

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

    public void generatePdfFromHtml(String html, String outputPath) throws Exception {
        try (OutputStream os = new FileOutputStream(outputPath)) {
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(html);
            renderer.layout();
            renderer.createPDF(os);
        } catch (Exception ex) {
            System.out.println("Error generando PDF:");
            ex.printStackTrace();
            throw ex;
        }
    }


    public String buildFullWeeklyReportHtml(
            LocalDate weekStart,
            LocalDate weekEnd,
            List<Reservation> reservations,
            List<Reservation> returns,
            List<Infraction> infractions,
            List<Map.Entry<String, Long>> topBooks) {

        StringBuilder booksRows = new StringBuilder();
        for (Map.Entry<String, Long> entry : topBooks) {
            booksRows.append("<tr>")
                    .append("<td>").append(entry.getKey()).append("</td>")
                    .append("<td>").append(entry.getValue()).append("</td>")
                    .append("</tr>");
        }

        StringBuilder html = new StringBuilder();

        html.append("<!DOCTYPE html>")
                .append("<html>")
                .append("<head>")
                .append("<meta charset=\"UTF-8\" />")
                .append("<style>")
                .append("body { font-family: 'Segoe UI', sans-serif; background-color: #faf9f4; padding: 32px; color: #5a4d3a; }")
                .append(".title { font-size: 24px; font-weight: 700; color: #8b7355; text-align: center; margin-bottom: 24px; }")
                .append(".section-title { font-weight: 600; margin-top: 24px; margin-bottom: 8px; color: #8b7355; font-size: 18px; }")
                .append("table { width: 100%; border-collapse: collapse; border: 2px solid #eee8aa; box-shadow: 0 4px 12px rgba(139, 115, 85, 0.15); border-radius: 12px; overflow: hidden; }")
                .append("th { background-color: #eee8aa; color: #8b7355; padding: 12px; text-align: left; text-transform: uppercase; font-size: 14px; }")
                .append("td { padding: 12px; border-bottom: 1px solid #f0edd4; font-size: 14px; }")
                .append("</style>")
                .append("</head>")
                .append("<body>")
                .append("<div class=\"title\">Reporte Semanal de Biblioteca</div>")
                .append("<div>📅 Desde: ").append(weekStart.toString()).append("</div>")
                .append("<div>📅 Hasta: ").append(weekEnd.toString()).append("</div>")

                .append("<div class=\"section-title\">Resumen</div>")
                .append("<ul>")
                .append("<li>Reservas realizadas: ").append(reservations.size()).append("</li>")
                .append("<li>Libros entregados: ").append(returns.size()).append("</li>")
                .append("<li>Libros devueltos: ").append(returns.size()).append("</li>")  // ajustar si tenés datos separados
                .append("<li>Infracciones generadas: ").append(infractions.size()).append("</li>")
                .append("</ul>")

                .append("<div class=\"section-title\">Top 3 libros más reservados</div>")
                .append("<table>")
                .append("<thead><tr><th>Título</th><th>Cantidad de reservas</th></tr></thead>")
                .append("<tbody>")
                .append(booksRows)
                .append("</tbody>")
                .append("</table>")

                .append("</body>")
                .append("</html>");

        return html.toString();
    }


    public void deleteOldReportIfExists(LocalDate weekStart, LocalDate weekEnd) throws Exception {
        String fileName = "reporte-" + weekStart + "-al-" + weekEnd + ".pdf";
        Path pdfPath = pdfDirectory.resolve(fileName);
        if (Files.exists(pdfPath)) {
            Files.delete(pdfPath);
        }
    }

    public LocalDate getLastSunday() {
        LocalDate today = LocalDate.now();
        return today.with(java.time.temporal.TemporalAdjusters.previous(java.time.DayOfWeek.SUNDAY));
    }

    public LocalDate getPreviousSunday() {
        return getLastSunday().minusWeeks(1);
    }


    public Report generateLastWeekReport() throws Exception {
        LocalDate weekEnd = getLastSunday();
        LocalDate weekStart = getPreviousSunday();

        // Borro PDF viejo (si existe)
        deleteOldReportIfExists(weekStart, weekEnd);

// Borro reporte viejo de la base de datos (si existe)
        deleteOldReportRecordIfExists(weekStart, weekEnd);

// Genero nuevo reporte
        return generateWeeklyReport(weekStart, weekEnd);

    }

    public void deleteOldReportRecordIfExists(LocalDate weekStart, LocalDate weekEnd) {
        Optional<Report> existing = reportRepository.findByWeekStartAndWeekEnd(weekStart, weekEnd);
        existing.ifPresent(reportRepository::delete);
    }

}
