import React, { useState, useEffect } from 'react';

// 샘플 모임 데이터
const initialEvents = [
  { id: 1, type: "봉사활동", title: "팬클럽 연탄 나눔 봉사활동", region: "경기도", location: "고양시 일산동구", distance: "800m", date: "8월 17일 오후 2시", desc: "지역 사회에 따뜻한 온정을 나누는 연탄 봉사활동입니다. 편안한 복장으로 오시면 됩니다.", booked: false },
  { id: 2, type: "단체 응원", title: "음악방송 현장 단체 응원", region: "경기도", location: "파주시 문산읍", distance: "1.5km", date: "8월 20일 오전 11시", desc: "방송국 근처에 함께 모여 가수님의 1위를 기원하며 응원도구와 함께 응원합니다.", booked: false },
  { id: 3, type: "행사 관람", title: "트롯 가요제 공동 관람", region: "경기도", location: "수원시 팔달구", distance: "2.8km", date: "8월 25일 오후 6시", desc: "가요제 단체 좌석에서 팬분들과 함께 모여 공연을 관람하는 모임입니다.", booked: false },
  { id: 4, type: "생일 카페", title: "○○ 생일 기념 컵홀더 카페", region: "강원도", location: "춘천시 명동", distance: "65km", date: "8월 12일 오후 1시", desc: "춘천 명동 카페에서 진행되는 나눔 및 교류 모임입니다.", booked: true },
  { id: 5, type: "봉사활동", title: "유기견 보호소 봉사활동", region: "충청남도", location: "천안시 동남구", distance: "85km", date: "8월 28일 오전 10시", desc: "유기견 보호소에서 일손을 돕고 따뜻한 사랑을 전하는 봉사활동입니다.", booked: false },
  { id: 6, type: "단체 응원", title: "야외 콘서트 팬석 단체 응원", region: "전라북도", location: "전주시 완산구", distance: "190km", date: "9월 02일 오후 5시", desc: "야외 콘서트 현장에서 다 함께 응원전을 펼치는 모임입니다.", booked: false },
  { id: 7, type: "행사 관람", title: "지역 콘서트 단체 관람", region: "경상남도", location: "창원시 성산구", distance: "280km", date: "9월 05일 오후 7시", desc: "경상 지역 팬분들과 함께 모여 공연을 관람합니다.", booked: false },
  { id: 8, type: "행사 관람", title: "제주 트롯 페스티벌 모임", region: "제주도", location: "제주시 애월읍", distance: "450km", date: "9월 10일 오후 4시", desc: "제주 페스티벌 현장에서 팬분들과 함께 관람하는 모임입니다.", booked: false }
];

