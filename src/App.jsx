import { useEffect, useState } from 'react'
import './App.css'
import VoteHubView from './pages/VoteHubView'

const initialFavoriteSingers = [
  {
    id: 1,
    name: '윤하늘',
    initial: '윤',
    fanDays: 327,
    color: 'purple',
    schedule: '오늘 오후 8시 음악방송',
  },
  {
    id: 2,
    name: '김별빛',
    initial: '김',
    fanDays: 152,
    color: 'pink',
    schedule: '내일 오후 7시 라이브 방송',
  },
  {
    id: 3,
    name: '박다정',
    initial: '박',
    fanDays: 48,
    color: 'blue',
    schedule: '8월 10일 콘서트 예매',
  },
]

const translations = {
  ko: {
    welcome: '안녕하세요 👋',
    headline: '오늘도 최애와 함께해요',
    artistsTitle: '내가 좋아하는 가수',
    addArtist: '+ 가수 추가',
    emptyTitle: '좋아하는 가수를 추가해 보세요',
    emptyText: '가수를 추가하면 팬덤 일정과 응원을 바로 확인할 수 있어요.',
    emptyButton: '가수 추가하기',
    communityTitle: '포스트형 커뮤니티',
    communitySubtitle: 'AI가 민감한 내용을 미리 걸러줘요',
    communityChip: 'AI 필터링 적용',
    calendarTitle: '달력 & 스케줄',
    calendarSubtitle: '예매 / 방송 / 버스대절 링크를 한눈에 확인해요',
    meetupTitle: '내 주변 모임 & 알림',
    meetupSubtitle: '가수 관련 모임과 새 소식을 바로 확인해요',
    navHome: '홈',
    navAlerts: '알림',
    navSettings: '설정',
    languageButton: '언어설정',
    aiHelpButton: 'AI 도움',
    singerHeader: '팬덤 스테이션',
    singerHero: '오늘의 응원을 함께 준비해요',
    voteCardTitle: '투표 링크 모음',
    voteCardText: '투표 인증과 감사 멘트까지 이어지는 흐름',
    voteButton: '투표하러 가기',
    authCardTitle: '투표 인증',
    authCardText: '인증글과 감사 멘트를 바로 남길 수 있어요',
    hallCardTitle: '명예의 전당',
    hallCardText: '이번 달 팬덤 기록을 한눈에 확인해요',
    quickTitle: '빠른 이동',
    quickHome: '홈으로',
    quickAlerts: '알림 보기',
    quickSettings: '설정 열기',
    alertsTitle: '알림센터',
    alertsHeadline: '가수 관련 모임과 새 소식을 확인해 보세요',
    alert1: '오늘 오후 7시, 지역 팬 모임이 열려요.',
    alert2: '투표 인증글이 새로 등록됐어요.',
    alert3: '버스대절 링크가 업데이트됐어요.',
    settingsTitle: '마이페이지',
    fontTitle: '글자 크기',
    back: '뒤로가기',
  },
  en: {
    welcome: 'Hello 👋',
    headline: 'Let’s support your favorite artist today',
    artistsTitle: 'My artists',
    addArtist: '+ Add artist',
    emptyTitle: 'Add your favorite artist',
    emptyText: 'You can check schedules and support activities right away.',
    emptyButton: 'Add artist',
    communityTitle: 'Community posts',
    communitySubtitle: 'AI filters sensitive content in advance',
    communityChip: 'AI filtering on',
    calendarTitle: 'Calendar & schedule',
    calendarSubtitle: 'Tickets, broadcasts, and shuttle links in one place',
    meetupTitle: 'Meetups & alerts',
    meetupSubtitle: 'See singer-related meetups and updates nearby',
    navHome: 'Home',
    navAlerts: 'Alerts',
    navSettings: 'Settings',
    languageButton: 'Language',
    aiHelpButton: 'AI help',
    singerHeader: 'Fan station',
    singerHero: 'Let’s prepare today’s support together',
    voteCardTitle: 'Vote links',
    voteCardText: 'A smooth flow from voting to certification and gratitude',
    voteButton: 'Vote now',
    authCardTitle: 'Vote certificate',
    authCardText: 'Leave a short thank-you note and certification',
    hallCardTitle: 'Hall of fame',
    hallCardText: 'Check this month’s fan milestones',
    quickTitle: 'Quick move',
    quickHome: 'Back home',
    quickAlerts: 'View alerts',
    quickSettings: 'Open settings',
    alertsTitle: 'Alerts',
    alertsHeadline: 'Check singer meetups and new updates',
    alert1: 'A local fan meetup starts at 7 PM today.',
    alert2: 'A new vote certificate was posted.',
    alert3: 'A shuttle link has been updated.',
    settingsTitle: 'My page',
    fontTitle: 'Font size',
    back: 'Back',
  },
  ja: {
    welcome: 'こんにちは 👋',
    headline: '今日も推しと一緒に応援しましょう',
    artistsTitle: '好きなアーティスト',
    addArtist: '+ アーティスト追加',
    emptyTitle: '好きなアーティストを追加しよう',
    emptyText: 'スケジュールと応援情報をすぐ確認できます。',
    emptyButton: '追加する',
    communityTitle: '投稿型コミュニティ',
    communitySubtitle: 'AIが不適切な内容を事前にフィルタリング',
    communityChip: 'AIフィルタリング適用',
    calendarTitle: 'カレンダー & スケジュール',
    calendarSubtitle: 'チケット・放送・シャトルリンクを一目で確認',
    meetupTitle: '近場の交流会 & お知らせ',
    meetupSubtitle: 'アーティスト関連の交流会や更新を確認',
    navHome: 'ホーム',
    navAlerts: '通知',
    navSettings: '設定',
    languageButton: '言語設定',
    aiHelpButton: 'AIヘルプ',
    singerHeader: 'ファンステーション',
    singerHero: '今日の応援を一緒に準備しよう',
    voteCardTitle: '投票リンク',
    voteCardText: '投票・認証・感謝メッセージまでつながる流れ',
    voteButton: '投票する',
    authCardTitle: '投票認証',
    authCardText: '感謝のメッセージと認証をすぐ残せます',
    hallCardTitle: '名誉の殿堂',
    hallCardText: '今月のファン記録を一目で確認',
    quickTitle: 'クイック移動',
    quickHome: 'ホームへ',
    quickAlerts: '通知を見る',
    quickSettings: '設定を開く',
    alertsTitle: '通知センター',
    alertsHeadline: 'アーティスト関連の交流会や更新を確認',
    alert1: '今日午後7時に地域ファン交流会があります。',
    alert2: '新しい投票認証が投稿されました。',
    alert3: 'シャトルリンクが更新されました。',
    settingsTitle: 'マイページ',
    fontTitle: '文字サイズ',
    back: '戻る',
  },
  'zh-CN': {
    welcome: '你好 👋',
    headline: '今天也和心爱的歌手一起加油',
    artistsTitle: '我喜欢的歌手',
    addArtist: '+ 添加歌手',
    emptyTitle: '添加你喜欢的歌手',
    emptyText: '可以马上查看日程和应援信息。',
    emptyButton: '添加歌手',
    communityTitle: '帖子型社区',
    communitySubtitle: 'AI 会先过滤敏感内容',
    communityChip: 'AI 过滤已开启',
    calendarTitle: '日历 & 日程',
    calendarSubtitle: '门票、播出和接驳链接一目了然',
    meetupTitle: '附近活动 & 通知',
    meetupSubtitle: '查看歌手相关活动和最新通知',
    navHome: '首页',
    navAlerts: '通知',
    navSettings: '设置',
    languageButton: '语言设置',
    aiHelpButton: 'AI 帮助',
    singerHeader: '粉丝站',
    singerHero: '一起为今天的应援做准备',
    voteCardTitle: '投票链接',
    voteCardText: '从投票到认证和感谢留言的完整流程',
    voteButton: '立即投票',
    authCardTitle: '投票认证',
    authCardText: '可以快速留下感谢留言和认证',
    hallCardTitle: '名人堂',
    hallCardText: '查看本月粉丝里程碑',
    quickTitle: '快速跳转',
    quickHome: '返回首页',
    quickAlerts: '查看通知',
    quickSettings: '打开设置',
    alertsTitle: '通知中心',
    alertsHeadline: '查看歌手相关活动和更新',
    alert1: '今天晚上7点有本地粉丝聚会。',
    alert2: '新投票认证已经发布。',
    alert3: '接驳链接已更新。',
    settingsTitle: '我的页面',
    fontTitle: '字体大小',
    back: '返回',
  },
}

