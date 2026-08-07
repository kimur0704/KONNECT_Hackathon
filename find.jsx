import React, { useState, useEffect } from 'react';

export default function FindGatherings() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('list'); // 'list' | 'detail'
  const [selectedEventId, setSelectedEventId] = useState(null);
  
  // 탭 상태 ('nearby' | 'upcoming')
  const [activeTab, setActiveTab] = useState('nearby');
  // 지역 필터 상태
  const [selectedRegion, setSelectedRegion] = useState('전체');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // 백엔드 API에서 모임 목록 가져오기
  useEffect(() => {
    fetch(`${API_URL}/api/gatherings`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEvents(data.gatherings);
        }
      })
      .catch((err) => console.error("모임 데이터 불러오기 에러:", err))
      .finally(() => setLoading(false));
  }, [API_URL]);

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

  // 백엔드 연동 신청/취소 토글 (PATCH /api/gatherings/:id/book)
  const toggleBook = async (eventId) => {
    try {
      const response = await fetch(`${API_URL}/api/gatherings/${eventId}/book`, {
        method: 'PATCH',
      });
      const data = await response.json();

      if (data.success) {
        const nextBooked = data.booked;
        const targetItem = events.find((item) => item.id === eventId);
        
        alert(nextBooked ? `[${targetItem?.title}]\n신청이 완료되었습니다.` : `[${targetItem?.title}]\n신청이 취소되었습니다.`);

        setEvents((prev) =>
          prev.map((item) => {
            if (item.id === eventId) {
              const updatedItem = { ...item, booked: nextBooked };
              if (selectedEventId === eventId) {
                localStorage.setItem('selectedEvent', JSON.stringify(updatedItem));
              }
              return updatedItem;
            }
            return item;
          })
        );
      }
    } catch (error) {
      console.error("신청 상태 변경 실패:", error);
      alert("신청 상태 변경 중 오류가 발생했습니다.");
    }
  };

  // 1. 내 주변 모임 (3.0km 이하)
  const nearbyEvents = events.filter((e) => parseFloat(e.distance) <= 3.0);

  // 2. 전체 모임 (지역 필터링)
  const upcomingEvents = selectedRegion === '전체'
    ? events
    : events.filter((e) => e.region === selectedRegion);

  // 현재 상세 선택된 이벤트 객체
  const selectedEvent = events.find((e) => e.id === selectedEventId);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '40px 0' }}>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>모임 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

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
                {nearbyEvents.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#64748b', fontSize: '1.05rem', padding: '30px 0' }}>
                    주변 3km 이내에 등록된 모임이 없습니다.
                  </p>
                ) : (
                  nearbyEvents.map((item) => (
                    <EventCard
                      key={item.id}
                      item={item}
                      showDistance={true}
                      onDetail={() => goToDetail(item.id)}
                      onBook={() => toggleBook(item.id)}
                    />
                  ))
                )}
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