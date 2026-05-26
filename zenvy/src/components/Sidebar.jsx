import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

// ── Shared colour tokens ─────────────────────────────────────────
export const T = {
  sidebar:       '#1a2038',
  sidebarBorder: '#2e3a60',
  sidebarHover:  '#222e50',
  sidebarText:   '#5068a0',
  sidebarMuted:  '#3e5080',
  sidebarHead:   '#c8d4f0',
  blue:          '#6aaad0',
  blueMid:       '#8dc0dc',
  blueLight:     '#b5d8ec',
  bluePale:      '#daeef8',
  blueUltra:     '#edf6fb',
  purple:        '#9b8ec4',
  purpleMid:     '#b8aed8',
  purpleLight:   '#d4cef0',
  purplePale:    '#ece8f8',
  mixBg:         '#eef0f9',
  mixCard:       '#f4f5fc',
  mixBorder:     '#c2cae8',
  mixPale:       '#e8eaf8',
  ink:           '#1a2035',
  muted:         '#6878a8',
  terra:         '#c4725a',
  grad:          'linear-gradient(90deg,#6aaad0,#9b8ec4)',
  gradPale:      'linear-gradient(90deg,#daeef8,#ece8f8)',
}

// ── Badge helpers ────────────────────────────────────────────────
export const bookingBadge = (status) => ({
  pending:     { bg: '#fff7ed', color: '#c2410c', border: '#fdba74' },
  accepted:    { bg: '#eff6ff', color: '#1d4ed8', border: '#93c5fd' },
  in_progress: { bg: '#faf5ff', color: '#7c3aed', border: '#c4b5fd' },
  completed:   { bg: '#f0fdf4', color: '#15803d', border: '#86efac' },
  cancelled:   { bg: '#fff1f2', color: '#be123c', border: '#fda4af' },
}[status] || { bg: '#fff7ed', color: '#c2410c', border: '#fdba74' })

export const paymentBadge = (status) => ({
  completed: { bg: '#f0fdf4', color: '#15803d', border: '#86efac' },
  pending:   { bg: '#fff7ed', color: '#c2410c', border: '#fdba74' },
  failed:    { bg: '#fff1f2', color: '#be123c', border: '#fda4af' },
  refunded:  { bg: '#eff6ff', color: '#1d4ed8', border: '#93c5fd' },
}[status] || { bg: '#fff7ed', color: '#c2410c', border: '#fdba74' })

export const roleBadge = (role) => ({
  customer:         { bg: T.bluePale,   color: '#1a4870', border: T.blueMid },
  service_provider: { bg: '#f0fdf4',    color: '#15803d', border: '#86efac' },
  admin:            { bg: '#fff1f2',    color: '#be123c', border: '#fda4af' },
}[role] || { bg: T.bluePale, color: '#1a4870', border: T.blueMid })

