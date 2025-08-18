# Calculadora Tarkia

Calculadora web completa para análise fiscal empresarial, investimentos imobiliários e planejamento de mudança para os Emirados Árabes Unidos (UAE).

## 🚀 Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Supabase** - Banco de dados PostgreSQL
- **React Hook Form + Zod** - Formulários e validação
- **Recharts** - Gráficos
- **Framer Motion** - Animações
- **jsPDF + html2canvas** - Geração de PDF
#teste1

- Node.js 18+
- npm ou yarn
- Conta no Supabase

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd Tarkia
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o Supabase:
- Crie um projeto no Supabase
- Execute o script SQL para criar as tabelas
- Configure as variáveis de ambiente

4. Execute o seed do banco:
```bash
npm run seed
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 🗄️ Estrutura do Banco

O projeto usa Supabase (PostgreSQL) com as seguintes tabelas:

- `countries` - Países e configurações
- `tax_regimes` - Regimes fiscais
- `tax_brackets` - Faixas de imposto
- `emirates` - Emirados dos UAE
- `real_estate_areas` - Áreas imobiliárias
- `free_zones` - Zonas francas
- `business_sectors` - Setores de negócio
- `cost_of_living_profiles` - Perfis de custo de vida
- `leads` - Captura de leads
- `calculations` - Histórico de cálculos
- `exchange_rates` - Taxas de câmbio
- `system_config` - Configurações do sistema

## 🧮 Funcionalidades

### 1. Calculadora Empresarial
- Compara impostos entre Brasil, Portugal e UAE
- Calcula economia anual ao migrar para UAE
- Suporte a diferentes setores de negócio

### 2. Calculadora Imobiliária
- Análise de ROI em investimentos imobiliários
- Projeções de rendimento e apreciação
- Comparativo entre diferentes áreas

### 3. Calculadora de Custo de Vida
- Perfis básico e premium para Dubai
- Comparativo com custo de vida no Brasil/Portugal
- Detalhamento por categoria

### 4. Calculadora de Free Zones
- Análise de custos e benefícios
- Comparativo entre diferentes Free Zones
- Recomendações por setor

## 📊 Métodos de Cálculo

### Impostos Brasil (IRPJ)
- Faixas progressivas: 0%, 7.5%, 15%, 22.5%, 27.5%
- Base de cálculo: Receita anual

### Impostos Portugal (IRS)
- Faixas progressivas: 14.5%, 23%, 28.5%, 35%, 37%, 43.5%, 45%, 48%
- Base de cálculo: Receita anual

### UAE (Free Zones)
- 0% de impostos corporativos
- 100% propriedade estrangeira
- 100% repatriação de capital

### Investimentos Imobiliários
- ROI = (Rendimento + Apreciação) / Investimento × 100
- Rendimento anual = Valor × Taxa de yield
- Apreciação anual = Valor × Taxa de apreciação

## 🎨 Design System

- **Cores**: Dourado (#c8a46e), Azul escuro (#1e293b), Branco (#ffffff)
- **Fontes**: Inter (corpo), Playfair Display (títulos)
- **Layout**: Responsivo com cards e gradientes
- **Animações**: Transições suaves com Framer Motion

## 📱 Páginas

1. **Home** (`/`) - Apresentação e navegação
2. **Calculadora Empresarial** (`/empresarial`) - Análise fiscal
3. **Calculadora Imobiliária** (`/imoveis`) - Investimentos
4. **Calculadora de Custo de Vida** (`/custo-vida`) - Orçamento
5. **Calculadora de Free Zones** (`/free-zones`) - Zonas francas

## 🔧 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run start` - Servidor de produção
- `npm run lint` - Verificação de código
- `npm run seed` - Popula o banco com dados iniciais

## 🚀 Deploy

O projeto está configurado para deploy na Vercel:

1. Conecte o repositório à Vercel
2. Configure as variáveis de ambiente do Supabase
3. Deploy automático a cada push

## 📄 Geração de PDF

- Relatórios detalhados de cada cálculo
- Inclui dados do usuário e resultados
- Download automático
- Design profissional

## 📈 Captura de Leads

- Formulário integrado em todas as calculadoras
- Armazenamento no Supabase
- Dados: nome, email, telefone, whatsapp
- Rastreamento de fonte e status

## 🔒 Segurança

- Validação de formulários com Zod
- Sanitização de dados
- Rate limiting nas APIs
- Autenticação via Supabase (se necessário)

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Entre em contato via email
- Consulte a documentação do Supabase

## 📄 Licença

Este projeto está sob a licença MIT. 