-- =====================================================
-- SCHEMA COMPLETO PARA TARKIA CALCULATOR - SUPABASE
-- =====================================================

-- 1. TABELA COUNTRIES (Países)
CREATE TABLE IF NOT EXISTS public.countries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    currency TEXT NOT NULL,
    "workingDaysForTaxes" INTEGER NOT NULL DEFAULT 365,
    "taxPercentageOfYear" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABELA TAX_REGIMES (Regimes Tributários)
CREATE TABLE IF NOT EXISTS public.tax_regimes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    "countryId" UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
    description TEXT,
    "baseRate" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA TAX_BRACKETS (Faixas de Imposto)
CREATE TABLE IF NOT EXISTS public.tax_brackets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "taxRegimeId" UUID NOT NULL REFERENCES public.tax_regimes(id) ON DELETE CASCADE,
    "minIncome" DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    "maxIncome" DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABELA EMIRATES (Emirados)
CREATE TABLE IF NOT EXISTS public.emirates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    "averageYield" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "appreciationRate" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABELA REAL_ESTATE_AREAS (Áreas Imobiliárias)
CREATE TABLE IF NOT EXISTS public.real_estate_areas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    "emirateId" UUID NOT NULL REFERENCES public.emirates(id) ON DELETE CASCADE,
    yield DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "avgPriceSqft" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    description TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABELA FREE_ZONES (Zonas Francas)
CREATE TABLE IF NOT EXISTS public.free_zones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    emirate TEXT NOT NULL,
    "annualCost" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "setupCost" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    description TEXT,
    benefits TEXT,
    sectors TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABELA BUSINESS_SECTORS (Setores de Negócio)
CREATE TABLE IF NOT EXISTS public.business_sectors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TABELA COST_OF_LIVING_PROFILES (Perfis de Custo de Vida)
CREATE TABLE IF NOT EXISTS public.cost_of_living_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    data TEXT, -- JSON string com dados de custo de vida
    "countryCode" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. TABELA LEADS (Leads - FORMULÁRIO)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT DEFAULT '',
    whatsapp TEXT DEFAULT '',
    source TEXT DEFAULT 'website',
    status TEXT DEFAULT 'new',
    notes TEXT DEFAULT '',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. TABELA CALCULATIONS (Cálculos Realizados)
CREATE TABLE IF NOT EXISTS public.calculations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "leadId" UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    "countryId" UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
    "freeZoneId" UUID REFERENCES public.free_zones(id) ON DELETE SET NULL,
    "businessSectorId" UUID REFERENCES public.business_sectors(id) ON DELETE SET NULL,
    "calculationType" TEXT NOT NULL, -- 'business', 'real_estate', 'visa', 'cost_of_living', 'planning'
    "annualRevenue" DECIMAL(15,2) DEFAULT 0.00,
    "investmentAmount" DECIMAL(15,2) DEFAULT 0.00,
    results TEXT, -- JSON string com resultados do cálculo
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. TABELA EXCHANGE_RATES (Taxas de Câmbio)
CREATE TABLE IF NOT EXISTS public.exchange_rates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "fromCurrency" TEXT NOT NULL,
    "toCurrency" TEXT NOT NULL,
    rate DECIMAL(10,6) NOT NULL,
    date DATE NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE("fromCurrency", "toCurrency", "date")
);

-- 12. TABELA SYSTEM_CONFIG (Configurações do Sistema)
CREATE TABLE IF NOT EXISTS public.system_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
    description TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para leads
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads("createdAt");

-- Índices para calculations
CREATE INDEX IF NOT EXISTS idx_calculations_lead_id ON public.calculations("leadId");
CREATE INDEX IF NOT EXISTS idx_calculations_type ON public.calculations("calculationType");
CREATE INDEX IF NOT EXISTS idx_calculations_created_at ON public.calculations("createdAt");

-- Índices para tax_brackets
CREATE INDEX IF NOT EXISTS idx_tax_brackets_regime_id ON public.tax_brackets("taxRegimeId");

-- Índices para real_estate_areas
CREATE INDEX IF NOT EXISTS idx_real_estate_areas_emirate_id ON public.real_estate_areas("emirateId");

-- Índices para exchange_rates
CREATE INDEX IF NOT EXISTS idx_exchange_rates_currencies ON public.exchange_rates("fromCurrency", "toCurrency");
CREATE INDEX IF NOT EXISTS idx_exchange_rates_date ON public.exchange_rates(date);

-- =====================================================
-- RLS (ROW LEVEL SECURITY) - POLÍTICAS DE SEGURANÇA
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_regimes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_brackets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emirates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_estate_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.free_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_of_living_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir leitura pública (dados de referência)
CREATE POLICY "Permitir leitura pública de países" ON public.countries FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de regimes tributários" ON public.tax_regimes FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de faixas de imposto" ON public.tax_brackets FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de emirados" ON public.emirates FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de áreas imobiliárias" ON public.real_estate_areas FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de zonas francas" ON public.free_zones FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de setores de negócio" ON public.business_sectors FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de perfis de custo de vida" ON public.cost_of_living_profiles FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de taxas de câmbio" ON public.exchange_rates FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de configurações" ON public.system_config FOR SELECT USING (true);

