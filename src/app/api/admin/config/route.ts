import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Carregar configurações
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('system_config')
      .select('*')
      .eq('key', 'calculator_config')
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Erro ao carregar configurações:', error)
      return NextResponse.json(
        { error: 'Erro ao carregar configurações' },
        { status: 500 }
      )
    }

    // Se não existir configuração, retornar configuração padrão
    if (!data) {
      const defaultConfig = {
        business: {
          taxRegimes: {
            simples: { rate: 0.06, description: 'Regime simplificado para pequenas empresas' },
            presumido: { rate: 0.15, description: 'Regime para empresas de médio porte' },
            real: { rate: 0.25, description: 'Regime para grandes empresas' }
          },
          companyTypes: {
            unipessoal: { setupCost: 360, accountingCost: 100, description: 'Empresa com um único sócio' },
            quotas: { setupCost: 360, accountingCost: 120, description: 'Empresa com múltiplos sócios' }
          },
          freeZones: {
            DIFC: { name: 'DIFC', annualCost: 15000, setupCost: 25000, visaCost: 3000, description: 'Centro financeiro' },
            DMCC: { name: 'DMCC', annualCost: 12000, setupCost: 20000, visaCost: 2500, description: 'Commodities' },
            ADGM: { name: 'ADGM', annualCost: 18000, setupCost: 30000, visaCost: 3500, description: 'Abu Dhabi' }
          },
          uaeTax: {
            threshold: 102000,
            rate: 0.09
          }
        },
        realEstate: {
          emirates: {
            dubai: { name: 'Dubai', appreciationRate: 0.07, averageYield: 0.065, areas: ['Marina', 'Business Bay', 'JVC'] },
            abu_dhabi: { name: 'Abu Dhabi', appreciationRate: 0.06, averageYield: 0.055, areas: ['Al Reem', 'Saadiyat'] }
          },
          propertyTypes: {
            apartment: { name: 'Apartamento', maintenanceRate: 0.02, serviceRate: 0.08 },
            villa: { name: 'Villa', maintenanceRate: 0.03, serviceRate: 0.10 }
          },
          costs: {
            registrationFee: 0.04,
            brokerageFee: 0.02,
            insuranceRate: 0.002
          }
        },
        costOfLiving: {
          countries: {
            brasil: { name: 'Brasil', currency: 'BRL', baseCosts: { housing: 800, transportation: 300, food: 400 } },
            portugal: { name: 'Portugal', currency: 'EUR', baseCosts: { housing: 1200, transportation: 400, food: 500 } },
            uae: { name: 'UAE', currency: 'AED', baseCosts: { housing: 2000, transportation: 600, food: 800 } }
          },
          lifestyles: {
            budget: { name: 'Econômico', multiplier: 0.6, description: 'Moradia compartilhada' },
            standard: { name: 'Padrão', multiplier: 1.0, description: 'Apartamento próprio' },
            premium: { name: 'Premium', multiplier: 1.5, description: 'Casa própria' }
          }
        },
        visa: {
          types: {
            golden: { name: 'Golden Visa', description: 'Investimento imobiliário', minInvestment: 544600, validity: 10, processingTime: 30 },
            retirement: { name: 'Retirement Visa', description: 'Aposentadoria', minInvestment: 272300, validity: 5, processingTime: 45 },
            property: { name: 'Property Investor Visa', description: 'Investimento imobiliário', minInvestment: 204225, validity: 2, processingTime: 30 },
            green: { name: 'Green Visa', description: 'Profissionais qualificados', minInvestment: 0, validity: 5, processingTime: 30 },
            employment: { name: 'Employee Visa', description: 'Funcionários', minInvestment: 0, validity: 2, processingTime: 60 }
          },
          costs: {
            golden: { visa: 2859, medical: 320, emiratesId: 370, documents: 2668 },
            retirement: { visa: 545, medical: 320, emiratesId: 370, documents: 1500 },
            property: { visa: 272, medical: 320, emiratesId: 370, documents: 1200 },
            green: { visa: 327, medical: 320, emiratesId: 370, documents: 800 },
            employment: { visa: 136, medical: 320, emiratesId: 370, documents: 500 }
          },
          emirates: {
            dubai: { name: 'Dubai', multiplier: 1.0 },
            abu_dhabi: { name: 'Abu Dhabi', multiplier: 0.9 },
            sharjah: { name: 'Sharjah', multiplier: 0.8 },
            ajman: { name: 'Ajman', multiplier: 0.7 }
          }
        }
      }

      return NextResponse.json({ config: defaultConfig })
    }

    // Parse o JSON se for string
    let configValue = data.value
    if (typeof configValue === 'string') {
      try {
        configValue = JSON.parse(configValue)
      } catch (e) {
        console.error('Erro ao fazer parse do JSON:', e)
        return NextResponse.json(
          { error: 'Erro ao processar configurações' },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json({ config: configValue })
  } catch (error) {
    console.error('Erro na API de configurações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Salvar configurações
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { config } = body

    if (!config) {
      return NextResponse.json(
        { error: 'Configuração é obrigatória' },
        { status: 400 }
      )
    }

    // Usar upsert para inserir ou atualizar
    const { error } = await supabaseAdmin
      .from('system_config')
      .upsert({
        key: 'calculator_config',
        value: JSON.stringify(config), // Converter para string JSON
        type: 'json',
        description: 'Configurações das calculadoras',
        isActive: true
      })

    if (error) {
      console.error('Erro ao salvar configuração:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar configuração' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Configurações salvas com sucesso' })
  } catch (error) {
    console.error('Erro na API de configurações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
