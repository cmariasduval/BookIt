import { useState, useEffect } from "react";

const AdminReports = () => {
  const [weeklyReports, setWeeklyReports] = useState([]);

  const formatDate = (arr) =>
    `${arr[0]}-${String(arr[1]).padStart(2, "0")}-${String(arr[2]).padStart(2, "0")}`;

  useEffect(() => {
    fetch("http://localhost:8080/api/reports", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => {
        console.log("Respuesta fetch status:", res.status);
        if (!res.ok) throw new Error("Error en la respuesta");
        return res.json();
      })
      .then((data) => {
        console.log("Reportes recibidos en useEffect:", data);
        setWeeklyReports(data);
      })
      .catch((err) => console.error("Error al obtener reportes:", err));
  }, []);

  console.log("Estado weeklyReports en render:", weeklyReports);

  return (
    <div className="admin-reports-section">
      <h2>Reportes Semanales</h2>
      {weeklyReports.length === 0 ? (
        <p>No hay reportes generados todavía.</p>
      ) : (
        <ul>
          {weeklyReports.map((report) => {
            console.log("Renderizando reporte:", report);
            return (
              <li key={report.id}>
                Semana: {formatDate(report.weekStart)} - {formatDate(report.weekEnd)}{" "}
                <a
                  href={`http://localhost:8080${report.pdfUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver PDF
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AdminReports;
