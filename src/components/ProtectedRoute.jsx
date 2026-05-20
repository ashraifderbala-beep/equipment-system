import React from 'react'
import { authManager } from '../utils/authManager'

/**
 * مكون حماية الصفحات بناءً على الصلاحيات
 * 
 * الاستخدام:
 * <ProtectedRoute requiredRole="Admin" permission="upload_excel">
 *   <AdminDashboard />
 * </ProtectedRoute>
 */
const ProtectedRoute = ({
  children,
  requiredRole = null,
  requiredPermission = null,
  fallback = <UnauthorizedPage />
}) => {
  // التحقق من تسجيل الدخول
  if (!authManager.isLoggedIn()) {
    return fallback
  }

  // التحقق من الدور (Role)
  if (requiredRole && authManager.getCurrentUser().role !== requiredRole) {
    return fallback
  }

  // التحقق من الصلاحية (Permission)
  if (requiredPermission && !authManager.hasPermission(requiredPermission)) {
    return fallback
  }

  return children
}

/**
 * صفحة الوصول المرفوض
 */
const UnauthorizedPage = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      direction: 'rtl',
      fontFamily: 'Cairo'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#e74c3c', marginBottom: '20px' }}>🔒 وصول مرفوض</h1>
        <p style={{ color: '#666', marginBottom: '30px', fontSize: '16px' }}>
          ليس لديك صلاحية للوصول إلى هذه الصفحة.
          <br />
          يرجى التواصل مع مدير النظام إذا كنت تعتقد أن هذا خطأ.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            padding: '10px 30px',
            backgroundColor: '#1e3c72',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontFamily: 'Cairo'
          }}
        >
          العودة إلى الرئيسية
        </button>
      </div>
    </div>
  )
}

export default ProtectedRoute
