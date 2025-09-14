'use client'

import { useState, useEffect } from 'react'
import { 
  Compass, 
  TrendingUp, 
  DollarSign, 
  Building, 
  ShoppingCart, 
  Plane, 
  Target,
  BarChart3,
  PieChart,
  Calendar,
  Users,
  FileText
} from 'lucide-react'
import { useCalculatorConfig } from '@/hooks/useCalculatorConfig'

interface PlanningCalculatorProps {
  calculations: any
  onCalculationUpdate: (data: any) => void
}

interface PlanningResult {
  // Resumo Financeiro
  totalAnnualSavings: number
  totalInvestmentRequired: number
  netWorthIncrease: number
  
  // Timeline
  setupTime: number // meses
  breakEvenTime: number // meses
  roiTimeline: {
    year1: number
    year3: number
    year5: number
    year10: number
  }
  
  // Recomendações
  recommendedStrategy: string
  riskLevel: 'low' | 'medium' | 'high'
  priorityActions: string[]
  
  // Metadados
  hasBusinessData: boolean
  hasRealEstateData: boolean
  hasCostOfLivingData: boolean
  hasVisaData: boolean
}

export default function PlanningCalculator({ calculations, onCalculationUpdate }: PlanningCalculatorProps) {
  const { config, isLoading: configLoading } = useCalculatorConfig()
  
  const [result, setResult] = useState<PlanningResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const calculateIntegratedPlanning = () => {
    if (configLoading || !config) return
    
    setIsCalculating(true)
    
    setTimeout(() => {
      const business = calculations.business
      const realEstate = calculations.realestate
      const costOfLiving = calculations.costofliving
      const visa = calculations.visa
      
      // Verificar quais dados estão disponíveis
      const hasBusinessData = !!business
      const hasRealEstateData = !!realEstate
      const hasCostOfLivingData = !!costOfLiving
      const hasVisaData = !!visa
      
      // Calcular economia anual total
      let totalAnnualSavings = 0
      if (hasBusinessData) {
        totalAnnualSavings += business.savings || 0
      }
      
      // Calcular investimento total necessário
      let totalInvestmentRequired = 0
      if (hasBusinessData) {
        totalInvestmentRequired += business.dubaiSetup || 0
      }
      if (hasRealEstateData) {
        totalInvestmentRequired += realEstate.downPayment || 0
      }
      if (hasVisaData) {
        totalInvestmentRequired += visa.totalCost || 0
      }
      
      // Calcular aumento de patrimônio líquido
      let netWorthIncrease = 0
      if (hasRealEstateData) {
        netWorthIncrease += (realEstate.fiveYearAppreciation - realEstate.propertyPrice) || 0
      }
      netWorthIncrease += totalAnnualSavings * 5 // 5 anos de economia
      
      // Timeline
      const setupTime = hasBusinessData ? 3 : 6 // meses
      const breakEvenTime = totalInvestmentRequired > 0 ? 
        Math.ceil((totalInvestmentRequired / totalAnnualSavings) * 12) : 0
      
      // ROI Timeline
      const roiTimeline = {
        year1: totalAnnualSavings - (totalInvestmentRequired * 0.1),
        year3: (totalAnnualSavings * 3) - (totalInvestmentRequired * 0.3),
        year5: (totalAnnualSavings * 5) - (totalInvestmentRequired * 0.5) + (netWorthIncrease * 0.5),
        year10: (totalAnnualSavings * 10) - totalInvestmentRequired + netWorthIncrease
      }
      
      // Estratégia recomendada
      let recommendedStrategy = 'Conservadora'
      let riskLevel: 'low' | 'medium' | 'high' = 'low'
      let priorityActions: string[] = []
      
      if (hasBusinessData && hasRealEstateData) {
        recommendedStrategy = 'Agressiva'
        riskLevel = 'high'
        priorityActions = [
          'Abrir empresa em Free Zone',
          'Investir em imóvel para residência',
          'Solicitar visto de investidor',
          'Transferir operações gradualmente'
        ]
      } else if (hasBusinessData) {
        recommendedStrategy = 'Moderada'
        riskLevel = 'medium'
        priorityActions = [
          'Abrir empresa em Free Zone',
          'Solicitar visto de trabalho',
          'Alugar imóvel inicialmente',
          'Planejar investimento imobiliário'
        ]
      } else if (hasRealEstateData) {
        recommendedStrategy = 'Imobiliária'
        riskLevel = 'medium'
        priorityActions = [
          'Investir em imóvel nos UAE',
          'Solicitar visto de investidor',
          'Avaliar abertura de empresa',
          'Planejar mudança gradual'
        ]
      } else {
        recommendedStrategy = 'Exploratória'
        riskLevel = 'low'
        priorityActions = [
          'Visitar os UAE',
          'Estudar Free Zones',
          'Avaliar mercado imobiliário',
          'Consultar especialistas'
        ]
      }
      
      const calculationResult: PlanningResult = {
        totalAnnualSavings,
        totalInvestmentRequired,
        netWorthIncrease,
        setupTime,
        breakEvenTime,
        roiTimeline,
        recommendedStrategy,
        riskLevel,
        priorityActions,
        hasBusinessData,
        hasRealEstateData,
        hasCostOfLivingData,
        hasVisaData
      }
      
      setResult(calculationResult)
      onCalculationUpdate(calculationResult)
      setIsCalculating(false)
    }, 2000)
  }

  useEffect(() => {
    if (!configLoading && config) {
      calculateIntegratedPlanning()
    }
  }, [calculations, config, configLoading])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <Compass className="w-6 h-6 text-primary-600" />
          Planejamento 360° - Visão Integrada
        </h3>
        <p className="text-gray-600">
          Análise completa combinando todos os aspectos do seu planejamento
        </p>
      </div>
      
      {/* Data Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg border-2 ${calculations.business ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center gap-2">
            <DollarSign className={`w-5 h-5 ${calculations.business ? 'text-green-600' : 'text-gray-400'}`} />
            <span className={`text-sm font-medium ${calculations.business ? 'text-green-800' : 'text-gray-500'}`}>
              Análise Fiscal
            </span>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg border-2 ${calculations.realestate ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center gap-2">
            <Building className={`w-5 h-5 ${calculations.realestate ? 'text-green-600' : 'text-gray-400'}`} />
            <span className={`text-sm font-medium ${calculations.realestate ? 'text-green-800' : 'text-gray-500'}`}>
              Investimento Imobiliário
            </span>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg border-2 ${calculations.costofliving ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center gap-2">
            <ShoppingCart className={`w-5 h-5 ${calculations.costofliving ? 'text-green-600' : 'text-gray-400'}`} />
            <span className={`text-sm font-medium ${calculations.costofliving ? 'text-green-800' : 'text-gray-500'}`}>
              Custo de Vida
            </span>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg border-2 ${calculations.visa ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center gap-2">
            <Plane className={`w-5 h-5 ${calculations.visa ? 'text-green-600' : 'text-gray-400'}`} />
            <span className={`text-sm font-medium ${calculations.visa ? 'text-green-800' : 'text-gray-500'}`}>
              Processo de Visto
            </span>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Economia Anual */}
            <div className="result-card result-positive">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Economia Anual
              </h4>
              <p className="text-3xl font-bold text-green-600">
                ${result.totalAnnualSavings.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">por ano</p>
            </div>

            {/* Investimento Necessário */}
            <div className="result-card result-neutral">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Investimento Total
              </h4>
              <p className="text-3xl font-bold text-blue-600">
                ${result.totalInvestmentRequired.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">inicial</p>
            </div>

            {/* Aumento Patrimonial */}
            <div className="result-card result-positive">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Aumento Patrimonial
              </h4>
              <p className="text-3xl font-bold text-green-600">
                ${result.netWorthIncrease.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">5 anos</p>
            </div>

            {/* Tempo de Retorno */}
            <div className="result-card result-neutral">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Payback
              </h4>
              <p className="text-3xl font-bold text-blue-600">
                {result.breakEvenTime}
              </p>
              <p className="text-sm text-gray-500 mt-1">meses</p>
            </div>
          </div>

          {/* Estratégia Recomendada */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Estratégia Recomendada
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h5 className="font-semibold text-gray-700 mb-2">Estratégia</h5>
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  {result.recommendedStrategy}
                </p>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  result.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                  result.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Risco {result.riskLevel === 'low' ? 'Baixo' : result.riskLevel === 'medium' ? 'Médio' : 'Alto'}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h5 className="font-semibold text-gray-700 mb-2">Timeline</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Setup inicial:</span>
                    <span className="font-semibold">{result.setupTime} meses</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Break-even:</span>
                    <span className="font-semibold">{result.breakEvenTime} meses</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h5 className="font-semibold text-gray-700 mb-2">Dados Disponíveis</h5>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${result.hasBusinessData ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span>Análise Fiscal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${result.hasRealEstateData ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span>Imobiliário</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${result.hasCostOfLivingData ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span>Custo de Vida</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${result.hasVisaData ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span>Vistos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ações Prioritárias */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              Ações Prioritárias
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.priorityActions.map((action, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{action}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Projeção de ROI */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Projeção de Retorno
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <h5 className="font-semibold text-gray-700 mb-2">1 Ano</h5>
                <p className="text-xl font-bold text-blue-600">
                  ${result.roiTimeline.year1.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <h5 className="font-semibold text-gray-700 mb-2">3 Anos</h5>
                <p className="text-xl font-bold text-green-600">
                  ${result.roiTimeline.year3.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <h5 className="font-semibold text-gray-700 mb-2">5 Anos</h5>
                <p className="text-xl font-bold text-green-600">
                  ${result.roiTimeline.year5.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <h5 className="font-semibold text-gray-700 mb-2">10 Anos</h5>
                <p className="text-xl font-bold text-green-600">
                  ${result.roiTimeline.year10.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Recomendações Finais */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Próximos Passos
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-gray-700 mb-3">Recomendações Imediatas</h5>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Agendar consultoria especializada</li>
                  <li>• Visitar os UAE para conhecer o mercado</li>
                  <li>• Estudar Free Zones disponíveis</li>
                  <li>• Avaliar opções de financiamento</li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-semibold text-gray-700 mb-3">Considerações Importantes</h5>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Planejamento fiscal internacional</li>
                  <li>• Compliance e regulamentações</li>
                  <li>• Estruturação de holdings</li>
                  <li>• Planejamento de sucessão</li>
                </ul>
              </div>
            </div>
      </div>
        </div>
      )}

      {/* Loading State */}
      {(isCalculating || configLoading) && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {configLoading ? 'Carregando configurações...' : 'Analisando planejamento integrado...'}
          </p>
        </div>
      )}
    </div>
  )
} 