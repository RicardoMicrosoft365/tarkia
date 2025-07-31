'use client'

import { useState } from 'react'
import { Calculator, TrendingUp, Building, Plane, Users, ArrowRight, Lock, Unlock } from 'lucide-react'
import LeadCaptureForm from '@/components/LeadCaptureForm'
import TarkiaCalculator from '@/components/TarkiaCalculator'

export default function HomePage() {
  const [isUnlocked, setIsUnlocked] = useState(false)

  const handleLeadCapture = (leadData: any) => {
    console.log('Lead capturado:', leadData)
    setIsUnlocked(true)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section text-white py-20 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 text-shadow">
              Calculadora
              <span className="block text-tarkia-gold">Tarkia</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Descubra quanto você pode <strong>economizar em impostos</strong> e 
              <strong> ganhar com investimentos</strong> nos Emirados Árabes Unidos
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="glass-effect px-6 py-3 rounded-full">
                <span className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Análise Fiscal Completa
                </span>
              </div>
              <div className="glass-effect px-6 py-3 rounded-full">
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  ROI Imobiliário
                </span>
              </div>
              <div className="glass-effect px-6 py-3 rounded-full">
                <span className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  51 Free Zones
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-16 h-16 bg-tarkia-gold bg-opacity-20 rounded-full blur-xl"></div>
        </div>
        <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: '1s' }}>
          <div className="w-20 h-20 bg-white bg-opacity-10 rounded-full blur-xl"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="animate-slide-up">
              <div className="text-4xl font-bold text-primary-600 mb-2">149</div>
              <div className="text-gray-600">Dias trabalhando para impostos no Brasil</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl font-bold text-primary-600 mb-2">15</div>
              <div className="text-gray-600">Dias trabalhando para impostos nos UAE</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold text-green-600 mb-2">7%</div>
              <div className="text-gray-600">Yield médio imobiliário em Dubai</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl font-bold text-tarkia-gold mb-2">0%</div>
              <div className="text-gray-600">Imposto de renda pessoal nos UAE</div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto max-w-6xl">
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
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-tarkia-light">
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
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-gray-800 mb-6">
              Por que escolher os UAE?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Os Emirados Árabes Unidos oferecem uma das legislações fiscais mais atrativas do mundo
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 text-center hover:scale-105">
              <TrendingUp className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Economia Fiscal</h3>
              <p className="text-gray-600">
                Reduza sua carga tributária de 35% para apenas 9% (ou 0% em Free Zones)
              </p>
            </div>
            
            <div className="card p-8 text-center hover:scale-105">
              <Building className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Investimento Imobiliário</h3>
              <p className="text-gray-600">
                Yields de 6-9% ao ano com potencial de valorização de 8% em Dubai
              </p>
            </div>
            
            <div className="card p-8 text-center hover:scale-105">
              <Plane className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Residência por Investimento</h3>
              <p className="text-gray-600">
                Visto de residência de longo prazo através de investimento imobiliário
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 via-tarkia-blue to-primary-700 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            Pronto para dar o próximo passo?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Nossos especialistas estão prontos para ajudar você a realizar sua mudança para os UAE
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-tarkia-gold hover:bg-tarkia-gold/90 text-tarkia-dark font-bold py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              Consulta Gratuita
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 font-semibold py-4 px-8 rounded-lg transition-all duration-300">
              Download do Guia Completo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-tarkia-dark text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold font-heading text-tarkia-gold mb-2">Tarkia</h3>
            <p className="text-gray-400">Consultoria especializada em planejamento tributário internacional</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div>
              <h4 className="font-semibold mb-3">Serviços</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Planejamento Fiscal</li>
                <li>Abertura de Empresas</li>
                <li>Consultoria Imobiliária</li>
                <li>Processo de Visto</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Free Zones</h4>
              <ul className="space-y-2 text-gray-400">
                <li>DIFC - Dubai</li>
                <li>DMCC - Dubai</li>
                <li>ADGM - Abu Dhabi</li>
                <li>RAK ICC - Ras Al Khaimah</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contato</h4>
              <ul className="space-y-2 text-gray-400">
                <li>contato@tarkia.ae</li>
                <li>+971 xx xxxx xxxx</li>
                <li>Dubai, UAE</li>
                <li>tarkia.ae</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-gray-400 text-sm">
            <p>&copy; 2025 Tarkia Consultoria. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 