'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Home, Car, Utensils, Heart, GraduationCap, Plane, DollarSign, TrendingUp } from 'lucide-react'
import { useCalculatorConfig } from '@/hooks/useCalculatorConfig'

type CountryKey = 'brasil' | 'portugal' | 'uae'
type LifestyleKey = 'budget' | 'standard' | 'premium' | 'luxury'

interface CostOfLivingCalculatorProps {
  onCalculationUpdate: (data: any) => void
}

interface CostOfLivingResult {
  // Custos por categoria
  housing: number
  transportation: number
  food: number
  healthcare: number
  education: number
  entertainment: number
  utilities: number
  other: number
  
  // Totais
  monthlyTotal: number
  annualTotal: number
  
  // Comparação
  country: string
  lifestyle: string
  familySize: number
  
  // Índices
  costIndex: number // Baseado em NYC = 100
  purchasingPower: number
}

export default function CostOfLivingCalculator({ onCalculationUpdate }: CostOfLivingCalculatorProps) {
  const { config, isLoading: configLoading } = useCalculatorConfig()
  
  const [formData, setFormData] = useState({
    country: 'brasil',
    lifestyle: 'standard',
    familySize: 2,
    city: 'sao_paulo'
  })
  
  const [result, setResult] = useState<CostOfLivingResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Usar dados do banco ou fallback para dados padrão
  const countries = config?.costOfLiving?.countries || {
    brasil: { 
      name: 'Brasil', 
      currency: 'BRL',
      baseCosts: {
        housing: 800,
        transportation: 300,
        food: 400,
        healthcare: 200,
        education: 500,
        lifestyle: 300
      }
    },
    portugal: { 
      name: 'Portugal', 
      currency: 'EUR',
      baseCosts: {
        housing: 1200,
        transportation: 400,
        food: 500,
        healthcare: 300,
        education: 600,
        lifestyle: 400
      }
    },
    uae: { 
      name: 'UAE', 
      currency: 'AED',
      baseCosts: {
        housing: 2000,
        transportation: 600,
        food: 800,
        healthcare: 500,
        education: 1000,
        lifestyle: 600
      }
    }
  }

  // Usar dados do banco ou fallback para dados padrão
  const lifestyles = config?.costOfLiving?.lifestyles || {
    budget: { 
      name: 'Econômico', 
      multiplier: 0.6,
      description: 'Moradia compartilhada, transporte público, refeições caseiras'
    },
    standard: { 
      name: 'Padrão', 
      multiplier: 1.0,
      description: 'Apartamento próprio, carro, restaurantes ocasionais'
    },
    premium: { 
      name: 'Premium', 
      multiplier: 1.5,
      description: 'Casa própria, carro novo, restaurantes frequentes'
    },
    luxury: { 
      name: 'Luxo', 
      multiplier: 2.0,
      description: 'Villa, carros de luxo, restaurantes finos'
    }
  }

  // Usar dados do banco para custos base
  const getBaseCosts = (country: string) => {
    const countryData = countries[country as keyof typeof countries]
    if (countryData && (countryData as any).baseCosts) {
      const baseCosts = (countryData as any).baseCosts
      return {
        housing: baseCosts.housing || 0,
        transportation: baseCosts.transportation || 0,
        food: baseCosts.food || 0,
        healthcare: baseCosts.healthcare || 0,
        education: baseCosts.education || 0,
        entertainment: baseCosts.lifestyle || 0,
        utilities: baseCosts.utilities || 0,
        other: baseCosts.other || 0
      }
    }
    
    // Fallback para dados padrão se não houver configuração
    const fallbackCosts = {
      brasil: { housing: 800, transportation: 300, food: 400, healthcare: 150, education: 200, entertainment: 250, utilities: 120, other: 180 },
      portugal: { housing: 1200, transportation: 400, food: 500, healthcare: 200, education: 300, entertainment: 300, utilities: 150, other: 200 },
      uae: { housing: 2000, transportation: 600, food: 800, healthcare: 300, education: 1000, entertainment: 500, utilities: 200, other: 400 }
    }
    return fallbackCosts[country as keyof typeof fallbackCosts] || fallbackCosts.brasil
  }

  const calculateCostOfLiving = () => {
    if (configLoading || !config) return
    
    setIsCalculating(true)
    
    setTimeout(() => {
      const { country, lifestyle, familySize, city } = formData
      
      const countryData = countries[country as CountryKey]
      const lifestyleData = lifestyles[lifestyle as LifestyleKey]
      
      // Aplicar multiplicadores
      const baseCost = getBaseCosts(country)
      const lifestyleMultiplier = (lifestyleData as any).multiplier || 1
      const familyMultiplier = Math.pow(familySize, 0.7) // Economia de escala
      
      const housing = baseCost.housing * lifestyleMultiplier * familyMultiplier
      const transportation = baseCost.transportation * lifestyleMultiplier * familyMultiplier
      const food = baseCost.food * lifestyleMultiplier * familyMultiplier
      const healthcare = baseCost.healthcare * lifestyleMultiplier * familyMultiplier
      const education = baseCost.education * lifestyleMultiplier * familyMultiplier
      const entertainment = baseCost.entertainment * lifestyleMultiplier * familyMultiplier
      const utilities = baseCost.utilities * lifestyleMultiplier * familyMultiplier
      const other = baseCost.other * lifestyleMultiplier * familyMultiplier
      
      const monthlyTotal = housing + transportation + food + healthcare + education + entertainment + utilities + other
      const annualTotal = monthlyTotal * 12
      
      // Índices comparativos
      const costIndex = country === 'brasil' ? 45 : country === 'portugal' ? 65 : 85
      const purchasingPower = country === 'brasil' ? 35 : country === 'portugal' ? 55 : 75
      
      const calculationResult: CostOfLivingResult = {
        housing,
        transportation,
        food,
        healthcare,
        education,
        entertainment,
        utilities,
        other,
        monthlyTotal,
        annualTotal,
        country: countryData.name,
        lifestyle: lifestyleData.name,
        familySize,
        costIndex,
        purchasingPower
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
    if (formData.country && formData.lifestyle && !configLoading && config) {
      const timeoutId = setTimeout(() => {
        calculateCostOfLiving()
      }, 1000)
      
      return () => clearTimeout(timeoutId)
    }
  }, [formData, config, configLoading])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <ShoppingCart className="w-6 h-6 text-primary-600" />
          Comparativo de Custo de Vida
        </h3>
        <p className="text-gray-600">
          Compare custos de vida entre Brasil, Portugal e UAE
        </p>
      </div>

      {/* Input Form */}
      <div className="space-y-8">
        {/* Seção 1: Localização */}
        <div className="bg-blue-50 p-6 rounded-xl">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Plane className="w-5 h-5 text-blue-600" />
            Localização
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* País */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                País
              </label>
              <select
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="input-field"
              >
                {countries ? Object.entries(countries).map(([key, country]) => (
                  <option key={key} value={key}>
                    {country.name}
                  </option>
                )) : null}
              </select>
            </div>

            {/* Cidade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cidade
              </label>
              <select
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="input-field"
              >
                {countries[formData.country as CountryKey]?.cities ? 
                  Object.entries(countries[formData.country as CountryKey].cities).map(([key, city]) => (
                    <option key={key} value={key}>
                      {city.name}
                    </option>
                  )) : null
                }
              </select>
            </div>
          </div>
        </div>

        {/* Seção 2: Perfil */}
        <div className="bg-green-50 p-6 rounded-xl">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Perfil de Gastos
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Estilo de Vida */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estilo de Vida
              </label>
              <select
                value={formData.lifestyle}
                onChange={(e) => handleInputChange('lifestyle', e.target.value)}
                className="input-field"
              >
                {lifestyles ? Object.entries(lifestyles).map(([key, lifestyle]) => (
                  <option key={key} value={key}>
                    {lifestyle.name}
                  </option>
                )) : null}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {lifestyles[formData.lifestyle as LifestyleKey]?.description}
        </p>
      </div>
      
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
                Número de pessoas na família
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
            {/* Custo Mensal */}
            <div className="result-card result-neutral">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Custo Mensal
              </h4>
              <p className="text-3xl font-bold text-blue-600">
                ${result.monthlyTotal.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">USD por mês</p>
            </div>

            {/* Custo Anual */}
            <div className="result-card result-neutral">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Custo Anual
              </h4>
              <p className="text-3xl font-bold text-blue-600">
                ${result.annualTotal.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">USD por ano</p>
            </div>

            {/* Índice de Custo */}
            <div className="result-card result-neutral">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Índice de Custo
              </h4>
              <p className="text-3xl font-bold text-blue-600">
                {result.costIndex}
              </p>
              <p className="text-sm text-gray-500 mt-1">NYC = 100</p>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Categorias de Gastos */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gray-600" />
                Detalhamento de Gastos Mensais
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-600">Moradia</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    ${result.housing.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">Transporte</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    ${result.transportation.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-orange-600" />
                    <span className="text-gray-600">Alimentação</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    ${result.food.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-600" />
                    <span className="text-gray-600">Saúde</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    ${result.healthcare.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-600">Educação</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    ${result.education.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-pink-600" />
                    <span className="text-gray-600">Entretenimento</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    ${result.entertainment.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-yellow-600" />
                    <span className="text-gray-600">Utilidades</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    ${result.utilities.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-600">Outros</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    ${result.other.toLocaleString()}
                  </span>
                </div>
                
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Mensal</span>
                  <span className="text-blue-600">
                    ${result.monthlyTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Comparativo e Insights */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Análise Comparativa
              </h4>
              
              <div className="space-y-6">
                {/* Índices */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-gray-700 mb-3">Índices de Custo</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Índice de Custo de Vida:</span>
                      <span className="font-semibold text-blue-600">
                        {result.costIndex}/100
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Poder de Compra:</span>
                      <span className="font-semibold text-green-600">
                        {result.purchasingPower}/100
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comparação com outros países */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-gray-700 mb-3">Comparação Regional</h5>
                  <div className="space-y-2 text-sm">
                    {result.country === 'Brasil' && (
                      <>
                        <div className="flex justify-between">
                          <span>vs. Portugal:</span>
                          <span className="text-green-600">-35% mais barato</span>
                        </div>
                        <div className="flex justify-between">
                          <span>vs. UAE:</span>
                          <span className="text-green-600">-60% mais barato</span>
                        </div>
                      </>
                    )}
                    {result.country === 'Portugal' && (
                      <>
                        <div className="flex justify-between">
                          <span>vs. Brasil:</span>
                          <span className="text-red-600">+35% mais caro</span>
                        </div>
                        <div className="flex justify-between">
                          <span>vs. UAE:</span>
                          <span className="text-green-600">-40% mais barato</span>
                        </div>
                      </>
                    )}
                    {result.country === 'UAE' && (
                      <>
                        <div className="flex justify-between">
                          <span>vs. Brasil:</span>
                          <span className="text-red-600">+60% mais caro</span>
                        </div>
                        <div className="flex justify-between">
                          <span>vs. Portugal:</span>
                          <span className="text-red-600">+40% mais caro</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Insights */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-gray-700 mb-3">Insights</h5>
                  <div className="text-sm text-gray-600 space-y-2">
                    {result.country === 'Brasil' && (
                      <p>✅ Custo de vida mais baixo da região<br/>
                      ✅ Boa qualidade de vida<br/>
                      ⚠️ Instabilidade econômica</p>
                    )}
                    {result.country === 'Portugal' && (
                      <p>✅ Estabilidade econômica<br/>
                      ✅ Qualidade de vida europeia<br/>
                      ⚠️ Custo intermediário</p>
                    )}
                    {result.country === 'UAE' && (
                      <p>✅ Zero impostos pessoais<br/>
                      ✅ Infraestrutura de primeira<br/>
                      ⚠️ Custo de vida alto</p>
                    )}
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
            {configLoading ? 'Carregando configurações...' : 'Calculando custo de vida...'}
          </p>
        </div>
      )}
    </div>
  )
} 