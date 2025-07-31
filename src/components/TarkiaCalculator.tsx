'use client'

import { useState, useEffect } from 'react'
import { 
  Calculator, 
  Building, 
  ShoppingCart, 
  Plane, 
  Compass,
  Download,
  TrendingUp,
  DollarSign,
  FileText
} from 'lucide-react'
import BusinessCalculator from './calculators/BusinessCalculator'
import RealEstateCalculator from './calculators/RealEstateCalculator'
import CostOfLivingCalculator from './calculators/CostOfLivingCalculator'
import VisaCalculator from './calculators/VisaCalculator'
import PlanningCalculator from './calculators/PlanningCalculator'

type Tab = 'business' | 'realestate' | 'costofliving' | 'visa' | 'planning'

export default function TarkiaCalculator() {
  const [activeTab, setActiveTab] = useState<Tab>('business')
  const [calculations, setCalculations] = useState<any>({})

  const tabs = [
    {
      id: 'business' as Tab,
      label: 'Empresarial',
      icon: Calculator,
      description: 'Análise fiscal e otimização tributária'
    },
    {
      id: 'realestate' as Tab,
      label: 'Imóveis',
      icon: Building,
      description: 'ROI e análise de investimentos'
    },
    {
      id: 'costofliving' as Tab,
      label: 'Custo de Vida',
      icon: ShoppingCart,
      description: 'Comparativo de gastos mensais'
    },
    {
      id: 'visa' as Tab,
      label: 'Vistos',
      icon: Plane,
      description: 'Custos e processos de residência'
    },
    {
      id: 'planning' as Tab,
      label: 'Planejamento 360°',
      icon: Compass,
      description: 'Visão completa do investimento'
    },
  ]

  const handleCalculationUpdate = (tabId: Tab, data: any) => {
    setCalculations(prev => ({
      ...prev,
      [tabId]: data
    }))
  }

  const generatePDFReport = async () => {
    try {
      // Aqui você implementaria a geração do PDF
      console.log('Gerando relatório PDF...', calculations)
      
      // Simulação de delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('📄 Relatório PDF gerado com sucesso!')
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      alert('❌ Erro ao gerar relatório. Tente novamente.')
    }
  }

  return (
    <div className="p-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex flex-wrap -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button mr-2 mb-2 flex items-center gap-2 ${
                  activeTab === tab.id ? 'tab-active' : 'tab-inactive'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            )
          })}
        </nav>
        
        {/* Tab Description */}
        <div className="mt-4 mb-6">
          <p className="text-gray-600">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'business' && (
          <BusinessCalculator 
            onCalculationUpdate={(data) => handleCalculationUpdate('business', data)}
          />
        )}
        
        {activeTab === 'realestate' && (
          <RealEstateCalculator 
            onCalculationUpdate={(data) => handleCalculationUpdate('realestate', data)}
          />
        )}
        
        {activeTab === 'costofliving' && (
          <CostOfLivingCalculator 
            onCalculationUpdate={(data) => handleCalculationUpdate('costofliving', data)}
          />
        )}
        
        {activeTab === 'visa' && (
          <VisaCalculator 
            onCalculationUpdate={(data) => handleCalculationUpdate('visa', data)}
          />
        )}
        
        {activeTab === 'planning' && (
          <PlanningCalculator 
            calculations={calculations}
            onCalculationUpdate={(data) => handleCalculationUpdate('planning', data)}
          />
        )}
      </div>

      {/* Results Summary */}
      {Object.keys(calculations).length > 0 && (
        <div className="mt-12 p-6 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border border-primary-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            Resumo dos Resultados
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {calculations.business && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-2">Economia Fiscal</h4>
                <p className="text-2xl font-bold text-green-600">
                  ${calculations.business.savings?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-gray-500">por ano</p>
              </div>
            )}
            
            {calculations.realestate && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-2">ROI Imobiliário</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {calculations.realestate.yield ? (calculations.realestate.yield * 100).toFixed(1) : '0'}%
                </p>
                <p className="text-sm text-gray-500">yield anual</p>
              </div>
            )}
            
            {calculations.costofliving && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-2">Custo de Vida</h4>
                <p className="text-2xl font-bold text-purple-600">
                  ${calculations.costofliving.totalMonthly?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-gray-500">por mês</p>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={generatePDFReport}
              className="btn-primary flex items-center gap-2 justify-center"
            >
              <Download className="w-4 h-4" />
              Baixar Relatório Completo
            </button>
            
            <button className="btn-secondary flex items-center gap-2 justify-center">
              <FileText className="w-4 h-4" />
              Agendar Consultoria
            </button>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          💡 <strong>Dica:</strong> Use as abas acima para explorar diferentes aspectos do seu planejamento.
          Todos os cálculos são baseados em dados oficiais atualizados.
        </p>
      </div>
    </div>
  )
} 