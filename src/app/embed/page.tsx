'use client'

import { useState } from 'react'
import { Unlock } from 'lucide-react'
import LeadCaptureForm from '@/components/LeadCaptureForm'
import TarkiaCalculator from '@/components/TarkiaCalculator'

export default function EmbedPage() {
  const [isUnlocked, setIsUnlocked] = useState(false)

  const handleLeadCapture = (leadData: any) => {
    console.log('Lead capturado:', leadData)
    setIsUnlocked(true)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto max-w-6xl px-4 py-4">
        {!isUnlocked ? (
          <div className="calculator-card p-6 md:p-8 text-center">
            <div className="mb-6">
              <Unlock className="w-12 h-12 text-tarkia-gold mx-auto mb-3" />
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-gray-800 mb-3">
                Calculadora Tarkia
              </h2>
              <p className="text-base text-gray-600 max-w-xl mx-auto">
                Insira seus dados para acessar a calculadora completa de otimização fiscal e investimentos UAE.
              </p>
            </div>
            
            <LeadCaptureForm onSuccess={handleLeadCapture} />
            
            <div className="mt-6 text-xs text-gray-500">
              <p>✅ Análise fiscal completa  ✅ Relatório em PDF  ✅ Consultoria gratuita</p>
            </div>
          </div>
        ) : (
          <div className="calculator-card">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-center gap-2">
                <Unlock className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl md:text-2xl font-bold font-heading text-gray-800">
                  Calculadora Desbloqueada
                </h2>
              </div>
              <p className="text-center text-gray-600 mt-1 text-sm">
                Acesso completo liberado!
              </p>
            </div>
            
            <TarkiaCalculator />
          </div>
        )}
      </div>
    </div>
  )
}

