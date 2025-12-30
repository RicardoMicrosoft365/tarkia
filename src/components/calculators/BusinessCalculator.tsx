'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Calculator, TrendingUp, DollarSign, Building2, Users, FileText, Briefcase, AlertTriangle } from 'lucide-react'
import { useCalculatorConfig } from '@/hooks/useCalculatorConfig'
import Tooltip from '@/components/ui/Tooltip'

type CountryKey = 'brasil' | 'portugal' | 'dubai'
type FreeZoneKey = 'DIFC' | 'DMCC' | 'ADGM' | 'DAFZ' | 'SHAMS' | 'IFZA' | 'JAFZA' | 'RAKEZ' | 'DIC' | 'DUBAI_SOUTH' | 'MEYDAN'
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
  taxBreakdown?: {
    pis?: number
    cofins?: number
    irpj?: number
    csll?: number
    federal?: number
    icms?: number
    iss?: number
  }
  taxRates?: {
    pis?: number
    cofins?: number
    irpj?: number
    csll?: number
    federal?: number
    icms?: number
    iss?: number
    total?: number
  }
  
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
  taxRegime: string
  companyType: string
  annualRevenue: number
  employees: number
  freeZoneComparisons?: FreeZoneComparison[]
}

interface FreeZoneComparison {
  key: string
  name: string
  license: number
  setup: number
  visas: number
  office: number
  services: number
  tax: number
  total: number
  description: string
}

