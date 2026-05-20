/**
 * مدير قاعدة البيانات المحلية
 * يستخدم localStorage كوسيط مؤقت
 * (سيتم الربط بـ MongoDB و Google Drive لاحقاً)
 */

const DB_KEYS = {
  EQUIPMENT: 'siac_equipment_data',
  MAINTENANCE_STANDARDS: 'siac_maintenance_standards',
  DAILY_LOGS: 'siac_daily_logs',
  BREAKDOWN_REPORTS: 'siac_breakdown_reports',
  USERS: 'siac_users',
  IMPORT_HISTORY: 'siac_import_history',
  BACKUP: 'siac_backup_'
}

export class DatabaseManager {
  /**
   * حفظ بيانات المعدات
   */
  static saveEquipment(equipmentArray) {
    try {
      localStorage.setItem(DB_KEYS.EQUIPMENT, JSON.stringify(equipmentArray))
      this.logImportHistory('equipment', equipmentArray.length, 'نجح')
      return { success: true, message: 'تم حفظ بيانات المعدات بنجاح' }
    } catch (error) {
      console.error('خطأ في حفظ المعدات:', error)
      return { success: false, message: error.message }
    }
  }

  /**
   * حفظ معايير الصيانة
   */
  static saveMaintenanceStandards(standardsArray) {
    try {
      localStorage.setItem(DB_KEYS.MAINTENANCE_STANDARDS, JSON.stringify(standardsArray))
      this.logImportHistory('maintenance_standards', standardsArray.length, 'نجح')
      return { success: true, message: 'تم حفظ معايير الصيانة بنجاح' }
    } catch (error) {
      console.error('خطأ في حفظ معايير الصيانة:', error)
      return { success: false, message: error.message }
    }
  }

  /**
   * استرجاع جميع المعدات
   */
  static getAllEquipment() {
    try {
      const data = localStorage.getItem(DB_KEYS.EQUIPMENT)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('خطأ في استرجاع المعدات:', error)
      return []
    }
  }

  /**
   * استرجاع المعدات حسب المشروع
   */
  static getEquipmentByProject(projectId) {
    try {
      const allEquipment = this.getAllEquipment()
      return allEquipment.filter(eq => eq.currentProjectId === projectId)
    } catch (error) {
      console.error('خطأ في استرجاع المعدات:', error)
      return []
    }
  }

  /**
   * استرجاع معدة بواسطة الكود
   */
  static getEquipmentByCode(equipmentCode) {
    try {
      const allEquipment = this.getAllEquipment()
      return allEquipment.find(eq => eq.equipmentCode === equipmentCode)
    } catch (error) {
      console.error('خطأ في البحث عن المعدة:', error)
      return null
    }
  }

  /**
   * استرجاع جميع معايير الصيانة
   */
  static getAllMaintenanceStandards() {
    try {
      const data = localStorage.getItem(DB_KEYS.MAINTENANCE_STANDARDS)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('خطأ في استرجاع معايير الصيانة:', error)
      return []
    }
  }

  /**
   * تحديث أو إدراج المعدة (Upsert Logic)
   * إذا كان الكود موجود → تحديث
   * إذا كان جديد → إضافة
   */
  static upsertEquipment(newEquipment) {
    try {
      const allEquipment = this.getAllEquipment()
      const existingIndex = allEquipment.findIndex(eq => eq.equipmentCode === newEquipment.equipmentCode)
      
      if (existingIndex !== -1) {
        // تحديث البيانات الحالية مع الحفاظ على السجل التاريخي
        const existing = allEquipment[existingIndex]
        allEquipment[existingIndex] = {
          ...existing,
          ...newEquipment,
          updatedAt: new Date().toISOString(),
          // الحفاظ على السجلات التاريخية
          maintenanceHistory: existing.maintenanceHistory || [],
          dailyLogs: existing.dailyLogs || []
        }
      } else {
        // إضافة معدة جديدة
        newEquipment.createdAt = new Date().toISOString()
        newEquipment.updatedAt = new Date().toISOString()
        newEquipment.maintenanceHistory = []
        newEquipment.dailyLogs = []
        allEquipment.push(newEquipment)
      }
      
      localStorage.setItem(DB_KEYS.EQUIPMENT, JSON.stringify(allEquipment))
      return { success: true, message: 'تم تحديث البيانات بنجاح' }
    } catch (error) {
      console.error('خطأ في تحديث المعدة:', error)
      return { success: false, message: error.message }
    }
  }

  /**
   * حذف معدة
   */
  static deleteEquipment(equipmentCode) {
    try {
      const allEquipment = this.getAllEquipment()
      const filtered = allEquipment.filter(eq => eq.equipmentCode !== equipmentCode)
      localStorage.setItem(DB_KEYS.EQUIPMENT, JSON.stringify(filtered))
      return { success: true, message: 'تم حذف المعدة بنجاح' }
    } catch (error) {
      console.error('خطأ في حذف المعدة:', error)
      return { success: false, message: error.message }
    }
  }

