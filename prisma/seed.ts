import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // 1. Países
  const brasil = await prisma.country.upsert({
    where: { code: 'BR' },
    update: {},
    create: {
      name: 'Brasil',
      code: 'BR',
      currency: 'BRL',
      workingDaysForTaxes: 149,
      taxPercentageOfYear: 40.8,
    },
  })

  const portugal = await prisma.country.upsert({
    where: { code: 'PT' },
    update: {},
    create: {
      name: 'Portugal',
      code: 'PT',
      currency: 'EUR',
      workingDaysForTaxes: 128,
      taxPercentageOfYear: 35.1,
    },
  })

  const uae = await prisma.country.upsert({
    where: { code: 'AE' },
    update: {},
    create: {
      name: 'Emirados Árabes Unidos',
      code: 'AE',
      currency: 'AED',
      workingDaysForTaxes: 15,
      taxPercentageOfYear: 4.1,
    },
  })

  // 2. Regimes Tributários - Brasil
  const simplesNacional = await prisma.taxRegime.create({
    data: {
      name: 'Simples Nacional',
      countryId: brasil.id,
      description: 'Regime tributário simplificado para pequenas e médias empresas',
      baseRate: 0.06,
    },
  })

  const lucroPresumido = await prisma.taxRegime.create({
    data: {
      name: 'Lucro Presumido',
      countryId: brasil.id,
      description: 'Regime para empresas com faturamento até R$ 78 milhões',
      baseRate: 0.1133,
    },
  })

  // 3. Faixas Tributárias - Simples Nacional
  await prisma.taxBracket.createMany({
    data: [
      { taxRegimeId: simplesNacional.id, minIncome: 0, maxIncome: 180000, rate: 0.06 },
      { taxRegimeId: simplesNacional.id, minIncome: 180000, maxIncome: 360000, rate: 0.112 },
      { taxRegimeId: simplesNacional.id, minIncome: 360000, maxIncome: 720000, rate: 0.135 },
      { taxRegimeId: simplesNacional.id, minIncome: 720000, maxIncome: 1800000, rate: 0.16 },
      { taxRegimeId: simplesNacional.id, minIncome: 1800000, maxIncome: 3600000, rate: 0.21 },
      { taxRegimeId: simplesNacional.id, minIncome: 3600000, maxIncome: null, rate: 0.33 },
    ],
  })

  // 4. Regime Tributário - Portugal
  const ircPortugal = await prisma.taxRegime.create({
    data: {
      name: 'IRC + Derramas',
      countryId: portugal.id,
      description: 'Imposto sobre o Rendimento de Pessoas Coletivas + Derramas',
      baseRate: 0.315,
    },
  })

  // 5. Regime Tributário - UAE
  const corporateTaxUAE = await prisma.taxRegime.create({
    data: {
      name: 'Corporate Tax',
      countryId: uae.id,
      description: 'Imposto corporativo dos Emirados Árabes Unidos',
      baseRate: 0.09,
    },
  })

  await prisma.taxBracket.createMany({
    data: [
      { taxRegimeId: corporateTaxUAE.id, minIncome: 0, maxIncome: 102000, rate: 0.0 },
      { taxRegimeId: corporateTaxUAE.id, minIncome: 102000, maxIncome: null, rate: 0.09 },
    ],
  })

  // 6. Free Zones principais
  await prisma.freeZone.createMany({
    data: [
      {
        name: 'DIFC (Dubai International Financial Centre)',
        code: 'DIFC',
        emirate: 'Dubai',
        annualCost: 15000,
        setupCost: 25000,
        description: 'Centro financeiro internacional de Dubai',
        benefits: JSON.stringify(['0% imposto corporativo', 'Propriedade 100%', 'Repatriação total de lucros']),
        sectors: JSON.stringify(['Serviços Financeiros', 'Fintech', 'Consultoria']),
      },
      {
        name: 'DMCC (Dubai Multi Commodities Centre)',
        code: 'DMCC',
        emirate: 'Dubai',
        annualCost: 12000,
        setupCost: 20000,
        description: 'Centro de commodities de Dubai',
        benefits: JSON.stringify(['0% imposto corporativo', 'Propriedade 100%', 'Facilidades comerciais']),
        sectors: JSON.stringify(['Trading', 'Commodities', 'E-commerce']),
      },
      {
        name: 'ADGM (Abu Dhabi Global Market)',
        code: 'ADGM',
        emirate: 'Abu Dhabi',
        annualCost: 14000,
        setupCost: 22000,
        description: 'Mercado global de Abu Dhabi',
        benefits: JSON.stringify(['0% imposto corporativo', 'Propriedade 100%', 'Sistema legal inglês']),
        sectors: JSON.stringify(['Serviços Financeiros', 'Tecnologia', 'Consultoria']),
      },
      {
        name: 'DAFZ (Dubai Airport Free Zone)',
        code: 'DAFZ',
        emirate: 'Dubai',
        annualCost: 8000,
        setupCost: 15000,
        description: 'Zona franca do aeroporto de Dubai',
        benefits: JSON.stringify(['0% imposto corporativo', 'Proximidade ao aeroporto', 'Logística facilitada']),
        sectors: JSON.stringify(['Logística', 'Trading', 'Serviços']),
      },
      {
        name: 'SHAMS (Sharjah Media City)',
        code: 'SHAMS',
        emirate: 'Sharjah',
        annualCost: 6000,
        setupCost: 12000,
        description: 'Cidade de mídia de Sharjah',
        benefits: JSON.stringify(['Baixo custo', '0% imposto corporativo', 'Foco em mídia']),
        sectors: JSON.stringify(['Mídia', 'Marketing', 'Produção']),
      },
    ],
  })

  // 7. Emirados
  const dubai = await prisma.emirate.create({
    data: {
      name: 'Dubai',
      code: 'DXB',
      averageYield: 0.07,
      appreciationRate: 0.08,
    },
  })

  const abuDhabi = await prisma.emirate.create({
    data: {
      name: 'Abu Dhabi',
      code: 'AUH',
      averageYield: 0.06,
      appreciationRate: 0.06,
    },
  })

  const sharjah = await prisma.emirate.create({
    data: {
      name: 'Sharjah',
      code: 'SHJ',
      averageYield: 0.085,
      appreciationRate: 0.07,
    },
  })

  // 8. Áreas Imobiliárias - Dubai
  await prisma.realEstateArea.createMany({
    data: [
      { name: 'Dubai Marina', emirateId: dubai.id, yield: 0.065, avgPriceSqft: 1200 },
      { name: 'Business Bay', emirateId: dubai.id, yield: 0.07, avgPriceSqft: 1100 },
      { name: 'Downtown Dubai', emirateId: dubai.id, yield: 0.055, avgPriceSqft: 1500 },
      { name: 'JVC (Jumeirah Village Circle)', emirateId: dubai.id, yield: 0.075, avgPriceSqft: 800 },
      { name: 'JLT (Jumeirah Lake Towers)', emirateId: dubai.id, yield: 0.07, avgPriceSqft: 900 },
      { name: 'Palm Jumeirah', emirateId: dubai.id, yield: 0.05, avgPriceSqft: 2000 },
      { name: 'Dubai Hills', emirateId: dubai.id, yield: 0.065, avgPriceSqft: 1300 },
      { name: 'Arabian Ranches', emirateId: dubai.id, yield: 0.06, avgPriceSqft: 1000 },
    ],
  })

  // 9. Áreas Imobiliárias - Abu Dhabi
  await prisma.realEstateArea.createMany({
    data: [
      { name: 'Al Reem Island', emirateId: abuDhabi.id, yield: 0.06, avgPriceSqft: 900 },
      { name: 'Saadiyat Island', emirateId: abuDhabi.id, yield: 0.055, avgPriceSqft: 1200 },
      { name: 'Yas Island', emirateId: abuDhabi.id, yield: 0.065, avgPriceSqft: 800 },
      { name: 'Al Raha Beach', emirateId: abuDhabi.id, yield: 0.06, avgPriceSqft: 850 },
    ],
  })

  // 10. Setores de Negócio
  await prisma.businessSector.createMany({
    data: [
      { name: 'Consultoria', description: 'Serviços de consultoria empresarial e estratégica' },
      { name: 'E-commerce', description: 'Comércio eletrônico e vendas online' },
      { name: 'Trading', description: 'Compra e venda de commodities e produtos' },
      { name: 'Serviços Digitais', description: 'Desenvolvimento de software e serviços digitais' },
      { name: 'Holding', description: 'Empresa holding para participações societárias' },
      { name: 'Manufatura', description: 'Produção industrial e manufatura' },
      { name: 'Logística', description: 'Serviços de logística e transporte' },
      { name: 'Educação', description: 'Serviços educacionais e treinamento' },
      { name: 'Saúde', description: 'Serviços médicos e de saúde' },
      { name: 'Marketing', description: 'Serviços de marketing e publicidade' },
      { name: 'Fintech', description: 'Tecnologia financeira e soluções de pagamento' },
      { name: 'Real Estate', description: 'Desenvolvimento e investimento imobiliário' },
    ],
  })

  // 11. Taxa de Câmbio
  await prisma.exchangeRate.createMany({
    data: [
      { fromCurrency: 'USD', toCurrency: 'AED', rate: 3.67 },
      { fromCurrency: 'USD', toCurrency: 'BRL', rate: 5.20 },
      { fromCurrency: 'USD', toCurrency: 'EUR', rate: 0.85 },
      { fromCurrency: 'AED', toCurrency: 'USD', rate: 0.27 },
      { fromCurrency: 'BRL', toCurrency: 'USD', rate: 0.19 },
      { fromCurrency: 'EUR', toCurrency: 'USD', rate: 1.18 },
    ],
  })

  // 12. Configurações do Sistema
  await prisma.systemConfig.createMany({
    data: [
      { key: 'uae_corporate_tax_threshold_usd', value: '102000', type: 'number', description: 'Limite para início do imposto corporativo nos UAE (USD)' },
      { key: 'uae_corporate_tax_rate', value: '0.09', type: 'number', description: 'Taxa do imposto corporativo UAE acima do limite' },
      { key: 'default_currency', value: 'USD', type: 'string', description: 'Moeda padrão para cálculos' },
      { key: 'pdf_company_name', value: 'Tarkia Consultoria', type: 'string', description: 'Nome da empresa nos relatórios PDF' },
      { key: 'pdf_company_website', value: 'tarkia.ae', type: 'string', description: 'Website da empresa nos relatórios' },
      { key: 'pdf_company_email', value: 'contato@tarkia.ae', type: 'string', description: 'Email da empresa nos relatórios' },
    ],
  })

  console.log('✅ Seed concluído com sucesso!')
  console.log(`📊 Países: ${await prisma.country.count()}`)
  console.log(`🏛️ Regimes Tributários: ${await prisma.taxRegime.count()}`)
  console.log(`📈 Faixas Tributárias: ${await prisma.taxBracket.count()}`)
  console.log(`🏢 Free Zones: ${await prisma.freeZone.count()}`)
  console.log(`🏙️ Emirados: ${await prisma.emirate.count()}`)
  console.log(`🏠 Áreas Imobiliárias: ${await prisma.realEstateArea.count()}`)
  console.log(`💼 Setores de Negócio: ${await prisma.businessSector.count()}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  }) 