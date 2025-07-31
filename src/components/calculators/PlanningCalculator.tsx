'use client'

interface PlanningCalculatorProps {
  calculations: any
  onCalculationUpdate: (data: any) => void
}

export default function PlanningCalculator({ calculations, onCalculationUpdate }: PlanningCalculatorProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Planejamento 360° - Visão Integrada
        </h3>
        <p className="text-gray-600">
          Análise completa combinando todos os aspectos do seu planejamento
        </p>
      </div>
      
      <div className="bg-gray-50 p-8 rounded-xl text-center">
        <p className="text-gray-500">🧭 Planejamento integrado em desenvolvimento</p>
      </div>
    </div>
  )
} 