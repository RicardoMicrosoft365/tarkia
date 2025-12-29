'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Settings, 
  Calculator, 
  Plane, 
  Save,
  RefreshCw,
  LogOut,
  Eye,
  Edit3,
  Users,
  X
} from 'lucide-react'
import { useCalculatorConfig } from '@/hooks/useCalculatorConfig'
import LeadsManager from '@/components/admin/LeadsManager'

interface CalculatorConfig {
  // Business Calculator
  business: {
    taxRegimes: {
      simples: { rate: number, description: string }
      presumido: { rate: number, description: string }
      real: { rate: number, description: string }
    }
    companyTypes: {
      unipessoal: { setupCost: number, accountingCost: number, description: string }
      quotas: { setupCost: number, accountingCost: number, description: string }
    }
    freeZones: {
      [key: string]: { name: string, annualCost: number, setupCost: number, visaCost: number, description: string }
    }
    uaeTax: {
      threshold: number
      rate: number
    }
  }
  
  // Real Estate Calculator
  realEstate: {
    emirates: {
      [key: string]: { name: string, appreciationRate: number, averageYield: number, areas: string[] }
    }
    propertyTypes: {
      [key: string]: { name: string, maintenanceRate: number, serviceRate: number }
    }
    costs: {
      registrationFee: number
      brokerageFee: number
      insuranceRate: number
    }
  }
  
  // Cost of Living Calculator
  costOfLiving: {
    countries: {
      [key: string]: { name: string, currency: string, baseCosts: any }
    }
    lifestyles: {
      [key: string]: { name: string, multiplier: number, description: string }
    }
  }
  
  // Visa Calculator
  visa: {
    types: {
      [key: string]: { name: string, description: string, minInvestment: number, validity: number, processingTime: number }
    }
    costs: {
      [key: string]: { visa: number, medical: number, emiratesId: number, documents: number }
    }
    emirates: {
      [key: string]: { name: string, multiplier: number }
    }
  }
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('business')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const router = useRouter()
  
  // Usar o hook de configurações
  const { config, isLoading: configLoading, error: configError, saveConfig, setConfig } = useCalculatorConfig()

  // Verificar autenticação
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = localStorage.getItem('admin_authenticated') === 'true'
      const loginTime = localStorage.getItem('admin_login_time')
      
      if (!isAuth || !loginTime) {
        router.push('/admin/login')
        return
      }
      
      // Verificar se a sessão não expirou (24 horas)
      const now = Date.now()
      const loginTimestamp = parseInt(loginTime)
      const sessionDuration = 24 * 60 * 60 * 1000 // 24 horas
      
      if (now - loginTimestamp > sessionDuration) {
        localStorage.removeItem('admin_authenticated')
        localStorage.removeItem('admin_login_time')
        router.push('/admin/login')
        return
      }
      
