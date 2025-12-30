'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Calculator, 
  Plane, 
  Download,
  TrendingUp,
  DollarSign,
  FileText
} from 'lucide-react'
import jsPDF from 'jspdf'
import BusinessCalculator from './calculators/BusinessCalculator'
import VisaCalculator from './calculators/VisaCalculator'

type Tab = 'business' | 'visa'

type CalculationsData = {
  [key in Tab]?: any
}

export default function TarkiaCalculator() {
  const [activeTab, setActiveTab] = useState<Tab>('business')
  const [calculations, setCalculations] = useState<CalculationsData>({})
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const calculatorRef = useRef<HTMLDivElement>(null)

  const tabs = [
    {
      id: 'business' as Tab,
      label: 'Empresarial',
      icon: Calculator,
      description: 'Análise fiscal e otimização tributária'
    },
    {
      id: 'visa' as Tab,
      label: 'Vistos',
      icon: Plane,
      description: 'Custos e processos de residência'
    },
  ]

  const handleCalculationUpdate = (tabId: Tab, data: any) => {
    setCalculations((prev: CalculationsData) => ({
      ...prev,
      [tabId]: data
    }))
  }

  const generatePDFReport = async () => {
    if (isGeneratingPDF) return
    
    try {
      setIsGeneratingPDF(true)
      
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 15
      const headerHeight = 40
      const footerHeight = 20
      const contentStartY = headerHeight + 10
      const contentEndY = pageHeight - footerHeight
      
      // Função para adicionar cabeçalho em todas as páginas
      const addHeader = (pageNum: number, totalPages?: number) => {
        // Fundo do cabeçalho
        pdf.setFillColor(30, 41, 59) // Cor primária
        pdf.rect(0, 0, pageWidth, headerHeight, 'F')
        
        // Logo/Título
        pdf.setTextColor(255, 255, 255)
        pdf.setFontSize(24)
        pdf.setFont('helvetica', 'bold')
        pdf.text('TARKIA', margin, 20)
        
        // Subtítulo
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'normal')
        pdf.text('Relatório de Otimização Fiscal', margin, 30)
        
        // Data no canto direito
        const today = new Date().toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
        pdf.setFontSize(10)
        pdf.text(`Gerado em: ${today}`, pageWidth - margin, 20, { align: 'right' })
        
        // Número da página
        if (totalPages) {
          pdf.text(`Página ${pageNum} de ${totalPages}`, pageWidth - margin, 30, { align: 'right' })
        } else {
          pdf.text(`Página ${pageNum}`, pageWidth - margin, 30, { align: 'right' })
        }
        
        pdf.setTextColor(0, 0, 0)
      }
      
      // Função para adicionar rodapé em todas as páginas
      const addFooter = () => {
        const footerY = pageHeight - footerHeight + 5
        
        // Linha separadora
        pdf.setDrawColor(200, 200, 200)
        pdf.line(margin, pageHeight - footerHeight, pageWidth - margin, pageHeight - footerHeight)
        
        // Texto do rodapé
        pdf.setFontSize(8)
        pdf.setTextColor(100, 100, 100)
        pdf.text('Este relatório foi gerado automaticamente pela Calculadora Tarkia.', margin, footerY)
        pdf.text('Para mais informações, visite: www.tarkia.ae', margin, footerY + 5)
        pdf.text('© Tarkia Consultoria - Todos os direitos reservados', pageWidth - margin, footerY + 5, { align: 'right' })
      }
      
      // Contador de páginas
      let currentPage = 1
      let yPosition = contentStartY
      
      // Adicionar cabeçalho na primeira página
      addHeader(currentPage)
      
      pdf.setTextColor(0, 0, 0)
      
      // Seção: Análise Empresarial
      if (calculations.business) {
        const biz = calculations.business
        
        // Título da seção
        pdf.setFillColor(200, 164, 110) // Cor dourada
        pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, 'F')
        pdf.setTextColor(255, 255, 255)
        pdf.setFontSize(16)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Análise de Otimização Fiscal Empresarial', margin + 2, yPosition + 2)
        
        yPosition += 15
        pdf.setTextColor(0, 0, 0)
        pdf.setFontSize(11)
        pdf.setFont('helvetica', 'normal')
        
        // Informações básicas
        pdf.setFont('helvetica', 'bold')
        pdf.text('Informações do Cálculo:', margin, yPosition)
        yPosition += 7
        
        pdf.setFont('helvetica', 'normal')
        pdf.text(`Faturamento Anual: $${(biz.annualRevenue || 0).toLocaleString('pt-BR')}`, margin + 5, yPosition)
        yPosition += 6
        
        pdf.text(`Funcionários: ${biz.employees || 0}`, margin + 5, yPosition)
        yPosition += 6
        
        if (biz.freeZone) {
          pdf.text(`Free Zone Selecionada: ${biz.freeZone}`, margin + 5, yPosition)
          yPosition += 6
        }
        
        if (biz.originalCountry) {
          pdf.text(`País de Comparação: ${biz.originalCountry}`, margin + 5, yPosition)
          yPosition += 6
        }
        
        yPosition += 5
        
        // Comparativo de Custos
        pdf.setFont('helvetica', 'bold')
        pdf.text('Comparativo de Custos Anuais:', margin, yPosition)
        yPosition += 7
        
        pdf.setFont('helvetica', 'normal')
        
        // Brasil - Detalhamento Completo
        pdf.setTextColor(220, 38, 38) // Vermelho
        pdf.setFont('helvetica', 'bold')
        pdf.text(`Brasil (${biz.taxRegime || 'Lucro Presumido'}):`, margin + 5, yPosition)
        pdf.setFont('helvetica', 'normal')
        pdf.text(`$${(biz.brazilTotalCost || 0).toLocaleString('pt-BR')}`, pageWidth - margin, yPosition, { align: 'right' })
        yPosition += 6
        
        // Alíquotas aplicadas
        if (biz.taxRates && Object.keys(biz.taxRates).length > 0) {
          pdf.setFont('helvetica', 'bold')
          pdf.setFontSize(9)
          pdf.setTextColor(100, 100, 100)
          pdf.text('Alíquotas Aplicadas:', margin + 10, yPosition)
          yPosition += 5
          pdf.setFont('helvetica', 'normal')
          pdf.setFontSize(8)
          
          if (biz.taxRates.pis !== undefined) {
            pdf.text(`  PIS: ${(biz.taxRates.pis * 100).toFixed(2)}%`, margin + 10, yPosition)
            yPosition += 4
          }
          if (biz.taxRates.cofins !== undefined) {
            pdf.text(`  COFINS: ${(biz.taxRates.cofins * 100).toFixed(2)}%`, margin + 10, yPosition)
            yPosition += 4
          }
          if (biz.taxRates.irpj !== undefined) {
            pdf.text(`  IRPJ: ${(biz.taxRates.irpj * 100).toFixed(2)}%`, margin + 10, yPosition)
            yPosition += 4
          }
          if (biz.taxRates.csll !== undefined) {
            pdf.text(`  CSLL: ${(biz.taxRates.csll * 100).toFixed(2)}%`, margin + 10, yPosition)
            yPosition += 4
          }
          if (biz.taxRates.federal !== undefined) {
            pdf.text(`  Federal: ${(biz.taxRates.federal * 100).toFixed(2)}%`, margin + 10, yPosition)
            yPosition += 4
          }
          if (biz.taxRates.icms !== undefined) {
            pdf.text(`  ICMS: ${(biz.taxRates.icms * 100).toFixed(2)}%`, margin + 10, yPosition)
            yPosition += 4
          }
          if (biz.taxRates.iss !== undefined) {
            pdf.text(`  ISS: ${(biz.taxRates.iss * 100).toFixed(2)}%`, margin + 10, yPosition)
            yPosition += 4
          }
          if (biz.taxRates.total !== undefined) {
            pdf.setFont('helvetica', 'bold')
            pdf.text(`  Total: ${(biz.taxRates.total * 100).toFixed(2)}%`, margin + 10, yPosition)
            yPosition += 4
          }
          
          yPosition += 2
          pdf.setFontSize(10)
          pdf.setTextColor(0, 0, 0)
        }
        
        // Breakdown detalhado de impostos
        if (biz.taxBreakdown) {
          pdf.setFont('helvetica', 'bold')
          pdf.setFontSize(10)
          pdf.setTextColor(0, 0, 0)
          pdf.text('Detalhamento de Impostos:', margin + 10, yPosition)
          yPosition += 5
          pdf.setFont('helvetica', 'normal')
          
          if (biz.taxBreakdown.pis !== undefined) {
            pdf.text(`  PIS: $${biz.taxBreakdown.pis.toLocaleString('pt-BR')}`, margin + 10, yPosition)
            yPosition += 5
          }
          if (biz.taxBreakdown.cofins !== undefined) {
            pdf.text(`  COFINS: $${biz.taxBreakdown.cofins.toLocaleString('pt-BR')}`, margin + 10, yPosition)
            yPosition += 5
          }
          if (biz.taxBreakdown.irpj !== undefined) {
            pdf.text(`  IRPJ: $${biz.taxBreakdown.irpj.toLocaleString('pt-BR')}`, margin + 10, yPosition)
            yPosition += 5
          }
          if (biz.taxBreakdown.csll !== undefined) {
            pdf.text(`  CSLL: $${biz.taxBreakdown.csll.toLocaleString('pt-BR')}`, margin + 10, yPosition)
            yPosition += 5
          }
          if (biz.taxBreakdown.federal !== undefined) {
            pdf.text(`  Federal (PIS/COFINS/IRPJ/CSLL): $${biz.taxBreakdown.federal.toLocaleString('pt-BR')}`, margin + 10, yPosition)
            yPosition += 5
          }
          if (biz.taxBreakdown.icms !== undefined) {
            pdf.text(`  ICMS: $${biz.taxBreakdown.icms.toLocaleString('pt-BR')}`, margin + 10, yPosition)
            yPosition += 5
          }
          if (biz.taxBreakdown.iss !== undefined) {
            pdf.text(`  ISS: $${biz.taxBreakdown.iss.toLocaleString('pt-BR')}`, margin + 10, yPosition)
            yPosition += 5
          }
        } else if (biz.brazilTax) {
          pdf.text(`  - Impostos: $${biz.brazilTax.toLocaleString('pt-BR')}`, margin + 10, yPosition)
          yPosition += 5
        }
        
        if (biz.brazilPayroll) {
          pdf.text(`  - Folha de Pagamento: $${biz.brazilPayroll.toLocaleString('pt-BR')}`, margin + 10, yPosition)
          yPosition += 5
        }
        if (biz.brazilOperational) {
          pdf.text(`  - Custos Operacionais: $${biz.brazilOperational.toLocaleString('pt-BR')}`, margin + 10, yPosition)
          yPosition += 5
        }
        
        yPosition += 3
        
        // Dubai
        pdf.setTextColor(37, 99, 235) // Azul
        pdf.setFont('helvetica', 'bold')
        pdf.text('Dubai/UAE:', margin + 5, yPosition)
        pdf.setFont('helvetica', 'normal')
        pdf.text(`$${(biz.dubaiTotalCost || 0).toLocaleString('pt-BR')}`, pageWidth - margin, yPosition, { align: 'right' })
        yPosition += 6
        
        if (biz.dubaiLicense) {
          pdf.text(`  - Licença Free Zone: $${biz.dubaiLicense.toLocaleString('pt-BR')}`, margin + 10, yPosition)
          yPosition += 5
        }
        if (biz.dubaiSetup) {
          pdf.text(`  - Custo de Setup: $${biz.dubaiSetup.toLocaleString('pt-BR')}`, margin + 10, yPosition)
          yPosition += 5
        }
        if (biz.dubaiVisas) {
          pdf.text(`  - Vistos: $${biz.dubaiVisas.toLocaleString('pt-BR')}`, margin + 10, yPosition)
          yPosition += 5
        }
        if (biz.dubaiOffice) {
          pdf.text(`  - Escritório: $${biz.dubaiOffice.toLocaleString('pt-BR')}`, margin + 10, yPosition)
          yPosition += 5
        }
        if (biz.dubaiServices) {
          pdf.text(`  - Serviços: $${biz.dubaiServices.toLocaleString('pt-BR')}`, margin + 10, yPosition)
          yPosition += 5
        }
        if (biz.dubaiTax) {
          pdf.text(`  - Corporate Tax: $${biz.dubaiTax.toLocaleString('pt-BR')}`, margin + 10, yPosition)
          yPosition += 5
        }
        
        yPosition += 5
        
        // Economia
        pdf.setTextColor(34, 197, 94) // Verde
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(12)
        pdf.text('ECONOMIA ANUAL:', margin, yPosition)
        pdf.setFontSize(14)
        pdf.text(`$${(biz.savings || 0).toLocaleString('pt-BR')}`, pageWidth - margin, yPosition, { align: 'right' })
        yPosition += 7
        
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(0, 0, 0)
        if (biz.savingsPercentage) {
          pdf.text(`Percentual de economia: ${biz.savingsPercentage.toFixed(1)}%`, margin, yPosition)
          yPosition += 6
        }
        
        // Projeção 5 anos e Análise
        if (biz.savings && biz.savings > 0) {
          // Verificar se precisa de nova página antes de adicionar esta seção
          if (yPosition > contentEndY - 40) {
            addFooter()
            pdf.addPage()
            currentPage++
            addHeader(currentPage)
            yPosition = contentStartY
          }
          
          const savings5Years = biz.savings * 5
          pdf.setFont('helvetica', 'bold')
          pdf.setFontSize(11)
          pdf.text('Projeção e Análise:', margin, yPosition)
          yPosition += 6
          pdf.setFont('helvetica', 'normal')
          pdf.setFontSize(10)
          
          pdf.text(`Projeção 5 Anos:`, margin + 5, yPosition)
          yPosition += 5
          pdf.text(`  - Economia total em 5 anos: $${savings5Years.toLocaleString('pt-BR')}`, margin + 10, yPosition)
          yPosition += 5
          
          if (biz.dubaiSetup) {
            const roi = ((savings5Years / biz.dubaiSetup) * 100).toFixed(0)
            pdf.text(`  - ROI do investimento inicial: ${roi}%`, margin + 10, yPosition)
            yPosition += 5
            
            const paybackMonths = (biz.dubaiSetup / biz.savings * 12).toFixed(1)
            const paybackYears = Math.ceil(biz.dubaiSetup / biz.savings)
            pdf.text(`  - Tempo de retorno: ${paybackMonths} meses (${paybackYears} anos)`, margin + 10, yPosition)
            yPosition += 5
          }
          
          yPosition += 3
        }
        
        // Comparativo de Free Zones (se disponível)
        if (biz.freeZoneComparisons && biz.freeZoneComparisons.length > 0) {
          // Verificar se precisa de nova página
          if (yPosition > contentEndY - 30) {
            addFooter()
            pdf.addPage()
            currentPage++
            addHeader(currentPage)
            yPosition = contentStartY
          }
          
          pdf.setFont('helvetica', 'bold')
          pdf.setFontSize(11)
          pdf.setTextColor(0, 0, 0)
          pdf.text('Comparativo de Free Zones:', margin, yPosition)
          yPosition += 7
          
          pdf.setFont('helvetica', 'normal')
          pdf.setFontSize(8)
          
          // Cabeçalho da tabela
          const colWidths = [45, 25, 25, 25, 25, 25, 25, 30]
          const startX = margin
          let xPos = startX
          
          pdf.setFont('helvetica', 'bold')
          pdf.setFontSize(7)
          pdf.text('Free Zone', xPos, yPosition)
          xPos += colWidths[0]
          pdf.text('Licença', xPos, yPosition)
          xPos += colWidths[1]
          pdf.text('Setup', xPos, yPosition)
          xPos += colWidths[2]
          pdf.text('Vistos', xPos, yPosition)
          xPos += colWidths[3]
          pdf.text('Escrit.', xPos, yPosition)
          xPos += colWidths[4]
          pdf.text('Serv.', xPos, yPosition)
          xPos += colWidths[5]
          pdf.text('Impostos', xPos, yPosition)
          xPos += colWidths[6]
          pdf.text('Total', xPos, yPosition)
          
          yPosition += 5
          pdf.setFont('helvetica', 'normal')
          
          // Linhas da tabela
          biz.freeZoneComparisons.forEach((zone: any, index: number) => {
            if (yPosition > contentEndY - 10) {
              addFooter()
              pdf.addPage()
              currentPage++
              addHeader(currentPage)
              yPosition = contentStartY
            }
            
            xPos = startX
            pdf.setFontSize(7)
            pdf.text(zone.name.substring(0, 15), xPos, yPosition)
            xPos += colWidths[0]
            pdf.text(`$${(zone.license / 1000).toFixed(0)}k`, xPos, yPosition)
            xPos += colWidths[1]
            pdf.text(`$${(zone.setup / 1000).toFixed(0)}k`, xPos, yPosition)
            xPos += colWidths[2]
            pdf.text(`$${(zone.visas / 1000).toFixed(1)}k`, xPos, yPosition)
            xPos += colWidths[3]
            pdf.text(`$${(zone.office / 1000).toFixed(0)}k`, xPos, yPosition)
            xPos += colWidths[4]
            pdf.text(`$${(zone.services / 1000).toFixed(0)}k`, xPos, yPosition)
            xPos += colWidths[5]
            pdf.text(`$${(zone.tax / 1000).toFixed(1)}k`, xPos, yPosition)
            xPos += colWidths[6]
            pdf.setFont('helvetica', 'bold')
            pdf.text(`$${(zone.total / 1000).toFixed(0)}k`, xPos, yPosition)
            pdf.setFont('helvetica', 'normal')
            
            yPosition += 5
          })
          
          yPosition += 5
        }
        
        yPosition += 10
      }
      
      // Seção: Vistos (se houver)
      if (calculations.visa && yPosition < contentEndY - 40) {
        // Verificar se precisa de nova página
        if (yPosition > contentEndY - 50) {
          addFooter()
          pdf.addPage()
          currentPage++
          addHeader(currentPage)
          yPosition = contentStartY
        }
        const visa = calculations.visa
        
        pdf.setFillColor(200, 164, 110)
        pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, 'F')
        pdf.setTextColor(255, 255, 255)
        pdf.setFontSize(16)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Análise de Vistos', margin + 2, yPosition + 2)
        
        yPosition += 15
        pdf.setTextColor(0, 0, 0)
        pdf.setFontSize(11)
        pdf.setFont('helvetica', 'normal')
        
        if (visa.visaType) {
          pdf.text(`Tipo de Visto: ${visa.visaType}`, margin, yPosition)
          yPosition += 6
        }
        if (visa.totalCost) {
          pdf.text(`Custo Total: $${visa.totalCost.toLocaleString('pt-BR')}`, margin, yPosition)
          yPosition += 6
        }
        if (visa.validityPeriod) {
          pdf.text(`Validade: ${visa.validityPeriod} anos`, margin, yPosition)
          yPosition += 6
        }
        if (visa.processingTime) {
          pdf.text(`Tempo de Processamento: ${visa.processingTime} dias`, margin, yPosition)
          yPosition += 6
        }
        
        yPosition += 10
      }
      
      // Adicionar rodapé na última página
      addFooter()
      
      // Salvar PDF
      const fileName = `Relatorio_Tarkia_${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)
      
      setIsGeneratingPDF(false)
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      setIsGeneratingPDF(false)
      alert('❌ Erro ao gerar relatório. Tente novamente.')
    }
  }

  return (
    <div className="p-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex flex-wrap -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button mr-2 mb-2 flex items-center gap-2 ${
                  activeTab === tab.id ? 'tab-active' : 'tab-inactive'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            )
          })}
        </nav>
        
        {/* Tab Description */}
        <div className="mt-4 mb-6">
          <p className="text-gray-600">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Tab Content */}
      <div ref={calculatorRef} className="min-h-[600px]">
        {activeTab === 'business' && (
          <BusinessCalculator 
            onCalculationUpdate={(data) => handleCalculationUpdate('business', data)}
          />
        )}
        
        {activeTab === 'visa' && (
          <VisaCalculator 
            onCalculationUpdate={(data) => handleCalculationUpdate('visa', data)}
          />
        )}
      </div>

      {/* Results Summary */}
      {Object.keys(calculations).length > 0 && (
        <div className="mt-12 p-6 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border border-primary-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            Resumo dos Resultados
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {calculations.business && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-2">Economia Fiscal</h4>
                <p className="text-2xl font-bold text-green-600">
                  ${calculations.business.savings?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-gray-500">por ano</p>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={generatePDFReport}
              disabled={isGeneratingPDF}
              className="btn-primary flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingPDF ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Gerando PDF...
                </>
              ) : (
                <>
              <Download className="w-4 h-4" />
              Baixar Relatório Completo
                </>
              )}
            </button>
            
            <button className="btn-secondary flex items-center gap-2 justify-center">
              <FileText className="w-4 h-4" />
              Agendar Consultoria
            </button>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          💡 <strong>Dica:</strong> Use as abas acima para explorar diferentes aspectos do seu planejamento.
          Todos os cálculos são baseados em dados oficiais atualizados.
        </p>
      </div>
    </div>
  )
} 