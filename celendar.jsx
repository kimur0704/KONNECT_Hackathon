import React, { useState } from 'react';

// 가수 일정 데이터 샘플
const scheduleData = [
  { id: 1, date: "2026-08-10", type: "티켓 예매", title: "서울 콘서트 1차 티켓 오픈", desc: "오후 8시 인터파크 티켓 독점 오픈" },
  { id: 2, date: "2026-08-14", type: "방송 송출", title: "음악방송 본방사수", desc: "오후 5시 10분 KBS2 뮤직뱅크 출연" },
  { id: 3, date: "2026-08-18", type: "앨범 발매", title: "신규 미니앨범 음원 공개", desc: "정오 12시 전 음원 사이트 및 뮤직비디오 공개" },
  { id: 4, date: "2026-08-20", type: "방송 송출", title: "예능 프로그램 게스트 출연", desc: "오후 8시 50분 JTBC 아는 형님" },
  { id: 5, date: "2026-08-28", type: "콘서트", title: "2026 전국투어 콘서트 - 서울 1일차", desc: "오후 7시 30분 올림픽 체조경기장" },
  { id: 6, date: "2026-08-29", type: "콘서트", title: "2026 전국투어 콘서트 - 서울 2일차", desc: "오후 6시 올림픽 체조경기장" }
];

const categories = ["전체", "티켓 예매", "방송 송출", "앨범 발매", "콘서트"];

