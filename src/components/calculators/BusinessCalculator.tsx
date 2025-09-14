'use client'

import { useState, useEffect } from 'react'
import { Calculator, TrendingUp, DollarSign, Building2, Users, FileText, Briefcase } from 'lucide-react'
import { useCalculatorConfig } from '@/hooks/useCalculatorConfig'

type CountryKey = 'brasil' | 'portugal'
type FreeZoneKey = 'DIFC' | 'DMCC' | 'ADGM' | 'DAFZ' | 'SHAMS'
type TaxRegimeKey = 'simples' | 'presumido' | 'real'

interface BusinessCalculatorProps {
  onCalculationUpdate: (data: any) => void
}

interface CalculationResult {
  // Brasil
  brazilTotalCost: number
  brazilTax: number
  brazilPayroll: number
  brazilOperational: number
  
  // Dubai
  dubaiTotalCost: number
  dubaiLicense: number
  dubaiSetup: number
  dubaiVisas: number
  dubaiOffice: number
  dubaiServices: number
  dubaiTax: number
  
  // Comparação
  savings: number
  savingsPercentage: number
  
  // Metadados
  originalCountry: string
  freeZone: string
  businessSector: string
  taxRegime: string
  annualRevenue: number
  employees: number
}

export default function BusinessCalculator({ onCalculationUpdate }: BusinessCalculatorProps) {
  const [formData, setFormData] = useState({
    annualRevenue: 500000,
    comparisonCountry: 'portugal', // Mudança: Portugal como padrão conforme escopo
    businessSector: 'consultoria',
    freeZone: 'DIFC',
    taxRegime: 'simples',
    employees: 2,
    operationalCosts: 50000,
    visaCount: 2,
    officeCost: 24000,
    serviceCosts: 12000,
    companyType: 'unipessoal' // Novo campo para tipos de sociedade portuguesa
  })
  
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  
  // Carregar configurações do painel administrativo
  const { config } = useCalculatorConfig()

  // Dados baseados na análise do projeto original
  const countries = {
    brasil: { name: 'Brasil', currency: 'BRL' },
    portugal: { name: 'Portugal', currency: 'EUR' }
  }

  // Usar configurações do painel administrativo ou valores padrão
  const taxRegimes = config?.business?.taxRegimes || {
    simples: { 
      name: 'Simples Nacional', 
      rate: 0.06,
      description: 'Regime simplificado para pequenas empresas'
    },
    presumido: { 
      name: 'Lucro Presumido', 
      rate: 0.15,
      description: 'Regime para empresas de médio porte'
    },
    real: { 
      name: 'Lucro Real', 
      rate: 0.25,
      description: 'Regime para grandes empresas'
    }
  }

  // Garantir que todos os regimes tenham a propriedade 'name'
  const taxRegimesWithNames = Object.fromEntries(
    Object.entries(taxRegimes).map(([key, regime]) => [
      key, 
      { 
        ...regime, 
        name: (regime as any).name || key.charAt(0).toUpperCase() + key.slice(1)
      }
    ])
  )

  // Tipos de sociedade portuguesa conforme escopo do cliente
  const companyTypes = config?.business?.companyTypes || {
    unipessoal: {
      name: 'Sociedade Unipessoal por Quotas',
      description: 'Empresa com um único sócio',
      setupCost: 360, // EUR
      accountingCost: 100 // EUR/mês
    },
    quotas: {
      name: 'Sociedade por Quotas',
      description: 'Empresa com múltiplos sócios',
      setupCost: 360, // EUR
      accountingCost: 120 // EUR/mês
    }
  }

  // Garantir que todos os tipos de empresa tenham a propriedade 'name'
  const companyTypesWithNames = Object.fromEntries(
    Object.entries(companyTypes).map(([key, type]) => [
      key, 
      { 
        ...type, 
        name: (type as any).name || key.charAt(0).toUpperCase() + key.slice(1)
      }
    ])
  )

  // Usar configurações do painel administrativo ou valores padrão
  const freeZones = config?.business?.freeZones || {
    DIFC: { 
      name: 'DIFC (Dubai International Financial Centre)', 
      annualCost: 15000, 
      setupCost: 25000,
      visaCost: 3000,
      description: 'Centro financeiro internacional'
    },
    DMCC: { 
      name: 'DMCC (Dubai Multi Commodities Centre)', 
      annualCost: 12000, 
      setupCost: 20000,
      visaCost: 2500,
      description: 'Centro de commodities e trading'
    },
    ADGM: { 
      name: 'ADGM (Abu Dhabi Global Market)', 
      annualCost: 14000, 
      setupCost: 22000,
      visaCost: 2800,
      description: 'Mercado global de Abu Dhabi'
    },
    DAFZ: { 
      name: 'DAFZ (Dubai Airport Free Zone)', 
      annualCost: 8000, 
      setupCost: 15000,
      visaCost: 2000,
      description: 'Zona franca do aeroporto'
    },
    SHAMS: { 
      name: 'SHAMS (Sharjah Media City)', 
      annualCost: 6000, 
      setupCost: 12000,
      visaCost: 1800,
      description: 'Cidade da mídia de Sharjah'
    }
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
      const { 
        annualRevenue, 
        comparisonCountry, 
        freeZone, 
        taxRegime, 
        employees, 
        operationalCosts,
        visaCount,
        officeCost,
        serviceCosts
      } = formData
      
      const countryData = countries[comparisonCountry as CountryKey]
      const taxRegimeData = taxRegimesWithNames[taxRegime as TaxRegimeKey]
      const freeZoneData = freeZones[freeZone as FreeZoneKey]
      
      // === CÁLCULOS PAÍS DE ORIGEM ===
      let originTax = 0
      let originPayroll = 0
      let originOperational = 0
      
      if (comparisonCountry === 'brasil') {
        // Impostos baseados no regime tributário brasileiro
        originTax = annualRevenue * taxRegimeData.rate
        
        // Folha de pagamento (pró-labore + encargos)
        const averageSalary = 8000 // USD por funcionário/ano
        originPayroll = employees * averageSalary * 1.4 // +40% encargos
        originOperational = operationalCosts
      } else if (comparisonCountry === 'portugal') {
        // Cálculos fiscais portugueses conforme escopo do cliente
        const companyTypeData = companyTypesWithNames[formData.companyType as keyof typeof companyTypesWithNames]
        
        // IRC (Imposto sobre o Rendimento das Pessoas Coletivas)
        // 21% em Portugal Continental + Derrama Municipal (até 1.5%)
        const ircRate = 0.21
        const derramaRate = 0.015 // 1.5% máximo
        const totalTaxRate = ircRate + derramaRate // 22.5% total
        
        originTax = annualRevenue * totalTaxRate
        
        // Segurança Social: 23.75% sobre remunerações
        const avgSalary = 45000 // EUR por funcionário (convertido para USD)
        const totalSalaries = employees * avgSalary
        originPayroll = totalSalaries * 1.2375 // +23.75% segurança social
        
        // Custos operacionais + contabilidade
        originOperational = operationalCosts + (companyTypeData.accountingCost * 12) // EUR/mês para USD/ano
      }
      
      const originTotalCost = originTax + originPayroll + originOperational
      
      // === CÁLCULOS DUBAI ===
      const dubaiLicense = freeZoneData.annualCost
      const dubaiSetup = freeZoneData.setupCost
      const dubaiVisas = visaCount * freeZoneData.visaCost
      const dubaiOffice = officeCost
      const dubaiServices = serviceCosts
      
      // Corporate Tax UAE (usar configurações do painel)
      const uaeThreshold = config?.business?.uaeTax?.threshold || 102000
      const uaeTaxRate = config?.business?.uaeTax?.rate || 0.09
      let dubaiTax = 0
      if (annualRevenue > uaeThreshold) {
        dubaiTax = (annualRevenue - uaeThreshold) * uaeTaxRate
      }
      
      const dubaiTotalCost = dubaiLicense + dubaiSetup + dubaiVisas + dubaiOffice + dubaiServices + dubaiTax
      
      // === COMPARAÇÃO ===
      const savings = originTotalCost - dubaiTotalCost
      const savingsPercentage = (savings / originTotalCost) * 100
      
      const calculationResult: CalculationResult = {
        // País de Origem
        brazilTotalCost: originTotalCost,
        brazilTax: originTax,
        brazilPayroll: originPayroll,
        brazilOperational: originOperational,
        
        // Dubai
        dubaiTotalCost,
        dubaiLicense,
        dubaiSetup,
        dubaiVisas,
        dubaiOffice,
        dubaiServices,
        dubaiTax,
        
        // Comparação
        savings,
        savingsPercentage,
        
        // Metadados
        originalCountry: countryData.name,
        freeZone: freeZoneData.name,
        businessSector: formData.businessSector,
        taxRegime: taxRegimeData.name,
        annualRevenue,
        employees
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
          Compare os custos tributários entre Brasil/Portugal e UAE
        </p>
      </div>

      {/* Input Form */}
      <div className="space-y-8">
        {/* Seção 1: Informações Básicas */}
        <div className="bg-blue-50 p-6 rounded-xl">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            Informações Básicas
          </h4>
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
                <option value="brasil">Brasil</option>
                <option value="portugal">Portugal</option>
          </select>
        </div>

            {/* Regime Tributário (apenas Brasil) */}
            {formData.comparisonCountry === 'brasil' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Regime Tributário
                </label>
                <select
                  value={formData.taxRegime}
                  onChange={(e) => handleInputChange('taxRegime', e.target.value)}
                  className="input-field"
                >
                  {Object.entries(taxRegimesWithNames).map(([key, regime]) => (
                    <option key={key} value={key}>
                      {regime.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {taxRegimesWithNames[formData.taxRegime as TaxRegimeKey]?.description}
                </p>
              </div>
            )}

            {/* Tipo de Sociedade (apenas Portugal) */}
            {formData.comparisonCountry === 'portugal' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Sociedade
                </label>
                <select
                  value={formData.companyType}
                  onChange={(e) => handleInputChange('companyType', e.target.value)}
                  className="input-field"
                >
                  {Object.entries(companyTypesWithNames).map(([key, type]) => (
                    <option key={key} value={key}>
                      {type.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {companyTypesWithNames[formData.companyType as keyof typeof companyTypesWithNames]?.description}
                </p>
              </div>
            )}

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
          </div>
        </div>

        {/* Seção 2: Recursos Humanos */}
        <div className="bg-green-50 p-6 rounded-xl">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            Recursos Humanos
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Número de Funcionários */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Funcionários/Sócios
              </label>
              <input
                type="number"
                value={formData.employees}
                onChange={(e) => handleInputChange('employees', Number(e.target.value))}
                className="input-field"
                placeholder="Ex: 2"
                min="1"
                max="50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Inclui sócios e funcionários
              </p>
            </div>

            {/* Custos Operacionais */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custos Operacionais Anuais (USD)
              </label>
              <input
                type="number"
                value={formData.operationalCosts}
                onChange={(e) => handleInputChange('operationalCosts', Number(e.target.value))}
                className="input-field"
                placeholder="Ex: 50000"
                min="0"
                step="5000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Aluguel, serviços, marketing, etc.
              </p>
            </div>
          </div>
        </div>

        {/* Seção 3: Configuração Dubai */}
        <div className="bg-purple-50 p-6 rounded-xl">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-600" />
            Configuração Dubai
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Free Zone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
                Free Zone
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
              <p className="text-xs text-gray-500 mt-1">
                {freeZones[formData.freeZone as FreeZoneKey]?.description}
              </p>
            </div>

            {/* Número de Vistos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Vistos Necessários
              </label>
              <input
                type="number"
                value={formData.visaCount}
                onChange={(e) => handleInputChange('visaCount', Number(e.target.value))}
                className="input-field"
                placeholder="Ex: 2"
                min="1"
                max="20"
              />
              <p className="text-xs text-gray-500 mt-1">
                Vistos de residência/emprego
              </p>
            </div>

            {/* Custo de Escritório */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custo Anual de Escritório (USD)
              </label>
              <input
                type="number"
                value={formData.officeCost}
                onChange={(e) => handleInputChange('officeCost', Number(e.target.value))}
                className="input-field"
                placeholder="Ex: 24000"
                min="0"
                step="2000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Aluguel de escritório
              </p>
            </div>

            {/* Custos de Serviços */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custos de Serviços (USD)
              </label>
              <input
                type="number"
                value={formData.serviceCosts}
                onChange={(e) => handleInputChange('serviceCosts', Number(e.target.value))}
                className="input-field"
                placeholder="Ex: 12000"
                min="0"
                step="1000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Contabilidade, jurídico, etc.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Brasil Total Cost */}
            <div className="result-card result-negative">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Custo Total em {result.originalCountry}
              </h4>
              <p className="text-3xl font-bold text-red-600">
                ${result.brazilTotalCost.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">por ano</p>
            </div>

            {/* Dubai Total Cost */}
            <div className="result-card result-neutral">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Custo Total em Dubai
              </h4>
              <p className="text-3xl font-bold text-blue-600">
                ${result.dubaiTotalCost.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Free Zone + Operacionais
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
                {result.savingsPercentage.toFixed(1)}% de economia
              </p>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Brasil Breakdown */}
            <div className="bg-red-50 p-6 rounded-xl border border-red-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-600" />
                Detalhamento {result.originalCountry}
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Impostos ({result.taxRegime})</span>
                  <span className="font-semibold text-red-600">
                    ${result.brazilTax.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Folha de Pagamento</span>
                  <span className="font-semibold text-red-600">
                    ${result.brazilPayroll.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Custos Operacionais</span>
                  <span className="font-semibold text-red-600">
                    ${result.brazilOperational.toLocaleString()}
                  </span>
                </div>
                <hr className="border-red-200" />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-red-600">
                    ${result.brazilTotalCost.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Dubai Breakdown */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Detalhamento Dubai
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Licença Free Zone</span>
                  <span className="font-semibold text-blue-600">
                    ${result.dubaiLicense.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Custo de Abertura</span>
                  <span className="font-semibold text-blue-600">
                    ${result.dubaiSetup.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Vistos ({result.employees} pessoas)</span>
                  <span className="font-semibold text-blue-600">
                    ${result.dubaiVisas.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Escritório</span>
                  <span className="font-semibold text-blue-600">
                    ${result.dubaiOffice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Serviços</span>
                  <span className="font-semibold text-blue-600">
                    ${result.dubaiServices.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Corporate Tax</span>
                  <span className="font-semibold text-blue-600">
                    ${result.dubaiTax.toLocaleString()}
                  </span>
                </div>
                <hr className="border-blue-200" />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">
                    ${result.dubaiTotalCost.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Projeção e Insights */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Projeção e Análise
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h5 className="font-semibold text-gray-700 mb-2">Projeção 5 Anos</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total economizado:</span>
                    <span className="font-semibold text-green-600">
                      ${(result.savings * 5).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>ROI do investimento:</span>
                    <span className="font-semibold text-green-600">
                      {((result.savings * 5) / result.dubaiSetup * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h5 className="font-semibold text-gray-700 mb-2">Payback</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tempo de retorno:</span>
                    <span className="font-semibold text-blue-600">
                      {(result.dubaiSetup / result.savings * 12).toFixed(1)} meses
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Break-even:</span>
                    <span className="font-semibold text-blue-600">
                      {Math.ceil(result.dubaiSetup / result.savings)} anos
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h5 className="font-semibold text-gray-700 mb-2">Benefícios UAE</h5>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>✅ 0% imposto pessoal</li>
                  <li>✅ 0% imposto corporativo</li>
                  <li>✅ 100% propriedade</li>
                  <li>✅ Repatriação total</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Gráfico de Comparação */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Comparativo Visual de Custos
            </h4>
            <div className="space-y-4">
              {/* Barra Brasil */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {result.originalCountry} - {result.taxRegime}
                  </span>
                  <span className="text-sm font-semibold text-red-600">
                    ${result.brazilTotalCost.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div 
                    className="bg-red-500 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: '100%' }}
                  >
                    <span className="text-white text-xs font-medium">
                      {result.brazilTotalCost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Barra Dubai */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Dubai - {result.freeZone}
                  </span>
                  <span className="text-sm font-semibold text-blue-600">
                    ${result.dubaiTotalCost.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div 
                    className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(result.dubaiTotalCost / result.brazilTotalCost) * 100}%` }}
                  >
                    <span className="text-white text-xs font-medium">
                      {result.dubaiTotalCost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Economia */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Economia Anual
                  </span>
                  <span className="text-sm font-semibold text-green-600">
                    ${result.savings.toLocaleString()} ({result.savingsPercentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div 
                    className="bg-green-500 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${result.savingsPercentage}%` }}
                  >
                    <span className="text-white text-xs font-medium">
                      {result.savings.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
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