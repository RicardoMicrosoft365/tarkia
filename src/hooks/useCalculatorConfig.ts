import { useState, useEffect } from 'react'

interface CalculatorConfig {
  business: {
    taxRegimes: {
      [key: string]: { rate: number, description: string }
    }
    companyTypes: {
      [key: string]: { setupCost: number, accountingCost: number, description: string }
    }
    freeZones: {
      [key: string]: { name: string, annualCost: number, setupCost: number, visaCost: number, description: string }
    }
    uaeTax: {
      threshold: number
      rate: number
    }
  }
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
  costOfLiving: {
    countries: {
      [key: string]: { name: string, currency: string, baseCosts: any }
    }
    lifestyles: {
      [key: string]: { name: string, multiplier: number, description: string }
    }
  }
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

export function useCalculatorConfig() {
  const [config, setConfig] = useState<CalculatorConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar configurações
  const loadConfig = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/admin/config')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar configurações')
      }

      setConfig(data.config)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao carregar configurações:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Salvar configurações
  const saveConfig = async (newConfig: CalculatorConfig) => {
    try {
      setError(null)

      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ config: newConfig }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar configurações')
      }

      setConfig(newConfig)
      return { success: true, message: data.message }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      console.error('Erro ao salvar configurações:', err)
      return { success: false, error: errorMessage }
    }
  }

  // Carregar configurações na inicialização
  useEffect(() => {
    loadConfig()
  }, [])

  return {
    config,
    isLoading,
    error,
    loadConfig,
    saveConfig,
    setConfig
  }
}
