#!/usr/bin/env python3
"""
Sistema de Atualização de Dados - Calculadora Tarkia
Permite atualizar facilmente impostos, yields, custos e outros valores
"""

import json
import os
from datetime import datetime
from typing import Dict, List, Any

class TarkiaDataManager:
    """Gerenciador de dados da calculadora Tarkia"""
    
    def __init__(self, data_dir: str = "data"):
        self.data_dir = data_dir
        self.ensure_data_directory()
        self.load_all_data()
    
    def ensure_data_directory(self):
        """Cria diretório de dados se não existir"""
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir)
    
    def load_all_data(self):
        """Carrega todos os dados de configuração"""
        self.tax_data = self.load_or_create_file("tax_rates.json", self.get_default_tax_data())
        self.real_estate_data = self.load_or_create_file("real_estate.json", self.get_default_real_estate_data())
        self.cost_of_living = self.load_or_create_file("cost_of_living.json", self.get_default_cost_of_living())
        self.visa_data = self.load_or_create_file("visa_costs.json", self.get_default_visa_data())
        self.business_sectors = self.load_or_create_file("business_sectors.json", self.get_default_business_sectors())
        self.exchange_rates = self.load_or_create_file("exchange_rates.json", self.get_default_exchange_rates())
    
    def load_or_create_file(self, filename: str, default_data: Dict) -> Dict:
        """Carrega arquivo JSON ou cria com dados padrão"""
        filepath = os.path.join(self.data_dir, filename)
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            self.save_data_file(filename, default_data)
            return default_data
    
    def save_data_file(self, filename: str, data: Dict):
        """Salva dados em arquivo JSON"""
        filepath = os.path.join(self.data_dir, filename)
        data['last_updated'] = datetime.now().isoformat()
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    
    def get_default_tax_data(self) -> Dict:
        """Dados fiscais padrão por país"""
        return {
            "last_updated": datetime.now().isoformat(),
            "countries": {
                "brazil": {
                    "name": "Brasil",
                    "currency": "BRL",
                    "tax_regimes": {
                        "simples_nacional": {
                            "name": "Simples Nacional",
                            "rates": {
                                "0-180000": 0.06,
                                "180000-360000": 0.112,
                                "360000-720000": 0.135,
                                "720000-1800000": 0.16,
                                "1800000-3600000": 0.21,
                                "3600000+": 0.33
                            }
                        },
                        "lucro_presumido": {
                            "name": "Lucro Presumido",
                            "rates": {
                                "default": 0.1133,
                                "high_revenue": 0.32
                            }
                        }
                    },
                    "working_days_for_taxes": 149,
                    "tax_percentage_of_year": 40.8
                },
                "portugal": {
                    "name": "Portugal",
                    "currency": "EUR",
                    "tax_regimes": {
                        "irc": {
                            "name": "IRC + Derramas",
                            "rates": {
                                "base_rate": 0.21,
                                "derrama_municipal": 0.015,
                                "derrama_estadual": 0.09,
                                "effective_rate": 0.315
                            }
                        }
                    },
                    "working_days_for_taxes": 128,
                    "tax_percentage_of_year": 35.1
                },
                "uae": {
                    "name": "Emirados Árabes Unidos",
                    "currency": "AED",
                    "tax_regimes": {
                        "corporate_tax": {
                            "name": "Corporate Tax",
                            "rates": {
                                "threshold_aed": 375000,
                                "threshold_usd": 102000,
                                "rate_above_threshold": 0.09,
                                "rate_below_threshold": 0.0
                            }
                        },
                        "free_zones": {
                            "name": "Free Zones",
                            "rates": {
                                "corporate_tax": 0.0,
                                "income_tax": 0.0,
                                "vat": 0.0
                            }
                        }
                    },
                    "working_days_for_taxes": 15,
                    "tax_percentage_of_year": 4.1
                }
            }
        }
    
    def get_default_real_estate_data(self) -> Dict:
        """Dados imobiliários padrão por emirado"""
        return {
            "last_updated": datetime.now().isoformat(),
            "emirates": {
                "dubai": {
                    "name": "Dubai",
                    "average_yield": 0.07,
                    "yield_range": [0.06, 0.08],
                    "appreciation_rate": 0.08,
                    "areas": {
                        "dubai_marina": {"yield": 0.065, "avg_price_sqft": 1200},
                        "business_bay": {"yield": 0.07, "avg_price_sqft": 1100},
                        "downtown_dubai": {"yield": 0.055, "avg_price_sqft": 1500},
                        "jvc": {"yield": 0.075, "avg_price_sqft": 800},
                        "jlt": {"yield": 0.07, "avg_price_sqft": 900},
                        "palm_jumeirah": {"yield": 0.05, "avg_price_sqft": 2000},
                        "dubai_hills": {"yield": 0.065, "avg_price_sqft": 1300},
                        "arabian_ranches": {"yield": 0.06, "avg_price_sqft": 1000},
                        "the_springs": {"yield": 0.065, "avg_price_sqft": 950},
                        "damac_hills": {"yield": 0.07, "avg_price_sqft": 850}
                    }
                },
                "abu_dhabi": {
                    "name": "Abu Dhabi",
                    "average_yield": 0.06,
                    "yield_range": [0.055, 0.065],
                    "appreciation_rate": 0.06,
                    "areas": {
                        "al_reem_island": {"yield": 0.06, "avg_price_sqft": 900},
                        "saadiyat_island": {"yield": 0.055, "avg_price_sqft": 1200},
                        "yas_island": {"yield": 0.065, "avg_price_sqft": 800},
                        "al_raha_beach": {"yield": 0.06, "avg_price_sqft": 850}
                    }
                },
                "sharjah": {
                    "name": "Sharjah",
                    "average_yield": 0.085,
                    "yield_range": [0.08, 0.09],
                    "appreciation_rate": 0.07,
                    "areas": {
                        "al_majaz": {"yield": 0.085, "avg_price_sqft": 600},
                        "al_nahda": {"yield": 0.09, "avg_price_sqft": 500},
                        "muwaileh": {"yield": 0.08, "avg_price_sqft": 550}
                    }
                },
                "ajman": {
                    "name": "Ajman",
                    "average_yield": 0.09,
                    "yield_range": [0.085, 0.095],
                    "appreciation_rate": 0.075,
                    "areas": {
                        "ajman_corniche": {"yield": 0.09, "avg_price_sqft": 450},
                        "al_nuaimiya": {"yield": 0.095, "avg_price_sqft": 400}
                    }
                },
                "ras_al_khaimah": {
                    "name": "Ras Al Khaimah",
                    "average_yield": 0.095,
                    "yield_range": [0.09, 0.10],
                    "appreciation_rate": 0.08,
                    "areas": {
                        "al_hamra": {"yield": 0.095, "avg_price_sqft": 500},
                        "mina_al_arab": {"yield": 0.10, "avg_price_sqft": 450}
                    }
                },
                "fujairah": {
                    "name": "Fujairah",
                    "average_yield": 0.085,
                    "yield_range": [0.08, 0.09],
                    "appreciation_rate": 0.07,
                    "areas": {
                        "fujairah_corniche": {"yield": 0.085, "avg_price_sqft": 400}
                    }
                },
                "umm_al_quwain": {
                    "name": "Umm Al Quwain",
                    "average_yield": 0.095,
                    "yield_range": [0.09, 0.10],
                    "appreciation_rate": 0.075,
                    "areas": {
                        "uaq_marina": {"yield": 0.095, "avg_price_sqft": 350}
                    }
                }
            }
        }
    
    def get_default_cost_of_living(self) -> Dict:
        """Dados de custo de vida padrão por perfil"""
        return {
            "last_updated": datetime.now().isoformat(),
            "profiles": {
                "single_professional_economic": {
                    "name": "Profissional Solteiro - Econômico",
                    "monthly_cost_usd": 4222,
                    "breakdown": {
                        "housing": 2000,
                        "utilities": 200,
                        "transport": 300,
                        "food": 600,
                        "healthcare": 150,
                        "lifestyle": 972
                    }
                },
                "single_professional_premium": {
                    "name": "Profissional Solteiro - Premium",
                    "monthly_cost_usd": 8500,
                    "breakdown": {
                        "housing": 4500,
                        "utilities": 300,
                        "transport": 800,
                        "food": 1200,
                        "healthcare": 300,
                        "lifestyle": 1400
                    }
                },
                "couple_no_kids_economic": {
                    "name": "Casal Sem Filhos - Econômico",
                    "monthly_cost_usd": 6800,
                    "breakdown": {
                        "housing": 3000,
                        "utilities": 250,
                        "transport": 500,
                        "food": 1000,
                        "healthcare": 250,
                        "lifestyle": 1800
                    }
                },
                "couple_no_kids_moderate": {
                    "name": "Casal Sem Filhos - Moderado",
                    "monthly_cost_usd": 10500,
                    "breakdown": {
                        "housing": 4500,
                        "utilities": 300,
                        "transport": 800,
                        "food": 1500,
                        "healthcare": 400,
                        "lifestyle": 3000
                    }
                },
                "couple_no_kids_premium": {
                    "name": "Casal Sem Filhos - Premium",
                    "monthly_cost_usd": 16800,
                    "breakdown": {
                        "housing": 8000,
                        "utilities": 400,
                        "transport": 1500,
                        "food": 2500,
                        "healthcare": 600,
                        "lifestyle": 3800
                    }
                },
                "family_1_child_moderate": {
                    "name": "Família com 1 filho - Moderado",
                    "monthly_cost_usd": 14200,
                    "breakdown": {
                        "housing": 5500,
                        "utilities": 350,
                        "transport": 800,
                        "food": 1800,
                        "education": 2500,
                        "healthcare": 500,
                        "lifestyle": 2750
                    }
                },
                "family_2_kids_economic": {
                    "name": "Família com 2 filhos - Econômico",
                    "monthly_cost_usd": 15800,
                    "breakdown": {
                        "housing": 6000,
                        "utilities": 400,
                        "transport": 800,
                        "food": 2000,
                        "education": 4000,
                        "healthcare": 600,
                        "lifestyle": 2000
                    }
                },
                "family_2_kids_moderate": {
                    "name": "Família com 2 filhos - Moderado",
                    "monthly_cost_usd": 22500,
                    "breakdown": {
                        "housing": 8000,
                        "utilities": 450,
                        "transport": 1000,
                        "food": 2500,
                        "education": 6000,
                        "healthcare": 800,
                        "lifestyle": 3750
                    }
                },
                "family_2_kids_premium": {
                    "name": "Família com 2 filhos - Premium",
                    "monthly_cost_usd": 32000,
                    "breakdown": {
                        "housing": 12000,
                        "utilities": 500,
                        "transport": 2000,
                        "food": 3500,
                        "education": 8000,
                        "healthcare": 1000,
                        "lifestyle": 5000
                    }
                },
                "family_3_kids_premium": {
                    "name": "Família com 3 filhos - Premium",
                    "monthly_cost_usd": 37842,
                    "breakdown": {
                        "housing": 15000,
                        "utilities": 600,
                        "transport": 2500,
                        "food": 4000,
                        "education": 10000,
                        "healthcare": 1200,
                        "lifestyle": 4542
                    }
                }
            }
        }
    
    def get_default_visa_data(self) -> Dict:
        """Dados de vistos padrão"""
        return {
            "last_updated": datetime.now().isoformat(),
            "visa_types": {
                "golden_visa": {
                    "name": "Golden Visa (10 anos)",
                    "duration_years": 10,
                    "minimum_investment_usd": 544600,
                    "government_fees_aed": 10000,
                    "tarkia_fees_usd": 5000,
                    "family_visa_cost_usd": 1500,
                    "requirements": [
                        "Investimento imobiliário mínimo AED 2M",
                        "Ou depósito bancário AED 2M",
                        "Ou empresa com capital AED 2M"
                    ]
                },
                "retirement_visa": {
                    "name": "Retirement Visa (5 anos)",
                    "duration_years": 5,
                    "minimum_investment_usd": 272300,
                    "government_fees_aed": 5000,
                    "tarkia_fees_usd": 3000,
                    "family_visa_cost_usd": 1200,
                    "requirements": [
                        "Idade mínima 55 anos",
                        "Investimento imobiliário AED 1M",
                        "Ou poupança AED 1M",
                        "Ou renda passiva AED 20k/mês"
                    ]
                },
                "property_investor": {
                    "name": "Property Investor (2 anos)",
                    "duration_years": 2,
                    "minimum_investment_usd": 204225,
                    "government_fees_aed": 3000,
                    "tarkia_fees_usd": 2500,
                    "family_visa_cost_usd": 1000,
                    "requirements": [
                        "Investimento imobiliário mínimo AED 750k",
                        "Propriedade deve ser residencial",
                        "Renovável a cada 2 anos"
                    ]
                },
                "green_visa": {
                    "name": "Green Visa (5 anos)",
                    "duration_years": 5,
                    "minimum_investment_usd": 0,
                    "government_fees_aed": 4000,
                    "tarkia_fees_usd": 2000,
                    "family_visa_cost_usd": 800,
                    "requirements": [
                        "Qualificação profissional específica",
                        "Salário mínimo AED 15k/mês",
                        "Contrato de trabalho",
                        "Aprovação do empregador"
                    ]
                },
                "employee_visa": {
                    "name": "Employee Visa (2 anos)",
                    "duration_years": 2,
                    "minimum_investment_usd": 0,
                    "government_fees_aed": 2000,
                    "tarkia_fees_usd": 1500,
                    "family_visa_cost_usd": 600,
                    "requirements": [
                        "Contrato de trabalho",
                        "Salário mínimo AED 4k/mês",
                        "Aprovação do empregador",
                        "Renovável a cada 2 anos"
                    ]
                }
            }
        }
    
    def get_default_business_sectors(self) -> Dict:
        """Setores empresariais padrão"""
        return {
            "last_updated": datetime.now().isoformat(),
            "sectors": {
                "ecommerce": {
                    "name": "E-commerce",
                    "tax_complexity": "medium",
                    "avg_margin": 0.25,
                    "free_zone_suitable": True
                },
                "technology": {
                    "name": "Tecnologia",
                    "tax_complexity": "medium",
                    "avg_margin": 0.35,
                    "free_zone_suitable": True
                },
                "commodities": {
                    "name": "Commodities",
                    "tax_complexity": "high",
                    "avg_margin": 0.15,
                    "free_zone_suitable": True
                },
                "services": {
                    "name": "Serviços Digitais",
                    "tax_complexity": "low",
                    "avg_margin": 0.40,
                    "free_zone_suitable": True
                },
                "consultoria": {
                    "name": "Consultoria",
                    "tax_complexity": "low",
                    "avg_margin": 0.50,
                    "free_zone_suitable": True
                },
                "trading": {
                    "name": "Trading/Investimentos",
                    "tax_complexity": "high",
                    "avg_margin": 0.30,
                    "free_zone_suitable": True
                },
                "manufatura": {
                    "name": "Manufatura",
                    "tax_complexity": "high",
                    "avg_margin": 0.20,
                    "free_zone_suitable": False
                },
                "blockchain": {
                    "name": "Blockchain/Crypto/Games",
                    "tax_complexity": "medium",
                    "avg_margin": 0.45,
                    "free_zone_suitable": True
                },
                "fintech": {
                    "name": "Fintechs",
                    "tax_complexity": "high",
                    "avg_margin": 0.35,
                    "free_zone_suitable": True
                },
                "logistics": {
                    "name": "Logística",
                    "tax_complexity": "medium",
                    "avg_margin": 0.18,
                    "free_zone_suitable": True
                },
                "geral": {
                    "name": "Geral",
                    "tax_complexity": "medium",
                    "avg_margin": 0.25,
                    "free_zone_suitable": True
                }
            }
        }
    
    def get_default_exchange_rates(self) -> Dict:
        """Taxas de câmbio padrão"""
        return {
            "last_updated": datetime.now().isoformat(),
            "base_currency": "USD",
            "rates": {
                "AED": 3.67,
                "BRL": 5.20,
                "EUR": 0.85,
                "GBP": 0.73
            },
            "auto_update": False,
            "api_source": "exchangerate-api.com"
        }
    
    # Métodos de atualização
    def update_tax_rate(self, country: str, regime: str, rate_key: str, new_rate: float):
        """Atualiza taxa de imposto específica"""
        if country in self.tax_data["countries"]:
            if regime in self.tax_data["countries"][country]["tax_regimes"]:
                self.tax_data["countries"][country]["tax_regimes"][regime]["rates"][rate_key] = new_rate
                self.save_data_file("tax_rates.json", self.tax_data)
                return True
        return False
    
    def update_real_estate_yield(self, emirate: str, area: str, new_yield: float):
        """Atualiza yield imobiliário específico"""
        if emirate in self.real_estate_data["emirates"]:
            if area in self.real_estate_data["emirates"][emirate]["areas"]:
                self.real_estate_data["emirates"][emirate]["areas"][area]["yield"] = new_yield
                self.save_data_file("real_estate.json", self.real_estate_data)
                return True
        return False
    
    def update_cost_of_living(self, profile: str, category: str, new_cost: float):
        """Atualiza custo de vida específico"""
        if profile in self.cost_of_living["profiles"]:
            if category in self.cost_of_living["profiles"][profile]["breakdown"]:
                self.cost_of_living["profiles"][profile]["breakdown"][category] = new_cost
                # Recalcula total
                total = sum(self.cost_of_living["profiles"][profile]["breakdown"].values())
                self.cost_of_living["profiles"][profile]["monthly_cost_usd"] = total
                self.save_data_file("cost_of_living.json", self.cost_of_living)
                return True
        return False
    
    def update_visa_cost(self, visa_type: str, cost_type: str, new_cost: float):
        """Atualiza custo de visto específico"""
        if visa_type in self.visa_data["visa_types"]:
            if cost_type in self.visa_data["visa_types"][visa_type]:
                self.visa_data["visa_types"][visa_type][cost_type] = new_cost
                self.save_data_file("visa_costs.json", self.visa_data)
                return True
        return False
    
    def update_exchange_rate(self, currency: str, new_rate: float):
        """Atualiza taxa de câmbio"""
        self.exchange_rates["rates"][currency] = new_rate
        self.save_data_file("exchange_rates.json", self.exchange_rates)
        return True
    
    # Métodos de consulta
    def get_tax_rate(self, country: str, regime: str, rate_key: str = "default"):
        """Obtém taxa de imposto específica"""
        try:
            return self.tax_data["countries"][country]["tax_regimes"][regime]["rates"][rate_key]
        except KeyError:
            return None
    
    def get_real_estate_yield(self, emirate: str, area: str = None):
        """Obtém yield imobiliário"""
        try:
            if area:
                return self.real_estate_data["emirates"][emirate]["areas"][area]["yield"]
            else:
                return self.real_estate_data["emirates"][emirate]["average_yield"]
        except KeyError:
            return None
    
    def get_cost_of_living(self, profile: str):
        """Obtém custo de vida por perfil"""
        return self.cost_of_living["profiles"].get(profile)
    
    def get_visa_info(self, visa_type: str):
        """Obtém informações de visto"""
        return self.visa_data["visa_types"].get(visa_type)
    
    def convert_currency(self, amount: float, from_currency: str, to_currency: str = "USD"):
        """Converte moeda"""
        if from_currency == to_currency:
            return amount
        
        if from_currency == "USD":
            return amount * self.exchange_rates["rates"][to_currency]
        elif to_currency == "USD":
            return amount / self.exchange_rates["rates"][from_currency]
        else:
            # Converte via USD
            usd_amount = amount / self.exchange_rates["rates"][from_currency]
            return usd_amount * self.exchange_rates["rates"][to_currency]
    
    def generate_javascript_config(self):
        """Gera arquivo JavaScript com configurações para a calculadora"""
        js_config = {
            "taxRates": self.tax_data,
            "realEstate": self.real_estate_data,
            "costOfLiving": self.cost_of_living,
            "visaCosts": self.visa_data,
            "businessSectors": self.business_sectors,
            "exchangeRates": self.exchange_rates
        }
        
        js_content = f"""
// Configurações da Calculadora Tarkia
// Gerado automaticamente em {datetime.now().isoformat()}
// NÃO EDITE ESTE ARQUIVO DIRETAMENTE - Use o sistema de atualização

const TARKIA_CONFIG = {json.dumps(js_config, indent=2)};

// Funções auxiliares
function getTaxRate(country, regime, rateKey = 'default') {{
    try {{
        return TARKIA_CONFIG.taxRates.countries[country].tax_regimes[regime].rates[rateKey];
    }} catch (e) {{
        console.error('Tax rate not found:', country, regime, rateKey);
        return 0;
    }}
}}

function getRealEstateYield(emirate, area = null) {{
    try {{
        if (area) {{
            return TARKIA_CONFIG.realEstate.emirates[emirate].areas[area].yield;
        }} else {{
            return TARKIA_CONFIG.realEstate.emirates[emirate].average_yield;
        }}
    }} catch (e) {{
        console.error('Real estate yield not found:', emirate, area);
        return 0.07; // Default yield
    }}
}}

function getCostOfLiving(profile) {{
    try {{
        return TARKIA_CONFIG.costOfLiving.profiles[profile];
    }} catch (e) {{
        console.error('Cost of living profile not found:', profile);
        return null;
    }}
}}

function getVisaInfo(visaType) {{
    try {{
        return TARKIA_CONFIG.visaCosts.visa_types[visaType];
    }} catch (e) {{
        console.error('Visa info not found:', visaType);
        return null;
    }}
}}

function convertCurrency(amount, fromCurrency, toCurrency = 'USD') {{
    try {{
        const rates = TARKIA_CONFIG.exchangeRates.rates;
        
        if (fromCurrency === toCurrency) return amount;
        
        if (fromCurrency === 'USD') {{
            return amount * rates[toCurrency];
        }} else if (toCurrency === 'USD') {{
            return amount / rates[fromCurrency];
        }} else {{
            // Convert via USD
            const usdAmount = amount / rates[fromCurrency];
            return usdAmount * rates[toCurrency];
        }}
    }} catch (e) {{
        console.error('Currency conversion error:', fromCurrency, toCurrency);
        return amount;
    }}
}}

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {{
    module.exports = TARKIA_CONFIG;
}}
"""
        
        with open("tarkia_config.js", "w", encoding="utf-8") as f:
            f.write(js_content)
        
        return js_content

