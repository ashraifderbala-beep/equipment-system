import React from 'react'
import { BarChart3, Wrench, AlertCircle, TrendingUp, Settings, LogOut } from 'lucide-react'
import '../styles/sidebar.css'

const Sidebar = ({ currentPage, setCurrentPage }) => {
  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم والتقارير', icon: BarChart3 },
    { id: 'daily-logs', label: 'سجل التشغيل اليومي', icon: TrendingUp },
    { id: 'maintenance-cycles', label: 'دورات الصيانة', icon: Wrench },
    { id: 'breakdown', label: 'بلاغات الأعطال', icon: AlertCircle },
    { id: 'transfers', label: 'تنقلات المعدات', icon: Settings },
    { id: 'costs', label: 'التكاليف والمخزن', icon: LogOut }
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">SIAC</h1>
        <p className="sidebar-subtitle">إدارة الصيانة</p>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const IconComponent = item.icon
          return (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
              title={item.label}
            >
              <IconComponent className="nav-icon" size={20} />
              <span className="nav-label">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">أ</div>
          <div className="user-details">
            <p className="user-name">مسؤول النظام</p>
            <p className="user-role">مدير الصيانة</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