export default function BusinessCalculator({ onCalculationUpdate }: BusinessCalculatorProps) {
  const [formData, setFormData] = useState({
    annualRevenue: 500000,
    comparisonCountry: 'dubai', // Padrão: calcular apenas Dubai
    freeZone: 'DIFC',
    taxRegime: 'presumido',
    employees: 2,
    operationalCosts: 50000,
    visaCount: 2,
    officeCost: 24000,
    serviceCosts: 12000,
    companyType: 'industria' // Tipo de empresa: industria, servicos, comercio
  })
  
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [freeZoneComparisons, setFreeZoneComparisons] = useState<FreeZoneComparison[]>([])
  const calculatingRef = useRef(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasCalculated, setHasCalculated] = useState(false)
  const [taxRateWarning, setTaxRateWarning] = useState<string | null>(null)

  // Funções de formatação de moeda
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const parseCurrency = (value: string): number => {
    // Remove tudo exceto números
    const numericValue = value.replace(/[^\d]/g, '')
    return numericValue ? parseInt(numericValue, 10) : 0
  }

  const formatCurrencyInput = (value: number): string => {
    // Formata sem o símbolo $ para facilitar edição
    return value.toLocaleString('en-US')
  }
  
  // Carregar configurações do painel administrativo
  const { config } = useCalculatorConfig()

  // Dados baseados na análise do projeto original
  const countries = {
    brasil: { name: 'Brasil', currency: 'BRL' },
    portugal: { name: 'Portugal', currency: 'EUR' },
    dubai: { name: 'Dubai/UAE', currency: 'USD' }
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
    },
    IFZA: { 
      name: 'IFZA (International Free Zone Authority)', 
      annualCost: 9000, 
      setupCost: 10000,
      visaCost: 2000,
      description: 'Custos reduzidos, processo simplificado, ideal para PME'
    },
    JAFZA: { 
      name: 'JAFZA (Jebel Ali Free Zone)', 
      annualCost: 14000, 
      setupCost: 15000,
      visaCost: 2200,
      description: 'Acesso ao maior porto do Oriente Médio, foco industrial'
    },
    RAKEZ: { 
      name: 'RAKEZ (Ras Al Khaimah Economic Zone)', 
      annualCost: 8500, 
      setupCost: 8000,
      visaCost: 1800,
      description: 'Excelente custo-benefício, opções industriais variadas'
    },
    DIC: { 
      name: 'Dubai Internet City', 
      annualCost: 20000, 
      setupCost: 22000,
      visaCost: 2800,
      description: 'Hub tecnológico com grandes players globais'
    },
    DUBAI_SOUTH: { 
      name: 'Dubai South', 
      annualCost: 14000, 
      setupCost: 16000,
      visaCost: 2200,
      description: 'Integração com futuro macro aeroporto e zona logística'
    },
    MEYDAN: { 
      name: 'Meydan Free Zone', 
      annualCost: 11500, 
      setupCost: 12000,
      visaCost: 2000,
      description: 'Localização central, custos competitivos'
    }
  }


  const calculateTaxes = useCallback(() => {
    if (calculatingRef.current) return
    calculatingRef.current = true
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

      // Calcular Corporate Tax (mesmo para todas as Free Zones)
      // Lucro = Faturamento - Custos Operacionais
      const uaeThreshold = config?.business?.uaeTax?.threshold || 102000
      const uaeTaxRate = config?.business?.uaeTax?.rate || 0.09
      const estimatedProfit = annualRevenue - operationalCosts // Lucro = Receita - Custos Operacionais
      let dubaiTax = 0
      if (estimatedProfit > uaeThreshold) {
        dubaiTax = Math.max(0, (estimatedProfit - uaeThreshold) * uaeTaxRate)
      }

      // Se for apenas Dubai, calcular todas as Free Zones para comparação
      if (comparisonCountry === 'dubai' && freeZones && typeof freeZones === 'object') {
        const comparisons: FreeZoneComparison[] = Object.entries(freeZones).map(([key, zone]: [string, any]) => {
          const zoneLicense = zone.annualCost || 0
          const zoneSetup = zone.setupCost || 0
          const zoneVisas = visaCount * (zone.visaCost || 0)
          const zoneOffice = officeCost
          const zoneServices = serviceCosts
          const zoneTax = dubaiTax // Mesmo imposto para todas
          const zoneTotal = zoneLicense + zoneSetup + zoneVisas + zoneOffice + zoneServices + zoneTax

          return {
            key,
            name: zone.name || key,
            license: zoneLicense,
            setup: zoneSetup,
            visas: zoneVisas,
            office: zoneOffice,
            services: zoneServices,
            tax: zoneTax,
            total: zoneTotal,
            description: zone.description || ''
          }
        }).sort((a, b) => a.total - b.total) // Ordenar por custo total

        setFreeZoneComparisons(comparisons)
      } else {
        setFreeZoneComparisons([])
      }
      
      const countryData = comparisonCountry === 'dubai' 
        ? { name: 'Dubai/UAE', currency: 'USD' }
        : countries[comparisonCountry as CountryKey]
      const taxRegimeData = comparisonCountry === 'dubai'
        ? { name: 'Corporate Tax UAE', rate: 0.09, description: 'Corporate Tax sobre lucro acima de USD 102,000' }
        : taxRegimesWithNames[taxRegime as TaxRegimeKey]
      const freeZoneData = freeZones[freeZone as FreeZoneKey]
      
      // === CÁLCULOS BRASIL (sempre calcular para comparação) ===
      let brazilTax = 0
      let brazilPayroll = 0
      let brazilOperational = 0
      let brazilTaxBreakdown: any = {}
      let brazilTaxRates: any = {}
      
      // Calcular custos do Brasil mesmo quando "Apenas Dubai" está selecionado
      // Usar o regime selecionado pelo usuário (não forçar sempre 'presumido')
      const brazilTaxRegime = taxRegimesWithNames[taxRegime as TaxRegimeKey] || taxRegimesWithNames['presumido' as TaxRegimeKey]
      // Usar o tipo de empresa selecionado, ou 'industria' como padrão
      const brazilCompanyType = formData.companyType || 'industria'
      const brazilRegimeForComparison = taxRegime // Usar o regime selecionado pelo usuário
      
      // Buscar configuração do tipo de empresa do banco de dados (via config)
      // IMPORTANTE: O config sempre vem com valores padrão da API (/api/admin/config)
      // se não houver configuração salva no banco. Esses valores padrão são os mesmos
      // que estavam hardcoded, mas agora vêm do servidor e podem ser editados no painel ADMIN.
      const companyTypeConfig = config?.business?.companyTypes?.[brazilCompanyType]
      
      // Limpar alerta anterior
      setTaxRateWarning(null)
      
      // Usar apenas valores do config (que vem do banco de dados ou valores padrão da API)
      // Se não houver config disponível ainda (carregando), usar taxa geral do regime como fallback temporário
      let taxRatesToUse: any = null
      if (companyTypeConfig && (companyTypeConfig as any).taxRates) {
        taxRatesToUse = (companyTypeConfig as any).taxRates
      }
      
      // Verificar se a alíquota existe para o regime selecionado
      if (!taxRatesToUse) {
        const companyTypeName = (companyTypeConfig as any)?.name || brazilCompanyType
        const regimeName = brazilRegimeForComparison === 'simples' ? 'Simples Nacional' :
                          brazilRegimeForComparison === 'presumido' ? 'Lucro Presumido' : 
                          brazilRegimeForComparison === 'real' ? 'Lucro Real' : 
                          brazilTaxRegime.name
        setTaxRateWarning(
          `⚠️ Alíquota não configurada: Não foi encontrada configuração de impostos para ${companyTypeName} no regime ${regimeName}. ` +
          `Por favor, configure as alíquotas no painel administrativo. O cálculo está usando uma taxa geral aproximada.`
        )
      } else if (brazilRegimeForComparison === 'simples' && !taxRatesToUse.simples) {
        const companyTypeName = (companyTypeConfig as any)?.name || brazilCompanyType
        setTaxRateWarning(
          `⚠️ Alíquota não configurada: Não foi encontrada configuração de impostos para ${companyTypeName} no regime Simples Nacional. ` +
          `Por favor, configure as alíquotas no painel administrativo. O cálculo está usando uma taxa geral aproximada.`
        )
      } else if (brazilRegimeForComparison === 'presumido' && !taxRatesToUse.presumido) {
        const companyTypeName = (companyTypeConfig as any)?.name || brazilCompanyType
        setTaxRateWarning(
          `⚠️ Alíquota não configurada: Não foi encontrada configuração de impostos para ${companyTypeName} no regime Lucro Presumido. ` +
          `Por favor, configure as alíquotas no painel administrativo. O cálculo está usando uma taxa geral aproximada.`
        )
      } else if (brazilRegimeForComparison === 'real' && !taxRatesToUse.real) {
        const companyTypeName = (companyTypeConfig as any)?.name || brazilCompanyType
        setTaxRateWarning(
          `⚠️ Alíquota não configurada: Não foi encontrada configuração de impostos para ${companyTypeName} no regime Lucro Real. ` +
          `Por favor, configure as alíquotas no painel administrativo. O cálculo está usando uma taxa geral aproximada.`
        )
      }
      
      // Se temos taxRates do config, usar os valores detalhados
      if (taxRatesToUse) {
        // Novo formato com taxRates detalhados
        const taxRates = taxRatesToUse
        
        if (brazilRegimeForComparison === 'simples' && taxRates.simples) {
          // Simples Nacional - usar alíquotas detalhadas por tipo de empresa
          const simplesRates = taxRates.simples
          const federalRate = simplesRates.federal !== undefined ? simplesRates.federal : 0
          const icmsRate = simplesRates.icms !== undefined ? simplesRates.icms : 0
          const issRate = simplesRates.iss !== undefined ? simplesRates.iss : 0
          const calculatedTotal = federalRate + icmsRate + issRate
          
          // Armazenar alíquotas
          brazilTaxRates = {
            federal: federalRate,
            icms: icmsRate,
            iss: issRate,
            total: calculatedTotal
          }
          // Calcular impostos individuais
          const federalTax = annualRevenue * federalRate
          const icmsTax = annualRevenue * icmsRate
          const issTax = annualRevenue * issRate
          brazilTax = federalTax + icmsTax + issTax
          brazilTaxBreakdown = {
            federal: federalTax,
            icms: icmsTax,
            iss: issTax
          }
        } else if (brazilRegimeForComparison === 'presumido' && taxRates.presumido) {
          // Usar o primeiro ano disponível (ou 2026 como padrão)
          const yearRates = taxRates.presumido['2026'] || taxRates.presumido[Object.keys(taxRates.presumido)[0]]
          
          if (yearRates) {
            // SEMPRE usar breakdown detalhado quando yearRates existe (mesmo que alguns valores sejam 0)
            // Calcular total baseado nas alíquotas individuais (sempre calcular, não usar total do config)
            const federalRate = yearRates.federal !== undefined ? yearRates.federal : 0
            const icmsRate = yearRates.icms !== undefined ? yearRates.icms : 0
            const issRate = yearRates.iss !== undefined ? yearRates.iss : 0
            const calculatedTotal = federalRate + icmsRate + issRate
            
            // Armazenar alíquotas (sempre incluir, mesmo que sejam 0)
            brazilTaxRates = {
              federal: federalRate,
              icms: icmsRate,
              iss: issRate,
              total: calculatedTotal
            }
            // Calcular impostos individuais
            const federalTax = annualRevenue * federalRate
            const icmsTax = annualRevenue * icmsRate
            const issTax = annualRevenue * issRate
            brazilTax = federalTax + icmsTax + issTax
            brazilTaxBreakdown = {
              federal: federalTax,
              icms: icmsTax,
              iss: issTax
            }
          } else {
            // Fallback: mesmo sem yearRates, manter estrutura para mostrar ?? no frontend
            const companyTypeName = (companyTypeConfig as any)?.name || brazilCompanyType
            setTaxRateWarning(
              `⚠️ Alíquota incompleta: Não foi encontrada configuração de impostos para ${companyTypeName} no regime Lucro Presumido para o ano selecionado. ` +
              `O cálculo está usando uma taxa geral aproximada.`
            )
            brazilTax = annualRevenue * brazilTaxRegime.rate
            brazilTaxRates = {
              federal: undefined,
              icms: undefined,
              iss: undefined,
              total: brazilTaxRegime.rate
            }
          }
        } else if (brazilRegimeForComparison === 'real' && taxRates.real) {
          // Lucro Real - valores fixos
          const realRates = taxRates.real
          // Calcular total baseado nas alíquotas individuais
          const pisRate = realRates.pis || 0
          const cofinsRate = realRates.cofins || 0
          const irpjRate = realRates.irpj || 0
          const csllRate = realRates.csll || 0
          const calculatedTotal = pisRate + cofinsRate + irpjRate + csllRate
          
          // Armazenar alíquotas
          brazilTaxRates = {
            pis: pisRate,
            cofins: cofinsRate,
            irpj: irpjRate,
            csll: csllRate,
            total: calculatedTotal
          }
          const pisTax = annualRevenue * (realRates.pis || 0)
          const cofinsTax = annualRevenue * (realRates.cofins || 0)
          const irpjTax = annualRevenue * (realRates.irpj || 0)
          const csllTax = annualRevenue * (realRates.csll || 0)
          brazilTax = pisTax + cofinsTax + irpjTax + csllTax
          brazilTaxBreakdown = {
            pis: pisTax,
            cofins: cofinsTax,
            irpj: irpjTax,
            csll: csllTax
          }
        } else {
          // Fallback para taxa padrão - manter estrutura para mostrar ?? no frontend
          brazilTax = annualRevenue * brazilTaxRegime.rate
          brazilTaxRates = {
            federal: undefined,
            icms: undefined,
            iss: undefined,
            total: brazilTaxRegime.rate
          }
        }
      } else {
        // Formato antigo ou fallback - manter estrutura para mostrar ?? no frontend
        brazilTax = annualRevenue * brazilTaxRegime.rate
        brazilTaxRates = {
          federal: undefined,
          icms: undefined,
          iss: undefined,
          total: brazilTaxRegime.rate
        }
      }
      
      // Folha de pagamento (pró-labore + encargos)
      const averageSalary = 8000 // USD por funcionário/ano
      brazilPayroll = employees * averageSalary * 1.4 // +40% encargos
      brazilOperational = operationalCosts
      
      const brazilTotalCost = brazilTax + brazilPayroll + brazilOperational
      
      // === CÁLCULOS PAÍS DE ORIGEM (para comparação quando não for Dubai) ===
      let originTax = 0
      let originPayroll = 0
      let originOperational = 0
      let originTaxBreakdown: any = {}
      let originTaxRates: any = {}
      
      if (comparisonCountry === 'brasil') {
        // Simples Nacional também usa alíquotas detalhadas por tipo de empresa
        if (taxRegime === 'simples') {
          // Buscar configuração do tipo de empresa selecionado para Simples Nacional
          const companyTypeForTax = formData.companyType || 'industria'
          const companyTypeConfig = config?.business?.companyTypes?.[companyTypeForTax]
          
          if (companyTypeConfig && (companyTypeConfig as any).taxRates && (companyTypeConfig as any).taxRates.simples) {
            // Usar alíquotas detalhadas do config
            const simplesRates = (companyTypeConfig as any).taxRates.simples
            const federalRate = simplesRates.federal !== undefined ? simplesRates.federal : 0
            const icmsRate = simplesRates.icms !== undefined ? simplesRates.icms : 0
            const issRate = simplesRates.iss !== undefined ? simplesRates.iss : 0
            const calculatedTotal = federalRate + icmsRate + issRate
            
            originTaxRates = {
              federal: federalRate,
              icms: icmsRate,
              iss: issRate,
              total: calculatedTotal
            }
            // Calcular impostos individuais
            const federalTax = annualRevenue * federalRate
            const icmsTax = annualRevenue * icmsRate
            const issTax = annualRevenue * issRate
            originTax = federalTax + icmsTax + issTax
            originTaxBreakdown = {
              federal: federalTax,
              icms: icmsTax,
              iss: issTax
            }
          } else {
            // Fallback: usar taxa geral do regime
            originTax = annualRevenue * taxRegimeData.rate
            originTaxRates = {
              federal: undefined,
              icms: undefined,
              iss: undefined,
              total: taxRegimeData.rate
            }
            if (!companyTypeConfig || !(companyTypeConfig as any).taxRates || !(companyTypeConfig as any).taxRates.simples) {
              const companyTypeName = (companyTypeConfig as any)?.name || companyTypeForTax
              setTaxRateWarning(
                `⚠️ Alíquota não configurada: Não foi encontrada configuração de impostos para ${companyTypeName} no regime Simples Nacional. ` +
                `Por favor, configure as alíquotas no painel administrativo. O cálculo está usando uma taxa geral aproximada.`
              )
            }
          }
        } else {
          // Buscar configuração do tipo de empresa selecionado (Presumido ou Real)
          // Usar 'industria' como padrão se não estiver definido
          const companyTypeForTax = formData.companyType || 'industria'
          const companyTypeConfig = config?.business?.companyTypes?.[companyTypeForTax]
          
          // Verificar se a alíquota existe para o regime selecionado
          if (!companyTypeConfig || !(companyTypeConfig as any).taxRates) {
            const companyTypeName = (companyTypeConfig as any)?.name || companyTypeForTax
            const regimeName = taxRegime === 'presumido' ? 'Lucro Presumido' : 
                              taxRegime === 'real' ? 'Lucro Real' : 
                              taxRegimeData.name
            setTaxRateWarning(
              `⚠️ Alíquota não configurada: Não foi encontrada configuração de impostos para ${companyTypeName} no regime ${regimeName}. ` +
              `Por favor, configure as alíquotas no painel administrativo. O cálculo está usando uma taxa geral aproximada.`
            )
          } else {
            const taxRates = (companyTypeConfig as any).taxRates
            
            if (taxRegime === 'presumido' && !taxRates.presumido) {
              const companyTypeName = (companyTypeConfig as any)?.name || companyTypeForTax
              setTaxRateWarning(
                `⚠️ Alíquota não configurada: Não foi encontrada configuração de impostos para ${companyTypeName} no regime Lucro Presumido. ` +
                `Por favor, configure as alíquotas no painel administrativo. O cálculo está usando uma taxa geral aproximada.`
              )
            } else if (taxRegime === 'real' && !taxRates.real) {
              const companyTypeName = (companyTypeConfig as any)?.name || companyTypeForTax
              setTaxRateWarning(
                `⚠️ Alíquota não configurada: Não foi encontrada configuração de impostos para ${companyTypeName} no regime Lucro Real. ` +
                `Por favor, configure as alíquotas no painel administrativo. O cálculo está usando uma taxa geral aproximada.`
              )
            }
          }
          
          if (companyTypeConfig && (companyTypeConfig as any).taxRates) {
            // Novo formato com taxRates detalhados
            const taxRates = (companyTypeConfig as any).taxRates
            
            if (taxRegime === 'presumido' && taxRates.presumido) {
              // Usar o primeiro ano disponível (ou 2026 como padrão)
              // Quando mudar o percentual, será atualizado na configuração
              const yearRates = taxRates.presumido['2026'] || taxRates.presumido[Object.keys(taxRates.presumido)[0]]
              
              if (yearRates) {
                // SEMPRE usar breakdown detalhado quando yearRates existe (mesmo que alguns valores sejam 0)
                // Calcular total baseado nas alíquotas individuais (sempre calcular, não usar total do config)
                const federalRate = yearRates.federal !== undefined ? yearRates.federal : 0
                const icmsRate = yearRates.icms !== undefined ? yearRates.icms : 0
                const issRate = yearRates.iss !== undefined ? yearRates.iss : 0
                const calculatedTotal = federalRate + icmsRate + issRate
                
                // Armazenar alíquotas (sempre incluir, mesmo que sejam 0)
                originTaxRates = {
                  federal: federalRate,
                  icms: icmsRate,
                  iss: issRate,
                  total: calculatedTotal
                }
                // Calcular impostos individuais
                const federalTax = annualRevenue * federalRate
                const icmsTax = annualRevenue * icmsRate
                const issTax = annualRevenue * issRate
                originTax = federalTax + icmsTax + issTax
                originTaxBreakdown = {
                  federal: federalTax,
                  icms: icmsTax,
                  iss: issTax
                }
              } else {
                // Fallback: mesmo sem yearRates, manter estrutura para mostrar ?? no frontend
                const companyTypeName = (companyTypeConfig as any)?.name || companyTypeForTax
                setTaxRateWarning(
                  `⚠️ Alíquota incompleta: Não foi encontrada configuração de impostos para ${companyTypeName} no regime Lucro Presumido para o ano selecionado. ` +
                  `O cálculo está usando uma taxa geral aproximada.`
                )
                originTax = annualRevenue * taxRegimeData.rate
                originTaxRates = {
                  federal: undefined,
                  icms: undefined,
                  iss: undefined,
                  total: taxRegimeData.rate
                }
              }
            } else if (taxRegime === 'real' && taxRates.real) {
              // Lucro Real - valores fixos
              const realRates = taxRates.real
              // Calcular total baseado nas alíquotas individuais
              const pisRate = realRates.pis || 0
              const cofinsRate = realRates.cofins || 0
              const irpjRate = realRates.irpj || 0
              const csllRate = realRates.csll || 0
              const calculatedTotal = pisRate + cofinsRate + irpjRate + csllRate
              
              // Armazenar alíquotas
              originTaxRates = {
                pis: pisRate,
                cofins: cofinsRate,
                irpj: irpjRate,
                csll: csllRate,
                total: calculatedTotal
              }
              const pisTax = annualRevenue * (realRates.pis || 0)
              const cofinsTax = annualRevenue * (realRates.cofins || 0)
              const irpjTax = annualRevenue * (realRates.irpj || 0)
              const csllTax = annualRevenue * (realRates.csll || 0)
              originTax = pisTax + cofinsTax + irpjTax + csllTax
              originTaxBreakdown = {
                pis: pisTax,
                cofins: cofinsTax,
                irpj: irpjTax,
                csll: csllTax
              }
            } else {
              // Fallback: manter estrutura baseada no regime
              originTax = annualRevenue * taxRegimeData.rate
              if (taxRegime === 'real') {
                // Para Lucro Real, usar estrutura de PIS/COFINS/IRPJ/CSLL
                originTaxRates = {
                  pis: undefined,
                  cofins: undefined,
                  irpj: undefined,
                  csll: undefined,
                  total: taxRegimeData.rate
                }
              } else {
                // Para Presumido, usar estrutura de Federal/ICMS/ISS
                originTaxRates = {
                  federal: undefined,
                  icms: undefined,
                  iss: undefined,
                  total: taxRegimeData.rate
                }
              }
            }
          } else {
            // Formato antigo ou fallback - manter estrutura baseada no regime
            originTax = annualRevenue * taxRegimeData.rate
            if (taxRegime === 'real') {
              // Para Lucro Real, usar estrutura de PIS/COFINS/IRPJ/CSLL
              originTaxRates = {
                pis: undefined,
                cofins: undefined,
                irpj: undefined,
                csll: undefined,
                total: taxRegimeData.rate
              }
            } else {
              // Para Presumido, usar estrutura de Federal/ICMS/ISS
              originTaxRates = {
                federal: undefined,
                icms: undefined,
                iss: undefined,
                total: taxRegimeData.rate
              }
            }
          }
        }
        
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
        const accountingCost = (companyTypeData as any).accountingCost || 0
        originOperational = operationalCosts + (accountingCost * 12) // EUR/mês para USD/ano
      }
      
      const originTotalCost = originTax + originPayroll + originOperational
      
      // === CÁLCULOS DUBAI ===
      const dubaiLicense = freeZoneData.annualCost
      const dubaiSetup = freeZoneData.setupCost
      const dubaiVisas = visaCount * freeZoneData.visaCost
      const dubaiOffice = officeCost
      const dubaiServices = serviceCosts
      
      const dubaiTotalCost = dubaiLicense + dubaiSetup + dubaiVisas + dubaiOffice + dubaiServices + dubaiTax
      
      // === COMPARAÇÃO ===
      // Sempre calcular comparação com Brasil, mesmo quando "Apenas Dubai" está selecionado
      let savings = 0
      let savingsPercentage = 0
      
      // Se for apenas Dubai, usar os cálculos do Brasil para comparação
      const comparisonTotalCost = comparisonCountry === 'dubai' ? brazilTotalCost : originTotalCost
      const comparisonTax = comparisonCountry === 'dubai' ? brazilTax : originTax
      const comparisonPayroll = comparisonCountry === 'dubai' ? brazilPayroll : originPayroll
      const comparisonOperational = comparisonCountry === 'dubai' ? brazilOperational : originOperational
      const comparisonTaxBreakdown = comparisonCountry === 'dubai' 
        ? (Object.keys(brazilTaxBreakdown).length > 0 ? brazilTaxBreakdown : undefined)
        : (Object.keys(originTaxBreakdown).length > 0 ? originTaxBreakdown : undefined)
      const comparisonTaxRates = comparisonCountry === 'dubai'
        ? (Object.keys(brazilTaxRates).length > 0 ? brazilTaxRates : undefined)
        : (Object.keys(originTaxRates).length > 0 ? originTaxRates : undefined)
      
      if (comparisonTotalCost > 0) {
        savings = comparisonTotalCost - dubaiTotalCost
        savingsPercentage = (savings / comparisonTotalCost) * 100
      }
      
      const calculationResult: CalculationResult = {
        // País de Origem (sempre incluir Brasil para comparação)
        brazilTotalCost: comparisonTotalCost,
        brazilTax: comparisonTax,
        brazilPayroll: comparisonPayroll,
        brazilOperational: comparisonOperational,
        taxBreakdown: comparisonTaxBreakdown,
        taxRates: comparisonTaxRates,
        
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
        originalCountry: comparisonCountry === 'dubai' ? 'Brasil' : countryData.name, // Sempre mostrar Brasil para comparação
        freeZone: freeZoneData.name,
        taxRegime: taxRegime === 'simples' ? 'Simples Nacional' : 
                   taxRegime === 'presumido' ? 'Lucro Presumido' : 
                   taxRegime === 'real' ? 'Lucro Real' : 
                   taxRegimeData.name, // Usar o regime selecionado pelo usuário
        companyType: (formData.comparisonCountry === 'brasil' || formData.comparisonCountry === 'dubai') ? (formData.companyType || 'industria') : '',
        annualRevenue,
        employees,
        freeZoneComparisons: comparisonCountry === 'dubai' ? freeZoneComparisons : undefined
      }
      
      setResult(calculationResult)
      onCalculationUpdate(calculationResult)
      setIsCalculating(false)
      calculatingRef.current = false
    }, 1500)
  }, [
    formData.annualRevenue,
    formData.comparisonCountry,
    formData.freeZone,
    formData.taxRegime,
    formData.employees,
    formData.operationalCosts,
    formData.visaCount,
    formData.officeCost,
    formData.serviceCosts,
    formData.companyType,
    config,
    taxRegimesWithNames,
    freeZones,
    companyTypesWithNames,
    countries,
    onCalculationUpdate
  ])
  
  const handleCalculate = () => {
    // Limpar erros anteriores e alertas
    setErrors({})
    setTaxRateWarning(null)
    
    // Validar campos
    const newErrors: Record<string, string> = {}
    
    // Validar faturamento anual
    if (!formData.annualRevenue || formData.annualRevenue <= 0) {
      newErrors.annualRevenue = 'Faturamento anual é obrigatório e deve ser maior que zero'
    }
    
    // Validar funcionários
    if (!formData.employees || formData.employees <= 0) {
      newErrors.employees = 'Número de funcionários é obrigatório'
    }
    
    // Validar custos operacionais
    if (formData.operationalCosts < 0) {
      newErrors.operationalCosts = 'Custos operacionais não podem ser negativos'
    }

    
    // Validar vistos
    if (!formData.visaCount || formData.visaCount <= 0) {
      newErrors.visaCount = 'Número de vistos é obrigatório'
    }
    
    // Validar custo de escritório
    if (formData.officeCost < 0) {
      newErrors.officeCost = 'Custo de escritório não pode ser negativo'
    }
    
    // Validar custos de serviços
    if (formData.serviceCosts < 0) {
      newErrors.serviceCosts = 'Custos de serviços não podem ser negativos'
    }
    
    // Validar tipo de empresa quando necessário
    if ((formData.comparisonCountry === 'brasil' || formData.comparisonCountry === 'dubai') && 
        !formData.companyType) {
      newErrors.companyType = 'Tipo de empresa é obrigatório'
    }
    
    // Validar tipo de sociedade para Portugal
    if (formData.comparisonCountry === 'portugal' && !formData.companyType) {
      newErrors.companyType = 'Tipo de sociedade é obrigatório para Portugal'
    }
    
    // Se houver erros, mostrar e fazer scroll
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      // Scroll para o primeiro erro
      setTimeout(() => {
        const firstErrorField = Object.keys(newErrors)[0]
        if (firstErrorField) {
          const element = document.querySelector(`[name="${firstErrorField}"]`) || 
                         document.querySelector(`#${firstErrorField}`)
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
      return
    }
    
    // Verificar se config está carregado
    if (!config) {
      setErrors({ general: 'Aguarde o carregamento das configurações...' })
      return
    }
    
    setHasCalculated(true)
    calculateTaxes()
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }


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

      {/* Alerta de Erro Geral */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <div className="w-5 h-5 text-red-600">⚠️</div>
          <p className="text-red-800 text-sm">{errors.general}</p>
        </div>
      )}

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
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            Faturamento Anual (USD) <span className="text-red-500">*</span>
            <Tooltip content="Valor total de receita anual da empresa em dólares americanos. Este valor será usado para calcular os impostos no Brasil e o lucro em Dubai (Lucro = Faturamento - Custos Operacionais)." />
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
          <input
              id="annualRevenue"
              name="annualRevenue"
              type="text"
              value={formatCurrencyInput(formData.annualRevenue)}
              onChange={(e) => {
                const numericValue = parseCurrency(e.target.value)
                handleInputChange('annualRevenue', numericValue)
              }}
              onBlur={(e) => {
                // Garante formatação ao sair do campo
                const numericValue = parseCurrency(e.target.value)
                handleInputChange('annualRevenue', numericValue)
              }}
              className={`input-field pl-8 ${errors.annualRevenue ? 'border-red-500 border-2' : ''}`}
              placeholder="500,000"
            />
          </div>
          {errors.annualRevenue ? (
            <p className="text-xs text-red-600 mt-1">{errors.annualRevenue}</p>
          ) : (
            <p className="text-xs text-gray-500 mt-1">
              {formatCurrency(formData.annualRevenue)}
            </p>
          )}
        </div>

        {/* País de Comparação */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            País de Comparação
            <Tooltip content="Selecione o país para comparação fiscal. 'Apenas Dubai/UAE' calcula apenas os custos em Dubai. 'Brasil' ou 'Portugal' compara os custos tributários entre o país selecionado e Dubai." />
          </label>
          <select
            value={formData.comparisonCountry}
            onChange={(e) => handleInputChange('comparisonCountry', e.target.value)}
            className="input-field"
          >
                <option value="dubai">Apenas Dubai/UAE</option>
                <option value="brasil">Brasil</option>
                <option value="portugal">Portugal</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {formData.comparisonCountry === 'dubai' 
              ? 'Calcular apenas impostos em Dubai'
              : 'País para comparação com Dubai'}
          </p>
        </div>

            {/* Tipo de Empresa (Brasil ou Dubai) - Sempre mostrar para todos os regimes */}
            {(formData.comparisonCountry === 'brasil' || formData.comparisonCountry === 'dubai') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  Categoria da Empresa <span className="text-red-500">*</span>
                  <Tooltip content="Selecione o tipo de atividade da empresa: Indústria (produção/manufatura), Serviços (prestação de serviços) ou Comércio (venda de produtos). Cada categoria tem alíquotas tributárias diferentes no Brasil." />
                </label>
                <select
                  id="companyType"
                  name="companyType"
                  value={formData.companyType}
                  onChange={(e) => handleInputChange('companyType', e.target.value)}
                  className={`input-field ${errors.companyType ? 'border-red-500 border-2' : ''}`}
                >
                  <option value="">Selecione...</option>
                  <option value="industria">Indústria</option>
                  <option value="servicos">Serviços</option>
                  <option value="comercio">Comércio</option>
                </select>
                {errors.companyType ? (
                  <p className="text-xs text-red-600 mt-1">{errors.companyType}</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">
                    {config?.business?.companyTypes?.[formData.companyType]?.description || 'Selecione a categoria da empresa'}
                  </p>
                )}
              </div>
            )}

            {/* Regime Tributário (Brasil ou Dubai) */}
            {(formData.comparisonCountry === 'brasil' || formData.comparisonCountry === 'dubai') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  Tipo de Regime
                  <Tooltip content="Regime tributário brasileiro para comparação: Simples Nacional (até 6-23% dependendo da categoria), Lucro Presumido (15-28% com variações por ano) ou Lucro Real (33% fixo). Em Dubai, este campo é apenas para referência, pois usa Corporate Tax de 9%." />
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
                  {formData.comparisonCountry === 'dubai' 
                    ? 'Para referência (Dubai usa Corporate Tax)'
                    : taxRegimesWithNames[formData.taxRegime as TaxRegimeKey]?.description}
                </p>
              </div>
            )}

            {/* Tipo de Sociedade (apenas Portugal) */}
            {formData.comparisonCountry === 'portugal' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  Tipo de Sociedade <span className="text-red-500">*</span>
                  <Tooltip content="Tipo de estrutura societária em Portugal: Sociedade Unipessoal (um único sócio) ou Sociedade por Quotas (múltiplos sócios). Cada tipo tem custos de setup e contabilidade diferentes." />
                </label>
                <select
                  id="companyType"
                  name="companyType"
                  value={formData.companyType}
                  onChange={(e) => handleInputChange('companyType', e.target.value)}
                  className={`input-field ${errors.companyType ? 'border-red-500 border-2' : ''}`}
                >
                  <option value="">Selecione...</option>
                  {Object.entries(companyTypesWithNames).map(([key, type]) => (
                    <option key={key} value={key}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {errors.companyType ? (
                  <p className="text-xs text-red-600 mt-1">{errors.companyType}</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">
                    {companyTypesWithNames[formData.companyType as keyof typeof companyTypesWithNames]?.description}
                  </p>
                )}
              </div>
            )}
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
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Número de Funcionários/Sócios
                <Tooltip content="Total de pessoas que trabalharão na empresa, incluindo sócios e funcionários. Este número é usado para calcular os custos de folha de pagamento e encargos sociais no Brasil/Portugal." />
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
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Custos Operacionais Anuais (USD) <span className="text-red-500">*</span>
                <Tooltip content="Custos operacionais anuais da empresa (aluguel, serviços, marketing, etc.). Em Dubai, este valor é subtraído do faturamento para calcular o lucro: Lucro = Faturamento - Custos Operacionais. O Corporate Tax (9%) é aplicado apenas sobre o lucro acima de USD 102,000." />
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                  id="operationalCosts"
                  name="operationalCosts"
                  type="text"
                  value={formatCurrencyInput(formData.operationalCosts)}
                  onChange={(e) => {
                    const numericValue = parseCurrency(e.target.value)
                    handleInputChange('operationalCosts', numericValue)
                  }}
                  onBlur={(e) => {
                    const numericValue = parseCurrency(e.target.value)
                    handleInputChange('operationalCosts', numericValue)
                  }}
                  className={`input-field pl-8 ${errors.operationalCosts ? 'border-red-500 border-2' : ''}`}
                  placeholder="50,000"
                />
              </div>
              {errors.operationalCosts ? (
                <p className="text-xs text-red-600 mt-1">{errors.operationalCosts}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                  Aluguel, serviços, marketing, etc. Em Dubai: Lucro = Faturamento - Custos Operacionais
                </p>
              )}
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
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Free Zone
                <Tooltip content="Selecione a Free Zone onde a empresa será estabelecida. Cada Free Zone tem custos diferentes de licença anual, setup inicial e visto. Todas seguem o mesmo Corporate Tax de 9% sobre lucro acima de USD 102,000." />
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

            {/* N° de Vistos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                N° de Vistos Necessários <span className="text-red-500">*</span>
                <Tooltip content="Quantidade de vistos de residência/emprego necessários para sócios e funcionários. O custo do visto varia conforme a Free Zone selecionada. Este valor será multiplicado pelo custo unitário do visto da Free Zone escolhida." />
              </label>
              <input
                id="visaCount"
                name="visaCount"
                type="number"
                value={formData.visaCount}
                onChange={(e) => handleInputChange('visaCount', Number(e.target.value))}
                className={`input-field ${errors.visaCount ? 'border-red-500 border-2' : ''}`}
                placeholder="Ex: 2"
                min="1"
                max="20"
              />
              {errors.visaCount ? (
                <p className="text-xs text-red-600 mt-1">{errors.visaCount}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                  Vistos de residência/emprego
                </p>
              )}
            </div>

            {/* Custo de Escritório */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Custo Anual de Escritório (USD)
                <Tooltip content="Custo anual do aluguel de escritório físico em Dubai. Este valor é adicionado aos custos operacionais da empresa. Algumas Free Zones exigem escritório físico mínimo, outras permitem flexi desk." />
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                  id="officeCost"
                  name="officeCost"
                  type="text"
                  value={formatCurrencyInput(formData.officeCost)}
                  onChange={(e) => {
                    const numericValue = parseCurrency(e.target.value)
                    handleInputChange('officeCost', numericValue)
                  }}
                  onBlur={(e) => {
                    const numericValue = parseCurrency(e.target.value)
                    handleInputChange('officeCost', numericValue)
                  }}
                  className={`input-field pl-8 ${errors.officeCost ? 'border-red-500 border-2' : ''}`}
                  placeholder="24,000"
                />
              </div>
              {errors.officeCost ? (
                <p className="text-xs text-red-600 mt-1">{errors.officeCost}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                  Aluguel de escritório • {formatCurrency(formData.officeCost)}
                </p>
              )}
            </div>

            {/* Custos de Serviços */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Custos de Serviços (USD)
                <Tooltip content="Custos anuais de serviços profissionais como contabilidade, jurídico, consultoria, etc. Este valor é adicionado aos custos operacionais da empresa em Dubai." />
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                  id="serviceCosts"
                  name="serviceCosts"
                  type="text"
                  value={formatCurrencyInput(formData.serviceCosts)}
                  onChange={(e) => {
                    const numericValue = parseCurrency(e.target.value)
                    handleInputChange('serviceCosts', numericValue)
                  }}
                  onBlur={(e) => {
                    const numericValue = parseCurrency(e.target.value)
                    handleInputChange('serviceCosts', numericValue)
                  }}
                  className={`input-field pl-8 ${errors.serviceCosts ? 'border-red-500 border-2' : ''}`}
                  placeholder="12,000"
                />
              </div>
              {errors.serviceCosts ? (
                <p className="text-xs text-red-600 mt-1">{errors.serviceCosts}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                  Contabilidade, jurídico, etc. • {formatCurrency(formData.serviceCosts)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Botão de Calcular */}
      <div className="flex justify-center pt-6">
        <button
          onClick={handleCalculate}
          disabled={isCalculating || !config}
          className="btn-primary flex items-center gap-2 px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCalculating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Calculando...
            </>
          ) : (
            <>
              <Calculator className="w-5 h-5" />
              Calcular Otimização Fiscal
            </>
          )}
        </button>
      </div>

      {/* Mensagem se não calculou ainda */}
      {!hasCalculated && !isCalculating && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-blue-800 text-sm">
            💡 Preencha os campos acima e clique em <strong>"Calcular Otimização Fiscal"</strong> para ver os resultados
          </p>
        </div>
      )}

      {/* Alerta de alíquota não configurada */}
      {taxRateWarning && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 mt-6">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-yellow-800 text-sm leading-relaxed">
                {taxRateWarning}
              </p>
              <a 
                href="/admin/dashboard" 
                target="_blank"
                className="text-yellow-700 hover:text-yellow-900 underline text-sm font-medium mt-2 inline-block"
              >
                Acessar Painel Administrativo →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && hasCalculated && (
        <div className="space-y-8">
          {/* Summary Cards */}
          {/* Sempre mostrar comparação Brasil vs Dubai */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Brasil Total Cost */}
            <div className="result-card result-negative">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Custo Total em {result.originalCountry}
              </h4>
              <p className="text-3xl font-bold text-red-600">
                ${result.brazilTotalCost.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {result.taxRegime || 'por ano'}
              </p>
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
                Free Zone + Operacionais + Impostos
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
            {/* Brasil Breakdown - Sempre mostrar quando houver valores */}
            {result.brazilTotalCost > 0 && (
              <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-600" />
                  Detalhamento {result.originalCountry}
                </h4>
              <div className="space-y-3">
                {/* Visualização das Alíquotas - SEMPRE mostrar */}
                <div className="mb-4 p-4 bg-white rounded-lg border border-red-300">
                  <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-red-600" />
                    Alíquotas Aplicadas ({result.taxRegime}
                    {result.companyType && config?.business?.companyTypes?.[result.companyType]?.name && (
                      <> - {config.business.companyTypes[result.companyType].name}</>
                    )})
                  </h5>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {/* Para Simples Nacional - mostrar breakdown detalhado */}
                    {result.taxRegime?.toLowerCase().includes('simples') && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Federal:</span>
                          <span className="font-semibold text-red-600">
                            {result.taxRates?.federal !== undefined 
                              ? `${(result.taxRates.federal * 100).toFixed(2)}%`
                              : '??'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">ICMS:</span>
                          <span className="font-semibold text-red-600">
                            {result.taxRates?.icms !== undefined 
                              ? `${(result.taxRates.icms * 100).toFixed(2)}%`
                              : '??'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">ISS:</span>
                          <span className="font-semibold text-red-600">
                            {result.taxRates?.iss !== undefined 
                              ? `${(result.taxRates.iss * 100).toFixed(2)}%`
                              : '??'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center col-span-2 pt-2 border-t border-gray-300">
                          <span className="text-gray-700 font-semibold">Total:</span>
                          <span className="font-bold text-red-700">
                            {result.taxRates?.total !== undefined 
                              ? `${(result.taxRates.total * 100).toFixed(2)}%`
                              : '??'}
                          </span>
                        </div>
                      </>
                    )}
                    
                    {/* Para Lucro Presumido - SEMPRE mostrar Federal, ICMS, ISS */}
                    {result.taxRegime?.toLowerCase().includes('presumido') && !result.taxRegime?.toLowerCase().includes('simples') && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Federal:</span>
                          <span className="font-semibold text-red-600">
                            {result.taxRates?.federal !== undefined 
                              ? `${(result.taxRates.federal * 100).toFixed(2)}%`
                              : '??'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">ICMS:</span>
                          <span className="font-semibold text-red-600">
                            {result.taxRates?.icms !== undefined 
                              ? `${(result.taxRates.icms * 100).toFixed(2)}%`
                              : '??'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">ISS:</span>
                          <span className="font-semibold text-red-600">
                            {result.taxRates?.iss !== undefined 
                              ? `${(result.taxRates.iss * 100).toFixed(2)}%`
                              : '??'}
                          </span>
                        </div>
                      </>
                    )}
                    
                    {/* Para Lucro Real - SEMPRE mostrar PIS, COFINS, IRPJ, CSLL */}
                    {result.taxRegime?.toLowerCase().includes('real') && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">PIS:</span>
                          <span className="font-semibold text-red-600">
                            {result.taxRates?.pis !== undefined 
                              ? `${(result.taxRates.pis * 100).toFixed(2)}%`
                              : '??'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">COFINS:</span>
                          <span className="font-semibold text-red-600">
                            {result.taxRates?.cofins !== undefined 
                              ? `${(result.taxRates.cofins * 100).toFixed(2)}%`
                              : '??'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">IRPJ:</span>
                          <span className="font-semibold text-red-600">
                            {result.taxRates?.irpj !== undefined 
                              ? `${(result.taxRates.irpj * 100).toFixed(2)}%`
                              : '??'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">CSLL:</span>
                          <span className="font-semibold text-red-600">
                            {result.taxRates?.csll !== undefined 
                              ? `${(result.taxRates.csll * 100).toFixed(2)}%`
                              : '??'}
                          </span>
                        </div>
                      </>
                    )}
                    
                    {/* Sempre mostrar total */}
                    <div className="col-span-2 flex justify-between items-center pt-2 border-t border-red-200">
                      <span className="text-gray-700 font-semibold">Total:</span>
                      <span className="font-bold text-red-700">
                        {result.taxRates?.total !== undefined 
                          ? `${(result.taxRates.total * 100).toFixed(2)}%`
                          : '??'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {result.taxBreakdown ? (
                  <>
                    {/* Breakdown detalhado de impostos */}
                    {result.taxBreakdown.pis !== undefined && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">PIS</span>
                        <span className="font-semibold text-red-600">
                          ${result.taxBreakdown.pis.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {result.taxBreakdown.cofins !== undefined && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">COFINS</span>
                        <span className="font-semibold text-red-600">
                          ${result.taxBreakdown.cofins.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {result.taxBreakdown.irpj !== undefined && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">IRPJ</span>
                        <span className="font-semibold text-red-600">
                          ${result.taxBreakdown.irpj.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {result.taxBreakdown.csll !== undefined && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">CSLL</span>
                        <span className="font-semibold text-red-600">
                          ${result.taxBreakdown.csll.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {result.taxBreakdown.federal !== undefined && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Federal (PIS/COFINS/IRPJ/CSLL)</span>
                        <span className="font-semibold text-red-600">
                          ${result.taxBreakdown.federal.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {result.taxBreakdown.icms !== undefined && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">ICMS</span>
                        <span className="font-semibold text-red-600">
                          ${result.taxBreakdown.icms.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {result.taxBreakdown.iss !== undefined && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">ISS</span>
                        <span className="font-semibold text-red-600">
                          ${result.taxBreakdown.iss.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <hr className="border-red-200" />
                  </>
                ) : (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Impostos ({result.taxRegime})</span>
                  <span className="font-semibold text-red-600">
                    ${result.brazilTax.toLocaleString()}
                  </span>
                </div>
                )}
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
            )}
            {/* Dubai Breakdown */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Detalhamento Dubai - {result.freeZone}
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
                  <span className="text-gray-600">Corporate Tax (9% sobre lucro acima de $102k)</span>
                  <span className="font-semibold text-blue-600">
                    ${result.dubaiTax.toLocaleString()}
                  </span>
                </div>
                <hr className="border-blue-200" />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Anual</span>
                  <span className="text-blue-600">
                    ${result.dubaiTotalCost.toLocaleString()}
                  </span>
                </div>
                {formData.comparisonCountry === 'dubai' && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      <strong>💡 Nota:</strong> O Corporate Tax é calculado sobre o lucro (Faturamento - Custos Operacionais). 
                      Se o lucro for maior que USD 102,000, aplica-se 9% sobre o excedente.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Projeção e Insights - Sempre mostrar quando houver economia */}
          {result.savings > 0 && (
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
          )}

          {/* Comparativo de Free Zones - Apenas para Dubai */}
          {formData.comparisonCountry === 'dubai' && freeZoneComparisons.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Comparativo de Free Zones
              </h4>
              <p className="text-sm text-gray-600 mb-6">
                Compare os custos anuais entre as diferentes Free Zones disponíveis
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b-2 border-gray-200">
                      <th className="text-left p-3 text-sm font-semibold text-gray-700">Free Zone</th>
                      <th className="text-right p-3 text-sm font-semibold text-gray-700">Licença Anual</th>
                      <th className="text-right p-3 text-sm font-semibold text-gray-700">Setup</th>
                      <th className="text-right p-3 text-sm font-semibold text-gray-700">Vistos</th>
                      <th className="text-right p-3 text-sm font-semibold text-gray-700">Escritório</th>
                      <th className="text-right p-3 text-sm font-semibold text-gray-700">Serviços</th>
                      <th className="text-right p-3 text-sm font-semibold text-gray-700">Impostos</th>
                      <th className="text-right p-3 text-sm font-semibold text-gray-700">Total Anual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {freeZoneComparisons.map((zone, index) => {
                      const isSelected = zone.key === formData.freeZone
                      const isCheapest = index === 0
                      return (
                        <tr 
                          key={zone.key}
                          className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                            isSelected ? 'bg-blue-50 border-blue-200' : ''
                          } ${isCheapest ? 'bg-green-50' : ''}`}
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-800">{zone.name}</span>
                              {isSelected && (
                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">Selecionada</span>
                              )}
                              {isCheapest && !isSelected && (
                                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Mais Econômica</span>
                              )}
                            </div>
                            {zone.description && (
                              <p className="text-xs text-gray-500 mt-1">{zone.description}</p>
                            )}
                          </td>
                          <td className="text-right p-3 text-sm text-gray-700">
                            ${zone.license.toLocaleString()}
                          </td>
                          <td className="text-right p-3 text-sm text-gray-700">
                            ${zone.setup.toLocaleString()}
                          </td>
                          <td className="text-right p-3 text-sm text-gray-700">
                            ${zone.visas.toLocaleString()}
                          </td>
                          <td className="text-right p-3 text-sm text-gray-700">
                            ${zone.office.toLocaleString()}
                          </td>
                          <td className="text-right p-3 text-sm text-gray-700">
                            ${zone.services.toLocaleString()}
                          </td>
                          <td className="text-right p-3 text-sm text-gray-700">
                            ${zone.tax.toLocaleString()}
                          </td>
                          <td className="text-right p-3">
                            <span className={`font-bold ${
                              isCheapest ? 'text-green-600' : isSelected ? 'text-blue-600' : 'text-gray-800'
                            }`}>
                              ${zone.total.toLocaleString()}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>💡 Dica:</strong> Clique em uma Free Zone acima para ver os detalhes completos. 
                  A Free Zone mais econômica está destacada em verde.
                </p>
              </div>
            </div>
          )}

          {/* Benefícios UAE - Apenas para Dubai */}
          {formData.comparisonCountry === 'dubai' && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Benefícios das Free Zones UAE
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-gray-700 mb-2">Vantagens Fiscais</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✅ 0% imposto pessoal</li>
                    <li>✅ 0% imposto corporativo (até limite)</li>
                    <li>✅ 100% propriedade estrangeira</li>
                    <li>✅ 100% repatriação de capital</li>
                    <li>✅ Sem restrições de câmbio</li>
                  </ul>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-gray-700 mb-2">Vantagens Operacionais</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✅ Processo de setup rápido</li>
                    <li>✅ Ambiente de negócios moderno</li>
                    <li>✅ Acesso a mercados globais</li>
                    <li>✅ Infraestrutura de classe mundial</li>
                    <li>✅ Vistos de residência facilitados</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Gráfico de Comparação - Sempre mostrar quando houver valores */}
          {result.brazilTotalCost > 0 && (
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
          )}
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