const sizeMap = {
  small: '0.95rem',
  default: '1rem',
  large: '1.1rem',
}

const appZoomMap = {
  small: '0.95',
  default: '1',
  large: '1.1',
}

const initialEvents = [
  {
    id: 1,
    type: '봉사활동',
    title: '팬클럽 연탄 나눔 봉사활동',
    region: '경기도',
    location: '고양시 일산동구',
    distance: '800m',
    date: '8월 17일 오후 2시',
    desc: '지역 사회에 따뜻한 온정을 나누는 연탄 봉사활동입니다. 편안한 복장으로 오시면 됩니다.',
    booked: false,
  },
  {
    id: 2,
    type: '단체 응원',
    title: '음악방송 현장 단체 응원',
    region: '경기도',
    location: '파주시 문산읍',
    distance: '1.5km',
    date: '8월 20일 오전 11시',
    desc: '방송국 근처에 함께 모여 가수님의 1위를 기원하며 응원도구와 함께 응원합니다.',
    booked: false,
  },
  {
    id: 3,
    type: '행사 관람',
    title: '트롯 가요제 공동 관람',
    region: '경기도',
    location: '수원시 팔달구',
    distance: '2.8km',
    date: '8월 25일 오후 6시',
    desc: '가요제 단체 좌석에서 팬분들과 함께 모여 공연을 관람하는 모임입니다.',
    booked: false,
  },
  {
    id: 4,
    type: '생일 카페',
    title: '○○ 생일 기념 컵홀더 카페',
    region: '강원도',
    location: '춘천시 명동',
    distance: '65km',
    date: '8월 12일 오후 1시',
    desc: '춘천 명동 카페에서 진행되는 나눔 및 교류 모임입니다.',
    booked: true,
  },
  {
    id: 5,
    type: '봉사활동',
    title: '유기견 보호소 봉사활동',
    region: '충청남도',
    location: '천안시 동남구',
    distance: '85km',
    date: '8월 28일 오전 10시',
    desc: '유기견 보호소에서 일손을 돕고 따뜻한 사랑을 전하는 봉사활동입니다.',
    booked: false,
  },
  {
    id: 6,
    type: '단체 응원',
    title: '야외 콘서트 팬석 단체 응원',
    region: '전라북도',
    location: '전주시 완산구',
    distance: '190km',
    date: '9월 02일 오후 5시',
    desc: '야외 콘서트 현장에서 다 함께 응원전을 펼치는 모임입니다.',
    booked: false,
  },
  {
    id: 7,
    type: '행사 관람',
    title: '지역 콘서트 단체 관람',
    region: '경상남도',
    location: '창원시 성산구',
    distance: '280km',
    date: '9월 05일 오후 7시',
    desc: '경상 지역 팬분들과 함께 모여 공연을 관람합니다.',
    booked: false,
  },
  {
    id: 8,
    type: '행사 관람',
    title: '제주 트롯 페스티벌 모임',
    region: '제주도',
    location: '제주시 애월읍',
    distance: '450km',
    date: '9월 10일 오후 4시',
    desc: '제주 페스티벌 현장에서 팬분들과 함께 관람하는 모임입니다.',
    booked: false,
  },
]

const scheduleData = [
  {
    id: 1,
    date: '2026-08-10',
    type: '티켓 예매',
    title: '서울 콘서트 1차 티켓 오픈',
    desc: '오후 8시 인터파크 티켓 예매 시작',
  },
  {
    id: 2,
    date: '2026-08-14',
    type: '방송 출연',
    title: '음악방송 본방 사수',
    desc: '오후 5시 10분 KBS2 뮤직뱅크 출연',
  },
  {
    id: 3,
    date: '2026-08-18',
    type: '앨범 발매',
    title: '신규 미니앨범 음원 공개',
    desc: '정오 12시 전 음원 사이트 및 뮤직비디오 공개',
  },
  {
    id: 4,
    date: '2026-08-20',
    type: '방송 출연',
    title: '예능 프로그램 게스트 출연',
    desc: '오후 8시 50분 JTBC 아는 형님',
  },
  {
    id: 5,
    date: '2026-08-28',
    type: '콘서트',
    title: '2026 전국투어 콘서트 - 서울 1일차',
    desc: '오후 7시 30분 올림픽 체조경기장',
  },
  {
    id: 6,
    date: '2026-08-29',
    type: '콘서트',
    title: '2026 전국투어 콘서트 - 서울 2일차',
    desc: '오후 6시 올림픽 체조경기장',
  },
]

const scheduleCategories = ['전체', '티켓 예매', '방송 출연', '앨범 발매', '콘서트']

