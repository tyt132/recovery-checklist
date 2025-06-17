
// src/DailyChecklist.jsx
import { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import './App.css'; // Apple 스타일 CSS

const checklistItems = [
  {
    time: "아침",
    items: ["베르베린", "아스타잔틴", "유비퀴놀", "비타민C"],
  },
  {
    time: "점심",
    items: ["오메가3", "비타민B3", "레스베라트롤"],
  },
  {
    time: "저녁",
    items: ["마그네슘", "퀘르세틴", "비타민C"],
  },
];

const formatDateKey = (date) =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

const getTodayLabel = (date) =>
  date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
  });

const getInitialState = () => {
  const saved = localStorage.getItem("checklist");
  return saved ? JSON.parse(saved) : {};
};

export default function DailyChecklist() {
  const [checked, setChecked] = useState(getInitialState());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const dateKey = formatDateKey(selectedDate);
  const today = new Date();
  const todayKey = formatDateKey(today);
  const todayLabel = getTodayLabel(today);
  const selectedLabel = getTodayLabel(selectedDate);
  const isToday = dateKey === todayKey;

  const toggleCheck = (section, item) => {
    const newState = {
      ...checked,
      [dateKey]: {
        ...(checked[dateKey] || {}),
        [section]: {
          ...((checked[dateKey] || {})[section] || {}),
          [item]: !((checked[dateKey] || {})[section]?.[item]),
        },
      },
    };
    setChecked(newState);
    localStorage.setItem("checklist", JSON.stringify(newState));
  };

  const resetDate = () => {
    const newState = { ...checked, [dateKey]: {} };
    setChecked(newState);
    localStorage.setItem("checklist", JSON.stringify(newState));
  };

  const getProgress = () => {
    const selected = checked[dateKey] || {};
    const total = checklistItems.reduce((sum, section) => sum + section.items.length, 0);
    const done = checklistItems.reduce((sum, section) => {
      return (
        sum +
        section.items.filter((item) => selected[section.time]?.[item]).length
      );
    }, 0);
    return ((done / total) * 100).toFixed(2);
  };

  return (
    <main className="container">
      <header className="header">
        <h1>회복 루틴 체크리스트</h1>
        <h2
          onClick={() => setShowCalendar(!showCalendar)}
          style={{ cursor: "pointer" }}
        >
          📆 선택된 날짜: {selectedLabel} ⬇️
        </h2>
        {showCalendar && (
          <Calendar
            onChange={(date) => {
              setSelectedDate(date);
              setShowCalendar(false);
            }}
            value={selectedDate}
          />
        )}
        {isToday && (
          <button className="reset-btn" onClick={resetDate}>
            오늘 루틴 초기화
          </button>
        )}
        <div className="progress-bar">
          <span>✅ {selectedLabel} 달성률: {getProgress()}%</span>
        </div>
      </header>

      {checklistItems.map((section) => (
        <section key={section.time} className="checklist-section">
          <h3>{section.time}</h3>
          {section.items.map((item) => (
            <label key={item} className="check-item">
              <input
                type="checkbox"
                checked={checked[dateKey]?.[section.time]?.[item] || false}
                onChange={() => toggleCheck(section.time, item)}
                disabled={!isToday}
                aria-label={item}
              />
              {item}
            </label>
          ))}
        </section>
      ))}
    </main>
  );
}
