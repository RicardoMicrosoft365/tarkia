// Tipos baseados na estrutura do banco Supabase
export interface Country {
  id: string
  name: string
  code: string
  currency: string
  workingDaysForTaxes: number
  taxPercentageOfYear: number
  createdAt: string
  updatedAt: string
}

export interface TaxRegime {
  id: string
  name: string
  countryId: string
  description: string
  baseRate: number
  createdAt: string
  updatedAt: string
}

export interface TaxBracket {
  id: string
  taxRegimeId: string
  minIncome: number
  maxIncome: number
  rate: number
  createdAt: string
  updatedAt: string
}

export interface Emirate {
  id: string
  name: string
  code: string
  averageYield: number
  appreciationRate: number
  createdAt: string
  updatedAt: string
}

export interface RealEstateArea {
  id: string
  name: string
  emirateId: string
  yield: number
  avgPriceSqft: number
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface FreeZone {
  id: string
  name: string
  code: string
  emirate: string
  annualCost: number
  setupCost: number
  description: string
  benefits: string
  sectors: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface BusinessSector {
  id: string
  name: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CostOfLivingProfile {
  id: string
  name: string
  description: string
  data: string
  countryCode: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  whatsapp: string
  source: string
  status: string
  notes: string
  createdAt: string
  updatedAt: string
}

export interface Calculation {
  id: string
  leadId: string
  countryId: string
  freeZoneId: string
  businessSectorId: string
  calculationType: string
  annualRevenue: number
  investmentAmount: number
  results: string
  createdAt: string
  updatedAt: string
}

export interface ExchangeRate {
  id: string
  fromCurrency: string
  toCurrency: string
  rate: number
  date: string
  createdAt: string
  updatedAt: string
}

export interface SystemConfig {
  id: string
  key: string
  value: string
  type: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Tipos para inserção (omitindo campos automáticos)
export type CountryInsert = Omit<Country, 'id' | 'createdAt' | 'updatedAt'>
export type TaxRegimeInsert = Omit<TaxRegime, 'id' | 'createdAt' | 'updatedAt'>
export type TaxBracketInsert = Omit<TaxBracket, 'id' | 'createdAt' | 'updatedAt'>
export type EmirateInsert = Omit<Emirate, 'id' | 'createdAt' | 'updatedAt'>
export type RealEstateAreaInsert = Omit<RealEstateArea, 'id' | 'createdAt' | 'updatedAt'>
export type FreeZoneInsert = Omit<FreeZone, 'id' | 'createdAt' | 'updatedAt'>
export type BusinessSectorInsert = Omit<BusinessSector, 'id' | 'createdAt' | 'updatedAt'>
export type CostOfLivingProfileInsert = Omit<CostOfLivingProfile, 'id' | 'createdAt' | 'updatedAt'>
export type LeadInsert = Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>
export type CalculationInsert = Omit<Calculation, 'id' | 'createdAt' | 'updatedAt'>
export type ExchangeRateInsert = Omit<ExchangeRate, 'id' | 'createdAt' | 'updatedAt'>
export type SystemConfigInsert = Omit<SystemConfig, 'id' | 'createdAt' | 'updatedAt'>
