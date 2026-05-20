/**
 * معايير الصيانة الوقائية لشركة SIAC
 * نظام حزم الصيانة W, A, B
 */

export const maintenanceStandards = [
  // ======================================
  // حزمة W - الصيانة الخفيفة
  // ======================================
  {
    standardId: 'STD_W_001',
    type: 'W',
    name: 'فحص عام خفيف للمعدات الثقيلة',
    frequency: 60,
    applicableEquipmentTypes: ['excavator', 'bulldozer', 'crane', 'dump-truck'],
    requiredSkills: ['فني ميكانيكا'],
    requiredRole: 'technician',
    
    components: [
      'فحص بصري عام للمعدة',
      'فحص مستويات الزيت في المحرك',
      'فحص سوائل التبريد',
      'فحص الفلاتر المرئية',
      'فحص المصابيح والعاكسات',
      'اختبار الفرامل البسيط'
    ],
    
    priority: 'منخفضة',
    estimatedDuration: 30,
    estimatedCost: 300,
    toolsRequired: ['مفتاح برغي', 'مقياس الضغط', 'فانوس'],
    description: 'فحص روتيني خفيف لضمان سلامة العمليات اليومية'
  },

  {
    standardId: 'STD_W_002',
    type: 'W',
    name: 'فحص عام خفيف للمعدات الخفيفة',
    frequency: 120,
    applicableEquipmentTypes: ['mini-excavator', 'mixer', 'compressor'],
    requiredSkills: ['فني معدات خفيفة'],
    requiredRole: 'technician',
    
    components: [
      'فحص بصري عام',
      'فحص الزيت والسوائل',
      'فحص البطارية',
      'فحص الأحزمة والسيور'
    ],
    
    priority: 'منخفضة',
    estimatedDuration: 20,
    estimatedCost: 200,
    toolsRequired: ['أدوات أساسية'],
    description: 'فحص روتيني للمعدات الخفيفة'
  },

  // ======================================
  // حزمة A - الصيانة الوقائية
  // ======================================
  {
    standardId: 'STD_A_001',
    type: 'A',
    name: 'صيانة وقائية - المرحلة الأولى',
    thresholds: [180, 360, 540, 720, 900, 1080],
    applicableEquipmentTypes: ['excavator', 'bulldozer', 'crane'],
    requiredSkills: ['فني ميكانيكا متقدم'],
    requiredRole: 'technician',
    
    components: [
      'فحص بصري دقيق شامل',
      'تشحيم جميع المفاصل والمحاور',
      'فحص السيور والبراغي',
      'فحص وتنظيف الفلاتر',
      'فحص الأسلاك والكابلات',
      'تنظيف مبرد الهواء'
    ],
    
    priority: 'متوسطة',
    estimatedDuration: 120,
    estimatedCost: 1500,
    toolsRequired: ['مجموعة أدوات كاملة', 'زيت تشحيم', 'فرشاة تنظيف'],
    description: 'صيانة وقائية شاملة تظهر بشكل دوري'
  },

  {
    standardId: 'STD_A_002',
    type: 'A',
    name: 'صيانة وقائية للمعدات الخفيفة',
    thresholds: [240, 480, 720],
    applicableEquipmentTypes: ['mini-excavator', 'mixer'],
    requiredSkills: ['فني معدات خفيفة'],
    requiredRole: 'technician',
    
    components: [
      'فحص شامل',
      'تشحيم أساسي',
      'فحص البراغي',
      'تنظيف المرشحات'
    ],
    
    priority: 'متوسطة',
    estimatedDuration: 90,
    estimatedCost: 1000,
    toolsRequired: ['أدوات معيارية'],
    description: 'صيانة وقائية للمعدات الخفيفة'
  },

  // ======================================
  // حزمة B - الصيانة الدورية العميقة
  // ======================================
  {
    standardId: 'STD_B_001',
    type: 'B',
    name: 'صيانة دورية عميقة - الحفريات والجرافات',
    thresholds: [1110, 2000, 3000],
    applicableEquipmentTypes: ['excavator', 'bulldozer'],
    requiredSkills: ['فني ميكانيكا خبير', 'فني هيدروليك'],
    requiredRole: 'technician',
    
    components: [
      'ضبط السير بدقة عالية',
      'فحص شامل لكابلات التحكم',
      'فحص نظام الهيدروليك والأسطوانات',
      'فحص النظام الكهربائي والمولد',
      'فحص محرك الوقود والعادم',
      'استبدال سوائل التبريد والزيت',
      'فحص ودعم القطع الثقيلة',
      'اختبار الأنظمة الكاملة'
    ],
    
    priority: 'عالية جداً',
    estimatedDuration: 480,
    estimatedCost: 5000,
    toolsRequired: ['مجموعة أدوات متقدمة', 'معدات اختبار هيدروليك', 'رافع هيدروليكي'],
    description: 'صيانة عميقة شاملة - صيانة وقائية من الدرجة الأولى'
  },

  {
    standardId: 'STD_B_002',
    type: 'B',
    name: 'صيانة دورية عميقة - الرافعات',
    thresholds: [1500, 2500],
    applicableEquipmentTypes: ['crane'],
    requiredSkills: ['فني رافعات', 'فني هيدروليك متخصص'],
    requiredRole: 'technician',
    
    components: [
      'فحص الكابلات الفولاذية بدقة',
      'فحص آليات الرفع والخفض',
      'فحص نظام الهيدروليك المتقدم',
      'فحص الحمل والأمان',
      'استبدال المأخذ والأكمام',
      'اختبار الحمل الآمن',
      'فحص البرج والهيكل'
    ],
    
    priority: 'عالية جداً',
    estimatedDuration: 600,
    estimatedCost: 7000,
    toolsRequired: ['معدات متخصصة للرافعات', 'أجهزة اختبار الحمل'],
    description: 'صيانة عميقة متخصصة للرافعات والأوناش'
  },

  {
    standardId: 'STD_B_003',
    type: 'B',
    name: 'صيانة دورية عميقة - المركبات',
    thresholds: [2500, 5000],
    applicableEquipmentTypes: ['dump-truck'],
    requiredSkills: ['فني مركبات', 'فني محركات'],
    requiredRole: 'technician',
    
    components: [
      'فحص الماتور الكامل',
      'فحص نظام الناقل',
      'فحص المحاور والعجلات',
      'فحص الفرامل المتقدم',
      'استبدال السوائل الهيدروليكية',
      'فحص نظام التعليق',
      'اختبار الأداء على الطريق'
    ],
    
    priority: 'عالية جداً',
    estimatedDuration: 540,
    estimatedCost: 6000,
    toolsRequired: ['معدات تشخيص محركات متقدمة'],
    description: 'صيانة عميقة للمركبات الثقيلة'
  }
]

export default maintenanceStandards
