/**
 * محرك حساب دورات الصيانة (W, A, B)
 */

import { DatabaseManager } from './databaseManager'

export class MaintenanceCalculator {
  /**
   * حساب الصيانة التالية لمعدة
   * @param {Object} equipment - بيانات المعدة
   * @returns {Object} - معلومات الصيانة التالية
   */
  static calculateNextMaintenance(equipment) {
    try {
      const standards = DatabaseManager.getAllMaintenanceStandards()
      const currentHours = equipment.operatingHours?.total || 0
      
      // البحث عن معايير الصيانة المنطبقة على هذه المعدة
      const applicableStandards = standards.filter(s => 
        s.applicableEquipmentTypes.includes(equipment.equipmentType)
      )
      
      let nextMaintenance = null
      let minHoursDifference = Infinity
      
      applicableStandards.forEach(standard => {
        if (standard.type === 'W') {
          // صيانة W - دورية منتظمة
          const frequency = Number(standard.frequency) || 60
          const lastDoneHours = equipment.maintenance?.lastServiceHours || 0
          const nextDueHours = lastDoneHours + frequency
          
          if (nextDueHours > currentHours) {
            const difference = nextDueHours - currentHours
            if (difference < minHoursDifference) {
              minHoursDifference = difference
              nextMaintenance = {
                type: 'W',
                standardId: standard.standardId,
                name: standard.name,
                nextThreshold: nextDueHours,
                currentHours,
                hoursRemaining: difference,
                priority: standard.priority,
                estimatedCost: standard.estimatedCost,
                estimatedDuration: standard.estimatedDuration
              }
            }
          }
        } else if (standard.type === 'A' || standard.type === 'B') {
          // صيانة A و B - بناءً على عتبات محددة
          const thresholds = Array.isArray(standard.thresholds) 
            ? standard.thresholds 
            : standard.thresholds.split(',').map(t => Number(t.trim()))
          
          for (const threshold of thresholds) {
            const thresholdHours = Number(threshold)
            if (thresholdHours > currentHours) {
              const difference = thresholdHours - currentHours
              if (difference < minHoursDifference) {
                minHoursDifference = difference
                nextMaintenance = {
                  type: standard.type,
                  standardId: standard.standardId,
                  name: standard.name,
                  nextThreshold: thresholdHours,
                  currentHours,
                  hoursRemaining: difference,
                  priority: standard.priority,
                  estimatedCost: standard.estimatedCost,
                  estimatedDuration: standard.estimatedDuration
                }
              }
              break // نأخذ أول عتبة متبقية
            }
          }
        }
      })
      
      return nextMaintenance
    } catch (error) {
      console.error('خطأ في حساب الصيانة التالية:', error)
      return null
    }
  }

  /**
   * حساب نسبة التقدم نحو الصيانة التالية
   */
  static calculateProgressPercentage(currentHours, nextThreshold, previousThreshold = null) {
    if (!nextThreshold || nextThreshold <= currentHours) return 100
    
    const prev = previousThreshold || Math.max(0, nextThreshold - 500)
    const range = nextThreshold - prev
    const progress = currentHours - prev
    
    return Math.min(Math.round((progress / range) * 100), 99)
  }

  /**
   * الحصول على قائمة المعدات التي تحتاج صيانة عاجلة
   */
  static getUrgentMaintenanceList() {
    try {
      const equipment = DatabaseManager.getAllEquipment()
      const urgentList = []
      
      equipment.forEach(eq => {
        const nextMaintenance = this.calculateNextMaintenance(eq)
        if (nextMaintenance && nextMaintenance.hoursRemaining < 50) {
          urgentList.push({
            ...eq,
            ...nextMaintenance,
            urgencyLevel: nextMaintenance.hoursRemaining < 10 ? 'حرجة' : 'عالية'
          })
        }
      })
      
      // ترتيب حسب الأولوية
      return urgentList.sort((a, b) => a.hoursRemaining - b.hoursRemaining)
    } catch (error) {
      console.error('خطأ في الحصول على قائمة الصيانة العاجلة:', error)
      return []
    }
  }

  /**
   * إنشاء تقرير صيانة شامل
   */
  static generateMaintenanceReport() {
    try {
      const equipment = DatabaseManager.getAllEquipment()
      const report = {
        generatedAt: new Date().toISOString(),
        totalEquipment: equipment.length,
        maintenanceByType: {
          W: [],
          A: [],
          B: []
        },
        urgentMaintenance: [],
        statistics: {}
      }
      
      equipment.forEach(eq => {
        const nextMaintenance = this.calculateNextMaintenance(eq)
        if (nextMaintenance) {
          report.maintenanceByType[nextMaintenance.type].push({
            equipmentCode: eq.equipmentCode,
            equipmentName: eq.equipmentName,
            ...nextMaintenance
          })
          
          if (nextMaintenance.hoursRemaining < 50) {
            report.urgentMaintenance.push({
              equipmentCode: eq.equipmentCode,
              equipmentName: eq.equipmentName,
              ...nextMaintenance
            })
          }
        }
      })
      
      // حساب الإحصائيات
      report.statistics = {
        totalW: report.maintenanceByType.W.length,
        totalA: report.maintenanceByType.A.length,
        totalB: report.maintenanceByType.B.length,
        totalUrgent: report.urgentMaintenance.length,
        estimatedTotalCost: this.calculateTotalCost(report)
      }
      
      return report
    } catch (error) {
      console.error('خطأ في إنشاء تقرير الصيانة:', error)
      return null
    }
  }

  /**
   * حساب التكلفة الإجمالية المتوقعة
   */
  static calculateTotalCost(report) {
    let total = 0
    Object.values(report.maintenanceByType).forEach(typeArray => {
      typeArray.forEach(item => {
        total += item.estimatedCost || 0
      })
    })
    return total
  }
}