if __name__ == "__main__":
    # Exemplo de uso
    manager = TarkiaDataManager()
    
    print("Sistema de Atualização de Dados - Calculadora Tarkia")
    print("=" * 50)
    
    # Exemplos de consultas
    print(f"Taxa Brasil Simples Nacional (até 180k): {manager.get_tax_rate('brazil', 'simples_nacional', '0-180000')}")
    print(f"Yield Dubai Marina: {manager.get_real_estate_yield('dubai', 'dubai_marina')}")
    print(f"Custo família 2 filhos moderado: ${manager.get_cost_of_living('family_2_kids_moderate')['monthly_cost_usd']:,.2f}")
    
    # Gerar arquivo JavaScript
    manager.generate_javascript_config()
    print("\nArquivo tarkia_config.js gerado com sucesso!")
    
    print("\nPara atualizar dados, use os métodos:")
    print("- manager.update_tax_rate('brazil', 'simples_nacional', '0-180000', 0.065)")
    print("- manager.update_real_estate_yield('dubai', 'dubai_marina', 0.068)")
    print("- manager.update_cost_of_living('family_2_kids_moderate', 'housing', 8500)")
    print("- manager.update_visa_cost('golden_visa', 'tarkia_fees_usd', 5500)")
    print("- manager.update_exchange_rate('BRL', 5.25)")

