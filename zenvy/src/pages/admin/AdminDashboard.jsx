import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import Sidebar, { T, s, bookingBadge, roleBadge } from '../../components/Sidebar'

const NAV = [
  { label:'Dashboard', icon:'◉', path:'/admin/dashboard', active:true },
  { label:'Users',     icon:'◈', path:'/admin/users' },
  { label:'Bookings',  icon:'◇', path:'/admin/bookings' },
  { label:'Services',  icon:'◎', path:'/admin/services' },
  { label:'Payments',  icon:'◷', path:'/admin/payments' },
  { label:'Reviews',   icon:'♡', path:'/admin/reviews' },
]

export default function AdminDashboard() {
  const [stats, setStats]               = useState({ totalUsers:0,customers:0,providers:0,totalBookings:0,pendingBookings:0,completedBookings:0,totalRevenue:0,totalServices:0,totalReviews:0 })
  const [recentBookings, setRecentBookings] = useState([])
  const [recentUsers, setRecentUsers]       = useState([])
  const [loading, setLoading]               = useState(true)
  const [adminUser, setAdminUser]           = useState(null)
  const navigate = useNavigate()

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const { data:{ user } } = await supabase.auth.getUser()
    if (!user) { navigate('/auth'); return }
    const { data: userData } = await supabase.from('users').select('*').eq('user_id', user.id).single()
    setAdminUser(userData)
    const { data: allUsers }    = await supabase.from('users').select('role,created_at')
    const { data: allBookings } = await supabase.from('booking').select('status')
    const { data: allPayments } = await supabase.from('payment').select('amount').eq('payment_status','completed')
    const { data: allServices } = await supabase.from('service').select('service_id')
    const { data: allReviews }  = await supabase.from('review').select('review_id')
    setStats({ totalUsers:allUsers?.length||0, customers:allUsers?.filter(u=>u.role==='customer').length||0, providers:allUsers?.filter(u=>u.role==='service_provider').length||0, totalBookings:allBookings?.length||0, pendingBookings:allBookings?.filter(b=>b.status==='pending').length||0, completedBookings:allBookings?.filter(b=>b.status==='completed').length||0, totalRevenue:allPayments?.reduce((sum,p)=>sum+Number(p.amount),0)||0, totalServices:allServices?.length||0, totalReviews:allReviews?.length||0 })
    const { data: recentB } = await supabase.from('booking')
      .select('booking_id,status,booking_date,service_date,service(service_name),customer(user_id,users(first_name,last_name)),service_provider(user_id,users(first_name,last_name))')
      .order('booking_date',{ascending:false}).limit(5)
    setRecentBookings(recentB || [])
    const { data: recentU } = await supabase.from('users').select('user_id,first_name,last_name,email,role,created_at').order('created_at',{ascending:false}).limit(5)
    setRecentUsers(recentU || [])
    setLoading(false)
  }

  if (loading) return <div style={s.loading}>Loading…</div>

  const statRows = [
    [
      { label:'Total Users',    value:stats.totalUsers,    color:T.ink  },
      { label:'Customers',      value:stats.customers,     color:T.blue },
      { label:'Providers',      value:stats.providers,     color:T.purple },
    ],
    [
      { label:'Total Bookings',   value:stats.totalBookings,    color:T.ink },
      { label:'Pending',          value:stats.pendingBookings,  color:T.terra },
      { label:'Completed',        value:stats.completedBookings,color:'#15803d' },
    ],
    [
      { label:'Total Revenue',  value:`Rs. ${stats.totalRevenue.toLocaleString()}`, color:'#15803d' },
      { label:'Services',       value:stats.totalServices, color:T.ink },
      { label:'Reviews',        value:stats.totalReviews,  color:'#d97706' },
    ],
  ]

  return (
    <div style={s.page}>
      <Sidebar items={NAV} userName={`${adminUser?.first_name} ${adminUser?.last_name}`} userRole="Super Admin" />
      <main style={s.main}>

        <div style={{ marginBottom:22, paddingBottom:16, borderBottom:`2px solid ${T.mixBorder}` }}>
          <div style={{ fontSize:9, color:T.blue, textTransform:'uppercase', letterSpacing:2, fontWeight:800, marginBottom:4 }}>ADMIN PANEL</div>
          <h1 style={s.h1}>Overview Dashboard</h1>
          <p style={s.sub}>Full platform overview — users, bookings, revenue</p>
        </div>

        {statRows.map((row, ri) => (
          <div key={ri} style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:14 }}>
            {row.map(st => (
              <div key={st.label} style={s.statCard}>
                <div style={s.statLabel}>{st.label}</div>
                <div style={{ ...s.statNum, color:st.color }}>{st.value}</div>
              </div>
            ))}
          </div>
        ))}

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginTop:8 }}>

          {/* Recent Bookings */}
          <div style={s.tableWrap}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', borderBottom:`2px solid ${T.mixBorder}`, background:T.mixPale }}>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:600, color:T.ink }}>Recent Bookings</span>
              <span onClick={() => navigate('/admin/bookings')} style={{ fontSize:12, color:T.blue, cursor:'pointer', fontWeight:800 }}>View All →</span>
            </div>
            {recentBookings.length === 0 ? (
              <p style={{ color:T.muted, fontSize:13, textAlign:'center', padding:'24px 0', fontWeight:600 }}>No bookings yet</p>
            ) : recentBookings.map(b => {
              const badge = bookingBadge(b.status)
              return (
                <div key={b.booking_id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 18px', borderBottom:`1px solid ${T.mixPale}` }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{b.service?.service_name}</div>
                    <div style={{ fontSize:11, color:T.muted, fontWeight:600 }}>{b.customer?.users?.first_name} {b.customer?.users?.last_name} · {b.service_date}</div>
                  </div>
                  <span style={s.badge(badge)}>{b.status}</span>
                </div>
              )
            })}
          </div>

          {/* Recent Users */}
          <div style={s.tableWrap}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', borderBottom:`2px solid ${T.mixBorder}`, background:T.mixPale }}>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:600, color:T.ink }}>Recent Users</span>
              <span onClick={() => navigate('/admin/users')} style={{ fontSize:12, color:T.blue, cursor:'pointer', fontWeight:800 }}>View All →</span>
            </div>
            {recentUsers.length === 0 ? (
              <p style={{ color:T.muted, fontSize:13, textAlign:'center', padding:'24px 0', fontWeight:600 }}>No users yet</p>
            ) : recentUsers.map(u => {
              const badge = roleBadge(u.role)
              return (
                <div key={u.user_id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 18px', borderBottom:`1px solid ${T.mixPale}` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={s.avatar(32)}>{u.first_name?.charAt(0)}</div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{u.first_name} {u.last_name}</div>
                      <div style={{ fontSize:11, color:T.muted }}>{u.email}</div>
                    </div>
                  </div>
                  <span style={s.badge(badge)}>{u.role === 'service_provider' ? 'provider' : u.role}</span>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}