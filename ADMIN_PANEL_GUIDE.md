# 🛠️ Painel Administrativo - Tarkia Calculator

## 📋 Visão Geral

O painel administrativo permite configurar todos os parâmetros das calculadoras sem necessidade de alterar código. Todas as configurações são salvas no Supabase e aplicadas automaticamente nas calculadoras.

## 🔐 Acesso ao Painel

### Credenciais de Acesso
- **URL**: `/admin/login`
- **Usuário**: `admin`
- **Senha**: `admin`

### Como Acessar
1. Acesse a página principal da calculadora
2. Clique no ícone de configurações (⚙️) no canto superior direito
3. Digite as credenciais de acesso
4. Você será redirecionado para o painel administrativo

## 🎛️ Funcionalidades do Painel

### 1. **Análise Fiscal** (`/admin/dashboard` → Aba "Análise Fiscal")

#### Regimes Tributários
- **Simples Nacional**: Taxa e descrição configuráveis
- **Lucro Presumido**: Taxa e descrição configuráveis  
- **Lucro Real**: Taxa e descrição configuráveis

#### Tipos de Sociedade (Portugal)
- **Sociedade Unipessoal por Quotas**: Custo de setup e contabilidade
- **Sociedade por Quotas**: Custo de setup e contabilidade

#### Free Zones
- **DIFC**: Custo anual, setup, visto e descrição
- **DMCC**: Custo anual, setup, visto e descrição
- **ADGM**: Custo anual, setup, visto e descrição
- **DAFZ**: Custo anual, setup, visto e descrição
- **SHAMS**: Custo anual, setup, visto e descrição

#### Imposto Corporativo UAE
- **Limite**: Valor em USD acima do qual o imposto é aplicado
- **Taxa**: Percentual do imposto corporativo

### 2. **Imóveis** (`/admin/dashboard` → Aba "Imóveis")

#### Emirados
- **Dubai**: Taxa de valorização, yield médio e áreas
- **Abu Dhabi**: Taxa de valorização, yield médio e áreas
- **Sharjah**: Taxa de valorização, yield médio e áreas
- **Ajman**: Taxa de valorização, yield médio e áreas

#### Custos Operacionais
- **Taxa de Registro**: Percentual sobre o valor da propriedade
- **Taxa de Corretagem**: Percentual sobre o aluguel anual
- **Taxa de Seguro**: Percentual sobre o valor da propriedade

### 3. **Custo de Vida** (`/admin/dashboard` → Aba "Custo de Vida")

#### Países
- **Brasil**: Custos base de moradia, transporte e alimentação
- **Portugal**: Custos base de moradia, transporte e alimentação
- **UAE**: Custos base de moradia, transporte e alimentação

#### Estilos de Vida
- **Econômico**: Multiplicador e descrição
- **Padrão**: Multiplicador e descrição
- **Premium**: Multiplicador e descrição

### 4. **Vistos** (`/admin/dashboard` → Aba "Vistos")

#### Tipos de Visto
- **Golden Visa**: Investimento mínimo, validade, tempo de processamento
- **Retirement Visa**: Investimento mínimo, validade, tempo de processamento
- **Property Investor Visa**: Investimento mínimo, validade, tempo de processamento
- **Green Visa**: Investimento mínimo, validade, tempo de processamento
- **Employee Visa**: Investimento mínimo, validade, tempo de processamento

#### Custos por Tipo de Visto
- **Taxa de Visto**: Custo em USD
- **Exame Médico**: Custo em USD
- **Emirates ID**: Custo em USD
- **Documentação**: Custo em USD (inclui taxa Tarkia)

#### Emirados
- **Dubai**: Multiplicador de custo
- **Abu Dhabi**: Multiplicador de custo
- **Sharjah**: Multiplicador de custo
- **Ajman**: Multiplicador de custo

### 5. **Planejamento** (`/admin/dashboard` → Aba "Planejamento")

#### Configurações Gerais
- **Taxa de Desconto**: Para cálculos de valor presente
- **Período de Projeção**: Anos para projeções futuras

