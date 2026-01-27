import React from 'react';

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const SLOTS = ["08:00 - 10:00", "10:00 - 12:00", "13:00 - 15:00", "15:00 - 17:00"];

// Données de test (Simule ICT-L2)
const mockSessions = [
  { day: "Lundi", slot: "08:00 - 10:00", ue: "ICT203", prof: "Dr. Tanon", room: "Amphi 250", date: "20/01/2026" },
  { day: "Mercredi", slot: "10:00 - 12:00", ue: "MAT101", prof: "Mme Eboa", room: "Salle 102", date: "22/01/2026" },
];

const Timetable = () => {
  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Emploi du temps : ICT-L2 (Semestre 1)</h2>
      
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Horaires</th>
            {DAYS.map(day => (
              <th key={day} className="border border-gray-300 p-2">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SLOTS.map(slot => (
            <tr key={slot}>
              <td className="border border-gray-300 p-2 font-semibold bg-gray-50">{slot}</td>
              {DAYS.map(day => {
                const session = mockSessions.find(s => s.day === day && s.slot === slot);
                return (
                  <td key={day} className="border border-gray-300 p-2 h-32 w-48 align-top">
                    {session ? (
                      <div className="bg-blue-100 p-2 rounded border-l-4 border-blue-500 text-xs">
                        <p className="font-bold text-blue-900">{session.ue}</p>
                        <p className="italic">{session.prof}</p>
                        <p className="mt-1 font-semibold">Salle: {session.room}</p>
                        <p className="text-gray-500">{session.date}</p>
                        <p className="text-blue-700 font-medium">{session.slot}</p>
                      </div>
                    ) : (
                      <div className="text-gray-300 italic text-center mt-8">Libre</div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Timetable;