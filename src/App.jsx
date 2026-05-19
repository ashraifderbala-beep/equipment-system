import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import DailyLogs from './pages/DailyLogs'
import MaintenanceCycles from './pages/MaintenanceCycles'
import BreakdownReporting from './pages/BreakdownReporting'
import EquipmentTransfer from './pages/EquipmentTransfer'
import CostsInventory from './pages/CostsInventory'
import './styles/app.css'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [equipmentData, setEquipmentData] = useState([
    {
      id: 'EQ001',
      name: 'حفار CAT 320',
      type: 'excavator',
      project: 'مشروع الطريق السريع',
      status: 'تشغيل',
      hours: 1250,
      km: 0,
      lastMaintenance: '2026-05-01',
      nextMaintenance: '2026-05-20',
      cost: 45000,
      dailyHours: []
    },
    {
      id: 'EQ002',
      name: 'رافعة برج LIEBHERR',
      type: 'crane',
      project: 'مشروع الكومبليكس السكني',
      status: 'تشغيل',
      hours: 890,
      km: 0,
      lastMaintenance: '2026-04-15',
      nextMaintenance: '2026-05-25',
      cost: 38000,
      dailyHours: []
    },
    {
      id: 'EQ003',
      name: 'جرافة KOMATSU',
      type: 'bulldozer',
      project: 'مشروع التطوير الحضري',
      status: 'توقف',
      hours: 2100,
      km: 0,
      lastMaintenance: '2026-03-20',
      nextMaintenance: '2026-06-05',
      cost: 52000,
      dailyHours: []
    },
    {
      id: 'EQ004',
      name: 'خلاط خرسانة VOLVO',
      type: 'mixer',
      project: 'مشروع الطريق السريع',
      status: 'تشغيل',
      hours: 450,
      km: 0,
      lastMaintenance: '2026-04-25',
      nextMaintenance: '2026-05-18',
      cost: 28000,
      dailyHours: []
    },
    {
      id: 'EQ005',
      name: 'جرافة دقيقة BOBCAT',
      type: 'mini-excavator',
      project: 'مشروع الكومبليكس السكني',
      status: 'تشغيل',
      hours: 680,
      km: 0,
      lastMaintenance: '2026-05-05',
      nextMaintenance: '2026-05-22',
      cost: 22000,
      dailyHours: []
    },
    {
      id: 'EQ006',
      name: 'عجالة قلابة HINO',
      type: 'dump-truck',
      project: 'مشروع التطوير الحضري',
      status: 'تشغيل',
      hours: 3400,
      km: 125400,
      lastMaintenance: '2026-04-01',
      nextMaintenance: '2026-05-30',
      cost: 35000,
      dailyHours: []
    }
  ])

  const [breakdownReports, setBreakdownReports] = useState([
    {
      id: 'BR001',
      equipmentId: 'EQ001',
      date: '2026-05-15',
      urgency: 'عالية',
      description: 'تسرب زيت من المحرك',
      status: 'قيد المعالجة'
    },
    {
      id: 'BR002',
      equipmentId: 'EQ003',
      date: '2026-05-10',
      urgency: 'منخفضة',
      description: 'صوت غريب من المحرك',
      status: 'مكتمل'
    }
  ])

  const [transferLogs, setTransferLogs] = useState([
    {
      id: 'TR001',
      equipmentId: 'EQ002',
      fromProject: 'مشروع الطريق السريع',
      toProject: 'مشروع الكومبليكس السكني',
      transferDate: '2026-05-10',
      status: 'مكتمل'
    }
  ])

  const [costs, setCosts] = useState([
    {
      id: 'CS001',
      equipmentId: 'EQ001',
      date: '2026-05-10',
      type: 'زيت محرك',
      amount: 500,
      quantity: 10,
      supplier: 'شركة الزيوت المتقدمة'
    },
    {
      id: 'CS002',
      equipmentId: 'EQ001',
      date: '2026-05-12',
      type: 'فلتر هواء',
      amount: 300,
      quantity: 2,
      supplier: 'المركز الرئيسي للقطع الغيار'
    }
  ])

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard equipmentData={equipmentData} breakdownReports={breakdownReports} costs={costs} />
      case 'daily-logs':
        return <DailyLogs equipmentData={equipmentData} setEquipmentData={setEquipmentData} />
      case 'maintenance-cycles':
        return <MaintenanceCycles equipmentData={equipmentData} />
      case 'breakdown':
        return <BreakdownReporting breakdownReports={breakdownReports} setBreakdownReports={setBreakdownReports} equipmentData={equipmentData} />
      case 'transfers':
        return <EquipmentTransfer transferLogs={transferLogs} setTransferLogs={setTransferLogs} equipmentData={equipmentData} />
      case 'costs':
        return <CostsInventory costs={costs} setCosts={setCosts} equipmentData={equipmentData} />
      default:
        return <Dashboard equipmentData={equipmentData} breakdownReports={breakdownReports} costs={costs} />
    }
  }

  return (
    <div className="app-container">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