// ── Shared inline styles ─────────────────────────────────────────
export const s = {
  page:    { display:'flex', fontFamily:"'Nunito',sans-serif", minHeight:'100vh', background: T.mixBg },
  main:    { marginLeft:260, flex:1, padding:'28px 32px' },
  card:    { background: T.mixCard, border:`2px solid ${T.mixBorder}`, borderRadius:14, padding:20, boxShadow:'0 2px 8px rgba(80,100,180,0.10)' },
  cardHov: { transition:'box-shadow 0.2s' },

  h1:      { fontSize:24, fontWeight:800, margin:0, color: T.ink, fontFamily:"'Cormorant Garamond',serif", letterSpacing:0.5 },
  sub:     { color: T.muted, marginTop:4, fontSize:13, fontWeight:600 },

  statGrid: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:22 },
  statCard: { background: T.mixCard, border:`2px solid ${T.mixBorder}`, borderRadius:12, padding:'16px 18px', boxShadow:'0 2px 8px rgba(80,100,180,0.08)' },
  statLabel:{ fontSize:9, color: T.muted, textTransform:'uppercase', letterSpacing:2, fontWeight:800, marginBottom:6 },
  statNum:  { fontSize:28, fontWeight:800, color: T.ink, fontFamily:"'Cormorant Garamond',serif", letterSpacing:-1 },

  tableWrap:{ background: T.mixCard, border:`2px solid ${T.mixBorder}`, borderRadius:14, overflow:'hidden', boxShadow:'0 2px 8px rgba(80,100,180,0.08)' },
  tableHead:{ background:`linear-gradient(90deg,${T.blueUltra},${T.purplePale})` },
  th:       { padding:'10px 14px', textAlign:'left', fontSize:8.5, textTransform:'uppercase', letterSpacing:2, color: T.muted, fontWeight:800, borderBottom:`2px solid ${T.mixPale}`, whiteSpace:'nowrap' },
  td:       { padding:'11px 14px', fontSize:13, color: T.ink, verticalAlign:'middle', fontWeight:600 },
  tr:       { borderBottom:`1.5px solid ${T.mixPale}` },

  badge: (b) => ({ background:b.bg, color:b.color, border:`1.5px solid ${b.border}`, padding:'3px 10px', borderRadius:5, fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:0.8, display:'inline-block' }),

  btn:      { padding:'9px 20px', background: T.grad, color:'#fff', border:`2px solid rgba(80,100,180,0.25)`, borderRadius:7, cursor:'pointer', fontSize:13, fontWeight:800, fontFamily:"'Nunito',sans-serif", boxShadow:'0 2px 10px rgba(100,120,200,0.22)', transition:'all 0.2s' },
  btnGhost: { padding:'7px 14px', background:'transparent', border:`2px solid ${T.mixBorder}`, borderRadius:7, cursor:'pointer', fontSize:12, color: T.muted, fontWeight:700, fontFamily:"'Nunito',sans-serif" },
  btnSm:    (bg,col,bor) => ({ padding:'5px 11px', background:bg, color:col, border:`1.5px solid ${bor}`, borderRadius:6, cursor:'pointer', fontSize:11, fontWeight:700, fontFamily:"'Nunito',sans-serif" }),

  input:    { border:`2px solid ${T.mixBorder}`, borderRadius:7, padding:'9px 13px', fontSize:13, fontFamily:"'Nunito',sans-serif", outline:'none', background: T.mixBg, boxSizing:'border-box', color: T.ink, fontWeight:600 },
  select:   { border:`2px solid ${T.mixBorder}`, borderRadius:7, padding:'9px 13px', fontSize:13, fontFamily:"'Nunito',sans-serif", outline:'none', background: T.mixBg, color: T.ink, fontWeight:600 },

  filterBar:{ display:'flex', borderBottom:`2px solid ${T.mixBorder}`, marginBottom:20, overflowX:'auto' },
  filterTab:(active) => ({ padding:'10px 16px', fontSize:12, cursor:'pointer', whiteSpace:'nowrap', fontFamily:"'Nunito',sans-serif", fontWeight: active ? 800 : 600, color: active ? T.blue : T.muted, borderBottom: active ? `2.5px solid ${T.blue}` : '2.5px solid transparent', marginBottom:-2 }),

  loading:  { display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', fontFamily:"'Nunito',sans-serif", background: T.mixBg, color: T.muted, fontSize:13, fontWeight:700, letterSpacing:2, textTransform:'uppercase' },

  modal:    { position:'fixed', inset:0, background:'rgba(20,28,60,0.50)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, backdropFilter:'blur(4px)' },
  modalCard:{ background:'#fff', borderRadius:20, padding:28, boxShadow:'0 8px 40px rgba(80,100,180,0.18)', border:`2px solid ${T.mixBorder}` },

  avatar: (size=32) => ({ width:size, height:size, borderRadius:'50%', background:`linear-gradient(135deg,${T.blueLight},${T.purpleLight})`, border:`2px solid ${T.mixBorder}`, display:'flex', alignItems:'center', justifyContent:'center', color:'#2a3870', fontSize: size*0.3, fontWeight:800, flexShrink:0 }),
}

// ── useIsMobile hook ─────────────────────────────────────────────
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < breakpoint)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [breakpoint])
  return isMobile
}