export default function SingerCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // 2026년 8월 기준
  const [selectedDateStr, setSelectedDateStr] = useState("2026-08-10");
  const [currentFilter, setCurrentFilter] = useState("전체");

  // 월 이동
  const changeMonth = (delta) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1);
    setCurrentDate(newDate);
  };

  // 배지 클래스 반환
  const getBadgeClass = (type) => {
    switch (type) {
      case "티켓 예매": return "badge-ticket";
      case "방송 송출": return "badge-broadcast";
      case "앨범 발매": return "badge-album";
      case "콘서트": return "badge-concert";
      default: return "";
    }
  };

  // 도트 클래스 반환
  const getDotClass = (type) => {
    switch (type) {
      case "티켓 예매": return "dot-ticket";
      case "방송 송출": return "dot-broadcast";
      case "앨범 발매": return "dot-album";
      case "콘서트": return "dot-concert";
      default: return "";
    }
  };

  // 달력 계산용 변수
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  // 날짜 그리드 배열 생성
  const daysHeader = ['일', '월', '화', '수', '목', '금', '토'];
  
  // 선택된 날짜 상세 데이터
  const selectedEvents = scheduleData.filter((e) => {
    const matchesDate = e.date === selectedDateStr;
    const matchesFilter = currentFilter === "전체" || e.type === currentFilter;
    return matchesDate && matchesFilter;
  });

  const [selYear, selMonth, selDay] = selectedDateStr.split('-').map(Number);

  return (
    <div className="container">
      {/* 헤더 */}
      <div className="header">
        <button className="nav-btn" onClick={() => changeMonth(-1)}>이전달</button>
        <h2>{year}년 {month + 1}월</h2>
        <button className="nav-btn" onClick={() => changeMonth(1)}>다음달</button>
      </div>

      {/* 필터 */}
      <div className="filter-bar">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-btn ${currentFilter === category ? 'active' : ''}`}
            onClick={() => setCurrentFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 달력 격자 */}
      <div className="calendar-grid">
        {daysHeader.map((day, idx) => (
          <div 
            key={day} 
            className={`day-header ${idx === 0 ? 'sun' : idx === 6 ? 'sat' : ''}`}
          >
            {day}
          </div>
        ))}

        {/* 빈 칸 (이전 달 공간) */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="day-cell other-month"></div>
        ))}

        {/* 날짜 데이터 출력 */}
        {Array.from({ length: lastDate }, (_, i) => i + 1).map((date) => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
          const dayOfWeek = new Date(year, month, date).getDay();

          let dayClass = '';
          if (dayOfWeek === 0) dayClass = 'sun';
          if (dayOfWeek === 6) dayClass = 'sat';
          if (dateStr === selectedDateStr) dayClass += ' selected';

          let dayEvents = scheduleData.filter((e) => e.date === dateStr);
          if (currentFilter !== "전체") {
            dayEvents = dayEvents.filter((e) => e.type === currentFilter);
          }

          return (
            <div
              key={dateStr}
              className={`day-cell ${dayClass}`}
              onClick={() => setSelectedDateStr(dateStr)}
            >
              <span className="day-number">{date}</span>
              {dayEvents.length > 0 && (
                <div className="event-dot-container">
                  {dayEvents.map((e) => (
                    <div key={e.id} className={`event-dot ${getDotClass(e.type)}`} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 하단 상세 일정 정보 */}
      <div className="detail-section">
        <div className="detail-header">{selMonth}월 {selDay}일 일정</div>
        {selectedEvents.length === 0 ? (
          <div className="no-event">등록된 일정이 없습니다.</div>
        ) : (
          selectedEvents.map((event) => (
            <div key={event.id} className="event-item">
              <div className="event-top">
                <span className={`type-badge ${getBadgeClass(event.type)}`}>
                  {event.type}
                </span>
              </div>
              <div className="event-title">{event.title}</div>
              <div className="event-desc">{event.desc}</div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Pretendard', sans-serif, '맑은 고딕'; }
        
        .container {
          max-width: 480px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          padding: 20px 16px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .header h2 {
          font-size: 1.3rem;
          font-weight: 800;
          color: #0f172a;
        }

        .nav-btn {
          background: #f1f5f9;
          border: 2px solid #cbd5e1;
          color: #334155;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: bold;
          cursor: pointer;
        }

        .filter-bar {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 8px;
          margin-bottom: 16px;
        }

        .filter-btn {
          padding: 6px 12px;
          border-radius: 8px;
          border: 2px solid #e2e8f0;
          background: #ffffff;
          font-size: 0.85rem;
          font-weight: bold;
          color: #475569;
          cursor: pointer;
          white-space: nowrap;
        }

        .filter-btn.active {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
        }

        .badge-ticket { background: #dbeafe; color: #1d4ed8; }
        .badge-broadcast { background: #dcfce7; color: #15803d; }
        .badge-album { background: #f3e8ff; color: #6b21a8; }
        .badge-concert { background: #ffe4e6; color: #be123c; }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
          text-align: center;
          margin-bottom: 20px;
        }

        .day-header {
          font-size: 0.9rem;
          font-weight: bold;
          padding: 8px 0;
          color: #64748b;
        }

        .day-header.sun { color: #dc2626; }
        .day-header.sat { color: #2563eb; }

        .day-cell {
          min-height: 52px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 4px;
          background: #ffffff;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .day-cell.selected {
          border: 2px solid #ff2a6d;
          background: #fff5f7;
        }

        .day-number {
          font-size: 0.9rem;
          font-weight: bold;
          color: #1e293b;
          margin-bottom: 2px;
        }

        .day-cell.sun .day-number { color: #dc2626; }
        .day-cell.sat .day-number { color: #2563eb; }
        .day-cell.other-month { opacity: 0.3; cursor: default; }

        .event-dot-container {
          display: flex;
          gap: 2px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .event-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .dot-ticket { background: #1d4ed8; }
        .dot-broadcast { background: #15803d; }
        .dot-album { background: #6b21a8; }
        .dot-concert { background: #be123c; }

        .detail-section {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 16px;
        }

        .detail-header {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 12px;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 8px;
        }

        .event-item {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 10px;
        }

        .event-item:last-child { margin-bottom: 0; }

        .event-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .type-badge {
          font-size: 0.8rem;
          padding: 3px 8px;
          border-radius: 6px;
          font-weight: bold;
        }

        .event-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .event-desc {
          font-size: 0.95rem;
          color: #475569;
          line-height: 1.4;
        }

        .no-event {
          color: #64748b;
          font-size: 0.95rem;
          text-align: center;
          padding: 10px 0;
        }
      `}</style>
    </div>
  );
}