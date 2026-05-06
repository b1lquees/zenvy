import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'

export default function Landing() {
  const navigate = useNavigate()
  const ring1Ref = useRef()
  const ring2Ref = useRef()

  useEffect(() => {
    let a1 = 0, a2 = 0, id
    const tick = () => {
      a1 += 0.4; a2 -= 0.25
      if (ring1Ref.current) ring1Ref.current.style.transform = `rotate(${a1}deg)`
      if (ring2Ref.current) ring2Ref.current.style.transform = `rotate(${a2}deg)`
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [])

  const page = {
    minHeight: '100vh',
    background: '#eef0f9',
    fontFamily: "'Nunito', sans-serif",
    position: 'relative',
    overflowX: 'hidden',
  }

  const blob = (w, h, bg, top, left, right, bottom) => ({
    position: 'fixed',
    width: w, height: h,
    borderRadius: '50%',
    background: bg,
    filter: 'blur(70px)',
    pointerEvents: 'none',
    zIndex: 0,
    ...(top !== undefined && { top }),
    ...(left !== undefined && { left }),
    ...(right !== undefined && { right }),
    ...(bottom !== undefined && { bottom }),
  })

  const section = {
    position: 'relative', zIndex: 1,
    maxWidth: 860,
    margin: '0 auto',
    padding: '0 24px',
  }

  const card = {
    background: 'rgba(255,255,255,0.72)',
    backdropFilter: 'blur(16px)',
    borderRadius: 24,
    border: '2px solid #c2cae8',
    boxShadow: '0 8px 40px rgba(80,100,180,0.10)',
    padding: '48px 56px',
  }

  const T = {
    ink: '#1a2035', muted: '#6878a8', light: '#a0b0d0',
    blue: '#6aaad0', purple: '#9b8ec4',
    bluePale: '#daeef8', purplePale: '#ece8f8',
    mixBorder: '#c2cae8', mixPale: '#e8eaf8',
    grad: 'linear-gradient(90deg,#6aaad0,#9b8ec4)',
  }

  const gradText = {
    background: T.grad,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }

  return (
    <div style={page}>
      {/* Background blobs */}
      <div style={blob(400,400,'rgba(106,170,208,0.22)',undefined,undefined,undefined,-120,'−80px')} />
      <div style={{...blob(400,400,'rgba(106,170,208,0.22)'),position:'fixed',bottom:-120,left:-80,top:'auto',right:'auto'}} />
      <div style={{...blob(380,380,'rgba(155,142,196,0.20)'),position:'fixed',top:-60,right:-80,bottom:'auto',left:'auto'}} />
      <div style={{...blob(300,300,'rgba(141,192,220,0.18)'),position:'fixed',top:'40%',right:'5%',bottom:'auto',left:'auto'}} />
      <div style={{...blob(260,260,'rgba(180,174,216,0.16)'),position:'fixed',top:'30%',left:'3%',bottom:'auto',right:'auto'}} />

      {/* ── NAV ── */}
      <nav style={{ position:'relative', zIndex:10, padding:'20px 40px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ position:'relative', width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div ref={ring1Ref} style={{ position:'absolute', width:36, height:36, borderRadius:'50%', border:'2.5px solid #8dc0dc' }} />
            <div ref={ring2Ref} style={{ position:'absolute', width:25, height:25, borderRadius:'50%', border:'2px dashed #b8aed8' }} />
            <div style={{ width:8, height:8, borderRadius:'50%', background:T.grad, position:'relative', zIndex:1 }} />
          </div>
          <div style={{ fontFamily:"'Righteous',cursive", fontSize:22, ...gradText, letterSpacing:3 }}>Zenvy</div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={() => navigate('/auth')} style={{ padding:'8px 20px', background:'transparent', border:`2px solid ${T.mixBorder}`, borderRadius:8, fontSize:13, fontWeight:700, color:T.muted, cursor:'pointer', fontFamily:"'Nunito',sans-serif" }}>Log In</button>
          <button onClick={() => navigate('/auth')} style={{ padding:'8px 20px', background:T.grad, border:'none', borderRadius:8, fontSize:13, fontWeight:700, color:'#fff', cursor:'pointer', fontFamily:"'Nunito',sans-serif", boxShadow:'0 3px 12px rgba(100,120,200,0.25)' }}>Get Started</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ ...section, paddingTop:60, paddingBottom:80, textAlign:'center' }}>
        <div style={{ display:'inline-block', background:`linear-gradient(90deg,${T.bluePale},${T.purplePale})`, border:`1.5px solid ${T.mixBorder}`, borderRadius:99, padding:'6px 18px', fontSize:11, fontWeight:800, color:'#3858a8', letterSpacing:2, textTransform:'uppercase', marginBottom:28 }}>
          ✦ Service Marketplace — Pakistan
        </div>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:58, fontWeight:600, color:T.ink, lineHeight:1.15, letterSpacing:-1, marginBottom:20 }}>
          Home services,<br/>
          <span style={gradText}>beautifully simple.</span>
        </h1>
        <p style={{ fontSize:16, color:T.muted, fontWeight:600, maxWidth:480, margin:'0 auto 36px', lineHeight:1.7 }}>
          Book trusted cleaning, repairs, and wellness professionals in minutes. Verified providers, transparent pricing.
        </p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <button onClick={() => navigate('/auth')} style={{ padding:'14px 36px', background:T.grad, color:'#fff', border:'none', borderRadius:10, fontSize:15, fontWeight:800, cursor:'pointer', fontFamily:"'Nunito',sans-serif", boxShadow:'0 4px 18px rgba(100,120,200,0.28)', letterSpacing:0.3 }}>
            Book a Service →
          </button>
          <button onClick={() => navigate('/auth')} style={{ padding:'14px 30px', background:'rgba(255,255,255,0.72)', color:T.ink, border:`2px solid ${T.mixBorder}`, borderRadius:10, fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:"'Nunito',sans-serif" }}>
            Become a Provider
          </button>
        </div>

        {/* Trust pills */}
        <div style={{ display:'flex', gap:10, justifyContent:'center', marginTop:36, flexWrap:'wrap' }}>
          {['✓  2,000+ happy customers','✓  500+ verified providers','✓  Rawalpindi & beyond'].map((t,i) => (
            <div key={i} style={{ background:'rgba(255,255,255,0.65)', border:`1.5px solid ${T.mixBorder}`, borderRadius:99, padding:'6px 16px', fontSize:12, fontWeight:700, color:T.muted }}>
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* ── SERVICES ── */}
      <div style={{ ...section, paddingBottom:80 }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ fontSize:9, fontWeight:800, color:T.blue, textTransform:'uppercase', letterSpacing:3, marginBottom:8 }}>What we offer</div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:36, fontWeight:600, color:T.ink }}>Services you'll love</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {[
            { icon:'🧹', title:'Cleaning', desc:'Deep cleaning, standard cleans, move-in/out specialists.', color:T.bluePale, border:T.blue },
            { icon:'🔧', title:'Repairs',  desc:'Plumbing, electrical, carpentry and general handyman.', color:T.purplePale, border:T.purple },
            { icon:'💆', title:'Wellness', desc:'Massage therapy, skincare and relaxation at home.', color:`linear-gradient(135deg,${T.bluePale},${T.purplePale})`, border:T.mixBorder },
            { icon:'🏠', title:'Home Care', desc:'AC servicing, pest control, painting and more.', color:T.purplePale, border:T.purple },
            { icon:'🚗', title:'Automotive', desc:'Car wash, detailing and basic maintenance.', color:T.bluePale, border:T.blue },
            { icon:'📦', title:'Bundles',   desc:'Combine services and save — curated packages.', color:`linear-gradient(135deg,${T.purplePale},${T.bluePale})`, border:T.mixBorder },
          ].map((svc,i) => (
            <div key={i} style={{ background:svc.color, border:`2px solid ${svc.border}`, borderRadius:16, padding:'22px 20px', transition:'transform 0.2s,box-shadow 0.2s', cursor:'default' }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 12px 28px rgba(80,100,180,0.14)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow=''}}>
              <div style={{ fontSize:28, marginBottom:12 }}>{svc.icon}</div>
              <div style={{ fontWeight:800, fontSize:15, color:T.ink, marginBottom:6 }}>{svc.title}</div>
              <div style={{ fontSize:13, color:T.muted, fontWeight:600, lineHeight:1.6 }}>{svc.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div style={{ ...section, paddingBottom:80 }}>
        <div style={{ ...card }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <div style={{ fontSize:9, fontWeight:800, color:T.purple, textTransform:'uppercase', letterSpacing:3, marginBottom:8 }}>Simple process</div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:36, fontWeight:600, color:T.ink }}>How it works</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24, textAlign:'center' }}>
            {[
              { num:'01', title:'Sign Up',      desc:'Create your free account in under a minute.' },
              { num:'02', title:'Browse',       desc:'Find the service you need and pick a provider.' },
              { num:'03', title:'Book',         desc:'Choose a date, time and confirm your booking.' },
              { num:'04', title:'Enjoy',        desc:'Sit back while a pro handles the rest.' },
            ].map((step,i) => (
              <div key={i}>
                <div style={{ fontFamily:"'Righteous',cursive", fontSize:32, ...gradText, marginBottom:10 }}>{step.num}</div>
                <div style={{ fontWeight:800, fontSize:15, color:T.ink, marginBottom:6 }}>{step.title}</div>
                <div style={{ fontSize:13, color:T.muted, fontWeight:600, lineHeight:1.6 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ABOUT US ── */}
      <div style={{ ...section, paddingBottom:80 }}>
        <div style={{ ...card, display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center' }}>
          {/* Left */}
          <div>
            <div style={{ fontSize:9, fontWeight:800, color:T.blue, textTransform:'uppercase', letterSpacing:3, marginBottom:12 }}>About us</div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:36, fontWeight:600, color:T.ink, marginBottom:16, lineHeight:1.2 }}>
              Built for Pakistan,<br/>
              <span style={gradText}>by Pakistanis.</span>
            </h2>
            <p style={{ fontSize:14, color:T.muted, fontWeight:600, lineHeight:1.8, marginBottom:16 }}>
              Zenvy was born out of a simple frustration — finding reliable home service providers in Pakistan was too hard, too slow, and too unpredictable.
            </p>
            <p style={{ fontSize:14, color:T.muted, fontWeight:600, lineHeight:1.8, marginBottom:24 }}>
              We built a platform that connects skilled, verified professionals with customers who value their time. Whether it's a deep clean before Eid or a plumber on a Sunday morning, Zenvy is here.
            </p>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              {[
                { val:'2,000+', label:'Customers served' },
                { val:'500+',   label:'Verified providers' },
                { val:'4.8★',   label:'Average rating' },
              ].map((stat,i) => (
                <div key={i} style={{ background:`linear-gradient(135deg,${T.bluePale},${T.purplePale})`, border:`2px solid ${T.mixBorder}`, borderRadius:12, padding:'12px 18px', minWidth:90, textAlign:'center' }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600, ...gradText }}>{stat.val}</div>
                  <div style={{ fontSize:10, fontWeight:800, color:T.muted, textTransform:'uppercase', letterSpacing:1, marginTop:2 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Right */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {[
              { icon:'🛡️', title:'Verified Providers',   desc:'Every provider is background-checked and reviewed before joining the platform.' },
              { icon:'💬', title:'Transparent Pricing',  desc:'No hidden fees. You see the full price before confirming any booking.' },
              { icon:'⚡', title:'Fast Booking',         desc:'From search to confirmed booking in under 3 minutes, any time of day.' },
              { icon:'🌟', title:'Quality Guarantee',    desc:'Not satisfied? We will make it right. Every booking is covered.' },
            ].map((item,i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:14, background:T.mixPale, border:`1.5px solid ${T.mixBorder}`, borderRadius:12, padding:'14px 16px' }}>
                <div style={{ fontSize:20, flexShrink:0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight:800, fontSize:13, color:T.ink, marginBottom:3 }}>{item.title}</div>
                  <div style={{ fontSize:12, color:T.muted, fontWeight:600, lineHeight:1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <div style={{ ...section, paddingBottom:80 }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ fontSize:9, fontWeight:800, color:T.purple, textTransform:'uppercase', letterSpacing:3, marginBottom:8 }}>Testimonials</div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:36, fontWeight:600, color:T.ink }}>What customers say</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {[
            { name:'Sara A.',    role:'Rawalpindi',  rating:5, text:'"Booked a deep clean and it was spotless. Will definitely use again — so easy and professional."' },
            { name:'Ahmed K.',   role:'Islamabad',   rating:5, text:'"The plumber arrived on time and fixed the issue in 20 minutes. Pricing was exactly what was shown."' },
            { name:'Fatima R.',  role:'Rawalpindi',  rating:5, text:'"Love the bundle feature — booked cleaning + AC service together and saved so much time."' },
          ].map((t,i) => (
            <div key={i} style={{ background:'rgba(255,255,255,0.72)', border:`2px solid ${T.mixBorder}`, borderRadius:16, padding:'22px 20px', backdropFilter:'blur(8px)' }}>
              <div style={{ color:'#d97706', fontSize:16, marginBottom:12, letterSpacing:2 }}>{'★'.repeat(t.rating)}</div>
              <p style={{ fontSize:13, color:T.ink, fontWeight:600, lineHeight:1.7, marginBottom:16, fontStyle:'italic' }}>{t.text}</p>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,#b5d8ec,#d4cef0)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#2a3870', border:`2px solid ${T.mixBorder}` }}>{t.name.charAt(0)}</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:800, color:T.ink }}>{t.name}</div>
                  <div style={{ fontSize:11, color:T.muted, fontWeight:600 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ ...section, paddingBottom:80 }}>
        <div style={{ ...card, textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:T.blue, textTransform:'uppercase', letterSpacing:3, marginBottom:12 }}>Get started today</div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:40, fontWeight:600, color:T.ink, marginBottom:16, lineHeight:1.2 }}>
            Ready to simplify<br/><span style={gradText}>your home?</span>
          </h2>
          <p style={{ fontSize:15, color:T.muted, fontWeight:600, maxWidth:420, margin:'0 auto 32px', lineHeight:1.7 }}>
            Join thousands of Pakistanis who trust Zenvy for their home services.
          </p>
          <button onClick={() => navigate('/auth')} style={{ padding:'14px 48px', background:T.grad, color:'#fff', border:'none', borderRadius:10, fontSize:16, fontWeight:800, cursor:'pointer', fontFamily:"'Nunito',sans-serif", boxShadow:'0 4px 18px rgba(100,120,200,0.28)', letterSpacing:0.3 }}>
            Create Free Account →
          </button>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ position:'relative', zIndex:1, borderTop:`2px solid ${T.mixBorder}`, padding:'28px 40px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12, background:'rgba(255,255,255,0.40)', backdropFilter:'blur(8px)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ fontFamily:"'Righteous',cursive", fontSize:16, ...gradText, letterSpacing:2 }}>Zenvy</div>
          <span style={{ fontSize:12, color:T.muted, fontWeight:600 }}>— Service Marketplace, Pakistan</span>
        </div>
        <div style={{ fontSize:11, color:T.light, fontWeight:600 }}>© 2026 Zenvy. All rights reserved.</div>
      </footer>
    </div>
  )
}