// ── PageLayout ───────────────────────────────────────────────────
export function PageLayout({ children }) {
  const isMobile = useIsMobile()
  return (
    <main style={{
      ...s.main,
      marginLeft: isMobile ? 0 : 220,
      padding: isMobile ? '16px 14px' : '28px 32px',
      paddingTop: isMobile ? '68px' : '28px',
      minHeight: '100vh',
      width: isMobile ? '100%' : undefined,
      boxSizing: 'border-box',
    }}>
      {children}
    </main>
  )
}

// ── ResponsiveTable ──────────────────────────────────────────────
export function ResponsiveTable({ headers, rows }) {
  const isMobile = useIsMobile()
  if (!isMobile) {
    return (
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr style={s.tableHead}>
            {headers.map(h => <th key={h} style={s.th}>{h}</th>)}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    )
  }
  return null // Mobile uses card layout — handled by parent
}

// ── StatGrid ─────────────────────────────────────────────────────
export function StatGrid({ stats = [], cols = 4 }) {
  const isMobile = useIsMobile()
  const mobileCols = stats.length <= 2 ? stats.length : 2
  return (
    <div style={{
      display:'grid',
      gridTemplateColumns: isMobile ? `repeat(${mobileCols}, 1fr)` : `repeat(${cols}, 1fr)`,
      gap: isMobile ? 10 : 14,
      marginBottom: 22,
    }}>
      {stats.map((stat, i) => (
        <div key={i} style={{
          ...s.statCard,
          padding: isMobile ? '12px 14px' : '16px 18px',
        }}>
          <div style={{ ...s.statLabel, fontSize: isMobile ? 8 : 9 }}>{stat.label}</div>
          <div style={{ ...s.statNum, fontSize: isMobile ? 22 : 28, color: stat.color || s.statNum.color }}>{stat.value}</div>
        </div>
      ))}
    </div>
  )
}

