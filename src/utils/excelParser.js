/**
 * أداة قراءة ملفات Excel وتحويلها إلى JSON
 * تدعم صيغ xlsx و csv
 */

/**
 * دالة قراءة ملف Excel
 * @param {File} file - ملف Excel المرفوع
 * @returns {Promise<Array>} - البيانات المقروءة
 */
export async function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = e.target.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' })
        
        resolve(jsonData)
      } catch (error) {
        reject(new Error(`خطأ في قراءة الملف: ${error.message}`))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('فشل في قراءة الملف'))
    }
    
    reader.readAsBinaryString(file)
  })
}

/**
 * دالة التحقق من أن الأعمدة تطابق البنية المتوقعة
 * @param {Array} headers - رؤوس الأعمدة
 * @param {Array} expectedColumns - الأعمدة المتوقعة
 * @returns {Object} - {isValid: boolean, missingColumns: Array}
 */
export function validateColumns(headers, expectedColumns) {
  const headerNames = Object.keys(headers[0] || {})
  const missingColumns = []
  
  expectedColumns.forEach(column => {
    if (!headerNames.includes(column)) {
      missingColumns.push(column)
    }
  })
  
  return {
    isValid: missingColumns.length === 0,
    missingColumns,
    providedColumns: headerNames
  }
}

/**
 * تطبيع أسماء الأعمدة (إزالة المسافات الزائدة)
 */
export function normalizeHeaders(data) {
  if (!data || data.length === 0) return data
  
  return data.map(row => {
    const normalizedRow = {}
    Object.keys(row).forEach(key => {
      const normalizedKey = key.trim()
      normalizedRow[normalizedKey] = row[key]
    })
    return normalizedRow
  })
}
