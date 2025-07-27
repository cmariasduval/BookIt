import { useState, useEffect } from "react";

const AdminReportsSection = () => {
  const [weeklyReports, setWeeklyReports] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/reports", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => res.json())
      .then(setWeeklyReports)
      .catch((err) => console.error("Error al obtener reportes:", err));
  }, []);

  return (
    <div className="admin-reports-section">
      <h2>Reportes Semanales</h2>
      {weeklyReports.length === 0 ? (
        <p>No hay reportes generados todavía.</p>
      ) : (
        <ul>
          {weeklyReports.map((report) => (
            <li key={report.id}>
              Semana: {report.weekStart} - {report.weekEnd}
              <a href={report.pdfUrl} target="_blank" rel="noopener noreferrer">
                Ver PDF
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminReportsSection;