// ── Animated Logo Mark ───────────────────────────────────────────
export function LogoMark({ size = 36 }) {
  const r1 = useRef(), r2 = useRef()
  useEffect(() => {
    let a1 = 0, a2 = 0, id
    const tick = () => {
      a1 += 0.4; a2 -= 0.25
      if (r1.current) r1.current.style.transform = `rotate(${a1}deg)`
      if (r2.current) r2.current.style.transform = `rotate(${a2}deg)`
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [])
  return (
    <div style={{ position:'relative', width:size, height:size, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
      <div ref={r1} style={{ position:'absolute', width:size, height:size, borderRadius:'50%', border:`2.5px solid ${T.blueMid}` }} />
      <div ref={r2} style={{ position:'absolute', width:size*0.7, height:size*0.7, borderRadius:'50%', border:`2px dashed ${T.purpleMid}` }} />
      <div style={{ width:size*0.22, height:size*0.22, borderRadius:'50%', background:T.grad, position:'relative', zIndex:1 }} />
    </div>
  )
}

// ── Sidebar Component ────────────────────────────────────────────
export default function Sidebar({ items, userName, userRole, extra }) {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const logout = async () => { await supabase.auth.signOut(); navigate('/auth') }

  // Lock body scroll when sidebar open on mobile
  useEffect(() => {
    if (isMobile && open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobile, open])

  const sidebarContent = (
    <aside style={{
      width: 260,
      background: T.sidebar,
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      borderRight: `2.5px solid ${T.sidebarBorder}`,
      zIndex: 1000,
      transform: isMobile ? (open ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
      transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: isMobile && open ? '4px 0 32px rgba(10,15,50,0.4)' : 'none',
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>

      {/* Logo */}
      <div style={{ padding:'20px 16px 14px', borderBottom:`2px solid ${T.sidebarBorder}`, display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
        <LogoMark size={34} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:"'Righteous',cursive", fontSize:20, color: T.sidebarHead, letterSpacing:3, lineHeight:1 }}>Zenvy</div>
          <div style={{ fontSize:7.5, color: T.sidebarMuted, letterSpacing:2.5, textTransform:'uppercase', marginTop:2 }}>A HomeService Platform</div>
        </div>
        {isMobile && (
          <button
            onClick={() => setOpen(false)}
            style={{ background:'none', border:'none', color: T.sidebarHead, fontSize:22, cursor:'pointer', padding:'4px 8px', marginLeft:'auto', lineHeight:1, opacity:0.8, flexShrink:0 }}
          >✕</button>
        )}
      </div>

      {/* User */}
      <div style={{ padding:'14px 18px', borderBottom:`2px solid ${T.sidebarBorder}`, display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
        <div style={{ ...s.avatar(34), fontSize:13 }}>{userName?.charAt(0) || '?'}</div>
        <div style={{ minWidth:0 }}>
          <div style={{ color: T.sidebarHead, fontSize:13, fontWeight:700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{userName}</div>
          <div style={{ color: T.sidebarMuted, fontSize:9, letterSpacing:2, textTransform:'uppercase', marginTop:2 }}>{userRole}</div>
          {extra}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'12px 0', overflowY:'auto' }}>
        {items.map(item => (
          <div key={item.path}
            onClick={() => { navigate(item.path); if (isMobile) setOpen(false) }}
            style={{
              padding:'11px 18px',
              display:'flex',
              alignItems:'center',
              gap:12,
              fontSize:13,
              fontWeight:700,
              cursor:'pointer',
              borderRadius:'0 99px 99px 0',
              marginRight:14,
              marginBottom:3,
              letterSpacing:0.3,
              transition:'all 0.2s',
              color:      item.active ? '#fff'          : T.sidebarText,
              background: item.active ? T.grad          : 'transparent',
              border:     item.active ? `1.5px solid rgba(255,255,255,0.15)` : '1.5px solid transparent',
            }}>
            <span style={{ fontSize:16, width:20, textAlign:'center', flexShrink:0 }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding:'14px 18px', borderTop:`2px solid ${T.sidebarBorder}`, flexShrink:0 }}>
        <div onClick={logout} style={{ fontSize:11, color: T.terra, cursor:'pointer', fontWeight:700, letterSpacing:1, textTransform:'uppercase', transition:'letter-spacing 0.2s' }}>
          ↪ Sign Out
        </div>
      </div>
    </aside>
  )

  return (
    <>
      {/* Mobile top bar */}
      {isMobile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          background: T.sidebar,
          borderBottom: `2px solid ${T.sidebarBorder}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: 14,
          zIndex: 999,
          boxShadow: '0 2px 12px rgba(10,15,50,0.25)',
        }}>
          {/* Hamburger */}
          <button
            onClick={() => setOpen(o => !o)}
            style={{
              background: 'transparent',
              border: `1.5px solid ${T.sidebarBorder}`,
              borderRadius: 8,
              width: 40,
              height: 40,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              padding: 0,
              flexShrink: 0,
            }}>
            {[0,1,2].map(i => (
              <span key={i} style={{
                width: open ? (i === 1 ? 0 : 18) : 18,
                height: 2,
                background: T.sidebarHead,
                borderRadius: 2,
                display: 'block',
                transition: 'all 0.2s',
                transformOrigin: 'center',
                transform: open
                  ? i === 0 ? 'rotate(45deg) translate(5px, 5px)'
                  : i === 2 ? 'rotate(-45deg) translate(5px, -5px)'
                  : 'scaleX(0)'
                  : 'none',
              }} />
            ))}
          </button>

          {/* Brand in top bar */}
          <div style={{ display:'flex', alignItems:'center', gap:10, flex:1 }}>
            <LogoMark size={28} />
            <span style={{ fontFamily:"'Righteous',cursive", fontSize:18, color: T.sidebarHead, letterSpacing:3 }}>Zenvy</span>
          </div>

          {/* User avatar */}
          <div style={{ ...s.avatar(34), fontSize:12, flexShrink:0 }}>{userName?.charAt(0) || '?'}</div>
        </div>
      )}

      {/* Backdrop */}
      {isMobile && open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10,15,50,0.6)',
            zIndex: 998,
            backdropFilter: 'blur(3px)',
          }}
        />
      )}

      {/* Sidebar drawer */}
      {sidebarContent}
    </>
  )
}