-- Políticas para leads (inserção pública, leitura restrita)
CREATE POLICY "Permitir inserção de leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir leitura de leads para admins" ON public.leads FOR SELECT USING (auth.role() = 'service_role');

-- Políticas para calculations (inserção pública, leitura restrita)
CREATE POLICY "Permitir inserção de cálculos" ON public.calculations FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir leitura de cálculos para admins" ON public.calculations FOR SELECT USING (auth.role() = 'service_role');

-- =====================================================
-- TRIGGERS PARA UPDATED_AT
-- =====================================================

-- Função para atualizar updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para todas as tabelas
CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON public.countries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tax_regimes_updated_at BEFORE UPDATE ON public.tax_regimes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tax_brackets_updated_at BEFORE UPDATE ON public.tax_brackets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emirates_updated_at BEFORE UPDATE ON public.emirates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_real_estate_areas_updated_at BEFORE UPDATE ON public.real_estate_areas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_free_zones_updated_at BEFORE UPDATE ON public.free_zones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_sectors_updated_at BEFORE UPDATE ON public.business_sectors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cost_of_living_profiles_updated_at BEFORE UPDATE ON public.cost_of_living_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calculations_updated_at BEFORE UPDATE ON public.calculations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exchange_rates_updated_at BEFORE UPDATE ON public.exchange_rates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_config_updated_at BEFORE UPDATE ON public.system_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DADOS INICIAIS (SEED DATA)
-- =====================================================

-- Inserir países básicos
INSERT INTO public.countries (name, code, currency, "workingDaysForTaxes", "taxPercentageOfYear") VALUES
('Emirados Árabes Unidos', 'AE', 'AED', 365, 0.00),
('Brasil', 'BR', 'BRL', 365, 25.00),
('Estados Unidos', 'US', 'USD', 365, 30.00),
('Reino Unido', 'GB', 'GBP', 365, 20.00)
ON CONFLICT (code) DO NOTHING;

-- Inserir emirados
INSERT INTO public.emirates (name, code, "averageYield", "appreciationRate") VALUES
('Dubai', 'DXB', 6.50, 4.20),
('Abu Dhabi', 'AUH', 5.80, 3.80),
('Sharjah', 'SHJ', 7.20, 5.10),
('Ajman', 'AJM', 8.00, 6.50)
ON CONFLICT (code) DO NOTHING;

-- Inserir zonas francas básicas
INSERT INTO public.free_zones (name, code, emirate, "annualCost", "setupCost", description, benefits, sectors, "isActive") VALUES
('Dubai Multi Commodities Centre', 'DMCC', 'Dubai', 15000.00, 5000.00, 'Centro de commodities e metais preciosos', '100% propriedade estrangeira, isenção fiscal', 'Trading, Commodities, Metais', true),
('Dubai International Financial Centre', 'DIFC', 'Dubai', 25000.00, 10000.00, 'Centro financeiro internacional', 'Regulamentação financeira, isenção fiscal', 'Serviços Financeiros, Consultoria', true),
('Abu Dhabi Global Market', 'ADGM', 'Abu Dhabi', 20000.00, 8000.00, 'Mercado global de Abu Dhabi', 'Regulamentação moderna, isenção fiscal', 'Serviços Financeiros, Tecnologia', true)
ON CONFLICT (code) DO NOTHING;

-- Inserir setores de negócio
INSERT INTO public.business_sectors (name, description, "isActive") VALUES
('Tecnologia', 'Empresas de tecnologia e software', true),
('Comércio', 'Importação e exportação', true),
('Serviços Financeiros', 'Consultoria financeira e investimentos', true),
('Consultoria', 'Serviços de consultoria empresarial', true),
('Educação', 'Instituições educacionais', true),
('Saúde', 'Serviços de saúde e bem-estar', true)
ON CONFLICT DO NOTHING;

-- Inserir configurações do sistema
INSERT INTO public.system_config (key, value, type, description, "isActive") VALUES
('default_currency', 'AED', 'string', 'Moeda padrão do sistema', true),
('tax_year_days', '365', 'number', 'Dias úteis para cálculo de impostos', true),
('default_country', 'AE', 'string', 'País padrão para cálculos', true),
('maintenance_mode', 'false', 'boolean', 'Modo de manutenção do sistema', true)
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- COMENTÁRIOS DAS TABELAS
-- =====================================================

COMMENT ON TABLE public.countries IS 'Países suportados pelo sistema';
COMMENT ON TABLE public.tax_regimes IS 'Regimes tributários por país';
COMMENT ON TABLE public.tax_brackets IS 'Faixas de imposto por regime';
COMMENT ON TABLE public.emirates IS 'Emirados dos Emirados Árabes Unidos';
COMMENT ON TABLE public.real_estate_areas IS 'Áreas imobiliárias por emirado';
COMMENT ON TABLE public.free_zones IS 'Zonas francas disponíveis';
COMMENT ON TABLE public.business_sectors IS 'Setores de negócio suportados';
COMMENT ON TABLE public.cost_of_living_profiles IS 'Perfis de custo de vida por país';
COMMENT ON TABLE public.leads IS 'Leads capturados pelo formulário';
COMMENT ON TABLE public.calculations IS 'Cálculos realizados pelos usuários';
COMMENT ON TABLE public.exchange_rates IS 'Taxas de câmbio atualizadas';
COMMENT ON TABLE public.system_config IS 'Configurações do sistema';