const busConcerts = [
  {
    id: 'seoul',
    city: '서울콘',
    title: '2026 전국투어 콘서트 - 서울',
    venue: '올림픽체조경기장',
    dates: [
      {
        id: 'seoul-0828',
        label: '8월 28일 금요일',
        time: '오후 7시 30분',
        routes: [
          {
            id: 'seoul-0828-gangnam',
            start: '서울 강남역',
            destination: '올림픽체조경기장',
            departure: '오후 4시 출발',
            organizer: '하늘빛 수도권 팬연합',
            seats: 37,
            capacity: 45,
            price: '18,000원',
            status: '모집중',
            stops: ['강남역 11번 출구', '잠실 종합운동장', '공연장 정문'],
          },
          {
            id: 'seoul-0828-suwon',
            start: '수원역',
            destination: '올림픽체조경기장',
            departure: '오후 3시 20분 출발',
            organizer: '경기 남부 응원단',
            seats: 28,
            capacity: 40,
            price: '22,000원',
            status: '입금확인중',
            stops: ['수원역 환승센터', '죽전 간이정류장', '공연장 정문'],
          },
        ],
      },
      {
        id: 'seoul-0829',
        label: '8월 29일 토요일',
        time: '오후 6시',
        routes: [
          {
            id: 'seoul-0829-incheon',
            start: '인천터미널',
            destination: '올림픽체조경기장',
            departure: '오후 2시 40분 출발',
            organizer: '인천 별빛 팬클럽',
            seats: 44,
            capacity: 44,
            price: '24,000원',
            status: '마감임박',
            stops: ['인천터미널', '부평역', '공연장 정문'],
          },
          {
            id: 'seoul-0829-cheonan',
            start: '천안터미널',
            destination: '올림픽체조경기장',
            departure: '오후 1시 30분 출발',
            organizer: '충청 팬연합',
            seats: 19,
            capacity: 40,
            price: '29,000원',
            status: '모집중',
            stops: ['천안터미널', '죽전 간이정류장', '공연장 정문'],
          },
        ],
      },
    ],
  },
  {
    id: 'busan',
    city: '부산콘',
    title: '2026 전국투어 콘서트 - 부산',
    venue: '부산 벡스코 오디토리움',
    dates: [
      {
        id: 'busan-0912',
        label: '9월 12일 토요일',
        time: '오후 6시',
        routes: [
          {
            id: 'busan-0912-daegu',
            start: '동대구역',
            destination: '부산 벡스코',
            departure: '오후 1시 출발',
            organizer: '영남 팬연합',
            seats: 31,
            capacity: 42,
            price: '26,000원',
            status: '모집중',
            stops: ['동대구역 3번 출구', '경산 정류장', '벡스코 제1전시장'],
          },
          {
            id: 'busan-0912-changwon',
            start: '창원중앙역',
            destination: '부산 벡스코',
            departure: '오후 2시 10분 출발',
            organizer: '경남 응원단',
            seats: 22,
            capacity: 36,
            price: '19,000원',
            status: '모집중',
            stops: ['창원중앙역', '김해시청역', '벡스코 제1전시장'],
          },
        ],
      },
      {
        id: 'busan-0913',
        label: '9월 13일 일요일',
        time: '오후 5시',
        routes: [
          {
            id: 'busan-0913-ulsan',
            start: '울산 시외버스터미널',
            destination: '부산 벡스코',
            departure: '오후 1시 40분 출발',
            organizer: '울산 하모니 팬클럽',
            seats: 18,
            capacity: 38,
            price: '17,000원',
            status: '모집중',
            stops: ['울산 시외버스터미널', '양산역', '벡스코 제1전시장'],
          },
        ],
      },
    ],
  },
  {
    id: 'gwangju',
    city: '광주콘',
    title: '2026 전국투어 콘서트 - 광주',
    venue: '광주여대 유니버시아드체육관',
    dates: [
      {
        id: 'gwangju-0926',
        label: '9월 26일 토요일',
        time: '오후 6시',
        routes: [
          {
            id: 'gwangju-0926-jeonju',
            start: '전주 월드컵경기장',
            destination: '광주여대 체육관',
            departure: '오후 1시 20분 출발',
            organizer: '호남 팬연합',
            seats: 25,
            capacity: 40,
            price: '23,000원',
            status: '모집중',
            stops: ['전주 월드컵경기장', '정읍 휴게소', '광주여대 정문'],
          },
        ],
      },
    ],
  },
]

function SingerCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1))
  const [selectedDateStr, setSelectedDateStr] = useState('2026-08-10')
  const [currentFilter, setCurrentFilter] = useState('전체')

  const changeMonth = (delta) => {
    setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() + delta, 1))
  }

  const getBadgeClass = (type) => {
    switch (type) {
      case '티켓 예매':
        return 'badge-ticket'
      case '방송 출연':
        return 'badge-broadcast'
      case '앨범 발매':
        return 'badge-album'
      case '콘서트':
        return 'badge-concert'
      default:
        return ''
    }
  }

  const getDotClass = (type) => {
    switch (type) {
      case '티켓 예매':
        return 'dot-ticket'
      case '방송 출연':
        return 'dot-broadcast'
      case '앨범 발매':
        return 'dot-album'
      case '콘서트':
        return 'dot-concert'
      default:
        return ''
    }
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()
  const daysHeader = ['일', '월', '화', '수', '목', '금', '토']
  const [selYear, selMonth, selDay] = selectedDateStr.split('-').map(Number)
  const selectedEvents = scheduleData.filter((event) => {
    const matchesDate = event.date === selectedDateStr
    const matchesFilter = currentFilter === '전체' || event.type === currentFilter
    return matchesDate && matchesFilter
  })

  return (
    <div className="singer-calendar">
      <div className="singer-calendar-header">
        <button type="button" className="calendar-nav-btn" onClick={() => changeMonth(-1)}>
          이전
        </button>
        <h2>{year}년 {month + 1}월</h2>
        <button type="button" className="calendar-nav-btn" onClick={() => changeMonth(1)}>
          다음
        </button>
      </div>

      <div className="calendar-filter-bar">
        {scheduleCategories.map((category) => (
          <button
            key={category}
            type="button"
            className={`calendar-filter-btn ${currentFilter === category ? 'active' : ''}`}
            onClick={() => setCurrentFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="singer-calendar-grid">
        {daysHeader.map((day, idx) => (
          <div
            key={day}
            className={`calendar-day-header ${idx === 0 ? 'sun' : idx === 6 ? 'sat' : ''}`}
          >
            {day}
          </div>
        ))}

        {Array.from({ length: firstDay }).map((_, index) => (
          <div key={`empty-${index}`} className="calendar-day-cell other-month" />
        ))}

        {Array.from({ length: lastDate }, (_, index) => index + 1).map((date) => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
          const dayOfWeek = new Date(year, month, date).getDay()
          let dayClass = ''

          if (dayOfWeek === 0) dayClass = 'sun'
          if (dayOfWeek === 6) dayClass = 'sat'
          if (dateStr === selectedDateStr) dayClass += ' selected'

          let dayEvents = scheduleData.filter((event) => event.date === dateStr)
          if (currentFilter !== '전체') {
            dayEvents = dayEvents.filter((event) => event.type === currentFilter)
          }

          return (
            <button
              key={dateStr}
              type="button"
              className={`calendar-day-cell ${dayClass}`}
              onClick={() => setSelectedDateStr(dateStr)}
            >
              <span className="calendar-day-number">{date}</span>
              {dayEvents.length > 0 && (
                <span className="calendar-event-dots">
                  {dayEvents.map((event) => (
                    <span key={event.id} className={`calendar-event-dot ${getDotClass(event.type)}`} />
                  ))}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="calendar-detail-section">
        <div className="calendar-detail-header">
          {selYear}년 {selMonth}월 {selDay}일 일정
        </div>
        {selectedEvents.length === 0 ? (
          <div className="calendar-no-event">등록된 일정이 없습니다.</div>
        ) : (
          selectedEvents.map((event) => (
            <div key={event.id} className="calendar-event-item">
              <span className={`calendar-type-badge ${getBadgeClass(event.type)}`}>
                {event.type}
              </span>
              <div className="calendar-event-title">{event.title}</div>
              <div className="calendar-event-desc">{event.desc}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function FeatureSlot({
  eyebrow,
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="feature-slot">
      <div className="panel-title-row">
        <p>{eyebrow}</p>
        <h3>{title}</h3>
      </div>
      <p>{description}</p>
      {actionLabel && onAction && (
        <button type="button" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}

function HeaderActions({ languageLabel, aiLabel, onLanguage, onAiHelp }) {
  return (
    <div className="header-actions">
      <button className="language-button" type="button" onClick={onLanguage}>
        {languageLabel}
      </button>
      <button className="ai-help-button" type="button" onClick={onAiHelp}>
        {aiLabel}
      </button>
    </div>
  )
}

function AiHelpPage({ onBack }) {
  return (
    <div className="app">
      <header className="top-header">
        <div>
          <p className="small-text">ASSISTANT</p>
          <h1>AI 도움</h1>
        </div>
        <button className="language-button" type="button" onClick={onBack}>
          뒤로가기
        </button>
      </header>

      <main className="page-content">
        <section className="welcome-section">
          <p>서비스 안내</p>
          <h2>팬 활동을 빠르게 찾도록 돕는 안내 영역</h2>
        </section>

        <section className="section">
          <div className="ai-help-panel">
            <article>
              <span>01</span>
              <h3>투표와 인증 안내</h3>
              <p>투표 링크 위치, 인증글 작성 흐름, 명예의 전당 반영 기준을 안내하는 영역입니다.</p>
            </article>
            <article>
              <span>02</span>
              <h3>스케줄과 모임 찾기</h3>
              <p>좋아하는 가수의 방송, 공연, 팬 모임 일정을 한눈에 확인하도록 돕습니다.</p>
            </article>
            <article>
              <span>03</span>
              <h3>커뮤니티 이용 도움</h3>
              <p>게시판 작성, 알림 확인, 팬 활동 기록 확인 방법을 정리해 두는 자리입니다.</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  )
}

function BusCharterSection({ singerName }) {
  const [concerts, setConcerts] = useState(busConcerts)
  const [selectedConcertId, setSelectedConcertId] = useState(busConcerts[0].id)
  const selectedConcert = concerts.find((concert) => concert.id === selectedConcertId) || concerts[0]
  const [selectedDateId, setSelectedDateId] = useState(selectedConcert.dates[0].id)
  const selectedDate = selectedConcert.dates.find((date) => date.id === selectedDateId) || selectedConcert.dates[0]
  const [selectedRouteId, setSelectedRouteId] = useState(selectedDate.routes[0].id)
  const selectedRoute = selectedDate.routes.find((route) => route.id === selectedRouteId) || selectedDate.routes[0]

  const selectConcert = (concertId) => {
    const nextConcert = concerts.find((concert) => concert.id === concertId) || concerts[0]
    const nextDate = nextConcert.dates[0]

    setSelectedConcertId(nextConcert.id)
    setSelectedDateId(nextDate.id)
    setSelectedRouteId(nextDate.routes[0].id)
  }

  const selectDate = (dateId) => {
    const nextDate = selectedConcert.dates.find((date) => date.id === dateId) || selectedConcert.dates[0]

    setSelectedDateId(nextDate.id)
    setSelectedRouteId(nextDate.routes[0].id)
  }

  const toggleReserve = (routeId) => {
    setConcerts((currentConcerts) =>
      currentConcerts.map((concert) => ({
        ...concert,
        dates: concert.dates.map((date) => ({
          ...date,
          routes: date.routes.map((route) => {
            if (route.id !== routeId) return route

            const reserved = !route.reserved
            window.alert(
              reserved
                ? `${concert.city} ${date.label}\n${route.start} 출발 버스 대절 신청이 임시 저장되었습니다.`
                : `${concert.city} ${date.label}\n${route.start} 출발 신청이 취소되었습니다.`,
            )
            return { ...route, reserved }
          }),
        })),
      })),
    )
  }

  return (
    <div className="bus-charter-panel">
      <div className="bus-hero">
        <p>BUS CHARTER</p>
        <h3>{singerName} 공연 버스 대절</h3>
        <span>전국투어 공연과 회차를 고른 뒤 출발지, 도착지, 경유지를 확인하고 신청해요.</span>
      </div>

      <div className="bus-step-block">
        <div className="bus-step-title">
          <span>STEP 1</span>
          <h4>공연 선택</h4>
        </div>
        <div className="bus-concert-grid">
          {concerts.map((concert) => (
            <button
              key={concert.id}
              type="button"
              className={`bus-concert-card ${selectedConcertId === concert.id ? 'active' : ''}`}
              onClick={() => selectConcert(concert.id)}
            >
              <strong>{concert.city}</strong>
              <span>{concert.venue}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bus-step-block">
        <div className="bus-step-title">
          <span>STEP 2</span>
          <h4>공연 일자 선택</h4>
        </div>
        <div className="bus-date-tabs">
          {selectedConcert.dates.map((date) => (
            <button
              key={date.id}
              type="button"
              className={selectedDateId === date.id ? 'active' : ''}
              onClick={() => selectDate(date.id)}
            >
              <strong>{date.label}</strong>
              <span>{date.time}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bus-step-block">
        <div className="bus-step-title">
          <span>STEP 3</span>
          <h4>출발 노선 선택</h4>
        </div>
        <div className="bus-route-list">
        {selectedDate.routes.map((route) => {
          const percent = Math.round((route.seats / route.capacity) * 100)

          return (
            <button
              key={route.id}
              type="button"
              className={`bus-route-card ${selectedRouteId === route.id ? 'active' : ''}`}
              onClick={() => setSelectedRouteId(route.id)}
            >
              <div>
                <span className="bus-status">{route.status}</span>
                <h4>{route.start} → {route.destination}</h4>
                <p>{route.departure}</p>
              </div>
              <div className="bus-seat-meter" aria-label={`좌석 ${route.seats}석 신청`}>
                <span style={{ width: `${percent}%` }} />
              </div>
              <small>{route.seats}/{route.capacity}석 신청</small>
            </button>
          )
        })}
        </div>
      </div>

      <div className="bus-detail-card">
        <div className="panel-title-row">
          <p>신청 정보 확인</p>
          <h3>{selectedConcert.title}</h3>
        </div>

        <div className="bus-detail-grid">
          <div>
            <p>공연 일자</p>
            <strong>{selectedDate.label} {selectedDate.time}</strong>
          </div>
          <div>
            <p>출발지</p>
            <strong>{selectedRoute.start}</strong>
          </div>
          <div>
            <p>도착지</p>
            <strong>{selectedRoute.destination}</strong>
          </div>
          <div>
            <p>출발 시간</p>
            <strong>{selectedRoute.departure}</strong>
          </div>
          <div>
            <p>회비</p>
            <strong>{selectedRoute.price}</strong>
          </div>
          <div>
            <p>주최</p>
            <strong>{selectedRoute.organizer}</strong>
          </div>
        </div>

        <div className="bus-stop-list">
          <p>출발지 · 경유지 · 도착지</p>
          {selectedRoute.stops.map((stop, index) => (
            <div key={stop}>
              <span>{index + 1}</span>
              <strong>{stop}</strong>
            </div>
          ))}
        </div>

        <button
          type="button"
          className={selectedRoute.reserved ? 'bus-reserve-button reserved' : 'bus-reserve-button'}
          onClick={() => toggleReserve(selectedRoute.id)}
        >
          {selectedRoute.reserved ? '신청 취소하기' : '버스 대절 신청하기'}
        </button>
      </div>
    </div>
  )
}

function MeetupFinderSection() {
  const [events, setEvents] = useState(initialEvents)
  const [currentView, setCurrentView] = useState('list')
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [activeTab, setActiveTab] = useState('nearby')
  const [selectedRegion, setSelectedRegion] = useState('전체')

  const goToDetail = (eventId) => {
    const item = events.find((event) => event.id === eventId)

    if (item) {
      localStorage.setItem('selectedEvent', JSON.stringify(item))
      setSelectedEventId(eventId)
      setCurrentView('detail')
    }
  }

  const goBack = () => {
    setCurrentView('list')
  }

  const toggleBook = (eventId) => {
    setEvents((prev) =>
      prev.map((item) => {
        if (item.id !== eventId) return item

        const nextBooked = !item.booked
        const updatedItem = { ...item, booked: nextBooked }

        if (selectedEventId === eventId) {
          localStorage.setItem('selectedEvent', JSON.stringify(updatedItem))
        }

        window.alert(nextBooked ? `[${item.title}]\n신청이 완료되었습니다.` : `[${item.title}]\n신청이 취소되었습니다.`)
        return updatedItem
      }),
    )
  }

  const nearbyEvents = events.filter((event) => parseFloat(event.distance) <= 3.0)
  const upcomingEvents = selectedRegion === '전체'
    ? events
    : events.filter((event) => event.region === selectedRegion)
  const selectedEvent = events.find((event) => event.id === selectedEventId)

  return (
    <div className="meetup-finder-panel">
      {currentView === 'list' ? (
        <>
          <div className="meetup-finder-header">
            <div>
              <p>모임찾기</p>
              <h4>가수 팬 활동 모임</h4>
            </div>
          </div>

          <div className="meetup-tab-nav">
            <button type="button" className={activeTab === 'nearby' ? 'active' : ''} onClick={() => setActiveTab('nearby')}>
              내 주변 모임
            </button>
            <button type="button" className={activeTab === 'upcoming' ? 'active' : ''} onClick={() => setActiveTab('upcoming')}>
              전체 모임 보기
            </button>
          </div>

          {activeTab === 'nearby' ? (
            <div className="meetup-section">
              <div className="meetup-info-box">
                <span>현재 위치: <strong>경기도 고양시</strong></span>
              </div>
              <div className="meetup-event-list">
                {nearbyEvents.map((item) => (
                  <div key={item.id} className="meetup-event-card">
                    <div className="meetup-badge-row">
                      <span className="meetup-tag">{item.type}</span>
                      <span className="meetup-distance">내 위치에서 {item.distance}</span>
                    </div>
                    <h5>{item.title}</h5>
                    <p>{item.location} · {item.date}</p>
                    <div className="meetup-actions">
                      <button type="button" onClick={() => goToDetail(item.id)}>내용 보기</button>
                      <button type="button" className={item.booked ? 'booked' : ''} onClick={() => toggleBook(item.id)}>
                        {item.booked ? '신청 완료' : '신청하기'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="meetup-section">
              <div className="meetup-info-box">
                <span>지역 선택:</span>
                <select value={selectedRegion} onChange={(event) => setSelectedRegion(event.target.value)}>
                  <option value="전체">전체 보기</option>
                  <option value="경기도">경기도</option>
                  <option value="강원도">강원도</option>
                  <option value="충청남도">충청남도</option>
                  <option value="전라북도">전라북도</option>
                  <option value="경상남도">경상남도</option>
                  <option value="제주도">제주도</option>
                </select>
              </div>
              <div className="meetup-event-list">
                {upcomingEvents.map((item) => (
                  <div key={item.id} className="meetup-event-card">
                    <div className="meetup-badge-row">
                      <span className="meetup-tag">{item.type}</span>
                      <span className="meetup-tag muted">{item.region}</span>
                    </div>
                    <h5>{item.title}</h5>
                    <p>{item.location} · {item.date}</p>
                    <div className="meetup-actions">
                      <button type="button" onClick={() => goToDetail(item.id)}>내용 보기</button>
                      <button type="button" className={item.booked ? 'booked' : ''} onClick={() => toggleBook(item.id)}>
                        {item.booked ? '신청 완료' : '신청하기'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : selectedEvent && (
        <div className="meetup-detail-card">
          <span className="meetup-type-badge">{selectedEvent.type}</span>
          <h4>{selectedEvent.title}</h4>
          <div className="meetup-detail-info">
            <div>
              <p>일시</p>
              <strong>{selectedEvent.date}</strong>
            </div>
            <div>
              <p>위치</p>
              <strong>{selectedEvent.region} {selectedEvent.location}</strong>
            </div>
            <div>
              <p>모임 소개</p>
              <span>{selectedEvent.desc}</span>
            </div>
          </div>
          <div className="meetup-actions full">
            <button type="button" onClick={goBack}>목록으로</button>
            <button type="button" className={selectedEvent.booked ? 'booked' : ''} onClick={() => toggleBook(selectedEvent.id)}>
              {selectedEvent.booked ? '신청 완료' : '신청하기'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* =================================================================
   게시판 세로 메뉴 및 개별 연동 컴포넌트
================================================================= */
function SingerBoardSection({ singer }) {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState('list')
  const [selectedPost, setSelectedPost] = useState(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mediaFile, setMediaFile] = useState(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  const fetchPosts = async (cat) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/posts?singerName=${encodeURIComponent(singer.name)}&category=${encodeURIComponent(cat)}`)
      const data = await res.json()
      if (data.success) {
        setPosts(data.posts)
      }
    } catch (err) {
      console.error('게시글 불러오기 실패:', err)
    } finally {
      setLoading(false)
    }
  }

  const openCategoryBoard = (cat) => {
    setSelectedCategory(cat)
    setView('list')
    fetchPosts(cat)
  }

  const backToCategoryMenu = () => {
    setSelectedCategory(null)
    setView('list')
    setPosts([])
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      window.alert('제목과 내용을 입력해주세요.')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)
    formData.append('category', selectedCategory)
    formData.append('singerName', singer.name)
    formData.append('singerId', singer.id)
    if (mediaFile) {
      formData.append('media', mediaFile)
    }

    try {
      const res = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.success) {
        window.alert(selectedCategory === '투표인증' ? '투표 인증 완료! 명예의 전당 점수에 반영되었습니다.' : '게시글이 등록되었습니다!')
        setTitle('')
        setContent('')
        setMediaFile(null)
        setView('list')
        fetchPosts(selectedCategory)
      }
    } catch (err) {
      console.error('글 작성 실패:', err)
    }
  }

  const handleLike = async (postId) => {
    try {
      const res = await fetch(`${API_URL}/api/posts/${postId}/like`, { method: 'PATCH' })
      const data = await res.json()
      if (data.success) {
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, likes: data.likes } : p))
        )
        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost((prev) => ({ ...prev, likes: data.likes }))
        }
      }
    } catch (err) {
      console.error('좋아요 실패:', err)
    }
  }

  if (!selectedCategory) {
    return (
      <div style={{ background: '#ffffff', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
        <h4 style={{ margin: '0 0 14px 0', fontSize: '1.1rem', color: '#0f172a', fontWeight: '800' }}>
          📌 {singer.name} 커뮤니티 게시판
        </h4>
        <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#64748b' }}>
          원하시는 게시판을 선택해 팬분들과 소통해 보세요!
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            onClick={() => openCategoryBoard('응원')}
            style={{
              padding: '16px',
              borderRadius: '12px',
              border: '2px solid #e2e8f0',
              background: '#f8fafc',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <strong style={{ fontSize: '1.05rem', color: '#0f172a', display: 'block' }}>📣 응원 게시판</strong>
              <small style={{ color: '#64748b', fontSize: '0.8rem' }}>가수님을 향한 따뜻한 한마디와 응원 메시지</small>
            </div>
            <span style={{ fontSize: '1.2rem', color: '#94a3b8' }}>›</span>
          </button>

          <button
            type="button"
            onClick={() => openCategoryBoard('자유')}
            style={{
              padding: '16px',
              borderRadius: '12px',
              border: '2px solid #e2e8f0',
              background: '#f8fafc',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <strong style={{ fontSize: '1.05rem', color: '#0f172a', display: 'block' }}>💬 자유 게시판</strong>
              <small style={{ color: '#64748b', fontSize: '0.8rem' }}>일상 소통, 굿즈 나눔 및 후기 이야기</small>
            </div>
            <span style={{ fontSize: '1.2rem', color: '#94a3b8' }}>›</span>
          </button>

          <button
            type="button"
            onClick={() => openCategoryBoard('투표인증')}
            style={{
              padding: '16px',
              borderRadius: '12px',
              border: '2px solid #ff2a6d',
              background: '#fff5f7',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <strong style={{ fontSize: '1.05rem', color: '#ff2a6d', display: 'block' }}>✅ 투표 인증 게시판</strong>
              <small style={{ color: '#e11d48', fontSize: '0.8rem' }}>투표 인증샷 올리고 명예의 전당 점수 쌓기!</small>
            </div>
            <span style={{ fontSize: '1.2rem', color: '#ff2a6d' }}>›</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#ffffff', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
      <button
        type="button"
        onClick={backToCategoryMenu}
        style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: 'bold', cursor: 'pointer', marginBottom: '12px', padding: 0 }}
      >
        ← 게시판 목록으로
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', fontWeight: 'bold' }}>
          {selectedCategory === '투표인증' ? '✅ 투표 인증' : selectedCategory === '응원' ? '📣 응원 게시판' : '💬 자유 게시판'}
        </h4>
        {view === 'list' && (
          <button
            type="button"
            onClick={() => setView('write')}
            style={{ background: '#ff2a6d', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            글쓰기
          </button>
        )}
      </div>

      {view === 'list' && (
        <div>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '20px 0' }}>게시글을 불러오는 중...</p>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748b' }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>등록된 글이 없습니다.</p>
              <small>첫 번째 소중한 글을 남겨보세요!</small>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {posts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => {
                    setSelectedPost(post)
                    setView('detail')
                  }}
                  style={{ padding: '14px', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#f8fafc', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#ff2a6d', fontWeight: 'bold' }}>[{post.category}]</span>
                    {post.mediaUrl && <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 'bold' }}>📷 사진/영상 있음</span>}
                  </div>
                  <h5 style={{ margin: '0 0 6px 0', fontSize: '1rem', color: '#0f172a', fontWeight: '800' }}>{post.title}</h5>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.content}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8' }}>
                    <span>익명 팬</span>
                    <span style={{ color: '#e11d48', fontWeight: 'bold' }}>❤️ {post.likes || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view === 'write' && (
        <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            required
          />
          <textarea
            placeholder={selectedCategory === '투표인증' ? '투표 완료 인증 소감과 메시지를 남겨주세요.' : '내용을 작성해주세요.'}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', minHeight: '110px', resize: 'none' }}
            required
          />

          <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px' }}>
            <label style={{ fontSize: '0.85rem', color: '#334155', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
              📷 사진 / 영상 파일 첨부 (선택)
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setMediaFile(e.target.files[0])}
              style={{ fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <button
              type="button"
              onClick={() => setView('list')}
              style={{ flex: 1, padding: '12px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              취소
            </button>
            <button
              type="submit"
              style={{ flex: 1, padding: '12px', background: '#ff2a6d', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              등록하기
            </button>
          </div>
        </form>
      )}

      {view === 'detail' && selectedPost && (
        <div>
          <button
            type="button"
            onClick={() => setView('list')}
            style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px', padding: 0 }}
          >
            ← 목록으로 돌아가기
          </button>
          <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#ffffff' }}>
            <span style={{ fontSize: '0.8rem', color: '#ff2a6d', fontWeight: 'bold' }}>[{selectedPost.category}]</span>
            <h4 style={{ margin: '6px 0 12px 0', fontSize: '1.15rem', color: '#0f172a', fontWeight: '800' }}>{selectedPost.title}</h4>
            <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{selectedPost.content}</p>

            {selectedPost.mediaUrl && (
              <div style={{ marginTop: '14px', borderRadius: '10px', overflow: 'hidden' }}>
                {selectedPost.mediaType === 'video' ? (
                  <video src={`${API_URL}${selectedPost.mediaUrl}`} controls style={{ width: '100%', maxHeight: '280px' }} />
                ) : (
                  <img src={`${API_URL}${selectedPost.mediaUrl}`} alt="첨부 미디어" style={{ width: '100%', maxHeight: '280px', objectFit: 'cover' }} />
                )}
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => handleLike(selectedPost.id)}
                style={{ background: '#ffe4e6', color: '#e11d48', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                ❤️ 좋아요 ({selectedPost.likes || 0})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* =================================================================
   명예의 전당 실시간 연동 컴포넌트
================================================================= */
function HallOfFameSection() {
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  const fetchRankings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/rankings`)
      const data = await res.json()
      if (data.success) {
        setRankings(data.rankings)
      }
    } catch (err) {
      console.error('랭킹 불러오기 실패:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRankings()
  }, [])

  const handleVote = async (id, name) => {
    try {
      const res = await fetch(`${API_URL}/api/rankings/${id}/vote`, { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        window.alert(data.message)
        fetchRankings()
      }
    } catch (err) {
      console.error('투표 실패:', err)
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px 0', color: '#64748b' }}>명예의 전당 데이터를 불러오는 중...</div>
  }

  return (
    <div className="schedule-list">
      {rankings.map((item) => (
        <article key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: '10px', background: '#ffffff' }}>
          <div className="schedule-date">
            <strong style={{ fontSize: '1.1rem', color: '#ff2a6d' }}>🏆 {item.rank}위</strong>
          </div>
          <div className="schedule-info" style={{ flex: 1, marginLeft: '14px' }}>
            <h3 style={{ margin: '0 0 2px 0', fontSize: '1.05rem', color: '#0f172a', fontWeight: '800' }}>{item.name}</h3>
            <div style={{ fontSize: '0.85rem', color: '#ff2a6d', fontWeight: 'bold' }}>
              총점 {item.score?.toLocaleString()}점
            </div>
            <small style={{ color: '#64748b', fontSize: '0.75rem' }}>
              투표 {item.votes || 0}표 | 인증글 {item.authCount || 0}개
            </small>
          </div>
          <button
            type="button"
            onClick={() => handleVote(item.id, item.name)}
            style={{ background: '#0f172a', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            투표하기
          </button>
        </article>
      ))}
    </div>
  )
}

function App() {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('trot-link-language')
    return savedLanguage || 'ko'
  })
  const [fontSize, setFontSize] = useState(() => {
    const savedFontSize = localStorage.getItem('trot-link-font-size')
    return savedFontSize || 'default'
  })
  const [favoriteSingers, setFavoriteSingers] = useState(() => {
    const savedSingers = localStorage.getItem('favoriteSingers')

    if (savedSingers) {
      try {
        return JSON.parse(savedSingers)
      } catch {
        return initialFavoriteSingers
      }
    }

    return initialFavoriteSingers
  })

  const [currentPage, setCurrentPage] = useState('home')
  const [previousPage, setPreviousPage] = useState('home')
  const [settingsInitialView, setSettingsInitialView] = useState('home')
  const [selectedSinger, setSelectedSinger] = useState(null)
  const [artistSubView, setArtistSubView] = useState('menu')
  const [artistDetailView, setArtistDetailView] = useState('board')

  useEffect(() => {
    localStorage.setItem(
      'favoriteSingers',
      JSON.stringify(favoriteSingers),
    )
  }, [favoriteSingers])

  useEffect(() => {
    localStorage.setItem('trot-link-language', language)
  }, [language])

  useEffect(() => {
    localStorage.setItem('trot-link-font-size', fontSize)
  }, [fontSize])

  useEffect(() => {
    const nextSize = sizeMap[fontSize] || sizeMap.default
    document.documentElement.style.fontSize = nextSize
    document.body.style.zoom = appZoomMap[fontSize] || appZoomMap.default
  }, [fontSize])

  const dict = translations[language] || translations.ko
  const fontStyle = {
    fontSize: sizeMap[fontSize] || sizeMap.default,
  }

  const addFavoriteSinger = () => {
    const inputName = window.prompt(
      '좋아하는 트로트 가수의 이름을 입력해 주세요.',
    )

    if (!inputName) return

    const singerName = inputName.trim()

    if (!singerName) {
      window.alert('가수 이름을 입력해 주세요.')
      return
    }

    const alreadyExists = favoriteSingers.some(
      (singer) => singer.name === singerName,
    )

    if (alreadyExists) {
      window.alert('이미 좋아하는 가수 목록에 있어요.')
      return
    }

    const colors = ['purple', 'pink', 'blue', 'orange']

    const newSinger = {
      id: Date.now(),
      name: singerName,
      initial: singerName.slice(0, 1),
      fanDays: 1,
      color: colors[favoriteSingers.length % colors.length],
      schedule: '등록된 일정이 없습니다.',
    }

    setFavoriteSingers((currentSingers) => [
      ...currentSingers,
      newSinger,
    ])
  }

  const deleteFavoriteSinger = (singerId, singerName) => {
    const shouldDelete = window.confirm(
      `${singerName} 가수를 좋아하는 가수 목록에서 삭제할까요?`,
    )

    if (!shouldDelete) return

    setFavoriteSingers((currentSingers) =>
      currentSingers.filter((singer) => singer.id !== singerId),
    )
  }

  const openSingerFandom = (singer) => {
    setSelectedSinger(singer)
    setArtistSubView('menu')
    setArtistDetailView('board')
    setCurrentPage('singer')
  }

  const openSettings = (initialView = 'home') => {
    setSettingsInitialView(initialView)
    setCurrentPage('settings')
  }

  const openLanguageSettings = () => {
    openSettings('language')
  }

  const openAiHelp = () => {
    setPreviousPage(currentPage)
    setCurrentPage('aiHelp')
  }

  const openAlerts = () => {
    setCurrentPage('alerts')
  }

  const goHome = () => {
    setSelectedSinger(null)
    setArtistSubView('menu')
    setArtistDetailView('board')
    setCurrentPage('home')
  }

  const goBackFromVote = () => {
    if (selectedSinger) {
      setCurrentPage('singer')
      return
    }

    goHome()
  }

  const openArtistDetail = (view) => {
    setArtistDetailView(view)
    setArtistSubView('detail')
  }

  const backToArtistMenu = () => {
    setArtistSubView('menu')
  }

  const backFromAiHelp = () => {
    setCurrentPage(previousPage === 'aiHelp' ? 'home' : previousPage)
  }

  if (currentPage === 'vote') {
    return (
      <VoteHubView
        language={language}
        setLanguage={setLanguage}
        fontSize={fontSize}
        setFontSize={setFontSize}
        onBack={goBackFromVote}
        onOpenAiHelp={openAiHelp}
        singerName={selectedSinger?.name || '윤하늘'}
      />
    )
  }

  if (currentPage === 'settings') {
    return (
      <VoteHubView
        language={language}
        setLanguage={setLanguage}
        fontSize={fontSize}
        setFontSize={setFontSize}
        onBack={selectedSinger ? () => setCurrentPage('singer') : goHome}
        onOpenAiHelp={openAiHelp}
        initialView={settingsInitialView}
        settingsOnly
      />
    )
  }

  if (currentPage === 'aiHelp') {
    return <AiHelpPage onBack={backFromAiHelp} />
  }

  if (currentPage === 'alerts') {
    return (
      <div className="app">
        <header className="top-header">
          <div>
            <p className="small-text">{dict.alertsTitle}</p>
            <h1>{dict.alertsTitle}</h1>
          </div>

          <HeaderActions
            languageLabel={dict.languageButton}
            aiLabel={dict.aiHelpButton}
            onLanguage={openLanguageSettings}
            onAiHelp={openAiHelp}
          />
        </header>

        <main className="page-content" style={fontStyle}>
          <section className="welcome-section">
            <p>{dict.alertsTitle}</p>
            <h2>{dict.alertsHeadline}</h2>
          </section>

          <section className="section">
            <div className="schedule-list">
              <article>
                <div className="schedule-date">
                  <strong>🔔</strong>
                  <span>알림</span>
                </div>
                <div className="schedule-info">
                  <span>오늘</span>
                  <h3>{dict.alert1}</h3>
                </div>
              </article>

              <article>
                <div className="schedule-date">
                  <strong>💜</strong>
                  <span>인증</span>
                </div>
                <div className="schedule-info">
                  <span>방금</span>
                  <h3>{dict.alert2}</h3>
                </div>
              </article>

              <article>
                <div className="schedule-date">
                  <strong>🚌</strong>
                  <span>링크</span>
                </div>
                <div className="schedule-info">
                  <span>업데이트</span>
                  <h3>{dict.alert3}</h3>
                </div>
              </article>
            </div>
          </section>
        </main>

        <nav className="bottom-navigation">
          <button type="button" onClick={goHome}>
            <span>🏠</span>
            {dict.navHome}
          </button>

          <button className="active" type="button" onClick={openAlerts}>
            <span>🔔</span>
            {dict.navAlerts}
          </button>

          <button type="button" onClick={() => openSettings()}>
            <span>⚙️</span>
            {dict.navSettings}
          </button>
        </nav>
      </div>
    )
  }

  if (currentPage === 'singer' && selectedSinger) {
    const artistTabs = [
      { key: 'board', icon: '📝', title: '게시판', desc: '팬 소식과 공지를 확인해요' },
      { key: 'schedule', icon: '📅', title: '스케줄', desc: '다가오는 일정과 달력을 보여줘요' },
      { key: 'vote', icon: '💜', title: '투표', desc: '오늘의 투표와 발자취를 확인해요' },
      { key: 'bus', icon: '🚌', title: '버스대절', desc: '공연장 이동 노선과 좌석을 확인해요' },
      { key: 'meetup', icon: '📍', title: '모임찾기', desc: '내 주변 팬 활동 모임을 찾아요' },
    ]
    const activeArtistTab = artistTabs.find((tab) => tab.key === artistDetailView)

    return (
      <div className="app">
        <header className="top-header">
          <div>
            <p className="small-text">
              {artistSubView === 'menu' ? dict.singerHeader : selectedSinger.name}
            </p>
            <h1>{artistSubView === 'menu' ? selectedSinger.name : activeArtistTab?.title}</h1>
          </div>

          <HeaderActions
            languageLabel={dict.languageButton}
            aiLabel={dict.aiHelpButton}
            onLanguage={openLanguageSettings}
            onAiHelp={openAiHelp}
          />
        </header>

        <main className="page-content" style={fontStyle}>
          {artistSubView === 'menu' ? (
            <>
              <section className="welcome-section">
                <p>{dict.singerHeader}</p>
                <h2>{selectedSinger.name} 팬덤 공간</h2>
              </section>

              <section className="section">
                <div className="artist-tab-grid">
                  {artistTabs.map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      className="artist-tab"
                      onClick={() => openArtistDetail(tab.key)}
                    >
                      <span>{tab.icon}</span>
                      <strong>{tab.title}</strong>
                      <small>{tab.desc}</small>
                    </button>
                  ))}
                </div>
              </section>

              <section className="section">
                <div className="notice-card">
                  <p>내 주변 모임 알림</p>
                  <h3>{selectedSinger.name} 팬 모임이 오늘 7시에 열려요.</h3>
                  <small>버스대절, 인증글, 실시간 공지까지 한 번에 확인해 보세요.</small>
                </div>
              </section>
            </>
          ) : (
            <>
              <section className="artist-detail-toolbar">
                <button type="button" onClick={backToArtistMenu}>
                  ← {selectedSinger.name} 메뉴로
                </button>
              </section>

              <section className="section">
                {artistDetailView === 'board' && (
                  <div className="singer-panel">
                    <SingerBoardSection singer={selectedSinger} />
                  </div>
                )}

                {artistDetailView === 'schedule' && (
                  <div className="singer-panel">
                    <div className="panel-title-row">
                      <p>스케줄</p>
                      <h3>다가오는 일정</h3>
                    </div>
                    <SingerCalendar />
                  </div>
                )}

                {artistDetailView === 'vote' && (
                  <div className="singer-panel">
                    <FeatureSlot
                      eyebrow="투표"
                      title={`${selectedSinger.name} 투표 기능 연결 영역`}
                      description="투표 완료 콜백에서 감사 인사 영상이나 인증 화면으로 이어지게 만들 수 있습니다."
                      actionLabel="현재 임시 투표 화면 보기"
                      onAction={() => setCurrentPage('vote')}
                    />
                  </div>
                )}

                {artistDetailView === 'bus' && (
                  <div className="singer-panel">
                    <BusCharterSection singerName={selectedSinger.name} />
                  </div>
                )}

                {artistDetailView === 'meetup' && <MeetupFinderSection />}
              </section>
            </>
          )}
        </main>

        <nav className="bottom-navigation">
          <button type="button" onClick={goHome}>
            <span>🏠</span>
            {dict.navHome}
          </button>

          <button type="button" onClick={openAlerts}>
            <span>🔔</span>
            {dict.navAlerts}
          </button>

          <button className="active" type="button" onClick={() => openSettings()}>
            <span>⚙️</span>
            {dict.navSettings}
          </button>
        </nav>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="top-header">
        <div>
          <p className="small-text">TROT LINK</p>
          <h1>TROT LINK</h1>
        </div>

        <HeaderActions
          languageLabel={dict.languageButton}
          aiLabel={dict.aiHelpButton}
          onLanguage={openLanguageSettings}
          onAiHelp={openAiHelp}
        />
      </header>

      <main className="page-content" style={fontStyle}>
        <section className="welcome-section">
          <p>{dict.welcome}</p>
          <h2>{dict.headline}</h2>
        </section>

        <section className="section">
          <div className="section-heading">
            <div>
              <p>MY ARTISTS</p>
              <h2>{dict.artistsTitle}</h2>
            </div>

            <button className="text-button" type="button" onClick={addFavoriteSinger}>
              {dict.addArtist}
            </button>
          </div>

          <div className="artist-list">
            {favoriteSingers.length === 0 ? (
              <div className="empty-artists">
                <span>⭐</span>
                <h3>{dict.emptyTitle}</h3>
                <p>{dict.emptyText}</p>
                <button type="button" onClick={addFavoriteSinger}>
                  {dict.emptyButton}
                </button>
              </div>
            ) : (
              favoriteSingers.map((singer) => (
                <article key={singer.id} className={`artist-card ${singer.color}`}>
                  <button className="artist-card-main" type="button" onClick={() => openSingerFandom(singer)}>
                    <div className="singer-avatar">{singer.initial}</div>

                    <div className="artist-card-content">
                      <p>함께한 지 {singer.fanDays}일</p>
                      <h3>{singer.name}</h3>
                      <span>{singer.schedule}</span>
                    </div>

                    <div className="arrow">›</div>
                  </button>

                  <button className="delete-artist-button" type="button" onClick={() => deleteFavoriteSinger(singer.id, singer.name)}>
                    ×
                  </button>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div>
              <p>HALL OF FAME</p>
              <h2>명예의 전당</h2>
            </div>
          </div>

          <HallOfFameSection />
        </section>
      </main>

      <nav className="bottom-navigation">
        <button className="active" type="button" onClick={goHome}>
          <span>🏠</span>
          {dict.navHome}
        </button>

        <button type="button" onClick={openAlerts}>
          <span>🔔</span>
          {dict.navAlerts}
        </button>

        <button type="button" onClick={() => openSettings()}>
          <span>⚙️</span>
          {dict.navSettings}
        </button>
      </nav>
    </div>
  )
}

export default App