'use client'

interface CostOfLivingCalculatorProps {
  onCalculationUpdate: (data: any) => void
}

export default function CostOfLivingCalculator({ onCalculationUpdate }: CostOfLivingCalculatorProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Comparativo de Custo de Vida
        </h3>
        <p className="text-gray-600">
          Compare custos de vida entre Brasil/Portugal e UAE
        </p>
      </div>
      
      <div className="bg-gray-50 p-8 rounded-xl text-center">
        <p className="text-gray-500">🛒 Calculadora de custo de vida em desenvolvimento</p>
      </div>
    </div>
  )
} 