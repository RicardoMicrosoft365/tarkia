# Plano de Ação: Tipo de Empresa e Impostos Configuráveis

## 📋 Objetivo
Adicionar funcionalidade para o usuário escolher o tipo de empresa (Indústria, Serviços, Comércio) e configurar os percentuais de impostos no painel administrativo.

---

## 🎯 Requisitos Funcionais

### 1. Tipos de Empresa
- **Indústria**: 5.39% (Federal) + 18% ICMS = 23.39%
- **Serviços**: 11.39% + 5% ISS = 16.39%
- **Comércio**: 5.39% (Federal) + 18% ICMS = 23.39%

### 2. Regimes Tributários
- **Lucro Presumido**: 
  - Indústria/Comércio: 23.39% (2026) → 28.39% (2027-2028 com ISS)
  - Serviços: 16.39% (2026) → 16.39% + 18% ICMS (2027-2028)
- **Lucro Real**: 
  - Valores fixos: PIS 1.65% + COFINS 7.6% + IRPJ 15% + CSLL 9% = 33.25%

### 3. Anos de Referência
- **2026**: Valores atuais
- **2027-2028**: Novos valores com mudanças tributárias

---

## 📐 Estrutura de Dados

### Schema do Banco de Dados

```sql
-- Adicionar à tabela system_config uma nova estrutura para tipos de empresa
{
  "business": {
    "companyTypes": {
      "industria": {
        "name": "Indústria",
        "description": "Empresa de produção/manufatura",
        "taxRates": {
          "presumido": {
            "2026": {
              "federal": 0.0539,
              "icms": 0.18,
              "iss": 0,
              "total": 0.2339
            },
            "2027": {
              "federal": 0.0539,
              "icms": 0.18,
              "iss": 0.05,
              "total": 0.2839
            }
          },
          "real": {
            "pis": 0.0165,
            "cofins": 0.076,
            "irpj": 0.15,
            "csll": 0.09,
            "total": 0.3325
          }
        }
      },
      "servicos": {
        "name": "Serviços",
        "description": "Empresa prestadora de serviços",
        "taxRates": {
          "presumido": {
            "2026": {
              "federal": 0.1139,
              "icms": 0,
              "iss": 0.05,
              "total": 0.1639
            },
            "2027": {
              "federal": 0.1139,
              "icms": 0.18,
              "iss": 0.05,
              "total": 0.3439
            }
          },
          "real": {
            "pis": 0.0165,
            "cofins": 0.076,
            "irpj": 0.15,
            "csll": 0.09,
            "total": 0.3325
          }
        }
      },
      "comercio": {
        "name": "Comércio",
        "description": "Empresa de venda de produtos",
        "taxRates": {
          "presumido": {
            "2026": {
              "federal": 0.0539,
              "icms": 0.18,
              "iss": 0,
              "total": 0.2339
            },
            "2027": {
              "federal": 0.0539,
              "icms": 0.18,
              "iss": 0.05,
              "total": 0.2839
            }
          },
          "real": {
            "pis": 0.0165,
            "cofins": 0.076,
            "irpj": 0.15,
            "csll": 0.09,
            "total": 0.3325
          }
        }
      }
    }
  }
}
```

---

## 🔧 Implementação

### Fase 1: Atualizar Schema e Configurações

#### 1.1 Atualizar Interface TypeScript
**Arquivo**: `src/hooks/useCalculatorConfig.ts`
- Adicionar interface para `companyTypes` com estrutura de taxRates
- Incluir suporte para anos (2026, 2027, 2028)
- Incluir breakdown de impostos (PIS, COFINS, IRPJ, CSLL, ICMS, ISS)

#### 1.2 Atualizar API de Configurações
**Arquivo**: `src/app/api/admin/config/route.ts`
- Adicionar valores padrão para os novos tipos de empresa
- Garantir compatibilidade com estrutura existente

#### 1.3 Atualizar Schema do Banco
**Arquivo**: `supabase-complete-schema.sql`
- Criar migration para atualizar configuração padrão
- Incluir todos os valores fornecidos pelo cliente

---

### Fase 2: Atualizar Painel Administrativo

#### 2.1 Adicionar Seção de Tipos de Empresa
**Arquivo**: `src/app/admin/dashboard/page.tsx`
- Criar componente `CompanyTypesConfigTab`
- Permitir edição de:
  - Nome e descrição de cada tipo
  - Percentuais de impostos por regime (Presumido/Real)
  - Percentuais por ano (2026, 2027, 2028)
  - Breakdown individual de cada imposto

#### 2.2 Interface de Edição
- Formulário com abas para cada tipo de empresa
- Campos para cada imposto (PIS, COFINS, IRPJ, CSLL, ICMS, ISS)
- Seleção de ano (2026, 2027, 2028)
- Seleção de regime (Presumido, Real)
- Cálculo automático do total

---

### Fase 3: Atualizar Calculadora Empresarial

#### 3.1 Adicionar Campo de Tipo de Empresa
**Arquivo**: `src/components/calculators/BusinessCalculator.tsx`
- Adicionar select para tipo de empresa (Indústria, Serviços, Comércio)
- Adicionar campo para seleção de ano (2026, 2027, 2028)
- Manter campo de regime tributário existente

#### 3.2 Atualizar Lógica de Cálculo
**Arquivo**: `src/components/calculators/BusinessCalculator.tsx`
- Modificar função `calculateTaxes()` para:
  - Buscar configurações do tipo de empresa selecionado
  - Aplicar percentuais baseados em:
    - Tipo de empresa (Indústria/Serviços/Comércio)
    - Regime tributário (Presumido/Real)
    - Ano selecionado (2026/2027/2028)
  - Calcular impostos individuais quando disponível
  - Mostrar breakdown detalhado dos impostos

