'use client'

import { useState, useEffect } from 'react'
import { 
  Plane, 
  Users, 
  DollarSign, 
  Clock, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Building,
  Home,
  GraduationCap,
  Heart
} from 'lucide-react'
import { useCalculatorConfig } from '@/hooks/useCalculatorConfig'

interface VisaCalculatorProps {
  onCalculationUpdate: (data: any) => void
}

interface VisaResult {
  // Custos
  visaCost: number
  medicalCost: number
  emiratesIdCost: number
  documentCost: number
  totalCost: number
  
  // Timeline
  processingTime: number // dias
  validityPeriod: number // anos
  
  // Requisitos
  requirements: string[]
  documents: string[]
  
  // Detalhes
  visaType: string
  emirate: string
  familySize: number
  includesFamily: boolean
  
  // Benefícios
  benefits: string[]
  restrictions: string[]
}

export default function VisaCalculator({ onCalculationUpdate }: VisaCalculatorProps) {
  const { config, isLoading: configLoading } = useCalculatorConfig()
  
  const [formData, setFormData] = useState({
    visaType: 'golden', // Mudança para Golden Visa como padrão
    emirate: 'dubai',
    familySize: 1,
    includeFamily: true,
    propertyValue: 0,
    businessSetup: false
  })
  
  const [result, setResult] = useState<VisaResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Usar dados do banco ou fallback para dados padrão
  const defaultVisaTypes = {
    golden: {
      name: 'Golden Visa (10 anos)',
      description: 'Para investidores em imóveis - USD 544,600',
      minInvestment: 544600,
      validity: 10,
      processingTime: 30
    },
    retirement: {
      name: 'Retirement Visa (5 anos)',
      description: 'Para aposentados com renda comprovada',
      minInvestment: 272300,
      validity: 5,
      processingTime: 45
    },
    property: {
      name: 'Property Investor Visa (2 anos)',
      description: 'Para investidores em imóveis - USD 204,225',
      minInvestment: 204225,
      validity: 2,
      processingTime: 30
    },
    green: {
      name: 'Green Visa (5 anos)',
      description: 'Para profissionais qualificados',
      minInvestment: 0,
      validity: 5,
      processingTime: 30
    },
    employment: {
      name: 'Employee Visa (2 anos)',
      description: 'Para funcionários de empresas locais',
      minInvestment: 0,
      validity: 2,
      processingTime: 60
    }
  }

  const visaTypes = (config?.visa?.types && typeof config.visa.types === 'object')
    ? config.visa.types
    : defaultVisaTypes

  // Usar dados do banco ou fallback para dados padrão
  const defaultEmirates = {
    dubai: { name: 'Dubai', multiplier: 1.0 },
    abu_dhabi: { name: 'Abu Dhabi', multiplier: 0.9 },
    sharjah: { name: 'Sharjah', multiplier: 0.8 },
    ajman: { name: 'Ajman', multiplier: 0.7 },
    ras_al_khaimah: { name: 'Ras Al Khaimah', multiplier: 0.7 },
    fujairah: { name: 'Fujairah', multiplier: 0.6 },
    umm_al_quwain: { name: 'Umm Al Quwain', multiplier: 0.6 }
  }

  const emirates = (config?.visa?.emirates && typeof config.visa.emirates === 'object')
    ? config.visa.emirates
    : defaultEmirates

  const calculateVisaCosts = () => {
    if (configLoading || !visaTypes || !emirates) return
    
    setIsCalculating(true)
    
    setTimeout(() => {
      const { visaType, emirate, familySize, includeFamily, propertyValue, businessSetup } = formData
      
      const visaTypeData = visaTypes[visaType as keyof typeof visaTypes]
      const emirateData = emirates[emirate as keyof typeof emirates]
      
      // Usar custos do banco ou fallback para dados padrão
      const baseCosts = config?.visa?.costs || {
        golden: {
          visa: 2859,
          medical: 320,
          emiratesId: 370,
          documents: 2668
        },
        retirement: {
          visa: 545,
          medical: 320,
          emiratesId: 370,
          documents: 1500
        },
        property: {
          visa: 272,
          medical: 320,
          emiratesId: 370,
          documents: 1200
        },
        green: {
          visa: 327,
          medical: 320,
          emiratesId: 370,
          documents: 800
        },
        employment: {
          visa: 136,
          medical: 320,
          emiratesId: 370,
          documents: 500
        }
      }
      
      const baseCost = baseCosts[visaType as keyof typeof baseCosts]
      const emirateMultiplier = emirateData.multiplier
      
      // Calcular custos
      let visaCost = baseCost.visa * emirateMultiplier
      let medicalCost = baseCost.medical * emirateMultiplier
      let emiratesIdCost = baseCost.emiratesId * emirateMultiplier
      let documentCost = baseCost.documents * emirateMultiplier
      
      // Aplicar multiplicador para família
      const familyMultiplier = includeFamily ? 1 + (familySize - 1) * 0.7 : 1
      visaCost *= familyMultiplier
      medicalCost *= familyMultiplier
      emiratesIdCost *= familyMultiplier
      documentCost *= familyMultiplier
      
      // Custos adicionais para visto de investidor
      if (visaType === 'investor' && propertyValue > 0) {
        documentCost += 2000 // Taxa adicional para documentação de propriedade
      }
      
      // Custos adicionais para visto de negócios
      if (visaType === 'business' && businessSetup) {
        documentCost += 3000 // Taxa adicional para setup de empresa
      }
      
      const totalCost = visaCost + medicalCost + emiratesIdCost + documentCost
      
      // Requisitos por tipo de visto (conforme escopo do cliente)
      const requirements = {
        golden: [
          'Investimento mínimo de USD 544,600 em imóvel',
          'Pode ser até 3 propriedades',
          'Se propriedade conjunta: cada parte mínimo USD 204,225',
          'Se financiado: entrada mínima 50%',
          'Seguro saúde válido'
        ],
        retirement: [
          'Investimento mínimo de USD 272,300',
          'Idade mínima de 55 anos',
          'Renda passiva de USD 4,000/mês comprovada',
          'Seguro saúde válido',
          'Certificado de antecedentes criminais'
        ],
        property: [
          'Investimento mínimo de USD 204,225',
          'Propriedade quitada ou financiada',
          'Comprovante de propriedade',
          'Seguro saúde válido',
          'Certificado de antecedentes criminais'
        ],
        green: [
          'Qualificação profissional específica',
          'Contrato de trabalho ou freelancer license',
          'Comprovante de renda adequada',
          'Seguro saúde válido',
          'Certificado de antecedentes criminais'
        ],
        employment: [
          'Contrato de trabalho válido',
          'Salário mínimo de USD 1,090/mês',
          'Seguro saúde fornecido pelo empregador',
          'Certificado de antecedentes criminais',
          'Exame médico aprovado'
        ]
      }
      
      // Documentos necessários
      const documents = [
        'Passaporte válido (mínimo 6 meses)',
        'Fotos 4x6 (fundo branco)',
        'Formulário de aplicação preenchido',
        'Certificado de antecedentes criminais',
        'Exame médico aprovado',
        'Seguro saúde válido',
        'Comprovante de renda',
        'Comprovante de investimento (se aplicável)'
      ]
      
      // Benefícios por tipo de visto (conforme escopo do cliente)
      const benefits = {
        golden: [
          'Residência por 10 anos renovável',
          'Visto para família incluído',
          'Acesso a serviços bancários',
          'Possibilidade de abrir empresa',
          'Isenção de impostos pessoais',
          'Pathway to citizenship (7 anos)'
        ],
        retirement: [
          'Residência por 5 anos renovável',
          'Visto para família incluído',
          'Acesso a serviços bancários',
          'Isenção de impostos pessoais',
          'Acesso a serviços de saúde',
          'Renovação a cada 5 anos'
        ],
        property: [
          'Residência por 2 anos renovável',
          'Visto para família incluído',
          'Acesso a serviços bancários',
          'Possibilidade de investir em mais imóveis',
          'Isenção de impostos pessoais'
        ],
        green: [
          'Residência por 5 anos renovável',
          'Visto para família incluído',
          'Acesso a serviços bancários',
          'Possibilidade de mudança de emprego',
          'Benefícios trabalhistas'
        ],
        employment: [
          'Residência por 2 anos renovável',
          'Visto para família (com restrições)',
          'Acesso a serviços bancários',
          'Possibilidade de mudança de emprego',
          'Benefícios trabalhistas'
        ]
      }
      
      // Restrições por tipo de visto (conforme escopo do cliente)
      const restrictions = {
        golden: [
          'Manter investimento ativo',
          'Comprovante de renda anual',
          'Seguro saúde obrigatório',
          'Residência mínima de 6 meses/ano',
          'Renovação a cada 10 anos'
        ],
        retirement: [
          'Manter renda mínima de USD 4,000/mês',
          'Manter investimento ativo',
          'Seguro saúde obrigatório',
          'Residência mínima de 6 meses/ano',
          'Renovação a cada 5 anos'
        ],
        property: [
          'Manter propriedade ativa',
          'Comprovante de renda anual',
          'Seguro saúde obrigatório',
          'Residência mínima de 6 meses/ano',
          'Renovação a cada 2 anos'
        ],
        green: [
          'Manter qualificação profissional',
          'Comprovante de renda anual',
          'Seguro saúde obrigatório',
          'Residência mínima de 6 meses/ano',
          'Renovação a cada 5 anos'
        ],
        employment: [
          'Manter emprego ativo',
          'Não pode trabalhar para outras empresas',
          'Seguro saúde obrigatório',
          'Residência mínima de 6 meses/ano',
          'Renovação a cada 2 anos'
        ]
      }
      
      const calculationResult: VisaResult = {
        visaCost,
        medicalCost,
        emiratesIdCost,
        documentCost,
        totalCost,
        processingTime: visaTypeData.processingTime,
        validityPeriod: visaTypeData.validity,
        requirements: requirements[visaType as keyof typeof requirements],
        documents,
        visaType: visaTypeData.name,
        emirate: emirateData.name,
        familySize,
        includesFamily: includeFamily,
        benefits: benefits[visaType as keyof typeof benefits],
        restrictions: restrictions[visaType as keyof typeof restrictions]
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
    if (formData.visaType && formData.emirate && !configLoading && config) {
      const timeoutId = setTimeout(() => {
        calculateVisaCosts()
      }, 1000)
      
      return () => clearTimeout(timeoutId)
    }
  }, [formData, config, configLoading])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <Plane className="w-6 h-6 text-primary-600" />
          Processos de Visto e Residência
        </h3>
        <p className="text-gray-600">
          Custos e requisitos para obter residência nos UAE
        </p>
      </div>
      
      {/* Input Form */}
      <div className="space-y-8">
        {/* Seção 1: Tipo de Visto */}
        <div className="bg-blue-50 p-6 rounded-xl">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Tipo de Visto
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tipo de Visto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria de Visto
              </label>
              <select
                value={formData.visaType}
                onChange={(e) => handleInputChange('visaType', e.target.value)}
                className="input-field"
              >
                {visaTypes && typeof visaTypes === 'object'
                  ? Object.entries(visaTypes).map(([key, visa]: [string, any]) => (
                      <option key={key} value={key}>
                        {visa?.name || key}
                      </option>
                    ))
                  : null}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {visaTypes[formData.visaType as keyof typeof visaTypes]?.description}
              </p>
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
          </div>
        </div>

        {/* Seção 2: Perfil Familiar */}
        <div className="bg-green-50 p-6 rounded-xl">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            Perfil Familiar
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tamanho da Família */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamanho da Família
              </label>
              <input
                type="number"
                value={formData.familySize}
                onChange={(e) => handleInputChange('familySize', Number(e.target.value))}
                className="input-field"
                placeholder="Ex: 2"
                min="1"
                max="8"
              />
              <p className="text-xs text-gray-500 mt-1">
                Número de pessoas incluídas no visto
              </p>
            </div>

            {/* Incluir Família */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Incluir Família
              </label>
              <select
                value={formData.includeFamily.toString()}
                onChange={(e) => handleInputChange('includeFamily', e.target.value === 'true')}
                className="input-field"
              >
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Incluir cônjuge e filhos no visto
              </p>
            </div>
          </div>
        </div>

        {/* Seção 3: Investimentos (se aplicável) */}
        {(formData.visaType === 'golden' || formData.visaType === 'property' || formData.visaType === 'retirement') && (
          <div className="bg-purple-50 p-6 rounded-xl">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-purple-600" />
              Investimentos
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Valor da Propriedade */}
              {(formData.visaType === 'golden' || formData.visaType === 'property') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor da Propriedade (USD)
                  </label>
                  <input
                    type="number"
                    value={formData.propertyValue}
                    onChange={(e) => handleInputChange('propertyValue', Number(e.target.value))}
                    className="input-field"
                    placeholder={formData.visaType === 'golden' ? 'Ex: 544600' : 'Ex: 204225'}
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.visaType === 'golden' ? 'Mínimo: USD 544,600' : 'Mínimo: USD 204,225'}
                  </p>
                </div>
              )}

              {/* Investimento Retirement */}
              {formData.visaType === 'retirement' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor do Investimento (USD)
                  </label>
                  <input
                    type="number"
                    value={formData.propertyValue}
                    onChange={(e) => handleInputChange('propertyValue', Number(e.target.value))}
                    className="input-field"
                    placeholder="Ex: 272300"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Mínimo: USD 272,300
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Custo Total */}
            <div className="result-card result-neutral">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Custo Total
              </h4>
              <p className="text-3xl font-bold text-blue-600">
                AED {result.totalCost.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">para {result.familySize} pessoa(s)</p>
            </div>

            {/* Tempo de Processamento */}
            <div className="result-card result-neutral">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Tempo de Processamento
              </h4>
              <p className="text-3xl font-bold text-blue-600">
                {result.processingTime}
              </p>
              <p className="text-sm text-gray-500 mt-1">dias úteis</p>
            </div>

            {/* Validade */}
            <div className="result-card result-neutral">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Validade
              </h4>
              <p className="text-3xl font-bold text-blue-600">
                {result.validityPeriod}
              </p>
              <p className="text-sm text-gray-500 mt-1">anos</p>
            </div>

            {/* Emirado */}
            <div className="result-card result-neutral">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Emirado
              </h4>
              <p className="text-2xl font-bold text-blue-600">
                {result.emirate}
              </p>
              <p className="text-sm text-gray-500 mt-1">processamento</p>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Custos Detalhados */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gray-600" />
                Detalhamento de Custos
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-600">Taxa de Visto</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    AED {result.visaCost.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-600" />
                    <span className="text-gray-600">Exame Médico</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    AED {result.medicalCost.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">Emirates ID</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    AED {result.emiratesIdCost.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-600">Documentação</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    AED {result.documentCost.toLocaleString()}
                  </span>
                </div>
                
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">
                    AED {result.totalCost.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Requisitos e Documentos */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                Requisitos e Documentos
              </h4>
              
              <div className="space-y-6">
                {/* Requisitos */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-gray-700 mb-3">Requisitos</h5>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {result.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Documentos */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-gray-700 mb-3">Documentos Necessários</h5>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {result.documents.map((doc, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Benefícios e Restrições */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Benefícios */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Benefícios do Visto
              </h4>
              <ul className="space-y-3">
                {result.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Restrições */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                Restrições e Obrigações
              </h4>
              <ul className="space-y-3">
                {result.restrictions.map((restriction, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{restriction}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Timeline do Processo
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <h5 className="font-semibold text-gray-700 mb-2">1. Preparação</h5>
                <p className="text-sm text-gray-600">Coleta de documentos</p>
                <p className="text-lg font-bold text-blue-600 mt-2">1-2 semanas</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <h5 className="font-semibold text-gray-700 mb-2">2. Submissão</h5>
                <p className="text-sm text-gray-600">Entrega da aplicação</p>
                <p className="text-lg font-bold text-blue-600 mt-2">1 dia</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <h5 className="font-semibold text-gray-700 mb-2">3. Processamento</h5>
                <p className="text-sm text-gray-600">Análise e aprovação</p>
                <p className="text-lg font-bold text-blue-600 mt-2">{result.processingTime} dias</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <h5 className="font-semibold text-gray-700 mb-2">4. Emissão</h5>
                <p className="text-sm text-gray-600">Entrega do visto</p>
                <p className="text-lg font-bold text-blue-600 mt-2">3-5 dias</p>
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
            {configLoading ? 'Carregando configurações...' : 'Calculando custos de visto...'}
          </p>
        </div>
      )}
    </div>
  )
} 