export default function App() {
  const [events, setEvents] = useState(initialEvents);
  const [currentView, setCurrentView] = useState('list'); // 'list' | 'detail'
  const [selectedEventId, setSelectedEventId] = useState(null);
  
  // 탭 상태 ('nearby' | 'upcoming')
  const [activeTab, setActiveTab] = useState('nearby');
  // 지역 필터 상태
  const [selectedRegion, setSelectedRegion] = useState('전체');

  // 상세 페이지 이동 시 localStorage 저장
  const goToDetail = (eventId) => {
    const item = events.find((e) => e.id === eventId);
    if (item) {
      localStorage.setItem('selectedEvent', JSON.stringify(item));
      setSelectedEventId(eventId);
      setCurrentView('detail');
    }
  };

  // 목록으로 돌아오기
  const goBack = () => {
    setCurrentView('list');
  };

  // 신청/취소 토글
  const toggleBook = (eventId) => {
    setEvents((prev) =>
      prev.map((item) => {
        if (item.id === eventId) {
          const nextBooked = !item.booked;
          alert(nextBooked ? `[${item.title}]\n신청이 완료되었습니다.` : `[${item.title}]\n신청이 취소되었습니다.`);
          
          const updatedItem = { ...item, booked: nextBooked };
          // 현재 상세 보기 중인 아이템이면 localStorage 업데이트
          if (selectedEventId === eventId) {
            localStorage.setItem('selectedEvent', JSON.stringify(updatedItem));
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  // 1. 내 주변 모임 (3.0km 이하)
  const nearbyEvents = events.filter((e) => parseFloat(e.distance) <= 3.0);

  // 2. 전체 모임 (지역 필터링)
  const upcomingEvents = selectedRegion === '전체'
    ? events
    : events.filter((e) => e.region === selectedRegion);

  // 현재 상세 선택된 이벤트 객체
  const selectedEvent = events.find((e) => e.id === selectedEventId);

  return (
    <div className="container">
      {currentView === 'list' ? (
        /* --- 모임 목록 화면 --- */
        <>
          <div className="header">
            <h2>가수 팬 활동 모임</h2>
          </div>

          <div className="tab-nav">
            <button
              className={`tab-btn ${activeTab === 'nearby' ? 'active' : ''}`}
              onClick={() => setActiveTab('nearby')}
            >
              내 주변 모임
            </button>
            <button
              className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveTab('upcoming')}
            >
              전체 모임 보기
            </button>
          </div>

          {activeTab === 'nearby' ? (
            <div className="tab-content">
              <div className="info-box">
                <span>현재 위치: <strong>경기도 고양시</strong></span>
              </div>
              <div className="event-list">
                {nearbyEvents.map((item) => (
                  <EventCard
                    key={item.id}
                    item={item}
                    showDistance={true}
                    onDetail={() => goToDetail(item.id)}
                    onBook={() => toggleBook(item.id)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="tab-content">
              <div className="info-box">
                <span>지역 선택:</span>
                <select
                  className="region-select"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  <option value="전체">전체 보기</option>
                  <option value="경기도">경기도</option>
                  <option value="강원도">강원도</option>
                  <option value="충청북도">충청북도</option>
                  <option value="충청남도">충청남도</option>
                  <option value="전라북도">전라북도</option>
                  <option value="전라남도">전라남도</option>
                  <option value="경상북도">경상북도</option>
                  <option value="경상남도">경상남도</option>
                  <option value="제주도">제주도</option>
                </select>
              </div>
              <div className="event-list">
                {upcomingEvents.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#64748b', fontSize: '1.05rem', padding: '30px 0' }}>
                    해당 지역에 등록된 모임이 아직 없습니다.
                  </p>
                ) : (
                  upcomingEvents.map((item) => (
                    <EventCard
                      key={item.id}
                      item={item}
                      showDistance={false}
                      onDetail={() => goToDetail(item.id)}
                      onBook={() => toggleBook(item.id)}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        /* --- 모임 상세 화면 --- */
        selectedEvent && (
          <>
            <span className="type-badge">{selectedEvent.type || '모임'}</span>
            <h2 className="title">{selectedEvent.title}</h2>

            <div className="info-card">
              <div className="info-item">
                <span className="info-label">일시</span>
                <span className="info-value">{selectedEvent.date}</span>
              </div>

              <div className="info-item">
                <span className="info-label">위치</span>
                <span className="info-value">{selectedEvent.region} {selectedEvent.location}</span>
              </div>

              <div className="desc-box info-item">
                <span className="info-label">모임 소개</span>
                <p className="desc-text">{selectedEvent.desc}</p>
              </div>
            </div>

            <div className="btn-group">
              <button className="btn-back" onClick={goBack}>목록으로</button>
              <button
                className={`btn-book ${selectedEvent.booked ? 'booked' : ''}`}
                onClick={() => toggleBook(selectedEvent.id)}
              >
                {selectedEvent.booked ? '신청 완료' : '신청하기'}
              </button>
            </div>
          </>
        )
      )}

      {/* 스타일 구문 */}
      <style jsx>{`
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Pretendard', sans-serif, '맑은 고딕'; }
        
        .container {
          max-width: 440px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          padding: 24px 20px;
        }

        .header { margin-bottom: 20px; text-align: center; }
        .header h2 { font-size: 1.4rem; color: #111; font-weight: 800; }

        .tab-nav {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }

        .tab-btn {
          flex: 1;
          padding: 14px 0;
          border: 2px solid #e5e8eb;
          background: #f8f9fa;
          font-size: 1.05rem;
          font-weight: bold;
          color: #666;
          border-radius: 12px;
          cursor: pointer;
        }

        .tab-btn.active {
          color: #ffffff;
          background: #ff2a6d;
          border-color: #ff2a6d;
        }

        .info-box {
          background: #f1f5f9;
          padding: 14px 16px;
          border-radius: 14px;
          margin-bottom: 18px;
          font-size: 1.05rem;
          color: #1e293b;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .region-select {
          border: 2px solid #cbd5e1;
          background: #ffffff;
          font-size: 1rem;
          font-weight: bold;
          color: #0f172a;
          padding: 6px 12px;
          border-radius: 10px;
          outline: none;
          cursor: pointer;
        }

        .event-list { display: flex; flex-direction: column; gap: 16px; }

        .event-card {
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 18px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .badge-row {
          display: flex;
          gap: 6px;
          margin-bottom: 4px;
        }

        .tag-badge {
          font-size: 0.85rem;
          background: #e2e8f0;
          color: #334155;
          padding: 4px 10px;
          border-radius: 8px;
          font-weight: bold;
        }

        .distance-badge {
          font-size: 0.85rem;
          background: #ffe4e6;
          color: #e11d48;
          padding: 4px 10px;
          border-radius: 8px;
          font-weight: bold;
        }

        .event-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.3;
        }

        .event-meta {
          font-size: 1rem;
          color: #475569;
          font-weight: 600;
          display: flex;
          gap: 12px;
        }

        .type-badge {
          display: inline-block;
          font-size: 0.9rem;
          background: #e2e8f0;
          color: #334155;
          padding: 5px 12px;
          border-radius: 8px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .title {
          font-size: 1.4rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.4;
          margin-bottom: 20px;
        }

        .info-card {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 18px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-label {
          font-size: 0.95rem;
          color: #64748b;
          font-weight: bold;
        }

        .info-value {
          font-size: 1.15rem;
          color: #0f172a;
          font-weight: bold;
          line-height: 1.4;
        }

        .desc-box {
          border-top: 2px solid #e2e8f0;
          padding-top: 16px;
        }

        .desc-text {
          font-size: 1.05rem;
          color: #334155;
          line-height: 1.6;
          font-weight: 500;
          white-space: pre-line;
        }

        .btn-group {
          display: flex;
          gap: 10px;
          margin-top: 4px;
        }

        .btn-detail {
          flex: 1;
          background: #f1f5f9;
          color: #334155;
          border: 2px solid #cbd5e1;
          padding: 14px 0;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
        }

        .btn-back {
          flex: 1;
          background: #f1f5f9;
          color: #334155;
          border: 2px solid #cbd5e1;
          padding: 16px 0;
          border-radius: 12px;
          font-size: 1.05rem;
          font-weight: bold;
          cursor: pointer;
        }

        .btn-book {
          flex: 1.2;
          background: #ff2a6d;
          color: #ffffff;
          border: none;
          padding: 14px 0;
          border-radius: 12px;
          font-size: 1.05rem;
          font-weight: bold;
          cursor: pointer;
        }

        .btn-book.booked {
          background: #16a34a;
        }
      `}</style>
    </div>
  );
}

// 이벤트 카드 컴포넌트
function EventCard({ item, showDistance, onDetail, onBook }) {
  return (
    <div className="event-card">
      <div>
        <div className="badge-row">
          <span className="tag-badge">{item.type}</span>
          {showDistance ? (
            <span className="distance-badge">내 위치에서 {item.distance}</span>
          ) : (
            <span className="tag-badge">{item.region}</span>
          )}
        </div>
        <div className="event-title">{item.title}</div>
      </div>

      <div className="event-meta">
        <span>위치: {item.location}</span>
        <span>일정: {item.date}</span>
      </div>

      <div className="btn-group">
        <button className="btn-detail" onClick={onDetail}>내용 보기</button>
        <button className={`btn-book ${item.booked ? 'booked' : ''}`} onClick={onBook}>
          {item.booked ? '신청 완료' : '신청하기'}
        </button>
      </div>
    </div>
  );
}