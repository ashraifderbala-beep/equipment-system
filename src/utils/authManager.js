/**
 * نظام إدارة المصادقة والصلاحيات (Authentication & Authorization)
 * Role-Based Access Control (RBAC)
 * 
 * أنواع المستخدمين:
 * - Admin (مدير النظام): صلاحيات كاملة
 * - Technician (فني/مشرف مشروع): صلاحيات محدودة لمشروعه فقط
 * - Viewer (عارض): قراءة فقط
 */

// قائمة المستخدمين الافتراضية
const defaultUsers = [
  {
    userId: 'ADM_001',
    username: 'admin',
    password: 'siac_admin_2026',  // في الواقع يجب تشفيرها بـ bcrypt
    fullName: 'مدير النظام الرئيسي',
    email: 'admin@siac.com',
    role: 'Admin',
    department: 'إدارة المعدات والصيانة',
    assignedProjects: null,  // Admin يرى جميع المشاريع
    permissions: [
      'read_equipment',
      'create_equipment',
      'update_equipment',
      'delete_equipment',
      'upload_excel',
      'manage_users',
      'view_reports',
      'manage_backup',
      'view_all_projects'
    ],
    isActive: true,
    createdAt: '2026-01-01'
  },
  {
    userId: 'TECH_001',
    username: 'technician_prj001',
    password: 'tech_2026',
    fullName: 'محمد علي - فني مشروع',
    email: 'tech1@siac.com',
    role: 'Technician',
    department: 'الموقع الفني - المشروع الأول',
    assignedProjects: ['PRJ_001'],  // مسؤول عن مشروع واحد فقط
    permissions: [
      'read_equipment',
      'log_daily_hours',
      'report_breakdown',
      'view_own_project_reports'
    ],
    isActive: true,
    createdAt: '2026-02-15'
  },
  {
    userId: 'TECH_002',
    username: 'technician_prj002',
    password: 'tech_2026',
    fullName: 'أحمد خالد - فني مشروع',
    email: 'tech2@siac.com',
    role: 'Technician',
    department: 'الموقع الفني - المشروع الثاني',
    assignedProjects: ['PRJ_002', 'PRJ_003'],  // قد يكون مسؤولاً عن عدة مشاريع
    permissions: [
      'read_equipment',
      'log_daily_hours',
      'report_breakdown',
      'view_own_project_reports'
    ],
    isActive: true,
    createdAt: '2026-02-15'
  }
]

/**
 * فئة إدارة المصادقة
 */
export class AuthManager {
  constructor() {
    this.currentUser = this.loadFromStorage()
    this.users = this.loadUsersFromStorage() || defaultUsers
  }

  /**
   * تسجيل الدخول
   * @param {string} username - اسم المستخدم
   * @param {string} password - كلمة المرور
   * @returns {Object} - بيانات المستخدم أو null
   */
  login(username, password) {
    const user = this.users.find(
      u => u.username === username && u.password === password && u.isActive
    )

    if (user) {
      this.currentUser = { ...user }
      delete this.currentUser.password  // لا نخزن كلمة المرور
      this.saveToStorage(this.currentUser)
      return this.currentUser
    }

    return null
  }

  /**
   * تسجيل الخروج
   */
  logout() {
    this.currentUser = null
    localStorage.removeItem('currentUser')
  }

  /**
   * التحقق من تسجيل الدخول
   */
  isLoggedIn() {
    return this.currentUser !== null
  }

  /**
   * الحصول على بيانات المستخدم الحالي
   */
  getCurrentUser() {
    return this.currentUser
  }

  /**
   * التحقق من صلاحية معينة
   * @param {string} permission - اسم الصلاحية
   * @returns {boolean}
   */
  hasPermission(permission) {
    if (!this.currentUser) return false
    return this.currentUser.permissions.includes(permission)
  }

  /**
   * التحقق من أن المستخدم هو Admin
   */
  isAdmin() {
    return this.currentUser?.role === 'Admin'
  }

  /**
   * التحقق من أن المستخدم هو Technician
   */
  isTechnician() {
    return this.currentUser?.role === 'Technician'
  }

  /**
   * التحقق من إمكانية الوصول لمشروع معين
   * @param {string} projectId - معرف المشروع
   */
  canAccessProject(projectId) {
    if (this.isAdmin()) return true  // Admin يرى كل المشاريع
    return this.currentUser?.assignedProjects?.includes(projectId) || false
  }

  /**
   * الحصول على قائمة المشاريع المتاح للمستخدم
   */
  getAccessibleProjects() {
    if (this.isAdmin()) return null  // null يعني جميع المشاريع
    return this.currentUser?.assignedProjects || []
  }

  /**
   * حفظ المستخدم الحالي في localStorage
   */
  saveToStorage(user) {
    localStorage.setItem('currentUser', JSON.stringify(user))
  }

  /**
   * تحميل المستخدم من localStorage
   */
  loadFromStorage() {
    const stored = localStorage.getItem('currentUser')
    return stored ? JSON.parse(stored) : null
  }

  /**
   * حفظ قائمة المستخدمين
   */
  saveUsersToStorage(users) {
    localStorage.setItem('users', JSON.stringify(users))
    this.users = users
  }

  /**
   * تحميل قائمة المستخدمين
   */
  loadUsersFromStorage() {
    const stored = localStorage.getItem('users')
    return stored ? JSON.parse(stored) : null
  }

  /**
   * إضافة مستخدم جديد (فقط Admin)
   */
  addUser(newUser) {
    if (!this.isAdmin()) {
      throw new Error('فقط مدير النظام يمكنه إضافة مستخدمين جدد')
    }

    // التحقق من عدم وجود المستخدم مسبقاً
    if (this.users.find(u => u.username === newUser.username)) {
      throw new Error('اسم المستخدم موجود بالفعل')
    }

    const user = {
      userId: `USER_${Date.now()}`,
      ...newUser,
      createdAt: new Date().toISOString()
    }

    this.users.push(user)
    this.saveUsersToStorage(this.users)
    return user
  }

  /**
   * تحديث بيانات مستخدم (فقط Admin)
   */
  updateUser(userId, updates) {
    if (!this.isAdmin()) {
      throw new Error('فقط مدير النظام يمكنه تحديث بيانات المستخدمين')
    }

    const user = this.users.find(u => u.userId === userId)
    if (!user) throw new Error('المستخدم غير موجود')

    Object.assign(user, updates)
    this.saveUsersToStorage(this.users)
    return user
  }

  /**
   * حذف مستخدم (فقط Admin)
   */
  deleteUser(userId) {
    if (!this.isAdmin()) {
      throw new Error('فقط مدير النظام يمكنه حذف المستخدمين')
    }

    this.users = this.users.filter(u => u.userId !== userId)
    this.saveUsersToStorage(this.users)
  }

  /**
   * الحصول على قائمة جميع المستخدمين (فقط Admin)
   */
  getAllUsers() {
    if (!this.isAdmin()) {
      throw new Error('فقط مدير النظام يمكنه عرض قائمة المستخدمين')
    }
    return this.users.map(u => ({ ...u, password: undefined }))
  }
}

// تصدير نسخة واحدة (Singleton)
export const authManager = new AuthManager()
