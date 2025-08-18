'use client'

interface VisaCalculatorProps {
  onCalculationUpdate: (data: any) => void
}

export default function VisaCalculator({ onCalculationUpdate }: VisaCalculatorProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Processos de Visto e Residência
        </h3>
        <p className="text-gray-600">
          Custos e requisitos para obter residência nos UAE
        </p>
      </div>
      
      <div className="bg-gray-50 p-8 rounded-xl text-center">
        <p className="text-gray-500">✈️ Calculadora de vistos em desenvolvimento</p>
      </div>
    </div>
  )
} 