#### 3.3 Atualizar Interface de Resultados
- Mostrar breakdown detalhado dos impostos:
  - PIS, COFINS, IRPJ, CSLL (federal)
  - ICMS (estadual)
  - ISS (municipal)
  - Total calculado

---

### Fase 4: Validações e Testes

#### 4.1 Validações
- Garantir que todos os campos obrigatórios estão preenchidos
- Validar que os percentuais somam corretamente
- Validar que os anos estão dentro do range permitido

#### 4.2 Testes
- Testar cada combinação de tipo + regime + ano
- Verificar cálculos com valores conhecidos
- Testar salvamento no painel admin
- Testar carregamento das configurações

---

## 📝 Checklist de Implementação

### Backend/Configuração
- [ ] Atualizar interface TypeScript em `useCalculatorConfig.ts`
- [ ] Atualizar API route com valores padrão
- [ ] Criar migration SQL com dados iniciais
- [ ] Testar salvamento/carregamento de configurações

### Painel Administrativo
- [ ] Criar componente de configuração de tipos de empresa
- [ ] Adicionar formulários para edição de impostos
- [ ] Implementar cálculo automático de totais
- [ ] Adicionar validações de formulário
- [ ] Testar interface de edição

### Calculadora
- [ ] Adicionar campo de seleção de tipo de empresa
- [ ] Adicionar campo de seleção de ano
- [ ] Atualizar lógica de cálculo de impostos
- [ ] Atualizar exibição de resultados com breakdown
- [ ] Testar todas as combinações possíveis

### Documentação
- [ ] Documentar estrutura de dados
- [ ] Documentar como adicionar novos tipos de empresa
- [ ] Criar guia de uso do painel admin

---

## 🎨 Estrutura de Interface

### Calculadora - Formulário
```
┌─────────────────────────────────────┐
│ Informações Básicas                 │
├─────────────────────────────────────┤
│ Faturamento Anual: [_______]       │
│ País: [Brasil ▼]                   │
│ Tipo de Empresa: [Indústria ▼]    │ ← NOVO
│ Regime Tributário: [Presumido ▼]   │
│ Ano Fiscal: [2026 ▼]               │ ← NOVO
│ Tipo de Negócio: [Consultoria ▼]  │
└─────────────────────────────────────┘
```

### Calculadora - Resultados
```
┌─────────────────────────────────────┐
│ Detalhamento Brasil                │
├─────────────────────────────────────┤
│ Impostos Federais:                 │
│   PIS:        1.65%  $XXX          │
│   COFINS:     7.60%  $XXX          │
│   IRPJ:      15.00%  $XXX          │
│   CSLL:       9.00%  $XXX          │
│   Subtotal:  33.25%  $XXX          │
│                                     │
│ Impostos Estaduais:                 │
│   ICMS:      18.00%  $XXX          │
│                                     │
│ Impostos Municipais:                │
│   ISS:        5.00%  $XXX          │
│                                     │
│ Total de Impostos:        $XXX     │
└─────────────────────────────────────┘
```

### Painel Admin - Configuração
```
┌─────────────────────────────────────┐
│ Tipos de Empresa                    │
├─────────────────────────────────────┤
│ [Indústria] [Serviços] [Comércio]  │
│                                     │
│ Indústria - Lucro Presumido        │
│ Ano: [2026 ▼]                      │
│                                     │
│ Federal:                            │
│   PIS:      [1.65]%                │
│   COFINS:   [7.60]%                │
│   IRPJ:    [15.00]%                │
│   CSLL:     [9.00]%                │
│   Total:   [33.25]% (auto)         │
│                                     │
│ Estadual:                           │
│   ICMS:    [18.00]%                │
│                                     │
│ Municipal:                          │
│   ISS:      [0.00]%                │
│                                     │
│ Total Geral: [23.39]% (auto)       │
└─────────────────────────────────────┘
```

---

## 🔄 Fluxo de Dados

1. **Admin configura** → Salva em `system_config` (JSON)
2. **Calculadora carrega** → Busca de `system_config` via API
3. **Usuário seleciona** → Tipo + Regime + Ano
4. **Sistema calcula** → Aplica percentuais configurados
5. **Resultado exibido** → Breakdown detalhado dos impostos

---

## ⚠️ Considerações Importantes

1. **Compatibilidade**: Manter compatibilidade com configurações existentes
2. **Valores Padrão**: Garantir valores padrão caso configuração não exista
3. **Validação**: Validar que percentuais não excedam 100%
4. **Anos Futuros**: Estrutura deve permitir adicionar novos anos facilmente
5. **Regime Real**: Valores fixos (33.25%) não mudam por tipo/ano

---

## 📊 Dados de Referência

### Lucro Presumido - 2026
- **Indústria/Comércio**: 5.39% + 18% = 23.39%
- **Serviços**: 11.39% + 5% = 16.39%

### Lucro Presumido - 2027-2028
- **Indústria/Comércio**: 5.39% + 18% + 5% = 28.39%
- **Serviços**: 11.39% + 5% + 18% = 34.39%

### Lucro Real (Todos os tipos)
- **Fixo**: PIS 1.65% + COFINS 7.6% + IRPJ 15% + CSLL 9% = 33.25%

---

## 🚀 Próximos Passos

1. Revisar e aprovar este plano
2. Implementar Fase 1 (Schema e Configurações)
3. Implementar Fase 2 (Painel Admin)
4. Implementar Fase 3 (Calculadora)
5. Testes e validações
6. Deploy e documentação

