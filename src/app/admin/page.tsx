'use client'

import { useState, useEffect } from 'react'
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Edit,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Percent
} from 'lucide-react'

interface TaxBracket {
  id?: string
  minIncome: number
  maxIncome: number | null
  rate: number
}

interface Country {
  id: string
  name: string
  code: string
  currency: string
  taxRate: number
  workingDaysForTaxes: number
}

interface FreeZone {
  id: string
  name: string
  code: string
  emirate: string
  annualCost: number
  setupCost: number
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'countries' | 'brackets' | 'freezones' | 'config'>('countries')
  const [countries, setCountries] = useState<Country[]>([])
  const [taxBrackets, setTaxBrackets] = useState<TaxBracket[]>([])
  const [freeZones, setFreeZones] = useState<FreeZone[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Estados para formulários
  const [editingCountry, setEditingCountry] = useState<Country | null>(null)
  const [editingBracket, setEditingBracket] = useState<TaxBracket | null>(null)
  const [editingFreeZone, setEditingFreeZone] = useState<FreeZone | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Simular carregamento de dados
      // Em produção, você faria calls para APIs reais
      setCountries([
        {
          id: '1',
          name: 'Brasil',
          code: 'BR',
          currency: 'BRL',
          taxRate: 0.34,
          workingDaysForTaxes: 149
        },
        {
          id: '2',
          name: 'Portugal',
          code: 'PT',
          currency: 'EUR',
          taxRate: 0.315,
          workingDaysForTaxes: 128
        },
        {
          id: '3',
          name: 'Emirados Árabes Unidos',
          code: 'AE',
          currency: 'AED',
          taxRate: 0.09,
          workingDaysForTaxes: 15
        }
      ])

      setTaxBrackets([
        { id: '1', minIncome: 0, maxIncome: 180000, rate: 0.06 },
        { id: '2', minIncome: 180000, maxIncome: 360000, rate: 0.112 },
        { id: '3', minIncome: 360000, maxIncome: 720000, rate: 0.135 },
        { id: '4', minIncome: 720000, maxIncome: 1800000, rate: 0.16 },
        { id: '5', minIncome: 1800000, maxIncome: 3600000, rate: 0.21 },
        { id: '6', minIncome: 3600000, maxIncome: null, rate: 0.33 }
      ])

      setFreeZones([
        { id: '1', name: 'DIFC', code: 'DIFC', emirate: 'Dubai', annualCost: 15000, setupCost: 25000 },
        { id: '2', name: 'DMCC', code: 'DMCC', emirate: 'Dubai', annualCost: 12000, setupCost: 20000 },
        { id: '3', name: 'ADGM', code: 'ADGM', emirate: 'Abu Dhabi', annualCost: 14000, setupCost: 22000 }
      ])

    } catch (error) {
      setMessage('Erro ao carregar dados')
    } finally {
      setIsLoading(false)
    }
  }

  const saveCountry = async (country: Country) => {
    try {
      // Simular save
      if (country.id) {
        setCountries(prev => prev.map(c => c.id === country.id ? country : c))
      } else {
        setCountries(prev => [...prev, { ...country, id: Date.now().toString() }])
      }
      setMessage('País salvo com sucesso!')
      setEditingCountry(null)
    } catch (error) {
      setMessage('Erro ao salvar país')
    }
  }

  const saveTaxBracket = async (bracket: TaxBracket) => {
    try {
      if (bracket.id) {
        setTaxBrackets(prev => prev.map(b => b.id === bracket.id ? bracket : b))
      } else {
        setTaxBrackets(prev => [...prev, { ...bracket, id: Date.now().toString() }])
      }
      setMessage('Faixa tributária salva com sucesso!')
      setEditingBracket(null)
    } catch (error) {
      setMessage('Erro ao salvar faixa tributária')
    }
  }

  const saveFreeZone = async (freeZone: FreeZone) => {
    try {
      if (freeZone.id) {
        setFreeZones(prev => prev.map(f => f.id === freeZone.id ? freeZone : f))
      } else {
        setFreeZones(prev => [...prev, { ...freeZone, id: Date.now().toString() }])
      }
      setMessage('Free Zone salva com sucesso!')
      setEditingFreeZone(null)
    } catch (error) {
      setMessage('Erro ao salvar Free Zone')
    }
  }

  const deleteItem = (type: string, id: string) => {
    if (confirm('Tem certeza que deseja excluir?')) {
      switch (type) {
        case 'country':
          setCountries(prev => prev.filter(c => c.id !== id))
          break
        case 'bracket':
          setTaxBrackets(prev => prev.filter(b => b.id !== id))
          break
        case 'freezone':
          setFreeZones(prev => prev.filter(f => f.id !== id))
          break
      }
      setMessage('Item excluído com sucesso!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Painel de Administração - Calculadora Tarkia
            </h1>
          </div>
          <p className="text-gray-600">
            Configure alíquotas de impostos, regimes tributários e custos das Free Zones
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {message}
            <button 
              onClick={() => setMessage('')}
              className="ml-auto text-green-500 hover:text-green-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'countries', label: 'Países & Impostos', icon: DollarSign },
                { id: 'brackets', label: 'Faixas Tributárias', icon: Percent },
                { id: 'freezones', label: 'Free Zones UAE', icon: Settings },
                { id: 'config', label: 'Configurações', icon: AlertCircle }
              ].map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Countries Tab */}
            {activeTab === 'countries' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Países e Alíquotas de Impostos</h2>
                  <button
                    onClick={() => setEditingCountry({ 
                      id: '', name: '', code: '', currency: '', taxRate: 0, workingDaysForTaxes: 0 
                    })}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar País
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {countries.map(country => (
                    <div key={country.id} className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg">{country.name}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingCountry(country)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteItem('country', country.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Código:</span>
                          <span className="font-medium">{country.code}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Moeda:</span>
                          <span className="font-medium">{country.currency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Taxa de Imposto:</span>
                          <span className="font-bold text-red-600">
                            {(country.taxRate * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Dias p/ Impostos:</span>
                          <span className="font-medium">{country.workingDaysForTaxes} dias</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tax Brackets Tab */}
            {activeTab === 'brackets' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Faixas do Simples Nacional (Brasil)</h2>
                  <button
                    onClick={() => setEditingBracket({ 
                      minIncome: 0, maxIncome: null, rate: 0 
                    })}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Faixa
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left">Faturamento Mínimo</th>
                        <th className="px-4 py-3 text-left">Faturamento Máximo</th>
                        <th className="px-4 py-3 text-left">Alíquota</th>
                        <th className="px-4 py-3 text-left">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taxBrackets.map(bracket => (
                        <tr key={bracket.id} className="border-b border-gray-200">
                          <td className="px-4 py-3">
                            R$ {bracket.minIncome.toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            {bracket.maxIncome ? `R$ ${bracket.maxIncome.toLocaleString()}` : 'Sem limite'}
                          </td>
                          <td className="px-4 py-3">
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                              {(bracket.rate * 100).toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingBracket(bracket)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteItem('bracket', bracket.id!)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Free Zones Tab */}
            {activeTab === 'freezones' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Free Zones dos Emirados Árabes Unidos</h2>
                  <button
                    onClick={() => setEditingFreeZone({ 
                      id: '', name: '', code: '', emirate: '', annualCost: 0, setupCost: 0 
                    })}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Free Zone
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {freeZones.map(freeZone => (
                    <div key={freeZone.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{freeZone.name}</h3>
                          <p className="text-sm text-gray-600">{freeZone.emirate}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingFreeZone(freeZone)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteItem('freezone', freeZone.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Código:</span>
                          <span className="font-medium">{freeZone.code}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Custo Anual:</span>
                          <span className="font-bold text-green-600">
                            ${freeZone.annualCost.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Custo de Setup:</span>
                          <span className="font-bold text-blue-600">
                            ${freeZone.setupCost.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Config Tab */}
            {activeTab === 'config' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Configurações Gerais</h2>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <h3 className="font-semibold text-yellow-800">Configurações Importantes</h3>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium text-gray-700 mb-2">
                          Limite UAE Corporate Tax (USD)
                        </label>
                        <input 
                          type="number" 
                          defaultValue={102000}
                          className="input-field"
                          placeholder="102000"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-gray-700 mb-2">
                          Taxa UAE acima do limite (%)
                        </label>
                        <input 
                          type="number" 
                          defaultValue={9}
                          step="0.1"
                          className="input-field"
                          placeholder="9"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-gray-700 mb-2">
                          Taxa USD/AED
                        </label>
                        <input 
                          type="number" 
                          defaultValue={3.67}
                          step="0.01"
                          className="input-field"
                          placeholder="3.67"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-gray-700 mb-2">
                          Taxa USD/BRL
                        </label>
                        <input 
                          type="number" 
                          defaultValue={5.20}
                          step="0.01"
                          className="input-field"
                          placeholder="5.20"
                        />
                      </div>
                    </div>
                    
                    <button className="btn-primary flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Salvar Configurações
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg flex items-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin text-primary-600" />
              <span>Carregando dados...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 