      setIsAuthenticated(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router])


  const handleSave = async () => {
    if (!config) return
    
    setIsSaving(true)
    try {
      const result = await saveConfig(config)
      
      if (result.success) {
        setSaveMessage('Configurações salvas com sucesso!')
      } else {
        setSaveMessage(result.error || 'Erro ao salvar configurações')
      }
      
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      setSaveMessage('Erro ao salvar configurações')
      setTimeout(() => setSaveMessage(''), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    localStorage.removeItem('admin_login_time')
    
    // Limpar cookie de autenticação
    document.cookie = 'admin_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    
    router.push('/admin/login')
  }

  if (isLoading || configLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isLoading ? 'Verificando autenticação...' : 'Carregando configurações...'}
          </p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Settings className="w-8 h-8 text-primary-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Painel Administrativo</h1>
                <p className="text-gray-600">Configurações das Calculadoras</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar'}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'business', name: 'Análise Fiscal', icon: Calculator },
                { id: 'visa', name: 'Vistos', icon: Plane },
                { id: 'leads', name: 'Leads', icon: Users }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {saveMessage && (
            <div className={`mb-6 p-4 rounded-lg ${
              saveMessage.includes('sucesso') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {saveMessage}
            </div>
          )}

          {configError && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700">
              Erro ao carregar configurações: {configError}
            </div>
          )}

          {config && (
            <div>
              {activeTab === 'business' && (
                <BusinessConfigTab config={config.business} onChange={(newConfig) => 
                  setConfig(prev => prev ? { ...prev, business: newConfig } : null)
                } />
              )}
              {activeTab === 'visa' && (
                <VisaConfigTab config={config.visa} onChange={(newConfig) => 
                  setConfig(prev => prev ? { ...prev, visa: newConfig } : null)
                } />
              )}
              {activeTab === 'leads' && (
                <LeadsManager />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Componentes de configuração para cada aba
function BusinessConfigTab({ config, onChange }: { config: any, onChange: (config: any) => void }) {
  const [openModal, setOpenModal] = useState<string | null>(null)

  // Garantir que config existe
  if (!config || !config.companyTypes) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Carregando configurações...</p>
      </div>
    )
  }

  // Filtrar apenas tipos brasileiros
  const brazilianCompanyTypes = Object.entries(config.companyTypes || {}).filter(
    ([key]) => key !== 'unipessoal' && key !== 'quotas'
  )
  
  // Debug temporário
  console.log('BusinessConfigTab - Config:', {
    hasConfig: !!config,
    hasCompanyTypes: !!config?.companyTypes,
    companyTypesKeys: Object.keys(config?.companyTypes || {}),
    brazilianCompanyTypes: brazilianCompanyTypes.length
  })

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Configurações - Análise Fiscal</h2>
      
      {/* Regimes Tributários - Cards Clicáveis */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Regimes Tributários - Alíquotas por Tipo de Empresa</h3>
        <p className="text-sm text-gray-600 mb-6">
          Clique em um regime tributário para configurar as alíquotas detalhadas por tipo de empresa.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Simples Nacional */}
          <div 
            onClick={() => setOpenModal('simples')}
            className="bg-white p-6 rounded-lg border-2 border-primary-200 cursor-pointer hover:border-primary-400 hover:shadow-lg transition-all"
          >
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Simples Nacional</h4>
            <p className="text-sm text-gray-600 mb-4">{config.taxRegimes?.simples?.description || ''}</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500">Clique para configurar</span>
              <Edit3 className="w-5 h-5 text-primary-600" />
            </div>
          </div>

          {/* Card Lucro Presumido */}
          <div 
            onClick={() => setOpenModal('presumido')}
            className="bg-white p-6 rounded-lg border-2 border-primary-200 cursor-pointer hover:border-primary-400 hover:shadow-lg transition-all"
          >
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Lucro Presumido</h4>
            <p className="text-sm text-gray-600 mb-4">{config.taxRegimes?.presumido?.description || ''}</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500">Clique para configurar</span>
              <Edit3 className="w-5 h-5 text-primary-600" />
            </div>
          </div>

          {/* Card Lucro Real */}
          <div 
            onClick={() => setOpenModal('real')}
            className="bg-white p-6 rounded-lg border-2 border-primary-200 cursor-pointer hover:border-primary-400 hover:shadow-lg transition-all"
          >
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Lucro Real</h4>
            <p className="text-sm text-gray-600 mb-4">{config.taxRegimes?.real?.description || ''}</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500">Clique para configurar</span>
              <Edit3 className="w-5 h-5 text-primary-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Simples Nacional */}
      {openModal === 'simples' && (
        <TaxRegimeModal
          title="Simples Nacional"
          description={config.taxRegimes?.simples?.description || ''}
          onClose={() => setOpenModal(null)}
        >
          <div className="space-y-4">
            {brazilianCompanyTypes.length > 0 ? (
              brazilianCompanyTypes.map(([companyKey, companyType]: [string, any]) => {
                // Garantir que taxRates existe
                const updatedCompanyType = { ...companyType }
                if (!updatedCompanyType.taxRates) {
                  updatedCompanyType.taxRates = {}
                }
                if (!updatedCompanyType.taxRates.simples) {
                  updatedCompanyType.taxRates.simples = {
                    federal: 0,
                    icms: 0,
                    iss: 0,
                    total: 0
                  }
                }
                
                return (
                  <div key={companyKey} className="bg-gray-50 p-4 rounded-lg border">
                    <h5 className="font-medium text-gray-700 mb-3">{updatedCompanyType.name || companyKey}</h5>
                    <SimplesTaxConfig
                      companyKey={companyKey}
                      companyType={updatedCompanyType}
                      onUpdate={(updated) => {
                        const newConfig = { ...config }
                        newConfig.companyTypes[companyKey] = updated
                        onChange(newConfig)
                      }}
                    />
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg p-6">
                <p className="mb-2">Nenhum tipo de empresa brasileiro encontrado.</p>
                <p className="text-sm">Os tipos esperados são: Indústria, Serviços e Comércio.</p>
                <p className="text-xs mt-2 text-gray-400">
                  Debug: {JSON.stringify(Object.keys(config?.companyTypes || {}))}
                </p>
              </div>
            )}
          </div>
        </TaxRegimeModal>
      )}

      {/* Modal Lucro Presumido */}
      {openModal === 'presumido' && (
        <TaxRegimeModal
          title="Lucro Presumido"
          description={config.taxRegimes?.presumido?.description || ''}
          onClose={() => setOpenModal(null)}
        >
          <div className="space-y-4">
            {brazilianCompanyTypes.length > 0 ? (
              brazilianCompanyTypes.map(([companyKey, companyType]: [string, any]) => {
                // Garantir que taxRates existe
                const updatedCompanyType = { ...companyType }
                if (!updatedCompanyType.taxRates) {
                  updatedCompanyType.taxRates = {}
                }
                if (!updatedCompanyType.taxRates.presumido) {
                  updatedCompanyType.taxRates.presumido = {
                    '2026': { federal: 0, icms: 0, iss: 0, total: 0 },
                    '2027': { federal: 0, icms: 0, iss: 0, total: 0 },
                    '2028': { federal: 0, icms: 0, iss: 0, total: 0 }
                  }
                }
                
                return (
                  <CompanyTypeTaxConfig
                    key={companyKey}
                    companyKey={companyKey}
                    companyType={updatedCompanyType}
                    onUpdate={(updated) => {
                      const newConfig = { ...config }
                      newConfig.companyTypes[companyKey] = updated
                      onChange(newConfig)
                    }}
                    showOnlyRegime="presumido"
                  />
                )
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nenhum tipo de empresa brasileiro configurado. Os tipos disponíveis são: Indústria, Serviços e Comércio.
              </div>
            )}
          </div>
        </TaxRegimeModal>
      )}

      {/* Modal Lucro Real */}
      {openModal === 'real' && (
        <TaxRegimeModal
          title="Lucro Real"
          description={config.taxRegimes?.real?.description || ''}
          onClose={() => setOpenModal(null)}
        >
          <div className="space-y-4">
            {brazilianCompanyTypes.length > 0 ? (
              brazilianCompanyTypes.map(([companyKey, companyType]: [string, any]) => {
                // Garantir que taxRates existe
                const updatedCompanyType = { ...companyType }
                if (!updatedCompanyType.taxRates) {
                  updatedCompanyType.taxRates = {}
                }
                if (!updatedCompanyType.taxRates.real) {
                  updatedCompanyType.taxRates.real = {
                    pis: 0,
                    cofins: 0,
                    irpj: 0,
                    csll: 0,
                    total: 0
                  }
                }
                
                return (
                  <CompanyTypeTaxConfig
                    key={companyKey}
                    companyKey={companyKey}
                    companyType={updatedCompanyType}
                    onUpdate={(updated) => {
                      const newConfig = { ...config }
                      newConfig.companyTypes[companyKey] = updated
                      onChange(newConfig)
                    }}
                    showOnlyRegime="real"
                  />
                )
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nenhum tipo de empresa brasileiro configurado. Os tipos disponíveis são: Indústria, Serviços e Comércio.
              </div>
            )}
          </div>
        </TaxRegimeModal>
      )}

      {/* Free Zones */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Free Zones</h3>
        <div className="space-y-4">
          {Object.entries(config.freeZones).map(([key, zone]: [string, any]) => (
            <div key={key} className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-800 mb-3">{zone.name}</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Custo Anual (USD)</label>
                  <input
                    type="number"
                    value={zone.annualCost}
                    onChange={(e) => {
                      const newConfig = { ...config }
                      newConfig.freeZones[key].annualCost = parseInt(e.target.value)
                      onChange(newConfig)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Setup (USD)</label>
                  <input
                    type="number"
                    value={zone.setupCost}
                    onChange={(e) => {
                      const newConfig = { ...config }
                      newConfig.freeZones[key].setupCost = parseInt(e.target.value)
                      onChange(newConfig)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Visto (USD)</label>
                  <input
                    type="number"
                    value={zone.visaCost}
                    onChange={(e) => {
                      const newConfig = { ...config }
                      newConfig.freeZones[key].visaCost = parseInt(e.target.value)
                      onChange(newConfig)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Descrição</label>
                  <input
                    type="text"
                    value={zone.description}
                    onChange={(e) => {
                      const newConfig = { ...config }
                      newConfig.freeZones[key].description = e.target.value
                      onChange(newConfig)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Imposto UAE */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Imposto Corporativo UAE</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Limite (USD)</label>
            <input
              type="number"
              value={config.uaeTax.threshold}
              onChange={(e) => {
                const newConfig = { ...config }
                newConfig.uaeTax.threshold = parseInt(e.target.value)
                onChange(newConfig)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Taxa (%)</label>
            <input
              type="number"
              step="0.01"
              value={config.uaeTax.rate * 100}
              onChange={(e) => {
                const newConfig = { ...config }
                newConfig.uaeTax.rate = parseFloat(e.target.value) / 100
                onChange(newConfig)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function VisaConfigTab({ config, onChange }: { config: any, onChange: (config: any) => void }) {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Configurações - Vistos e Residência</h2>
      
      {/* Tipos de Visto */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Tipos de Visto</h3>
        <div className="space-y-4">
          {Object.entries(config.types).map(([key, visa]: [string, any]) => (
            <div key={key} className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-800 mb-3">{visa.name}</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Investimento Mínimo (USD)</label>
                  <input
                    type="number"
                    value={visa.minInvestment}
                    onChange={(e) => {
                      const newConfig = { ...config }
                      newConfig.types[key].minInvestment = parseInt(e.target.value)
                      onChange(newConfig)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Validade (anos)</label>
                  <input
                    type="number"
                    value={visa.validity}
                    onChange={(e) => {
                      const newConfig = { ...config }
                      newConfig.types[key].validity = parseInt(e.target.value)
                      onChange(newConfig)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Tempo Processamento (dias)</label>
                  <input
                    type="number"
                    value={visa.processingTime}
                    onChange={(e) => {
                      const newConfig = { ...config }
                      newConfig.types[key].processingTime = parseInt(e.target.value)
                      onChange(newConfig)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Descrição</label>
                  <input
                    type="text"
                    value={visa.description}
                    onChange={(e) => {
                      const newConfig = { ...config }
                      newConfig.types[key].description = e.target.value
                      onChange(newConfig)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custos de Visto */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Custos por Tipo de Visto</h3>
        <div className="space-y-4">
          {Object.entries(config.costs).map(([key, costs]: [string, any]) => (
            <div key={key} className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-800 mb-3">{config.types[key]?.name || key}</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Taxa de Visto (USD)</label>
                  <input
                    type="number"
                    value={costs.visa}
                    onChange={(e) => {
                      const newConfig = { ...config }
                      newConfig.costs[key].visa = parseInt(e.target.value)
                      onChange(newConfig)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Exame Médico (USD)</label>
                  <input
                    type="number"
                    value={costs.medical}
                    onChange={(e) => {
                      const newConfig = { ...config }
                      newConfig.costs[key].medical = parseInt(e.target.value)
                      onChange(newConfig)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Emirates ID (USD)</label>
                  <input
                    type="number"
                    value={costs.emiratesId}
                    onChange={(e) => {
                      const newConfig = { ...config }
                      newConfig.costs[key].emiratesId = parseInt(e.target.value)
                      onChange(newConfig)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Documentação (USD)</label>
                  <input
                    type="number"
                    value={costs.documents}
                    onChange={(e) => {
                      const newConfig = { ...config }
                      newConfig.costs[key].documents = parseInt(e.target.value)
                      onChange(newConfig)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Componente para configurar impostos por tipo de empresa
function CompanyTypeTaxConfig({ 
  companyKey, 
  companyType, 
  onUpdate,
  showOnlyRegime
}: { 
  companyKey: string
  companyType: any
  onUpdate: (updated: any) => void
  showOnlyRegime?: 'presumido' | 'real'
}) {
  const [activeRegime, setActiveRegime] = useState<'presumido' | 'real'>(showOnlyRegime || 'presumido')
  const [activeYear, setActiveYear] = useState<string>('2026')

  const updateTaxRate = (regime: 'presumido' | 'real', year: string | null, field: string, value: number) => {
    const updated = { ...companyType }
    
    if (regime === 'presumido' && year) {
      if (!updated.taxRates.presumido) updated.taxRates.presumido = {}
      if (!updated.taxRates.presumido[year]) updated.taxRates.presumido[year] = { total: 0 }
      updated.taxRates.presumido[year][field] = value
      // Recalcular total
      const yearData = updated.taxRates.presumido[year]
      yearData.total = (yearData.federal || 0) + (yearData.icms || 0) + (yearData.iss || 0)
    } else if (regime === 'real') {
      if (!updated.taxRates.real) updated.taxRates.real = { total: 0 }
      updated.taxRates.real[field] = value
      // Recalcular total
      const realData = updated.taxRates.real
      realData.total = (realData.pis || 0) + (realData.cofins || 0) + (realData.irpj || 0) + (realData.csll || 0)
    }
    
    onUpdate(updated)
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <div className="mb-4">
        <h5 className="font-medium text-gray-800 mb-1">{companyType.name}</h5>
        <p className="text-xs text-gray-600">{companyType.description}</p>
      </div>
      {!showOnlyRegime && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveRegime('presumido')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeRegime === 'presumido'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Lucro Presumido
          </button>
          <button
            onClick={() => setActiveRegime('real')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeRegime === 'real'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Lucro Real
          </button>
        </div>
      )}

      {activeRegime === 'presumido' && (
        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            {['2026', '2027', '2028'].map(year => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                className={`px-3 py-1 rounded text-sm ${
                  activeYear === year
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Federal (%)</label>
              <input
                type="number"
                step="0.0001"
                value={((companyType.taxRates?.presumido?.[activeYear]?.federal || 0) * 100).toFixed(4)}
                onChange={(e) => updateTaxRate('presumido', activeYear, 'federal', parseFloat(e.target.value) / 100)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">ICMS (%)</label>
              <input
                type="number"
                step="0.0001"
                value={((companyType.taxRates?.presumido?.[activeYear]?.icms || 0) * 100).toFixed(4)}
                onChange={(e) => updateTaxRate('presumido', activeYear, 'icms', parseFloat(e.target.value) / 100)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">ISS (%)</label>
              <input
                type="number"
                step="0.0001"
                value={((companyType.taxRates?.presumido?.[activeYear]?.iss || 0) * 100).toFixed(4)}
                onChange={(e) => updateTaxRate('presumido', activeYear, 'iss', parseFloat(e.target.value) / 100)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Total (%)</label>
              <input
                type="number"
                step="0.0001"
                value={((companyType.taxRates?.presumido?.[activeYear]?.total || 0) * 100).toFixed(4)}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
          </div>
        </div>
      )}

      {activeRegime === 'real' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">PIS (%)</label>
            <input
              type="number"
              step="0.0001"
              value={((companyType.taxRates?.real?.pis || 0) * 100).toFixed(4)}
              onChange={(e) => updateTaxRate('real', null, 'pis', parseFloat(e.target.value) / 100)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">COFINS (%)</label>
            <input
              type="number"
              step="0.0001"
              value={((companyType.taxRates?.real?.cofins || 0) * 100).toFixed(4)}
              onChange={(e) => updateTaxRate('real', null, 'cofins', parseFloat(e.target.value) / 100)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">IRPJ (%)</label>
            <input
              type="number"
              step="0.0001"
              value={((companyType.taxRates?.real?.irpj || 0) * 100).toFixed(4)}
              onChange={(e) => updateTaxRate('real', null, 'irpj', parseFloat(e.target.value) / 100)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">CSLL (%)</label>
            <input
              type="number"
              step="0.0001"
              value={((companyType.taxRates?.real?.csll || 0) * 100).toFixed(4)}
              onChange={(e) => updateTaxRate('real', null, 'csll', parseFloat(e.target.value) / 100)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Total (%)</label>
            <input
              type="number"
              step="0.0001"
              value={((companyType.taxRates?.real?.total || 0) * 100).toFixed(4)}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Componente para configurar Simples Nacional
function SimplesTaxConfig({ 
  companyKey, 
  companyType, 
  onUpdate 
}: { 
  companyKey: string
  companyType: any
  onUpdate: (updated: any) => void 
}) {
  const updateTaxRate = (field: string, value: number) => {
    const updated = { ...companyType }
    if (!updated.taxRates.simples) updated.taxRates.simples = {}
    updated.taxRates.simples[field] = value
    
    // Recalcular total baseado nos campos disponíveis
    const simplesData = updated.taxRates.simples
    simplesData.total = (simplesData.federal || 0) + (simplesData.icms || 0) + (simplesData.iss || 0) +
                       (simplesData.pis || 0) + (simplesData.cofins || 0) + (simplesData.irpj || 0) + (simplesData.csll || 0)
    
    onUpdate(updated)
  }

  const simplesRates = companyType.taxRates?.simples || {}

  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Federal (%)</label>
          <input
            type="number"
            step="0.0001"
            value={((simplesRates.federal || 0) * 100).toFixed(4)}
            onChange={(e) => updateTaxRate('federal', parseFloat(e.target.value) / 100)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="5.39"
          />
          <p className="text-xs text-gray-500 mt-1">PIS, COFINS, CSLL, IRPJ</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">ICMS (%)</label>
          <input
            type="number"
            step="0.0001"
            value={((simplesRates.icms || 0) * 100).toFixed(4)}
            onChange={(e) => updateTaxRate('icms', parseFloat(e.target.value) / 100)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="18.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">ISS (%)</label>
          <input
            type="number"
            step="0.0001"
            value={((simplesRates.iss || 0) * 100).toFixed(4)}
            onChange={(e) => updateTaxRate('iss', parseFloat(e.target.value) / 100)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="5.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Total (%)</label>
          <input
            type="number"
            step="0.0001"
            value={((simplesRates.total || 0) * 100).toFixed(4)}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {companyKey === 'industria' || companyKey === 'comercio' 
          ? 'Indústria/Comércio: Federal (5.39%) + ICMS (18%)'
          : 'Serviços: Federal (11.39%) + ISS (5%)'}
      </p>
    </div>
  )
}

// Componente Modal para Regimes Tributários
function TaxRegimeModal({ 
  title, 
  description, 
  children, 
  onClose 
}: { 
  title: string
  description: string
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

