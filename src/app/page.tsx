'use client'

import { useState } from 'react'
import { Lock, Unlock } from 'lucide-react'
import LeadCaptureForm from '@/components/LeadCaptureForm'
import TarkiaCalculator from '@/components/TarkiaCalculator'

export default function HomePage() {
  const [isUnlocked, setIsUnlocked] = useState(false)

  const handleLeadCapture = (leadData: any) => {
    console.log('Lead capturado:', leadData)
    setIsUnlocked(true)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto max-w-6xl px-4 py-8">
          {!isUnlocked ? (
            <div className="calculator-card p-8 md:p-12 text-center">
              <div className="mb-8">
                <Lock className="w-16 h-16 text-tarkia-gold mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-800 mb-4">
                  Acesse a Calculadora Profissional
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Insira seus dados para desbloquear acesso completo à nossa calculadora 
                  e receber análises personalizadas por email.
                </p>
              </div>
              
              <LeadCaptureForm onSuccess={handleLeadCapture} />
              
              <div className="mt-8 text-sm text-gray-500">
                <p>✅ Análise fiscal completa  ✅ Relatório em PDF  ✅ Consultoria gratuita</p>
              </div>
            </div>
          ) : (
            <div className="calculator-card">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-center gap-3">
                  <Unlock className="w-8 h-8 text-primary-600" />
                  <h2 className="text-2xl md:text-3xl font-bold font-heading text-gray-800">
                    Calculadora Desbloqueada
                  </h2>
                </div>
                <p className="text-center text-gray-600 mt-2">
                  Agora você tem acesso completo a todas as funcionalidades!
                </p>
              </div>
              
              <TarkiaCalculator />
            </div>
          )}
        </div>
    </div>
  )
} 