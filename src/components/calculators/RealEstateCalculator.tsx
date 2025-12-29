'use client'

import { useState, useEffect } from 'react'
import { Building, TrendingUp, DollarSign, MapPin, Calculator, BarChart3 } from 'lucide-react'
import { useCalculatorConfig } from '@/hooks/useCalculatorConfig'

type EmirateKey = 'dubai' | 'abu_dhabi' | 'sharjah' | 'ajman'
type PropertyTypeKey = 'apartment' | 'villa' | 'townhouse' | 'commercial'

interface RealEstateCalculatorProps {
  onCalculationUpdate: (data: any) => void
}

interface RealEstateResult {
  // Dados do investimento
  propertyPrice: number
  downPayment: number
  loanAmount: number
  monthlyPayment: number
  
  // Receitas
  monthlyRent: number
  annualRent: number
  grossYield: number
  
  // Custos
  annualMaintenance: number
  annualServiceCharges: number
  annualInsurance: number
  annualPropertyTax: number
  totalAnnualCosts: number
  
  // ROI
  netAnnualIncome: number
  netYield: number
  cashOnCashReturn: number
  
  // Projeções
  fiveYearAppreciation: number
  fiveYearTotalReturn: number
  
  // Metadados
  emirate: string
  propertyType: string
  area: string
}