  /**
   * أخذ نسخة احتياطية (Snapshot) من البيانات الحالية
   */
  static createSnapshot() {
    try {
      const equipment = this.getAllEquipment()
      const standards = this.getAllMaintenanceStandards()
      const timestamp = new Date().toISOString()
      
      const snapshot = {
        timestamp,
        equipmentCount: equipment.length,
        standardsCount: standards.length,
        equipment,
        standards
      }
      
      const backupKey = `${DB_KEYS.BACKUP}${timestamp}`
      localStorage.setItem(backupKey, JSON.stringify(snapshot))
      
      this.logImportHistory('backup', 1, 'نجح', `نسخة احتياطية في ${timestamp}`)
      
      return { success: true, timestamp, backupKey }
    } catch (error) {
      console.error('خطأ في إنشاء النسخة الاحتياطية:', error)
      return { success: false, message: error.message }
    }
  }

  /**
   * استرجاع نسخة احتياطية
   */
  static restoreSnapshot(backupKey) {
    try {
      const snapshot = localStorage.getItem(backupKey)
      if (!snapshot) {
        return { success: false, message: 'النسخة الاحتياطية غير موجودة' }
      }
      
      const data = JSON.parse(snapshot)
      localStorage.setItem(DB_KEYS.EQUIPMENT, JSON.stringify(data.equipment))
      localStorage.setItem(DB_KEYS.MAINTENANCE_STANDARDS, JSON.stringify(data.standards))
      
      this.logImportHistory('restore', 1, 'نجح', `استعادة من ${data.timestamp}`)
      
      return { success: true, message: 'تم استعادة البيانات بنجاح' }
    } catch (error) {
      console.error('خطأ في استعادة النسخة الاحتياطية:', error)
      return { success: false, message: error.message }
    }
  }

  /**
   * تنظيف كامل البيانات (استخدام بحذر!)
   */
  static clearAllData() {
    try {
      localStorage.removeItem(DB_KEYS.EQUIPMENT)
      localStorage.removeItem(DB_KEYS.MAINTENANCE_STANDARDS)
      return { success: true, message: 'تم تنظيف البيانات بنجاح' }
    } catch (error) {
      console.error('خطأ في تنظيف البيانات:', error)
      return { success: false, message: error.message }
    }
  }

  /**
   * تسجيل سجل الاستيراد
   */
  static logImportHistory(type, count, status, details = '') {
    try {
      const history = localStorage.getItem(DB_KEYS.IMPORT_HISTORY)
      const logs = history ? JSON.parse(history) : []
      
      logs.push({
        timestamp: new Date().toISOString(),
        type,
        count,
        status,
        details
      })
      
      // الاحتفاظ بآخر 50 عملية فقط
      if (logs.length > 50) {
        logs.shift()
      }
      
      localStorage.setItem(DB_KEYS.IMPORT_HISTORY, JSON.stringify(logs))
    } catch (error) {
      console.error('خطأ في تسجيل سجل الاستيراد:', error)
    }
  }

  /**
   * الحصول على سجل الاستيراد
   */
  static getImportHistory() {
    try {
      const history = localStorage.getItem(DB_KEYS.IMPORT_HISTORY)
      return history ? JSON.parse(history) : []
    } catch (error) {
      console.error('خطأ في استرجاع سجل الاستيراد:', error)
      return []
    }
  }

  /**
   * إحصائيات النظام
   */
  static getSystemStats() {
    try {
      const equipment = this.getAllEquipment()
      const standards = this.getAllMaintenanceStandards()
      const history = this.getImportHistory()
      
      return {
        totalEquipment: equipment.length,
        totalStandards: standards.length,
        lastImportDate: history.length > 0 ? history[history.length - 1].timestamp : 'لم يتم استيراد بعد',
        totalImports: history.length,
        equipmentByStatus: this.countByStatus(equipment),
        equipmentByProject: this.countByProject(equipment)
      }
    } catch (error) {
      console.error('خطأ في حساب الإحصائيات:', error)
      return {}
    }
  }

  /**
   * عد المعدات حسب الحالة
   */
  static countByStatus(equipment) {
    const counts = {}
    equipment.forEach(eq => {
      const status = eq.status || 'غير محدد'
      counts[status] = (counts[status] || 0) + 1
    })
    return counts
  }

  /**
   * عد المعدات حسب المشروع
   */
  static countByProject(equipment) {
    const counts = {}
    equipment.forEach(eq => {
      const project = eq.currentProjectName || 'بدون مشروع'
      counts[project] = (counts[project] || 0) + 1
    })
    return counts
  }
}
