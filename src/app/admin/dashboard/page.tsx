'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Settings, 
  Calculator, 
  Building, 
  Plane, 
  ShoppingCart, 
  Compass,
  Save,
  RefreshCw,
  LogOut,
  Eye,
  Edit3
} from 'lucide-react'
import { useCalculatorConfig } from '@/hooks/useCalculatorConfig'

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
                { id: 'realEstate', name: 'Imóveis', icon: Building },
                { id: 'costOfLiving', name: 'Custo de Vida', icon: ShoppingCart },
                { id: 'visa', name: 'Vistos', icon: Plane },
                { id: 'planning', name: 'Planejamento', icon: Compass }
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
              {activeTab === 'realEstate' && (
                <RealEstateConfigTab config={config.realEstate} onChange={(newConfig) => 
                  setConfig(prev => prev ? { ...prev, realEstate: newConfig } : null)
                } />
              )}
              {activeTab === 'costOfLiving' && (
                <CostOfLivingConfigTab config={config.costOfLiving} onChange={(newConfig) => 
                  setConfig(prev => prev ? { ...prev, costOfLiving: newConfig } : null)
                } />
              )}
              {activeTab === 'visa' && (
                <VisaConfigTab config={config.visa} onChange={(newConfig) => 
                  setConfig(prev => prev ? { ...prev, visa: newConfig } : null)
                } />
              )}
              {activeTab === 'planning' && (
                <PlanningConfigTab />
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
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Configurações - Análise Fiscal</h2>
      
      {/* Regimes Tributários */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Regimes Tributários</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(config.taxRegimes).map(([key, regime]: [string, any]) => (
            <div key={key} className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-800 mb-3">{regime.name || key}</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Taxa (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={regime.rate * 100}
                    onChange={(e) => {
                      const newConfig = { ...config }
                      newConfig.taxRegimes[key].rate = parseFloat(e.target.value) / 100
                      onChange(newConfig)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Descrição</label>
                  <input
                    type="text"
                    value={regime.description}
                    onChange={(e) => {
                      const newConfig = { ...config }
                      newConfig.taxRegimes[key].description = e.target.value
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

function RealEstateConfigTab({ config, onChange }: { config: any, onChange: (config: any) => void }) {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Configurações - Investimento Imobiliário</h2>
      
      {/* Emirados */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Emirados</h3>
        <div className="space-y-4">
          {Object.entries(config.emirates).map(([key, emirate]: [string, any]) => (
            <div key={key} className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-800 mb-3">{emirate.name}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Taxa de Valorização (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={emirate.appreciationRate * 100}
                    onChange={(e) => {
                      const newConfig = { ...config }
                      newConfig.emirates[key].appreciationRate = parseFloat(e.target.value) / 100
                      onChange(newConfig)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Yield Médio (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={emirate.averageYield * 100}
                    onChange={(e) => {
                      const newConfig = { ...config }
                      newConfig.emirates[key].averageYield = parseFloat(e.target.value) / 100
                      onChange(newConfig)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Áreas (separadas por vírgula)</label>
                  <input
                    type="text"
                    value={emirate.areas.join(', ')}
                    onChange={(e) => {
                      const newConfig = { ...config }
                      newConfig.emirates[key].areas = e.target.value.split(',').map((area: string) => area.trim())
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

      {/* Custos */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Custos Operacionais</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Taxa de Registro (%)</label>
            <input
              type="number"
              step="0.01"
              value={config.costs.registrationFee * 100}
              onChange={(e) => {
                const newConfig = { ...config }
                newConfig.costs.registrationFee = parseFloat(e.target.value) / 100
                onChange(newConfig)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Taxa de Corretagem (%)</label>
            <input
              type="number"
              step="0.01"
              value={config.costs.brokerageFee * 100}
              onChange={(e) => {
                const newConfig = { ...config }
                newConfig.costs.brokerageFee = parseFloat(e.target.value) / 100
                onChange(newConfig)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Taxa de Seguro (%)</label>
            <input
              type="number"
              step="0.001"
              value={config.costs.insuranceRate * 100}
              onChange={(e) => {
                const newConfig = { ...config }
                newConfig.costs.insuranceRate = parseFloat(e.target.value) / 100
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

function CostOfLivingConfigTab({ config, onChange }: { config: any, onChange: (config: any) => void }) {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Configurações - Custo de Vida</h2>
      
      {/* Países */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Custos Base por País</h3>
        <div className="space-y-4">
          {Object.entries(config.countries).map(([key, country]: [string, any]) => (
            <div key={key} className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-800 mb-3">{country.name}</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Moradia (USD/mês)</label>
                  <input
                    type="number"
                    value={country.baseCosts.housing}
                    onChange={(e) => {
                      const newConfig = { ...config }
                      newConfig.countries[key].baseCosts.housing = parseInt(e.target.value)
                      onChange(newConfig)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Transporte (USD/mês)</label>
                  <input
                    type="number"
                    value={country.baseCosts.transportation}
                    onChange={(e) => {
                      const newConfig = { ...config }
                      newConfig.countries[key].baseCosts.transportation = parseInt(e.target.value)
                      onChange(newConfig)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Alimentação (USD/mês)</label>
                  <input
                    type="number"
                    value={country.baseCosts.food}
                    onChange={(e) => {
                      const newConfig = { ...config }
                      newConfig.countries[key].baseCosts.food = parseInt(e.target.value)
                      onChange(newConfig)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Moeda</label>
                  <input
                    type="text"
                    value={country.currency}
                    onChange={(e) => {
                      const newConfig = { ...config }
                      newConfig.countries[key].currency = e.target.value
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

function PlanningConfigTab() {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Configurações - Planejamento 360°</h2>
      
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Configurações Gerais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Taxa de Desconto (%)</label>
            <input
              type="number"
              step="0.01"
              defaultValue="5"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Período de Projeção (anos)</label>
            <input
              type="number"
              defaultValue="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">Informações</h3>
        <p className="text-blue-700">
          O planejamento 360° combina automaticamente os dados de todas as outras calculadoras.
          As configurações específicas são definidas em cada aba individual.
        </p>
      </div>
    </div>
  )
}
