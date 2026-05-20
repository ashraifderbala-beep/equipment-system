import React, { useState } from 'react'
import { LogIn, AlertCircle } from 'lucide-react'
import { authManager } from '../utils/authManager'
import '../styles/login.css'

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    setTimeout(() => {
      const user = authManager.login(username, password)

      if (user) {
        onLoginSuccess(user)
      } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة')
        setPassword('')
      }

      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="login-container">
      <div className="login-box">
        {/* الرأس */}
        <div className="login-header">
          <div className="company-logo">SIAC</div>
          <h1>نظام إدارة صيانة المعدات</h1>
          <p>نظام متقدم لإدارة المعدات والصيانة الوقائية</p>
        </div>

        {/* النموذج */}
        <form onSubmit={handleLogin} className="login-form">
          {/* حقل اسم المستخدم */}
          <div className="form-group">
            <label htmlFor="username">اسم المستخدم</label>
            <input
              type="text"
              id="username"
              placeholder="أدخل اسم المستخدم"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              autoFocus
              required
            />
          </div>

          {/* حقل كلمة المرور */}
          <div className="form-group">
            <label htmlFor="password">كلمة المرور</label>
            <input
              type="password"
              id="password"
              placeholder="أدخل كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {/* رسالة الخطأ */}
          {error && (
            <div className="error-message">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* زر تسجيل الدخول */}
          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                جاري التحقق...
              </>
            ) : (
              <>
                <LogIn size={20} />
                تسجيل الدخول
              </>
            )}
          </button>
        </form>

        {/* معلومات الاختبار */}
        <div className="demo-credentials">
          <h4>بيانات الاختبار (Demo Credentials):</h4>
          <div className="credential-item">
            <strong>Admin:</strong>
            <p>المستخدم: admin | كلمة المرور: siac_admin_2026</p>
          </div>
          <div className="credential-item">
            <strong>Technician:</strong>
            <p>المستخدم: technician_prj001 | كلمة المرور: tech_2026</p>
          </div>
        </div>

        {/* الفوتر */}
        <div className="login-footer">
          <p>© 2026 SIAC - جميع الحقوق محفوظة</p>
          <p>نظام إدارة صيانة المعدات v1.0</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
