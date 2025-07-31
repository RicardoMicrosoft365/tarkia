'use client'

import { useState, useEffect } from 'react'
import { Calculator, TrendingUp, DollarSign, Building2 } from 'lucide-react'

interface BusinessCalculatorProps {
  onCalculationUpdate: (data: any) => void
}

interface CalculationResult {
  originalCountryTax: number
  uaeTotalCost: number
  savings: number
  originalCountry: string
  freeZone: string
  businessSector: string
}

export default function BusinessCalculator({ onCalculationUpdate }: BusinessCalculatorProps) {
  const [formData, setFormData] = useState({
    annualRevenue: 500000,
    comparisonCountry: 'brasil',
    businessSector: 'consultoria',
    freeZone: 'DIFC'
  })
  
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Dados baseados na análise do projeto original
  const countries = {
    brasil: { name: 'Brasil', taxRate: 0.34, currency: 'BRL' },
    portugal: { name: 'Portugal', taxRate: 0.315, currency: 'EUR' }
  }

  const freeZones = {
    DIFC: { name: 'DIFC (Dubai International Financial Centre)', cost: 15000, setupCost: 25000 },
    DMCC: { name: 'DMCC (Dubai Multi Commodities Centre)', cost: 12000, setupCost: 20000 },
    ADGM: { name: 'ADGM (Abu Dhabi Global Market)', cost: 14000, setupCost: 22000 },
    DAFZ: { name: 'DAFZ (Dubai Airport Free Zone)', cost: 8000, setupCost: 15000 },
    SHAMS: { name: 'SHAMS (Sharjah Media City)', cost: 6000, setupCost: 12000 }
  }

  const businessSectors = [
    'Consultoria',
    'E-commerce', 
    'Trading',
    'Serviços Digitais',
    'Holding',
    'Manufatura',
    'Logística',
    'Educação',
    'Saúde',
    'Marketing',
    'Fintech',
    'Real Estate'
  ]

  const calculateTaxes = () => {
    setIsCalculating(true)
    
    // Simular delay de cálculo
    setTimeout(() => {
      const { annualRevenue, comparisonCountry, freeZone } = formData
      
      // Tax no país de comparação
      const countryData = countries[comparisonCountry]
      const originalTax = annualRevenue * countryData.taxRate
      
      // Custos nos UAE (baseado no projeto original)
      const freeZoneData = freeZones[freeZone]
      const uaeThreshold = 102000 // USD threshold para corporate tax
      const uaeTaxRate = 0.09
      
      let uaeTax = 0
      if (annualRevenue > uaeThreshold) {
        uaeTax = (annualRevenue - uaeThreshold) * uaeTaxRate
      }
      
      const totalUaeCost = freeZoneData.cost + uaeTax
      const savings = originalTax - totalUaeCost
      
      const calculationResult: CalculationResult = {
        originalCountryTax: originalTax,
        uaeTotalCost: totalUaeCost,
        savings: savings,
        originalCountry: countryData.name,
        freeZone: freeZoneData.name,
        businessSector: formData.businessSector
      }
      
      setResult(calculationResult)
      onCalculationUpdate(calculationResult)
      setIsCalculating(false)
    }, 1500)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  useEffect(() => {
    // Auto-calcular quando os dados mudam
    if (formData.annualRevenue > 0) {
      const timeoutId = setTimeout(() => {
        calculateTaxes()
      }, 1000)
      
      return () => clearTimeout(timeoutId)
    }
  }, [formData])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <Calculator className="w-6 h-6 text-primary-600" />
          Análise de Otimização Fiscal Empresarial
        </h3>
        <p className="text-gray-600">
          Compare os custos tributários e descubra sua economia potencial nos UAE
        </p>
      </div>

      {/* Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Faturamento Anual */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Faturamento Anual (USD)
          </label>
          <input
            type="number"
            value={formData.annualRevenue}
            onChange={(e) => handleInputChange('annualRevenue', Number(e.target.value))}
            className="input-field"
            placeholder="Ex: 500000"
            min="0"
            step="10000"
          />
        </div>

        {/* País de Comparação */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            País de Comparação
          </label>
          <select
            value={formData.comparisonCountry}
            onChange={(e) => handleInputChange('comparisonCountry', e.target.value)}
            className="input-field"
          >
            <option value="brasil">Brasil (34%)</option>
            <option value="portugal">Portugal (31.5%)</option>
          </select>
        </div>

        {/* Tipo de Negócio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Negócio
          </label>
          <select
            value={formData.businessSector}
            onChange={(e) => handleInputChange('businessSector', e.target.value)}
            className="input-field"
          >
            {businessSectors.map(sector => (
              <option key={sector} value={sector.toLowerCase()}>
                {sector}
              </option>
            ))}
          </select>
        </div>

        {/* Free Zone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Free Zone (UAE)
          </label>
          <select
            value={formData.freeZone}
            onChange={(e) => handleInputChange('freeZone', e.target.value)}
            className="input-field"
          >
            {Object.entries(freeZones).map(([key, zone]) => (
              <option key={key} value={key}>
                {zone.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Results Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Original Country Tax */}
            <div className="result-card result-negative">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Impostos em {result.originalCountry}
              </h4>
              <p className="text-3xl font-bold text-red-600">
                ${result.originalCountryTax.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">por ano</p>
            </div>

            {/* UAE Total Cost */}
            <div className="result-card result-neutral">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Custos Totais nos UAE
              </h4>
              <p className="text-3xl font-bold text-blue-600">
                ${result.uaeTotalCost.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Free Zone + Impostos
              </p>
            </div>

            {/* Savings */}
            <div className="result-card result-positive">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Economia Anual
              </h4>
              <p className="text-3xl font-bold text-green-600">
                ${result.savings.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {((result.savings / result.originalCountryTax) * 100).toFixed(1)}% de economia
              </p>
            </div>
          </div>

          {/* Additional Insights */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Análise Detalhada
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-gray-700 mb-2">Benefícios dos UAE:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✅ 0% imposto de renda pessoal</li>
                  <li>✅ 0% imposto corporativo em Free Zones</li>
                  <li>✅ 100% propriedade estrangeira</li>
                  <li>✅ Repatriação total de lucros</li>
                  <li>✅ Ausência de controle de câmbio</li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-semibold text-gray-700 mb-2">Projeção de 5 anos:</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total economizado:</span>
                    <span className="font-semibold text-green-600">
                      ${(result.savings * 5).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Payback do setup:</span>
                    <span className="font-semibold">
                      {(freeZones[formData.freeZone].setupCost / result.savings * 12).toFixed(1)} meses
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Comparativo Visual
            </h4>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">
                📊 Gráfico de comparação seria exibido aqui
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isCalculating && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Calculando otimização fiscal...</p>
        </div>
      )}
    </div>
  )
} 