export default function RealEstateCalculator({ onCalculationUpdate }: RealEstateCalculatorProps) {
  const { config, isLoading: configLoading } = useCalculatorConfig()
  
  const [formData, setFormData] = useState({
    propertyPrice: 500000,
    downPaymentPercent: 20,
    loanTerm: 25,
    interestRate: 4.5,
    emirate: 'dubai',
    propertyType: 'apartment',
    area: 'downtown',
    monthlyRent: 3000,
    maintenanceCost: 2000,
    serviceCharges: 3000
  })
  
  const [result, setResult] = useState<RealEstateResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Usar dados do banco ou fallback para dados padrão
  const defaultEmirates = {
    dubai: { 
      name: 'Dubai', 
      appreciationRate: 0.07,
      averageYield: 0.065,
      areas: ["Marina", "Business Bay", "JVC", "Dubai Hills", "Palm Jumeirah"]
    },
    abu_dhabi: { 
      name: 'Abu Dhabi', 
      appreciationRate: 0.06,
      averageYield: 0.055,
      areas: ["Al Reem", "Saadiyat", "Yas Island"]
    },
    sharjah: { 
      name: 'Sharjah', 
      appreciationRate: 0.065,
      averageYield: 0.06,
      areas: ["Al Majaz", "Al Nahda"]
    },
    ajman: { 
      name: 'Ajman',
      appreciationRate: 0.08,
      averageYield: 0.07,
      areas: ["Al Nuaimiya", "Corniche"]
    }
  }

  const emirates = (config?.realEstate?.emirates && typeof config.realEstate.emirates === 'object')
    ? config.realEstate.emirates
    : defaultEmirates

  // Usar dados do banco ou fallback para dados padrão
  const defaultPropertyTypes = {
    apartment: { name: 'Apartamento', maintenanceRate: 0.02, serviceRate: 0.08 },
    villa: { name: 'Villa', maintenanceRate: 0.03, serviceRate: 0.10 },
    townhouse: { name: 'Townhouse', maintenanceRate: 0.025, serviceRate: 0.09 },
    commercial: { name: 'Comercial', maintenanceRate: 0.03, serviceRate: 0.02 }
  }

  const propertyTypes = (config?.realEstate?.propertyTypes && typeof config.realEstate.propertyTypes === 'object')
    ? config.realEstate.propertyTypes
    : defaultPropertyTypes

  const calculateROI = () => {
    if (configLoading || !emirates || !propertyTypes) return
    
    setIsCalculating(true)
    
    setTimeout(() => {
      const { 
        propertyPrice, 
        downPaymentPercent, 
        loanTerm, 
        interestRate,
        emirate,
        propertyType,
        area,
        monthlyRent,
        maintenanceCost,
        serviceCharges
      } = formData
      
      const emirateData = emirates[emirate as EmirateKey]
      const propertyTypeData = propertyTypes[propertyType as PropertyTypeKey]
      
      // === CÁLCULOS FINANCEIROS ===
      const downPayment = propertyPrice * (downPaymentPercent / 100)
      const loanAmount = propertyPrice - downPayment
      
      // Cálculo da prestação mensal (juros compostos)
      const monthlyRate = interestRate / 100 / 12
      const totalPayments = loanTerm * 12
      const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                            (Math.pow(1 + monthlyRate, totalPayments) - 1)
      
      // === RECEITAS ===
      const annualRent = monthlyRent * 12
      const grossYield = (annualRent / propertyPrice) * 100
      
      // === CUSTOS ANUAIS ===
      const annualMaintenance = maintenanceCost
      const annualServiceCharges = serviceCharges
      const annualInsurance = propertyPrice * 0.002 // 0.2% do valor do imóvel
      const annualPropertyTax = 0 // UAE não tem imposto sobre propriedade
      const totalAnnualCosts = annualMaintenance + annualServiceCharges + annualInsurance + annualPropertyTax
      
      // === ROI ===
      const netAnnualIncome = annualRent - totalAnnualCosts
      const netYield = (netAnnualIncome / propertyPrice) * 100
      const cashOnCashReturn = (netAnnualIncome / downPayment) * 100
      
      // === PROJEÇÕES ===
      const fiveYearAppreciation = propertyPrice * Math.pow(1 + emirateData.appreciationRate, 5)
      const fiveYearTotalReturn = (fiveYearAppreciation - propertyPrice) + (netAnnualIncome * 5)
      
      const calculationResult: RealEstateResult = {
        // Dados do investimento
        propertyPrice,
        downPayment,
        loanAmount,
        monthlyPayment,
        
        // Receitas
        monthlyRent,
        annualRent,
        grossYield,
        
        // Custos
        annualMaintenance,
        annualServiceCharges,
        annualInsurance,
        annualPropertyTax,
        totalAnnualCosts,
        
        // ROI
        netAnnualIncome,
        netYield,
        cashOnCashReturn,
        
        // Projeções
        fiveYearAppreciation,
        fiveYearTotalReturn,
        
        // Metadados
        emirate: emirateData.name,
        propertyType: propertyTypeData.name,
        area
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
    if (formData.propertyPrice > 0 && !configLoading && config) {
      const timeoutId = setTimeout(() => {
        calculateROI()
      }, 1000)
      
      return () => clearTimeout(timeoutId)
    }
  }, [formData, config, configLoading])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <Building className="w-6 h-6 text-primary-600" />
          Análise de Investimento Imobiliário
        </h3>
        <p className="text-gray-600">
          Calcule o ROI de investimentos imobiliários nos UAE
        </p>
      </div>
      
      {/* Input Form */}
      <div className="space-y-8">
        {/* Seção 1: Propriedade */}
        <div className="bg-blue-50 p-6 rounded-xl">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Informações da Propriedade
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Preço da Propriedade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço da Propriedade (USD)
              </label>
              <input
                type="number"
                value={formData.propertyPrice}
                onChange={(e) => handleInputChange('propertyPrice', Number(e.target.value))}
                className="input-field"
                placeholder="Ex: 500000"
                min="100000"
                step="10000"
              />
            </div>

            {/* Emirado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emirado
              </label>
              <select
                value={formData.emirate}
                onChange={(e) => handleInputChange('emirate', e.target.value)}
                className="input-field"
              >
                {emirates && typeof emirates === 'object'
                  ? Object.entries(emirates).map(([key, emirate]: [string, any]) => (
                      <option key={key} value={key}>
                        {emirate?.name || key}
                      </option>
                    ))
                  : null}
              </select>
            </div>

            {/* Tipo de Propriedade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Propriedade
              </label>
              <select
                value={formData.propertyType}
                onChange={(e) => handleInputChange('propertyType', e.target.value)}
                className="input-field"
              >
                {propertyTypes && typeof propertyTypes === 'object'
                  ? Object.entries(propertyTypes).map(([key, type]: [string, any]) => (
                      <option key={key} value={key}>
                        {type?.name || key}
                      </option>
                    ))
                  : null}
              </select>
            </div>

            {/* Área */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Área
              </label>
              <select
                value={formData.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
                className="input-field"
              >
                {emirates[formData.emirate as EmirateKey]?.areas.map(area => (
                  <option key={area} value={area.toLowerCase()}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Seção 2: Financiamento */}
        <div className="bg-green-50 p-6 rounded-xl">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-green-600" />
            Financiamento
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Entrada */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entrada (%)
              </label>
              <input
                type="number"
                value={formData.downPaymentPercent}
                onChange={(e) => handleInputChange('downPaymentPercent', Number(e.target.value))}
                className="input-field"
                placeholder="Ex: 20"
                min="10"
                max="50"
                step="5"
              />
              <p className="text-xs text-gray-500 mt-1">
                ${(formData.propertyPrice * formData.downPaymentPercent / 100).toLocaleString()}
              </p>
            </div>

            {/* Prazo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prazo (anos)
              </label>
              <input
                type="number"
                value={formData.loanTerm}
                onChange={(e) => handleInputChange('loanTerm', Number(e.target.value))}
                className="input-field"
                placeholder="Ex: 25"
                min="5"
                max="30"
                step="5"
              />
            </div>

            {/* Taxa de Juros */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taxa de Juros (%)
              </label>
              <input
                type="number"
                value={formData.interestRate}
                onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
                className="input-field"
                placeholder="Ex: 4.5"
                min="2"
                max="8"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Seção 3: Receitas e Custos */}
        <div className="bg-purple-50 p-6 rounded-xl">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-purple-600" />
            Receitas e Custos
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Aluguel Mensal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aluguel Mensal (USD)
              </label>
              <input
                type="number"
                value={formData.monthlyRent}
                onChange={(e) => handleInputChange('monthlyRent', Number(e.target.value))}
                className="input-field"
                placeholder="Ex: 3000"
                min="500"
                step="100"
              />
              <p className="text-xs text-gray-500 mt-1">
                ${(formData.monthlyRent * 12).toLocaleString()} por ano
              </p>
            </div>

            {/* Manutenção Anual */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manutenção Anual (USD)
              </label>
              <input
                type="number"
                value={formData.maintenanceCost}
                onChange={(e) => handleInputChange('maintenanceCost', Number(e.target.value))}
                className="input-field"
                placeholder="Ex: 2000"
                min="0"
                step="100"
              />
            </div>

            {/* Taxa de Serviço */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taxa de Serviço Anual (USD)
              </label>
              <input
                type="number"
                value={formData.serviceCharges}
                onChange={(e) => handleInputChange('serviceCharges', Number(e.target.value))}
                className="input-field"
                placeholder="Ex: 3000"
                min="0"
                step="100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Gross Yield */}
            <div className="result-card result-neutral">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Yield Bruto
              </h4>
              <p className="text-3xl font-bold text-blue-600">
                {result.grossYield.toFixed(2)}%
              </p>
              <p className="text-sm text-gray-500 mt-1">por ano</p>
            </div>

            {/* Net Yield */}
            <div className="result-card result-positive">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Yield Líquido
              </h4>
              <p className="text-3xl font-bold text-green-600">
                {result.netYield.toFixed(2)}%
              </p>
              <p className="text-sm text-gray-500 mt-1">por ano</p>
            </div>

            {/* Cash on Cash Return */}
            <div className="result-card result-positive">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                ROI do Capital
              </h4>
              <p className="text-3xl font-bold text-green-600">
                {result.cashOnCashReturn.toFixed(2)}%
              </p>
              <p className="text-sm text-gray-500 mt-1">sobre entrada</p>
            </div>

            {/* Monthly Payment */}
            <div className="result-card result-neutral">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Prestação Mensal
              </h4>
              <p className="text-3xl font-bold text-blue-600">
                ${result.monthlyPayment.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">financiamento</p>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Receitas */}
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Receitas Anuais
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Aluguel Mensal</span>
                  <span className="font-semibold text-green-600">
                    ${result.monthlyRent.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Aluguel Anual</span>
                  <span className="font-semibold text-green-600">
                    ${result.annualRent.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Yield Bruto</span>
                  <span className="font-semibold text-green-600">
                    {result.grossYield.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Custos */}
            <div className="bg-red-50 p-6 rounded-xl border border-red-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-red-600" />
                Custos Anuais
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Manutenção</span>
                  <span className="font-semibold text-red-600">
                    ${result.annualMaintenance.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Taxa de Serviço</span>
                  <span className="font-semibold text-red-600">
                    ${result.annualServiceCharges.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Seguro</span>
                  <span className="font-semibold text-red-600">
                    ${result.annualInsurance.toLocaleString()}
                  </span>
                </div>
                <hr className="border-red-200" />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Custos</span>
                  <span className="text-red-600">
                    ${result.totalAnnualCosts.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Projeções */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Projeções de 5 Anos
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h5 className="font-semibold text-gray-700 mb-2">Valorização</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Valor atual:</span>
                    <span className="font-semibold">
                      ${result.propertyPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Valor em 5 anos:</span>
                    <span className="font-semibold text-green-600">
                      ${result.fiveYearAppreciation.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Ganho de capital:</span>
                    <span className="font-semibold text-green-600">
                      ${(result.fiveYearAppreciation - result.propertyPrice).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h5 className="font-semibold text-gray-700 mb-2">Renda Líquida</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Renda anual:</span>
                    <span className="font-semibold text-blue-600">
                      ${result.netAnnualIncome.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total 5 anos:</span>
                    <span className="font-semibold text-blue-600">
                      ${(result.netAnnualIncome * 5).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Yield líquido:</span>
                    <span className="font-semibold text-blue-600">
                      {result.netYield.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h5 className="font-semibold text-gray-700 mb-2">Retorno Total</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Investimento inicial:</span>
                    <span className="font-semibold">
                      ${result.downPayment.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Retorno total 5 anos:</span>
                    <span className="font-semibold text-green-600">
                      ${result.fiveYearTotalReturn.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>ROI total:</span>
                    <span className="font-semibold text-green-600">
                      {((result.fiveYearTotalReturn / result.downPayment) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
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
            {configLoading ? 'Carregando configurações...' : 'Calculando ROI imobiliário...'}
          </p>
        </div>
      )}
    </div>
  )
} 