-- Schema essencial para o Supabase - Tarkia Calculator
-- Execute este SQL no Supabase SQL Editor

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de configurações do sistema (ESSENCIAL para o painel administrativo)
CREATE TABLE IF NOT EXISTS system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de leads
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    source VARCHAR(100) DEFAULT 'website',
    status VARCHAR(50) DEFAULT 'new',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configuração inicial das calculadoras
INSERT INTO system_config (key, value, description) VALUES
('calculator_config', '{
  "business": {
    "taxRegimes": {
      "simples": {
        "name": "Simples Nacional",
        "rate": 0.06,
        "description": "Regime simplificado para pequenas empresas"
      },
      "presumido": {
        "name": "Lucro Presumido",
        "rate": 0.15,
        "description": "Regime para empresas de médio porte"
      },
      "real": {
        "name": "Lucro Real",
        "rate": 0.25,
        "description": "Regime para grandes empresas"
      }
    },
    "companyTypes": {
      "unipessoal": {
        "name": "Sociedade Unipessoal por Quotas",
        "description": "Empresa com um único sócio",
        "setupCost": 360,
        "accountingCost": 100
      },
      "quotas": {
        "name": "Sociedade por Quotas",
        "description": "Empresa com múltiplos sócios",
        "setupCost": 360,
        "accountingCost": 120
      }
    },
    "freeZones": {
      "DIFC": {
        "name": "DIFC",
        "annualCost": 15000,
        "setupCost": 25000,
        "visaCost": 3000,
        "description": "Centro financeiro"
      },
      "DMCC": {
        "name": "DMCC",
        "annualCost": 12000,
        "setupCost": 20000,
        "visaCost": 2500,
        "description": "Commodities"
      },
      "ADGM": {
        "name": "ADGM",
        "annualCost": 18000,
        "setupCost": 30000,
        "visaCost": 3500,
        "description": "Abu Dhabi"
      }
    },
    "uaeTax": {
      "threshold": 102000,
      "rate": 0.09
    }
  },
  "visa": {
    "types": {
      "golden": {
        "name": "Golden Visa",
        "description": "Investimento imobiliário",
        "minInvestment": 544600,
        "validity": 10,
        "processingTime": 30
      },
      "retirement": {
        "name": "Retirement Visa",
        "description": "Aposentadoria",
        "minInvestment": 272300,
        "validity": 5,
        "processingTime": 45
      }
    },
    "costs": {
      "golden": {
        "visa": 2859,
        "medical": 320,
        "emiratesId": 370,
        "documents": 2668
      },
      "retirement": {
        "visa": 545,
        "medical": 320,
        "emiratesId": 370,
        "documents": 1500
      }
    }
  }
}', 'Configurações das calculadoras')
ON CONFLICT (key) DO NOTHING;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_system_config_key ON system_config(key);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_system_config_updated_at BEFORE UPDATE ON system_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
