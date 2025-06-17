
// src/DailyChecklist.jsx
import { useState } from "react";

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

const getTodayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

const getTodayLabel = () => {
  const now = new Date();
  return now.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
  });
};

const getInitialState = () => {
  const saved = localStorage.getItem("checklist");
  return saved ? JSON.parse(saved) : {};
};

export default function DailyChecklist() {
  const [checked, setChecked] = useState(getInitialState());

  const todayKey = getTodayKey();
  const todayLabel = getTodayLabel();

  const toggleCheck = (section, item) => {
    const newState = {
      ...checked,
      [todayKey]: {
        ...(checked[todayKey] || {}),
        [section]: {
          ...((checked[todayKey] || {})[section] || {}),
          [item]: !((checked[todayKey] || {})[section]?.[item]),
        },
      },
    };
    setChecked(newState);
    localStorage.setItem("checklist", JSON.stringify(newState));
  };

  const resetToday = () => {
    const newState = { ...checked, [todayKey]: {} };
    setChecked(newState);
    localStorage.setItem("checklist", JSON.stringify(newState));
  };

  const getProgress = () => {
    const today = checked[todayKey] || {};
    const total = checklistItems.reduce((sum, section) => sum + section.items.length, 0);
    const done = checklistItems.reduce((sum, section) => {
      return (
        sum +
        section.items.filter((item) => today[section.time]?.[item]).length
      );
    }, 0);
    return ((done / total) * 100).toFixed(2);
  };

  const renderStats = () => {
    const dates = Object.keys(checked);
    const today = getTodayKey();

    let weekDone = 0, weekTotal = 0;
    let monthDone = 0, monthTotal = 0;

    const now = new Date();
    const nowDay = now.getDate();
    const nowMonth = now.getMonth() + 1;
    const nowYear = now.getFullYear();

    for (const date of dates) {
      const [year, month, day] = date.split("-").map(Number);
      const total = checklistItems.reduce((sum, s) => sum + s.items.length, 0);
      const done = checklistItems.reduce((sum, s) => {
        return sum + s.items.filter(i => checked[date]?.[s.time]?.[i]).length;
      }, 0);

      if (year === nowYear && month === nowMonth) {
        monthDone += done;
        monthTotal += total;

        if (Math.abs(nowDay - day) < 7) {
          weekDone += done;
          weekTotal += total;
        }
      }
    }

    const weekProgress = weekTotal ? ((weekDone / weekTotal) * 100).toFixed(2) : "0.00";
    const monthProgress = monthTotal ? ((monthDone / monthTotal) * 100).toFixed(2) : "0.00";

    return (
      <div style={{ marginTop: "2rem" }}>
        <h3>📈 주간 통계: {weekProgress}%</h3>
        <h3>📅 월간 통계: {monthProgress}%</h3>
      </div>
    );
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>회복 루틴 체크리스트</h1>
      <h2>📆 오늘: {todayLabel}</h2>
      <button onClick={resetToday}>오늘 루틴 초기화</button>
      <h2>✅ 오늘의 달성률: {getProgress()}%</h2>

      {checklistItems.map((section) => (
        <div key={section.time} style={{ marginBottom: "1.5rem" }}>
          <h3>{section.time}</h3>
          {section.items.map((item) => (
            <label key={item} style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={checked[todayKey]?.[section.time]?.[item] || false}
                onChange={() => toggleCheck(section.time, item)}
              />{" "}
              {item}
            </label>
          ))}
        </div>
      ))}

      {renderStats()}
    </div>
  );
}