## 💾 Salvamento de Configurações

### Como Salvar
1. Faça as alterações desejadas em qualquer aba
2. Clique no botão **"Salvar"** no canto superior direito
3. Aguarde a confirmação de salvamento
4. As configurações são aplicadas automaticamente nas calculadoras

### Persistência
- Todas as configurações são salvas no Supabase
- As configurações são carregadas automaticamente ao acessar o painel
- As calculadoras usam as configurações salvas em tempo real

## 🔄 Integração com Calculadoras

### BusinessCalculator
- Usa `config.business.taxRegimes` para regimes tributários
- Usa `config.business.companyTypes` para tipos de sociedade
- Usa `config.business.freeZones` para free zones
- Usa `config.business.uaeTax` para impostos UAE

### RealEstateCalculator
- Usa `config.realEstate.emirates` para dados dos emirados
- Usa `config.realEstate.costs` para custos operacionais

### CostOfLivingCalculator
- Usa `config.costOfLiving.countries` para custos por país
- Usa `config.costOfLiving.lifestyles` para estilos de vida

### VisaCalculator
- Usa `config.visa.types` para tipos de visto
- Usa `config.visa.costs` para custos por tipo
- Usa `config.visa.emirates` para multiplicadores por emirado

## 🛡️ Segurança

### Autenticação
- Login obrigatório para acessar o painel
- Sessão expira em 24 horas
- Cookies e localStorage para persistência de sessão

### Middleware de Proteção
- Rotas `/admin/*` são protegidas automaticamente
- Redirecionamento automático para login se não autenticado

## 🚀 Como Usar

### 1. Primeiro Acesso
1. Acesse `/admin/login`
2. Use as credenciais: `admin` / `admin`
3. Configure os parâmetros conforme necessário
4. Salve as configurações

### 2. Alterações Futuras
1. Acesse o painel administrativo
2. Navegue pelas abas relevantes
3. Modifique os valores conforme necessário
4. Salve as alterações
5. As calculadoras são atualizadas automaticamente

### 3. Exemplo de Uso
```
1. Acesse o painel administrativo
2. Vá para "Análise Fiscal"
3. Altere a taxa do Simples Nacional de 6% para 8%
4. Clique em "Salvar"
5. Volte para a calculadora principal
6. Os cálculos agora usam 8% para Simples Nacional
```

## 📊 Estrutura de Dados

### Configuração Completa
```json
{
  "business": {
    "taxRegimes": { ... },
    "companyTypes": { ... },
    "freeZones": { ... },
    "uaeTax": { ... }
  },
  "realEstate": {
    "emirates": { ... },
    "propertyTypes": { ... },
    "costs": { ... }
  },
  "costOfLiving": {
    "countries": { ... },
    "lifestyles": { ... }
  },
  "visa": {
    "types": { ... },
    "costs": { ... },
    "emirates": { ... }
  }
}
```

## 🔧 Desenvolvimento

### Arquivos Principais
- `src/app/admin/login/page.tsx` - Página de login
- `src/app/admin/dashboard/page.tsx` - Painel principal
- `src/app/api/admin/config/route.ts` - API de configurações
- `src/hooks/useCalculatorConfig.ts` - Hook para configurações
- `src/middleware.ts` - Proteção de rotas

### Extensibilidade
- Adicione novas abas no dashboard
- Crie novos campos de configuração
- Integre com outras calculadoras
- Adicione validações personalizadas

## 📝 Notas Importantes

1. **Backup**: As configurações são salvas no Supabase, mas é recomendado fazer backup regular
2. **Validação**: Alguns campos têm validações básicas, mas validações avançadas podem ser adicionadas
3. **Performance**: As configurações são carregadas uma vez e mantidas em cache
4. **Compatibilidade**: Todas as calculadoras são compatíveis com o sistema de configurações

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verifique se as credenciais estão corretas
2. Confirme se o Supabase está configurado
3. Verifique o console do navegador para erros
4. Teste com configurações padrão primeiro
