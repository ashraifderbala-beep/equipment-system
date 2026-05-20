/**
 * مدير المصادقة والصلاحيات
 * نظام Role-Based Access Control (RBAC)
 */

const DB_KEY = 'siac_users'
const CURRENT_USER_KEY = 'siac_current_user'
const CURRENT_SESSION_KEY = 'siac_session'

// أدوار المستخدمين والصلاحيات
export const ROLES = {
  ADMIN: {
    id: 'admin',
    name: 'مدير النظام',
    permissions: [
      'read:equipment',
      'write:equipment',
      'edit:equipment',
      'delete:equipment',
      'import:excel',
      'read:reports',
      'write:reports',
      'manage:users',
      'backup:data',
      'restore:data',
      'settings:system'
    ]
  },
  TECHNICIAN: {
    id: 'technician',
    name: 'فني / مشرف المشروع',
    permissions: [
      'read:equipment',
      'write:daily_logs',
      'read:daily_logs',
      'write:breakdown_reports',
      'read:breakdown_reports',
      'read:maintenance',
      'write:maintenance_logs'
    ]
  }
}

export class AuthManager {
  /**
   * تسجيل مستخدم جديد
   */
  static registerUser(userData) {
    try {
      if (!userData.username || !userData.password || !userData.email) {
        return { success: false, message: 'جميع الحقول مطلوبة' }
      }

      // التحقق من عدم وجود اسم مستخدم مكرر
      const users = this.getAllUsers()
      if (users.some(u => u.username === userData.username)) {
        return { success: false, message: 'اسم المستخدم موجود بالفعل' }
      }

      const newUser = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        password: this.hashPassword(userData.password),
        role: userData.role || 'technician',
        projectId: userData.projectId || null,
        createdAt: new Date().toISOString(),
        isActive: true
      }

      users.push(newUser)
      localStorage.setItem(DB_KEY, JSON.stringify(users))

      return { success: true, message: 'تم إنشاء المستخدم بنجاح', user: { ...newUser, password: undefined } }
    } catch (error) {
      console.error('خطأ في تسجيل المستخدم:', error)
      return { success: false, message: error.message }
    }
  }

  /**
   * تسجيل الدخول
   */
  static login(username, password) {
    try {
      const users = this.getAllUsers()
      const user = users.find(u => u.username === username && u.isActive)

      if (!user) {
        return { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' }
      }

      if (!this.verifyPassword(password, user.password)) {
        return { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' }
      }

      // إنشاء جلسة
      const session = {
        userId: user.id,
        username: user.username,
        role: user.role,
        projectId: user.projectId,
        loginTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 ساعة
      }

      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ ...user, password: undefined }))
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session))

      return { success: true, message: 'تم تسجيل الدخول بنجاح', user: { ...user, password: undefined } }
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error)
      return { success: false, message: error.message }
    }
  }

  /**
   * تسجيل الخروج
   */
  static logout() {
    try {
      localStorage.removeItem(CURRENT_USER_KEY)
      localStorage.removeItem(CURRENT_SESSION_KEY)
      return { success: true, message: 'تم تسجيل الخروج بنجاح' }
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error)
      return { success: false, message: error.message }
    }
  }

  /**
   * الحصول على المستخدم الحالي
   */
  static getCurrentUser() {
    try {
      const user = localStorage.getItem(CURRENT_USER_KEY)
      return user ? JSON.parse(user) : null
    } catch (error) {
      console.error('خطأ في استرجاع المستخدم الحالي:', error)
      return null
    }
  }

  /**
   * التحقق من صحة الجلسة
   */
  static isSessionValid() {
    try {
      const session = localStorage.getItem(CURRENT_SESSION_KEY)
      if (!session) return false

      const sessionData = JSON.parse(session)
      const expiresAt = new Date(sessionData.expiresAt)
      const now = new Date()

      return now < expiresAt
    } catch (error) {
      console.error('خطأ في التحقق من الجلسة:', error)
      return false
    }
  }

  /**
   * التحقق من وجود صلاحية محددة
   */
  static hasPermission(permission) {
    const currentUser = this.getCurrentUser()
    if (!currentUser) return false

    const role = ROLES[currentUser.role]
    return role && role.permissions.includes(permission)
  }

  /**
   * التحقق من وجود دور محدد
   */
  static hasRole(role) {
    const currentUser = this.getCurrentUser()
    return currentUser && currentUser.role === role
  }

  /**
   * الحصول على جميع المستخدمين (للمسؤول فقط)
   */
  static getAllUsers() {
    try {
      if (!this.hasPermission('manage:users')) {
        return []
      }
      const users = localStorage.getItem(DB_KEY)
      return users ? JSON.parse(users) : this.initializeDefaultUsers()
    } catch (error) {
      console.error('خطأ في استرجاع المستخدمين:', error)
      return []
    }
  }

  /**
   * تهيئة المستخدمين الافتراضيين
   */
  static initializeDefaultUsers() {
    const defaultUsers = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@siac.com',
        password: this.hashPassword('admin123'),
        role: 'admin',
        projectId: null,
        createdAt: new Date().toISOString(),
        isActive: true
      },
      {
        id: '2',
        username: 'technician1',
        email: 'tech1@siac.com',
        password: this.hashPassword('tech123'),
        role: 'technician',
        projectId: 'PRJ_001',
        createdAt: new Date().toISOString(),
        isActive: true
      }
    ]

    localStorage.setItem(DB_KEY, JSON.stringify(defaultUsers))
    return defaultUsers
  }

  /**
   * تشفير كلمة المرور (تشفير بسيط - يجب استخدام bcrypt في الإنتاج)
   */
  static hashPassword(password) {
    // تنبيه: هذا تشفير بسيط للاختبار فقط
    // في الإنتاج، استخدم bcrypt أو argon2
    return btoa(password)
  }

  /**
   * التحقق من كلمة المرور
   */
  static verifyPassword(password, hash) {
    return btoa(password) === hash
  }

  /**
   * تفعيل أو تعطيل مستخدم
   */
  static toggleUserStatus(userId, isActive) {
    try {
      if (!this.hasPermission('manage:users')) {
        return { success: false, message: 'لا توجد صلاحية' }
      }

      const users = this.getAllUsers()
      const user = users.find(u => u.id === userId)
      if (!user) {
        return { success: false, message: 'المستخدم غير موجود' }
      }

      user.isActive = isActive
      localStorage.setItem(DB_KEY, JSON.stringify(users))

      return { success: true, message: `تم ${isActive ? 'تفعيل' : 'تعطيل'} المستخدم بنجاح` }
    } catch (error) {
      console.error('خطأ في تغيير حالة المستخدم:', error)
      return { success: false, message: error.message }
    }
  }
}
