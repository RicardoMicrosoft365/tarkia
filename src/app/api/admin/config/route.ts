import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Função para fazer deep merge de objetos
function deepMerge(target: any, source: any): any {
  const output = { ...target }
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] })
        } else {
          output[key] = deepMerge(target[key], source[key])
        }
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }
  return output
}

function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item)
}

// Função para obter configuração padrão
function getDefaultConfig() {
  return {
    business: {
      taxRegimes: {
        simples: { name: 'Simples Nacional', rate: 0.06, description: 'Regime simplificado para pequenas empresas' },
        presumido: { name: 'Lucro Presumido', rate: 0.15, description: 'Regime para empresas de médio porte' },
        real: { name: 'Lucro Real', rate: 0.25, description: 'Regime para grandes empresas' }
      },
      companyTypes: {
        industria: {
          name: 'Indústria',
          description: 'Empresa de produção/manufatura',
          taxRates: {
            simples: {
              federal: 0.0539,
              icms: 0.18,
              iss: 0,
              total: 0.2339
            },
            presumido: {
              '2026': {
                federal: 0.0539,
                icms: 0.18,
                iss: 0,
                total: 0.2339
              },
              '2027': {
                federal: 0.0539,
                icms: 0.18,
                iss: 0.05,
                total: 0.2839
              },
              '2028': {
                federal: 0.0539,
                icms: 0.18,
                iss: 0.05,
                total: 0.2839
              }
            },
            real: {
              pis: 0.0165,
              cofins: 0.076,
              irpj: 0.15,
              csll: 0.09,
              total: 0.3325
            }
          }
        },
        servicos: {
          name: 'Serviços',
          description: 'Empresa prestadora de serviços',
          taxRates: {
            simples: {
              federal: 0.1139,
              icms: 0,
              iss: 0.05,
              total: 0.1639
            },
            presumido: {
              '2026': {
                federal: 0.1139,
                icms: 0,
                iss: 0.05,
                total: 0.1639
              },
              '2027': {
                federal: 0.1139,
                icms: 0.18,
                iss: 0.05,
                total: 0.3439
              },
              '2028': {
                federal: 0.1139,
                icms: 0.18,
                iss: 0.05,
                total: 0.3439
              }
            },
            real: {
              pis: 0.0165,
              cofins: 0.076,
              irpj: 0.15,
              csll: 0.09,
              total: 0.3325
            }
          }
        },
        comercio: {
          name: 'Comércio',
          description: 'Empresa de venda de produtos',
          taxRates: {
            simples: {
              federal: 0.0539,
              icms: 0.18,
              iss: 0,
              total: 0.2339
            },
            presumido: {
              '2026': {
                federal: 0.0539,
                icms: 0.18,
                iss: 0,
                total: 0.2339
              },
              '2027': {
                federal: 0.0539,
                icms: 0.18,
                iss: 0.05,
                total: 0.2839
              },
              '2028': {
                federal: 0.0539,
                icms: 0.18,
                iss: 0.05,
                total: 0.2839
              }
            },
            real: {
              pis: 0.0165,
              cofins: 0.076,
              irpj: 0.15,
              csll: 0.09,
              total: 0.3325
            }
          }
        },
        unipessoal: { name: 'Sociedade Unipessoal', setupCost: 360, accountingCost: 100, description: 'Empresa com um único sócio' },
        quotas: { name: 'Sociedade por Quotas', setupCost: 360, accountingCost: 120, description: 'Empresa com múltiplos sócios' }
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
}

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

    // Obter configuração padrão
    const defaultConfig = getDefaultConfig()

    // Se não existir configuração, retornar configuração padrão
    if (!data) {
      return NextResponse.json({ config: defaultConfig })
    }

    // Parse o JSON se for string
    let savedConfig = data.value
    if (typeof savedConfig === 'string') {
      try {
        savedConfig = JSON.parse(savedConfig)
      } catch (e) {
        console.error('Erro ao fazer parse do JSON:', e)
        return NextResponse.json(
          { error: 'Erro ao processar configurações' },
          { status: 500 }
        )
      }
    }
    
    // Fazer merge profundo: padrão + salvo (o salvo sobrescreve o padrão)
    // Mas garantir que tipos brasileiros sempre existam
    const mergedConfig = deepMerge(defaultConfig, savedConfig)
    
    // Garantir que os tipos brasileiros sempre existam em business.companyTypes
    if (!mergedConfig.business) {
      mergedConfig.business = defaultConfig.business
    } else if (!mergedConfig.business.companyTypes) {
      mergedConfig.business.companyTypes = defaultConfig.business.companyTypes
    } else {
      // Garantir que industria, servicos e comercio sempre existam
      if (!mergedConfig.business.companyTypes.industria) {
        mergedConfig.business.companyTypes.industria = defaultConfig.business.companyTypes.industria
      }
      if (!mergedConfig.business.companyTypes.servicos) {
        mergedConfig.business.companyTypes.servicos = defaultConfig.business.companyTypes.servicos
      }
      if (!mergedConfig.business.companyTypes.comercio) {
        mergedConfig.business.companyTypes.comercio = defaultConfig.business.companyTypes.comercio
      }
    }
    
    return NextResponse.json({ config: mergedConfig })
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
