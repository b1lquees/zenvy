import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import Sidebar, { T, s, bookingBadge } from '../../components/Sidebar'

const NAV = [
  { label:'Dashboard',      icon:'◉', path:'/customer/dashboard', active:true },
  { label:'Browse Services',icon:'◈', path:'/customer/browse' },
  { label:'My Bookings',    icon:'◇', path:'/customer/bookings' },
  { label:'Bundle Offers',  icon:'◎', path:'/customer/bundles' },
  { label:'Payments',       icon:'◷', path:'/customer/payments' },
  { label:'My Reviews',     icon:'♡', path:'/customer/reviews' },
]

export default function CustomerDashboard() {
  const [user, setUser]       = useState(null)
  const [bookings, setBookings] = useState([])
  const [stats, setStats]     = useState({ total:0, active:0, pending_payments:0, reviews:0 })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const { data:{ user: authUser } } = await supabase.auth.getUser()
    if (!authUser) { navigate('/auth'); return }
    const { data: userData } = await supabase.from('users').select('*').eq('user_id', authUser.id).single()
    setUser(userData)
    const { data: bookingData, error } = await supabase.from('booking')
      .select('booking_id,status,booking_date,service_date,location,service(service_name),service_provider(user_id)')
      .eq('customer_id', authUser.id).order('booking_date',{ascending:false}).limit(5)
    console.log(bookingData, error)
    setBookings(bookingData || [])
    const { data: allBookings }  = await supabase.from('booking').select('status').eq('customer_id', authUser.id)
    const { data: reviewData }   = await supabase.from('review').select('review_id').eq('customer_id', authUser.id)
    const { data: paymentData }  = await supabase.from('payment').select('booking_id,payment_status,booking!inner(customer_id)').eq('booking.customer_id', authUser.id).eq('payment_status','pending')
    setStats({ total:allBookings?.length||0, active:allBookings?.filter(b=>['accepted','in_progress'].includes(b.status)).length||0, pending_payments:paymentData?.length||0, reviews:reviewData?.length||0 })
    setLoading(false)
  }

  if (loading) return <div style={s.loading}>Loading…</div>

  return (
    <div style={s.page}>
      <Sidebar items={NAV} userName={`${user?.first_name} ${user?.last_name}`} userRole="Customer" />
      <main style={s.main}>

        {/* Header */}
        <div style={{ marginBottom:22, paddingBottom:16, borderBottom:`2px solid ${T.mixBorder}` }}>
          <h1 style={s.h1}>Dashboard</h1>
          <p style={s.sub}>Hello {user?.first_name}, what do you need today?</p>
        </div>

        {/* Welcome Banner */}
        <div style={{ background:`linear-gradient(135deg,${T.bluePale},${T.purplePale})`, border:`2px solid ${T.mixBorder}`, borderRadius:16, padding:'24px 28px', marginBottom:22, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:9, color:T.blue, textTransform:'uppercase', letterSpacing:2, fontWeight:800, marginBottom:6 }}>WELCOME BACK</div>
            <div style={{ fontSize:18, fontWeight:800, color:T.ink }}>Hello {user?.first_name}!</div>
            <p style={{ color:T.muted, marginTop:4, fontSize:13, fontWeight:600 }}>Manage bookings, browse services, or track payments.</p>
            <button onClick={() => navigate('/customer/browse')} style={{ ...s.btn, marginTop:12 }}>Browse Services →</button>
          </div>
          <div style={{ fontSize:48, opacity:0.3 }}>◎</div>
        </div>

        {/* Stats */}
        <div style={{ ...s.statGrid, gridTemplateColumns:'repeat(4,1fr)' }}>
          {[
            { label:'Total Bookings',   value:stats.total,            color:T.ink },
            { label:'Active Bookings',  value:stats.active,           color:T.blue },
            { label:'Pending Payments', value:stats.pending_payments, color:T.terra },
            { label:'Reviews Written',  value:stats.reviews,          color:T.purple },
          ].map(st => (
            <div key={st.label} style={s.statCard}>
              <div style={s.statLabel}>{st.label}</div>
              <div style={{ ...s.statNum, color:st.color }}>{st.value}</div>
            </div>
          ))}
        </div>

        {/* Recent Bookings */}
        <div style={s.tableWrap}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', borderBottom:`2px solid ${T.mixBorder}`, background:T.mixPale }}>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:600, color:T.ink, letterSpacing:1 }}>Recent Bookings</span>
            <span onClick={() => navigate('/customer/bookings')} style={{ fontSize:12, color:T.blue, cursor:'pointer', fontWeight:800 }}>View All →</span>
          </div>
          {bookings.length === 0 ? (
            <div style={{ textAlign:'center', padding:'50px 20px', color:T.muted }}>
              <div style={{ fontSize:40, marginBottom:12, opacity:0.4 }}>◇</div>
              <p style={{ fontSize:13, fontWeight:600 }}>No bookings yet. Browse services to get started!</p>
              <button onClick={() => navigate('/customer/browse')} style={{ ...s.btn, marginTop:14 }}>Browse Services</button>
            </div>
          ) : (
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={s.tableHead}>
                  {['Service','Service Date','Location','Status','Action'].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => {
                  const badge = bookingBadge(b.status)
                  return (
                    <tr key={b.booking_id} style={s.tr}>
                      <td style={s.td}>{b.service?.service_name || '—'}</td>
                      <td style={s.td}>{b.service_date}</td>
                      <td style={s.td}>{b.location || '—'}</td>
                      <td style={s.td}><span style={s.badge(badge)}>{b.status}</span></td>
                      <td style={s.td}>
                        <button onClick={() => navigate('/customer/bookings')} style={s.btnGhost}>View</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}