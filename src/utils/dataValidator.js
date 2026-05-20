/**
 * أداة التحقق من صحة البيانات المرفوعة
 */

/**
 * التحقق من صحة بيانات المعدات
 * @param {Array} equipmentArray - مصفوفة المعدات
 * @param {Array} projectsList - قائمة المشاريع
 * @returns {Object} - {isValid: boolean, errors: Array, warnings: Array}
 */
export function validateEquipmentData(equipmentArray, projectsList) {
  const errors = []
  const warnings = []
  const processedCodes = new Set()
  
  if (!equipmentArray || equipmentArray.length === 0) {
    errors.push('لا توجد بيانات معدات للتحقق منها')
    return { isValid: false, errors, warnings }
  }
  
  equipmentArray.forEach((equipment, index) => {
    const rowNumber = index + 2 // لأن الصف الأول رؤوس الأعمدة
    
    // التحقق من وجود كود المعدة
    if (!equipment['Equipment Code'] || equipment['Equipment Code'].trim() === '') {
      errors.push(`الصف ${rowNumber}: كود المعدة مفقود`)
    } else {
      // التحقق من عدم تكرار الكود
      if (processedCodes.has(equipment['Equipment Code'])) {
        errors.push(`الصف ${rowNumber}: كود المعدة "${equipment['Equipment Code']}" مكرر في الملف`)
      }
      processedCodes.add(equipment['Equipment Code'])
    }
    
    // التحقق من اسم المعدة
    if (!equipment['Equipment Name'] || equipment['Equipment Name'].trim() === '') {
      errors.push(`الصف ${rowNumber}: اسم المعدة مفقود`)
    }
    
    // التحقق من نوع المعدة
    if (!equipment['Equipment Type'] || equipment['Equipment Type'].trim() === '') {
      warnings.push(`الصف ${rowNumber}: نوع المعدة غير محدد`)
    }
    
    // التحقق من تاريخ انتهاء الرخصة
    if (equipment['License End Date']) {
      const licenseDate = new Date(equipment['License End Date'])
      const today = new Date()
      
      if (isNaN(licenseDate.getTime())) {
        errors.push(`الصف ${rowNumber}: صيغة التاريخ غير صحيحة: ${equipment['License End Date']}`)
      } else if (licenseDate < today) {
        warnings.push(`الصف ${rowNumber}: رخصة المعدة "${equipment['Equipment Name']}" منتهية الصلاحية`)
      } else {
        const daysUntilExpire = Math.floor((licenseDate - today) / (1000 * 60 * 60 * 24))
        if (daysUntilExpire < 30) {
          warnings.push(`الصف ${rowNumber}: رخصة المعدة ستنتهي بعد ${daysUntilExpire} يوم فقط`)
        }
      }
    }
    
    // التحقق من المشروع
    if (!equipment['Project Name'] || equipment['Project Name'].trim() === '') {
      warnings.push(`الصف ${rowNumber}: المعدة لم يتم تخصيصها لمشروع`)
    } else {
      const projectExists = projectsList.some(p => p.name === equipment['Project Name'])
      if (!projectExists) {
        warnings.push(`الصف ${rowNumber}: المشروع "${equipment['Project Name']}" غير موجود في قائمة المشاريع`)
      }
    }
    
    // التحقق من الحالة
    const validStatuses = ['تشغيل', 'توقف', 'صيانة', 'معطلة']
    if (equipment['Status'] && !validStatuses.includes(equipment['Status'])) {
      warnings.push(`الصف ${rowNumber}: حالة غير معروفة: ${equipment['Status']}`)
    }
  })
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    processedCount: processedCodes.size
  }
}

/**
 * التحقق من صحة معايير الصيانة
 * @param {Array} standards - مصفوفة معايير الصيانة
 * @returns {Object} - {isValid: boolean, errors: Array, warnings: Array}
 */
export function validateMaintenanceStandards(standards) {
  const errors = []
  const warnings = []
  
  if (!standards || standards.length === 0) {
    errors.push('لا توجد معايير صيانة للتحقق منها')
    return { isValid: false, errors, warnings }
  }
  
  standards.forEach((standard, index) => {
    const rowNumber = index + 2
    
    // التحقق من النوع
    if (!['W', 'A', 'B'].includes(standard['Type'])) {
      errors.push(`الصف ${rowNumber}: نوع الصيانة يجب أن يكون W أو A أو B`)
    }
    
    // التحقق من الاسم
    if (!standard['Name'] || standard['Name'].trim() === '') {
      errors.push(`الصف ${rowNumber}: اسم معيار الصيانة مفقود`)
    }
    
    // التحقق من القيم الرقمية
    if (standard['Type'] === 'W' && standard['Frequency']) {
      if (isNaN(Number(standard['Frequency']))) {
        errors.push(`الصف ${rowNumber}: التكرار يجب أن يكون رقم`)
      }
    }
    
    if (['A', 'B'].includes(standard['Type']) && standard['Thresholds']) {
      const thresholds = standard['Thresholds'].toString().split(',')
      thresholds.forEach(t => {
        if (isNaN(Number(t.trim()))) {
          errors.push(`الصف ${rowNumber}: العتبات يجب أن تكون أرقام مفصولة بفواصل`)
        }
      })
    }
  })
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    processedCount: standards.length
  }
}

/**
 * دالة عامة للتحقق من صحة البيانات الأساسية
 */
export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function isValidDate(dateString) {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}
