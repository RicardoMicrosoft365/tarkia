
// Configurações da Calculadora Tarkia
// Gerado automaticamente em 2025-07-01T08:51:26.155246
// NÃO EDITE ESTE ARQUIVO DIRETAMENTE - Use o sistema de atualização

const TARKIA_CONFIG = {
  "taxRates": {
    "last_updated": "2025-07-01T08:51:26.153929",
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
        "name": "Emirados \u00c1rabes Unidos",
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
  },
  "realEstate": {
    "last_updated": "2025-07-01T08:51:26.154182",
    "emirates": {
      "dubai": {
        "name": "Dubai",
        "average_yield": 0.07,
        "yield_range": [
          0.06,
          0.08
        ],
        "appreciation_rate": 0.08,
        "areas": {
          "dubai_marina": {
            "yield": 0.065,
            "avg_price_sqft": 1200
          },
          "business_bay": {
            "yield": 0.07,
            "avg_price_sqft": 1100
          },
          "downtown_dubai": {
            "yield": 0.055,
            "avg_price_sqft": 1500
          },
          "jvc": {
            "yield": 0.075,
            "avg_price_sqft": 800
          },
          "jlt": {
            "yield": 0.07,
            "avg_price_sqft": 900
          },
          "palm_jumeirah": {
            "yield": 0.05,
            "avg_price_sqft": 2000
          },
          "dubai_hills": {
            "yield": 0.065,
            "avg_price_sqft": 1300
          },
          "arabian_ranches": {
            "yield": 0.06,
            "avg_price_sqft": 1000
          },
          "the_springs": {
            "yield": 0.065,
            "avg_price_sqft": 950
          },
          "damac_hills": {
            "yield": 0.07,
            "avg_price_sqft": 850
          }
        }
      },
      "abu_dhabi": {
        "name": "Abu Dhabi",
        "average_yield": 0.06,
        "yield_range": [
          0.055,
          0.065
        ],
        "appreciation_rate": 0.06,
        "areas": {
          "al_reem_island": {
            "yield": 0.06,
            "avg_price_sqft": 900
          },
          "saadiyat_island": {
            "yield": 0.055,
            "avg_price_sqft": 1200
          },
          "yas_island": {
            "yield": 0.065,
            "avg_price_sqft": 800
          },
          "al_raha_beach": {
            "yield": 0.06,
            "avg_price_sqft": 850
          }
        }
      },
      "sharjah": {
        "name": "Sharjah",
        "average_yield": 0.085,
        "yield_range": [
          0.08,
          0.09
        ],
        "appreciation_rate": 0.07,
        "areas": {
          "al_majaz": {
            "yield": 0.085,
            "avg_price_sqft": 600
          },
          "al_nahda": {
            "yield": 0.09,
            "avg_price_sqft": 500
          },
          "muwaileh": {
            "yield": 0.08,
            "avg_price_sqft": 550
          }
        }
      },
      "ajman": {
        "name": "Ajman",
        "average_yield": 0.09,
        "yield_range": [
          0.085,
          0.095
        ],
        "appreciation_rate": 0.075,
        "areas": {
          "ajman_corniche": {
            "yield": 0.09,
            "avg_price_sqft": 450
          },
          "al_nuaimiya": {
            "yield": 0.095,
            "avg_price_sqft": 400
          }
        }
      },
      "ras_al_khaimah": {
        "name": "Ras Al Khaimah",
        "average_yield": 0.095,
        "yield_range": [
          0.09,
          0.1
        ],
        "appreciation_rate": 0.08,
        "areas": {
          "al_hamra": {
            "yield": 0.095,
            "avg_price_sqft": 500
          },
          "mina_al_arab": {
            "yield": 0.1,
            "avg_price_sqft": 450
          }
        }
      },
      "fujairah": {
        "name": "Fujairah",
        "average_yield": 0.085,
        "yield_range": [
          0.08,
          0.09
        ],
        "appreciation_rate": 0.07,
        "areas": {
          "fujairah_corniche": {
            "yield": 0.085,
            "avg_price_sqft": 400
          }
        }
      },
      "umm_al_quwain": {
        "name": "Umm Al Quwain",
        "average_yield": 0.095,
        "yield_range": [
          0.09,
          0.1
        ],
        "appreciation_rate": 0.075,
        "areas": {
          "uaq_marina": {
            "yield": 0.095,
            "avg_price_sqft": 350
          }
        }
      }
    }
  },
  "costOfLiving": {
    "last_updated": "2025-07-01T08:51:26.154614",
    "profiles": {
      "single_professional_economic": {
        "name": "Profissional Solteiro - Econ\u00f4mico",
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
        "name": "Casal Sem Filhos - Econ\u00f4mico",
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
        "name": "Fam\u00edlia com 1 filho - Moderado",
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
        "name": "Fam\u00edlia com 2 filhos - Econ\u00f4mico",
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
        "name": "Fam\u00edlia com 2 filhos - Moderado",
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
        "name": "Fam\u00edlia com 2 filhos - Premium",
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
        "name": "Fam\u00edlia com 3 filhos - Premium",
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
  },
  "visaCosts": {
    "last_updated": "2025-07-01T08:51:26.154828",
    "visa_types": {
      "golden_visa": {
        "name": "Golden Visa (10 anos)",
        "duration_years": 10,
        "minimum_investment_usd": 544600,
        "government_fees_aed": 10000,
        "tarkia_fees_usd": 5000,
        "family_visa_cost_usd": 1500,
        "requirements": [
          "Investimento imobili\u00e1rio m\u00ednimo AED 2M",
          "Ou dep\u00f3sito banc\u00e1rio AED 2M",
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
          "Idade m\u00ednima 55 anos",
          "Investimento imobili\u00e1rio AED 1M",
          "Ou poupan\u00e7a AED 1M",
          "Ou renda passiva AED 20k/m\u00eas"
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
          "Investimento imobili\u00e1rio m\u00ednimo AED 750k",
          "Propriedade deve ser residencial",
          "Renov\u00e1vel a cada 2 anos"
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
          "Qualifica\u00e7\u00e3o profissional espec\u00edfica",
          "Sal\u00e1rio m\u00ednimo AED 15k/m\u00eas",
          "Contrato de trabalho",
          "Aprova\u00e7\u00e3o do empregador"
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
          "Sal\u00e1rio m\u00ednimo AED 4k/m\u00eas",
          "Aprova\u00e7\u00e3o do empregador",
          "Renov\u00e1vel a cada 2 anos"
        ]
      }
    }
  },
  "businessSectors": {
    "last_updated": "2025-07-01T08:51:26.154969",
    "sectors": {
      "ecommerce": {
        "name": "E-commerce",
        "tax_complexity": "medium",
        "avg_margin": 0.25,
        "free_zone_suitable": true
      },
      "technology": {
        "name": "Tecnologia",
        "tax_complexity": "medium",
        "avg_margin": 0.35,
        "free_zone_suitable": true
      },
      "commodities": {
        "name": "Commodities",
        "tax_complexity": "high",
        "avg_margin": 0.15,
        "free_zone_suitable": true
      },
      "services": {
        "name": "Servi\u00e7os Digitais",
        "tax_complexity": "low",
        "avg_margin": 0.4,
        "free_zone_suitable": true
      },
      "consultoria": {
        "name": "Consultoria",
        "tax_complexity": "low",
        "avg_margin": 0.5,
        "free_zone_suitable": true
      },
      "trading": {
        "name": "Trading/Investimentos",
        "tax_complexity": "high",
        "avg_margin": 0.3,
        "free_zone_suitable": true
      },
      "manufatura": {
        "name": "Manufatura",
        "tax_complexity": "high",
        "avg_margin": 0.2,
        "free_zone_suitable": false
      },
      "blockchain": {
        "name": "Blockchain/Crypto/Games",
        "tax_complexity": "medium",
        "avg_margin": 0.45,
        "free_zone_suitable": true
      },
      "fintech": {
        "name": "Fintechs",
        "tax_complexity": "high",
        "avg_margin": 0.35,
        "free_zone_suitable": true
      },
      "logistics": {
        "name": "Log\u00edstica",
        "tax_complexity": "medium",
        "avg_margin": 0.18,
        "free_zone_suitable": true
      },
      "geral": {
        "name": "Geral",
        "tax_complexity": "medium",
        "avg_margin": 0.25,
        "free_zone_suitable": true
      }
    }
  },
  "exchangeRates": {
    "last_updated": "2025-07-01T08:51:26.155103",
    "base_currency": "USD",
    "rates": {
      "AED": 3.67,
      "BRL": 5.2,
      "EUR": 0.85,
      "GBP": 0.73
    },
    "auto_update": false,
    "api_source": "exchangerate-api.com"
  }
};

// Funções auxiliares
function getTaxRate(country, regime, rateKey = 'default') {
    try {
        return TARKIA_CONFIG.taxRates.countries[country].tax_regimes[regime].rates[rateKey];
    } catch (e) {
        console.error('Tax rate not found:', country, regime, rateKey);
        return 0;
    }
}

function getRealEstateYield(emirate, area = null) {
    try {
        if (area) {
            return TARKIA_CONFIG.realEstate.emirates[emirate].areas[area].yield;
        } else {
            return TARKIA_CONFIG.realEstate.emirates[emirate].average_yield;
        }
    } catch (e) {
        console.error('Real estate yield not found:', emirate, area);
        return 0.07; // Default yield
    }
}

function getCostOfLiving(profile) {
    try {
        return TARKIA_CONFIG.costOfLiving.profiles[profile];
    } catch (e) {
        console.error('Cost of living profile not found:', profile);
        return null;
    }
}

function getVisaInfo(visaType) {
    try {
        return TARKIA_CONFIG.visaCosts.visa_types[visaType];
    } catch (e) {
        console.error('Visa info not found:', visaType);
        return null;
    }
}

function convertCurrency(amount, fromCurrency, toCurrency = 'USD') {
    try {
        const rates = TARKIA_CONFIG.exchangeRates.rates;
        
        if (fromCurrency === toCurrency) return amount;
        
        if (fromCurrency === 'USD') {
            return amount * rates[toCurrency];
        } else if (toCurrency === 'USD') {
            return amount / rates[fromCurrency];
        } else {
            // Convert via USD
            const usdAmount = amount / rates[fromCurrency];
            return usdAmount * rates[toCurrency];
        }
    } catch (e) {
        console.error('Currency conversion error:', fromCurrency, toCurrency);
        return amount;
    }
}

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TARKIA_CONFIG;
}
