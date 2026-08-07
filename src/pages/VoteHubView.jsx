import { useMemo, useState, useEffect } from 'react'

const translations = {
  ko: {
    back: '← 뒤로가기',
    title: '오늘의 응원',
    subtitle: '투표 링크, 인증, 감사 멘트를 한 번에',
    voteButton: '투표하러 가기',
    thanksTitle: '🎉 감사합니다!',
    thanksText: '당신의 한 표가 우리 가수에게 힘이 되었어요 💜',
    thanksClipBadge: '감사 인사 도착',
    thanksClipTitle: '투표해줘서 정말 고마워요!',
    thanksClipText: '오늘도 큰 힘을 받았어요. 곧 무대에서 만나요.',
    thanksClipClose: '닫기',
    certifyButton: '투표 인증 남기기',
    hallTitle: '🏆 트롯 명예의 전당',
    hallSubtitle: '이번 달 앱 내 팬덤 활동량과 투표로 보는 인기 순위',
    hallScoreLabel: '활동점수',
    hallVoteLabel: '투표',
    hallFanLabel: '팬덤 활동',
    hallBottom: '투표, 인증글, 모임 참여를 합산한 앱 내 랭킹이에요.',
    languageTitle: '언어 설정',
    fontTitle: '글자 크기',
    myPageTitle: '마이페이지',
    myPageSubtitle: '로그인 기능 없이도 개인정보와 팬 활동을 확인할 수 있는 자리입니다.',
    profileLabel: '개인정보',
    profileText: '닉네임, 선호 언어, 관심 가수 정보가 표시될 영역',
    activityLabel: '팬 활동 기록',
    activityText: '투표 인증, 모임 참여, 즐겨찾는 가수 변경 기록이 모이는 영역',
    noticeLabel: '알림 설정',
    noticeText: '공연, 방송, 팬 모임 알림을 관리하는 영역',
    certifyTitle: '투표 인증글 작성',
    certifyPlaceholder: '인증글 제목을 입력해 주세요',
    certifyContent: '감사 멘트를 남겨 주세요',
    certifySubmit: '인증글 등록',
    certifyDone: '인증글이 등록되었습니다. 팬덤 기록 및 명예의 전당에 반영됩니다.',
    openHall: '명예의 전당 보기',
    openLanguage: '언어 설정',
    openFont: '글자 크기',
    openAI: 'AI 도움',
    openVote: '투표 링크 모음',
  },
  en: {
    back: '← Back',
    title: 'Today’s support',
    subtitle: 'Vote links, certification, and gratitude in one place',
    voteButton: 'Vote now',
    thanksTitle: '🎉 Thank you!',
    thanksText: 'Your vote gave strength to our artist 💜',
    thanksClipBadge: 'Message arrived',
    thanksClipTitle: 'Thank you so much for voting!',
    thanksClipText: 'Your support means a lot. See you on stage soon.',
    thanksClipClose: 'Close',
    certifyButton: 'Leave a vote certificate',
    hallTitle: '🏆 Trot hall of fame',
    hallSubtitle: 'Monthly popularity ranking from in-app votes and fandom activity',
    hallScoreLabel: 'Score',
    hallVoteLabel: 'Votes',
    hallFanLabel: 'Activity',
    hallBottom: 'Rankings combine votes, certificates, and meetup activity.',
    languageTitle: 'Language settings',
    fontTitle: 'Font size',
    myPageTitle: 'My page',
    myPageSubtitle: 'A placeholder for profile and fan activity without login.',
    profileLabel: 'Personal info',
    profileText: 'Nickname, preferred language, and favorite artists will appear here.',
    activityLabel: 'Fan activity',
    activityText: 'Vote certificates, meetups, and favorite artist changes will collect here.',
    noticeLabel: 'Notification settings',
    noticeText: 'Manage concert, broadcast, and fan meetup alerts here.',
    certifyTitle: 'Write a vote certificate',
    certifyPlaceholder: 'Enter a title',
    certifyContent: 'Leave a thank-you note',
    certifySubmit: 'Post certificate',
    certifyDone: 'Your certificate has been posted.',
    openHall: 'Open hall of fame',
    openLanguage: 'Language settings',
    openFont: 'Font size',
    openAI: 'AI help',
    openVote: 'Open vote links',
  },
  ja: {
    back: '← 戻る',
    title: '今日の応援',
    subtitle: '投票リンク・認証・感謝メッセージをまとめて',
    voteButton: '投票する',
    thanksTitle: '🎉 ありがとうございます!',
    thanksText: 'あなたの一票が私たちの歌手に力になりました 💜',
    thanksClipBadge: '感謝メッセージ到着',
    thanksClipTitle: '投票してくれて本当にありがとう!',
    thanksClipText: '今日も大きな力をもらいました。ステージで会いましょう。',
    thanksClipClose: '閉じる',
    certifyButton: '投票認証を残す',
    hallTitle: '🏆 トロット名誉の殿堂',
    hallSubtitle: 'アプリ内投票とファンダム活動で見る今月の人気ランキング',
    hallScoreLabel: '活動スコア',
    hallVoteLabel: '投票',
    hallFanLabel: 'ファン活動',
    hallBottom: '投票・認証・交流会参加を合算したアプリ内ランキングです。',
    languageTitle: '言語設定',
    fontTitle: '文字サイズ',
    myPageTitle: 'マイページ',
    myPageSubtitle: 'ログインなしでプロフィールとファン活動を確認する領域です。',
    profileLabel: '個人情報',
    profileText: 'ニックネーム、言語、好きな歌手を表示する領域',
    activityLabel: 'ファン活動記録',
    activityText: '投票認証、交流会参加、好きな歌手の変更履歴を集める領域',
    noticeLabel: '通知設定',
    noticeText: '公演、放送、ファン交流会の通知を管理する領域',
    certifyTitle: '投票認証を書く',
    certifyPlaceholder: 'タイトルを入力してください',
    certifyContent: '感謝メッセージを残してください',
    certifySubmit: '認証を投稿',
    certifyDone: '認証が登録されました。',
    openHall: '名誉の殿堂を見る',
    openLanguage: '言語設定',
    openFont: '文字サイズ',
    openAI: 'AIヘルプ',
    openVote: '投票リンクを見る',
  },
  'zh-CN': {
    back: '← 返回',
    title: '今日的应援',
    subtitle: '把投票链接、认证和感谢留言放在一起',
    voteButton: '立即投票',
    thanksTitle: '🎉 感谢您!',
    thanksText: '您的投票为我们喜爱的歌手注入了力量 💜',
    thanksClipBadge: '感谢消息已送达',
    thanksClipTitle: '真的很感谢你的投票!',
    thanksClipText: '你的支持给了我很大的力量。舞台上见。',
    thanksClipClose: '关闭',
    certifyButton: '留下投票认证',
    hallTitle: '🏆 Trot 名人堂',
    hallSubtitle: '根据应用内投票和粉丝活动统计的本月人气排行',
    hallScoreLabel: '活动分',
    hallVoteLabel: '投票',
    hallFanLabel: '粉丝活动',
    hallBottom: '排行综合投票、认证和线下活动参与数据。',
    languageTitle: '语言设置',
    fontTitle: '语言设置',
    myPageTitle: '我的页面',
    myPageSubtitle: '无需登录，也可以展示个人资料和粉丝活动的位置。',
    profileLabel: '个人信息',
    profileText: '昵称、偏好语言和关注歌手将显示在这里。',
    activityLabel: '粉丝活动记录',
    activityText: '投票认证、聚会参与、关注歌手变更记录会汇总在这里。',
    noticeLabel: '通知设置',
    noticeText: '管理演出、 방송、粉丝聚会提醒的位置。',
    certifyTitle: '写下投票认证',
    certifyPlaceholder: '请输入标题',
    certifyContent: '留下感谢留言',
    certifySubmit: '发布认证',
    certifyDone: '认证已发布。',
    openHall: '查看名人堂',
    openLanguage: '语言设置',
    openFont: '字体大小',
    openAI: 'AI 帮助',
    openVote: '查看投票链接',
  },
}

