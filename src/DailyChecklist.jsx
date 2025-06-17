import { useState, useEffect } from "react";
import { Progress } from "antd";

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

export default function DailyChecklist() {
  const [checked, setChecked] = useState({});

  const toggleCheck = (section, item) => {
    setChecked((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [item]: !prev[section]?.[item],
      },
    }));
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>회복 루틴 체크리스트</h1>
      {checklistItems.map((section) => (
        <div key={section.time} style={{ marginBottom: "1.5rem" }}>
          <h2>
            {section.time} ({section.items.filter((item) => checked[section.time]?.[item]).length} /
            {section.items.length})
          </h2>
          <Progress
            percent={
              (section.items.filter((item) => checked[section.time]?.[item]).length /
                section.items.length) *
              100
            }
          />
          {section.items.map((item) => (
            <label key={item} style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={checked[section.time]?.[item] || false}
                onChange={() => toggleCheck(section.time, item)}
              />{" "}
              {item}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}