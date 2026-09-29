export interface TaxCalculationResult {
  jurisdiction: string;
  ratePercent: number;
  taxAmount: number;
  vatIncluded: boolean;
  dutiesAmount: number;
}

export const COUNTRY_TAX_RATES: Record<string, { name: string; rate: number; vatIncluded: boolean; duties: number }> = {
  US: { name: 'US State Sales Tax (Combined Avg)', rate: 8.25, vatIncluded: false, duties: 0 },
  FR: { name: 'French TVA (Haute Couture Luxury)', rate: 20.0, vatIncluded: true, duties: 0 },
  IT: { name: 'Italian IVA (Milano Luxury Standard)', rate: 22.0, vatIncluded: true, duties: 0 },
  GB: { name: 'UK HM Revenue & Customs VAT', rate: 20.0, vatIncluded: true, duties: 12 },
  DE: { name: 'German MwSt (Einfuhrumsatzsteuer)', rate: 19.0, vatIncluded: true, duties: 0 },
  JP: { name: 'Japan Consumption Tax (消費税)', rate: 10.0, vatIncluded: true, duties: 8 },
  AE: { name: 'UAE Federal Tax Authority (FTA)', rate: 5.0, vatIncluded: false, duties: 5 },
  CH: { name: 'Swiss Federal Tax Administration (ESTV)', rate: 8.1, vatIncluded: true, duties: 0 },
  CA: { name: 'Canada HST / GST Harmonized Rate', rate: 13.0, vatIncluded: false, duties: 15 },
  AU: { name: 'Australia GST (ATO Standard)', rate: 10.0, vatIncluded: true, duties: 10 },
};

export function calculateAutomatedTax(countryCode: string, subtotal: number): TaxCalculationResult {
  const rule = COUNTRY_TAX_RATES[countryCode] || { name: 'Standard International Duty & Tax', rate: 10.0, vatIncluded: false, duties: 10 };
  const taxAmount = (subtotal * rule.rate) / 100;
  const dutiesAmount = (subtotal * rule.duties) / 100;

  return {
    jurisdiction: rule.name,
    ratePercent: rule.rate,
    taxAmount: Math.round(taxAmount * 100) / 100,
    vatIncluded: rule.vatIncluded,
    dutiesAmount: Math.round(dutiesAmount * 100) / 100,
  };
}
