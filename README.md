# 🚀 Calculadora Tarkia - Versão Moderna

Uma calculadora profissional para análise fiscal empresarial, investimentos imobiliários e planejamento de mudança para os Emirados Árabes Unidos.

## ✨ Características Principais

### 🏗️ **Tecnologias Modernas**
- **Next.js 14** com App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilização moderna
- **Prisma** para banco de dados
- **React Hook Form + Zod** para validação
- **Lucide React** para ícones
- **Framer Motion** para animações

### 📊 **Funcionalidades**

#### 1. **Análise Empresarial**
- Comparação tributária entre Brasil (34%), Portugal (31.5%) e UAE (0-9%)
- Análise de 5+ Free Zones principais dos UAE
- Cálculo automático de economia fiscal anual
- Projeções de longo prazo (5 anos)
- Análise de payback do investimento

#### 2. **Investimento Imobiliário** 
- ROI de investimentos nos UAE
- Dados de yields por emirado
- Calculadora de valorização
- Comparativo entre diferentes áreas

#### 3. **Custo de Vida**
- Comparação detalhada de gastos mensais
- Diferentes perfis socioeconômicos
- Custos de moradia, alimentação, transporte

#### 4. **Vistos e Residência**
- Análise de custos de processos
- Requisitos por tipo de visto
- Timeline de processos

#### 5. **Planejamento 360°**
- Visão integrada de todos os aspectos
- Relatórios personalizados em PDF
- Dashboard executivo

### 🔐 **Sistema de Leads**
- Captura profissional de leads
- Validação completa de formulários
- Integração com CRM (preparado)
- Notificações por email (preparado)

## 🚀 **Instalação e Uso**

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone [url-do-repositorio]
cd tarkia-calculator

# Instale as dependências
npm install

# Configure o banco de dados
npm run db:push
npm run db:generate

# Popule com dados iniciais
npx prisma db seed

# Execute em desenvolvimento
npm run dev
```

### Comandos Disponíveis
```bash
npm run dev          # Executa em desenvolvimento
npm run build        # Build para produção
npm run start        # Executa em produção
npm run lint         # Linter do código
npm run db:studio    # Interface visual do banco
npm run db:generate  # Gera o cliente Prisma
npm run db:push      # Aplica mudanças no schema
```

## 🗄️ **Banco de Dados**

### Estrutura Principal
- **Countries** - Países e regimes tributários
- **TaxRegimes** - Regimes fiscais por país
- **TaxBrackets** - Faixas de tributação
- **FreeZones** - Zonas francas dos UAE
- **Emirates** - Emirados e dados imobiliários
- **RealEstateAreas** - Áreas específicas para investimento
- **BusinessSectors** - Setores de negócio
- **Leads** - Captura de prospects
- **Calculations** - Histórico de cálculos

### Dados Pré-configurados
- ✅ 3 países (Brasil, Portugal, UAE)
- ✅ 5+ Free Zones principais
- ✅ 7 emirados com dados imobiliários
- ✅ 12+ setores de negócio
- ✅ Taxas de câmbio atualizadas
- ✅ Configurações do sistema

## 📊 **Dados Baseados no Projeto Original**

### Regimes Tributários
```
Brasil:
- Simples Nacional: 6% - 33%
- Lucro Presumido: 11.33% - 32%
- 149 dias trabalhando para impostos/ano

Portugal:
- IRC + Derramas: 31.5%
- 128 dias trabalhando para impostos/ano

UAE:
- Corporate Tax: 0% (até $102k), 9% acima
- Free Zones: 0% impostos
- 15 dias trabalhando para impostos/ano
```

### Free Zones Principais
- **DIFC** - Dubai International Financial Centre
- **DMCC** - Dubai Multi Commodities Centre  
- **ADGM** - Abu Dhabi Global Market
- **DAFZ** - Dubai Airport Free Zone
- **SHAMS** - Sharjah Media City

### Dados Imobiliários
- **Dubai**: 7% yield médio, 8% valorização
- **Abu Dhabi**: 6% yield médio, 6% valorização
- **Sharjah**: 8.5% yield médio, 7% valorização

## 🎨 **Interface Moderna**

### Design System
- **Cores primárias**: Gold (#c8a46e) + Blue (#2a5298)
- **Typography**: Inter + Playfair Display
- **Componentes**: Reutilizáveis e modulares
- **Responsivo**: Mobile-first design
- **Animações**: Sutis e profissionais

### Experiência do Usuário
1. **Landing atrativa** com hero section
2. **Captura de leads** com validação
3. **Calculadora desbloqueada** após cadastro
4. **Navegação por abas** intuitiva
5. **Resultados visuais** com gráficos
6. **Relatórios em PDF** profissionais

## 🔧 **Configurações e Personalizações**

### Atualizando Dados Tributários
```typescript
// Edite diretamente no banco via Prisma Studio
npm run db:studio

// Ou use a API de configurações
PUT /api/config/tax-rates
```

### Adicionando Novas Free Zones
```typescript
// Via seed ou Prisma Studio
{
  name: "Nova Free Zone",
  code: "NFZ",
  emirate: "Dubai", 
  annualCost: 10000,
  setupCost: 15000
}
```

### Personalizando Temas
```css
/* Edite tailwind.config.ts */
colors: {
  primary: { /* suas cores */ },
  tarkia: { /* cores da marca */ }
}
```

## 📈 **Métricas e Analytics**

### KPIs Importantes
- **Taxa de conversão** de leads
- **Tempo na calculadora**
- **Downloads de relatórios**
- **Free Zones mais populares**

### Integração Analytics (Preparado)
- Google Analytics 4
- Facebook Pixel
- Hotjar/FullStory
- Custom events tracking

## 🚀 **Deploy e Produção**

### Vercel (Recomendado)
```bash
# Deploy automático via GitHub
# Configure as variáveis de ambiente
# Database URL para PostgreSQL
```

### Variáveis de Ambiente
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
EMAIL_SERVER="smtp://..."
GOOGLE_ANALYTICS_ID="..."
```

## 🔮 **Próximos Passos**

### Funcionalidades Futuras
- [ ] **Dashboard administrativo** completo
- [ ] **Integração com APIs** de taxas de câmbio
- [ ] **Sistema de notificações** por email
- [ ] **Chat ao vivo** integrado
- [ ] **Multilíngue** (EN/PT/AR)
- [ ] **App mobile** PWA
- [ ] **Integração CRM** (HubSpot/Salesforce)
- [ ] **Analytics avançado** de conversões

### Melhorias Técnicas
- [ ] **Testes automatizados** (Jest/Cypress)
- [ ] **CI/CD pipeline** completo
- [ ] **Monitoramento** (Sentry/LogRocket)
- [ ] **Cache Redis** para performance
- [ ] **CDN** para assets globais

## 🤝 **Contribuição**

Este projeto foi desenvolvido com base na análise completa do projeto Tarkia original, modernizando a stack tecnológica e melhorando a experiência do usuário.

### Estrutura do Código
```
src/
├── app/                 # Next.js App Router
├── components/          # Componentes React
├── lib/                 # Utilitários e configs
├── types/               # Tipos TypeScript
└── utils/               # Funções auxiliares

prisma/
├── schema.prisma        # Schema do banco
└── seed.ts             # Dados iniciais
```

---

## 📞 **Suporte**

Para dúvidas sobre implementação ou customização:
- 📧 Email: suporte@tarkia.ae
- 💬 WhatsApp: +971 xx xxxx xxxx
- 🌐 Website: tarkia.ae

---

**Desenvolvido com ❤️ para Tarkia Consultoria** 