const sizeMap = {
  small: '0.95rem',
  default: '1rem',
  large: '1.1rem',
}

const sizeLabels = {
  small: '작게',
  default: '중간',
  large: '크게',
}

export default function VoteHubView({
  language,
  setLanguage,
  fontSize,
  setFontSize,
  onBack,
  onOpenAiHelp,
  settingsOnly = false,
  singerName = '우리 가수',
}) {
  const [view, setView] = useState('home')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [posted, setPosted] = useState(false)
  const [showThanksClip, setShowThanksClip] = useState(false)

  // 백엔드 실시간 랭킹 데이터 상태
  const [backendRankings, setBackendRankings] = useState([])
  const [loadingRankings, setLoadingRankings] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  // 백엔드에서 실시간 명예의 전당 랭킹 가져오기
  const fetchRankings = async () => {
    setLoadingRankings(true)
    try {
      const res = await fetch(`${API_URL}/api/rankings`)
      const data = await res.json()
      if (data.success) {
        setBackendRankings(data.rankings)
      }
    } catch (err) {
      console.error('명예의 전당 불러오기 에러:', err)
    } finally {
      setLoadingRankings(false)
    }
  }

  useEffect(() => {
    if (view === 'hall') {
      fetchRankings()
    }
  }, [view])

  const dict = useMemo(() => translations[language] || translations.ko, [language])
  const wrapperStyle = {
    minHeight: '100vh',
    padding: '20px 18px 90px',
    background: '#f7f2fb',
    color: '#2f2432',
    fontSize: sizeMap[fontSize] || sizeMap.default,
  }

  // 백엔드로 투표 인증글 등록하는 핵심 함수 (게시판의 '투표인증'으로 전송 + 명예의 전당 점수 상승)
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      window.alert('제목과 내용을 모두 입력해 주세요.')
      return
    }

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      formData.append('category', '투표인증')
      formData.append('singerName', singerName)
      formData.append('singerId', '1')

      const res = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (data.success) {
        setPosted(true)
        window.alert(dict.certifyDone)
        setTitle('')
        setContent('')
        setView('home')
      } else {
        window.alert('인증글 등록 실패: ' + (data.message || '오류가 발생했습니다.'))
      }
    } catch (err) {
      console.error('투표 인증 처리 중 에러:', err)
      window.alert('서버 연동 중 오류가 발생했습니다.')
    }
  }

  // 백엔드로 직접 투표수 카운트 증가시키는 함수
  const completeVote = async () => {
    setView('thanks')
    setShowThanksClip(true)

    try {
      // 명예의 전당 백엔드에 1표 추가 요청
      const rankingsSnapshot = await fetch(`${API_URL}/api/rankings`)
      const rankingData = await rankingsSnapshot.json()
      if (rankingData.success && rankingData.rankings.length > 0) {
        const targetSinger = rankingData.rankings.find((r) => r.name === singerName) || rankingData.rankings[0]
        await fetch(`${API_URL}/api/rankings/${targetSinger.id}/vote`, { method: 'POST' })
      }
    } catch (err) {
      console.error('투표 카운트 증가 실패:', err)
    }
  }

  if (settingsOnly) {
    return (
      <div style={wrapperStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <button type="button" onClick={onBack} style={{ border: 'none', background: 'transparent', color: '#6d3ba2', fontWeight: '700', cursor: 'pointer' }}>
            {dict.back}
          </button>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setView('language')} style={{ border: '1px solid #e3d7ef', borderRadius: '999px', padding: '7px 10px', background: 'white', cursor: 'pointer' }}>
              {dict.openLanguage}
            </button>
            <button type="button" onClick={onOpenAiHelp} style={{ border: 'none', borderRadius: '999px', padding: '7px 12px', background: '#6d3ba2', color: 'white', cursor: 'pointer', fontWeight: '800' }}>
              {dict.openAI}
            </button>
          </div>
        </div>

        {view !== 'language' && (
          <div style={{ padding: '20px', borderRadius: '24px', background: 'white', boxShadow: '0 12px 30px rgba(92, 46, 138, 0.08)', marginBottom: '14px' }}>
            <p style={{ margin: '0 0 8px', color: '#8c5eb6', fontSize: '12px', fontWeight: '800' }}>MY PAGE</p>
            <h3 style={{ margin: '0 0 8px', fontSize: '24px' }}>{dict.myPageTitle}</h3>
            <p style={{ margin: 0, color: '#6f6472', lineHeight: 1.6 }}>{dict.myPageSubtitle}</p>
          </div>
        )}

        {view !== 'language' && (
          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              [dict.profileLabel, dict.profileText],
              [dict.activityLabel, dict.activityText],
              [dict.noticeLabel, dict.noticeText],
            ].map(([title, text]) => (
              <article key={title} style={{ padding: '16px', borderRadius: '18px', background: 'white', border: '1px solid #eadff2' }}>
                <strong style={{ display: 'block', marginBottom: '6px', color: '#4b2b62' }}>{title}</strong>
                <p style={{ margin: 0, color: '#716677', lineHeight: 1.5 }}>{text}</p>
              </article>
            ))}
          </div>
        )}

        {view === 'language' && (
          <div style={{ padding: '20px', borderRadius: '24px', background: 'white', boxShadow: '0 12px 30px rgba(92, 46, 138, 0.08)' }}>
            <h3 style={{ marginTop: 0 }}>{dict.languageTitle}</h3>
            <div style={{ display: 'grid', gap: '10px', marginBottom: '16px' }}>
              {['ko', 'en', 'ja', 'zh-CN'].map((value) => (
                <button key={value} type="button" onClick={() => setLanguage(value)} style={{ border: language === value ? '1px solid #6d3ba2' : '1px solid #e3d7ef', borderRadius: '12px', padding: '12px', background: language === value ? '#f4e7ff' : 'white', cursor: 'pointer', textAlign: 'left', fontWeight: language === value ? '700' : '500' }}>
                  {value === 'ko' ? '한국어' : value === 'en' ? 'English' : value === 'ja' ? '日本語' : '中文'}
                </button>
              ))}
            </div>

            <h3 style={{ marginTop: 0 }}>{dict.fontTitle}</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {['small', 'default', 'large'].map((value) => (
                <button key={value} type="button" onClick={() => setFontSize(value)} style={{ border: fontSize === value ? '1px solid #6d3ba2' : '1px solid #e3d7ef', borderRadius: '999px', padding: '10px 14px', background: fontSize === value ? '#f4e7ff' : 'white', cursor: 'pointer', fontWeight: '700' }}>
                  {sizeLabels[value]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={wrapperStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <button type="button" onClick={onBack} style={{ border: 'none', background: 'transparent', color: '#6d3ba2', fontWeight: '700', cursor: 'pointer' }}>
          {dict.back}
        </button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" onClick={() => setView('language')} style={{ border: '1px solid #e3d7ef', borderRadius: '999px', padding: '7px 10px', background: 'white', cursor: 'pointer' }}>
            {dict.openLanguage}
          </button>
          <button type="button" onClick={onOpenAiHelp} style={{ border: 'none', borderRadius: '999px', padding: '7px 12px', background: '#6d3ba2', color: 'white', cursor: 'pointer', fontWeight: '800' }}>
            {dict.openAI}
          </button>
        </div>
      </div>

      {view === 'home' && (
        <>
          <div style={{ marginBottom: '16px', padding: '20px', borderRadius: '24px', background: 'linear-gradient(135deg, #7a3fb3, #b65fc1)', color: 'white', boxShadow: '0 12px 30px rgba(92, 46, 138, 0.2)' }}>
            <p style={{ margin: '0 0 8px', fontSize: '12px', opacity: 0.9 }}>FAN SUPPORT</p>
            <h2 style={{ margin: '0 0 8px', fontSize: '24px' }}>{dict.title}</h2>
            <p style={{ margin: '0 0 12px', fontSize: '15px', lineHeight: 1.5, opacity: 0.95 }}>{dict.subtitle}</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button type="button" onClick={completeVote} style={{ border: 'none', borderRadius: '999px', padding: '10px 16px', background: '#ffffff', color: '#6d2d9f', fontWeight: '700', cursor: 'pointer' }}>
                {dict.voteButton}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
            <button type="button" onClick={() => setView('hall')} style={{ border: '1px solid #e7d9f2', borderRadius: '18px', padding: '16px', background: 'white', textAlign: 'left', cursor: 'pointer' }}>
              <div style={{ fontSize: '11px', color: '#8c5eb6', fontWeight: '800', marginBottom: '6px' }}>HALL OF FAME</div>
              <div style={{ fontSize: '18px', fontWeight: '700' }}>{dict.hallTitle}</div>
            </button>
          </div>
        </>
      )}

      {view === 'thanks' && (
        <div style={{ padding: '20px', borderRadius: '24px', background: 'white', boxShadow: '0 12px 30px rgba(92, 46, 138, 0.08)' }}>
          <div style={{ display: 'inline-block', padding: '8px 12px', borderRadius: '999px', background: '#f2e6ff', color: '#6d3ba2', fontSize: '12px', fontWeight: '800', marginBottom: '12px' }}>투표 완료</div>
          <h3 style={{ margin: '0 0 8px', fontSize: '22px' }}>{dict.thanksTitle}</h3>
          <p style={{ margin: '0 0 14px', fontSize: '15px', lineHeight: 1.6 }}>{dict.thanksText}</p>
          <button type="button" onClick={() => setView('certify')} style={{ width: '100%', border: 'none', borderRadius: '14px', padding: '12px 14px', background: '#6d3ba2', color: 'white', fontWeight: '700', cursor: 'pointer' }}>
            {dict.certifyButton}
          </button>
        </div>
      )}

      {view === 'certify' && (
        <div style={{ padding: '20px', borderRadius: '24px', background: 'white', boxShadow: '0 12px 30px rgba(92, 46, 138, 0.08)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '8px' }}>{dict.certifyTitle}</h3>
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={dict.certifyPlaceholder} style={{ width: '100%', border: '1px solid #e3d7ef', borderRadius: '12px', padding: '11px 12px', marginBottom: '10px', boxSizing: 'border-box' }} />
          <textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder={dict.certifyContent} rows={4} style={{ width: '100%', border: '1px solid #e3d7ef', borderRadius: '12px', padding: '11px 12px', marginBottom: '12px', boxSizing: 'border-box', resize: 'vertical' }} />
          <button type="button" onClick={handleSubmit} style={{ width: '100%', border: 'none', borderRadius: '14px', padding: '12px 14px', background: '#6d3ba2', color: 'white', fontWeight: '700', cursor: 'pointer' }}>
            {dict.certifySubmit}
          </button>
          {posted && <p style={{ marginTop: '10px', color: '#6d3ba2' }}>{dict.certifyDone}</p>}
        </div>
      )}

      {/* 실시간 백엔드 연동 명예의 전당 */}
      {view === 'hall' && (
        <div style={{ padding: '20px', borderRadius: '24px', background: 'white', boxShadow: '0 12px 30px rgba(92, 46, 138, 0.08)' }}>
          <h3 style={{ margin: '0 0 6px' }}>{dict.hallTitle}</h3>
          <p style={{ margin: '0 0 14px', color: '#6f6472', fontSize: '13px', lineHeight: 1.5 }}>
            {dict.hallSubtitle}
          </p>

          {loadingRankings ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#8c5eb6' }}>명예의 전당 데이터를 불러오는 중...</div>
          ) : backendRankings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#8c5eb6' }}>등록된 랭킹 정보가 없습니다.</div>
          ) : (
            <div style={{ display: 'grid', gap: '10px', marginBottom: '12px' }}>
              {backendRankings.map((artist) => (
                <div
                  key={artist.id || artist.name}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '42px 1fr auto',
                    gap: '10px',
                    alignItems: 'center',
                    padding: '12px',
                    border: artist.name === singerName ? '2px solid #6d3ba2' : '1px solid #eee2f3',
                    borderRadius: '16px',
                    background: artist.rank <= 3 ? '#fbf6ff' : '#ffffff',
                  }}
                >
                  <div style={{ display: 'flex', width: '38px', height: '38px', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#6d3ba2', color: 'white', fontWeight: '900' }}>
                    {artist.rank}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <strong style={{ display: 'block', marginBottom: '4px', color: '#2f2432' }}>{artist.name}</strong>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', color: '#7b6987', fontSize: '11px' }}>
                      <span>{dict.hallVoteLabel} {artist.votes || 0}</span>
                      <span>인증 {artist.authCount || 0}건</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ display: 'block', color: '#6d3ba2', fontSize: '16px' }}>{Number(artist.score || 0).toLocaleString()}점</strong>
                    <span style={{ color: '#15803d', fontSize: '11px', fontWeight: '800' }}>
                      {artist.trend || 'UP'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p style={{ margin: 0, color: '#6b6171', lineHeight: 1.6 }}>{dict.hallBottom}</p>
        </div>
      )}

      {view === 'language' && (
        <div style={{ padding: '20px', borderRadius: '24px', background: 'white', boxShadow: '0 12px 30px rgba(92, 46, 138, 0.08)' }}>
          <h3 style={{ marginTop: 0 }}>{dict.languageTitle}</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {['ko', 'en', 'ja', 'zh-CN'].map((value) => (
              <button key={value} type="button" onClick={() => setLanguage(value)} style={{ border: language === value ? '1px solid #6d3ba2' : '1px solid #e3d7ef', borderRadius: '12px', padding: '12px', background: language === value ? '#f4e7ff' : 'white', cursor: 'pointer', textAlign: 'left', fontWeight: language === value ? '700' : '500' }}>
                {value === 'ko' ? '한국어' : value === 'en' ? 'English' : value === 'ja' ? '日本語' : '中文'}
              </button>
            ))}
          </div>
        </div>
      )}

      {view === 'font' && (
        <div style={{ padding: '20px', borderRadius: '24px', background: 'white', boxShadow: '0 12px 30px rgba(92, 46, 138, 0.08)' }}>
          <h3 style={{ marginTop: 0 }}>{dict.fontTitle}</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['small', 'default', 'large'].map((value) => (
              <button key={value} type="button" onClick={() => setFontSize(value)} style={{ border: fontSize === value ? '1px solid #6d3ba2' : '1px solid #e3d7ef', borderRadius: '999px', padding: '10px 14px', background: fontSize === value ? '#f4e7ff' : 'white', cursor: 'pointer', fontWeight: '700' }}>
                {sizeLabels[value]}
              </button>
            ))}
          </div>
        </div>
      )}

      {showThanksClip && (
        <div className="thanks-clip-overlay" role="dialog" aria-modal="true" aria-label={dict.thanksClipBadge}>
          <div className="thanks-clip-card">
            <div className="thanks-clip-video" aria-hidden="true">
              <div className="thanks-clip-stage">
                <div className="thanks-clip-spotlight" />
                <div className="thanks-clip-avatar">
                  {singerName.slice(0, 1)}
                </div>
                <div className="thanks-clip-hearts">
                  <span>💜</span>
                  <span>✨</span>
                  <span>💙</span>
                </div>
              </div>
              <div className="thanks-clip-progress" />
            </div>

            <div className="thanks-clip-copy">
              <span>{dict.thanksClipBadge}</span>
              <h3>{singerName} 님의 감사 인사</h3>
              <strong>{dict.thanksClipTitle}</strong>
              <p>{dict.thanksClipText}</p>
            </div>

            <button type="button" className="thanks-clip-close" onClick={() => setShowThanksClip(false)}>
              {dict.thanksClipClose}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}