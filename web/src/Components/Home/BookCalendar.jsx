import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // para permitir clics

const BookCalendar = () => {
  const events = [
    {
      title: 'Emma',
      start: '2025-06-05',
      end: '2025-06-11', // OJO: end es exclusivo (no se incluye el 10)
    },
    {
      title: 'Anna Frank',
      start: '2025-06-15',
      end: '2025-06-18',
    },
  ];

  return (
    <div style={{ padding: '1rem', background: 'white', borderRadius: '1rem' }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '',
        }}
        height="auto"
      />
    </div>
  );
};

export default BookCalendar;
