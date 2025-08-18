'use client'

interface RealEstateCalculatorProps {
  onCalculationUpdate: (data: any) => void
}

export default function RealEstateCalculator({ onCalculationUpdate }: RealEstateCalculatorProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Análise de Investimento Imobiliário
        </h3>
        <p className="text-gray-600">
          Calcule o ROI de investimentos imobiliários nos UAE
        </p>
      </div>
      
      <div className="bg-gray-50 p-8 rounded-xl text-center">
        <p className="text-gray-500">🏠 Calculadora imobiliária em desenvolvimento</p>
      </div>
    </div>
  )
} 